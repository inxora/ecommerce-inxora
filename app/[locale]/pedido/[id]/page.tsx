import { Suspense } from 'react'
import { OrderContent } from './order-content'

interface OrderPageProps {
  params: Promise<{ id: string; locale: string }>
  searchParams?: Promise<{ numero?: string }>
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id, locale } = await params
  const sp = await searchParams
  const numeroFromQuery = sp?.numero ?? null
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <OrderContent orderId={id} locale={locale} numeroFromQuery={numeroFromQuery} />
    </Suspense>
  )
}
