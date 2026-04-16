'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { useAuthModal } from '@/lib/contexts/auth-modal-context'
import { apiClient } from '@/lib/api/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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
import { Building2, FileText, Lock, LogIn, Mail, Phone, User } from 'lucide-react'
import { RegistroEmpresaForm } from '@/components/auth/registro-empresa-form'
import { useTranslations } from 'next-intl'
import { legalPageHref, legalPageAbsoluteTienda } from '@/lib/i18n/legal-routes'
import { cn } from '@/lib/utils'

type Rubro = { id: number; nombre: string; activo?: boolean }
type Pais = {
  id: number
  nombre: string
  activo?: boolean
  codigo?: string | null
  iso_code_2?: string | null
  nombre_doc_personal?: string | null
  patron_doc_personal?: string | null
  prefijo_telefonico?: string | null
  patron_telefono?: string | null
}
type Mode = 'login' | 'register'
type TipoRegistro = 'natural' | 'empresa'

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

export function AuthModal() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'es'
  const t = useTranslations('auth')
  const { isOpen, options, closeAuthModal } = useAuthModal()
  const { login, register, error, clearError } = useClienteAuth()

  const [mode, setMode] = useState<Mode>('login')
  const [tipoRegistro, setTipoRegistro] = useState<TipoRegistro>('empresa')
  const [loading, setLoading] = useState(false)
  const [formEpoch, setFormEpoch] = useState(0)

  // Login fields
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')

  // Register fields
  const [rubros, setRubros] = useState<Rubro[]>([])
  const [paises, setPaises] = useState<Pais[]>([])
  const [id_pais, setIdPais] = useState<number | ''>(1)
  const [id_rubro, setIdRubro] = useState<number | ''>('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [documento_personal, setDocumentoPersonal] = useState('')
  const [regCorreo, setRegCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    clearError()
    setMode(options.initialMode ?? 'login')
    setCorreo('')
    setPassword('')
    setNombre('')
    setApellidos('')
    setDocumentoPersonal('')
    setRegCorreo('')
    setTelefono('')
    setRegPassword('')
    setAceptaTerminos(false)
    setIdRubro('')
    setIdPais(1)
    setTipoRegistro('empresa')
    setFormEpoch((v) => v + 1)
  }, [isOpen, clearError, options.initialMode])

  useEffect(() => {
    // Reintentar carga cada vez que se abre el modal de registro.
    // Evita quedar "pegado" en fallback (solo Perú) si la primera petición falló.
    if (!isOpen || mode !== 'register') return

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
        if (active.length > 0) {
          setIdRubro((prev) => (prev !== '' && active.some((r) => r.id === prev) ? prev : active[0].id))
        }
      })
      .catch(() => setRubros([]))

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
  }, [isOpen, mode])

  const selectedPais = id_pais === '' ? null : paises.find((p) => p.id === id_pais) ?? null
  const docPersonalLabel = selectedPais?.nombre_doc_personal?.trim() || t('natural.docFallback')
  const docPersonalRegex = toRegex(selectedPais?.patron_doc_personal)
  const phonePrefix = selectedPais?.prefijo_telefonico?.trim() || ''
  const phoneRegex = toRegex(selectedPais?.patron_telefono)

  const handleSuccess = () => {
    closeAuthModal()
    options.onSuccess?.()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) closeAuthModal()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      await login(correo.trim().toLowerCase(), password)
      handleSuccess()
    } catch {
      // error en context
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (docPersonalRegex && !docPersonalRegex.test(documento_personal.trim())) return
    const telefonoNormalizado = normalizePhoneForSubmit(telefono, phonePrefix)
    if (telefonoNormalizado && phoneRegex && !phoneRegex.test(telefonoNormalizado)) return
    const rubroId = id_rubro === '' ? undefined : id_rubro
    setLoading(true)
    try {
      await register({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        documento_personal: documento_personal.trim(),
        correo: regCorreo.trim().toLowerCase(),
        telefono: telefonoNormalizado || undefined,
        password: regPassword,
        id_pais: id_pais === '' ? undefined : id_pais,
        id_rubro: rubroId ?? rubros[0]?.id,
        acepta_terminos: true,
      })
      handleSuccess()
    } catch {
      // error en context
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (next: Mode) => {
    clearError()
    setMode(next)
    setTipoRegistro('empresa')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          'transition-all duration-300',
          mode === 'register' && tipoRegistro !== 'natural'
            ? 'max-w-[min(32rem,calc(100vw-2rem))]'
            : 'max-w-[min(28rem,calc(100vw-2rem))]',
          mode === 'register' &&
            'pt-6 sm:pt-6 pb-6 sm:pb-6 max-sm:pt-[max(1.5rem,env(safe-area-inset-top,0px))] max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]',
        )}
      >
        {mode === 'login' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <LogIn className="h-5 w-5" />
                {t('login.title')}
              </DialogTitle>
              <DialogDescription>
                {t('login.description')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleLogin} className="space-y-4 mt-1">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="auth-correo">{t('login.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="auth-correo"
                    type="email"
                    placeholder={t('login.emailPlaceholder')}
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="pl-10"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-password">{t('login.password')}</Label>
                  <Link
                    href={`/${locale}/forgot-password`}
                    onClick={() => closeAuthModal()}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('login.submitting') : t('login.submit')}
              </Button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('login.noAccount')}{' '}
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  onClick={() => switchMode('register')}
                >
                  {t('login.registerLink')}
                </button>
              </p>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                {tipoRegistro === 'natural' ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                {t('register.title')}
              </DialogTitle>
              <DialogDescription>
                {t('register.description')}
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => { clearError(); setTipoRegistro('empresa') }}
                className={[
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all',
                  tipoRegistro === 'empresa'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500',
                ].join(' ')}
              >
                <Building2 className="h-4 w-4 shrink-0" />
                {t('register.tabCompany')}
              </button>
              <button
                type="button"
                onClick={() => { clearError(); setTipoRegistro('natural') }}
                className={[
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all',
                  tipoRegistro === 'natural'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500',
                ].join(' ')}
              >
                <User className="h-4 w-4 shrink-0" />
                {t('register.tabNatural')}
              </button>
            </div>

            {/* ── Empresa (default) ── */}
            {tipoRegistro === 'empresa' ? (
              <div className="mt-1">
                <RegistroEmpresaForm
                  key={`empresa-form-${formEpoch}`}
                  locale={locale}
                  onSuccess={handleSuccess}
                  onSwitchToLogin={() => {
                    clearError()
                    setMode('login')
                  }}
                />
              </div>
            ) : (

            /* ── Persona Natural ── */
            <form onSubmit={handleRegister} className="space-y-4 mt-1">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="auth-nombre">{t('natural.firstName')}</Label>
                  <Input
                    id="auth-nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auth-apellidos">{t('natural.lastName')}</Label>
                  <Input
                    id="auth-apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-pais">{t('natural.country')}</Label>
                <Select
                  value={id_pais === '' ? undefined : String(id_pais)}
                  onValueChange={(v) => {
                    setIdPais(v === '' ? '' : Number(v))
                    setTelefono('')
                  }}
                  required
                >
                  <SelectTrigger id="auth-pais" className="w-full">
                    <SelectValue placeholder={t('natural.countryPlaceholder')} />
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

              <div className="space-y-2">
                <Label htmlFor="auth-documento">{docPersonalLabel}</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="auth-documento"
                    value={documento_personal}
                    onChange={(e) => setDocumentoPersonal(e.target.value)}
                    className="pl-10"
                    placeholder={t('natural.enterDoc', { label: docPersonalLabel })}
                    minLength={selectedPais?.id === 1 ? 8 : undefined}
                    required
                  />
                </div>
                {docPersonalRegex && documento_personal.trim() && !docPersonalRegex.test(documento_personal.trim()) && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {t('natural.invalidDoc', { label: docPersonalLabel })}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-reg-correo">{t('natural.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="auth-reg-correo"
                    type="email"
                    value={regCorreo}
                    onChange={(e) => setRegCorreo(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-telefono">{t('natural.phoneOptional')}</Label>
                <div className="flex">
                  {phonePrefix && (
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-600 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-300">
                      {phonePrefix}
                    </span>
                  )}
                  <div className="relative flex-1">
                    {!phonePrefix && <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
                    <Input
                      id="auth-telefono"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value.replace(/[^\d]/g, ''))}
                      className={phonePrefix ? 'rounded-l-none pl-3' : 'pl-10'}
                      placeholder={phonePrefix ? t('natural.phoneNumber') : undefined}
                    />
                  </div>
                </div>
                {phoneRegex && telefono.trim() && !phoneRegex.test(normalizePhoneForSubmit(telefono, phonePrefix)) && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {t('natural.phoneInvalid', { country: selectedPais?.nombre ?? t('natural.countryFallback') })}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-rubro">{t('natural.sector')}</Label>
                <Select
                  value={id_rubro === '' ? undefined : String(id_rubro)}
                  onValueChange={(v) => setIdRubro(v === '' ? '' : Number(v))}
                  required
                >
                  <SelectTrigger id="auth-rubro" className="w-full">
                    <SelectValue placeholder={t('natural.sectorPlaceholder')} />
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

              <div className="space-y-2">
                <Label htmlFor="auth-reg-password">{t('natural.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="auth-reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="pl-10"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              {/* Términos y condiciones */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-blue-600"
                    required
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                    {t('legal.termsLead')}{' '}
                    <Link
                      href={legalPageHref(locale, 'terms')}
                      target="_blank"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('legal.termsLink')}
                    </Link>
                    {' '}{t('legal.andThe')}{' '}
                    <Link
                      href={legalPageHref(locale, 'privacy')}
                      target="_blank"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t('legal.privacyLink')}
                  </Link>
                  {' '}{t('legal.privacySuffix')}
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !aceptaTerminos}>
                {loading ? t('natural.submitting') : t('natural.submit')}
              </Button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('natural.hasAccount')}{' '}
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  onClick={() => switchMode('login')}
                >
                  {t('natural.loginLink')}
                </button>
              </p>
            </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
