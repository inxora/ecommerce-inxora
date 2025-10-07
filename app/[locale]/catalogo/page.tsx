import { Suspense } from 'react'
import { getProductos, getCategorias, getMarcas } from '@/lib/supabase'
import { CatalogClient } from '@/components/catalog/catalog-client'
import { FilterState } from '@/components/catalog/product-filters'
import { Skeleton } from '@/components/ui/skeleton'

interface CatalogPageProps {
  searchParams: {
    page?: string
    categoria?: string
    marca?: string
    buscar?: string
    precioMin?: string
    precioMax?: string
    ordenar?: string
  }
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const page = parseInt(searchParams.page || '1')
  const itemsPerPage = 12

  const filters: FilterState = {
    categoria: searchParams.categoria,
    marca: searchParams.marca,
    precioMin: searchParams.precioMin ? parseInt(searchParams.precioMin) : undefined,
    precioMax: searchParams.precioMax ? parseInt(searchParams.precioMax) : undefined,
    ordenar: searchParams.ordenar,
  }

  const searchTerm = searchParams.buscar || ''

  // Fetch data in parallel
  const [productsData, categoriesData, marcasData] = await Promise.all([
    getProductos(page - 1, itemsPerPage, 
      filters.categoria ? parseInt(filters.categoria) : undefined,
      filters.marca ? parseInt(filters.marca) : undefined,
      searchTerm
    ),
    getCategorias(),
    getMarcas(),
  ])

  const { data: products, count: total } = productsData
  const { data: categories } = categoriesData
  const { data: brands } = marcasData
  const totalPages = Math.ceil((total || 0) / itemsPerPage)

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
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-10 w-full max-w-sm" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Skeleton className="h-96 w-full" />
        </div>
        
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}