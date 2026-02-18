import { MetadataRoute } from 'next'
import { getTotalProductCount, MAX_URLS_PER_SITEMAP } from '@/lib/sitemap-data'

export const revalidate = 3600

const BASE_URL = 'https://tienda.inxora.com'

/**
 * Sitemap índice: lista de sitemaps hijos (páginas + productos por segmentos de 50k).
 * En Search Console se sigue enviando solo: https://tienda.inxora.com/sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const index: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/sitemap-pages`, lastModified: now },
  ]

  const totalProducts = await getTotalProductCount()
  const numSegments = Math.max(1, Math.ceil(totalProducts / MAX_URLS_PER_SITEMAP))
  for (let i = 1; i <= numSegments; i++) {
    index.push({ url: `${BASE_URL}/sitemap-products/${i}`, lastModified: now })
  }

  return index
}
