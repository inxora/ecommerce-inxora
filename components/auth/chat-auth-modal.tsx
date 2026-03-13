'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
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
import { Mail, Lock, LogIn, User, FileText, Phone } from 'lucide-react'

type Rubro = { id: number; nombre: string; activo?: boolean }

type ChatAuthModalProps = {
  open: boolean
  locale: string
  onClose?: () => void
}

export function ChatAuthModal({ open, locale, onClose }: ChatAuthModalProps) {
  const router = useRouter()
  const { login, register, error, clearError } = useClienteAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)

  // Login
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')

  // Register
  const [rubros, setRubros] = useState<Rubro[]>([])
  const [id_rubro, setIdRubro] = useState<number | ''>('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [documento_personal, setDocumentoPersonal] = useState('')
  const [regCorreo, setRegCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [regPassword, setRegPassword] = useState('')

  useEffect(() => {
    if (!open) return
    clearError()
    setMode('login')
  }, [open, clearError])

  useEffect(() => {
    apiClient<{ success?: boolean; data?: Rubro[] }>('/api/rubros/?limit=200')
      .then((res) => {
        const list = Array.isArray((res as { data?: Rubro[] }).data)
          ? (res as { data: Rubro[] }).data
          : []
        const active = list.filter((r) => r.activo !== false)
        setRubros(active)
        if (active.length > 0 && id_rubro === '') {
          setIdRubro(active[0].id)
        }
      })
      .catch(() => setRubros([]))
  }, [])

  const handleClose = (openState: boolean) => {
    if (!openState) {
      if (onClose) {
        onClose()
      } else {
        router.push(`/${locale}`)
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      await login(correo, password)
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
    } catch {
      // error en context
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose} modal>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          e.preventDefault()
          handleClose(false)
        }}
      >
        {mode === 'login' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <LogIn className="h-6 w-6" />
                Iniciar sesión
              </DialogTitle>
              <DialogDescription>
                Inicia sesión para chatear con Sara Xora
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4 mt-2">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="chat-modal-correo">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="chat-modal-correo"
                    type="email"
                    placeholder="tu@correo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chat-modal-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="chat-modal-password"
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
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => {
                    setMode('register')
                    clearError()
                  }}
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
                <User className="h-6 w-6" />
                Crear cuenta
              </DialogTitle>
              <DialogDescription>
                Regístrate para chatear con Sara Xora
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegister} className="space-y-4 mt-2">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chat-modal-nombre">Nombre</Label>
                  <Input
                    id="chat-modal-nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chat-modal-apellidos">Apellidos</Label>
                  <Input
                    id="chat-modal-apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chat-modal-documento">DNI / Documento</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="chat-modal-documento"
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
                <Label htmlFor="chat-modal-reg-correo">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="chat-modal-reg-correo"
                    type="email"
                    value={regCorreo}
                    onChange={(e) => setRegCorreo(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chat-modal-telefono">Teléfono (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="chat-modal-telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chat-modal-rubro">Rubro / Sector</Label>
                <Select
                  value={id_rubro === '' ? undefined : String(id_rubro)}
                  onValueChange={(v) => setIdRubro(v === '' ? '' : Number(v))}
                  required
                >
                  <SelectTrigger id="chat-modal-rubro" className="w-full">
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
                <Label htmlFor="chat-modal-reg-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="chat-modal-reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="pl-10"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Registrarme'}
              </Button>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => {
                    setMode('login')
                    clearError()
                  }}
                >
                  Iniciar sesión
                </button>
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
