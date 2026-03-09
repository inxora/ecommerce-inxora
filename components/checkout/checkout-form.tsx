'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { User, MapPin, CreditCard, Truck, Mail, Phone, ShoppingBag, FileText, CheckCircle, AlertCircle, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useCart } from '@/lib/hooks/use-cart'
import { useToast } from '@/lib/hooks/use-toast'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { useCheckoutShipping } from '@/lib/contexts/checkout-shipping-context'
import { pedidosService, ApiError } from '@/lib/services/pedidos.service'
import { UbigeoService, type Ciudad, type Provincia, type Distrito } from '@/lib/services/ubigeo.service'
import { GoogleMapsService } from '@/lib/services/google-maps.service'
import { DeliveryAddressMap } from '@/components/checkout/delivery-address-map'
import Link from 'next/link'

const DEBOUNCE_MS = 350

const checkoutSchema = z.object({
  // Información personal
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono requerido'),
  
  // Dirección de entrega (ubigeo: departamento → provincia → distrito)
  idCiudad: z.number().min(1, 'Seleccione departamento/región'),
  idProvincia: z.number().min(1, 'Seleccione provincia'),
  idDistrito: z.number().optional(),
  address: z.string().min(5, 'Dirección requerida (calle, número, referencia)'),
  country: z.string().min(2, 'País requerido'),
  
  // Método de pago (solo transferencia bancaria y Yape)
  paymentMethod: z.enum(['transfer', 'yape']),
  
  // Información adicional
  notes: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Debe aceptar los términos'),
  newsletter: z.boolean().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

const PAIS_DEFAULT = 'Perú'

/** Convierte la respuesta de la API (string u objeto con address_components) a string para mostrar y guardar. */
function toAddressString(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === 'string') return value.trim() || null
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const o = value as Record<string, unknown>
    if (typeof o.formatted_address === 'string') return o.formatted_address.trim() || null
    const parts = [
      o.street_number,
      o.route,
      o.locality,
      o.administrative_area_level_2,
      o.administrative_area_level_1,
      o.country,
    ].filter((p): p is string => typeof p === 'string' && p.trim() !== '')
    if (parts.length) return parts.join(', ')
  }
  return null
}

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
  const [tarifaPlana, setTarifaPlana] = useState<{ provincia_ids: number[]; costo_envio: number } | null>(null)
  const [loadingUbigeo, setLoadingUbigeo] = useState({ ciudades: false, provincias: false, distritos: false, tarifa: false })
  const [mapLat, setMapLat] = useState<number | null>(null)
  const [mapLng, setMapLng] = useState<number | null>(null)
  const [addressFromMap, setAddressFromMap] = useState<string | null>(null)
  const [loadingMap, setLoadingMap] = useState({ geocode: false, reverse: false })
  const [errorMap, setErrorMap] = useState<string | null>(null)
  const [autocompleteQuery, setAutocompleteQuery] = useState('')
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<{ place_id: string; description: string }[]>([])
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false)
  const autocompleteDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      idCiudad: 0,
      idProvincia: 0,
      idDistrito: undefined,
      address: '',
      country: PAIS_DEFAULT,
      paymentMethod: 'transfer',
      acceptTerms: false,
      newsletter: false,
    },
  })

  const idCiudad = form.watch('idCiudad')
  const idProvincia = form.watch('idProvincia')

  // Prellenar Información personal con los datos del cliente logueado
  useEffect(() => {
    if (!isLoggedIn || !cliente) return
    if (cliente.nombre) form.setValue('firstName', cliente.nombre)
    if (cliente.apellidos) form.setValue('lastName', cliente.apellidos)
    if (cliente.correo) form.setValue('email', cliente.correo)
  }, [isLoggedIn, cliente, form])

  // Cargar ciudades (departamentos) y tarifa plana al montar
  useEffect(() => {
    let cancelled = false
    setLoadingUbigeo((l) => ({ ...l, ciudades: true }))
    UbigeoService.getCiudades(1)
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) setCiudades(data)
      })
      .finally(() => setLoadingUbigeo((l) => ({ ...l, ciudades: false })))
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoadingUbigeo((l) => ({ ...l, tarifa: true }))
    UbigeoService.getTarifaPlanaEnvio()
      .then((data) => {
        if (!cancelled) setTarifaPlana(data)
      })
      .finally(() => setLoadingUbigeo((l) => ({ ...l, tarifa: false })))
    return () => { cancelled = true }
  }, [])

  // Cargar provincias cuando cambia el departamento (no resetear idProvincia si sigue válido en la nueva lista)
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
    UbigeoService.getProvinciasByCiudad(idCiudad)
      .then((data) => {
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
      })
      .finally(() => setLoadingUbigeo((l) => ({ ...l, provincias: false })))
    return () => { cancelled = true }
  }, [idCiudad, form, setCheckoutShipping])

  // Cargar distritos y actualizar costo de envío cuando cambia la provincia (no resetear idDistrito si sigue válido)
  useEffect(() => {
    if (!idProvincia || idProvincia < 1) {
      setDistritos([])
      form.setValue('idDistrito', undefined)
      setCheckoutShipping({ costoEnvio: 0, envioLabel: '' })
      return
    }
    let cancelled = false
    setLoadingUbigeo((l) => ({ ...l, distritos: true }))
    UbigeoService.getDistritosByProvincia(idProvincia)
      .then((data) => {
        if (!cancelled) {
          const list = data || []
          setDistritos(list)
          const currentDist = form.getValues('idDistrito')
          const distValid = currentDist != null && list.some((d) => d.id === currentDist)
          if (!distValid) form.setValue('idDistrito', undefined)
        }
      })
      .finally(() => setLoadingUbigeo((l) => ({ ...l, distritos: false })))

    const aplicaTarifaPlana = tarifaPlana?.provincia_ids?.includes(idProvincia) ?? false
    const costo = aplicaTarifaPlana ? (tarifaPlana?.costo_envio ?? 20) : 0
    const label = aplicaTarifaPlana ? `S/ ${tarifaPlana?.costo_envio ?? 20}` : 'Envío a consultar según destino'
    if (!cancelled) setCheckoutShipping({ costoEnvio: costo, envioLabel: label })

    return () => { cancelled = true }
  }, [idProvincia, tarifaPlana, form, setCheckoutShipping])

  const idDistrito = form.watch('idDistrito')
  const ciudadNombre = ciudades.find((c) => c.id === idCiudad)?.nombre ?? ''
  const provinciaNombre = provincias.find((p) => p.id === idProvincia)?.nombre ?? ''
  const distritoNombre = idDistrito ? (distritos.find((d) => d.id === idDistrito)?.nombre ?? '') : ''

  // Selectores → mapa: al cambiar departamento/provincia/distrito, geocodificar y centrar mapa
  useEffect(() => {
    if (!idCiudad || idCiudad < 1 || !idProvincia || idProvincia < 1) {
      setMapLat(null)
      setMapLng(null)
      setAddressFromMap(null)
      setErrorMap(null)
      return
    }
    const dep = ciudadNombre || ''
    const prov = provinciaNombre || ''
    const dist = distritoNombre || ''
    const direccion = [dist, prov, dep].filter(Boolean).join(', ') + ', ' + PAIS_DEFAULT
    let cancelled = false
    setLoadingMap((m) => ({ ...m, geocode: true }))
    setErrorMap(null)
    GoogleMapsService.geocodificar({
      direccion,
      distrito: dist || undefined,
      provincia: prov || undefined,
      departamento: dep || undefined,
    })
      .then((res) => {
        if (cancelled) return
        if (res.lat != null && res.lng != null) {
          setMapLat(res.lat)
          setMapLng(res.lng)
          const addr = toAddressString(res.address) ?? toAddressString(res.formatted_address) ?? null
          if (addr) setAddressFromMap(addr)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMap('No se pudo ubicar en el mapa. Puedes arrastrar el marcador o indicar la dirección manualmente.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingMap((m) => ({ ...m, geocode: false }))
      })
    return () => { cancelled = true }
  }, [idCiudad, idProvincia, idDistrito, ciudadNombre, provinciaNombre, distritoNombre])

  const handleMarkerMove = useCallback(
    (lat: number, lng: number) => {
      setLoadingMap((m) => ({ ...m, reverse: true }))
      setErrorMap(null)
      GoogleMapsService.reverse(lat, lng)
        .then(async (res) => {
          setMapLat(lat)
          setMapLng(lng)
          const addr = toAddressString(res.address) ?? toAddressString(res.direccion) ?? null
          if (addr) {
            setAddressFromMap(addr)
            form.setValue('address', addr)
          }
          const hasIds = res.id_ciudad != null && res.id_provincia != null
          const hasNames = Boolean(res.departamento ?? res.provincia ?? res.distrito)

          if (hasIds) {
            // Cargar provincias y distritos antes de asignar para que los dropdowns tengan opciones
            const [provList, distList] = await Promise.all([
              UbigeoService.getProvinciasByCiudad(res.id_ciudad!),
              res.id_provincia != null ? UbigeoService.getDistritosByProvincia(res.id_provincia) : Promise.resolve([] as Distrito[]),
            ])
            setProvincias(provList || [])
            setDistritos(distList || [])
            form.setValue('idCiudad', res.id_ciudad!)
            form.setValue('idProvincia', res.id_provincia ?? 0)
            if (res.id_distrito != null) form.setValue('idDistrito', res.id_distrito)
          } else if (hasNames && ciudades.length > 0) {
            // El backend solo devolvió nombres: buscar por nombre en ciudades/provincias/distritos
            const depNombre = String(res.departamento ?? '').trim()
            let provNombre = String(res.provincia ?? '').trim().replace(/^Provincia\s+de\s+/i, '')
            const distNombre = String(res.distrito ?? '').trim()
            const ciudad = ciudades.find((c) => c.nombre.toLowerCase() === depNombre.toLowerCase())
            if (ciudad) {
              const provinciasList = await UbigeoService.getProvinciasByCiudad(ciudad.id)
              setProvincias(provinciasList || [])
              form.setValue('idCiudad', ciudad.id)
              const provincia = (provinciasList || []).find(
                (p) => p.nombre.toLowerCase() === provNombre.toLowerCase() || p.nombre.toLowerCase().replace(/^Provincia\s+de\s+/i, '') === provNombre.toLowerCase()
              )
              if (provincia) {
                const distritosList = await UbigeoService.getDistritosByProvincia(provincia.id)
                setDistritos(distritosList || [])
                form.setValue('idProvincia', provincia.id)
                const distrito = (distritosList || []).find((d) => d.nombre.toLowerCase() === distNombre.toLowerCase())
                if (distrito) form.setValue('idDistrito', distrito.id)
              }
            }
          }
        })
        .catch(() => {
          setAddressFromMap(null)
          setErrorMap('No se pudo obtener la dirección para esta ubicación.')
        })
        .finally(() => setLoadingMap((m) => ({ ...m, reverse: false })))
    },
    [form, ciudades]
  )

  // Autocompletado de dirección con debounce (opcional)
  useEffect(() => {
    if (!autocompleteQuery.trim()) {
      setAutocompleteSuggestions([])
      return
    }
    if (autocompleteDebounceRef.current) clearTimeout(autocompleteDebounceRef.current)
    autocompleteDebounceRef.current = setTimeout(() => {
      setLoadingAutocomplete(true)
      GoogleMapsService.autocomplete(autocompleteQuery)
        .then((list) => setAutocompleteSuggestions(list.map((p) => ({ place_id: p.place_id, description: p.description }))))
        .catch(() => setAutocompleteSuggestions([]))
        .finally(() => setLoadingAutocomplete(false))
      autocompleteDebounceRef.current = null
    }, DEBOUNCE_MS)
    return () => {
      if (autocompleteDebounceRef.current) clearTimeout(autocompleteDebounceRef.current)
    }
  }, [autocompleteQuery])

  const handleSelectPlace = useCallback(
    (placeId: string) => {
      setLoadingMap((m) => ({ ...m, geocode: true }))
      setAutocompleteSuggestions([])
      setAutocompleteQuery('')
      GoogleMapsService.getPlaceDetails(placeId)
        .then((res) => {
          if (res.lat != null && res.lng != null) {
            setMapLat(res.lat)
            setMapLng(res.lng)
            const addr = toAddressString(res.address) ?? toAddressString(res.formatted_address) ?? null
            if (addr) {
              setAddressFromMap(addr)
              form.setValue('address', addr)
            }
          }
        })
        .finally(() => setLoadingMap((m) => ({ ...m, geocode: false })))
    },
    [form]
  )

  const onSubmit = async (data: CheckoutFormData) => {
    if (!isLoggedIn || !cliente?.id || !token) {
      toast({
        title: t('checkout.error.title'),
        description: 'Debe iniciar sesión para realizar el pedido.',
        variant: 'destructive',
      })
      return
    }

    const ciudadNombre = ciudades.find((c) => c.id === data.idCiudad)?.nombre ?? ''
    const provinciaNombre = provincias.find((p) => p.id === data.idProvincia)?.nombre ?? ''
    const distritoNombre = data.idDistrito ? (distritos.find((d) => d.id === data.idDistrito)?.nombre ?? '') : ''
    const addrFromMapStr = toAddressString(addressFromMap)
    const direccion_entrega = addrFromMapStr
      ? [data.address, addrFromMapStr].filter(Boolean).join(', ')
      : [data.address, distritoNombre, provinciaNombre, ciudadNombre, data.country].filter(Boolean).join(', ')

    const aplicaTarifaPlana = tarifaPlana?.provincia_ids?.includes(data.idProvincia) ?? false
    const costo_envio = aplicaTarifaPlana ? (tarifaPlana?.costo_envio ?? 20) : 0

    setIsSubmitting(true)

    try {
      const body = {
        id_cliente: cliente.id,
        detalles: items.map((i) => ({
          sku: i.product.sku,
          cantidad: i.quantity,
          precio_unitario: i.product.precio_venta ?? 0,
        })),
        direccion_entrega: direccion_entrega || undefined,
        instrucciones_entrega: data.notes || undefined,
        contacto_recepcion: [data.firstName, data.lastName].filter(Boolean).join(' ') || undefined,
        telefono_contacto_entrega: data.phone || undefined,
        costo_envio,
      }

      const res = await pedidosService.crearPedido(body, token)

      if (!res.success || !res.data?.id) {
        toast({
          title: t('checkout.error.title'),
          description: t('checkout.error.description'),
          variant: 'destructive',
        })
        return
      }

      clearCart()
      const numero = res.data.numero ?? String(res.data.id)

      toast({
        title: t('checkout.success.title'),
        description: t('checkout.success.description', { orderId: numero }),
      })

      router.push(`/${locale}/pedido/${res.data.id}?numero=${encodeURIComponent(numero)}`)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          const msg =
            error.detail?.message ||
            'Algunos productos ya no están disponibles. Actualice el carrito o contacte a soporte.'
          toast({
            title: t('checkout.error.title'),
            description: msg,
            variant: 'destructive',
          })
          return
        }
        if (error.status === 401 || error.status === 403) {
          toast({
            title: 'Sesión requerida',
            description: 'Inicie sesión para continuar con la compra.',
            variant: 'destructive',
          })
          router.push(`/${locale}/login?redirect=checkout`)
          return
        }
        if (error.status >= 500) {
          toast({
            title: t('checkout.error.title'),
            description: 'No pudimos crear el pedido. Intente más tarde o contacte a soporte.',
            variant: 'destructive',
          })
          return
        }
      }
      toast({
        title: t('checkout.error.title'),
        description: t('checkout.error.description'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-white" />
            <h3 className="text-2xl font-bold text-white">Carrito vacío</h3>
          </div>
        </div>
        <div className="p-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed max-w-md mx-auto">
              Agrega algunos productos antes de proceder al checkout.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <a href={`/${locale}/catalogo`}>Explorar Productos</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Aviso: iniciar sesión o registrarse cuando no está logueado */}
      {!isLoggedIn && (
        <Card className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-10 w-10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Para continuar con tu compra debes iniciar sesión o registrarte
                </h3>
                <p className="text-amber-800 dark:text-amber-200 mb-4">
                  Inicia sesión si ya tienes cuenta o crea una nueva para finalizar tu pedido.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" asChild variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-100 dark:border-amber-500 dark:text-amber-300 dark:hover:bg-amber-900/50">
                    <Link href={`/${locale}/login?redirect=checkout`}>Iniciar sesión</Link>
                  </Button>
                  <Button type="button" asChild className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Link href={`/${locale}/registro?redirect=checkout`}>Registrarse</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información Personal y Dirección: solo cuando está logueado */}
      {isLoggedIn && (
        <>
      <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-medium">Nombre</Label>
              <Input
                id="firstName"
                className="border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                {...form.register('firstName')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-medium">Apellido</Label>
              <Input
                id="lastName"
                className="border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                {...form.register('lastName')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                className="pl-10 border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                {...form.register('email')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium">Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                className="pl-10 border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                {...form.register('phone')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            Dirección de entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="idCiudad" className="text-gray-700 dark:text-gray-300 font-medium">Departamento / Región</Label>
            <select
              id="idCiudad"
              className="flex h-10 w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-green-500 dark:focus:border-green-400 focus:outline-none disabled:opacity-50"
              value={form.watch('idCiudad') || ''}
              onChange={(e) => form.setValue('idCiudad', e.target.value ? Number(e.target.value) : 0)}
              disabled={loadingUbigeo.ciudades}
            >
              <option value="">{loadingUbigeo.ciudades ? 'Cargando...' : 'Seleccione departamento'}</option>
              {ciudades.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {form.formState.errors.idCiudad && (
              <p className="text-sm text-red-600 dark:text-red-400">{form.formState.errors.idCiudad.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idProvincia" className="text-gray-700 dark:text-gray-300 font-medium">Provincia</Label>
            <select
              id="idProvincia"
              className="flex h-10 w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-green-500 dark:focus:border-green-400 focus:outline-none disabled:opacity-50"
              value={form.watch('idProvincia') || ''}
              onChange={(e) => form.setValue('idProvincia', e.target.value ? Number(e.target.value) : 0)}
              disabled={!idCiudad || idCiudad < 1 || loadingUbigeo.provincias}
            >
              <option value="">{loadingUbigeo.provincias ? 'Cargando...' : 'Seleccione provincia'}</option>
              {provincias.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            {form.formState.errors.idProvincia && (
              <p className="text-sm text-red-600 dark:text-red-400">{form.formState.errors.idProvincia.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idDistrito" className="text-gray-700 dark:text-gray-300 font-medium">Distrito (opcional)</Label>
            <select
              id="idDistrito"
              className="flex h-10 w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-green-500 dark:focus:border-green-400 focus:outline-none disabled:opacity-50"
              value={form.watch('idDistrito') ?? ''}
              onChange={(e) => form.setValue('idDistrito', e.target.value ? Number(e.target.value) : undefined)}
              disabled={!idProvincia || idProvincia < 1 || loadingUbigeo.distritos}
            >
              <option value="">{loadingUbigeo.distritos ? 'Cargando...' : 'Seleccione distrito'}</option>
              {distritos.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700 dark:text-gray-300 font-medium">Dirección (calle, número, referencia)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Textarea
                id="address"
                placeholder="Ej: Av. Principal 123, Mz A Lt 5, ref. Frente al parque"
                className="pl-10 border-gray-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 rounded-lg"
                {...form.register('address')}
              />
            </div>
            {form.formState.errors.address && (
              <p className="text-sm text-red-600 dark:text-red-400">{form.formState.errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-gray-700 dark:text-gray-300 font-medium">País</Label>
            <Input
              id="country"
              className="border-gray-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 rounded-lg"
              {...form.register('country')}
            />
          </div>

          {/* Búsqueda de dirección (opcional): autocompletado con debounce */}
          <div className="space-y-2">
            <Label htmlFor="address-search" className="text-gray-700 dark:text-gray-300 font-medium">
              Buscar dirección (opcional)
            </Label>
            <div className="relative">
              <Input
                id="address-search"
                type="text"
                placeholder="Escribe para buscar y ubicar en el mapa..."
                value={autocompleteQuery}
                onChange={(e) => setAutocompleteQuery(e.target.value)}
                onBlur={() => setTimeout(() => setAutocompleteSuggestions([]), 200)}
                className="pr-10 border-gray-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 rounded-lg"
                aria-autocomplete="list"
                aria-expanded={autocompleteSuggestions.length > 0}
                aria-label="Buscar dirección para ubicar en el mapa"
              />
              {loadingAutocomplete && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Buscando...</span>
              )}
              {autocompleteSuggestions.length > 0 && (
                <ul
                  className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg max-h-48 overflow-auto"
                  role="listbox"
                >
                  {autocompleteSuggestions.map((s) => (
                    <li
                      key={s.place_id}
                      role="option"
                      aria-selected={false}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-600 last:border-0"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleSelectPlace(s.place_id)
                      }}
                    >
                      {s.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Mapa: sincronizado con selectores; al arrastrar el marcador se actualiza la dirección (reverse) */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-medium">Ubicación en el mapa</Label>
            {(() => {
              const addrDisplay = toAddressString(addressFromMap)
              return addrDisplay ? (
                <p className="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
                  Dirección detectada: {addrDisplay}
                </p>
              ) : null
            })()}
            <DeliveryAddressMap
              lat={mapLat}
              lng={mapLng}
              onMarkerMove={handleMarkerMove}
              center={mapLat != null && mapLng != null ? undefined : { lat: -12.046374, lng: -77.042793 }}
              zoom={14}
              loading={loadingMap.geocode || loadingMap.reverse}
              error={errorMap}
              onErrorRetry={() => setErrorMap(null)}
              height={280}
              className="min-h-[280px]"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Arrastra el marcador para afinar la ubicación. La dirección se actualizará automáticamente.
            </p>
          </div>

          {idProvincia >= 1 && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 text-sm text-green-800 dark:text-green-200">
              {tarifaPlana?.provincia_ids?.includes(idProvincia) ? (
                <>Costo de envío: <strong>S/ {tarifaPlana?.costo_envio ?? 20}</strong> (tarifa plana Lima/Callao)</>
              ) : (
                <>Envío a consultar según destino</>
              )}
            </div>
          )}
        </CardContent>
      </Card>
        </>
      )}

      {/* Método de Pago: solo Transferencia bancaria y Yape */}
      <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            Método de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <RadioGroup
            value={form.watch('paymentMethod')}
            onValueChange={(value) => form.setValue('paymentMethod', value as 'transfer' | 'yape')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
              <RadioGroupItem value="transfer" id="transfer" />
              <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Transferencia Bancaria</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pago por transferencia</p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
              <RadioGroupItem value="yape" id="yape" />
              <Label htmlFor="yape" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                    <QrCode className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{t('checkout.payment.yape')}</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('checkout.payment.yapeDescription')}</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {/* Datos de transferencia BCP - visible solo cuando está seleccionado */}
          {form.watch('paymentMethod') === 'transfer' && (
            <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
              <p className="font-medium text-gray-900 dark:text-white mb-4">BCP – Transferencia bancaria</p>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200 mb-1">Soles (PEN)</p>
                  <p className="text-gray-700 dark:text-gray-300">Cta Cte 192-7293189-0-73</p>
                  <p className="text-gray-600 dark:text-gray-400">CCI: 002-192-007293189073-34</p>
                </div>
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200 mb-1">Dólares (USD)</p>
                  <p className="text-gray-700 dark:text-gray-300">Cta Cte 1917331690183</p>
                  <p className="text-gray-600 dark:text-gray-400">CCI: 00219100733169018351</p>
                </div>
              </div>
            </div>
          )}

          {/* QR de Yape - visible solo cuando está seleccionado */}
          {form.watch('paymentMethod') === 'yape' && (
            <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
              <p className="text-center font-medium text-gray-900 dark:text-white mb-4">
                {t('checkout.payment.yapeInstructions')}
              </p>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-48 h-48 bg-white rounded-xl p-3 shadow-lg">
                  <Image
                    src="/qr_inxora.jpeg"
                    alt="QR Yape - Inxora"
                    fill
                    className="object-contain rounded-lg"
                    sizes="192px"
                  />
                </div>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  {t('checkout.payment.yapeScan')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notas Adicionales y Términos: solo cuando está logueado */}
      {isLoggedIn && (
        <>
      <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            Notas Adicionales
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            placeholder="Instrucciones especiales para la entrega..."
            className="border-gray-200 dark:border-slate-600 focus:border-gray-500 dark:focus:border-gray-400 rounded-lg"
            {...form.register('notes')}
          />
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="acceptTerms"
              checked={form.watch('acceptTerms')}
              onCheckedChange={(checked) => form.setValue('acceptTerms', checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer">
              Acepto los <Link href={`/${locale}/terminos`} className="text-blue-600 dark:text-blue-400 hover:underline">términos y condiciones</Link> y la <Link href={`/${locale}/privacidad`} className="text-blue-600 dark:text-blue-400 hover:underline">política de privacidad</Link>
            </Label>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="newsletter"
              checked={form.watch('newsletter')}
              onCheckedChange={(checked) => form.setValue('newsletter', checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="newsletter" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer">
              Quiero recibir ofertas y novedades por correo electrónico
            </Label>
          </div>
        </CardContent>
      </Card>
        </>
      )}

      {/* Botón de Envío: deshabilitado si no está logueado */}
      <Button
        type="submit"
        disabled={isSubmitting || !isLoggedIn}
        className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Procesando...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Realizar Pedido</span>
          </div>
        )}
      </Button>
    </form>
  )
}