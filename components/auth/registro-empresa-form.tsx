'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { clienteApi } from '@/lib/api/cliente-api'
import { ApiError, apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Building2,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { legalPageHref, legalPageAbsoluteTienda } from '@/lib/i18n/legal-routes'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegistroEmpresaFormProps {
  locale: string
  /** Usado en la página /registro. En modal, dejar vacío y usar onSuccess. */
  redirectTo?: string
  redirectParam?: string
  /** Callback para cuando se usa dentro de un modal (reemplaza el router.push). */
  onSuccess?: () => void
  /** En modal: muestra «¿Ya tienes cuenta?» y cambia a login sin salir del diálogo. */
  onSwitchToLogin?: () => void
}

type RucStatus = 'idle' | 'consulting' | 'valid' | 'invalid'
type Rubro = { id: number; nombre: string; activo?: boolean }
type Pais = {
  id: number
  nombre: string
  activo?: boolean
  codigo?: string | null
  iso_code_2?: string | null
  nombre_doc_empresa?: string | null
  patron_doc_empresa?: string | null
  prefijo_telefonico?: string | null
  patron_telefono?: string | null
}

interface ContactoForm {
  uid: string
  nombres: string
  apellidos: string
  correo: string
  telefono: string
  touched: Record<string, boolean>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _uidCounter = 0
const newUid = () => `ctc-${++_uidCounter}`

function makeContacto(): ContactoForm {
  return { uid: newUid(), nombres: '', apellidos: '', correo: '', telefono: '', touched: {} }
}

function extractPaises(payload: unknown): Pais[] {
  if (Array.isArray(payload)) return payload as Pais[]
  if (!payload || typeof payload !== 'object') return []

  const obj = payload as {
    data?: unknown
    items?: unknown
    results?: unknown
  }

  if (Array.isArray(obj.data)) return obj.data as Pais[]
  if (Array.isArray(obj.items)) return obj.items as Pais[]
  if (Array.isArray(obj.results)) return obj.results as Pais[]

  if (obj.data && typeof obj.data === 'object') {
    const nested = obj.data as { items?: unknown; results?: unknown; data?: unknown }
    if (Array.isArray(nested.items)) return nested.items as Pais[]
    if (Array.isArray(nested.results)) return nested.results as Pais[]
    if (Array.isArray(nested.data)) return nested.data as Pais[]
  }

  return []
}

function toRegex(pattern?: string | null): RegExp | null {
  if (!pattern) return null
  try {
    return new RegExp(pattern)
  } catch {
    return null
  }
}

function normalizePhoneForSubmit(rawValue: string, prefix?: string | null): string {
  const trimmed = rawValue.trim()
  if (!trimmed) return ''
  const cleaned = trimmed.replace(/[^\d+]/g, '')
  if (cleaned.startsWith('+')) return cleaned
  const safePrefix = (prefix ?? '').trim()
  if (!safePrefix) return cleaned
  const normalizedPrefix = safePrefix.startsWith('+') ? safePrefix : `+${safePrefix}`
  return `${normalizedPrefix}${cleaned.replace(/^\+/, '')}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RegistroEmpresaForm({ locale, redirectTo, redirectParam, onSuccess, onSwitchToLogin }: RegistroEmpresaFormProps) {
  const router = useRouter()
  const { login } = useClienteAuth()
  const t = useTranslations('auth')

  // — RUC —
  const [ruc, setRuc] = useState('')
  const [rucStatus, setRucStatus] = useState<RucStatus>('idle')
  const [rucError, setRucError] = useState<string | null>(null)
  const [razonSocial, setRazonSocial] = useState('')
  const [documentoEmpresa, setDocumentoEmpresa] = useState('')
  const latestRucRef = useRef('')

  // — País —
  const [paises, setPaises] = useState<Pais[]>([])
  const [idPais, setIdPais] = useState<number | ''>(1)

  // — Rubros —
  const [rubros, setRubros] = useState<Rubro[]>([])
  const [idRubro, setIdRubro] = useState<number | ''>('')

  useEffect(() => {
    apiClient<{ success?: boolean; data?: { rubros?: Rubro[] } | Rubro[] }>('/api/rubros/?limit=200')
      .then((res) => {
        const raw = (res as { data?: { rubros?: Rubro[] } | Rubro[] }).data
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as { rubros?: Rubro[] })?.rubros)
          ? (raw as { rubros: Rubro[] }).rubros
          : []
        const active = list.filter((r) => r.activo !== false)
        setRubros(active)
      })
      .catch(() => setRubros([]))
  }, [])

  useEffect(() => {
    apiClient<Pais[] | { success?: boolean; data?: Pais[] }>('/api/paises?limit=250')
      .then((res) => {
        const list = extractPaises(res)
        const active = list.filter((p) => p.activo !== false)
        if (active.length === 0) {
          setPaises([{ id: 1, nombre: 'Perú', activo: true }])
          setIdPais(1)
          return
        }
        setPaises(active)
        setIdPais((prev) => {
          if (prev !== '' && active.some((p) => p.id === prev)) return prev
          const peru = active.find((p) =>
            p.id === 1 || p.codigo === 'PE' || p.iso_code_2 === 'PE' || p.nombre.toLowerCase().includes('peru'),
          )
          return (peru ?? active[0]).id
        })
      })
      .catch(() => {
        setPaises([{ id: 1, nombre: 'Perú', activo: true }])
        setIdPais(1)
      })
  }, [])

  const selectedPais = idPais === '' ? null : paises.find((p) => p.id === idPais) ?? null
  const isPeruSelected =
    !!selectedPais &&
    (selectedPais.id === 1 ||
      selectedPais.codigo === 'PE' ||
      selectedPais.iso_code_2 === 'PE' ||
      selectedPais.nombre.toLowerCase().includes('peru'))
  const docEmpresaLabel = selectedPais?.nombre_doc_empresa?.trim() || (isPeruSelected ? 'RUC' : t('empresa.docFiscalFallback'))
  const docEmpresaRegex = toRegex(selectedPais?.patron_doc_empresa)
  const phonePrefix = selectedPais?.prefijo_telefonico?.trim() || ''
  const phoneRegex = toRegex(selectedPais?.patron_telefono)

  const getContactoErrors = useCallback(
    (c: ContactoForm): Record<string, string> => {
      const tel = c.telefono.trim()
      const telefonoNormalized = normalizePhoneForSubmit(tel, phonePrefix)
      return {
        nombres: c.nombres.trim() ? '' : t('empresa.errors.nombresRequired'),
        apellidos: c.apellidos.trim() ? '' : t('empresa.errors.apellidosRequired'),
        correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.correo) ? '' : t('empresa.errors.correoInvalid'),
        telefono:
          !tel
            ? t('empresa.errors.telefonoRequired')
            : phoneRegex && !phoneRegex.test(telefonoNormalized)
              ? t('empresa.errors.telefonoInvalid')
              : '',
      }
    },
    [t, phoneRegex, phonePrefix],
  )

  const isContactoValid = useCallback(
    (c: ContactoForm) => Object.values(getContactoErrors(c)).every((v) => !v),
    [getContactoErrors],
  )

  // — Password —
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwTouched, setPwTouched] = useState(false)
  const [cpTouched, setCpTouched] = useState(false)

  // — Contacts —
  const [contactos, setContactos] = useState<ContactoForm[]>([makeContacto()])

  // — Términos —
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  // — Submit —
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successRazonSocial, setSuccessRazonSocial] = useState<string | null>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  // Auto-consult RUC on 11 digits
  useEffect(() => {
    if (!isPeruSelected) {
      setRucStatus('idle')
      setRucError(null)
      return
    }
    if (ruc.length < 11) {
      setRucStatus('idle')
      setRucError(null)
      return
    }
    latestRucRef.current = ruc
    const queried = ruc
    setRucStatus('consulting')
    setRucError(null)
    setRazonSocial('')

    clienteApi.consultarRuc(queried)
      .then((res) => {
        if (latestRucRef.current !== queried) return
        if (res.success && res.data?.razon_social) {
          setRazonSocial(res.data.razon_social)
          setRucStatus('valid')
        } else {
          setRucStatus('invalid')
          setRucError(t('empresa.rucNotFound'))
        }
      })
      .catch((e) => {
        if (latestRucRef.current !== queried) return
        setRucStatus('invalid')
        setRucError(e instanceof ApiError ? e.message : t('empresa.rucInvalid'))
      })
  }, [ruc, isPeruSelected, t])

  // — Password errors —
  const pwError  = pwTouched && password.length > 0 && password.length < 8 ? t('empresa.pwMin') : ''
  const cpError  = cpTouched && confirmPw !== password ? t('empresa.pwMismatch') : ''

  // — Contacts helpers —
  const updateContacto = useCallback(
    (uid: string, field: 'nombres' | 'apellidos' | 'correo' | 'telefono', value: string) => {
      setContactos((prev) => prev.map((c) => (c.uid === uid ? { ...c, [field]: value } : c)))
    },
    [],
  )

  const touchContactoField = useCallback((uid: string, field: string) => {
    setContactos((prev) =>
      prev.map((c) => (c.uid === uid ? { ...c, touched: { ...c.touched, [field]: true } } : c)),
    )
  }, [])

  // — Global validity —
  const isFormValid = () =>
    (isPeruSelected
      ? ruc.length === 11 && rucStatus !== 'consulting' && rucStatus === 'valid'
      : documentoEmpresa.trim().length >= 3 && (!docEmpresaRegex || docEmpresaRegex.test(documentoEmpresa.trim()))) &&
    !!razonSocial.trim() &&
    idPais !== '' &&
    idRubro !== '' &&
    password.length >= 8 &&
    password === confirmPw &&
    contactos.every((c) => isContactoValid(c)) &&
    aceptaTerminos

  const buildNombreCompleto = (c: ContactoForm) => `${c.nombres.trim()} ${c.apellidos.trim()}`.trim()

  // — Submit —
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwTouched(true)
    setCpTouched(true)
    setContactos((prev) =>
      prev.map((c) => ({
        ...c,
        touched: { nombres: true, apellidos: true, correo: true, telefono: true },
      })),
    )
    if (!isFormValid()) return

    setSubmitting(true)
    setSubmitError(null)
    const principal = contactos[0]
    const principalNombreCompleto = buildNombreCompleto(principal)

    try {
      const res = await clienteApi.registroEmpresaV2({
        documento_empresa: isPeruSelected ? ruc : documentoEmpresa.trim(),
        razon_social: razonSocial.trim(),
        nombre_contacto_principal: principalNombreCompleto,
        correo_contacto_principal: principal.correo.trim().toLowerCase(),
        telefono_contacto_principal: normalizePhoneForSubmit(principal.telefono, phonePrefix),
        contrasena: password,
        id_rubro: idRubro as number,
        id_pais: idPais as number,
        id_forma_pago: 1,
        activo: true,
        contactos: contactos.map((c, i) => ({
          nombres: c.nombres.trim(),
          apellidos: c.apellidos.trim(),
          nombre_completo: buildNombreCompleto(c),
          correo: c.correo.trim().toLowerCase(),
          telefono: normalizePhoneForSubmit(c.telefono, phonePrefix),
          es_contacto_principal: i === 0,
          roles: [5],
        })),
        acepta_terminos: true,
      })

      if (res.success) {
        try {
          await login(principal.correo.trim().toLowerCase(), password)
        } catch {
          // auto-login fallido — continuar igual
        }
        if (onSuccess) {
          onSuccess()
        } else {
          setSuccessRazonSocial(razonSocial)
          router.push(redirectTo ?? '/')
        }
      } else {
        setSubmitError(res.message || t('empresa.errorRegister'))
      }
    } catch (e) {
      if (e instanceof ApiError) {
        const detail = e.detail
        const msg = typeof detail === 'string' ? detail : detail?.message ?? e.message
        setSubmitError(msg)
      } else {
        setSubmitError(e instanceof Error ? e.message : t('empresa.errorRegister'))
      }
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Success screen ───────────────────────────────────────────────────────
  if (successRazonSocial) {
    return (
      <div className="space-y-4 text-center py-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('empresa.successTitle')}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {t('empresa.successMessage', { name: successRazonSocial })}
        </p>
        {!onSuccess && (
          <Button
            onClick={() => router.push(`/${locale}/login?redirect=${encodeURIComponent(redirectParam ?? '/')}`)}
            className="w-full"
          >
            {t('empresa.goLogin')}
          </Button>
        )}
      </div>
    )
  }

  // ─── Form ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ══ Sección 1: Datos de la empresa ══════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader icon={<Building2 className="h-4 w-4" />} title={t('empresa.sectionCompany')} />

        {/* País */}
        <div className="space-y-1.5">
          <Label htmlFor="pais-empresa">{t('empresa.country')}</Label>
          <Select
            value={idPais === '' ? '' : String(idPais)}
            onValueChange={(v) => {
              const next = Number(v)
              setIdPais(Number.isFinite(next) ? next : '')
              setRuc('')
              setDocumentoEmpresa('')
              setRucStatus('idle')
              setRucError(null)
              setRazonSocial('')
              setContactos((prev) => prev.map((c) => ({ ...c, telefono: '' })))
            }}
          >
            <SelectTrigger id="pais-empresa">
              <SelectValue placeholder={t('empresa.countryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {paises.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Documento empresa (Perú: RUC con SUNAT | otros países: manual) */}
        <div className="space-y-1.5">
          <Label htmlFor="ruc-empresa">
            {docEmpresaLabel}
          </Label>
          <div className="relative">
            {isPeruSelected ? (
              <>
                <Input
                  id="ruc-empresa"
                  value={ruc}
                  onChange={(e) => setRuc(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  className={cn(
                    'pr-10',
                    rucStatus === 'valid'   && 'border-green-500 focus-visible:ring-green-500',
                    rucStatus === 'invalid' && 'border-red-500   focus-visible:ring-red-500',
                  )}
                  placeholder={t('empresa.digits11')}
                  maxLength={11}
                  inputMode="numeric"
                />
                {rucStatus === 'consulting' && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
                )}
                {rucStatus === 'valid' && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </>
            ) : (
              <>
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="ruc-empresa"
                  value={documentoEmpresa}
                  onChange={(e) => setDocumentoEmpresa(e.target.value)}
                  className="pl-10"
                  placeholder={t('natural.enterDoc', { label: docEmpresaLabel })}
                />
              </>
            )}
          </div>
          {isPeruSelected && rucStatus === 'consulting' && (
            <p className="text-xs text-blue-600 dark:text-blue-400">{t('empresa.consultingSunat')}</p>
          )}
          {isPeruSelected && rucError && <p className="text-xs text-red-600 dark:text-red-400">{rucError}</p>}
          {!isPeruSelected && documentoEmpresa.trim().length > 0 && docEmpresaRegex && !docEmpresaRegex.test(documentoEmpresa.trim()) && (
            <p className="text-xs text-red-600 dark:text-red-400">{t('natural.invalidDoc', { label: docEmpresaLabel })}</p>
          )}
        </div>

        {/* Razón Social — en Perú se auto-rellena por SUNAT, fuera de Perú es manual */}
        <div className="space-y-1.5">
          <Label htmlFor="razon-social">{t('empresa.razonSocial')}</Label>
          <Input
            id="razon-social"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            placeholder={t('empresa.razonSocialPlaceholder')}
            className={cn(
              rucStatus === 'valid' && razonSocial &&
                'border-green-300 dark:border-green-700',
            )}
          />
        </div>

        {/* Rubro */}
        <div className="space-y-1.5">
          <Label htmlFor="rubro-empresa">{t('empresa.rubro')}</Label>
          <Select
            value={idRubro === '' ? '' : String(idRubro)}
            onValueChange={(v) => setIdRubro(Number(v))}
          >
            <SelectTrigger id="rubro-empresa">
              <SelectValue placeholder={t('empresa.rubroPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {rubros.map((r) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pw-empresa">{t('empresa.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="pw-empresa"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPwTouched(true)}
                className={cn('pl-10', pwError && 'border-red-500 focus-visible:ring-red-500')}
                placeholder={t('empresa.passwordPlaceholder')}
              />
            </div>
            {pwError && <p className="text-xs text-red-600 dark:text-red-400">{pwError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpw-empresa">{t('empresa.confirmPassword')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="cpw-empresa"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                onBlur={() => setCpTouched(true)}
                className={cn('pl-10', cpError && 'border-red-500 focus-visible:ring-red-500')}
              />
            </div>
            {cpError && <p className="text-xs text-red-600 dark:text-red-400">{cpError}</p>}
          </div>
        </div>
      </div>

      {/* ══ Sección 2: Contacto ═════════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader icon={<User className="h-4 w-4" />} title={t('empresa.sectionContact')} />

        {contactos.map((contacto) => {
          const errs = getContactoErrors(contacto)
          const touched = contacto.touched

          return (
            <div
              key={contacto.uid}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/60 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {/* Nombres y apellidos separados */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldWrapper
                    id={`nombres-${contacto.uid}`}
                    label={t('empresa.nombres')}
                    error={touched.nombres ? errs.nombres : ''}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        id={`nombres-${contacto.uid}`}
                        value={contacto.nombres}
                        onChange={(e) => updateContacto(contacto.uid, 'nombres', e.target.value)}
                        onBlur={() => touchContactoField(contacto.uid, 'nombres')}
                        className={cn(
                          'pl-9 h-9 text-sm',
                          touched.nombres && errs.nombres && 'border-red-500 focus-visible:ring-red-500',
                        )}
                        placeholder={t('empresa.nombres')}
                      />
                    </div>
                  </FieldWrapper>
                  <FieldWrapper
                    id={`apellidos-${contacto.uid}`}
                    label={t('empresa.apellidos')}
                    error={touched.apellidos ? errs.apellidos : ''}
                  >
                    <Input
                      id={`apellidos-${contacto.uid}`}
                      value={contacto.apellidos}
                      onChange={(e) => updateContacto(contacto.uid, 'apellidos', e.target.value)}
                      onBlur={() => touchContactoField(contacto.uid, 'apellidos')}
                      className={cn(
                        'h-9 text-sm',
                        touched.apellidos && errs.apellidos && 'border-red-500 focus-visible:ring-red-500',
                      )}
                      placeholder={t('empresa.apellidos')}
                    />
                  </FieldWrapper>
                </div>

                {/* Correo */}
                <FieldWrapper
                  id={`correo-${contacto.uid}`}
                  label={t('empresa.correo')}
                  error={touched.correo ? errs.correo : ''}
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      id={`correo-${contacto.uid}`}
                      type="email"
                      value={contacto.correo}
                      onChange={(e) => updateContacto(contacto.uid, 'correo', e.target.value)}
                      onBlur={() => touchContactoField(contacto.uid, 'correo')}
                      className={cn(
                        'pl-9 h-9 text-sm',
                        touched.correo && errs.correo && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                  </div>
                </FieldWrapper>

                {/* Teléfono */}
                <FieldWrapper
                  id={`telefono-${contacto.uid}`}
                  label={t('empresa.telefono')}
                  error={touched.telefono ? errs.telefono : ''}
                >
                  <div className="flex">
                    {phonePrefix && (
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-xs text-gray-600 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-300">
                        {phonePrefix}
                      </span>
                    )}
                    <div className="relative flex-1">
                      {!phonePrefix && (
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      )}
                      <Input
                        id={`telefono-${contacto.uid}`}
                        type="tel"
                        value={contacto.telefono}
                        onChange={(e) => updateContacto(contacto.uid, 'telefono', e.target.value.replace(/[^\d]/g, ''))}
                        onBlur={() => touchContactoField(contacto.uid, 'telefono')}
                        className={cn(
                          `${phonePrefix ? 'rounded-l-none pl-3' : 'pl-9'} h-9 text-sm`,
                          touched.telefono && errs.telefono && 'border-red-500 focus-visible:ring-red-500',
                        )}
                        placeholder={phonePrefix ? t('natural.phoneNumber') : undefined}
                      />
                    </div>
                  </div>
                </FieldWrapper>


              </div>
            </div>
          )
        })}
      </div>

      {/* Términos y condiciones */}
      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-blue-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            {t('legal.termsLead')}{' '}
            <Link
              href={legalPageHref(locale, 'terms')}
              target="_blank"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {t('legal.termsLink')}
            </Link>
            {' '}{t('legal.andThe')}{' '}
            <Link
              href={legalPageHref(locale, 'privacy')}
              target="_blank"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {t('legal.privacyLink')}
            </Link>
          </span>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-7">
          {t('legal.paragraph')}{' '}
          <Link
            href={legalPageAbsoluteTienda(locale, 'privacy')}
            target="_blank"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('legal.privacyLink')}
          </Link>
          {' '}{t('legal.privacySuffix')}
        </p>
      </div>

      {/* Error de envío — visible junto al botón */}
      {submitError && (
        <div
          ref={errorRef}
          className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
        >
          {submitError}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={submitting || !isFormValid()}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('empresa.submitting')}
          </>
        ) : (
          t('empresa.submit')
        )}
      </Button>

      {(!onSuccess || onSwitchToLogin) && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t('empresa.hasAccount')}{' '}
          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {t('empresa.loginLink')}
            </button>
          ) : (
            <Link
              href={`/${locale}/login?redirect=${encodeURIComponent(redirectParam ?? '/')}`}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {t('empresa.loginLink')}
            </Link>
          )}
        </p>
      )}
    </form>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-1 border-b border-gray-200 dark:border-gray-700">
      <span className="text-gray-500 dark:text-gray-400">{icon}</span>
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
        {title}
      </h3>
    </div>
  )
}

function FieldWrapper({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
