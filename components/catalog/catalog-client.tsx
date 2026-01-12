"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { ProductCard } from '@/components/catalog/product-card'
import { ProductFilters, FilterState } from '@/components/catalog/product-filters'
import { ProductSearch } from '@/components/catalog/product-search'
import { ProductPagination } from '@/components/catalog/product-pagination'
import { Producto, Categoria, Marca } from '@/lib/supabase'
import { Search, Filter, Package } from 'lucide-react'

interface CatalogClientProps {
  products: Producto[]
  categories: Categoria[]
  brands: Marca[]
  total: number
  totalPages: number
  currentPage: number
  filters: FilterState
  searchTerm: string
}

export function CatalogClient({
  products,
  categories,
  brands,
  total,
  totalPages,
  currentPage,
  filters,
  searchTerm
}: CatalogClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Función separada para cambios de página - más robusta
  const handlePageChange = useCallback((page: number) => {
    // Validar que la página esté en rango válido
    if (page < 1 || page > totalPages) return
    
    const currentPageFromUrl = parseInt(searchParams.get('page') || '1')
    
    // Prevenir actualizaciones si ya estamos en esa página
    if (page === currentPageFromUrl) return
    
    // Crear nuevos params basados en los actuales
    const newParams = new URLSearchParams(searchParams.toString())
    
    // Actualizar el parámetro de página
    if (page === 1) {
      newParams.delete('page')
    } else {
      newParams.set('page', String(page))
    }
    
    // Construir URL con query params
    const queryString = newParams.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    
    // Usar router.push para navegación - asegurar que se preserve el estado
    router.push(url, { scroll: false })
  }, [searchParams, router, pathname, totalPages])

  const updateURL = useCallback((updates: Partial<FilterState & { page?: string; buscar?: string }>) => {
    // Si solo es un cambio de página, usar handlePageChange directamente
    if (Object.keys(updates).length === 1 && 'page' in updates && updates.page !== undefined) {
      const pageNum = typeof updates.page === 'string' ? parseInt(updates.page) : updates.page
      if (!isNaN(pageNum) && pageNum > 0) {
        handlePageChange(pageNum)
        return
      }
    }
    
    // Crear nuevos params desde los actuales
    const params = new URLSearchParams(searchParams.toString())
    
    // Determinar si este update incluye un cambio de página explícito
    const hasPageUpdate = 'page' in updates && updates.page !== undefined
    const hasOtherUpdates = Object.keys(updates).some(k => k !== 'page' && updates[k as keyof typeof updates] !== undefined)
    
    // Procesar todos los updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        params.delete(key)
        return
      }
      
      // Handle arrays for categoria and marca
      if (key === 'categoria' || key === 'marca') {
        // Remove existing values for this key
        params.delete(key)
        // Add all values from array
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)))
        } else {
          params.set(key, String(value))
        }
      } else if (key === 'page') {
        // Manejar página: solo agregar si no es 1, eliminar si es 1
        const pageValue = String(value)
        if (pageValue === '1') {
          params.delete('page')
        } else {
          params.set('page', pageValue)
        }
      } else {
        params.set(key, String(value))
      }
    })
    
    // Solo resetear página si hubo cambios en filtros (NO en cambios de página explícitos)
    if (hasOtherUpdates && !hasPageUpdate) {
      params.delete('page')
    }
    
    // Construir URL completa usando pathname para Next.js 14 App Router
    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    
    router.push(url, { scroll: false })
  }, [searchParams, router, pathname, handlePageChange])

  const clearFilters = useCallback(() => {
    // Limpiar todos los filtros y volver a la página 1
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Catálogo de Productos
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Descubre nuestra amplia gama de productos de calidad
                </p>
              </div>
            </div>
            
            <div className="w-full sm:w-auto sm:max-w-md">
              <ProductSearch 
                searchTerm={searchTerm}
                onSearchChange={(term) => updateURL({ buscar: term })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-5 lg:p-6 shadow-md border border-gray-200 dark:border-gray-700 sticky top-4">
              <div className="flex items-center space-x-2 mb-5">
                <Filter className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Filtros
                </h2>
              </div>
              <ProductFilters
                categories={categories}
                brands={brands}
                filters={filters}
                totalProducts={total}
                onFiltersChange={(newFilters) => updateURL(newFilters)}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products && products.length > 0 ? (
              <>
                {/* Results Info */}
                <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
                      Mostrando <span className="text-inxora-blue font-semibold">{(currentPage - 1) * 50 + 1}-{Math.min(currentPage * 50, total)}</span> de <span className="text-inxora-blue font-semibold">{total}</span> productos
                    </p>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <Package className="h-4 w-4" />
                      <span>Página {currentPage} de {totalPages}</span>
                    </div>
                  </div>
                </div>
                
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.sku} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={total}
                    itemsPerPage={50}
                  />
                </div>
              </>
            ) : (
              <div className="py-12 sm:py-16 lg:py-20">
                <div className="text-center max-w-lg mx-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    No se encontraron productos
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                    Intenta ajustar los filtros o buscar otros términos para encontrar lo que necesitas.
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}