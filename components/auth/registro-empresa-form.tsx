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
import { Badge } from '@/components/ui/badge'
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
  Loader2,
  Lock,
  Mail,
  Phone,
  Plus,
  User,
  X,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegistroEmpresaFormProps {
  locale: string
  /** Usado en la página /registro. En modal, dejar vacío y usar onSuccess. */
  redirectTo?: string
  redirectParam?: string
  /** Callback para cuando se usa dentro de un modal (reemplaza el router.push). */
  onSuccess?: () => void
}

type RucStatus = 'idle' | 'consulting' | 'valid' | 'invalid'
type Rubro = { id: number; nombre: string; activo?: boolean }

interface ContactoForm {
  uid: string
  nombre_completo: string
  correo: string
  telefono: string
  touched: Record<string, boolean>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _uidCounter = 0
const newUid = () => `ctc-${++_uidCounter}`

function makeContacto(): ContactoForm {
  return { uid: newUid(), nombre_completo: '', correo: '', telefono: '', touched: {} }
}

function getContactoErrors(c: ContactoForm): Record<string, string> {
  return {
    nombre_completo: c.nombre_completo.trim() ? '' : 'El nombre es requerido',
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.correo) ? '' : 'Correo inválido',
    telefono: c.telefono.trim() ? '' : 'El teléfono es requerido',
  }
}

function isContactoValid(c: ContactoForm): boolean {
  return Object.values(getContactoErrors(c)).every((v) => !v)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RegistroEmpresaForm({ locale, redirectTo, redirectParam, onSuccess }: RegistroEmpresaFormProps) {
  const router = useRouter()
  const { login } = useClienteAuth()

  // — RUC —
  const [ruc, setRuc] = useState('')
  const [rucStatus, setRucStatus] = useState<RucStatus>('idle')
  const [rucError, setRucError] = useState<string | null>(null)
  const [razonSocial, setRazonSocial] = useState('')
  const latestRucRef = useRef('')

  // — Rubros —
  const [rubros, setRubros] = useState<Rubro[]>([])
  const [idRubro, setIdRubro] = useState<number | ''>('')

  useEffect(() => {
    apiClient<{ success?: boolean; data?: Rubro[] }>('/api/rubros/?limit=200')
      .then((res) => {
        const list = Array.isArray((res as { data?: Rubro[] }).data)
          ? (res as { data: Rubro[] }).data
          : []
        const active = list.filter((r) => r.activo !== false)
        setRubros(active)
      })
      .catch(() => setRubros([]))
  }, [])

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
    if (ruc.length < 11) {
      setRucStatus('idle')
      setRucError(null)
      setRazonSocial('')
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
          setRucError('RUC no encontrado en SUNAT')
        }
      })
      .catch((e) => {
        if (latestRucRef.current !== queried) return
        setRucStatus('invalid')
        setRucError(e instanceof ApiError ? e.message : 'RUC inválido o no encontrado en SUNAT')
      })
  }, [ruc])

  // — Password errors —
  const pwError  = pwTouched && password.length > 0 && password.length < 8 ? 'Mínimo 8 caracteres' : ''
  const cpError  = cpTouched && confirmPw !== password ? 'Las contraseñas no coinciden' : ''

  // — Contacts helpers —
  const updateContacto = useCallback(
    (uid: string, field: 'nombre_completo' | 'correo' | 'telefono', value: string) => {
      setContactos((prev) => prev.map((c) => (c.uid === uid ? { ...c, [field]: value } : c)))
    },
    [],
  )

  const touchContactoField = useCallback((uid: string, field: string) => {
    setContactos((prev) =>
      prev.map((c) => (c.uid === uid ? { ...c, touched: { ...c.touched, [field]: true } } : c)),
    )
  }, [])

  const addContacto    = () => setContactos((prev) => [...prev, makeContacto()])
  const removeContacto = (uid: string) => setContactos((prev) => prev.filter((c) => c.uid !== uid))

  // — Global validity —
  const isFormValid = () =>
    ruc.length === 11 &&
    rucStatus !== 'consulting' &&
    !!razonSocial.trim() &&
    idRubro !== '' &&
    password.length >= 8 &&
    password === confirmPw &&
    contactos.every(isContactoValid) &&
    aceptaTerminos

  // — Submit —
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwTouched(true)
    setCpTouched(true)
    setContactos((prev) =>
      prev.map((c) => ({
        ...c,
        touched: { nombre_completo: true, correo: true, telefono: true },
      })),
    )
    if (!isFormValid()) return

    setSubmitting(true)
    setSubmitError(null)
    const principal = contactos[0]

    try {
      const res = await clienteApi.registroEmpresaV2({
        documento_empresa: ruc,
        razon_social: razonSocial,
        nombre_contacto_principal: principal.nombre_completo.trim(),
        correo_contacto_principal: principal.correo.trim().toLowerCase(),
        telefono_contacto_principal: principal.telefono.trim(),
        contrasena: password,
        id_rubro: idRubro as number,
        id_pais: 1,
        id_forma_pago: 1,
        activo: true,
        contactos: contactos.map((c, i) => ({
          nombre_completo: c.nombre_completo.trim(),
          correo: c.correo.trim().toLowerCase(),
          telefono: c.telefono.trim(),
          es_contacto_principal: i === 0,
          roles: [5],
        })),
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
        setSubmitError(res.message || 'Error al registrar la empresa')
      }
    } catch (e) {
      if (e instanceof ApiError) {
        const detail = e.detail
        const msg = typeof detail === 'string' ? detail : detail?.message ?? e.message
        setSubmitError(msg)
      } else {
        setSubmitError(e instanceof Error ? e.message : 'Error al registrar la empresa')
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">¡Registro exitoso!</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Empresa{' '}
          <strong className="text-gray-800 dark:text-gray-200">{successRazonSocial}</strong>{' '}
          registrada exitosamente. Ya puede iniciar sesión con su RUC y contraseña.
        </p>
        {!onSuccess && (
          <Button
            onClick={() => router.push(`/${locale}/login?redirect=${encodeURIComponent(redirectParam ?? '/')}`)}
            className="w-full"
          >
            Ir a iniciar sesión
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
        <SectionHeader icon={<Building2 className="h-4 w-4" />} title="Datos de la empresa" />

        {/* RUC */}
        <div className="space-y-1.5">
          <Label htmlFor="ruc-empresa">RUC</Label>
          <div className="relative">
            <Input
              id="ruc-empresa"
              value={ruc}
              onChange={(e) => setRuc(e.target.value.replace(/\D/g, '').slice(0, 11))}
              className={cn(
                'pr-10',
                rucStatus === 'valid'   && 'border-green-500 focus-visible:ring-green-500',
                rucStatus === 'invalid' && 'border-red-500   focus-visible:ring-red-500',
              )}
              placeholder="11 dígitos"
              maxLength={11}
              inputMode="numeric"
            />
            {rucStatus === 'consulting' && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
            )}
            {rucStatus === 'valid' && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          {rucStatus === 'consulting' && (
            <p className="text-xs text-blue-600 dark:text-blue-400">Consultando en SUNAT…</p>
          )}
          {rucError && <p className="text-xs text-red-600 dark:text-red-400">{rucError}</p>}
        </div>

        {/* Razón Social — editable, se auto-rellena al validar RUC */}
        <div className="space-y-1.5">
          <Label htmlFor="razon-social">Razón Social</Label>
          <Input
            id="razon-social"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            placeholder="Nombre o razón social de la empresa"
            className={cn(
              rucStatus === 'valid' && razonSocial &&
                'border-green-300 dark:border-green-700',
            )}
          />
        </div>

        {/* Rubro */}
        <div className="space-y-1.5">
          <Label htmlFor="rubro-empresa">Rubro</Label>
          <Select
            value={idRubro === '' ? '' : String(idRubro)}
            onValueChange={(v) => setIdRubro(Number(v))}
          >
            <SelectTrigger id="rubro-empresa">
              <SelectValue placeholder="Seleccione el rubro de la empresa" />
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
            <Label htmlFor="pw-empresa">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="pw-empresa"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPwTouched(true)}
                className={cn('pl-10', pwError && 'border-red-500 focus-visible:ring-red-500')}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            {pwError && <p className="text-xs text-red-600 dark:text-red-400">{pwError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpw-empresa">Confirmar contraseña</Label>
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

      {/* ══ Sección 2: Contactos ═════════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader icon={<User className="h-4 w-4" />} title="Contactos" />

        {contactos.map((contacto, index) => {
          const isPrincipal = index === 0
          const errs = getContactoErrors(contacto)
          const t = contacto.touched

          return (
            <div
              key={contacto.uid}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/60 overflow-hidden"
            >
              {/* Cabecera de la tarjeta */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-100 dark:bg-slate-700/50 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Contacto {index + 1}
                  </span>
                  {isPrincipal && (
                    <Badge className="text-[10px] bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700 font-medium">
                      Principal
                    </Badge>
                  )}
                </div>
                {!isPrincipal && (
                  <button
                    type="button"
                    onClick={() => removeContacto(contacto.uid)}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded p-0.5"
                    aria-label="Eliminar contacto"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="p-4 space-y-3">
                {/* Nombre */}
                <FieldWrapper
                  id={`nombre-${contacto.uid}`}
                  label="Nombre completo"
                  error={t.nombre_completo ? errs.nombre_completo : ''}
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      id={`nombre-${contacto.uid}`}
                      value={contacto.nombre_completo}
                      onChange={(e) => updateContacto(contacto.uid, 'nombre_completo', e.target.value)}
                      onBlur={() => touchContactoField(contacto.uid, 'nombre_completo')}
                      className={cn(
                        'pl-9 h-9 text-sm',
                        t.nombre_completo && errs.nombre_completo && 'border-red-500 focus-visible:ring-red-500',
                      )}
                      placeholder="Nombre completo"
                    />
                  </div>
                </FieldWrapper>

                {/* Correo */}
                <FieldWrapper
                  id={`correo-${contacto.uid}`}
                  label="Correo electrónico"
                  error={t.correo ? errs.correo : ''}
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
                        t.correo && errs.correo && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                  </div>
                </FieldWrapper>

                {/* Teléfono */}
                <FieldWrapper
                  id={`telefono-${contacto.uid}`}
                  label="Teléfono"
                  error={t.telefono ? errs.telefono : ''}
                >
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      id={`telefono-${contacto.uid}`}
                      type="tel"
                      value={contacto.telefono}
                      onChange={(e) => updateContacto(contacto.uid, 'telefono', e.target.value)}
                      onBlur={() => touchContactoField(contacto.uid, 'telefono')}
                      className={cn(
                        'pl-9 h-9 text-sm',
                        t.telefono && errs.telefono && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                  </div>
                </FieldWrapper>


              </div>
            </div>
          )
        })}

        {/* Botón agregar contacto */}
        <button
          type="button"
          onClick={addContacto}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Agregar otro contacto
        </button>
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
            Acepto los{' '}
            <Link
              href={`/${locale}/terminos`}
              target="_blank"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              términos y condiciones
            </Link>
            {' '}y la{' '}
            <Link
              href={`/${locale}/privacidad`}
              target="_blank"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              política de privacidad
            </Link>
          </span>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-7">
          Conforme a la Ley N.° 29733, autorizas a INXORA al tratamiento de tus datos personales
          para fines comerciales, envío de cotizaciones y seguimiento de tus solicitudes.
          Puedes revisar nuestra{' '}
          <Link
            href="https://tienda.inxora.com/privacidad"
            target="_blank"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            política de privacidad
          </Link>
          {' '}en tienda.inxora.com.
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
            Registrando empresa…
          </>
        ) : (
          'Registrar empresa'
        )}
      </Button>

      {!onSuccess && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tiene cuenta?{' '}
          <Link
            href={`/${locale}/login?redirect=${encodeURIComponent(redirectParam ?? '/')}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Iniciar sesión
          </Link>
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
