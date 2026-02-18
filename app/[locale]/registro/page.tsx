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
import { User, Mail, Lock, Phone, FileText } from 'lucide-react'

type Rubro = { id: number; nombre: string; activo?: boolean }

export default function RegistroPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect') || 'checkout'
  const locale = (params?.locale as string) ?? 'es'
  const { register, error, clearError } = useClienteAuth()
  const [rubros, setRubros] = useState<Rubro[]>([])
  const [id_rubro, setIdRubro] = useState<number | ''>('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [documento_personal, setDocumentoPersonal] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    const rubroId = id_rubro === '' ? undefined : id_rubro
    setLoading(true)
    try {
      await register({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        documento_personal: documento_personal.trim(),
        correo: correo.trim().toLowerCase(),
        telefono: telefono.trim() || undefined,
        password,
        id_pais: 1,
        id_rubro: rubroId ?? (rubros[0]?.id),
      })
      if (redirect === 'checkout') {
        router.push(`/${locale}/checkout`)
      } else {
        router.push(`/${locale}`)
      }
    } catch {
      // error en context
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="h-6 w-6" />
            Crear cuenta
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Regístrate para continuar con tu compra (persona natural)
          </p>
        </CardHeader>
        <CardContent>
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
              <Label htmlFor="documento_personal">DNI / Documento</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="documento_personal"
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
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="pl-10"
                />
              </div>
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarme'}
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link href={`/${locale}/login?redirect=${redirect}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
