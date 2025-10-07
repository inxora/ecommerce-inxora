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
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    console.log('ProductInfo - Adding to cart:', product, 'quantity:', quantity, 'size:', selectedSize)
    addItem(product, quantity, selectedSize)
    
    // Mostrar notificación de éxito
    toast({
      title: "¡Producto agregado!",
      description: `${product.nombre} se agregó al carrito`,
      variant: "success",
    })
  }

  const sizes = product.tallas ? product.tallas.split(',').map(s => s.trim()) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nombre}</h1>
        <p className="text-xl font-semibold text-primary">{formatPrice(product.precio_venta)}</p>
      </div>

      {product.descripcion_corta && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Descripción</h3>
          <p className="text-gray-600">{product.descripcion_corta}</p>
        </div>
      )}

      <div className="space-y-4">
        {sizes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Talla
            </label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una talla" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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