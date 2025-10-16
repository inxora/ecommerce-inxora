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
import { useCart } from '@/hooks/use-cart'
import { useToast } from '@/hooks/use-toast'
import { useParams } from 'next/navigation'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()
  const params = useParams() as { locale?: string }
  const locale = typeof params?.locale === 'string' ? params.locale : 'es'

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
    setIsWishlisted(!isWishlisted)
  }

  const brandSegment = product.marca && typeof product.marca !== 'string' 
    ? product.marca.nombre.toLowerCase().replace(/\s+/g, '-') 
    : typeof product.marca === 'string' 
      ? (product.marca as string).toLowerCase().replace(/\s+/g, '-')
      : undefined
  const productUrl = brandSegment 
    ? `/${locale}/producto/${brandSegment}/${product.seo_slug}` 
    : `/${locale}/producto/${product.seo_slug}`

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1">
      <Link href={productUrl}>
        <div className="relative">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <Image
              src={product.imagen_principal_url || '/placeholder-product.svg'}
              alt={product.nombre}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Eye Icon on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button 
                variant="secondary" 
                size="icon"
                className="h-12 w-12 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.location.href = productUrl
                }}
              >
                <Eye className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.es_destacado && (
                <Badge className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Destacado
                </Badge>
              )}
              {product.categoria && (
                <Badge variant="secondary" className="text-xs bg-white/90 dark:bg-slate-800/90 text-gray-700 dark:text-gray-300 backdrop-blur-sm">
                  {typeof product.categoria === 'string' ? product.categoria : product.categoria.nombre}
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <div className="absolute top-3 right-3">
              <Button 
                variant="ghost" 
                size="icon"
                className={`h-8 w-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-colors ${
                  isWishlisted ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
                }`}
                onClick={handleWishlist}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <CardContent className="p-4 space-y-3">
            {/* Brand */}
            {product.marca && (
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs font-medium">
                  {typeof product.marca === 'string' ? product.marca : product.marca.nombre}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  SKU: {product.sku_producto || product.sku}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors">
              {product.nombre}
            </h3>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {/* Precio en soles */}
                {product.precios_por_moneda?.soles && (
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-primary">
                      {product.precios_por_moneda.soles.moneda.simbolo} {product.precios_por_moneda.soles.precio_venta.toFixed(2)}
                    </span>
                    {product.precios_por_moneda.soles.precio_referencia && product.precios_por_moneda.soles.precio_referencia > product.precios_por_moneda.soles.precio_venta && (
                      <span className="text-xs text-gray-500 line-through">
                        {product.precios_por_moneda.soles.moneda.simbolo} {product.precios_por_moneda.soles.precio_referencia.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Precio en dólares */}
                {product.precios_por_moneda?.dolares && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-blue-600">
                      {product.precios_por_moneda.dolares.moneda.simbolo} {product.precios_por_moneda.dolares.precio_venta.toFixed(2)}
                    </span>
                    {product.precios_por_moneda.dolares.precio_referencia && product.precios_por_moneda.dolares.precio_referencia > product.precios_por_moneda.dolares.precio_venta && (
                      <span className="text-xs text-gray-500 line-through">
                        {product.precios_por_moneda.dolares.moneda.simbolo} {product.precios_por_moneda.dolares.precio_referencia.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Fallback al precio principal si no hay precios por moneda */}
                {!product.precios_por_moneda?.soles && !product.precios_por_moneda?.dolares && (
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-primary">
                      Consultar precio
                    </span>
                  </div>
                )}
              </div>
              
              {/* Discount Badge */}
              {product.precios_por_moneda?.soles?.precio_referencia && product.precios_por_moneda.soles.precio_referencia > product.precios_por_moneda.soles.precio_venta && (
                <Badge variant="destructive" className="text-xs">
                  -{Math.round(((product.precios_por_moneda.soles.precio_referencia - product.precios_por_moneda.soles.precio_venta) / product.precios_por_moneda.soles.precio_referencia) * 100)}%
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                En stock
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              <Button 
                variant="outline"
                className="flex-1 w-full text-primary border-primary hover:bg-primary hover:text-white transition-all duration-200"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.location.href = productUrl
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary/90 text-white transition-all duration-200 hover:shadow-md"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar al carrito
              </Button>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  )
}