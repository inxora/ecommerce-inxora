'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { WhatsAppFloat } from '@/components/layout/whatsapp-float'
import { SaraChatWidget } from '@/components/layout/sara-chat-widget'

/**
 * Envuelve los dos widgets flotantes (WhatsApp y Sara) y comparte el estado
 * de apertura del chat Sara para ocultar el flotante de WhatsApp cuando el chat está abierto.
 * En la página /cuenta/chat-sara no se muestran ni el widget de Sara ni el de WhatsApp.
 */
export function FloatWidgetsWrapper() {
  const pathname = usePathname() ?? ''
  const [saraChatOpen, setSaraChatOpen] = useState(false)
  const isChatSaraPage = pathname.includes('/cuenta/chat-sara')
  return (
    <>
      {!isChatSaraPage && <WhatsAppFloat hidden={saraChatOpen} />}
      {!isChatSaraPage && <SaraChatWidget onOpenChange={setSaraChatOpen} />}
    </>
  )
}
