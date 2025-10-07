import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { CheckoutSkeleton } from '@/components/checkout/checkout-skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { ShoppingBag, CreditCard, Shield } from 'lucide-react'

export default async function CheckoutPage() {
  const t = await getTranslations()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  Checkout
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Completa tu información para finalizar la compra
                </p>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Pago Seguro</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-sm font-medium">Compra Protegida</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de checkout */}
          <div className="lg:col-span-2">
            <Suspense fallback={<CheckoutFormSkeleton />}>
              <CheckoutForm />
            </Suspense>
          </div>
          
          {/* Resumen del pedido */}
          <div>
            <Suspense fallback={<CheckoutSummarySkeleton />}>
              <OrderSummary />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutFormSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CheckoutSummarySkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl sticky top-8">
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-2xl">
        <Skeleton className="h-6 w-32 bg-white/20" />
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-slate-700">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}