'use client'

import { Suspense, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/api/auth-api'
import { ApiError } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Loader2,
} from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'token_invalido'

// ─── Inner component (uses useSearchParams → must be inside Suspense) ─────────

function ResetPasswordContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = (params?.locale as string) ?? 'es'
  const token = searchParams?.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [pwTouched, setPwTouched] = useState(false)
  const [cpwTouched, setCpwTouched] = useState(false)
  const [status, setStatus] = useState<Status>(token ? 'idle' : 'token_invalido')
  const [errorMsg, setErrorMsg] = useState('')

  const pwError  = pwTouched  && password.length > 0 && password.length < 8 ? 'Mínimo 8 caracteres' : ''
  const cpwError = cpwTouched && confirmPw !== password ? 'Las contraseñas no coinciden' : ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwTouched(true)
    setCpwTouched(true)
    if (password.length < 8 || password !== confirmPw) return

    setStatus('loading')
    setErrorMsg('')
    try {
      await authApi.resetPassword({ token, nueva_password: password })
      setStatus('success')
      setTimeout(() => router.push(`/${locale}/login`), 3000)
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err instanceof ApiError ? err.message : 'El enlace es inválido o ya expiró.',
      )
    }
  }

  // — Token ausente o inválido ─────────────────────────────────────────────────
  if (status === 'token_invalido') {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>Este enlace no es válido o ha expirado.</p>
        </div>
        <Link
          href={`/${locale}/forgot-password`}
          className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Solicitar un nuevo enlace
        </Link>
      </div>
    )
  }

  // — Éxito ────────────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
        <p>
          ¡Contraseña actualizada exitosamente! Redirigiendo al inicio de sesión…
        </p>
      </div>
    )
  }

  // — Formulario ───────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === 'error' && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm space-y-1">
          <p>{errorMsg}</p>
          <Link
            href={`/${locale}/forgot-password`}
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Solicitar un nuevo enlace
          </Link>
        </div>
      )}

      {/* Nueva contraseña */}
      <div className="space-y-2">
        <Label htmlFor="nueva-password">Nueva contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="nueva-password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPwTouched(true)}
            className={`pl-10 pr-10 ${pwError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            placeholder="Mínimo 8 caracteres"
            required
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
            aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {pwError && <p className="text-xs text-red-600 dark:text-red-400">{pwError}</p>}
      </div>

      {/* Confirmar contraseña */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="confirm-password"
            type={showCpw ? 'text' : 'password'}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            onBlur={() => setCpwTouched(true)}
            className={`pl-10 pr-10 ${cpwError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowCpw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
            aria-label={showCpw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showCpw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {cpwError && <p className="text-xs text-red-600 dark:text-red-400">{cpwError}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Actualizando…
          </>
        ) : (
          'Actualizar contraseña'
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
  )
}

// ─── Page (envuelve el content en Suspense para useSearchParams) ──────────────

export default function ResetPasswordPage() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'es'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-6 w-6" />
            Crea tu nueva contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando…
              </div>
            }
          >
            <ResetPasswordContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
