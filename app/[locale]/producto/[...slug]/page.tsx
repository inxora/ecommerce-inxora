/**
 * Página de Redirección 301 para URLs Legacy de Productos
 * 
 * Esta página captura URLs antiguas con el formato:
 * /{locale}/producto/{...cualquier-segmento}/{slug}
 * 
 * Y las redirige a la nueva estructura canónica:
 * /{locale}/{categoria}/{subcategoria}/{marca}/{slug}
 * 
 * Esto preserva el SEO de las URLs antiguas que ya están indexadas
 * y transfiere la autoridad a las nuevas URLs canónicas.
 */

import { redirect, notFound } from 'next/navigation'
import { ProductsService } from '@/lib/services/products.service'
import { buildProductFullUrl, normalizeName } from '@/lib/product-url'

// Configuración para que Next.js maneje esto como dinámico
export const dynamic = 'force-dynamic'

interface LegacyProductPageProps {
  params: Promise<{
    slug: string[]
    locale: string
  }>
}

/**
 * Extrae el slug del producto del array de segmentos
 * El último segmento siempre es el slug del producto
 */
function extractProductSlug(slugArray: string[]): string {
  return slugArray[slugArray.length - 1]
}

/**
 * Valida que los parámetros no sean rutas del sistema
 */
function isSystemRoute(slug: string[]): boolean {
  const systemPrefixes = ['.', '_', 'api', 'favicon', 'icon', 'manifest', 'robots', 'sitemap', 'well-known']
  return slug.some(s => systemPrefixes.some(prefix => s.startsWith(prefix)))
}

/**
 * Página de redirección 301 para URLs legacy
 * Busca el producto y redirige a la nueva URL canónica
 */
export default async function LegacyProductRedirect({ params }: LegacyProductPageProps) {
  const { slug, locale } = await params
  
  // Validar locale
  const validLocales = ['es', 'en', 'pt']
  if (!validLocales.includes(locale)) {
    notFound()
  }
  
  // Validar que hay al menos un segmento
  if (!slug || slug.length === 0) {
    notFound()
  }
  
  // Ignorar rutas del sistema
  if (isSystemRoute(slug)) {
    notFound()
  }
  
  const productSlug = extractProductSlug(slug)
  
  // Log en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('[LegacyRedirect] Processing legacy URL:', {
      slug,
      productSlug,
      locale
    })
  }
  
  try {
    // Buscar el producto para obtener sus datos de categoría/subcategoría/marca
    const product = await ProductsService.getProductoBySlug(productSlug)
    
    if (!product) {
      // Si no se encuentra el producto, mostrar 404
      notFound()
    }
    
    // Extraer datos para construir la nueva URL
    const categoriaNombre = product.categoria && typeof product.categoria === 'object' 
      ? product.categoria.nombre 
      : undefined
    
    const subcategoriaNombre = product.subcategoria_principal && typeof product.subcategoria_principal === 'object'
      ? product.subcategoria_principal.nombre
      : undefined
    
    let marcaNombre: string | undefined
    if (product.marca) {
      if (typeof product.marca === 'object' && 'nombre' in product.marca) {
        marcaNombre = product.marca.nombre
      } else if (typeof product.marca === 'string') {
        marcaNombre = product.marca
      }
    }
    
    // Verificar que tenemos todos los datos necesarios
    if (categoriaNombre && subcategoriaNombre && marcaNombre && product.seo_slug) {
      // Construir la nueva URL canónica
      const newUrl = buildProductFullUrl(
        { nombre: categoriaNombre },
        { nombre: subcategoriaNombre },
        { nombre: marcaNombre },
        product.seo_slug,
        locale
      )
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[LegacyRedirect] Redirecting to:', newUrl)
      }
      
      // Redirección 301 permanente (SEO-friendly)
      redirect(newUrl)
    }
    
    // Si faltan datos, intentar construir URL con lo que tenemos
    if (categoriaNombre && marcaNombre && product.seo_slug) {
      const categorySlug = normalizeName(categoriaNombre)
      const brandSlug = normalizeName(marcaNombre)
      const productSlugNormalized = normalizeName(product.seo_slug) || product.seo_slug
      
      if (categorySlug && brandSlug) {
        const fallbackUrl = `/${locale}/${categorySlug}/${brandSlug}/${productSlugNormalized}`
        redirect(fallbackUrl)
      }
    }
    
    // Si no podemos construir una URL válida, mostrar 404
    console.error('[LegacyRedirect] Cannot build redirect URL, missing data:', {
      categoriaNombre,
      subcategoriaNombre,
      marcaNombre,
      seoSlug: product.seo_slug
    })
    notFound()
    
  } catch (error) {
    // Si es un error de redirección de Next.js, dejarlo pasar
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error
    }
    
    console.error('[LegacyRedirect] Error processing redirect:', error)
    notFound()
  }
}

/**
 * Metadata para páginas de redirección
 * No debería indexarse ya que redirige inmediatamente
 */
export async function generateMetadata() {
  return {
    robots: {
      index: false,
      follow: true,
    },
  }
}
