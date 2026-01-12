import { Suspense } from 'react'
import { Metadata } from 'next'
import { getProducts, getCategorias, getMarcas } from '@/lib/supabase'
import { CatalogClient } from '@/components/catalog/catalog-client'
import { FilterState } from '@/components/catalog/product-filters'
import { PageLoader } from '@/components/ui/loader'

// Caché optimizado: revalidar cada 60 segundos para mejorar rendimiento
export const dynamic = 'force-dynamic'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Catálogo de Productos | TIENDA INXORA - Suministros Industriales',
  description: 'Explora nuestro catálogo completo de suministros industriales. Herramientas eléctricas, equipos de seguridad, ferretería y más. Filtra por categoría, marca y precio.',
  keywords: 'catálogo industrial, herramientas, equipos de seguridad, ferretería, Milwaukee, DeWalt, 3M, Perú',
  openGraph: {
    title: 'Catálogo de Productos | TIENDA INXORA',
    description: 'Explora nuestro catálogo completo de suministros industriales.',
    type: 'website',
  },
}

interface CatalogPageProps {
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

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1')
  const itemsPerPage = 50

  // Normalize categoria and marca to arrays
  const normalizeToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  const categoriaArray = normalizeToArray(resolvedSearchParams.categoria)
  const marcaArray = normalizeToArray(resolvedSearchParams.marca)

  const filters: FilterState = {
    categoria: categoriaArray.length > 0 ? categoriaArray : undefined,
    marca: marcaArray.length > 0 ? marcaArray : undefined,
    precioMin: resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined,
    precioMax: resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined,
    ordenar: resolvedSearchParams.ordenar,
  }

  const searchTerm = resolvedSearchParams.buscar || ''

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