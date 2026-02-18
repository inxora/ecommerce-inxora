'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Truck } from 'lucide-react'
import { formatPriceWithThousands } from '@/lib/utils'
import { useCart } from '@/lib/hooks/use-cart'
import { useCurrency } from '@/lib/hooks/use-currency'

export function OrderSummary() {
  const pathname = usePathname()
  const locale = (pathname?.split('/')?.[1] || 'es')
  const { items, getTotalPrice } = useCart()
  const { currencySymbol } = useCurrency()

  const subtotal = getTotalPrice()
  const shipping = 0 // Envío gratis
  const total = subtotal + shipping

  const formatPrice = (price: number) => `${currencySymbol} ${formatPriceWithThousands(price)}`

  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Resumen del pedido</h3>
      
      <div className="space-y-3">
        {items.map((item) => {
          const precio = (item.product as { precio_venta?: number }).precio_venta ?? 0
          return (
            <div key={`${item.product.sku}-${item.selectedSize || 'no-size'}`} className="flex justify-between">
              <div className="flex-1">
                <p className="font-medium">{item.product.nombre}</p>
                {item.selectedSize && (
                  <p className="text-sm text-gray-500">Talla: {item.selectedSize}</p>
                )}
                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
              </div>
              <p className="font-medium">
                {precio > 0 ? formatPrice(precio * item.quantity) : 'Consultar precio'}
              </p>
            </div>
          )
        })}
      </div>

      <div className="border-t border-gray-200 dark:border-slate-600 pt-4 mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t border-gray-200 dark:border-slate-600 pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
        <Link
          href={`/${locale}/envios`}
          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          <Truck className="h-4 w-4" />
          Consulta costos y plazos de envío
        </Link>
      </div>
    </div>
  )
}