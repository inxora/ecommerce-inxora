'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/lib/supabase'
import { useCart } from '@/hooks/use-cart'
import { useToast } from '@/hooks/use-toast'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    console.log('ProductInfo - Adding to cart:', product, 'quantity:', quantity)
    addItem(product, quantity)
    
    // Mostrar notificación de éxito
    toast({
      title: "¡Producto agregado!",
      description: `${product.nombre} se agregó al carrito`,
      variant: "success",
    })
  }

  // Producto no incluye tallas actualmente; se omite selección de talla

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nombre}</h1>
        <div className="space-y-2">
          {/* Precio en soles */}
          {product.precios_por_moneda?.soles && (
            <p className="text-xl font-semibold text-primary">
              {product.precios_por_moneda.soles.moneda.simbolo} {product.precios_por_moneda.soles.precio_venta.toFixed(2)}
            </p>
          )}
          
          {/* Precio en dólares */}
          {product.precios_por_moneda?.dolares && (
            <p className="text-lg font-semibold text-blue-600">
              {product.precios_por_moneda.dolares.moneda.simbolo} {product.precios_por_moneda.dolares.precio_venta.toFixed(2)}
            </p>
          )}
          
          {/* Fallback si no hay precios */}
          {!product.precios_por_moneda?.soles && !product.precios_por_moneda?.dolares && (
            <p className="text-xl font-semibold text-primary">Consultar precio</p>
          )}
        </div>
      </div>

      {product.descripcion_corta && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Descripción</h3>
          <p className="text-gray-600">{product.descripcion_corta}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <span className="text-sm text-gray-500">Categoría: </span>
            <Badge variant="secondary">{product.categoria.nombre}</Badge>
          </div>
        )}
        
        {product.marca && (
          <div>
            <span className="text-sm text-gray-500">Marca: </span>
            <Badge variant="outline">{product.marca.nombre}</Badge>
          </div>
        )}
      </div>
    </div>
  )
}