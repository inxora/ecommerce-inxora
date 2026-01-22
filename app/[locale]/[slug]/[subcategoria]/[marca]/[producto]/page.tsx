export const revalidate = 3600;

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { Producto } from '@/lib/supabase'
import { ProductsService } from '@/lib/services/products.service'
import { buildCategoryUrlFromObject, buildCategorySubcategoriaUrl, buildCategorySubcategoriaMarcaUrl } from '@/lib/product-url'
import { generateProductSeo } from '@/lib/product-seo'
import ProductClient from '@/app/[locale]/producto/[...slug]/ProductClient'
import { CategoriesService } from '@/lib/services/categories.service'
import { getCategorias } from '@/lib/supabase'
import { normalizeName } from '@/lib/product-url'

interface PageProps {
  params: Promise<{ slug: string; subcategoria: string; marca: string; producto: string; locale: string }>
}

// Función cacheada para obtener el producto (evita queries duplicadas)
const getProduct = cache(async (productSlug: string): Promise<Producto | null> => {
  // Primero intentar buscar en el API externo
  const productoExterno = await ProductsService.getProductoBySlug(productSlug)
  if (productoExterno) {
    return productoExterno
  }
  // Si no se encuentra en el API externo, retornar null
  // (podríamos agregar fallback a Supabase si es necesario)
  return null
})

// Generar metadata dinámico para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: categorySlug, subcategoria: subcategoriaSlug, marca: brandSlug, producto: productSlug, locale } = await params
  const product = await getProduct(productSlug)

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

export default async function CategorySubcategoriaMarcaProductPage({ params }: PageProps) {
  const { slug: categorySlug, subcategoria: subcategoriaSlug, marca: brandSlug, producto: productSlug, locale } = await params
  
  // Validar que el locale sea válido y que no sea una ruta especial (como .well-known)
  const validLocales = ['es', 'en', 'pt']
  if (!validLocales.includes(locale) || locale.startsWith('.') || locale.startsWith('_')) {
    notFound()
  }

  // Buscar el producto por slug
  const product = await getProduct(productSlug)

  if (!product) {
    notFound()
  }

  // Validar que el producto coincida con la categoría, subcategoría y marca de la URL
  // Obtener categorías y navegación para validar
  const [categoriesData, categoriasNavegacion] = await Promise.all([
    getCategorias(),
    CategoriesService.getCategorias()
  ])

  const category = categoriesData.data?.find(c => normalizeName(c.nombre) === categorySlug)
  
  if (!category) {
    notFound()
  }

  const categoriaNavegacion = categoriasNavegacion.find(c => c.id === category.id)
  if (!categoriaNavegacion) {
    notFound()
  }

  const subcategoria = categoriaNavegacion.subcategorias.find(
    s => normalizeName(s.nombre) === subcategoriaSlug
  )

  if (!subcategoria) {
    notFound()
  }

  const brand = subcategoria.marcas?.find(m => normalizeName(m.nombre) === brandSlug)
  if (!brand) {
    notFound()
  }

  // Validar que el producto pertenezca a esta categoría, subcategoría y marca
  const productCategoryId = product.categoria?.id || (product.categorias && product.categorias.length > 0 ? product.categorias[0].id : undefined)
  const productBrandId = typeof product.marca === 'object' ? product.marca?.id : product.id_marca
  const productSubcategoriaId = product.subcategoria_principal?.id

  // Validar categoría
  if (productCategoryId && productCategoryId !== category.id) {
    // El producto no pertenece a esta categoría, pero continuamos (puede tener múltiples categorías)
    console.warn(`Product ${product.sku} category mismatch: expected ${category.id}, got ${productCategoryId}`)
  }

  // Validar marca
  if (productBrandId && productBrandId !== brand.id) {
    notFound()
  }

  // Validar subcategoría
  if (productSubcategoriaId && productSubcategoriaId !== subcategoria.id) {
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

  // Construir breadcrumbs con la estructura completa: categoria/subcategoria/marca/producto
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: `https://tienda.inxora.com/${locale}`,
    },
  ]

  if (category && typeof category === 'object') {
    const categoriaUrl = `https://tienda.inxora.com${buildCategoryUrlFromObject(category, locale)}`
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: category.nombre,
      item: categoriaUrl,
    })
  }

  if (subcategoria) {
    const subcategoriaUrl = `https://tienda.inxora.com${buildCategorySubcategoriaUrl(category, subcategoria, locale)}`
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: breadcrumbItems.length + 1,
      name: subcategoria.nombre,
      item: subcategoriaUrl,
    })
  }

  if (brand) {
    const brandUrl = `https://tienda.inxora.com${buildCategorySubcategoriaMarcaUrl(category, subcategoria, brand, locale)}`
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: breadcrumbItems.length + 1,
      name: brand.nombre,
      item: brandUrl,
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
