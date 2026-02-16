/**
 * Página de Producto - Server Component (SEO Optimizado)
 * 
 * URL CANÓNICA: /{locale}/{categoria}/{subcategoria}/{marca}/{slug}
 * Ejemplo: /es/herramientas-electricas/herramientas-manuales/milwaukee/sierra-circular-milwaukee-2730
 * 
 * Esta es la ruta canónica para productos, optimizada para SEO:
 * - Sin prefijo /producto/ para URLs más limpias y mejor jerarquía
 * - Estructura semántica: categoría > subcategoría > marca > producto
 * - Metadata dinámica completa (Open Graph, Twitter Cards, JSON-LD)
 * - Soporte multi-idioma (es, en, pt)
 * 
 * El catch-all [...slug] captura el slug del producto (puede ser multi-segmento)
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ProductsService } from '@/lib/services/products.service'
import { getServerCurrency } from '@/lib/utils/server-currency'
import type { CurrencyCode } from '@/lib/constants/currencies'
import { 
  generateCanonicalUrl, 
  generateSeoTitle, 
  cleanSeoDescription, 
  generateMetaKeywords,
  generateProductJsonLd 
} from '@/lib/product-seo'
import ProductClient from './ProductClient'

// Configuración de revalidación para ISR (Incremental Static Regeneration)
export const revalidate = 3600 // Revalidar cada hora

interface ProductPageProps {
  params: Promise<{
    categoria: string
    subcategoria: string
    marca: string
    slug: string[]
    locale: string
  }>
}

// Cache de React para evitar múltiples llamadas a la API en la misma request
const getProduct = cache(async (slug: string, moneda?: CurrencyCode) => {
  return await ProductsService.getProductoBySlug(slug, moneda)
})

const getRelatedProducts = cache(async (
  currentSku: number,
  idMarca: number,
  idSubcategoria: number | undefined,
  moneda: CurrencyCode
) => {
  return await ProductsService.getProductosRelacionados(
    currentSku,
    idMarca,
    idSubcategoria,
    8, // Máximo 8 productos relacionados
    moneda
  )
})

/**
 * Extrae el slug del producto del array de segmentos
 * El último segmento siempre es el slug del producto
 */
function extractProductSlug(slugArray: string[]): string {
  return slugArray[slugArray.length - 1]
}

/**
 * Valida que los parámetros de la URL no sean rutas del sistema
 */
function isValidRoute(params: { categoria: string; subcategoria: string; marca: string; slug: string[] }): boolean {
  const invalidPrefixes = ['.', '_', 'api', 'favicon', 'icon', 'manifest', 'robots', 'sitemap', 'well-known']
  
  // Validar cada segmento
  if (invalidPrefixes.some(prefix => params.categoria.startsWith(prefix))) return false
  if (invalidPrefixes.some(prefix => params.subcategoria.startsWith(prefix))) return false
  if (invalidPrefixes.some(prefix => params.marca.startsWith(prefix))) return false
  if (params.slug.some(s => invalidPrefixes.some(prefix => s.startsWith(prefix)))) return false
  
  return true
}

/**
 * Genera metadata SEO dinámica para el producto
 * Incluye: título optimizado, descripción, keywords, Open Graph, Twitter Cards, alternates
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { categoria, subcategoria, marca, slug, locale } = resolvedParams
  
  // Validar locale
  const validLocales = ['es', 'en', 'pt']
  if (!validLocales.includes(locale)) {
    return { title: 'Producto no encontrado | TIENDA INXORA' }
  }
  
  // Validar que hay al menos un segmento de slug
  if (!slug || slug.length === 0) {
    return { title: 'Producto no encontrado | TIENDA INXORA' }
  }
  
  // Validar rutas del sistema
  if (!isValidRoute({ categoria, subcategoria, marca, slug })) {
    return { title: 'Producto no encontrado | TIENDA INXORA' }
  }
  
  const productSlug = extractProductSlug(slug)
  const moneda = await getServerCurrency()
  
  try {
    const product = await getProduct(productSlug, moneda)
    
    if (!product) {
      return {
        title: 'Producto no encontrado | TIENDA INXORA',
        description: 'El producto que buscas no está disponible.',
        robots: { index: false, follow: true }
      }
    }
    
    // Generar URLs y metadata SEO
    const canonicalUrl = generateCanonicalUrl(product, locale)
    const seoTitle = generateSeoTitle(product)
    const seoDescription = cleanSeoDescription(product.seo_description, product)
    const seoKeywords = generateMetaKeywords(product)
    
    // Imagen principal para Open Graph
    const ogImage = product.imagen_principal_url || 'https://tienda.inxora.com/inxora.png'
    
    // Obtener nombre de marca para metadata adicional
    const marcaNombre = product.marca 
      ? (typeof product.marca === 'object' ? product.marca.nombre : product.marca)
      : undefined
    
    return {
      title: seoTitle,
      description: seoDescription,
      keywords: seoKeywords,
      authors: [{ name: 'INXORA' }],
      creator: 'INXORA',
      publisher: 'INXORA',
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'es': canonicalUrl.replace(`/${locale}/`, '/es/'),
          'en': canonicalUrl.replace(`/${locale}/`, '/en/'),
          'pt': canonicalUrl.replace(`/${locale}/`, '/pt/'),
          'x-default': canonicalUrl.replace(`/${locale}/`, '/es/'),
        },
      },
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: canonicalUrl,
        siteName: 'TIENDA INXORA',
        locale: locale === 'es' ? 'es_PE' : locale === 'pt' ? 'pt_BR' : 'en_US',
        type: 'website',
        images: [
          {
            url: ogImage,
            width: 800,
            height: 600,
            alt: product.nombre,
            type: 'image/jpeg',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: [ogImage],
        creator: '@inxora',
        site: '@inxora',
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'product:brand': marcaNombre || 'INXORA',
        'product:availability': product.id_disponibilidad === 1 ? 'in stock' : 'out of stock',
        'product:condition': 'new',
      },
    }
  } catch (error) {
    console.error('Error generating metadata for product:', error)
    return {
      title: 'Producto | TIENDA INXORA',
      description: 'Suministros industriales en Perú',
    }
  }
}

/**
 * Página de producto - Server Component
 * Renderiza el producto con SEO completo y datos estructurados
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const { categoria, subcategoria, marca, slug, locale } = resolvedParams
  
  // Validar locale
  const validLocales = ['es', 'en', 'pt']
  if (!validLocales.includes(locale)) {
    notFound()
  }
  
  // Validar que hay al menos un segmento de slug
  if (!slug || slug.length === 0) {
    notFound()
  }
  
  // Validar rutas del sistema
  if (!isValidRoute({ categoria, subcategoria, marca, slug })) {
    notFound()
  }
  
  const productSlug = extractProductSlug(slug)
  const moneda = await getServerCurrency()
  
  // Obtener el producto
  const product = await getProduct(productSlug, moneda)
  
  if (!product) {
    notFound()
  }
  
  // Log de debug en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('[ProductPage] Canonical URL route:', {
      categoria,
      subcategoria,
      marca,
      productSlug,
      productName: product.nombre,
    })
  }
  
  // Obtener productos relacionados
  const idMarca = product.marca && typeof product.marca === 'object' 
    ? product.marca.id 
    : product.id_marca
  const idSubcategoria = product.subcategoria_principal && typeof product.subcategoria_principal === 'object'
    ? product.subcategoria_principal.id
    : undefined
    
  let relatedProducts = []
  if (idMarca) {
    try {
      relatedProducts = await getRelatedProducts(
        product.sku,
        idMarca,
        idSubcategoria,
        moneda
      )
    } catch (error) {
      console.error('Error fetching related products:', error)
      // No fallar si no se pueden obtener productos relacionados
    }
  }
  
  // Generar JSON-LD Schema.org para SEO estructurado
  const jsonLd = generateProductJsonLd(product, locale)
  
  // Generar BreadcrumbList JSON-LD para navegación estructurada
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Inicio',
        'item': `https://tienda.inxora.com/${locale}`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': product.categoria && typeof product.categoria === 'object' 
          ? product.categoria.nombre 
          : categoria.replace(/-/g, ' '),
        'item': `https://tienda.inxora.com/${locale}/${categoria}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': product.subcategoria_principal && typeof product.subcategoria_principal === 'object'
          ? product.subcategoria_principal.nombre
          : subcategoria.replace(/-/g, ' '),
        'item': `https://tienda.inxora.com/${locale}/${categoria}/${subcategoria}`
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': product.marca && typeof product.marca === 'object'
          ? product.marca.nombre
          : marca.replace(/-/g, ' '),
        'item': `https://tienda.inxora.com/${locale}/${categoria}/${subcategoria}/${marca}`
      },
      {
        '@type': 'ListItem',
        'position': 5,
        'name': product.nombre,
        'item': generateCanonicalUrl(product, locale)
      }
    ]
  }
  
  return (
    <>
      {/* JSON-LD Schema.org para Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* JSON-LD Schema.org para BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      {/* Componente cliente con la UI del producto */}
      <ProductClient
        product={product}
        relatedProducts={relatedProducts}
        locale={locale}
      />
    </>
  )
}
