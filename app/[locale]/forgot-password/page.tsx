'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/api/auth-api'
import { ApiError } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ForgotPasswordPage() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'es'

  const [correo, setCorreo] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await authApi.forgotPassword({ correo: correo.trim().toLowerCase() })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err instanceof ApiError ? err.message : 'Ocurrió un error. Inténtalo de nuevo.',
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <KeyRound className="h-6 w-6" />
            ¿Olvidaste tu contraseña?
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu acceso.
          </p>
        </CardHeader>

        <CardContent>
          {status === 'success' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <p>
                  Revisa tu correo. Si la dirección está registrada, recibirás un enlace en los
                  próximos minutos. Revisa también tu carpeta de spam.
                </p>
              </div>
              <Link
                href={`/${locale}/login`}
                className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="correo-forgot">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="correo-forgot"
                    type="email"
                    placeholder="tucorreo@empresa.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="pl-10"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  'Enviar enlace'
                )}
              </Button>

              <Link
                href={`/${locale}/login`}
                className="flex items-center justify-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio de sesión
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
