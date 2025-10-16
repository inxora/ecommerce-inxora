'use client'

import { useState, ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'

interface CartDrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}

export function CartDrawer({ open, onOpenChange, children }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getItemsCount, clearCart } = useCart()
  const totalItems = getItemsCount()
  const total = getTotalPrice()
  const isEmpty = items.length === 0
  const pathname = usePathname()
  const locale = (pathname?.split('/')?.[1] || 'es')

  // Si no se pasan props, usar como trigger independiente
  if (open === undefined && onOpenChange === undefined) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          {children ? (
            children
          ) : (
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          )}
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <CartContent />
        </SheetContent>
      </Sheet>
    )
  }

  // Usar como drawer controlado
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <CartContent />
      </SheetContent>
    </Sheet>
  )

  function CartContent() {
    return (
      <>
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>Carrito</span>
            {totalItems > 0 && (
              <Badge variant="secondary">{totalItems}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Tu carrito está vacío</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Agrega productos para comenzar tu compra
                </p>
              </div>
              <Button asChild>
                <Link href={`/${locale}/catalogo`}>Explorar productos</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.product.sku} className="flex space-x-3 p-3 border rounded-lg">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.product.imagen_principal_url || '/placeholder-product.svg'}
                        alt={item.product.nombre}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2">
                        {item.product.nombre}
                      </h4>
                      <p className="text-sm font-semibold text-inxora-blue mt-1">
                        {item.product.precios_por_moneda?.soles 
                          ? `${item.product.precios_por_moneda.soles.moneda.simbolo} ${item.product.precios_por_moneda.soles.precio_venta.toFixed(2)}`
                          : 'Consultar precio'
                        }
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.product.sku, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.product.sku, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item.product.sku)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t pt-4 space-y-4">
                {/* Clear Cart */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive"
                  >
                    Vaciar carrito
                  </Button>
                </div>

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-inxora-blue">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href={`/${locale}/carrito`}>Ver carrito</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/${locale}/checkout`}>Finalizar compra</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    )
  }
}