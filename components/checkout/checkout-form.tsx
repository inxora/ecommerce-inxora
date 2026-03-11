'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { User, MapPin, CreditCard, Truck, Mail, Phone, ShoppingBag, FileText, CheckCircle, AlertCircle, QrCode, Store, ChevronRight, Lock, Building2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useCart } from '@/lib/hooks/use-cart'
import { useToast } from '@/lib/hooks/use-toast'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { useCheckoutShipping } from '@/lib/contexts/checkout-shipping-context'
import { pedidosService, ApiError, type CreatePedidoBody } from '@/lib/services/pedidos.service'
import { UbigeoService, type Ciudad, type Provincia, type Distrito } from '@/lib/services/ubigeo.service'
import { UbicacionService } from '@/lib/services/ubicacion.service'
import { GoogleMapsService, type ReverseGeocodeResponse } from '@/lib/services/google-maps.service'
import { TipoLugarEntregaService, type TipoLugarEntrega } from '@/lib/services/tipo-lugar-entrega.service'
import { DeliveryAddressMap } from '@/components/checkout/delivery-address-map'
import Link from 'next/link'
import { validateCartItem } from '@/lib/cart-restrictions'
import { Product } from '@/lib/supabase'

const DEBOUNCE_MS = 350

const checkoutSchema = z
  .object({
    firstName: z.string().min(2, 'Nombre requerido'),
    lastName: z.string().min(2, 'Apellido requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Teléfono requerido'),
    tipo_entrega: z.enum(['DELIVERY', 'RECOJO']),
    idCiudad: z.number().optional(),
    idProvincia: z.number().optional(),
    idDistrito: z.number().optional(),
    idTipoLugarEntrega: z.number().optional(),
    address: z.string().optional(),
    country: z.string().optional(),
    paymentMethod: z.enum(['transfer', 'yape']),
    notes: z.string().optional(),
    acceptTerms: z.boolean().refine(val => val === true, 'Debe aceptar los términos'),
    newsletter: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo_entrega === 'DELIVERY') {
      if (!data.idCiudad || data.idCiudad < 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Seleccione departamento/región', path: ['idCiudad'] })
      if (!data.idProvincia || data.idProvincia < 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Seleccione provincia', path: ['idProvincia'] })
      if (!data.idTipoLugarEntrega || data.idTipoLugarEntrega < 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Seleccione tipo de lugar de entrega', path: ['idTipoLugarEntrega'] })
      if (!data.address || data.address.trim().length < 5) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Dirección requerida (calle, número, referencia)', path: ['address'] })
      if (!data.country || data.country.trim().length < 2) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'País requerido', path: ['country'] })
    }
  })

type CheckoutFormData = z.infer<typeof checkoutSchema>

const PAIS_DEFAULT = 'Perú'

function toAddressString(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === 'string') return value.trim() || null
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const o = value as Record<string, unknown>
    if (typeof o.formatted_address === 'string') return o.formatted_address.trim() || null
    const parts = [o.street_number, o.route, o.locality, o.administrative_area_level_2, o.administrative_area_level_1, o.country]
      .filter((p): p is string => typeof p === 'string' && p.trim() !== '')
    if (parts.length) return parts.join(', ')
  }
  return null
}

const STREET_LIKE = /^(Av\.?|Avenida|Jr\.?|Jirón|Calle|Psje|Pasaje|Mz|Lote|Lt\.?|Urb\.?|Grupo)\s/i

function parseAddressForUbigeo(addressStr: string | null): { departamento?: string; provincia?: string; distrito?: string } {
  if (!addressStr || typeof addressStr !== 'string') return {}
  const parts = addressStr.split(',').map((p) => p.trim()).filter(Boolean)
  if (parts.length < 3) return {}
  const provMatch = parts.find((p) => /^Provincia\s+de\s+/i.test(p))
  const provincia = provMatch ? provMatch.replace(/^Provincia\s+de\s+/i, '').trim() : undefined
  const idxProv = provMatch ? parts.indexOf(provMatch) : -1
  if (idxProv <= 0 || !provincia) return {}
  const departamento = parts[idxProv - 1] || undefined
  let distrito: string | undefined
  if (idxProv >= 2) {
    const prev = parts[idxProv - 2]
    const candidate = prev && prev !== departamento ? prev : (idxProv >= 3 ? parts[idxProv - 3] : undefined)
    if (candidate && candidate.length <= 40 && !STREET_LIKE.test(candidate)) distrito = candidate
  }
  return { departamento, provincia, distrito }
}

function buildAddressFromReverse(res: { departamento?: string; provincia?: string; distrito?: string; address?: unknown; direccion?: unknown }): string | null {
  const fromFields = [res.distrito, res.provincia, res.departamento].filter((s) => typeof s === 'string' && s.trim()).join(', ')
  if (fromFields) return fromFields + ', ' + PAIS_DEFAULT
  return toAddressString(res.address) ?? toAddressString(res.direccion) ?? null
}

function normalizeForMatch(s: string): string {
  return (s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim()
}

// ─── Design primitives ───────────────────────────────────────────────────────

/** Numbered step header with a clean left-border accent */
function SectionHeader({ step, icon: Icon, title, subtitle }: {
  step: number
  icon: React.ElementType
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-200 dark:shadow-orange-900/40">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-[9px] font-bold flex items-center justify-center leading-none">
          {step}
        </span>
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

/** Clean card wrapper */
function FormSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

/** Floating-label style field wrapper */
function Field({ label, error, required, children }: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}{required && <span className="text-orange-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  )
}

const inputCls = [
  'w-full h-10 px-3.5 rounded-xl text-sm',
  'bg-slate-50 dark:bg-slate-800',
  'border border-slate-200 dark:border-slate-700',
  'text-slate-900 dark:text-slate-100',
  'placeholder:text-slate-400 dark:placeholder:text-slate-500',
  'focus:outline-none focus:ring-2 focus:ring-orange-400/60 focus:border-orange-400',
  'transition-all duration-150',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

const selectCls = inputCls + ' cursor-pointer appearance-none'

const textareaCls = [
  'w-full px-3.5 py-3 rounded-xl text-sm min-h-[88px] resize-none',
  'bg-slate-50 dark:bg-slate-800',
  'border border-slate-200 dark:border-slate-700',
  'text-slate-900 dark:text-slate-100',
  'placeholder:text-slate-400 dark:placeholder:text-slate-500',
  'focus:outline-none focus:ring-2 focus:ring-orange-400/60 focus:border-orange-400',
  'transition-all duration-150',
].join(' ')

/** Campo copiable con botón de copia al portapapeles */
function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span className="flex-1 text-sm font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 truncate">
          {value}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={[
            'flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
            copied
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400',
          ].join(' ')}
          aria-label={`Copiar ${label}`}
        >
          {copied ? (
            <><CheckCircle className="w-3.5 h-3.5" /> Copiado</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copiar</>
          )}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export function CheckoutForm() {
  const pathname = usePathname()
  const locale = (pathname?.split('/')?.[1] || 'es')
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const { items, clearCart } = useCart()
  const { isLoggedIn, cliente, token } = useClienteAuth()
  const { setCheckoutShipping } = useCheckoutShipping()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [distritos, setDistritos] = useState<Distrito[]>([])
  const [tiposLugarEntrega, setTiposLugarEntrega] = useState<TipoLugarEntrega[]>([])
  const [tarifaPlana, setTarifaPlana] = useState<{ provincia_ids: number[]; costo_envio: number } | null>(null)
  const [loadingUbigeo, setLoadingUbigeo] = useState({ ciudades: false, provincias: false, distritos: false, tarifa: false, tiposLugarEntrega: false })
  const [mapLat, setMapLat] = useState<number | null>(null)
  const [mapLng, setMapLng] = useState<number | null>(null)
  const [addressFromMap, setAddressFromMap] = useState<string | null>(null)
  const [loadingMap, setLoadingMap] = useState({ geocode: false, reverse: false })
  const pendingReverseRef = useRef<{ res: ReverseGeocodeResponse; addressText: string | null } | null>(null)
  const lastReverseCoordsRef = useRef<{ lat: number; lng: number } | null>(null)
  const [errorMap, setErrorMap] = useState<string | null>(null)
  const [autocompleteQuery, setAutocompleteQuery] = useState('')
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<{ place_id: string; description: string }[]>([])
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false)
  const [ubigeoConfirmado, setUbigeoConfirmado] = useState<string | null>(null)
  const autocompleteDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      tipo_entrega: 'DELIVERY',
      idCiudad: 0,
      idProvincia: 0,
      idDistrito: undefined,
      idTipoLugarEntrega: undefined,
      address: '',
      country: PAIS_DEFAULT,
      paymentMethod: 'transfer',
      acceptTerms: false,
      newsletter: false,
    },
  })

  const idCiudad = form.watch('idCiudad')
  const idProvincia = form.watch('idProvincia')
  const idTipoLugarEntrega = form.watch('idTipoLugarEntrega')
  const tipoEntrega = form.watch('tipo_entrega')
  const cartRestrictionErrors = useMemo(
    () => items.flatMap((item) => {
      const issues = validateCartItem(item.product as Product, item.quantity)
      return issues.map((issue) => {
        const recommendation = issue.suggestedQuantity && issue.suggestedQuantity > item.quantity
          ? ` Aumenta la cantidad a ${issue.suggestedQuantity}.` : ''
        return `${item.product.nombre}: ${issue.message}${recommendation}`
      })
    }),
    [items]
  )
  const hasCartRestrictionErrors = cartRestrictionErrors.length > 0

  const applyReverseGeocodeToDropdowns = useCallback(
    async (res: ReverseGeocodeResponse, addressText?: string | null) => {
      const text = addressText ?? form.getValues('address') ?? buildAddressFromReverse(res)
      const hasIds = res.id_ciudad != null && res.id_provincia != null
      let dep = String(res.departamento ?? '').trim()
      let prov = String(res.provincia ?? '').trim().replace(/^Provincia\s+de\s+/i, '')
      let dist = String(res.distrito ?? '').trim()
      if (text) {
        const parsed = parseAddressForUbigeo(text)
        if (!dep) dep = parsed.departamento ?? ''
        if (!prov) prov = (parsed.provincia ?? '').replace(/^Provincia\s+de\s+/i, '')
        if (!dist) dist = parsed.distrito ?? ''
      }
      const hasNames = Boolean(dep || prov || dist)

      if (hasNames && dep && prov) {
        try {
          const ubicacion = await UbicacionService.buscarUbicacion({
            departamento_texto: dep,
            provincia_texto: prov,
            distrito_texto: dist || '',
          })
          if (ubicacion.id_ciudad != null && ubicacion.id_provincia != null) {
            const [provList, distList] = await Promise.all([
              UbigeoService.getProvinciasByCiudad(ubicacion.id_ciudad),
              UbigeoService.getDistritosByProvincia(ubicacion.id_provincia),
            ])
            setProvincias(provList || [])
            setDistritos(distList || [])
            form.setValue('idCiudad', ubicacion.id_ciudad)
            form.setValue('idProvincia', ubicacion.id_provincia)
            form.setValue('idDistrito', ubicacion.id_distrito ?? undefined)
            setUbigeoConfirmado(ubicacion.ubigeo ?? null)
            return
          }
        } catch {
          // Sin match en BD; seguir con lógica por IDs o por nombres
        }
        setUbigeoConfirmado(null)
      }

      if (hasIds) {
        const [provList, distList] = await Promise.all([
          UbigeoService.getProvinciasByCiudad(res.id_ciudad!),
          res.id_provincia != null ? UbigeoService.getDistritosByProvincia(res.id_provincia) : Promise.resolve([] as Distrito[]),
        ])
        setProvincias(provList || [])
        setDistritos(distList || [])
        form.setValue('idCiudad', res.id_ciudad!)
        form.setValue('idProvincia', res.id_provincia ?? 0)
        if (res.id_distrito != null) form.setValue('idDistrito', res.id_distrito)
        setUbigeoConfirmado(res.ubigeo ?? null)
      } else if (hasNames && ciudades.length === 0) {
        pendingReverseRef.current = { res, addressText: text }
      } else if (hasNames && ciudades.length > 0) {
        setUbigeoConfirmado(null)
        const depNorm = normalizeForMatch(dep)
        const provNorm = normalizeForMatch(prov)
        const distNorm = normalizeForMatch(dist)
        const ciudad = ciudades.find((c) => normalizeForMatch(c.nombre) === depNorm)
        if (ciudad) {
          const provinciasList = await UbigeoService.getProvinciasByCiudad(ciudad.id)
          setProvincias(provinciasList || [])
          form.setValue('idCiudad', ciudad.id)
          const provincia = (provinciasList || []).find(
            (p) => normalizeForMatch(p.nombre) === provNorm || normalizeForMatch(p.nombre.replace(/^Provincia\s+de\s+/i, '')) === provNorm
          )
          if (provincia) {
            const distritosList = await UbigeoService.getDistritosByProvincia(provincia.id)
            setDistritos(distritosList || [])
            form.setValue('idProvincia', provincia.id)
            const distrito = (distritosList || []).find((d) => normalizeForMatch(d.nombre) === distNorm)
            form.setValue('idDistrito', distrito?.id ?? undefined)
          } else {
            form.setValue('idDistrito', undefined)
          }
        }
      }
    },
    [form, ciudades]
  )

  useEffect(() => {
    if (!isLoggedIn || !cliente) return
    if (cliente.nombre) form.setValue('firstName', cliente.nombre)
    if (cliente.apellidos) form.setValue('lastName', cliente.apellidos)
    if (cliente.correo) form.setValue('email', cliente.correo)
  }, [isLoggedIn, cliente, form])

  useEffect(() => {
    let cancelled = false
    setLoadingUbigeo((l) => ({ ...l, ciudades: true }))
    UbigeoService.getCiudades(1).then((data) => {
      if (!cancelled && Array.isArray(data) && data.length > 0) setCiudades(data)
    }).finally(() => setLoadingUbigeo((l) => ({ ...l, ciudades: false })))
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (ciudades.length === 0 || !pendingReverseRef.current) return
    const pending = pendingReverseRef.current
    pendingReverseRef.current = null
    applyReverseGeocodeToDropdowns(pending.res, pending.addressText)
  }, [ciudades, applyReverseGeocodeToDropdowns])

  useEffect(() => {
    let cancelled = false
    setLoadingUbigeo((l) => ({ ...l, tarifa: true }))
    UbigeoService.getTarifaPlanaEnvio().then((data) => {
      if (!cancelled) setTarifaPlana(data)
    }).finally(() => setLoadingUbigeo((l) => ({ ...l, tarifa: false })))
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoadingUbigeo((l) => ({ ...l, tiposLugarEntrega: true }))
    TipoLugarEntregaService.getTiposLugarEntrega().then((data) => {
      if (cancelled) return
      const tipos = data || []
      setTiposLugarEntrega(tipos)
      if (tipoEntrega === 'DELIVERY' && (!form.getValues('idTipoLugarEntrega') || form.getValues('idTipoLugarEntrega')! < 1)) {
        const defaultTipo = tipos.find((item) => item.id === 14) ?? tipos.find((item) => item.nombre.trim().toLowerCase() === 'otro') ?? tipos[0]
        if (defaultTipo) form.setValue('idTipoLugarEntrega', defaultTipo.id, { shouldValidate: false })
      }
    }).finally(() => { if (!cancelled) setLoadingUbigeo((l) => ({ ...l, tiposLugarEntrega: false })) })
    return () => { cancelled = true }
  }, [form])

  useEffect(() => {
    if (tipoEntrega === 'RECOJO') {
      form.setValue('idCiudad', 0, { shouldValidate: false })
      form.setValue('idProvincia', 0, { shouldValidate: false })
      form.setValue('idDistrito', undefined, { shouldValidate: false })
      form.setValue('idTipoLugarEntrega', undefined, { shouldValidate: false })
      form.setValue('address', '', { shouldValidate: false })
      form.setValue('country', PAIS_DEFAULT, { shouldValidate: false })
      setProvincias([])
      setDistritos([])
      setAutocompleteQuery('')
      setAutocompleteSuggestions([])
      setAddressFromMap(null)
      setMapLat(null)
      setMapLng(null)
      setErrorMap(null)
      setUbigeoConfirmado(null)
      setCheckoutShipping({ costoEnvio: 0, envioLabel: 'Recojo en tienda' })
      return
    }
    if ((!idTipoLugarEntrega || idTipoLugarEntrega < 1) && tiposLugarEntrega.length > 0) {
      const defaultTipo = tiposLugarEntrega.find((item) => item.id === 14) ?? tiposLugarEntrega.find((item) => item.nombre.trim().toLowerCase() === 'otro') ?? tiposLugarEntrega[0]
      if (defaultTipo) form.setValue('idTipoLugarEntrega', defaultTipo.id, { shouldValidate: false })
    }
    if (!form.getValues('country')) form.setValue('country', PAIS_DEFAULT, { shouldValidate: false })
  }, [form, idTipoLugarEntrega, setCheckoutShipping, tipoEntrega, tiposLugarEntrega])

  useEffect(() => {
    if (!idCiudad || idCiudad < 1) {
      setProvincias([])
      setDistritos([])
      form.setValue('idProvincia', 0)
      form.setValue('idDistrito', undefined)
      setCheckoutShipping({ costoEnvio: 0, envioLabel: '' })
      return
    }
    let cancelled = false
    setLoadingUbigeo((l) => ({ ...l, provincias: true }))
    UbigeoService.getProvinciasByCiudad(idCiudad).then((data) => {
      if (!cancelled) {
        const list = data || []
        setProvincias(list)
        const currentProv = form.getValues('idProvincia')
        const provValid = currentProv && list.some((p) => p.id === currentProv)
        if (!provValid) {
          setDistritos([])
          form.setValue('idProvincia', 0)
          form.setValue('idDistrito', undefined)
          setCheckoutShipping({ costoEnvio: 0, envioLabel: '' })
        }
      }
    }).finally(() => setLoadingUbigeo((l) => ({ ...l, provincias: false })))
    return () => { cancelled = true }
  }, [idCiudad, form, setCheckoutShipping])

  useEffect(() => {
    if (tipoEntrega === 'RECOJO') {
      setCheckoutShipping({ costoEnvio: 0, envioLabel: 'Recojo en tienda' })
      return
    }
    if (!idProvincia || idProvincia < 1) {
      setDistritos([])
      form.setValue('idDistrito', undefined)
      setCheckoutShipping({ costoEnvio: 0, envioLabel: '' })
      return
    }
    let cancelled = false
    setLoadingUbigeo((l) => ({ ...l, distritos: true }))
    UbigeoService.getDistritosByProvincia(idProvincia).then((data) => {
      if (!cancelled) {
        const list = data || []
        setDistritos(list)
        const currentDist = form.getValues('idDistrito')
        const distValid = currentDist != null && list.some((d) => d.id === currentDist)
        if (!distValid) form.setValue('idDistrito', undefined)
      }
    }).finally(() => setLoadingUbigeo((l) => ({ ...l, distritos: false })))
    const aplicaTarifaPlana = tarifaPlana?.provincia_ids?.includes(idProvincia) ?? false
    const costo = aplicaTarifaPlana ? (tarifaPlana?.costo_envio ?? 20) : 0
    const label = aplicaTarifaPlana ? `S/ ${tarifaPlana?.costo_envio ?? 20}` : 'Envío a consultar según destino'
    if (!cancelled) setCheckoutShipping({ costoEnvio: costo, envioLabel: label })
    return () => { cancelled = true }
  }, [idProvincia, tarifaPlana, form, setCheckoutShipping, tipoEntrega])

  const idDistrito = form.watch('idDistrito')
  const ciudadNombre = ciudades.find((c) => c.id === idCiudad)?.nombre ?? ''
  const provinciaNombre = provincias.find((p) => p.id === idProvincia)?.nombre ?? ''
  const distritoNombre = idDistrito ? (distritos.find((d) => d.id === idDistrito)?.nombre ?? '') : ''

  useEffect(() => {
    if (!idCiudad || idCiudad < 1 || !idProvincia || idProvincia < 1) {
      setMapLat(null); setMapLng(null); setAddressFromMap(null); setErrorMap(null)
      return
    }
    const dep = ciudadNombre || '', prov = provinciaNombre || '', dist = distritoNombre || ''
    const direccion = [dist, prov, dep].filter(Boolean).join(', ') + ', ' + PAIS_DEFAULT
    let cancelled = false
    setLoadingMap((m) => ({ ...m, geocode: true }))
    setErrorMap(null)
    GoogleMapsService.geocodificar({ direccion, distrito: dist || undefined, provincia: prov || undefined, departamento: dep || undefined })
      .then((res) => {
        if (cancelled) return
        if (res.lat != null && res.lng != null) {
          setMapLat(res.lat); setMapLng(res.lng)
          const addr = toAddressString(res.address) ?? toAddressString(res.formatted_address) ?? null
          if (addr) setAddressFromMap(addr)
        }
      })
      .catch(() => { if (!cancelled) setErrorMap('No se pudo ubicar en el mapa. Puedes arrastrar el marcador o indicar la dirección manualmente.') })
      .finally(() => { if (!cancelled) setLoadingMap((m) => ({ ...m, geocode: false })) })
    return () => { cancelled = true }
  }, [idCiudad, idProvincia, idDistrito, ciudadNombre, provinciaNombre, distritoNombre])

  const handleMarkerMove = useCallback((lat: number, lng: number) => {
    lastReverseCoordsRef.current = { lat, lng }
    setLoadingMap((m) => ({ ...m, reverse: true }))
    setErrorMap(null)
    GoogleMapsService.reverse(lat, lng)
      .then(async (res) => {
        if (lastReverseCoordsRef.current?.lat !== lat || lastReverseCoordsRef.current?.lng !== lng) return
        setMapLat(lat); setMapLng(lng)
        const addr = toAddressString(res.address) ?? toAddressString(res.direccion) ?? buildAddressFromReverse(res)
        if (addr) { setAddressFromMap(addr); form.setValue('address', addr) }
        await applyReverseGeocodeToDropdowns(res, addr ?? undefined)
      })
      .catch(() => {
        if (lastReverseCoordsRef.current?.lat !== lat || lastReverseCoordsRef.current?.lng !== lng) return
        setAddressFromMap(null)
        setErrorMap('No se pudo obtener la dirección para esta ubicación.')
      })
      .finally(() => setLoadingMap((m) => ({ ...m, reverse: false })))
  }, [form, applyReverseGeocodeToDropdowns])

  useEffect(() => {
    if (!autocompleteQuery.trim()) { setAutocompleteSuggestions([]); return }
    if (autocompleteDebounceRef.current) clearTimeout(autocompleteDebounceRef.current)
    autocompleteDebounceRef.current = setTimeout(() => {
      setLoadingAutocomplete(true)
      GoogleMapsService.autocomplete(autocompleteQuery)
        .then((list) => setAutocompleteSuggestions(list.map((p) => ({ place_id: p.place_id, description: p.description }))))
        .catch(() => setAutocompleteSuggestions([]))
        .finally(() => setLoadingAutocomplete(false))
      autocompleteDebounceRef.current = null
    }, DEBOUNCE_MS)
    return () => { if (autocompleteDebounceRef.current) clearTimeout(autocompleteDebounceRef.current) }
  }, [autocompleteQuery])

  const handleSelectPlace = useCallback((placeId: string) => {
    setLoadingMap((m) => ({ ...m, geocode: true }))
    setAutocompleteSuggestions([])
    setAutocompleteQuery('')
    GoogleMapsService.getPlaceDetails(placeId)
      .then(async (res) => {
        if (res.lat == null || res.lng == null) return
        setMapLat(res.lat); setMapLng(res.lng)
        const addr = toAddressString(res.address) ?? toAddressString(res.formatted_address) ?? null
        if (addr) { setAddressFromMap(addr); form.setValue('address', addr) }
        try {
          const reverseRes = await GoogleMapsService.reverse(res.lat, res.lng)
          const reverseAddr = addr ?? toAddressString(reverseRes.address) ?? toAddressString(reverseRes.direccion) ?? buildAddressFromReverse(reverseRes)
          if (reverseAddr && !addr) { setAddressFromMap(reverseAddr); form.setValue('address', reverseAddr) }
          await applyReverseGeocodeToDropdowns(reverseRes, reverseAddr ?? undefined)
        } catch { /* dirección y mapa ya están */ }
      })
      .finally(() => setLoadingMap((m) => ({ ...m, geocode: false })))
  }, [form, applyReverseGeocodeToDropdowns])

  const onSubmit = async (data: CheckoutFormData) => {
    if (!isLoggedIn || !cliente?.id || !token) {
      toast({ title: t('checkout.error.title'), description: 'Debe iniciar sesión para realizar el pedido.', variant: 'destructive' })
      return
    }
    if (hasCartRestrictionErrors) {
      toast({ title: 'Restricciones de compra', description: cartRestrictionErrors[0] ?? 'Corrige los productos del carrito antes de continuar.', variant: 'destructive' })
      return
    }
    const isRecojo = data.tipo_entrega === 'RECOJO'
    const body: CreatePedidoBody = {
      id_cliente: cliente.id,
      detalles: items.map((i) => ({ sku: i.product.sku, cantidad: i.quantity, precio_unitario: i.product.precio_venta ?? 0 })),
      tipo_entrega: data.tipo_entrega,
      costo_envio: isRecojo ? 0 : (tarifaPlana?.provincia_ids?.includes(data.idProvincia ?? 0) ? (tarifaPlana?.costo_envio ?? 20) : 0),
    }
    if (!isRecojo) {
      const cNom = ciudades.find((c) => c.id === data.idCiudad)?.nombre ?? ''
      const pNom = provincias.find((p) => p.id === data.idProvincia)?.nombre ?? ''
      const dNom = data.idDistrito ? (distritos.find((d) => d.id === data.idDistrito)?.nombre ?? '') : ''
      const addrFromMapStr = toAddressString(addressFromMap)
      const direccion_entrega = addrFromMapStr ? [data.address, addrFromMapStr].filter(Boolean).join(', ') : [data.address, dNom, pNom, cNom, data.country].filter(Boolean).join(', ')
      body.direccion_entrega = direccion_entrega || undefined
      const ubigeoEnvio = ubigeoConfirmado ?? (data.idDistrito ? distritos.find((d) => d.id === data.idDistrito)?.ubigeo : undefined)
      body.direccion_entrega_pedido = {
        direccion: direccion_entrega || (data.address?.trim() ?? ''),
        referencia: addrFromMapStr && addrFromMapStr !== direccion_entrega ? addrFromMapStr : undefined,
        id_distrito: data.idDistrito || undefined,
        ubigeo: ubigeoEnvio,
        id_tipo_lugar_entrega: data.idTipoLugarEntrega || undefined,
        instrucciones_acceso: data.notes || undefined,
        latitud: mapLat ?? undefined,
        longitud: mapLng ?? undefined,
      }
      body.instrucciones_entrega = data.notes || undefined
      body.contacto_recepcion = [data.firstName, data.lastName].filter(Boolean).join(' ') || undefined
      body.telefono_contacto_entrega = data.phone || undefined
    }
    setIsSubmitting(true)
    try {
      const res = await pedidosService.crearPedido(body, token)
      if (!res.success || !res.data?.id) {
        toast({ title: t('checkout.error.title'), description: t('checkout.error.description'), variant: 'destructive' })
        return
      }
      clearCart()
      const numero = res.data.numero ?? String(res.data.id)
      toast({ title: t('checkout.success.title'), description: t('checkout.success.description', { orderId: numero }) })
      router.push(`/${locale}/pedido/${res.data.id}?numero=${encodeURIComponent(numero)}`)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400) { toast({ title: t('checkout.error.title'), description: error.detail?.message || 'Algunos productos ya no están disponibles.', variant: 'destructive' }); return }
        if (error.status === 401 || error.status === 403) { toast({ title: 'Sesión requerida', description: 'Inicie sesión para continuar.', variant: 'destructive' }); router.push(`/${locale}/login?redirect=checkout`); return }
        if (error.status >= 500) { toast({ title: t('checkout.error.title'), description: 'No pudimos crear el pedido. Intente más tarde.', variant: 'destructive' }); return }
      }
      toast({ title: t('checkout.error.title'), description: t('checkout.error.description'), variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />
        <div className="p-14 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
            <ShoppingBag className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Tu carrito está vacío</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
            Agrega productos antes de proceder al checkout.
          </p>
          <a
            href={`/${locale}/catalogo`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-md shadow-orange-200 dark:shadow-orange-900/30"
          >
            Explorar productos <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    )
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

      {/* ── Not logged in banner ─────────────────────────────────────────── */}
      {!isLoggedIn && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5">
          <div className="flex gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-0.5">
                Inicia sesión para continuar
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mb-3 leading-relaxed">
                Necesitas una cuenta para finalizar tu pedido y tener seguimiento del mismo.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/${locale}/login?redirect=checkout`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-200 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href={`/${locale}/registro?redirect=checkout`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  Crear cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. Personal info ─────────────────────────────────────────────── */}
      {isLoggedIn && (
        <>
          <FormSection>
            <SectionHeader step={1} icon={User} title="Información personal" subtitle="Datos del contacto para el pedido" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre" required error={form.formState.errors.firstName?.message}>
                <Input
                  className={inputCls}
                  placeholder="Tu nombre"
                  {...form.register('firstName')}
                />
              </Field>
              <Field label="Apellido" required error={form.formState.errors.lastName?.message}>
                <Input
                  className={inputCls}
                  placeholder="Tu apellido"
                  {...form.register('lastName')}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Field label="Correo electrónico" required error={form.formState.errors.email?.message}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input className={inputCls + ' pl-9'} type="email" placeholder="correo@empresa.com" {...form.register('email')} />
                </div>
              </Field>
              <Field label="Teléfono" required error={form.formState.errors.phone?.message}>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input className={inputCls + ' pl-9'} type="tel" placeholder="+51 999 999 999" {...form.register('phone')} />
                </div>
              </Field>
            </div>
          </FormSection>

          {/* ── 2. Delivery ────────────────────────────────────────────────── */}
          <FormSection>
            <SectionHeader step={2} icon={Truck} title="Entrega" subtitle="¿Cómo quieres recibir tu pedido?" />

            {/* Tipo entrega toggle */}
            <RadioGroup
              value={tipoEntrega}
              onValueChange={(v) => {
                form.setValue('tipo_entrega', v as 'DELIVERY' | 'RECOJO')
                if (v === 'RECOJO') setCheckoutShipping({ costoEnvio: 0, envioLabel: 'Recojo en tienda' })
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5"
            >
              {[
                { value: 'DELIVERY', icon: Truck, label: 'Envío a domicilio', desc: 'Entrega en tu dirección' },
                { value: 'RECOJO', icon: Store, label: 'Recojo en tienda', desc: 'Sin costo de envío' },
              ].map(({ value, icon: Icon, label, desc }) => {
                const active = tipoEntrega === value
                return (
                  <label
                    key={value}
                    htmlFor={`tipo-${value}`}
                    className={[
                      'flex items-center gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150',
                      active
                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
                    ].join(' ')}
                  >
                    <RadioGroupItem value={value} id={`tipo-${value}`} className="sr-only" />
                    <div className={['w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors', active ? 'bg-orange-500' : 'bg-slate-100 dark:bg-slate-800'].join(' ')}>
                      <Icon className={['w-4 h-4', active ? 'text-white' : 'text-slate-500 dark:text-slate-400'].join(' ')} />
                    </div>
                    <div>
                      <p className={['text-sm font-semibold', active ? 'text-orange-700 dark:text-orange-300' : 'text-slate-800 dark:text-slate-200'].join(' ')}>{label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                    </div>
                    {active && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </label>
                )
              })}
            </RadioGroup>

            {tipoEntrega === 'DELIVERY' && (
              <div className="space-y-4">
                {/* Ubigeo row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Departamento / Región" required error={form.formState.errors.idCiudad?.message}>
                    <select
                      className={selectCls}
                      value={form.watch('idCiudad') || ''}
                      onChange={(e) => form.setValue('idCiudad', e.target.value ? Number(e.target.value) : 0)}
                      disabled={loadingUbigeo.ciudades}
                    >
                      <option value="">{loadingUbigeo.ciudades ? 'Cargando...' : 'Seleccionar'}</option>
                      {ciudades.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </Field>
                  <Field label="Provincia" required error={form.formState.errors.idProvincia?.message}>
                    <select
                      className={selectCls}
                      value={form.watch('idProvincia') || ''}
                      onChange={(e) => form.setValue('idProvincia', e.target.value ? Number(e.target.value) : 0)}
                      disabled={!idCiudad || idCiudad < 1 || loadingUbigeo.provincias}
                    >
                      <option value="">{loadingUbigeo.provincias ? 'Cargando...' : 'Seleccionar'}</option>
                      {provincias.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Ubigeo row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Distrito (opcional)">
                    <select
                      className={selectCls}
                      value={form.watch('idDistrito') ?? ''}
                      onChange={(e) => form.setValue('idDistrito', e.target.value ? Number(e.target.value) : undefined)}
                      disabled={!idProvincia || idProvincia < 1 || loadingUbigeo.distritos}
                    >
                      <option value="">{loadingUbigeo.distritos ? 'Cargando...' : 'Seleccionar'}</option>
                      {distritos.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                    </select>
                  </Field>
                  <Field label="Tipo de lugar" required error={form.formState.errors.idTipoLugarEntrega?.message}>
                    <select
                      className={selectCls}
                      value={idTipoLugarEntrega ?? ''}
                      onChange={(e) => form.setValue('idTipoLugarEntrega', e.target.value ? Number(e.target.value) : undefined, { shouldValidate: true })}
                      disabled={loadingUbigeo.tiposLugarEntrega}
                    >
                      <option value="">{loadingUbigeo.tiposLugarEntrega ? 'Cargando...' : 'Seleccionar'}</option>
                      {tiposLugarEntrega.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Address */}
                <Field label="Dirección" required error={form.formState.errors.address?.message}>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <textarea
                      className={textareaCls + ' pl-9 min-h-[72px]'}
                      placeholder="Av. Principal 123, Mz A Lt 5, frente al parque..."
                      {...form.register('address')}
                    />
                  </div>
                </Field>

                {/* Country */}
                <Field label="País" required error={form.formState.errors.country?.message}>
                  <Input className={inputCls} {...form.register('country')} />
                </Field>

                {/* Address search */}
                <Field label="Buscar dirección en mapa (opcional)">
                  <div className="relative">
                    <Input
                      className={inputCls + ' pr-20'}
                      type="text"
                      placeholder="Escribe para buscar..."
                      value={autocompleteQuery}
                      onChange={(e) => setAutocompleteQuery(e.target.value)}
                      onBlur={() => setTimeout(() => setAutocompleteSuggestions([]), 200)}
                      aria-autocomplete="list"
                      aria-expanded={autocompleteSuggestions.length > 0}
                    />
                    {loadingAutocomplete && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">Buscando…</span>
                    )}
                    {autocompleteSuggestions.length > 0 && (
                      <ul className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl max-h-48 overflow-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {autocompleteSuggestions.map((s) => (
                          <li
                            key={s.place_id}
                            role="option"
                            aria-selected={false}
                            className="px-3.5 py-2.5 text-sm cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/20 text-slate-700 dark:text-slate-300 transition-colors"
                            onMouseDown={(e) => { e.preventDefault(); handleSelectPlace(s.place_id) }}
                          >
                            {s.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Field>

                {/* Map */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Ubicación en mapa
                  </p>
                  {(() => {
                    const addrDisplay = toAddressString(addressFromMap)
                    return addrDisplay ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5" aria-live="polite">
                        <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                        {addrDisplay}
                      </p>
                    ) : null
                  })()}
                  <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700">
                    <DeliveryAddressMap
                      lat={mapLat} lng={mapLng}
                      onMarkerMove={handleMarkerMove}
                      center={mapLat != null && mapLng != null ? undefined : { lat: -12.046374, lng: -77.042793 }}
                      zoom={14}
                      loading={loadingMap.geocode}
                      error={errorMap}
                      onErrorRetry={() => setErrorMap(null)}
                      height={260}
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Arrastra el marcador para ajustar la ubicación exacta.
                  </p>
                </div>

                {/* Shipping cost pill */}
                {idProvincia >= 1 && (
                  <div className={[
                    'flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium',
                    tarifaPlana?.provincia_ids?.includes(idProvincia)
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
                  ].join(' ')}>
                    <Truck className="w-4 h-4 flex-shrink-0" />
                    {tarifaPlana?.provincia_ids?.includes(idProvincia)
                      ? <>Costo de envío: <strong className="ml-1">S/ {tarifaPlana?.costo_envio ?? 20}</strong> <span className="text-xs font-normal opacity-70 ml-1">(Lima/Callao)</span></>
                      : 'Envío a consultar según destino'}
                  </div>
                )}
              </div>
            )}
          </FormSection>

          {/* ── 3. Payment ───────────────────────────────────────────────────── */}
          <FormSection>
            <SectionHeader step={3} icon={CreditCard} title="Método de pago" subtitle="Selecciona cómo quieres pagar" />

            {/* Method selector */}
            <RadioGroup
              value={form.watch('paymentMethod')}
              onValueChange={(v) => form.setValue('paymentMethod', v as 'transfer' | 'yape')}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5"
            >
              {[
                {
                  value: 'transfer',
                  icon: Building2,
                  label: 'Transferencia bancaria',
                  desc: 'BCP · Soles o dólares',
                  color: 'emerald',
                },
                {
                  value: 'yape',
                  icon: QrCode,
                  label: t('checkout.payment.yape'),
                  desc: t('checkout.payment.yapeDescription'),
                  color: 'purple',
                },
              ].map(({ value, icon: Icon, label, desc, color }) => {
                const active = form.watch('paymentMethod') === value
                const activeBorder: Record<string, string> = {
                  emerald: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-500',
                  purple: 'border-purple-400 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-500',
                }
                const activeIcon: Record<string, string> = {
                  emerald: 'bg-emerald-500',
                  purple: 'bg-purple-500',
                }
                return (
                  <label
                    key={value}
                    htmlFor={`pay-${value}`}
                    className={[
                      'flex items-center gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150',
                      active
                        ? activeBorder[color]
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
                    ].join(' ')}
                  >
                    <RadioGroupItem value={value} id={`pay-${value}`} className="sr-only" />
                    <div className={[
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                      active ? activeIcon[color] : 'bg-slate-100 dark:bg-slate-800',
                    ].join(' ')}>
                      <Icon className={['w-5 h-5', active ? 'text-white' : 'text-slate-500 dark:text-slate-400'].join(' ')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                    </div>
                    {active && (
                      <div className={[
                        'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                        color === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500',
                      ].join(' ')}>
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </label>
                )
              })}
            </RadioGroup>

            {/* ── Transferencia BCP ─────────────────────────────────────── */}
            {form.watch('paymentMethod') === 'transfer' && (
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 overflow-hidden">

                {/* BCP header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-emerald-500 dark:bg-emerald-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">Banco de Crédito del Perú</p>
                      <p className="text-xs text-emerald-100">Transferencia interbancaria</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white bg-white/20 px-2.5 py-1 rounded-full">BCP</span>
                </div>

                {/* Account cards */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      flag: '🇵🇪',
                      currency: 'Soles',
                      code: 'PEN',
                      account: '192-7293189-0-73',
                      cci: '002-192-007293189073-34',
                    },
                    {
                      flag: '🇺🇸',
                      currency: 'Dólares',
                      code: 'USD',
                      account: '1917331690183',
                      cci: '00219100733169018351',
                    },
                  ].map(({ flag, currency, code, account, cci }) => (
                    <div
                      key={code}
                      className="bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-900/50 overflow-hidden"
                    >
                      {/* Currency header */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-b border-emerald-100 dark:border-emerald-900/50">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{flag}</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{currency}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                          {code}
                        </span>
                      </div>

                      {/* Account fields */}
                      <div className="p-3.5 space-y-3">
                        <CopyField label="N° de cuenta" value={account} />
                        <CopyField label="CCI" value={cci} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                <div className="px-5 py-4 bg-white dark:bg-slate-900 border-t border-emerald-100 dark:border-emerald-900/50">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
                    Cómo pagar
                  </p>
                  <ol className="space-y-2">
                    {[
                      'Copia el número de cuenta o CCI según tu banco.',
                      'Realiza la transferencia desde tu app o banca en línea.',
                      'Envía el comprobante por WhatsApp o correo.',
                      'Tu pedido se confirmará en menos de 24 h hábiles.',
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* ── Yape ──────────────────────────────────────────────────── */}
            {form.watch('paymentMethod') === 'yape' && (
              <div className="rounded-xl border border-purple-200 dark:border-purple-800/50 overflow-hidden">

                {/* Yape header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-purple-600 dark:bg-purple-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <QrCode className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">{t('checkout.payment.yape')}</p>
                      <p className="text-xs text-purple-200">Escanea el código QR</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white bg-white/20 px-2.5 py-1 rounded-full">QR</span>
                </div>

                {/* QR + instructions side by side */}
                <div className="p-5 bg-purple-50 dark:bg-purple-950/10 flex flex-col sm:flex-row items-center gap-6">

                  {/* QR code */}
                  <div className="flex-shrink-0">
                    <div className="relative w-40 h-40 bg-white rounded-2xl p-2 shadow-md shadow-purple-200 dark:shadow-purple-900/30 border border-purple-100 dark:border-purple-900/50">
                      <Image
                        src="/qr_inxora.jpeg"
                        alt="QR Yape – Inxora"
                        fill
                        className="object-contain rounded-xl"
                        sizes="160px"
                      />
                    </div>
                    <p className="text-center text-[11px] text-purple-600 dark:text-purple-400 mt-2 font-medium">
                      INXORA S.A.C.
                    </p>
                  </div>

                  {/* Steps */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3">
                      {t('checkout.payment.yapeInstructions')}
                    </p>
                    <ol className="space-y-2.5">
                      {[
                        'Abre tu app de Yape.',
                        'Toca "Yapear con QR" y escanea el código.',
                        'Ingresa el monto exacto de tu pedido.',
                        'Envíanos el comprobante por WhatsApp.',
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-3 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {t('checkout.payment.yapeScan')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </FormSection>

          {/* ── 4. Notes ─────────────────────────────────────────────────────── */}
          <FormSection>
            <SectionHeader step={4} icon={FileText} title="Notas adicionales" subtitle="Instrucciones especiales (opcional)" />
            <textarea
              className={textareaCls}
              placeholder="Ej: Dejar con el portero, llamar antes de llegar..."
              {...form.register('notes')}
            />
          </FormSection>

          {/* ── Terms & newsletter ───────────────────────────────────────────── */}
          <FormSection>
            <div className="space-y-3.5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  id="acceptTerms"
                  checked={form.watch('acceptTerms')}
                  onCheckedChange={(c) => form.setValue('acceptTerms', c as boolean)}
                  className="mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Acepto los{' '}
                  <Link href={`/${locale}/terminos`} className="text-orange-600 dark:text-orange-400 hover:underline font-medium">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link href={`/${locale}/privacidad`} className="text-orange-600 dark:text-orange-400 hover:underline font-medium">
                    política de privacidad
                  </Link>
                </span>
              </label>
              {form.formState.errors.acceptTerms && (
                <p className="text-xs text-red-500 pl-7">{form.formState.errors.acceptTerms.message}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  id="newsletter"
                  checked={form.watch('newsletter')}
                  onCheckedChange={(c) => form.setValue('newsletter', c as boolean)}
                  className="mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Quiero recibir ofertas y novedades por correo electrónico
                </span>
              </label>
            </div>
          </FormSection>

          {/* ── Cart restriction errors ──────────────────────────────────────── */}
          {hasCartRestrictionErrors && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">Corrige estos productos antes de continuar</p>
              </div>
              <ul className="space-y-1 pl-6">
                {cartRestrictionErrors.map((err) => (
                  <li key={err} className="text-xs text-red-700 dark:text-red-300 list-disc">{err}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* ── Submit ───────────────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting || !isLoggedIn || hasCartRestrictionErrors}
        className={[
          'w-full h-13 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200',
          'bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:active:scale-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2',
        ].join(' ')}
      >
        {isSubmitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
            Procesando pedido…
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Confirmar pedido
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  )
}