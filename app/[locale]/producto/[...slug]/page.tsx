export const revalidate = 3600;

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { Producto } from '@/lib/supabase'
import { ProductsService } from '@/lib/services/products.service'
import { buildCategoryUrlFromObject } from '@/lib/product-url'
import { generateProductSeo } from '@/lib/product-seo'
import ProductClient from './ProductClient'

interface PageProps {
  params: Promise<{ slug: string[]; locale: string }>
}

// Función cacheada para obtener el producto (evita queries duplicadas)
// Solo usa el API externo, ya no usa Supabase
const getProduct = cache(async (slugSegments: string[]): Promise<Producto | null> => {
  const lastSegment = slugSegments[slugSegments.length - 1]
  
  // Buscar en el API externo usando el último segmento (el slug del producto)
  let productData = await ProductsService.getProductoBySlug(lastSegment)
  
  // Si no se encuentra, intentar con el slug completo
  if (!productData && slugSegments.length > 1) {
    const fullSlug = slugSegments.join('/')
    productData = await ProductsService.getProductoBySlug(fullSlug)
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

  // Generar todos los datos SEO optimizados
  const seoData = generateProductSeo(product, locale)

  return {
    title: seoData.seoTitle,
    description: seoData.seoDescription,
    keywords: seoData.seoKeywords,
    robots: product.meta_robots || 'index, follow',
    alternates: {
      canonical: seoData.canonicalUrl,
    },
    openGraph: {
      title: seoData.seoTitle,
      description: seoData.seoDescription,
      url: seoData.canonicalUrl,
      images: product.imagen_principal_url ? [
        {
          url: product.imagen_principal_url,
          alt: `${product.marca && typeof product.marca === 'object' ? product.marca.nombre + ' ' : ''}${product.nombre}${product.cod_producto_marca ? ' modelo ' + product.cod_producto_marca : ''}`,
        }
      ] : [
        {
          url: 'https://tienda.inxora.com/inxora.png',
          alt: 'INXORA - Suministros Industriales',
        }
      ],
      locale: locale === 'es' ? 'es_PE' : locale === 'pt' ? 'pt_BR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.seoTitle,
      description: seoData.seoDescription,
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

  // Obtener productos relacionados desde el API externo
  // Filtrar por marca y subcategoría
  const idMarca = typeof product.marca === 'object' ? product.marca?.id : product.id_marca
  const idSubcategoria = product.subcategoria_principal?.id
  
  const relatedProducts = await ProductsService.getProductosRelacionados(
    product.sku,
    idMarca || 0, // Si no hay marca, usar 0 (no encontrará productos relacionados)
    idSubcategoria,
    8
  )

  // Generar datos SEO usando las nuevas funciones
  const seoData = generateProductSeo(product, locale)
  const canonicalUrl = seoData.canonicalUrl

  // Construir categoría para breadcrumbs
  const categoria = product.categorias && product.categorias.length > 0
    ? product.categorias[0]
    : (product.categoria && typeof product.categoria === 'object'
        ? product.categoria
        : undefined)

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

  // Usar el JSON-LD generado por la función utilitaria
  const productSchema = seoData.jsonLd

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
