import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ChatSaraPageClient } from './ChatSaraPageClient'
import { getCategorias } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ session?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'chatSara' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function ChatSaraPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const sp = await searchParams
  const initialSession = sp?.session

  const categoriasResult = await Promise.race([
    getCategorias(),
    new Promise<{ data: [] }>((resolve) => setTimeout(() => resolve({ data: [] }), 5000)),
  ])

  const categorias = (categoriasResult.data ?? []).filter(
    (cat) => cat.nombre.toUpperCase() !== 'DESPACHO DE PRODUCTOS' && cat.logo_url?.trim()
  )

  return (
    <ChatSaraPageClient
      locale={locale}
      initialSessionId={initialSession}
      categorias={categorias}
    />
  )
}
