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

type Rubro = { id: number; nombre: string; activo?: boolean }
type Mode = 'login' | 'register'
type TipoRegistro = 'natural' | 'empresa'

export function AuthModal() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'es'
  const { isOpen, options, closeAuthModal } = useAuthModal()
  const { login, register, error, clearError } = useClienteAuth()

  const [mode, setMode] = useState<Mode>('login')
  const [tipoRegistro, setTipoRegistro] = useState<TipoRegistro>('natural')
  const [loading, setLoading] = useState(false)

  // Login fields
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')

  // Register fields
  const [rubros, setRubros] = useState<Rubro[]>([])
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
  }, [isOpen, clearError, options.initialMode])

  useEffect(() => {
    apiClient<{ success?: boolean; data?: Rubro[] }>('/api/rubros/?limit=200')
      .then((res) => {
        const list = Array.isArray((res as { data?: Rubro[] }).data)
          ? (res as { data: Rubro[] }).data
          : []
        const active = list.filter((r) => r.activo !== false)
        setRubros(active)
        if (active.length > 0 && id_rubro === '') setIdRubro(active[0].id)
      })
      .catch(() => setRubros([]))
  }, [])

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
    const rubroId = id_rubro === '' ? undefined : id_rubro
    setLoading(true)
    try {
      await register({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        documento_personal: documento_personal.trim(),
        correo: regCorreo.trim().toLowerCase(),
        telefono: telefono.trim() || undefined,
        password: regPassword,
        id_pais: 1,
        id_rubro: rubroId ?? rubros[0]?.id,
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
    setTipoRegistro('natural')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={`max-h-[90vh] overflow-y-auto transition-all duration-300 ${mode === 'register' && tipoRegistro === 'empresa' ? 'max-w-lg' : 'max-w-md'}`}>
        {mode === 'login' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <LogIn className="h-5 w-5" />
                Iniciar sesión
              </DialogTitle>
              <DialogDescription>
                Ingresa con tu correo para continuar
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleLogin} className="space-y-4 mt-1">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="auth-correo">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="auth-correo"
                    type="email"
                    placeholder="tu@correo.com"
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
                  <Label htmlFor="auth-password">Contraseña</Label>
                  <Link
                    href={`/${locale}/forgot-password`}
                    onClick={() => closeAuthModal()}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
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
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  onClick={() => switchMode('register')}
                >
                  Regístrate
                </button>
              </p>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                {tipoRegistro === 'empresa' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                Crear cuenta
              </DialogTitle>
              <DialogDescription>Regístrate para continuar</DialogDescription>

              {/* Selector Persona Natural / Empresa */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { clearError(); setTipoRegistro('natural') }}
                  className={[
                    'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all',
                    tipoRegistro === 'natural'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300',
                  ].join(' ')}
                >
                  <User className="h-4 w-4 shrink-0" />
                  Persona Natural
                </button>
                <button
                  type="button"
                  onClick={() => { clearError(); setTipoRegistro('empresa') }}
                  className={[
                    'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all',
                    tipoRegistro === 'empresa'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300',
                  ].join(' ')}
                >
                  <Building2 className="h-4 w-4 shrink-0" />
                  Empresa
                </button>
              </div>
            </DialogHeader>

            {/* ── Empresa ── */}
            {tipoRegistro === 'empresa' ? (
              <div className="mt-1">
                <RegistroEmpresaForm
                  locale={locale}
                  onSuccess={handleSuccess}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="auth-nombre">Nombre</Label>
                  <Input
                    id="auth-nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auth-apellidos">Apellidos</Label>
                  <Input
                    id="auth-apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-documento">DNI / Documento</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="auth-documento"
                    value={documento_personal}
                    onChange={(e) => setDocumentoPersonal(e.target.value)}
                    className="pl-10"
                    placeholder="8 dígitos"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-reg-correo">Correo electrónico</Label>
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
                <Label htmlFor="auth-telefono">Teléfono (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="auth-telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-rubro">Rubro / Sector</Label>
                <Select
                  value={id_rubro === '' ? undefined : String(id_rubro)}
                  onValueChange={(v) => setIdRubro(v === '' ? '' : Number(v))}
                  required
                >
                  <SelectTrigger id="auth-rubro" className="w-full">
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
                <Label htmlFor="auth-reg-password">Contraseña</Label>
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
                    Acepto los{' '}
                    <Link
                      href={`/${locale}/terminos`}
                      target="_blank"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      términos y condiciones
                    </Link>
                    {' '}y la{' '}
                    <Link
                      href={`/${locale}/privacidad`}
                      target="_blank"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
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
                    onClick={(e) => e.stopPropagation()}
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
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  onClick={() => switchMode('login')}
                >
                  Iniciar sesión
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
