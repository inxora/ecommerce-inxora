import { ChatSaraPageClient } from './ChatSaraPageClient'
import { getCategorias } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ session?: string }>
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
