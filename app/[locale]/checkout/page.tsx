import { Suspense } from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { CheckoutShippingProvider } from '@/lib/contexts/checkout-shipping-context'
import { Skeleton } from '@/components/ui/skeleton'
import { Shield, Lock, BadgeCheck, Zap } from 'lucide-react'

interface CheckoutPageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'checkout' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'checkout' })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Top security bar ─────────────────────────────────────────────── */}
      <div className="w-full bg-slate-900 dark:bg-black border-b border-slate-800">
        <div className="w-full px-4 h-9 flex items-center justify-center gap-6">
          {[
            { icon: Lock,       label: t('trustBar.ssl') },
            { icon: Shield,     label: t('trustBar.protected') },
            { icon: BadgeCheck, label: t('trustBar.encrypted') },
            { icon: Zap,        label: t('trustBar.instant') },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-slate-400">
              <Icon className="w-3 h-3 text-orange-400" />
              <span className="text-[11px] font-medium hidden sm:inline tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ancho amplio: usa casi todo el viewport (márgenes solo por padding lateral) */}
      <div className="w-full max-w-[min(100%,1920px)] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 lg:py-8">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('pageSubtitle')}
          </p>
        </div>

        <CheckoutShippingProvider>
          {/*
            Layout: formulario (izquierda, 3/5) + resumen sticky (derecha, 2/5)
            En mobile: resumen primero (order-1) para que el usuario vea qué compra
          */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)] gap-6 lg:gap-8 xl:gap-10 items-start">

            {/* LEFT — Checkout form con stepper */}
            <div className="order-2 lg:order-1 min-w-0">
              <Suspense fallback={<FormSkeleton />}>
                <CheckoutForm />
              </Suspense>
            </div>

            {/* RIGHT — Order summary sticky */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-6">
              <Suspense fallback={<SummarySkeleton />}>
                <OrderSummary />
              </Suspense>
            </div>

          </div>
        </CheckoutShippingProvider>
      </div>
    </div>
  )
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function SummarySkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
      <div className="h-1 bg-slate-200 dark:bg-slate-700" />
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-7 w-full mt-2" />
        </div>
      </div>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full rounded-xl mb-2" />
      {[1, 2].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6">
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
        </div>
      ))}
    </div>
  )
}
