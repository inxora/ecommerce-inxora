import { MetadataRoute } from 'next'
import { getSupabaseClient, getCategorias } from '@/lib/supabase'
import { buildProductUrl, buildCategoryUrlFromObject } from '@/lib/product-url'

// Tipo parcial para productos en el sitemap (solo los campos necesarios)
// Supabase devuelve arrays para relaciones cuando se hace select con joins
type SitemapProduct = {
  seo_slug: string
  canonical_url?: string | null
  fecha_actualizacion?: string | null
  categorias?: Array<{ id_categoria: number; categoria: { id: number; nombre: string } }> | { id_categoria: number; categoria: { id: number; nombre: string } } | null
  categoria?: { id: number; nombre: string }[] | { id: number; nombre: string } | null // Mantener para compatibilidad
  marca?: { id: number; nombre: string }[] | { id: number; nombre: string } | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tienda.inxora.com'
  const locale = 'es' // 🎯 CANÓNICO

  // ===============================
  // PRODUCTOS
  // ===============================

  let products: SitemapProduct[] = []
  let productsError: any = null

  try {
    const supabase = getSupabaseClient()
    const result = await supabase
      .from('producto')
      .select(`
        seo_slug,
        canonical_url,
        fecha_actualizacion,
        categorias:producto_categoria(id_categoria, categoria:categoria(id, nombre)),
        marca:id_marca(id, nombre)
      `)
      .eq('activo', true)
      .eq('visible_web', true)
      .limit(10000) // Límite razonable para sitemap

    products = (result.data || []) as unknown as SitemapProduct[]
    productsError = result.error

    // Log para debugging
    if (productsError) {
      console.error('❌ Error fetching products for sitemap:', productsError)
    } else {
      console.log(`✅ Sitemap: Found ${products.length} products`)
    }
  } catch (error) {
    console.error('❌ Exception fetching products for sitemap:', error)
    productsError = error
  }

  // ===============================
  // CATEGORÍAS
  // ===============================
  let categories: any[] = []
  try {
    const categoriesResult = await getCategorias()
    categories = categoriesResult.data || []
    console.log(`✅ Sitemap: Found ${categories.length} categories`)
  } catch (error) {
    console.error('❌ Error fetching categories for sitemap:', error)
  }

  // ===============================
  // PÁGINAS ESTÁTICAS
  // ===============================
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/${locale}`,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/${locale}/catalogo`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${locale}/contacto`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/${locale}/nosotros`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // ===============================
  // CATEGORÍAS (SOLO ES)
  // ===============================
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}${buildCategoryUrlFromObject(category, locale)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // ===============================
  // PRODUCTOS (SOLO ES)
  // ===============================
  const productPages: MetadataRoute.Sitemap = products
    .map((product) => {
      if (!product.seo_slug) return null

      // Usar canonical_url si existe, sino construir con buildProductUrl
      let path: string
      if (product.canonical_url?.startsWith('/')) {
        path = product.canonical_url
      } else {
        // Normalizar categoría y marca (pueden ser arrays o objetos)
        // Las categorías ahora vienen como array de relaciones producto_categoria
        let categoria: { id: number; nombre: string } | null = null
        if (product.categorias) {
          if (Array.isArray(product.categorias) && product.categorias.length > 0) {
            categoria = product.categorias[0]?.categoria || null
          } else if (!Array.isArray(product.categorias) && 'categoria' in product.categorias) {
            categoria = product.categorias.categoria
          }
        }
        // Fallback a categoria singular para compatibilidad
        if (!categoria && product.categoria) {
          categoria = Array.isArray(product.categoria) 
            ? product.categoria[0] 
            : product.categoria
        }
        const marca = Array.isArray(product.marca) 
          ? product.marca[0] 
          : product.marca
        
        // Construir objeto parcial compatible con buildProductUrl
        const productForUrl = {
          seo_slug: product.seo_slug,
          categoria,
          marca,
        }
        path = buildProductUrl(productForUrl as any, locale)
      }

      return {
        url: `${baseUrl}${path}`,
        lastModified: product.fecha_actualizacion
          ? new Date(product.fecha_actualizacion)
          : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    })
    .filter(Boolean) as MetadataRoute.Sitemap

  return [...staticPages, ...categoryPages, ...productPages]
}
