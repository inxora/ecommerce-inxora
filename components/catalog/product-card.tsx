'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/lib/supabase'
import { useCart } from '@/lib/hooks/use-cart'
import { useToast } from '@/lib/hooks/use-toast'
import { useCurrency } from '@/lib/hooks/use-currency'
import { useFavorites } from '@/lib/hooks/use-favorites'
import { useParams } from 'next/navigation'
import { buildProductUrl } from '@/lib/product-url'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const { currency } = useCurrency()
  const { toggleFavorite, isFavorite } = useFavorites()
  const params = useParams() as { locale?: string }
  const locale = typeof params?.locale === 'string' ? params.locale : 'es'
  
  const isWishlisted = isFavorite(product.sku)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('ProductCard - Adding to cart:', product)
    addItem(product)
    
    // Mostrar notificación de éxito
    toast({
      title: "¡Producto agregado!",
      description: `${product.nombre} se agregó al carrito`,
      variant: "success",
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product)
  }

  // Usar función helper para construir URL de forma consistente
  const productUrl = buildProductUrl(product, locale)

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1">
      <Link href={productUrl}>
        <div className="relative">
          {/* Product Image */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 aspect-square">
            {product.imagen_principal_url && product.imagen_principal_url.trim() !== '' && !imageError ? (
              <>
              <Image
                src={product.imagen_principal_url}
                alt={product.nombre || 'Producto sin nombre'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                loading="lazy"
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  onError={(e) => {
                    // Silenciar el error para evitar que cierre el servidor
                  console.warn(`Error cargando imagen para producto ${product.sku}: ${product.imagen_principal_url}`)
                  setImageError(true)
                    // Prevenir propagación del error
                    e.stopPropagation()
                  }}
                  onLoad={() => {
                    // Si la imagen carga correctamente, asegurarse de que imageError sea false
                    setImageError(false)
                }}
                unoptimized={false}
              />
                {/* Fallback placeholder que se muestra si la imagen falla */}
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium line-clamp-3" aria-label={product.nombre || 'Producto sin imagen'}>
                        {product.nombre || 'Sin imagen'}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium line-clamp-3" aria-label={product.nombre || 'Producto sin imagen'}>
                    {product.nombre || 'Sin imagen'}
                  </p>
                </div>
              </div>
            )}
            
            {/* Eye Icon on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button 
                variant="secondary" 
                size="icon"
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.location.href = productUrl
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.es_destacado && (
                <Badge className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Destacado
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <div className="absolute top-2 right-2 z-10">
              <Button 
                variant="ghost" 
                size="icon"
                className={`h-8 w-8 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-all shadow-md hover:shadow-lg ${
                  isWishlisted ? 'text-red-500 hover:text-red-600' : 'text-gray-700 dark:text-gray-300 hover:text-red-500'
                }`}
                onClick={handleWishlist}
                aria-label={isWishlisted ? "Eliminar de favoritos" : "Agregar a favoritos"}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <CardContent className="p-2.5 sm:p-3 space-y-1.5">
            {/* Brand */}
            {product.marca && (
              <div className="flex items-center justify-between gap-1.5">
                <Badge variant="outline" className="text-xs sm:text-sm font-medium border-0 px-1.5 py-0.5">
                  {typeof product.marca === 'string' ? product.marca : product.marca.nombre}
                </Badge>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  SKU: {product.sku_producto || product.sku}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-inxora-dark-blue dark:text-gray-100 line-clamp-2 text-sm sm:text-base leading-tight group-hover:text-inxora-blue transition-colors">
              {product.nombre}
            </h3>

            {/* Price */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex flex-col min-w-0 flex-1">
                {/* Precio según moneda seleccionada */}
                {currency === 'PEN' && product.precios_por_moneda?.soles && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-inxora-blue">
                      {product.precios_por_moneda.soles.moneda.simbolo} {product.precios_por_moneda.soles.precio_venta.toFixed(2)}
                    </span>
                    {product.precios_por_moneda.soles.precio_referencia && product.precios_por_moneda.soles.precio_referencia > product.precios_por_moneda.soles.precio_venta && (
                      <span className="text-xs text-gray-500 line-through">
                        {product.precios_por_moneda.soles.moneda.simbolo} {product.precios_por_moneda.soles.precio_referencia.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
                
                {currency === 'USD' && product.precios_por_moneda?.dolares && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-inxora-blue">
                      {product.precios_por_moneda.dolares.moneda.simbolo} {product.precios_por_moneda.dolares.precio_venta.toFixed(2)}
                    </span>
                    {product.precios_por_moneda.dolares.precio_referencia && product.precios_por_moneda.dolares.precio_referencia > product.precios_por_moneda.dolares.precio_venta && (
                      <span className="text-xs text-gray-500 line-through">
                        {product.precios_por_moneda.dolares.moneda.simbolo} {product.precios_por_moneda.dolares.precio_referencia.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Fallback si no hay precio en la moneda seleccionada */}
                {((currency === 'PEN' && !product.precios_por_moneda?.soles) ||
                  (currency === 'USD' && !product.precios_por_moneda?.dolares)) && !product.precios_por_moneda?.dolares && (
                  <div className="flex items-center gap-1">
                    <span className="text-base sm:text-lg font-bold text-inxora-blue">
                      Consultar precio
                    </span>
                  </div>
                )}
              </div>
              
              {/* Discount Badge */}
              {product.precios_por_moneda?.soles?.precio_referencia && product.precios_por_moneda.soles.precio_referencia > product.precios_por_moneda.soles.precio_venta && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5 flex-shrink-0">
                  -{Math.round(((product.precios_por_moneda.soles.precio_referencia - product.precios_por_moneda.soles.precio_venta) / product.precios_por_moneda.soles.precio_referencia) * 100)}%
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1.5 mt-2">
              <Button 
                variant="outline"
                className="flex-1 w-full text-inxora-blue border-inxora-blue hover:bg-inxora-blue hover:text-white transition-all duration-200 text-xs sm:text-sm h-7 sm:h-8"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.location.href = productUrl
                }}
              >
                <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                Ver
              </Button>
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-inxora-blue hover:bg-inxora-blue/90 text-white transition-all duration-200 hover:shadow-md text-xs sm:text-sm h-7 sm:h-8"
                size="sm"
              >
                <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                Agregar
              </Button>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  )
}