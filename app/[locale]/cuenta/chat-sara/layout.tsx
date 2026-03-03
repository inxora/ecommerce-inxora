import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat con Sara | INXORA',
  description: 'Conversaciones con Sara Xora, tu asistente virtual de INXORA.',
}

export default function ChatSaraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
