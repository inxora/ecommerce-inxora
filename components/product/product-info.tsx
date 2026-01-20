'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/lib/supabase'
import { useCart } from '@/lib/hooks/use-cart'
import { useToast } from '@/lib/hooks/use-toast'
import { useCurrency } from '@/lib/hooks/use-currency'
import { Shield, Truck, Star, Heart } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useFavorites } from '@/lib/hooks/use-favorites'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()
  const { currency } = useCurrency()
  const { toggleFavorite, isFavorite } = useFavorites()
  const params = useParams() as { locale?: string }
  const locale = typeof params?.locale === 'string' ? params.locale : 'es'
  
  const isFavorited = isFavorite(product.sku)

  const handleAddToCart = () => {
    console.log('ProductInfo - Adding to cart:', product, 'quantity:', quantity)
    
    // Obtener el precio del producto
    let precioPrincipal = 0
    
    if (product.precios && product.precios.length > 0) {
      // Filtrar precios activos y vigentes
      const hoy = new Date().toISOString().split('T')[0]
      const preciosVigentes = product.precios.filter(precio => {
        if (!precio.activo) return false
        
        const fechaDesde = precio.fecha_vigencia_desde
        const fechaHasta = precio.fecha_vigencia_hasta
        
        if (fechaDesde && fechaDesde > hoy) return false
        if (fechaHasta && fechaHasta < hoy) return false
        
        return true
      })
      
      // Buscar precio en soles primero, luego dólares
      const precioSoles = preciosVigentes.find(p => 
        p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'PEN'
      )
      const precioDolares = preciosVigentes.find(p => 
        p.moneda && typeof p.moneda === 'object' && 'codigo' in p.moneda && p.moneda.codigo === 'USD'
      )
      
      // Priorizar soles, luego dólares, luego el primero disponible
      const precioSeleccionado = precioSoles || precioDolares || preciosVigentes[0]
      precioPrincipal = precioSeleccionado?.precio_venta || 0
    } else {
      // Fallback a precios_por_moneda si no hay precios directos
      precioPrincipal = product.precios_por_moneda?.soles?.precio_venta || 
                       product.precios_por_moneda?.dolares?.precio_venta || 
                       product.precio_venta || 
                       0
    }
    
    const productToAdd = {
      ...product,
      precio_venta: precioPrincipal
    }
    
    console.log('Product prepared for cart:', productToAdd)
    addItem(productToAdd, quantity)
  }

  // Producto no incluye tallas actualmente; se omite selección de talla

  return (
    <div className="space-y-6">
      {/* Marca arriba del título - esquina superior izquierda */}
      <div className="flex items-start justify-between">
        <div>
          {product.marca && (
            <Badge variant="outline" className="text-xs sm:text-sm">
              {typeof product.marca === 'string' ? product.marca : product.marca.nombre}
            </Badge>
          )}
        </div>
        {/* SKU y código de marca - esquina superior derecha */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {product.sku_producto && (
            <span className="font-mono">SKU: {product.sku_producto}</span>
          )}
          {product.cod_producto_marca && 
           product.cod_producto_marca.trim() !== '' && (
            <span className="font-mono">| {product.cod_producto_marca}</span>
          )}
        </div>
      </div>
      
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-inxora-dark-blue dark:text-white mb-4">{product.nombre}</h1>
      </div>

      {product.descripcion_corta && (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Descripción</h3>
          <div 
            className="text-gray-600 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert
              prose-p:mb-3 prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-300
              prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
              prose-ul:my-4 prose-ul:space-y-2 prose-ul:pl-6
              prose-ol:my-4 prose-ol:space-y-2 prose-ol:pl-6
              prose-li:marker:text-blue-600 dark:prose-li:marker:text-blue-400
              prose-li:ml-4 prose-li:leading-relaxed
              prose-h2:text-lg prose-h2:font-bold prose-h2:mt-4 prose-h2:mb-3 prose-h2:text-gray-900 dark:prose-h2:text-white
              prose-h3:text-base prose-h3:font-semibold prose-h3:mt-3 prose-h3:mb-2 prose-h3:text-gray-800 dark:prose-h3:text-gray-200
              [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
              [&>p]:mb-3 [&>p]:leading-6
              [&>ul>li]:mb-2 [&>ol>li]:mb-2
              [&>h2]:mt-4 [&>h2]:mb-3
              [&>h3]:mt-3 [&>h3]:mb-2"
            dangerouslySetInnerHTML={{ __html: product.descripcion_corta }}
          />
        </div>
      )}

      {/* Precio debajo de la descripción */}
      <div className="pt-2">
        {currency === 'PEN' && product.precios_por_moneda?.soles && (
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-inxora-blue">
            {product.precios_por_moneda.soles.moneda.simbolo} {product.precios_por_moneda.soles.precio_venta.toFixed(2)}
          </p>
        )}
        
        {currency === 'USD' && product.precios_por_moneda?.dolares && (
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-inxora-blue">
            {product.precios_por_moneda.dolares.moneda.simbolo} {product.precios_por_moneda.dolares.precio_venta.toFixed(2)}
          </p>
        )}
        
        {/* Fallback si no hay precio en la moneda seleccionada */}
        {((currency === 'PEN' && !product.precios_por_moneda?.soles) || 
          (currency === 'USD' && !product.precios_por_moneda?.dolares)) && (
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-inxora-blue">Consultar precio</p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cantidad
          </label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="px-4 py-2 border rounded-md text-center min-w-[60px]">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Button 
            onClick={handleAddToCart}
            className="flex-1 bg-inxora-blue hover:bg-inxora-blue/90 text-white"
            size="lg"
          >
            Agregar al carrito
          </Button>
          <Button
            onClick={() => toggleFavorite(product)}
            variant={isFavorited ? "default" : "outline"}
            size="lg"
            className="px-4"
            aria-label={isFavorited ? "Eliminar de favoritos" : "Agregar a favoritos"}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        {(() => {
          // Usar primera categoría del array categorias, o categoria como fallback
          const categoria = product?.categorias && product.categorias.length > 0
            ? product.categorias[0]
            : product?.categoria
          
          return categoria ? (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Categoría: </span>
              <Badge variant="secondary">{typeof categoria === 'string' ? categoria : categoria.nombre}</Badge>
            </div>
          ) : null
        })()}
      </div>

      {/* Trust Badges - 3 Cards dentro del card de información */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-inxora-light-blue/10 dark:bg-slate-700 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-inxora-light-blue/20 dark:border-gray-600">
          <Shield className="h-8 w-8 text-inxora-blue mx-auto mb-2" />
          <p className="text-sm font-semibold text-inxora-dark-blue dark:text-white mb-1">Garantía</p>
          <Link 
            href={`/${locale}/terminos`}
            className="text-xs text-inxora-blue hover:text-inxora-dark-blue hover:underline"
          >
            Ver condiciones
          </Link>
        </div>
        <div className="bg-inxora-light-blue/10 dark:bg-slate-700 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-inxora-light-blue/20 dark:border-gray-600">
          <Truck className="h-8 w-8 text-inxora-light-blue mx-auto mb-2" />
          <p className="text-sm font-bold text-inxora-dark-blue dark:text-white mb-1">
            Envío Gratis
          </p>
          <Link 
            href={`/${locale}/envios`}
            className="text-xs text-inxora-blue hover:text-inxora-dark-blue hover:underline"
          >
            Ver condiciones
          </Link>
        </div>
        <div className="bg-inxora-light-blue/10 dark:bg-slate-700 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-inxora-light-blue/20 dark:border-gray-600">
          <Star className="h-8 w-8 text-inxora-fuchsia mx-auto mb-2" />
          <p className="text-sm font-semibold text-inxora-dark-blue dark:text-white mb-1">
            Descuentos especiales
          </p>
          <Link 
            href={`/${locale}/terminos`}
            className="text-xs text-inxora-blue hover:text-inxora-dark-blue hover:underline"
          >
            Ver condiciones
          </Link>
        </div>
      </div>
    </div>
  )
}