'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, Eye, Package } from 'lucide-react'
import { Producto, Product } from '@/lib/supabase'
import { useCart } from '@/lib/hooks/use-cart'
import { useFavorites } from '@/lib/hooks/use-favorites'
import { useCurrency } from '@/lib/hooks/use-currency'
import { useToast } from '@/lib/hooks/use-toast'
import { formatPrice } from '@/lib/utils'
import { buildProductUrl } from '@/lib/product-seo'

interface ProductCardProps {
  product: Producto
}

export function ProductCard({ product }: ProductCardProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'es'
  const { addItem } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { currency, currencySymbol } = useCurrency()
  const { toast } = useToast()
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const productUrl = buildProductUrl(product, locale)
  const isFav = isFavorite(product.sku)

  // Obtener precio según la moneda seleccionada
  const getPrecio = () => {
    if (product.precios_por_moneda) {
      if (currency === 'PEN' && product.precios_por_moneda.soles) {
        return product.precios_por_moneda.soles.precio_venta
      }
      if (currency === 'USD' && product.precios_por_moneda.dolares) {
        return product.precios_por_moneda.dolares.precio_venta
      }
    }
    
    // Fallback a array de precios
    if (product.precios && product.precios.length > 0) {
      const precio = product.precios.find(p => p.moneda?.codigo === currency) || product.precios[0]
      return precio?.precio_venta || 0
    }
    
    return 0
  }

  const precio = getPrecio()

  // Función para formatear precio con símbolo de moneda
  // formatPrice ya incluye el símbolo de moneda, así que solo lo usamos directamente
  const formatCurrencyPrice = (price: number) => {
    // formatPrice ya formatea con el símbolo de moneda, pero está hardcodeado a PEN
    // Necesitamos formatear según la moneda seleccionada
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price)
    }
    // Para PEN, usar formatPrice que ya está configurado para soles
    return formatPrice(price)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // addItem espera un Product completo, simplemente pasar el producto
    // El precio ya está calculado en la variable precio
    addItem(product, 1)

    toast({
      title: 'Producto agregado',
      description: `${product.nombre} se agregó al carrito`,
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isFav) {
      removeFavorite(product.sku)
      toast({
        title: 'Eliminado de favoritos',
        description: `${product.nombre} se eliminó de tus favoritos`,
      })
    } else {
      // addFavorite espera un Product completo
      addFavorite(product)
      toast({
        title: 'Agregado a favoritos',
        description: `${product.nombre} se agregó a tus favoritos`,
      })
    }
  }

  return (
    <Link href={productUrl}>
      <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 group relative">
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          {product.es_destacado && (
            <Badge variant="default" className="bg-yellow-500 text-white">
              Destacado
            </Badge>
          )}
          {product.es_novedad && (
            <Badge variant="default" className="bg-green-500 text-white">
              Nuevo
            </Badge>
          )}
        </div>

        <div className="absolute top-2 left-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white ${
              isFav ? 'text-red-500' : 'text-gray-600'
            }`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="aspect-square relative mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
            {product.imagen_principal_url && !imageError ? (
              <Image
                src={product.imagen_principal_url}
                alt={product.nombre}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={`object-contain p-4 group-hover:scale-110 transition-transform duration-300 ${
                  isImageLoading ? 'blur-sm' : 'blur-0'
                }`}
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setImageError(true)
                  setIsImageLoading(false)
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-300 dark:text-gray-600" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            {typeof product.marca === 'object' && product.marca?.nombre && (
              <p className="text-xs text-muted-foreground font-medium">
                {product.marca.nombre}
              </p>
            )}
            
            <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] text-gray-900 dark:text-white">
              {product.nombre}
            </h3>

            {product.sku && (
              <p className="text-xs text-muted-foreground">
                SKU: {product.sku}
              </p>
            )}

            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold text-inxora-blue dark:text-inxora-light-blue">
                {formatCurrencyPrice(precio)}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            className="flex-1 bg-inxora-blue hover:bg-inxora-blue/90 text-white"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Agregar
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
