import { redirect } from 'next/navigation'
import { getMarcaBySlug } from '@/lib/supabase'
import { normalizeName } from '@/lib/product-url'

export const dynamic = 'force-dynamic'

interface BuscarPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

/**
 * Página de entrada de búsqueda (estilo Falabella).
 * - Si el término coincide con una marca (por slug) → redirige a /[locale]/marca/[slug].
 * - Si no → redirige a /[locale]/catalogo?buscar=...
 */
export default async function BuscarPage({ params, searchParams }: BuscarPageProps) {
  const { locale } = await params
  const { q } = await searchParams
  const query = (q ?? '').trim()

  if (!query) {
    redirect(`/${locale}/catalogo`)
  }

  const slug = normalizeName(query)
  if (slug) {
    const brand = await getMarcaBySlug(slug)
    if (brand) {
      const brandSlug = normalizeName(brand.nombre) || slug
      redirect(`/${locale}/marca/${brandSlug}`)
    }
  }

  redirect(`/${locale}/catalogo?buscar=${encodeURIComponent(query)}`)
}
