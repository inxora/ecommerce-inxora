import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ChatSaraPageClient } from '../ChatSaraPageClient'
import { loadCategoriasForChatSara } from '@/lib/chat-sara/load-categorias'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ session?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'chatSara' })
  return {
    title: t('meta.ordersPageTitle'),
    description: t('meta.ordersPageDescription'),
  }
}

export default async function ChatSaraPedidosPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const sp = await searchParams
  const initialSession = sp?.session
  const categorias = await loadCategoriasForChatSara()

  return (
    <ChatSaraPageClient
      locale={locale}
      initialSessionId={initialSession}
      categorias={categorias}
    />
  )
}
