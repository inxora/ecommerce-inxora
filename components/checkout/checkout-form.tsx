'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { User, MapPin, CreditCard, Truck, Mail, Phone, ShoppingBag, FileText, CheckCircle, AlertCircle, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useCart } from '@/lib/hooks/use-cart'
import { useToast } from '@/lib/hooks/use-toast'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import Link from 'next/link'

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
  
  // Método de pago (solo transferencia bancaria y Yape)
  paymentMethod: z.enum(['transfer', 'yape']),
  
  // Información adicional
  notes: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Debe aceptar los términos'),
  newsletter: z.boolean().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
  const pathname = usePathname()
  const locale = (pathname?.split('/')?.[1] || 'es')
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const { items, clearCart, getTotalPrice } = useCart()
  const { isLoggedIn, cliente } = useClienteAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      paymentMethod: 'transfer',
      acceptTerms: false,
      newsletter: false,
      country: 'Perú',
    },
  })

  // Prellenar Información personal con los datos del cliente logueado
  useEffect(() => {
    if (!isLoggedIn || !cliente) return
    if (cliente.nombre) form.setValue('firstName', cliente.nombre)
    if (cliente.apellidos) form.setValue('lastName', cliente.apellidos)
    if (cliente.correo) form.setValue('email', cliente.correo)
  }, [isLoggedIn, cliente, form])

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
              <a href={`/${locale}/catalogo`}>Explorar Productos</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Aviso: iniciar sesión o registrarse cuando no está logueado */}
      {!isLoggedIn && (
        <Card className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-10 w-10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Para continuar con tu compra debes iniciar sesión o registrarte
                </h3>
                <p className="text-amber-800 dark:text-amber-200 mb-4">
                  Inicia sesión si ya tienes cuenta o crea una nueva para finalizar tu pedido.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" asChild variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-100 dark:border-amber-500 dark:text-amber-300 dark:hover:bg-amber-900/50">
                    <Link href={`/${locale}/login?redirect=checkout`}>Iniciar sesión</Link>
                  </Button>
                  <Button type="button" asChild className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Link href={`/${locale}/registro?redirect=checkout`}>Registrarse</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información Personal y Dirección: solo cuando está logueado */}
      {isLoggedIn && (
        <>
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
        </>
      )}

      {/* Método de Pago: solo Transferencia bancaria y Yape */}
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
            onValueChange={(value) => form.setValue('paymentMethod', value as 'transfer' | 'yape')}
            className="space-y-3"
          >
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
              <RadioGroupItem value="yape" id="yape" />
              <Label htmlFor="yape" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                    <QrCode className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{t('checkout.payment.yape')}</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('checkout.payment.yapeDescription')}</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {/* Datos de transferencia BCP - visible solo cuando está seleccionado */}
          {form.watch('paymentMethod') === 'transfer' && (
            <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
              <p className="font-medium text-gray-900 dark:text-white mb-4">BCP – Transferencia bancaria</p>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200 mb-1">Soles (PEN)</p>
                  <p className="text-gray-700 dark:text-gray-300">Cta Cte 192-7293189-0-73</p>
                  <p className="text-gray-600 dark:text-gray-400">CCI: 002-192-007293189073-34</p>
                </div>
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200 mb-1">Dólares (USD)</p>
                  <p className="text-gray-700 dark:text-gray-300">Cta Cte 1917331690183</p>
                  <p className="text-gray-600 dark:text-gray-400">CCI: 00219100733169018351</p>
                </div>
              </div>
            </div>
          )}

          {/* QR de Yape - visible solo cuando está seleccionado */}
          {form.watch('paymentMethod') === 'yape' && (
            <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
              <p className="text-center font-medium text-gray-900 dark:text-white mb-4">
                {t('checkout.payment.yapeInstructions')}
              </p>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-48 h-48 bg-white rounded-xl p-3 shadow-lg">
                  <Image
                    src="/qr_inxora.jpeg"
                    alt="QR Yape - Inxora"
                    fill
                    className="object-contain rounded-lg"
                    sizes="192px"
                  />
                </div>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  {t('checkout.payment.yapeScan')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notas Adicionales y Términos: solo cuando está logueado */}
      {isLoggedIn && (
        <>
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
        </>
      )}

      {/* Botón de Envío: deshabilitado si no está logueado */}
      <Button
        type="submit"
        disabled={isSubmitting || !isLoggedIn}
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