export const revalidate = 3600;

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { getProductBySlug, getRelatedProducts, Producto } from '@/lib/supabase'
import { buildProductUrl, buildCategoryUrlFromObject } from '@/lib/product-url'
import ProductClient from './ProductClient'

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

  // Construir URL canónica usando buildProductUrl para consistencia
  const canonicalPath = product.canonical_url && product.canonical_url.startsWith('/')
    ? product.canonical_url
    : buildProductUrl(product, locale)

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
          width: 1200,
          height: 630,
        }
      ] : [
        {
          url: 'https://tienda.inxora.com/inxora.png',
          alt: 'INXORA - Suministros Industriales',
          width: 1200,
          height: 630,
        }
      ],
      locale: locale === 'es' ? 'es_PE' : locale === 'pt' ? 'pt_BR' : 'en_US',
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
  // Usar la primera categoría del array de categorías, o la categoría singular para compatibilidad
  const idCategoria = product.categorias && product.categorias.length > 0 
    ? product.categorias[0].id 
    : (typeof product.categoria === 'object' ? product.categoria?.id : undefined)
  const idMarca = typeof product.marca === 'object' ? product.marca?.id : product.id_marca
  
  const relatedProducts = await getRelatedProducts(
    product.sku,
    idCategoria,
    idMarca,
    8
  )

  // Construir URL canónica para JSON-LD
  const canonicalPath = product.canonical_url && product.canonical_url.startsWith('/')
    ? product.canonical_url
    : buildProductUrl(product, locale)
  const canonicalUrl = `https://tienda.inxora.com${canonicalPath}`

  // Asegurar que las imágenes sean URLs absolutas para JSON-LD
  const productImages = product.imagen_principal_url 
    ? (Array.isArray(product.imagen_principal_url) 
        ? product.imagen_principal_url.map(img => 
            img.startsWith('http') ? img : `https://tienda.inxora.com${img}`
          )
        : [product.imagen_principal_url.startsWith('http') 
            ? product.imagen_principal_url 
            : `https://tienda.inxora.com${product.imagen_principal_url}`])
    : ['https://tienda.inxora.com/inxora.png']

  // Construir categoría para breadcrumbs y schema
  const categoria = product.categorias && product.categorias.length > 0
    ? product.categorias[0]
    : (product.categoria && typeof product.categoria === 'object'
        ? product.categoria
        : undefined)
  const categoriaNombre = categoria 
    ? (typeof categoria === 'object' ? categoria.nombre : categoria)
    : undefined

  // Construir JSON-LD Schema para BreadcrumbList
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: `https://tienda.inxora.com/${locale}`,
    },
  ]

  if (categoria && typeof categoria === 'object') {
    const categoriaUrl = `https://tienda.inxora.com${buildCategoryUrlFromObject(categoria, locale)}`
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: categoria.nombre,
      item: categoriaUrl,
    })
  }

  breadcrumbItems.push({
    '@type': 'ListItem',
    position: breadcrumbItems.length + 1,
    name: product.nombre,
    item: canonicalUrl,
  })

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  // Construir JSON-LD Schema para Product
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nombre,
    description: product.descripcion_corta || product.descripcion_detallada || product.nombre,
    image: productImages,
    sku: product.sku_producto || product.sku.toString(),
    brand: product.marca 
      ? (typeof product.marca === 'object' 
          ? { '@type': 'Brand', name: product.marca.nombre }
          : { '@type': 'Brand', name: product.marca })
      : undefined,
    category: categoriaNombre,
    offers: product.precios_por_moneda?.soles
      ? {
          '@type': 'Offer',
          price: product.precios_por_moneda.soles.precio_venta.toString(),
          priceCurrency: 'PEN',
          availability: product.disponibilidad?.nombre === 'Disponible' 
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: canonicalUrl,
          seller: {
            '@type': 'Organization',
            name: 'INXORA',
            url: 'https://tienda.inxora.com',
          },
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }
      : undefined,
    url: canonicalUrl,
    ...(product.structured_data || {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductClient 
        product={product} 
        relatedProducts={relatedProducts} 
        locale={locale} 
      />
    </>
  )
}
