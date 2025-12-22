import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tienda.inxora.com'
  const locale = 'es' // 🎯 CANÓNICO

  // ===============================
  // PRODUCTOS
  // ===============================

  let products: any[] = []
  let productsError: any = null

  try {
    const result = await supabase
      .from('producto')
      .select(`
        seo_slug,
        canonical_url,
        fecha_actualizacion,
        marca:marca(nombre)
      `)
      .eq('activo', true)
      .eq('visible_web', true)

    products = result.data || []
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
  // PRODUCTOS (SOLO ES)
  // ===============================
  const productPages: MetadataRoute.Sitemap =
    products?.map((product) => {
      if (!product.seo_slug) return null

      let path: string

      if (product.canonical_url?.startsWith('/')) {
        path = product.canonical_url
      } else {
        const brandSlug = product.marca?.[0]?.nombre
          ? normalizeName(product.marca?.[0]?.nombre)
          : null

        path = brandSlug
          ? `/${locale}/producto/${brandSlug}/${product.seo_slug}`
          : `/${locale}/producto/${product.seo_slug}`
      }

      return {
        url: `${baseUrl}${path}`,
        lastModified: product.fecha_actualizacion
          ? new Date(product.fecha_actualizacion)
          : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }
    }).filter(Boolean) as MetadataRoute.Sitemap

  return [...staticPages, ...productPages]
}
