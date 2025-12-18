'use client'

import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/hooks/use-cart'

export function OrderSummary() {
  const { items, getTotalPrice } = useCart()

  const subtotal = getTotalPrice()
  const shipping = 0 // Envío gratis
  const total = subtotal + shipping

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Resumen del pedido</h3>
      
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.selectedSize || 'no-size'}`} className="flex justify-between">
            <div className="flex-1">
              <p className="font-medium">{item.product.nombre}</p>
              {item.selectedSize && (
                <p className="text-sm text-gray-500">Talla: {item.selectedSize}</p>
              )}
              <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
            </div>
            <p className="font-medium">
              {item.product.precios_por_moneda?.soles 
                ? `${item.product.precios_por_moneda.soles.moneda.simbolo} ${(item.product.precios_por_moneda.soles.precio_venta * item.quantity).toFixed(2)}`
                : 'Consultar precio'
              }
            </p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}