import { Suspense } from 'react'
import { getCategorias, getMarcas, getProducts, Categoria, Marca } from '@/lib/supabase'
import { CategoryClient } from '@/components/category/category-client'
import { FilterState } from '@/components/catalog/product-filters'
import { PageLoader } from '@/components/ui/loader'
import { notFound } from 'next/navigation'
import { normalizeName } from '@/lib/product-url'

// Deshabilitar caché para obtener datos frescos siempre
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface CategoryPageProps {
  params: {
    slug: string
    locale: string
  }
  searchParams: {
    page?: string
    categoria?: string | string[]
    marca?: string | string[]
    buscar?: string
    precioMin?: string
    precioMax?: string
    ordenar?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const categorySlug = params.slug
  const page = parseInt(searchParams.page || '1')
  const itemsPerPage = 12

  // Normalize categoria and marca to arrays
  const normalizeToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  const marcaArray = normalizeToArray(searchParams.marca)

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
  const [brandsData, productsData] = await Promise.all([
    getMarcas(),
    getProducts({
      page,
      limit: itemsPerPage,
      categoria: allCategoriaIds,
      marca: marcaArray.length > 0 ? marcaArray : undefined,
      buscar: searchParams.buscar,
      precioMin: searchParams.precioMin ? parseInt(searchParams.precioMin) : undefined,
      precioMax: searchParams.precioMax ? parseInt(searchParams.precioMax) : undefined,
      ordenar: searchParams.ordenar,
    })
  ])

  // Get brands related to this category (brands that have products in this category)
  // We need to fetch all products (not just current page) to get all brands
  const { data: allBrands } = brandsData
  const { products, total } = productsData
  
  // Fetch all products in this category to get complete brand list (for carousel)
  const allProductsData = await getProducts({
    page: 1,
    limit: 1000, // Get a large number to get all brands
    categoria: allCategoriaIds,
    marca: undefined, // No marca filter to get all brands
    buscar: undefined,
    precioMin: undefined,
    precioMax: undefined,
    ordenar: 'nombre_asc',
  })
  
  // Extract unique brand IDs from all products (not just current page)
  const brandIds = new Set(
    allProductsData.products
      ?.map(p => typeof p.marca === 'object' && p.marca ? p.marca.id : null)
      .filter((id): id is number => id !== null) || []
  )
  
  const relatedBrands = (allBrands || []).filter(brand => brandIds.has(brand.id))

  const { data: categories } = categoriesData
  const { data: brands } = brandsData
  const totalPages = productsData.totalPages || Math.ceil((total || 0) / itemsPerPage)

  // Filters state: only ONE category at a time (current category is always selected)
  // Multiple marcas are allowed
  const filters: FilterState = {
    // Current category is always selected (it's in the route)
    categoria: [String(categoryId)],
    marca: marcaArray.length > 0 ? marcaArray : undefined,
    precioMin: searchParams.precioMin ? parseInt(searchParams.precioMin) : undefined,
    precioMax: searchParams.precioMax ? parseInt(searchParams.precioMax) : undefined,
    ordenar: searchParams.ordenar,
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
        searchTerm={searchParams.buscar || ''}
      />
    </Suspense>
  )
}

