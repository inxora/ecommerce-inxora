'use client'

import { useEffect, useState } from 'react'
import { useFavorites } from '@/hooks/use-favorites'
import { ProductCard } from '@/components/catalog/product-card'
import { getProductBySku, Producto } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function FavoritesPage() {
  const { favorites, clearFavorites, getFavoritesCount } = useFavorites()
  const [products, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams() as { locale?: string }
  const locale = typeof params?.locale === 'string' ? params.locale : 'es'

  useEffect(() => {
    const loadFavoriteProducts = async () => {
      setLoading(true)
      try {
        // Obtener productos completos desde la base de datos usando los SKUs de favoritos
        const productPromises = favorites.map(fav => 
          getProductBySku(fav.sku).catch(() => null)
        )
        
        const loadedProducts = await Promise.all(productPromises)
        const validProducts = loadedProducts.filter((p): p is Producto => p !== null)
        
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
  }, [favorites])

  const favoritesCount = getFavoritesCount()

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
          <div className="flex items-center justify-between mb-4">
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
            {favoritesCount > 0 && (
              <Button
                variant="outline"
                onClick={clearFavorites}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Limpiar favoritos
              </Button>
            )}
          </div>
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
        ) : (
          <>
            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

