'use client'

import { useEffect, useState, useMemo } from 'react'
import { useFavorites } from '@/lib/hooks/use-favorites'
import { useCurrency } from '@/lib/hooks/use-currency'
import { ProductCard } from '@/components/catalog/product-card'
import { Producto } from '@/lib/supabase'
import { ProductsService } from '@/lib/services/products.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, ShoppingBag, Search, Filter, ArrowUpDown, ShoppingCart, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCart } from '@/lib/hooks/use-cart'
import { useToast } from '@/lib/hooks/use-toast'
import { cn } from '@/lib/utils'

type SortOption = 'date' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

export default function FavoritesPage() {
  const { favorites, clearFavorites, getFavoritesCount, removeFavorite } = useFavorites()
  const { currency } = useCurrency()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [products, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('date')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
  const params = useParams() as { locale?: string }
  const locale = typeof params?.locale === 'string' ? params.locale : 'es'

  useEffect(() => {
    const loadFavoriteProducts = async () => {
      setLoading(true)
      try {
        // Optimización: Limitar la cantidad de favoritos a cargar simultáneamente
        // Cargar en lotes pequeños para evitar sobrecargar el servidor
        const maxConcurrent = 5 // Máximo 5 peticiones simultáneas
        const validProducts: Producto[] = []
        
        // Procesar favoritos en lotes
        for (let i = 0; i < favorites.length; i += maxConcurrent) {
          const batch = favorites.slice(i, i + maxConcurrent)
          const productPromises = batch.map(fav => 
            ProductsService.getProductoBySku(fav.sku, currency).catch(() => null)
          )
          
          const batchResults = await Promise.all(productPromises)
          const batchValid = batchResults.filter((p): p is Producto => p !== null)
          validProducts.push(...batchValid)
        }
        
        setProducts(validProducts)
      } catch (error) {
        console.error('Error loading favorite products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (favorites.length > 0) {
      loadFavoriteProducts()
    } else {
      setProducts([])
      setLoading(false)
    }
  }, [favorites, currency])

  const favoritesCount = getFavoritesCount()

  // Obtener categorías y marcas únicas de los productos
  const categories = useMemo(() => {
    const cats = new Set<string>()
    products.forEach(p => {
      if (p.categoria?.nombre) cats.add(p.categoria.nombre)
      if (p.categorias && p.categorias.length > 0) {
        p.categorias.forEach(c => c.nombre && cats.add(c.nombre))
      }
    })
    return Array.from(cats).sort()
  }, [products])

  const brands = useMemo(() => {
    const brs = new Set<string>()
    products.forEach(p => {
      if (p.marca?.nombre) brs.add(p.marca.nombre)
    })
    return Array.from(brs).sort()
  }, [products])

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(query) ||
        p.descripcion_corta?.toLowerCase().includes(query) ||
        p.sku_producto?.toLowerCase().includes(query)
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => {
        if (p.categoria?.nombre === selectedCategory) return true
        return p.categorias?.some(c => c.nombre === selectedCategory)
      })
    }

    // Filtrar por marca
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.marca?.nombre === selectedBrand)
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.precio_venta || 0) - (b.precio_venta || 0)
        case 'price-desc':
          return (b.precio_venta || 0) - (a.precio_venta || 0)
        case 'name-asc':
          return a.nombre.localeCompare(b.nombre)
        case 'name-desc':
          return b.nombre.localeCompare(a.nombre)
        case 'date':
        default:
          // Ordenar por fecha de agregado (más recientes primero)
          const aIndex = favorites.findIndex(f => f.sku === a.sku)
          const bIndex = favorites.findIndex(f => f.sku === b.sku)
          return bIndex - aIndex
      }
    })

    return filtered
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy, favorites])

  // Agregar todos los productos seleccionados al carrito
  const handleAddSelectedToCart = () => {
    if (selectedProducts.size === 0) return

    const selectedProductsList = filteredAndSortedProducts.filter(p => 
      selectedProducts.has(p.sku)
    )

    selectedProductsList.forEach(product => {
      addItem(product)
    })

    toast({
      title: "¡Productos agregados!",
      description: `${selectedProductsList.length} producto(s) agregado(s) al carrito`,
      variant: "success",
    })

    setSelectedProducts(new Set())
  }

  // Eliminar productos seleccionados de favoritos
  const handleRemoveSelected = () => {
    if (selectedProducts.size === 0) return

    selectedProducts.forEach(sku => {
      removeFavorite(sku)
    })

    toast({
      title: "Productos eliminados",
      description: `${selectedProducts.size} producto(s) eliminado(s) de favoritos`,
      variant: "default",
    })

    setSelectedProducts(new Set())
  }

  // Toggle selección de producto
  const toggleProductSelection = (sku: number) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(sku)) {
      newSelected.delete(sku)
    } else {
      newSelected.add(sku)
    }
    setSelectedProducts(newSelected)
  }

  // Seleccionar/deseleccionar todos
  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredAndSortedProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredAndSortedProducts.map(p => p.sku)))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando favoritos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Mis Favoritos
              </h1>
              {favoritesCount > 0 && (
                <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold">
                  {favoritesCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {favoritesCount > 0 && selectedProducts.size > 0 && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleAddSelectedToCart}
                    className="bg-inxora-blue hover:bg-inxora-blue/90"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Agregar seleccionados ({selectedProducts.size})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveSelected}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar seleccionados
                  </Button>
                </>
              )}
              {favoritesCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFavorites}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar todo
                </Button>
              )}
            </div>
          </div>

          {/* Barra de búsqueda y filtros */}
          {favoritesCount > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 space-y-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar en favoritos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>

              {/* Filtros y ordenamiento */}
              <div className="flex flex-wrap gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Categoría">
                      {selectedCategory === 'all' ? 'Todas las categorías' : selectedCategory}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Marca">
                      {selectedBrand === 'all' ? 'Todas las marcas' : selectedBrand}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ordenar por">
                      {sortBy === 'date' && 'Más recientes'}
                      {sortBy === 'price-asc' && 'Precio: menor a mayor'}
                      {sortBy === 'price-desc' && 'Precio: mayor a menor'}
                      {sortBy === 'name-asc' && 'Nombre: A-Z'}
                      {sortBy === 'name-desc' && 'Nombre: Z-A'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Más recientes</SelectItem>
                    <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                    <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                    <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                    <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Información de resultados */}
              {filteredAndSortedProducts.length !== products.length && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {filteredAndSortedProducts.length} de {products.length} productos
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {favoritesCount === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Heart className="h-24 w-24 text-gray-300 dark:text-gray-700 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No tienes favoritos aún
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Agrega productos a tus favoritos haciendo clic en el ícono de corazón para verlos aquí más tarde.
            </p>
            <Button asChild>
              <Link href={`/${locale}/catalogo`}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Explorar productos
              </Link>
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Heart className="h-24 w-24 text-gray-300 dark:text-gray-700 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No se pudieron cargar los productos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Algunos productos pueden haber sido eliminados o no estar disponibles.
            </p>
            <Button asChild>
              <Link href={`/${locale}/catalogo`}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Explorar productos
              </Link>
            </Button>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Search className="h-24 w-24 text-gray-300 dark:text-gray-700 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron productos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              {searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda para encontrar más productos.'
                : 'Algunos productos pueden haber sido eliminados o no estar disponibles.'}
            </p>
            {(searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedBrand('all')
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Opción de seleccionar todos */}
            {filteredAndSortedProducts.length > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSelectAll}
                  className="text-sm"
                >
                  {selectedProducts.size === filteredAndSortedProducts.length
                    ? 'Deseleccionar todo'
                    : 'Seleccionar todo'}
                </Button>
                {selectedProducts.size > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedProducts.size} producto(s) seleccionado(s)
                  </span>
                )}
              </div>
            )}

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => {
                const isSelected = selectedProducts.has(product.sku)
                const isUnavailable = !product.activo || !product.visible_web
                
                return (
                  <div key={product.sku} className="relative">
                    {/* Checkbox de selección */}
                    <div className="absolute top-2 left-2 z-10">
                      <button
                        onClick={() => toggleProductSelection(product.sku)}
                        className={cn(
                          "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                          isSelected
                            ? "bg-inxora-blue border-inxora-blue text-white"
                            : "bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 hover:border-inxora-blue"
                        )}
                        aria-label={isSelected ? "Deseleccionar producto" : "Seleccionar producto"}
                      >
                        {isSelected && (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Badge de no disponible */}
                    {isUnavailable && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="px-2 py-1 rounded bg-gray-800 text-white text-xs font-medium">
                          No disponible
                        </span>
                      </div>
                    )}

                    <ProductCard product={product} />
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

