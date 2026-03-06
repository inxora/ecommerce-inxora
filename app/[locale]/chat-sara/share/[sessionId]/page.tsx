'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { ChatSaraPageClient } from '@/app/[locale]/cuenta/chat-sara/ChatSaraPageClient'
import { Loader2 } from 'lucide-react'

/**
 * Ruta pública de compartir conversación (estilo Gemini).
 * URL: /es/chat-sara/share/{sessionId}
 * Requiere login; tras autenticarse se muestra la conversación.
 */
export default function ShareChatSaraPage() {
  const params = useParams()
  const router = useRouter()
  const { isLoggedIn, isLoading: authLoading } = useClienteAuth()
  const locale = (params?.locale as string) ?? 'es'
  const sessionId = params?.sessionId as string

  useEffect(() => {
    if (authLoading) return
    if (!isLoggedIn && sessionId) {
      const currentPath = `/${locale}/chat-sara/share/${sessionId}`
      router.replace(`/${locale}/login?redirect=${encodeURIComponent(currentPath)}`)
    }
  }, [isLoggedIn, authLoading, router, locale, sessionId])

  if (authLoading || !isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#13A0D8]" />
      </div>
    )
  }

  if (!sessionId) {
    router.replace(`/${locale}/cuenta/chat-sara`)
    return null
  }

  return <ChatSaraPageClient locale={locale} initialSessionId={sessionId} />
}
