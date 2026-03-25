'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2, User, Mail, Lock, Phone, FileText } from 'lucide-react'
import { RegistroEmpresaForm } from '@/components/auth/registro-empresa-form'

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
type TipoCliente = 'natural' | 'empresa'

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

export default function RegistroPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const redirectParam = searchParams?.get('redirect') || '/'
  const locale = (params?.locale as string) ?? 'es'
  const redirectTo = redirectParam.startsWith('/')
    ? redirectParam
    : redirectParam === 'checkout'
      ? `/${locale}/checkout`
      : `/${locale}`

  const [tipoCliente, setTipoCliente] = useState<TipoCliente>('natural')

  const { register, error, clearError } = useClienteAuth()
  const [rubros, setRubros] = useState<Rubro[]>([])
  const [paises, setPaises] = useState<Pais[]>([])
  const [id_pais, setIdPais] = useState<number | ''>(1)
  const [id_rubro, setIdRubro] = useState<number | ''>('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [documento_personal, setDocumentoPersonal] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    apiClient<{ success?: boolean; data?: Rubro[] }>('/api/rubros/?limit=200')
      .then((res: { success?: boolean; data?: Rubro[] }) => {
        const list = Array.isArray((res as { data?: Rubro[] }).data)
          ? (res as { data: Rubro[] }).data
          : []
        const active = list.filter((r) => r.activo !== false)
        setRubros(active)
        if (active.length > 0) {
          setIdRubro(active[0].id)
        }
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

  const selectedPais = id_pais === '' ? null : paises.find((p) => p.id === id_pais) ?? null
  const docPersonalLabel = selectedPais?.nombre_doc_personal?.trim() || 'DNI / Documento'
  const docPersonalRegex = toRegex(selectedPais?.patron_doc_personal)
  const phonePrefix = selectedPais?.prefijo_telefonico?.trim() || ''
  const phoneRegex = toRegex(selectedPais?.patron_telefono)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (docPersonalRegex && !docPersonalRegex.test(documento_personal.trim())) {
      return
    }
    const telefonoNormalizado = normalizePhoneForSubmit(telefono, phonePrefix)
    if (telefonoNormalizado && phoneRegex && !phoneRegex.test(telefonoNormalizado)) {
      return
    }
    const rubroId = id_rubro === '' ? undefined : id_rubro
    setLoading(true)
    try {
      await register({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        documento_personal: documento_personal.trim(),
        correo: correo.trim().toLowerCase(),
        telefono: telefonoNormalizado || undefined,
        password,
        id_pais: id_pais === '' ? undefined : id_pais,
        id_rubro: rubroId ?? rubros[0]?.id,
        acepta_terminos: true,
      })
      router.push(redirectTo)
    } catch {
      // error en context
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className={`w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl transition-all duration-300 ${tipoCliente === 'empresa' ? 'max-w-lg' : 'max-w-md'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            {tipoCliente === 'empresa' ? (
              <Building2 className="h-6 w-6" />
            ) : (
              <User className="h-6 w-6" />
            )}
            Crear cuenta
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Regístrate para continuar con tu compra
          </p>

          {/* Selector de tipo de cliente */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setTipoCliente('natural')}
              className={[
                'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all',
                tipoCliente === 'natural'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500',
              ].join(' ')}
            >
              <User className="h-4 w-4 shrink-0" />
              Persona Natural
            </button>
            <button
              type="button"
              onClick={() => setTipoCliente('empresa')}
              className={[
                'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all',
                tipoCliente === 'empresa'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500',
              ].join(' ')}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              Empresa
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {tipoCliente === 'empresa' ? (
            <RegistroEmpresaForm
              locale={locale}
              redirectTo={redirectTo}
              redirectParam={redirectParam}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_pais">País</Label>
                <Select
                  value={id_pais === '' ? undefined : String(id_pais)}
                  onValueChange={(v) => {
                    setIdPais(v === '' ? '' : Number(v))
                    setTelefono('')
                  }}
                  required
                >
                  <SelectTrigger id="id_pais" className="w-full">
                    <SelectValue placeholder="Selecciona tu país" />
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
                <Label htmlFor="documento_personal">{docPersonalLabel}</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="documento_personal"
                    value={documento_personal}
                    onChange={(e) => setDocumentoPersonal(e.target.value)}
                    className="pl-10"
                    placeholder={`Ingrese ${docPersonalLabel}`}
                    minLength={selectedPais?.id === 1 ? 8 : undefined}
                    required
                  />
                </div>
                {docPersonalRegex && documento_personal.trim() && !docPersonalRegex.test(documento_personal.trim()) && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Formato de {docPersonalLabel} inválido
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="correo"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono (opcional)</Label>
                <div className="flex">
                  {phonePrefix && (
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-600 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-300">
                      {phonePrefix}
                    </span>
                  )}
                  <div className="relative flex-1">
                    {!phonePrefix && <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
                    <Input
                      id="telefono"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value.replace(/[^\d]/g, ''))}
                      className={phonePrefix ? 'rounded-l-none pl-3' : 'pl-10'}
                      placeholder={phonePrefix ? 'Número' : undefined}
                    />
                  </div>
                </div>
                {phoneRegex && telefono.trim() && !phoneRegex.test(normalizePhoneForSubmit(telefono, phonePrefix)) && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Formato de teléfono inválido para {selectedPais?.nombre ?? 'el país seleccionado'}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_rubro">Rubro / Sector</Label>
                <Select
                  value={id_rubro === '' ? undefined : String(id_rubro)}
                  onValueChange={(v) => setIdRubro(v === '' ? '' : Number(v))}
                  required
                >
                  <SelectTrigger id="id_rubro" className="w-full">
                    <SelectValue placeholder="Selecciona tu rubro" />
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
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              {/* Términos y condiciones */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-blue-600"
                    required
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
                  Conforme a la Ley N.° 29733, autorizas a INXORA al tratamiento de tus datos
                  personales para fines comerciales, envío de cotizaciones y seguimiento de tus
                  solicitudes. Puedes revisar nuestra{' '}
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

              <Button type="submit" className="w-full" disabled={loading || !aceptaTerminos}>
                {loading ? 'Creando cuenta...' : 'Registrarme'}
              </Button>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <Link
                  href={`/${locale}/login?redirect=${encodeURIComponent(redirectParam)}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Iniciar sesión
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
