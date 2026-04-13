'use client'

import { usePathname } from 'next/navigation'
import { SaraChatWidget } from '@/components/layout/sara-chat-widget'

/** Rutas del entorno completo de Sara (historial, pedidos/cotizaciones en contexto): sin burbuja duplicada. */
function isChatSaraFullPagePath(pathname: string): boolean {
  return pathname.includes('/cuenta/chat-sara') || pathname.includes('/chat-sara/share')
}

export function FloatWidgetsWrapper() {
  const pathname = usePathname() ?? ''
  if (isChatSaraFullPagePath(pathname)) return null
  return <SaraChatWidget />
}
