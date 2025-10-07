"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/catalog/product-card'
import { ProductFilters, FilterState } from '@/components/catalog/product-filters'
import { ProductSearch } from '@/components/catalog/product-search'
import { ProductPagination } from '@/components/catalog/product-pagination'
import { Card, CardContent } from '@/components/ui/card'
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

  const updateURL = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // Reset to first page when filters change (except for page updates)
    if (!updates.page) {
      params.delete('page')
    }
    
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Catálogo de Productos
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Descubre nuestra amplia gama de productos de calidad
                </p>
              </div>
            </div>
            
            <div className="relative">
              <ProductSearch 
                searchTerm={searchTerm}
                onSearchChange={(term) => updateURL({ buscar: term })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl sticky top-8">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
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
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg mb-8">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Mostrando <span className="text-blue-600 font-semibold">{(currentPage - 1) * 12 + 1}-{Math.min(currentPage * 12, total)}</span> de <span className="text-blue-600 font-semibold">{total}</span> productos
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Package className="h-4 w-4" />
                      <span>Página {currentPage} de {totalPages}</span>
                    </div>
                  </div>
                </div>
                
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {products.map((product) => (
                    <ProductCard key={product.sku} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => updateURL({ page: page.toString() })}
                  />
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                  <div className="flex items-center space-x-3">
                    <Search className="h-8 w-8 text-white" />
                    <h3 className="text-2xl font-bold text-white">Sin resultados</h3>
                  </div>
                </div>
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      No se encontraron productos
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                      Intenta ajustar los filtros o buscar otros términos para encontrar lo que necesitas.
                    </p>
                    <button 
                      onClick={() => updateURL({ buscar: '', categoria: '', marca: '', precioMin: '', precioMax: '', ordenar: '' })}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Limpiar filtros
                    </button>
                  </div>
                </CardContent>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}