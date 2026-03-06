'use client'

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/layout/footer'
import type { Banner } from '@/lib/types'

/** Oculta el footer en la página de chat con Sara (cuenta y share). */
export function ConditionalFooter({
  bannersFooterStrip,
  locale,
}: {
  bannersFooterStrip: Banner[]
  locale: string
}) {
  const pathname = usePathname() ?? ''
  const isChatSara = pathname.includes('/cuenta/chat-sara') || pathname.includes('/chat-sara/share/')
  if (isChatSara) return null
  return <Footer bannersFooterStrip={bannersFooterStrip} locale={locale} />
}
