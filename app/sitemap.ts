import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

// Función para normalizar nombres a slugs
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
  const locales = ['es', 'en', 'pt']

  // Obtener todos los productos activos con sus marcas
  const { data: products, error: productsError } = await supabase
    .from('productos')
    .select(`
      seo_slug,
      canonical_url,
      fecha_actualizacion,
      id_marca,
      marca:marcas(id, nombre)
    `)
    .eq('activo', true)
    .eq('visible_web', true)

  // Log para debugging
  if (productsError) {
    console.error('❌ Error fetching products for sitemap:', productsError)
  } else {
    console.log(`✅ Sitemap: Found ${products?.length || 0} products`)
  }
  
  // Obtener todas las categorías (tabla es 'categoria', no 'categorias')
  const { data: categories } = await supabase
    .from('categoria')
    .select('id, nombre, fecha_actualizacion')
    .eq('activo', true)

  // Páginas estáticas por locale
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    { url: `${baseUrl}/${locale}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/${locale}/catalogo`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/${locale}/contacto`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/${locale}/nosotros`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ])

  // Páginas de productos por locale
  const productPages: MetadataRoute.Sitemap = (products && products.length > 0)
    ? locales.flatMap((locale) =>
        products.map((product) => {
          if (!product.seo_slug) {
            console.warn('⚠️ Product without seo_slug:', product)
            return null
          }

          // Usar canonical_url si existe, sino construir con marca
          let productPath: string
          if (product.canonical_url && product.canonical_url.startsWith('/')) {
            productPath = product.canonical_url.replace(/^\/(es|en|pt)/, `/${locale}`)
          } else {
            const brandSlug = product.marca && typeof product.marca === 'object' && 'nombre' in product.marca
              ? (product.marca as { nombre: string }).nombre.toLowerCase().replace(/\s+/g, '-')
              : null
            productPath = brandSlug
              ? `/${locale}/producto/${brandSlug}/${product.seo_slug}`
              : `/${locale}/producto/${product.seo_slug}`
          }

          return {
            url: `${baseUrl}${productPath}`,
            lastModified: product.fecha_actualizacion ? new Date(product.fecha_actualizacion) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          } as MetadataRoute.Sitemap[0]
        }).filter((item): item is MetadataRoute.Sitemap[0] => item !== null)
      )
    : []

  // Páginas de categorías por locale (usar nombre normalizado como slug)
  const categoryPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    (categories || []).map((category) => ({
      url: `${baseUrl}/${locale}/categoria/${normalizeName(category.nombre)}`,
      lastModified: category.fecha_actualizacion ? new Date(category.fecha_actualizacion) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  )

  return [...staticPages, ...productPages, ...categoryPages]
}
