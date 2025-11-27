import { Suspense } from 'react'
import { getProducts, getCategorias, getMarcas } from '@/lib/supabase'
import { CatalogClient } from '@/components/catalog/catalog-client'
import { FilterState } from '@/components/catalog/product-filters'
import { PageLoader } from '@/components/ui/loader'

interface CatalogPageProps {
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

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const page = parseInt(searchParams.page || '1')
  const itemsPerPage = 12

  // Normalize categoria and marca to arrays
  const normalizeToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  const categoriaArray = normalizeToArray(searchParams.categoria)
  const marcaArray = normalizeToArray(searchParams.marca)

  const filters: FilterState = {
    categoria: categoriaArray.length > 0 ? categoriaArray : undefined,
    marca: marcaArray.length > 0 ? marcaArray : undefined,
    precioMin: searchParams.precioMin ? parseInt(searchParams.precioMin) : undefined,
    precioMax: searchParams.precioMax ? parseInt(searchParams.precioMax) : undefined,
    ordenar: searchParams.ordenar,
  }

  const searchTerm = searchParams.buscar || ''

  // Fetch data in parallel
  // For now, use getProducts which supports multiple filters
  const [productsData, categoriesData, marcasData] = await Promise.all([
    getProducts({
      page,
      limit: itemsPerPage,
      categoria: categoriaArray.length > 0 ? categoriaArray : undefined,
      marca: marcaArray.length > 0 ? marcaArray : undefined,
      buscar: searchTerm,
      precioMin: filters.precioMin,
      precioMax: filters.precioMax,
      ordenar: filters.ordenar,
    }),
    getCategorias(),
    getMarcas(),
  ])

  const { products, total } = productsData
  const { data: categories } = categoriesData
  const { data: brands } = marcasData
  const totalPages = productsData.totalPages || Math.ceil((total || 0) / itemsPerPage)

  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogClient
        products={products || []}
        categories={categories || []}
        brands={brands || []}
        total={total || 0}
        totalPages={totalPages}
        currentPage={page}
        filters={filters}
        searchTerm={searchTerm}
      />
    </Suspense>
  )
}

function CatalogSkeleton() {
  return <PageLoader />
}