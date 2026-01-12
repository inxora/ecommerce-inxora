import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCategorias, getMarcas, getProducts, getMarcasByCategoria, Categoria, Marca } from '@/lib/supabase'
import { CategoryClient } from '@/components/category/category-client'
import { FilterState } from '@/components/catalog/product-filters'
import { PageLoader } from '@/components/ui/loader'
import { notFound } from 'next/navigation'
import { normalizeName } from '@/lib/product-url'

// Caché optimizado: revalidar cada 60 segundos para mejorar rendimiento
export const dynamic = 'force-dynamic'
export const revalidate = 60

interface CategoryPageProps {
  params: Promise<{ slug: string; locale: string }>
  searchParams: Promise<{
    page?: string
    categoria?: string | string[]
    marca?: string | string[]
    buscar?: string
    precioMin?: string
    precioMax?: string
    ordenar?: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  
  const categoriesData = await getCategorias()
  const category = categoriesData.data?.find(c => normalizeName(c.nombre) === slug)
  
  if (!category) {
    return { title: 'Categoría no encontrada' }
  }

  return {
    title: `${category.nombre} | TIENDA INXORA - Suministros Industriales`,
    description: `Encuentra productos de ${category.nombre} en TIENDA INXORA. Los mejores suministros industriales en Perú con envío a todo el país.`,
    openGraph: {
      title: `${category.nombre} | TIENDA INXORA`,
      description: `Productos de ${category.nombre} - Suministros industriales de calidad.`,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug: categorySlug, locale } = await params
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1')
  const itemsPerPage = 50

  // Normalize categoria and marca to arrays
  const normalizeToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  const marcaArray = normalizeToArray(resolvedSearchParams.marca)

  // Fetch all categories first to find the one matching the slug
  const categoriesData = await getCategorias()
  const { data: allCategories } = categoriesData
  
  // Find category by matching normalized name with slug
  const category = allCategories?.find(c => {
    const normalizedName = normalizeName(c.nombre)
    return normalizedName === categorySlug
  })

  if (!category) {
    notFound()
  }

  const categoryId = category.id

  // Only ONE category at a time - use the current category from the route
  // Multiple marcas are allowed
  const allCategoriaIds = [String(categoryId)]

  // Fetch remaining data in parallel
  // OPTIMIZACIÓN: Usar getMarcasByCategoria en lugar de consultar 500 productos
  const [brandsData, productsData, relatedBrandsData] = await Promise.all([
    getMarcas(),
    getProducts({
      page,
      limit: itemsPerPage,
      categoria: allCategoriaIds,
      marca: marcaArray.length > 0 ? marcaArray : undefined,
      buscar: resolvedSearchParams.buscar,
      precioMin: resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined,
      precioMax: resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined,
      ordenar: resolvedSearchParams.ordenar,
    }),
    getMarcasByCategoria(categoryId) // Consulta optimizada directa a relaciones
  ])

  const { products, total } = productsData
  const relatedBrands = relatedBrandsData || []

  const { data: categories } = categoriesData
  const { data: brands } = brandsData
  // Ensure totalPages is calculated correctly - use the total from the query response
  // The total should reflect all products matching the filters (categoria + marca + otros filtros)
  const totalPages = total > 0 && productsData.totalPages > 0
    ? productsData.totalPages 
    : Math.ceil((total || 0) / itemsPerPage)

  // Filters state: only ONE category at a time (current category is always selected)
  // Multiple marcas are allowed
  const filters: FilterState = {
    // Current category is always selected (it's in the route)
    categoria: [String(categoryId)],
    marca: marcaArray.length > 0 ? marcaArray : undefined,
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
