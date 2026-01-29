import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { getMarcaBySlug, getCategorias, getMarcas } from '@/lib/supabase'
import { ProductsService } from '@/lib/services/products.service'
import { CatalogClient } from '@/components/catalog/catalog-client'
import { FilterState } from '@/components/catalog/product-filters'
import { PageLoader } from '@/components/ui/loader'
import { normalizeName } from '@/lib/product-url'

export const dynamic = 'force-dynamic'
export const revalidate = 60

interface MarcaPageProps {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{
    page?: string
    categoria?: string | string[]
    precioMin?: string
    precioMax?: string
    ordenar?: string
    buscar?: string
  }>
}

export async function generateMetadata({ params }: MarcaPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const brand = await getMarcaBySlug(slug)
  if (!brand) return { title: 'Marca no encontrada' }

  const baseUrl = 'https://tienda.inxora.com'
  return {
    title: `Productos ${brand.nombre} | Suministros Industriales | Inxora Perú`,
    description: `Encuentra productos ${brand.nombre} en TIENDA INXORA. Distribuidor autorizado en Perú. Precios competitivos y envíos a todo el país.`,
    openGraph: {
      title: `Productos ${brand.nombre} | Inxora Perú`,
      description: `Compra ${brand.nombre} en TIENDA INXORA. Suministros industriales de calidad.`,
      url: `${baseUrl}/${locale}/marca/${slug}`,
    },
    alternates: { canonical: `${baseUrl}/${locale}/marca/${slug}` },
  }
}

export default async function MarcaPage({ params, searchParams }: MarcaPageProps) {
  const { locale, slug } = await params
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1')
  const itemsPerPage = 50

  const brand = await getMarcaBySlug(slug)
  if (!brand) notFound()

  const normalizeToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }
  const categoriaArray = normalizeToArray(resolvedSearchParams.categoria)

  const filters: FilterState = {
    categoria: categoriaArray.length > 0 ? categoriaArray : undefined,
    marca: [String(brand.id)],
    precioMin: resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined,
    precioMax: resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined,
    ordenar: resolvedSearchParams.ordenar,
  }

  const searchTerm = resolvedSearchParams.buscar || ''

  const [productsData, categoriesData, marcasData] = await Promise.all([
    ProductsService.getProductos({
      page,
      limit: itemsPerPage,
      id_marca: brand.id,
      categoria_id: categoriaArray.length > 0 ? categoriaArray.map((c) => parseInt(c)) : undefined,
      buscar: searchTerm || undefined,
      visible_web: true,
      precioMin: resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined,
      precioMax: resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined,
      ordenar: resolvedSearchParams.ordenar,
    }),
    getCategorias(),
    getMarcas(),
  ])

  let { products, total } = productsData
  const { data: allCategories } = categoriesData
  const { data: brands } = marcasData

  // Respaldo: si el API no filtra por precio, filtrar en servidor para que lo mostrado sea correcto
  const precioMinNum = resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined
  const precioMaxNum = resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined
  if ((precioMinNum !== undefined || precioMaxNum !== undefined) && products?.length) {
    products = products.filter((p) => {
      const price = p.precio_venta ?? 0
      if (precioMinNum !== undefined && price < precioMinNum) return false
      if (precioMaxNum !== undefined && price > precioMaxNum) return false
      return true
    })
  }

  const totalPages = productsData.totalPages || Math.ceil((total || 0) / itemsPerPage)

  // Categorías relacionadas: solo las que tienen productos de esta marca (desde los productos devueltos)
  const relatedCategoryIds = new Set<number>()
  products?.forEach((p) => {
    const cat = p.categoria
    if (cat && typeof cat === 'object' && 'id' in cat) relatedCategoryIds.add(cat.id)
  })
  const categories =
    relatedCategoryIds.size > 0 && allCategories?.length
      ? allCategories.filter((c) => relatedCategoryIds.has(c.id))
      : (allCategories ?? [])

  const baseUrl = 'https://tienda.inxora.com'
  const brandSlugForUrl = normalizeName(brand.nombre) || slug

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Productos ${brand.nombre}`,
    description: `Catálogo de productos ${brand.nombre} en TIENDA INXORA.`,
    url: `${baseUrl}/${locale}/marca/${brandSlugForUrl}`,
    numberOfItems: total,
    provider: { '@type': 'Organization', name: 'TIENDA INXORA', url: baseUrl },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products?.length || 0,
      itemListElement: (products || []).slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: (page - 1) * itemsPerPage + index + 1,
        item: {
          '@type': 'Product',
          name: product.nombre,
          description: product.descripcion_corta || product.nombre,
          image: product.imagen_principal_url || `${baseUrl}/placeholder-product.png`,
          sku: product.sku_producto || String(product.sku),
          url: `${baseUrl}/${locale}/marca/${brandSlugForUrl}`,
          brand: { '@type': 'Brand', name: brand.nombre },
          offers: {
            '@type': 'Offer',
            price: product.precio_venta || 0,
            priceCurrency: 'PEN',
            availability: 'https://schema.org/InStock',
          },
        },
      })),
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${baseUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${baseUrl}/${locale}/catalogo` },
      { '@type': 'ListItem', position: 3, name: brand.nombre, item: `${baseUrl}/${locale}/marca/${brandSlugForUrl}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Suspense fallback={<PageLoader />}>
        <CatalogClient
          products={products || []}
          categories={categories}
          brands={brands || []}
          total={total || 0}
          totalPages={totalPages}
          currentPage={page}
          filters={filters}
          searchTerm={searchTerm}
          pageTitle={brand.nombre}
          pageSubtitle={`Productos de ${brand.nombre} en TIENDA INXORA`}
          brandLogoUrl={brand.logo_url || null}
          hideBrandFilter
        />
      </Suspense>
    </>
  )
}
