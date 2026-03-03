'use client'

import { useParams } from 'next/navigation'
import { ChatSaraPageClient } from './ChatSaraPageClient'

export default function ChatSaraPage() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'es'
  return <ChatSaraPageClient locale={locale} />
}
