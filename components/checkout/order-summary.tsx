'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Truck, AlertTriangle, Package, ChevronRight, Tag } from 'lucide-react'
import { getCondicionPrecioVenta, validateCartItem } from '@/lib/cart-restrictions'
import { formatPriceWithThousands } from '@/lib/utils'
import { useCart } from '@/lib/hooks/use-cart'
import { useCurrency } from '@/lib/hooks/use-currency'
import { useCheckoutShipping } from '@/lib/contexts/checkout-shipping-context'
import { Product } from '@/lib/supabase'

export function OrderSummary() {
  const pathname = usePathname()
  const locale = (pathname?.split('/')?.[1] || 'es')
  const { items, getTotalPrice } = useCart()
  const { currencySymbol } = useCurrency()
  const { shipping } = useCheckoutShipping()

  const subtotal = getTotalPrice()
  const shippingCost = shipping.costoEnvio ?? 0
  const total = subtotal + shippingCost
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)

  const formatPrice = (price: number) => `${currencySymbol} ${formatPriceWithThousands(price)}`

  const getImageUrl = (product: Product & Record<string, unknown>): string | null =>
    (product.imagen_url as string | undefined) ??
    (product.imagen as string | undefined) ??
    (product.foto as string | undefined) ??
    (product.image_url as string | undefined) ??
    (product.thumbnail as string | undefined) ??
    ((product.imagenes as string[] | undefined)?.[0]) ??
    null

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">

      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />

      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
            <Package className="w-4 h-4 text-orange-500" />
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Resumen del pedido
          </span>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
          {itemCount} {itemCount === 1 ? 'ítem' : 'ítems'}
        </span>
      </div>

      {/* Items */}
      <div className="px-6 py-5 space-y-5 max-h-[460px] overflow-y-auto">
        {items.map((item) => {
          const product = item.product as Product & Record<string, unknown>
          const precio = (product as { precio_venta?: number }).precio_venta ?? 0
          const conditionText = getCondicionPrecioVenta(product)
          const issues = validateCartItem(product, item.quantity)
          const imageUrl = getImageUrl(product)

          return (
            <div
              key={`${item.product.sku}-${item.selectedSize || 'no-size'}`}
              className="flex gap-4 pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
            >
              {/* Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.product.nombre}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
                  {item.product.nombre}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  {item.selectedSize && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Tag className="w-3 h-3" />
                      {item.selectedSize}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    Cant:
                    <span className="font-semibold text-slate-700 dark:text-slate-300 ml-0.5">
                      {item.quantity}
                    </span>
                  </span>
                </div>

                {conditionText && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">{conditionText}</p>
                )}
                {issues.map((issue) => (
                  <p key={issue.code} className="mt-1 flex items-start gap-1 text-xs text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    {issue.message}
                  </p>
                ))}
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right flex flex-col justify-between py-0.5">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {precio > 0 ? formatPrice(precio * item.quantity) : '—'}
                </p>
                {precio > 0 && item.quantity > 1 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {formatPrice(precio)} c/u
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Totals */}
      <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-3">

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">Subtotal</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> Envío
          </span>
          <span className={[
            'text-sm font-semibold',
            shippingCost === 0 && shipping.envioLabel === 'Recojo en tienda'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-800 dark:text-slate-200',
          ].join(' ')}>
            {shippingCost === 0
              ? (shipping.envioLabel || 'Seleccione provincia')
              : formatPrice(shippingCost)}
          </span>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-center">
          <span className="text-base font-bold text-slate-900 dark:text-slate-100">Total</span>
          <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
        <Link
          href={`/${locale}/envios`}
          className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors group"
        >
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Consulta costos y plazos de envío
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </div>
  )
}