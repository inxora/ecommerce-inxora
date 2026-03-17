'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  RefreshCw,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { miCuentaService, type PedidoListItem } from '@/lib/services/mi-cuenta.service'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function formatCurrency(amount: string | number | null | undefined, moneda?: string | null) {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0)
  const currency = moneda ?? 'PEN'
  try {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(num)
  } catch {
    return `${currency} ${num.toFixed(2)}`
  }
}

const ESTADO_STYLES: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  en_camino: 'bg-inxora-cyan/10 text-inxora-cyan',
  entregado: 'bg-green-100 text-green-800',
  completado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-700',
}

function getEstadoCodigo(item: PedidoListItem): string {
  if (typeof item.estado === 'object' && item.estado !== null) {
    return (item.estado as { codigo: string }).codigo ?? ''
  }
  return typeof item.estado === 'string' ? item.estado : ''
}

function estadoBadgeClass(item: PedidoListItem) {
  const key = getEstadoCodigo(item).toLowerCase().replace(/\s+/g, '_')
  return ESTADO_STYLES[key] ?? ESTADO_STYLES.default
}

function estadoLabel(item: PedidoListItem) {
  if (item.estado_label) return item.estado_label
  if (typeof item.estado === 'object' && item.estado !== null) {
    return (item.estado as { nombre: string }).nombre ?? getEstadoCodigo(item)
  }
  const codigo = getEstadoCodigo(item)
  return codigo.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}

// ─── skeletons ───────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0">
      <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-5 w-24 ml-auto" />
    </div>
  )
}

// ─── main ────────────────────────────────────────────────────────────────────

export default function PedidosPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'es'

  const { cliente, token, isLoggedIn, isLoading: authLoading } = useClienteAuth()

  const [pedidos, setPedidos] = useState<PedidoListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPedidos = useCallback(async () => {
    if (!cliente || !token) return
    setLoading(true)
    setError(null)
    try {
      const res = await miCuentaService.getPedidosByCliente(cliente.id, token)
      const lista = res.data?.pedidos ?? []
      setPedidos(Array.isArray(lista) ? lista : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar los pedidos.')
    } finally {
      setLoading(false)
    }
  }, [cliente, token])

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace(`/${locale}/login?redirect=/${locale}/cuenta/pedidos`)
    }
  }, [authLoading, isLoggedIn, router, locale])

  useEffect(() => {
    if (isLoggedIn && cliente && token) {
      fetchPedidos()
    }
  }, [isLoggedIn, cliente, token, fetchPedidos])

  if (authLoading) {
    return <LoadingSkeleton locale={locale} />
  }
  if (!isLoggedIn || !cliente) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link
            href={`/${locale}/cuenta`}
            className="text-gray-500 hover:text-inxora-blue transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Volver a Mi Cuenta"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-inxora-cyan" aria-hidden />
            <h1 className="font-semibold text-gray-900 text-lg">Mis Pedidos</h1>
          </div>
          {!loading && pedidos.length > 0 && (
            <button
              onClick={fetchPedidos}
              className="ml-auto text-gray-400 hover:text-inxora-blue transition-colors p-1 rounded-lg hover:bg-gray-100"
              aria-label="Actualizar pedidos"
              title="Actualizar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
            <div className="bg-red-50 rounded-full p-4 w-fit mx-auto mb-4">
              <Package className="w-8 h-8 text-red-400" aria-hidden />
            </div>
            <p className="text-gray-700 font-medium mb-1">No se pudieron cargar tus pedidos</p>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <Button
              variant="outline"
              onClick={fetchPedidos}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </Button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && pedidos.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="bg-inxora-cyan/10 rounded-full p-5 w-fit mx-auto mb-5">
              <ShoppingBag className="w-10 h-10 text-inxora-cyan" aria-hidden />
            </div>
            <h2 className="text-gray-900 font-semibold text-lg mb-2">
              Aún no tienes pedidos
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
              ¡Empieza chateando con Sara para descubrir los mejores productos para ti!
            </p>
            <Link href={`/${locale}/cuenta/chat-sara`}>
              <Button className="gap-2 bg-inxora-blue hover:bg-inxora-blue/90 text-white">
                <MessageCircle className="w-4 h-4" />
                Chatear con Sara
              </Button>
            </Link>
          </div>
        )}

        {/* Table */}
        {!loading && !error && pedidos.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} encontrado{pedidos.length !== 1 ? 's' : ''}
            </p>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Table header (desktop) */}
              <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <span>Pedido</span>
                <span className="text-right">Fecha</span>
                <span className="text-center">Estado</span>
                <span className="text-right">Total</span>
              </div>

              {/* Rows */}
              {pedidos.map((pedido, idx) => (
                <div
                  key={pedido.id}
                  className={`flex flex-col md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center gap-2 md:gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
                    idx < pedidos.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  {/* Order info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-inxora-cyan/10 rounded-xl p-2 flex-shrink-0">
                      <Package className="w-4 h-4 text-inxora-cyan" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        Pedido #{pedido.numero}
                      </p>
                      {pedido.tipo_entrega && (
                        <p className="text-xs text-gray-400 capitalize">
                          {pedido.tipo_entrega.toLowerCase()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-sm text-gray-500 md:text-right">
                    {formatDate(pedido.fecha_creacion)}
                  </p>

                  {/* Status */}
                  <div className="md:flex md:justify-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoBadgeClass(pedido)}`}
                    >
                      {estadoLabel(pedido)}
                    </span>
                  </div>

                  {/* Total */}
                  <p className="text-sm font-semibold text-gray-900 md:text-right">
                    {formatCurrency(pedido.total, pedido.moneda)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function LoadingSkeleton({ locale }: { locale: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
