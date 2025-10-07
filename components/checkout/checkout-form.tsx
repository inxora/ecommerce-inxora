'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, MapPin, CreditCard, Truck, Mail, Phone, ShoppingBag, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useCart } from '@/hooks/use-cart'
import { useToast } from '@/hooks/use-toast'

const checkoutSchema = z.object({
  // Información personal
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono requerido'),
  
  // Dirección de envío
  address: z.string().min(5, 'Dirección requerida'),
  city: z.string().min(2, 'Ciudad requerida'),
  state: z.string().min(2, 'Estado/Provincia requerido'),
  zipCode: z.string().min(4, 'Código postal requerido'),
  country: z.string().min(2, 'País requerido'),
  
  // Método de pago
  paymentMethod: z.enum(['card', 'transfer', 'cash']),
  
  // Información adicional
  notes: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Debe aceptar los términos'),
  newsletter: z.boolean().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const { items, clearCart, getTotalPrice } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'card',
      acceptTerms: false,
      newsletter: false,
      country: 'Colombia',
    },
  })

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular procesamiento del pedido
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Crear objeto del pedido
      const order = {
        id: `ORD-${Date.now()}`,
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        },
        shipping: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        items: items,
        total: getTotalPrice(),
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        status: 'pending',
      }

      // Guardar pedido en localStorage (en producción sería una API)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push(order)
      localStorage.setItem('orders', JSON.stringify(orders))

      // Limpiar carrito
      clearCart()

      // Mostrar mensaje de éxito
      toast({
        title: t('checkout.success.title'),
        description: t('checkout.success.description', { orderId: order.id }),
      })

      // Redirigir a página de confirmación
      router.push(`/pedido/${order.id}`)
      
    } catch (error) {
      toast({
        title: t('checkout.error.title'),
        description: t('checkout.error.description'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-white" />
            <h3 className="text-2xl font-bold text-white">Carrito vacío</h3>
          </div>
        </div>
        <div className="p-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed max-w-md mx-auto">
              Agrega algunos productos antes de proceder al checkout.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <a href="/catalogo">Explorar Productos</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Información Personal */}
      <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-medium">Nombre</Label>
              <Input
                id="firstName"
                className="border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                {...form.register('firstName')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-medium">Apellido</Label>
              <Input
                id="lastName"
                className="border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                {...form.register('lastName')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                className="pl-10 border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                {...form.register('email')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium">Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                className="pl-10 border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                {...form.register('phone')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dirección de Envío */}
      <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            Dirección de Envío
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700 dark:text-gray-300 font-medium">Dirección</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Textarea
                id="address"
                className="pl-10 border-gray-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 rounded-lg"
                {...form.register('address')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-700 dark:text-gray-300 font-medium">Ciudad</Label>
              <Input
                id="city"
                className="border-gray-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 rounded-lg"
                {...form.register('city')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-gray-700 dark:text-gray-300 font-medium">Estado/Provincia</Label>
              <Input
                id="state"
                className="border-gray-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 rounded-lg"
                {...form.register('state')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-gray-700 dark:text-gray-300 font-medium">Código Postal</Label>
              <Input
                id="zipCode"
                className="border-gray-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 rounded-lg"
                {...form.register('zipCode')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-gray-700 dark:text-gray-300 font-medium">País</Label>
              <Input
                id="country"
                className="border-gray-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400 rounded-lg"
                {...form.register('country')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Método de Pago */}
      <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            Método de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <RadioGroup
            value={form.watch('paymentMethod')}
            onValueChange={(value) => form.setValue('paymentMethod', value as 'card' | 'transfer' | 'cash')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Tarjeta de Crédito/Débito</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pago seguro con tarjeta</p>
                  </div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
              <RadioGroupItem value="transfer" id="transfer" />
              <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Transferencia Bancaria</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pago por transferencia</p>
                  </div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Pago Contra Entrega</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Paga cuando recibas el producto</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Notas Adicionales */}
      <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            Notas Adicionales
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            placeholder="Instrucciones especiales para la entrega..."
            className="border-gray-200 dark:border-slate-600 focus:border-gray-500 dark:focus:border-gray-400 rounded-lg"
            {...form.register('notes')}
          />
        </CardContent>
      </Card>

      {/* Términos y Condiciones */}
      <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="acceptTerms"
              checked={form.watch('acceptTerms')}
              onCheckedChange={(checked) => form.setValue('acceptTerms', checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer">
              Acepto los <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">términos y condiciones</a> y la <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">política de privacidad</a>
            </Label>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="newsletter"
              checked={form.watch('newsletter')}
              onCheckedChange={(checked) => form.setValue('newsletter', checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="newsletter" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer">
              Quiero recibir ofertas y novedades por correo electrónico
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Botón de Envío */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Procesando...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Realizar Pedido</span>
          </div>
        )}
      </Button>
    </form>
  )
}