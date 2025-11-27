'use client'

import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { ProductCard } from '@/components/catalog/product-card'
import { ProductFilters, FilterState } from '@/components/catalog/product-filters'
import { ProductSearch } from '@/components/catalog/product-search'
import { ProductPagination } from '@/components/catalog/product-pagination'
import { CategoryBrandsCarousel } from '@/components/category/category-brands-carousel'
import { Producto, Categoria, Marca } from '@/lib/supabase'
import { Search, Package } from 'lucide-react'

interface CategoryClientProps {
  category: Categoria
  products: Producto[]
  categories: Categoria[]
  brands: Marca[]
  relatedBrands: Marca[]
  total: number
  totalPages: number
  currentPage: number
  filters: FilterState
  searchTerm: string
}

export function CategoryClient({
  category,
  products,
  categories,
  brands,
  relatedBrands,
  total,
  totalPages,
  currentPage,
  filters,
  searchTerm
}: CategoryClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams() as { locale?: string }
  const locale = typeof params?.locale === 'string' ? params.locale : 'es'

  const updateURL = (updates: Partial<FilterState & { page?: string; buscar?: string }>) => {
    // Special handling for categoria: if selecting a different category, navigate to that category page
    if (updates.categoria !== undefined) {
      const categoriaArray = Array.isArray(updates.categoria) ? updates.categoria : [updates.categoria]
      const currentCategoryIdStr = String(category.id)
      
      // Get the selected category (should be only one)
      const selectedCategoryId = categoriaArray.length > 0 ? categoriaArray[0] : null
      
      // If a different category is selected, navigate to that category page
      if (selectedCategoryId && selectedCategoryId !== currentCategoryIdStr) {
        const newParams = new URLSearchParams()
        
        // Preserve marca filters (multiple marcas allowed)
        if (updates.marca) {
          const marcaArray = Array.isArray(updates.marca) ? updates.marca : [updates.marca]
          marcaArray.forEach(m => newParams.append('marca', String(m)))
        } else if (filters.marca) {
          const marcaArray = Array.isArray(filters.marca) ? filters.marca : [filters.marca]
          marcaArray.forEach(m => newParams.append('marca', String(m)))
        }
        
        // Preserve other filters
        if (updates.precioMin !== undefined) newParams.set('precioMin', String(updates.precioMin))
        else if (filters.precioMin !== undefined) newParams.set('precioMin', String(filters.precioMin))
        
        if (updates.precioMax !== undefined) newParams.set('precioMax', String(updates.precioMax))
        else if (filters.precioMax !== undefined) newParams.set('precioMax', String(filters.precioMax))
        
        if (updates.ordenar) newParams.set('ordenar', String(updates.ordenar))
        else if (filters.ordenar) newParams.set('ordenar', String(filters.ordenar))
        
        if (searchTerm) newParams.set('buscar', searchTerm)
        
        // Navigate to the new category page
        const url = `/${locale}/categoria/${selectedCategoryId}?${newParams.toString()}`
        router.push(url)
        return
      }
      
      // If current category is selected, just update other filters (categoria is in the route)
      const params = new URLSearchParams(searchParams.toString())
      params.delete('categoria') // Remove categoria from params (it's in the route)
      
      // Update other filters
      Object.entries(updates).forEach(([key, val]) => {
        if (key !== 'categoria' && val !== undefined && val !== '') {
          if (key === 'marca' && Array.isArray(val)) {
            params.delete(key)
            val.forEach(v => params.append(key, String(v)))
          } else {
            params.set(key, String(val))
          }
        } else if (key !== 'categoria') {
          params.delete(key)
        }
      })
      
      if (!('page' in updates)) {
        params.delete('page')
      }
      
      const url = `?${params.toString()}`
      router.push(url)
      return
    }
    
    // Default handling for other filters
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        // Handle arrays for marca
        if (key === 'marca') {
          params.delete(key)
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, String(v)))
          } else {
            params.set(key, String(value))
          }
        } else if (key !== 'categoria') {
          params.set(key, String(value))
        }
      } else if (key !== 'categoria') {
        params.delete(key)
      }
    })
    
    // Reset to first page when filters change (except for page updates)
    if (!('page' in updates)) {
      params.delete('page')
    }
    
    const url = `?${params.toString()}`
    router.push(url)
  }


  return (
    <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-8 min-h-[calc(100vh-120px)]">
      {/* Related Brands Carousel - Moved to top */}
      {relatedBrands.length > 0 && (
        <div className="mb-6">
          <CategoryBrandsCarousel brands={relatedBrands} categoryId={category.id} />
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <ProductSearch
          searchTerm={searchTerm}
          onSearchChange={(value) => updateURL({ buscar: value })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ProductFilters
              categories={categories}
              brands={brands}
              filters={filters}
              totalProducts={total}
              categoryName={category.nombre}
              categoryDescription={category.descripcion}
              currentCategoryId={category.id}
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
                    Mostrando <span className="text-inxora-blue font-semibold">{(currentPage - 1) * 12 + 1}-{Math.min(currentPage * 12, total)}</span> de <span className="text-inxora-blue font-semibold">{total}</span> productos
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
                  onPageChange={(page) => updateURL({ page: page.toString() })}
                  totalItems={total}
                  itemsPerPage={12}
                />
              </div>
            </>
          ) : (
            <div className="py-12 sm:py-16 lg:py-20">
              <div className="text-center max-w-lg mx-auto">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Intenta ajustar los filtros o buscar con otros términos.
                </p>
                <button
                  onClick={() => updateURL({})}
                  className="inline-flex items-center px-4 py-2 bg-inxora-blue hover:bg-inxora-blue/90 text-white rounded-lg transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

