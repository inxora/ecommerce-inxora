import { Suspense } from 'react'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { CheckoutShippingProvider } from '@/lib/contexts/checkout-shipping-context'
import { Skeleton } from '@/components/ui/skeleton'
import { Shield, Lock, BadgeCheck } from 'lucide-react'

export const metadata = {
  title: 'Checkout | Finalizar compra',
  description: 'Completa tu información para finalizar la compra de forma segura.',
}

export default async function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-full px-4 sm:px-6 py-6 lg:py-8">

        {/* ── Page header: compact, inline ────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Finalizar compra
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Completa los datos para confirmar tu pedido
            </p>
          </div>

          {/* Trust badges — inline strip */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {[
              { icon: Lock, label: 'Pago seguro' },
              { icon: Shield, label: 'Compra protegida' },
              { icon: BadgeCheck, label: 'Datos encriptados' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Icon className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-medium hidden sm:inline">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main grid: 5/8 form + 3/8 summary ──────────────────────────── */}
        <CheckoutShippingProvider>
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 items-start">

            {/* Form column — narrow */}
            <div className="min-w-0">
              <Suspense fallback={<CheckoutFormSkeleton />}>
                <CheckoutForm />
              </Suspense>
            </div>

            {/* Summary column — wider, sticky */}
            <div className="lg:sticky lg:top-6">
              <Suspense fallback={<CheckoutSummarySkeleton />}>
                <OrderSummary />
              </Suspense>
            </div>

          </div>
        </CheckoutShippingProvider>
      </div>
    </div>
  )
}

// ── Skeletons ──────────────────────────────────────────────────────────────

function CheckoutFormSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={`checkout-skeleton-${i}`}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl mt-4" />
          {i === 2 && <Skeleton className="h-10 w-full rounded-xl mt-4" />}
        </div>
      ))}
    </div>
  )
}

function CheckoutSummarySkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden">
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-t-2xl" />
      <div className="p-5 space-y-4">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-4 w-14 flex-shrink-0" />
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-5 w-full mt-1" />
        </div>
      </div>
    </div>
  )
}