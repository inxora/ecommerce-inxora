'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/lib/supabase'
import { useCart } from '@/hooks/use-cart'
import { useToast } from '@/hooks/use-toast'
import { useCurrency } from '@/hooks/use-currency'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()
  const { currency } = useCurrency()

  const handleAddToCart = () => {
    console.log('ProductInfo - Adding to cart:', product, 'quantity:', quantity)
    
    // Obtener el precio directamente de producto_precio_moneda
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
    
    console.log('Product prepared for cart (precio from producto_precio_moneda):', productToAdd)
    addItem(productToAdd, quantity)
  }

  // Producto no incluye tallas actualmente; se omite selección de talla

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.nombre}</h1>
        <div className="space-y-2">
          {/* Precio según moneda seleccionada */}
          {currency === 'PEN' && product.precios_por_moneda?.soles && (
            <p className="text-xl font-semibold text-primary dark:text-blue-400">
              {product.precios_por_moneda.soles.moneda.simbolo} {product.precios_por_moneda.soles.precio_venta.toFixed(2)}
            </p>
          )}
          
          {currency === 'USD' && product.precios_por_moneda?.dolares && (
            <p className="text-xl font-semibold text-primary dark:text-blue-400">
              {product.precios_por_moneda.dolares.moneda.simbolo} {product.precios_por_moneda.dolares.precio_venta.toFixed(2)}
            </p>
          )}
          
          {/* Fallback si no hay precio en la moneda seleccionada */}
          {((currency === 'PEN' && !product.precios_por_moneda?.soles) || 
            (currency === 'USD' && !product.precios_por_moneda?.dolares)) && (
            <p className="text-xl font-semibold text-primary dark:text-blue-400">Consultar precio</p>
          )}
        </div>
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
        <Button 
          onClick={handleAddToCart}
          className="w-full"
          size="lg"
        >
          Agregar al carrito
        </Button>
        
        {product.categoria && (
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Categoría: </span>
            <Badge variant="secondary">{typeof product.categoria === 'string' ? product.categoria : product.categoria.nombre}</Badge>
          </div>
        )}
        
        {product.marca && (
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Marca: </span>
            <Badge variant="outline">{typeof product.marca === 'string' ? product.marca : product.marca.nombre}</Badge>
          </div>
        )}
        
        {product.disponibilidad && (
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Disponibilidad: </span>
            <Badge variant="secondary">{product.disponibilidad.descripcion || product.disponibilidad.nombre}</Badge>
          </div>
        )}
      </div>
    </div>
  )
}