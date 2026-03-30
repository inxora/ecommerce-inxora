'use client'

import { SaraChatWidget } from '@/components/layout/sara-chat-widget'
import { WhatsAppFloat } from '@/components/layout/whatsapp-float'

export function FloatWidgetsWrapper() {
  return (
    <>
      <WhatsAppFloat />
      <SaraChatWidget />
    </>
  )
}
