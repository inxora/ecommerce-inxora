"use client"

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/button'
// duplicate import removed

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

// duplicate import removed
const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
import { useCart } from '../../hooks/use-cart'

export default function CartPage() {
  const t = useTranslations()
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getItemsCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">
              {t('cart.empty')}
            </h1>
            
            <p className="text-muted-foreground mb-6">
              {t('cart.emptyDescription')}
            </p>
            
            <Button asChild className="w-full">
              <Link href="/catalogo">
                {t('cart.continueShopping')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/catalogo">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('cart.continueShopping')}
          </Link>
        </Button>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('cart.title')}</h1>
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('cart.clear')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.sku}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 bg-white rounded-md overflow-hidden border flex-shrink-0">
                    {item.product.imagen_principal_url ? (
                      <Image
                        src={item.product.imagen_principal_url}
                        alt={item.product.nombre}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg mb-1 truncate">
                      {item.product.nombre}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">
                        {formatPrice(item.product.precio_venta)}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product.sku, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 min-w-[2rem] text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product.sku, item.quantity + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product.sku)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="mt-2 text-right">
                      <span className="text-sm text-muted-foreground">
                        {t('cart.subtotal')}: 
                      </span>
                      <span className="ml-2 font-semibold">
                        {formatPrice(item.product.precio_venta * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>{t('cart.orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{t('cart.items', { count: getItemsCount() })}</span>
                <span>{getItemsCount()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>{t('cart.subtotal')}</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>{t('cart.shipping')}</span>
                <span className="text-green-600">{t('cart.freeShipping')}</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              
              <Button asChild className="w-full" size="lg">
                <Link href="/es/checkout">
                  {t('cart.proceedToCheckout')}
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/catalogo">
                  {t('cart.continueShopping')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}