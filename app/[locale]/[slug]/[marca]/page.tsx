import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCategorias, getMarcas, getProducts, getMarcasByCategoria } from '@/lib/supabase'
import { CategoryClient } from '@/components/category/category-client'
import { FilterState } from '@/components/catalog/product-filters'
import { PageLoader } from '@/components/ui/loader'
import { notFound } from 'next/navigation'
import { normalizeName, buildCategoryBrandUrl } from '@/lib/product-url'

// Caché optimizado: revalidar cada 60 segundos para mejorar rendimiento
export const dynamic = 'force-dynamic'
export const revalidate = 60

interface CategoryBrandPageProps {
  params: Promise<{ slug: string; marca: string; locale: string }>
  searchParams: Promise<{
    page?: string
    buscar?: string
    precioMin?: string
    precioMax?: string
    ordenar?: string
  }>
}

export async function generateMetadata({ params }: CategoryBrandPageProps): Promise<Metadata> {
  const { slug: categorySlug, marca: brandSlug, locale } = await params
  
  const categoriesData = await getCategorias()
  const category = categoriesData.data?.find(c => normalizeName(c.nombre) === categorySlug)
  
  if (!category) {
    return { title: 'Categoría no encontrada' }
  }

  // Obtener marca por slug
  const marcasData = await getMarcas()
  const brand = marcasData.data?.find(m => normalizeName(m.nombre) === brandSlug)
  
  if (!brand) {
    return { title: 'Marca no encontrada' }
  }

  // Generar URL canónica
  const baseUrl = 'https://tienda.inxora.com'
  const canonicalUrl = `${baseUrl}${buildCategoryBrandUrl(category, brand, locale)}`

  return {
    title: `${category.nombre} ${brand.nombre} | TIENDA INXORA - Suministros Industriales`,
    description: `Encuentra productos de ${category.nombre} de la marca ${brand.nombre} en TIENDA INXORA. Los mejores suministros industriales en Perú con envío a todo el país.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.nombre} ${brand.nombre} | TIENDA INXORA`,
      description: `Productos de ${category.nombre} de la marca ${brand.nombre} - Suministros industriales de calidad.`,
      url: canonicalUrl,
    },
  }
}

export default async function CategoryBrandPage({ params, searchParams }: CategoryBrandPageProps) {
  const { slug: categorySlug, marca: brandSlug, locale } = await params
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1')
  const itemsPerPage = 50

  // Fetch all categories and brands first to find matches
  const [categoriesData, brandsData] = await Promise.all([
    getCategorias(),
    getMarcas(),
  ])
  
  const { data: allCategories } = categoriesData
  const { data: allBrands } = brandsData

  // Find category by matching normalized name with slug
  const category = allCategories?.find(c => {
    const normalizedName = normalizeName(c.nombre)
    return normalizedName === categorySlug
  })

  if (!category) {
    notFound()
  }

  // Find brand by matching normalized name with slug
  const brand = allBrands?.find(m => {
    const normalizedName = normalizeName(m.nombre)
    return normalizedName === brandSlug
  })

  if (!brand) {
    notFound()
  }

  const categoryId = category.id
  const brandId = brand.id

  // Fetch remaining data in parallel
  const [productsData, relatedBrandsData] = await Promise.all([
    getProducts({
      page,
      limit: itemsPerPage,
      categoria: [String(categoryId)],
      marca: [String(brandId)], // Solo esta marca
      buscar: resolvedSearchParams.buscar,
      precioMin: resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined,
      precioMax: resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined,
      ordenar: resolvedSearchParams.ordenar,
    }),
    getMarcasByCategoria(categoryId) // Para mostrar otras marcas disponibles
  ])

  const { products, total } = productsData
  const relatedBrands = relatedBrandsData || []

  const { data: categories } = categoriesData
  const { data: brands } = brandsData
  
  const totalPages = total > 0 && productsData.totalPages > 0
    ? productsData.totalPages 
    : Math.ceil((total || 0) / itemsPerPage)

  // Filters state: category from route, marca from route
  const filters: FilterState = {
    categoria: [String(categoryId)],
    marca: [String(brandId)], // Solo esta marca
    precioMin: resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined,
    precioMax: resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined,
    ordenar: resolvedSearchParams.ordenar,
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <CategoryClient
        category={category}
        products={products || []}
        categories={categories || []}
        brands={brands || []}
        relatedBrands={relatedBrands}
        total={total || 0}
        totalPages={totalPages}
        currentPage={page}
        filters={filters}
        searchTerm={resolvedSearchParams.buscar || ''}
      />
    </Suspense>
  )
}
