/**
 * Datos para sitemaps paginados (índice + sitemap-pages + sitemap-products-N).
 * Límite Google: 50.000 URLs por archivo de sitemap.
 */

import { getCategorias, getMarcas } from '@/lib/supabase'
import {
  buildCategoryUrlFromObject,
  buildCategorySubcategoriaMarcaUrl,
  normalizeName,
} from '@/lib/product-url'
import { generateCanonicalUrl } from '@/lib/product-seo'
import { CategoriesService } from '@/lib/services/categories.service'
import { ProductsService } from '@/lib/services/products.service'

const BASE_URL = 'https://tienda.inxora.com'
const LOCALE = 'es'
/** Límite por archivo de sitemap (Google) */
export const MAX_URLS_PER_SITEMAP = 50_000

export interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

/** Total de productos visibles en web (para calcular cuántos sitemaps de productos hay). */
export async function getTotalProductCount(): Promise<number> {
  try {
    const result = await ProductsService.getProductos({
      page: 1,
      limit: 1,
      visible_web: true,
    })
    return result.total ?? 0
  } catch {
    return 0
  }
}

/** Genera entradas del sitemap de páginas (estáticas, categorías, marcas, cat/subcat/marca). */
export async function getPagesSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []

  // Estáticas
  entries.push(
    { url: `${BASE_URL}/${LOCALE}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/${LOCALE}/catalogo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/${LOCALE}/marcas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/${LOCALE}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/${LOCALE}/nosotros`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 }
  )

  let categories: { id: number; nombre: string }[] = []
  try {
    const categoriesResult = await getCategorias()
    categories = categoriesResult.data || []
  } catch (error) {
    console.error('❌ Error fetching categories for sitemap:', error)
  }

  for (const category of categories) {
    entries.push({
      url: `${BASE_URL}${buildCategoryUrlFromObject(category, LOCALE)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  try {
    const categoriasNavegacion = await CategoriesService.getCategorias()
    for (const categoriaNavegacion of categoriasNavegacion) {
      const category = categories.find((c) => c.id === categoriaNavegacion.id)
      if (!category || !categoriaNavegacion.subcategorias?.length) continue
      for (const subcategoria of categoriaNavegacion.subcategorias) {
        if (!subcategoria.activo || !subcategoria.marcas?.length) continue
        for (const marca of subcategoria.marcas) {
          if (marca.activo) {
            entries.push({
              url: `${BASE_URL}${buildCategorySubcategoriaMarcaUrl(category, subcategoria, marca, LOCALE)}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.6,
            })
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error fetching subcategorias with marcas for sitemap:', error)
  }

  try {
    const { data: marcas } = await getMarcas()
    if (marcas?.length) {
      for (const marca of marcas) {
        const slug = normalizeName(marca.nombre) || String(marca.id)
        entries.push({
          url: `${BASE_URL}/${LOCALE}/marca/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  } catch (error) {
    console.error('❌ Error fetching marcas for sitemap:', error)
  }

  return entries
}

/**
 * Genera entradas del sitemap de productos para el segmento dado (1-based).
 * Segmento 1 = productos 1..50000, segmento 2 = 50001..100000, etc.
 */
export async function getProductSitemapSegment(segment: number): Promise<SitemapEntry[]> {
  if (segment < 1) return []
  const entries: SitemapEntry[] = []
  const limit = 100
  const skip = (segment - 1) * MAX_URLS_PER_SITEMAP
  let collected = 0
  let page = Math.floor(skip / limit) + 1
  const skipInFirstPage = skip % limit

  let hasMore = true
  while (hasMore && collected < MAX_URLS_PER_SITEMAP) {
    try {
      const result = await ProductsService.getProductos({
        page,
        limit,
        visible_web: true,
      })
      if (!result.products?.length) break

      const start = page === Math.floor(skip / limit) + 1 ? skipInFirstPage : 0
      for (let i = start; i < result.products.length && collected < MAX_URLS_PER_SITEMAP; i++) {
        const product = result.products[i]
        if (!product.seo_slug) continue
        try {
          const canonicalUrl = generateCanonicalUrl(product, LOCALE)
          entries.push({
            url: canonicalUrl,
            lastModified: product.fecha_actualizacion ? new Date(product.fecha_actualizacion) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          })
          collected++
        } catch {
          // skip invalid product URL
        }
      }
      if (result.products.length < limit) hasMore = false
      else page++
    } catch (error) {
      console.error(`❌ Error fetching products page ${page} for sitemap segment ${segment}:`, error)
      break
    }
  }

  return entries
}

/** Serializa entradas a XML sitemap (urlset). */
export function buildSitemapXml(entries: SitemapEntry[]): string {
  const urlset = entries
    .map((e) => {
      const lastmod = e.lastModified.toISOString().slice(0, 10)
      const loc = escapeXml(e.url)
      const changefreq = e.changeFrequency ?? 'weekly'
      const priority = e.priority ?? 0.5
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
