'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/hooks/use-cart'
import { useCurrency } from '@/lib/hooks/use-currency'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { formatPrice as formatCurrency } from '@/lib/utils'

interface CartDrawerProps {
  children?: React.ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getItemsCount } = useCart()
  const { currencySymbol } = useCurrency()
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as string) || 'es'
  const [isOpen, setIsOpen] = useState(false)

  const total = getTotalPrice()
  const itemsCount = getItemsCount()

  const formatPrice = (price: number) => {
    return `${currencySymbol} ${formatCurrency(price)}`
  }

  const handleCheckout = () => {
    setIsOpen(false)
    router.push(`/${locale}/checkout`)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-inxora-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col z-[1000000]" overlayClassName="z-[1000000]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Compras
            {itemsCount > 0 && (
              <span className="text-sm text-muted-foreground">
                ({itemsCount} {itemsCount === 1 ? 'producto' : 'productos'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <Separator className="my-4" />

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Agrega productos para comenzar tu compra
            </p>
            <Button
              onClick={() => {
                setIsOpen(false)
                router.push(`/${locale}/catalogo`)
              }}
              className="bg-inxora-blue hover:bg-inxora-blue/90"
            >
              Ir al Catálogo
            </Button>
          </div>
        ) : (
          <>
            {/* Lista de productos - cada item es { product, quantity } */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {items.map((item) => {
                const p = item.product
                const precio = p.precio_venta ?? 0
                const skuDisplay = (p as { sku_producto?: string }).sku_producto || String(p.sku)
                return (
                  <div key={`${p.sku}-${item.selectedSize ?? ''}`} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-md overflow-hidden">
                      {p.imagen_principal_url ? (
                        <Image
                          src={p.imagen_principal_url}
                          alt={p.nombre}
                          title={p.nombre}
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{p.nombre}</h4>
                      <p className="text-xs text-muted-foreground mb-2">SKU: {skuDisplay}</p>
                      <p className="font-semibold text-inxora-blue">{formatPrice(precio)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(p.sku, item.quantity - 1, item.selectedSize)
                              }
                            }}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(p.sku, item.quantity + 1, item.selectedSize)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => removeItem(p.sku, item.selectedSize)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Separator className="my-4" />

            {/* Footer con total y botones */}
            <SheetFooter className="flex-col space-y-4">
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-inxora-blue">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vaciar
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-inxora-blue hover:bg-inxora-blue/90"
                >
                  Finalizar Compra
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
