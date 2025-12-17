import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { getProductBySlug, getRelatedProducts, Producto } from '@/lib/supabase'
import ProductClient from './ProductClient'

export const revalidate = 3600 // 1 hora (ideal para productos)

interface PageProps {
  params: Promise<{ slug: string[]; locale: string }>
}

// Función cacheada para obtener el producto (evita queries duplicadas)
const getProduct = cache(async (slugSegments: string[]): Promise<Producto | null> => {
  const lastSegment = slugSegments[slugSegments.length - 1]
  
  let productData = await getProductBySlug(lastSegment)
  
  if (!productData && slugSegments.length > 1) {
    const fullSlug = slugSegments.join('/')
    productData = await getProductBySlug(fullSlug)
  }
  
  return productData
})

// Generar metadata dinámico para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe o no está disponible.',
    }
  }

  // Construir URL canónica
  const brandSegment = product.marca && typeof product.marca !== 'string' 
    ? product.marca.nombre.toLowerCase().replace(/\s+/g, '-') 
    : typeof product.marca === 'string' 
      ? (product.marca as string).toLowerCase().replace(/\s+/g, '-')
      : undefined

  const canonicalPath = product.canonical_url && product.canonical_url.startsWith('/')
    ? product.canonical_url
    : brandSegment
      ? `/${locale}/producto/${brandSegment}/${product.seo_slug}`
      : `/${locale}/producto/${product.seo_slug}`

  const canonicalUrl = `https://tienda.inxora.com${canonicalPath}`

  return {
    title: product.seo_title || product.nombre,
    description: product.seo_description || product.descripcion_corta,
    keywords: product.seo_keywords,
    robots: product.meta_robots || 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.seo_title || product.nombre,
      description: product.seo_description || product.descripcion_corta,
      url: canonicalUrl,
      images: product.imagen_principal_url ? [
        {
          url: product.imagen_principal_url,
          alt: product.nombre,
        }
      ] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seo_title || product.nombre,
      description: product.seo_description || product.descripcion_corta,
      images: product.imagen_principal_url ? [product.imagen_principal_url] : undefined,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug, locale } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  // Obtener productos relacionados
  const idCategoria = typeof product.categoria === 'object' ? product.categoria?.id : product.id_categoria
  const idMarca = typeof product.marca === 'object' ? product.marca?.id : product.id_marca
  
  const relatedProducts = await getRelatedProducts(
    product.sku,
    idCategoria,
    idMarca,
    8
  )

  return (
    <ProductClient 
      product={product} 
      relatedProducts={relatedProducts} 
      locale={locale} 
    />
  )
}
