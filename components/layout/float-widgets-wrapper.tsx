'use client'

import { useState } from 'react'
import { WhatsAppFloat } from '@/components/layout/whatsapp-float'
import { SaraChatWidget } from '@/components/layout/sara-chat-widget'

/**
 * Envuelve los dos widgets flotantes (WhatsApp y Sara) y comparte el estado
 * de apertura del chat Sara para ocultar el flotante de WhatsApp cuando el chat está abierto.
 */
export function FloatWidgetsWrapper() {
  const [saraChatOpen, setSaraChatOpen] = useState(false)
  return (
    <>
      <WhatsAppFloat hidden={saraChatOpen} />
      <SaraChatWidget onOpenChange={setSaraChatOpen} />
    </>
  )
}
