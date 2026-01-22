'use client'

import { useRouter, useSearchParams, useParams, usePathname } from 'next/navigation'
import { startTransition, useCallback, useRef } from 'react'
import { ProductCard } from '@/components/catalog/product-card'
import { ProductFilters, FilterState } from '@/components/catalog/product-filters'
import { ProductSearch } from '@/components/catalog/product-search'
import { ProductPagination } from '@/components/catalog/product-pagination'
import { CategoryBrandsCarousel } from '@/components/category/category-brands-carousel'
import { CategorySubcategoryFilter } from '@/components/category/category-subcategory-filter'
import { Producto, Categoria, Marca } from '@/lib/supabase'
import { Search, Package } from 'lucide-react'
import { buildCategoryUrl, buildCategorySubcategoriaUrl, buildCategorySubcategoriaMarcaUrl, normalizeName } from '@/lib/product-url'
import { CategoriesService, SubcategoriaNavegacion } from '@/lib/services/categories.service'

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
  const pathname = usePathname()
  const params = useParams() as { locale?: string; slug?: string; subcategoria?: string; marca?: string }
  const locale = typeof params?.locale === 'string' ? params.locale : 'es'
  
  const isUpdatingRef = useRef(false)
  
  // ✅ FIX: Separar las dependencias estables de las inestables
  const categoryIdRef = useRef(category.id)
  const localeRef = useRef(locale)
  // ✅ FIX: Estabilizar params para evitar bucles infinitos
  const paramsRef = useRef(params)
  const subcategoriaSlugRef = useRef<string | undefined>(params.subcategoria)
  
  // Actualizar refs cuando cambien los valores
  categoryIdRef.current = category.id
  localeRef.current = locale
  if (paramsRef.current.subcategoria !== params.subcategoria) {
    paramsRef.current = { ...params }
    subcategoriaSlugRef.current = params.subcategoria
  }
  
  // ✅ FIX: Memoizar categorías navegación para evitar llamadas repetidas
  const categoriasNavegacionRef = useRef<Awaited<ReturnType<typeof CategoriesService.getCategorias>> | null>(null)
  const categoriasNavegacionLoadingRef = useRef(false)

  // ✅ FIX: Función helper para obtener categorías navegación (memoizada)
  const getCategoriasNavegacion = useCallback(async () => {
    if (categoriasNavegacionRef.current && !categoriasNavegacionLoadingRef.current) {
      return categoriasNavegacionRef.current
    }
    if (categoriasNavegacionLoadingRef.current) {
      // Esperar a que termine la carga actual
      return new Promise<Awaited<ReturnType<typeof CategoriesService.getCategorias>>>((resolve) => {
        const checkInterval = setInterval(() => {
          if (categoriasNavegacionRef.current && !categoriasNavegacionLoadingRef.current) {
            clearInterval(checkInterval)
            resolve(categoriasNavegacionRef.current!)
          }
        }, 100)
        setTimeout(() => {
          clearInterval(checkInterval)
          if (!categoriasNavegacionRef.current) {
            categoriasNavegacionLoadingRef.current = false
          }
        }, 5000)
      })
    }
    categoriasNavegacionLoadingRef.current = true
    try {
      const categorias = await CategoriesService.getCategorias()
      categoriasNavegacionRef.current = categorias
      return categorias
    } finally {
      categoriasNavegacionLoadingRef.current = false
    }
  }, [])

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
    
    // Special handling for categoria
    if (updates.categoria !== undefined) {
      const categoriaArray = Array.isArray(updates.categoria) ? updates.categoria : [updates.categoria]
      const currentCategoryIdStr = String(categoryIdRef.current)
      const selectedCategoryId = categoriaArray.length > 0 ? categoriaArray[0] : null
      
      if (selectedCategoryId && selectedCategoryId !== currentCategoryIdStr) {
        const selectedCategory = categories.find(c => String(c.id) === selectedCategoryId)
        if (!selectedCategory) {
          isUpdatingRef.current = false
          return
        }
        
        const newParams = new URLSearchParams()
        
        // Preserve existing filters from current URL
        const currentMarca = currentSearchParams.getAll('marca')
        if (updates.marca) {
          const marcaArray = Array.isArray(updates.marca) ? updates.marca : [updates.marca]
          marcaArray.forEach(m => newParams.append('marca', String(m)))
        } else if (currentMarca.length > 0) {
          currentMarca.forEach(m => newParams.append('marca', m))
        }
        
        const currentPrecioMin = currentSearchParams.get('precioMin')
        const currentPrecioMax = currentSearchParams.get('precioMax')
        const currentOrdenar = currentSearchParams.get('ordenar')
        const currentBuscar = currentSearchParams.get('buscar')
        const currentPage = currentSearchParams.get('page')
        
        if (updates.precioMin !== undefined) newParams.set('precioMin', String(updates.precioMin))
        else if (currentPrecioMin) newParams.set('precioMin', currentPrecioMin)
        
        if (updates.precioMax !== undefined) newParams.set('precioMax', String(updates.precioMax))
        else if (currentPrecioMax) newParams.set('precioMax', currentPrecioMax)
        
        if (updates.ordenar) newParams.set('ordenar', String(updates.ordenar))
        else if (currentOrdenar) newParams.set('ordenar', currentOrdenar)
        
        if (updates.buscar) newParams.set('buscar', updates.buscar)
        else if (currentBuscar) newParams.set('buscar', currentBuscar)
        
        // Preservar página si no hay cambio explícito
        if (updates.page) {
          if (updates.page !== '1') newParams.set('page', updates.page)
        } else if (currentPage && currentPage !== '1') {
          newParams.set('page', currentPage)
        }
        
        const categoryUrl = buildCategoryUrl(selectedCategory.nombre, localeRef.current)
        const url = `${categoryUrl}?${newParams.toString()}`
        
        startTransition(() => {
          router.push(url, { scroll: false })
          setTimeout(() => { isUpdatingRef.current = false }, 200)
        })
        return
      }
      
      // Current category selected - remove categoria param and update others
      currentSearchParams.delete('categoria')
    }
    
    // Verificar si solo se está seleccionando UNA marca (sin otros filtros)
    // En ese caso, usar la estructura de URL: /{locale}/{slug}/{marca}
    const marcaValue = updates.marca
    const isMarcaUpdate = 'marca' in updates && marcaValue !== undefined
    
    if (isMarcaUpdate) {
      // Normalizar a array para verificar
      const marcaArray = Array.isArray(marcaValue) ? marcaValue : [marcaValue]
      const hasOnlyOneMarca = marcaArray.length === 1
      const hasNoOtherFilters = 
        !updates.precioMin &&
        !updates.precioMax &&
        !updates.ordenar &&
        !updates.buscar &&
        !currentSearchParams.get('precioMin') &&
        !currentSearchParams.get('precioMax') &&
        !currentSearchParams.get('ordenar') &&
        !currentSearchParams.get('buscar')
      
      // Si solo hay UNA marca y no hay otros filtros, buscar subcategoría y navegar
      if (hasOnlyOneMarca && hasNoOtherFilters) {
        const marcaId = String(marcaArray[0])
        const selectedBrand = brands.find(b => String(b.id) === marcaId)
        
        if (selectedBrand) {
          // Si ya estamos en una ruta con subcategoría, usar esa subcategoría
          // ✅ FIX: Usar el ref estabilizado en lugar de params directamente
          const currentSubcategoriaSlug = subcategoriaSlugRef.current
          
          if (currentSubcategoriaSlug) {
            // Ya estamos en una subcategoría, navegar directamente a categoría/subcategoría/marca
            // ✅ FIX: Usar categorías memoizadas para evitar llamadas repetidas
            getCategoriasNavegacion()
              .then(categoriasNavegacion => {
                const categoriaNavegacion = categoriasNavegacion.find(c => c.id === category.id)
                if (categoriaNavegacion) {
                  const subcategoriaActual = categoriaNavegacion.subcategorias.find(
                    sub => normalizeName(sub.nombre) === currentSubcategoriaSlug
                  )
                  
                  if (subcategoriaActual) {
                    const brandUrl = buildCategorySubcategoriaMarcaUrl(
                      category,
                      subcategoriaActual,
                      selectedBrand,
                      locale
                    )
                    
                    startTransition(() => {
                      router.push(brandUrl, { scroll: false })
                      setTimeout(() => { isUpdatingRef.current = false }, 200)
                    })
                    return
                  }
                }
                
                // Si no se encuentra la subcategoría actual, buscar la que contiene la marca
                // Reutilizar categoriaNavegacion que ya fue encontrada arriba
                if (categoriaNavegacion) {
                  const subcategoriaConMarca = categoriaNavegacion.subcategorias.find(sub => 
                    sub.marcas && sub.marcas.some(m => m.id === Number(marcaId))
                  )
                  
                  if (subcategoriaConMarca) {
                    const brandUrl = buildCategorySubcategoriaMarcaUrl(
                      category,
                      subcategoriaConMarca,
                      selectedBrand,
                      locale
                    )
                    
                    startTransition(() => {
                      router.push(brandUrl, { scroll: false })
                      setTimeout(() => { isUpdatingRef.current = false }, 200)
                    })
                    return
                  }
                }
                
                isUpdatingRef.current = false
              })
              .catch(error => {
                console.error('Error finding subcategoria for brand:', error)
                isUpdatingRef.current = false
              })
            
            return
          }
          
          // Si no hay subcategoría en la URL, buscar la subcategoría que contiene esta marca
          // ✅ FIX: Usar categorías memoizadas para evitar llamadas repetidas
          getCategoriasNavegacion()
            .then(categoriasNavegacion => {
              const categoriaNavegacion = categoriasNavegacion.find(c => c.id === category.id)
              if (categoriaNavegacion) {
                // Buscar la primera subcategoría que contiene esta marca
                const subcategoriaConMarca = categoriaNavegacion.subcategorias.find(sub => 
                  sub.marcas && sub.marcas.some(m => m.id === Number(marcaId))
                )
                
                if (subcategoriaConMarca) {
                  // Navegar a categoría/subcategoría/marca
                  const brandUrl = buildCategorySubcategoriaMarcaUrl(
                    category,
                    subcategoriaConMarca,
                    selectedBrand,
                    locale
                  )
                  
                  startTransition(() => {
                    router.push(brandUrl, { scroll: false })
                    setTimeout(() => { isUpdatingRef.current = false }, 200)
                  })
                  return
                } else {
                  // Si no se encuentra subcategoría, navegar solo a la subcategoría más relevante
                  const primeraSubcategoria = categoriaNavegacion.subcategorias.find(sub => sub.activo)
                  if (primeraSubcategoria) {
                    const subcategoriaUrl = buildCategorySubcategoriaUrl(category, primeraSubcategoria, locale)
                    startTransition(() => {
                      router.push(subcategoriaUrl, { scroll: false })
                      setTimeout(() => { isUpdatingRef.current = false }, 200)
                    })
                    return
                  }
                }
              }
              
              // Fallback: mantener filtro en URL actual si no se encuentra subcategoría
              isUpdatingRef.current = false
            })
            .catch(error => {
              console.error('Error finding subcategoria for brand:', error)
              // Fallback: mantener filtro en URL actual
              isUpdatingRef.current = false
            })
          
          // Retornar temprano mientras se busca la subcategoría
          return
        }
      }
    }
    
    // Si se está eliminando la marca (value === undefined, '' o array vacío)
    const isRemovingMarca = 
      'marca' in updates && 
      (marcaValue === undefined || 
       marcaValue === '' || 
       (Array.isArray(marcaValue) && marcaValue.length === 0))
    
    if (isRemovingMarca && !updates.precioMin && !updates.precioMax && !updates.ordenar && !updates.buscar) {
      // Verificar si hay otros filtros activos en la URL actual
      const hasOtherActiveFilters = 
        currentSearchParams.get('precioMin') ||
        currentSearchParams.get('precioMax') ||
        currentSearchParams.get('ordenar') ||
        currentSearchParams.get('buscar')
      
      if (!hasOtherActiveFilters) {
        // Volver a la URL base de la categoría
        const categoryBaseUrl = buildCategoryUrl(category.nombre, locale)
        
        startTransition(() => {
          router.push(categoryBaseUrl, { scroll: false })
          setTimeout(() => { isUpdatingRef.current = false }, 200)
        })
        return
      }
    }
    
    // Construir params desde el estado actual de la URL
    const newParams = new URLSearchParams(currentSearchParams.toString())
    
    // Determinar si este update incluye un cambio de página explícito
    const hasPageUpdate = 'page' in updates && updates.page !== undefined
    const hasOtherUpdates = Object.keys(updates).some(k => k !== 'page' && k !== 'buscar' && updates[k as keyof typeof updates] !== undefined)
    
    // Preservar la página actual si no hay cambios de filtros (excepto buscar)
    const currentPage = currentSearchParams.get('page')
    
    // Aplicar todos los updates
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'categoria') {
        newParams.delete('categoria')
        return
      }
      
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
  }, [router, categories, searchParams, handlePageChange, pathname, totalPages, brands, locale, category]) // ✅ FIX: Remover params de dependencias para evitar bucles infinitos

  // Detectar si estamos en una ruta con subcategoría usando el ref estabilizado
  const currentSubcategoriaSlug = subcategoriaSlugRef.current

  return (
    <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-8 pb-16">
      {/* Filtro de subcategorías - arriba de las marcas */}
      <div className="mb-6">
        <CategorySubcategoryFilter category={category} locale={locale} />
      </div>

      {relatedBrands.length > 0 && (
        <div className="mb-6">
          <CategoryBrandsCarousel brands={relatedBrands} category={category} />
        </div>
      )}

      <div className="mb-6">
        <ProductSearch
          searchTerm={searchTerm}
          onSearchChange={(value) => updateURL({ buscar: value })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
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
              onFiltersChange={updateURL}
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          {products && products.length > 0 ? (
            <>
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.sku} product={product} />
                ))}
              </div>
              
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