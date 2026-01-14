import { MetadataRoute } from 'next'
import { getSupabaseClient, getSupabaseAdmin, getCategorias, getMarcasByCategoria } from '@/lib/supabase'
import { buildCategoryUrlFromObject, buildCategoryBrandUrl } from '@/lib/product-url'
import { generateCanonicalUrl } from '@/lib/product-seo'

// Configuración para regenerar el sitemap automáticamente
// ISR: El sitemap se regenera máximo cada 1 hora (3600 segundos)
// Esto significa que productos nuevos aparecerán en máximo 1 hora
export const revalidate = 3600

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
    // Usar cliente admin para bypasear RLS y obtener todos los productos activos
    const supabase = getSupabaseAdmin()
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
  // CATEGORÍAS CON MARCA (SOLO ES)
  // ===============================
  const categoryBrandPages: MetadataRoute.Sitemap = []
  
  // Generar URLs para cada combinación categoría/marca
  for (const category of categories) {
    try {
      // Obtener marcas disponibles para esta categoría
      const brandsForCategory = await getMarcasByCategoria(category.id)
      
      if (brandsForCategory && brandsForCategory.length > 0) {
        // Agregar URL para cada marca
        for (const brand of brandsForCategory) {
          categoryBrandPages.push({
            url: `${baseUrl}${buildCategoryBrandUrl(category, brand, locale)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6, // Prioridad ligeramente menor que categorías base
          })
        }
      }
    } catch (error) {
      console.error(`❌ Error fetching brands for category ${category.id}:`, error)
      // Continuar con la siguiente categoría
    }
  }
  
  console.log(`✅ Sitemap: Found ${categoryBrandPages.length} category-brand combinations`)

  // ===============================
  // PRODUCTOS (SOLO ES)
  // ===============================
  const productPages: MetadataRoute.Sitemap = products
    .map((product) => {
      if (!product.seo_slug) return null

      // Normalizar categoría y marca para construir objeto Producto parcial
      // Las categorías ahora vienen como array de relaciones producto_categoria
      let categorias: Array<{ id: number; nombre: string; es_principal?: boolean }> = []
      if (product.categorias) {
        if (Array.isArray(product.categorias) && product.categorias.length > 0) {
          categorias = product.categorias
            .map((pc: any) => pc?.categoria)
            .filter((cat: any) => cat != null)
        } else if (!Array.isArray(product.categorias) && 'categoria' in product.categorias) {
          categorias = [product.categorias.categoria]
        }
      }
      // Fallback a categoria singular para compatibilidad
      if (categorias.length === 0 && product.categoria) {
        const cat = Array.isArray(product.categoria) 
          ? product.categoria[0] 
          : product.categoria
        if (cat) categorias = [cat]
      }

      const marca = Array.isArray(product.marca) 
        ? product.marca[0] 
        : product.marca
      
      // Construir objeto Producto parcial compatible con generateCanonicalUrl
      const productForUrl = {
        seo_slug: product.seo_slug,
        categorias: categorias.length > 0 ? categorias : undefined,
        categoria: categorias.length > 0 ? categorias[0] : undefined,
        marca,
      } as any

      // Usar generateCanonicalUrl para asegurar URLs correctas (tienda.inxora.com)
      // NO usar canonical_url del producto (puede apuntar a app.inxora.com)
      const canonicalUrl = generateCanonicalUrl(productForUrl, locale)

      return {
        url: canonicalUrl, // URL completa ya generada correctamente
        lastModified: product.fecha_actualizacion
          ? new Date(product.fecha_actualizacion)
          : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    })
    .filter(Boolean) as MetadataRoute.Sitemap

  return [...staticPages, ...categoryPages, ...categoryBrandPages, ...productPages]
}
