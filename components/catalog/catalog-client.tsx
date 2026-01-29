"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { startTransition, useCallback, useRef } from 'react'
import { ProductCard } from '@/components/catalog/product-card'
import { ProductFilters, FilterState } from '@/components/catalog/product-filters'
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
  pageTitle?: string
  pageSubtitle?: string
  brandLogoUrl?: string | null
  hideBrandFilter?: boolean
}

export function CatalogClient({
  products,
  categories,
  brands,
  total,
  totalPages,
  currentPage,
  filters,
  searchTerm,
  pageTitle,
  pageSubtitle,
  brandLogoUrl,
  hideBrandFilter = false,
}: CatalogClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const isUpdatingRef = useRef(false)

  // Función separada para cambios de página - debe definirse antes de updateURL
  const handlePageChange = useCallback((page: number) => {
    // Validar que la página esté en rango válido
    if (page < 1 || page > totalPages) return
    
    // Leer la página actual directamente de searchParams para evitar problemas de sincronización
    const currentPageFromUrl = parseInt(searchParams.get('page') || '1')
    
    // Prevenir actualizaciones si ya estamos en esa página
    if (page === currentPageFromUrl) return
    
    // Crear nuevos params basados en los actuales pero actualizando solo la página
    // Usar searchParams pero crear una nueva instancia para evitar problemas de referencia
    const newParams = new URLSearchParams(searchParams.toString())
    
    // Actualizar el parámetro de página
    if (page === 1) {
      newParams.delete('page')
    } else {
      newParams.set('page', String(page))
    }
    
    // Construir URL completa
    const queryString = newParams.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    
    // Usar router.push directamente sin bloqueos para cambios de página
    // Los cambios de página deben tener prioridad sobre otras actualizaciones
    router.push(url, { scroll: false })
  }, [searchParams, router, pathname, totalPages])

  const updateURL = useCallback((updates: Partial<FilterState & { page?: string; buscar?: string }>) => {
    // Si solo es un cambio de página, usar handlePageChange directamente y salir
    // Los cambios de página tienen prioridad y no deben ser bloqueados
    if (Object.keys(updates).length === 1 && 'page' in updates && updates.page !== undefined) {
      const pageNum = typeof updates.page === 'string' ? parseInt(updates.page) : updates.page
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
        handlePageChange(pageNum)
        return
      }
    }
    
    // Para otros cambios (filtros), prevenir actualizaciones simultáneas
    if (isUpdatingRef.current) {
      return
    }
    
    isUpdatingRef.current = true
    
    // Usar searchParams de Next.js en lugar de window.location.search para evitar problemas de sincronización
    const currentSearchParams = new URLSearchParams(searchParams.toString())
    
    // Construir params desde el estado actual de la URL
    const newParams = new URLSearchParams(currentSearchParams.toString())
    
    // Determinar si este update incluye un cambio de página explícito
    const hasPageUpdate = 'page' in updates && updates.page !== undefined
    const hasOtherUpdates = Object.keys(updates).some(k => k !== 'page' && k !== 'buscar' && updates[k as keyof typeof updates] !== undefined)
    
    // Preservar la página actual si no hay cambios de filtros (excepto buscar)
    const currentPage = currentSearchParams.get('page')
    
    // Aplicar todos los updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        newParams.delete(key)
        return
      }
      
      if (key === 'marca') {
        newParams.delete(key)
        if (Array.isArray(value)) {
          value.forEach(v => newParams.append(key, String(v)))
        } else {
          newParams.append(key, String(value))
        }
      } else if (key === 'categoria') {
        newParams.delete(key)
        if (Array.isArray(value)) {
          value.forEach(v => newParams.append(key, String(v)))
        } else {
          newParams.append(key, String(value))
        }
      } else if (key === 'page') {
        // Manejar página: solo agregar si no es 1, eliminar si es 1
        const pageValue = String(value)
        if (pageValue === '1') {
          newParams.delete('page')
        } else {
          newParams.set('page', pageValue)
        }
      } else {
        newParams.set(key, String(value))
      }
    })
    
    // Solo resetear página si hubo cambios en filtros (NO en cambios de página explícitos, NO en cambios de búsqueda)
    if (hasOtherUpdates && !hasPageUpdate) {
      newParams.delete('page')
    } else if (!hasPageUpdate && currentPage && !hasOtherUpdates) {
      // Preservar la página actual si no hay cambios de filtros
      if (currentPage !== '1') {
        newParams.set('page', currentPage)
      }
    }
    
    // Construir URL completa usando pathname para Next.js 14 App Router
    const queryString = newParams.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    
    startTransition(() => {
      router.push(url, { scroll: false })
      // Usar un timeout más largo para asegurar que la navegación se complete
      // especialmente importante cuando hay múltiples páginas
      setTimeout(() => { isUpdatingRef.current = false }, 300)
    })
  }, [router, searchParams, handlePageChange, pathname, totalPages]) // Incluir totalPages como dependencia

  const clearFilters = useCallback(() => {
    // Limpiar todos los filtros y volver a la página 1
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="flex items-center space-x-3">
              {brandLogoUrl ? (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={brandLogoUrl} alt={pageTitle || 'Marca'} className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {pageTitle ?? 'Catálogo de Productos'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {pageSubtitle ?? 'Descubre nuestra amplia gama de productos de calidad'}
                </p>
              </div>
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
                hideBrandFilter={hideBrandFilter}
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