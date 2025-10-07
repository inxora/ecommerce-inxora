import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Package, Truck, CreditCard, MapPin, User, Mail, Phone, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'

interface OrderPageProps {
  params: {
    id: string
    locale: string
  }
}

// Función para obtener el pedido (simulada con localStorage)
function getOrder(id: string) {
  if (typeof window === 'undefined') return null
  
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  return orders.find((order: any) => order.id === id)
}

function OrderContent({ orderId }: { orderId: string }) {
  const t = useTranslations()
  
  // En un entorno real, esto sería una llamada a la API
  const order = getOrder(orderId)
  
  if (!order) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'card': return t('checkout.payment.card')
      case 'transfer': return t('checkout.payment.transfer')
      case 'cash': return t('checkout.payment.cash')
      default: return method
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header de confirmación */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          {t('order.confirmation.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('order.confirmation.description')}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {t('order.confirmation.orderId')}: <span className="font-mono font-medium">{order.id}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Información del pedido */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estado del pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('order.status.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={getStatusColor(order.status)}>
                    {t(`order.status.${order.status}`)}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('order.status.description')}
                  </p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-4 w-4" />
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Productos del pedido */}
          <Card>
            <CardHeader>
              <CardTitle>{t('order.items.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      {item.selectedSize && (
                        <p className="text-sm text-muted-foreground">
                          {t('product.size')}: {item.selectedSize}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price)}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('cart.quantity')}: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información del cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('order.customer.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer.firstName} {order.customer.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Dirección de envío */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {t('order.shipping.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p>{order.shipping.address}</p>
                  <p>{order.shipping.city}, {order.shipping.state}</p>
                  <p>{order.shipping.zipCode}, {order.shipping.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen del pedido */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>{t('order.summary.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Método de pago */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">{getPaymentMethodName(order.paymentMethod)}</span>
              </div>

              <Separator />

              {/* Desglose de costos */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('checkout.orderSummary.subtotal')}</span>
                  <span>{formatPrice(order.total * 0.84)}</span> {/* Aproximado sin impuestos */}
                </div>
                <div className="flex justify-between">
                  <span>{t('checkout.orderSummary.shipping')}</span>
                  <span>{formatPrice(15000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('checkout.orderSummary.tax')} (19%)</span>
                  <span>{formatPrice(order.total * 0.16)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>{t('checkout.orderSummary.total')}</span>
                <span className="text-inxora-blue">{formatPrice(order.total)}</span>
              </div>

              {/* Notas del pedido */}
              {order.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-sm mb-2">{t('order.notes')}</h4>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                </>
              )}

              {/* Acciones */}
              <div className="space-y-2 pt-4">
                <Button asChild className="w-full">
                  <Link href="/catalogo">
                    {t('order.actions.continueShopping')}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  {t('order.actions.downloadInvoice')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function OrderPage({ params }: OrderPageProps) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <OrderContent orderId={params.id} />
    </Suspense>
  )
}