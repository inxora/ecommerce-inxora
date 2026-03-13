'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Truck, AlertCircle, Package, ChevronRight, Tag, ShieldCheck, Receipt } from 'lucide-react'
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
    (product.imagen_principal_url as string | undefined) ??
    ((product.galeria_imagenes_urls as string[] | undefined)?.[0]) ??
    (product.imagen_url as string | undefined) ??
    (product.imagen as string | undefined) ??
    (product.foto as string | undefined) ??
    (product.image_url as string | undefined) ??
    (product.thumbnail as string | undefined) ??
    ((product.imagenes as string[] | undefined)?.[0]) ??
    null

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">

      {/* Top accent gradient */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
            <Receipt className="w-4 h-4 text-orange-500" />
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Resumen del pedido
          </span>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
          {itemCount} {itemCount === 1 ? 'ítem' : 'ítems'}
        </span>
      </div>

      {/* ── Total hero — visible de inmediato, sin scroll ───────────────────
          Mostramos el total grande arriba para que el usuario sepa cuánto
          pagará antes de ver los productos (como en la imagen de referencia).
      ── */}
      <div className="px-6 py-5 bg-gradient-to-br from-orange-500 to-amber-500">
        <p className="text-xs font-semibold text-orange-100 uppercase tracking-widest mb-1">
          Total a pagar
        </p>
        <p className="text-3xl font-bold text-white tracking-tight">
          {formatPrice(total)}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex flex-col text-orange-100 text-xs">
            <span className="opacity-75">Subtotal</span>
            <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="flex flex-col text-orange-100 text-xs">
            <span className="opacity-75">Envío</span>
            <span className="font-semibold text-white">
              {shippingCost === 0
                ? (shipping.envioLabel === 'Recojo en tienda' ? 'Gratis' : shipping.envioLabel || '—')
                : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-orange-100 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pago seguro</span>
          </div>
        </div>
      </div>

      {/* ── Product list ────────────────────────────────────────────────────── */}
      <div className="px-6 py-5 space-y-4 max-h-[420px] overflow-y-auto">
        {items.map((item) => {
          const product = item.product as Product & Record<string, unknown>
          const precio = (product as { precio_venta?: number }).precio_venta ?? 0
          const conditionText = getCondicionPrecioVenta(product)
          const issues = validateCartItem(product, item.quantity)
          const imageUrl = getImageUrl(product)

          return (
            <div
              key={`${item.product.sku}-${item.selectedSize || 'no-size'}`}
              className="flex gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.product.nombre}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
                {/* Quantity badge */}
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {item.quantity}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
                  {item.product.nombre}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {item.selectedSize && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      <Tag className="w-2.5 h-2.5" />
                      {item.selectedSize}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    SKU: {item.product.sku}
                  </span>
                </div>
                {conditionText && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">{conditionText}</p>
                )}
                {issues.map((issue) => (
                  <p key={issue.code} className="mt-1 flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400">
                    <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    {issue.message}
                  </p>
                ))}
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {precio > 0 ? formatPrice(precio * item.quantity) : '—'}
                </p>
                {precio > 0 && item.quantity > 1 && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {formatPrice(precio)} c/u
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Desglose de totales ──────────────────────────────────────────────── */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">Subtotal</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Envío
          </span>
          <span className={[
            'text-sm font-semibold',
            shippingCost === 0 && shipping.envioLabel === 'Recojo en tienda'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-800 dark:text-slate-200',
          ].join(' ')}>
            {shippingCost === 0
              ? (shipping.envioLabel === 'Recojo en tienda' ? 'Gratis' : (shipping.envioLabel || 'Seleccione provincia'))
              : formatPrice(shippingCost)}
          </span>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Total</span>
          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{formatPrice(total)}</span>
        </div>
      </div>

      {/* ── Footer link ─────────────────────────────────────────────────────── */}
      <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800">
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