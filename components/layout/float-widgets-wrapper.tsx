'use client'

import { usePathname } from 'next/navigation'
import { SaraChatWidget } from '@/components/layout/sara-chat-widget'

export function FloatWidgetsWrapper() {
  const pathname = usePathname() ?? ''
  const isChatSaraPage = pathname.includes('/cuenta/chat-sara')
  return (
    <>
      {!isChatSaraPage && <SaraChatWidget />}
    </>
  )
}
