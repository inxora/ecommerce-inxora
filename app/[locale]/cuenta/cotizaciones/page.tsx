'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  FileText,
  RefreshCw,
  MessageCircle,
  Download,
  FileX,
} from 'lucide-react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { miCuentaService, type CotizacionListItem } from '@/lib/services/mi-cuenta.service'
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
  en_revision: 'bg-blue-100 text-blue-800',
  aprobada: 'bg-green-100 text-green-800',
  enviada: 'bg-inxora-cyan/10 text-inxora-cyan',
  rechazada: 'bg-red-100 text-red-800',
  vencida: 'bg-gray-100 text-gray-500',
  default: 'bg-gray-100 text-gray-700',
}

function estadoBadgeClass(estado: string) {
  const key = estado.toLowerCase().replace(/\s+/g, '_')
  return ESTADO_STYLES[key] ?? ESTADO_STYLES.default
}

function estadoLabel(item: CotizacionListItem) {
  if (typeof item.estado === 'object' && item.estado !== null) {
    return item.estado.nombre
  }
  return String(item.estado).replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}

function estadoCodigo(item: CotizacionListItem): string {
  if (typeof item.estado === 'object' && item.estado !== null) {
    return item.estado.codigo.toLowerCase()
  }
  return String(item.estado).toLowerCase()
}

function pdfUrl(item: CotizacionListItem): string | null {
  return item.pdf_url ?? item.url_descarga ?? null
}

// ─── skeleton ────────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0">
      <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-28 rounded-lg" />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-40" />
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

// ─── main ────────────────────────────────────────────────────────────────────

export default function CotizacionesPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'es'

  const { cliente, token, isLoggedIn, isLoading: authLoading } = useClienteAuth()

  const [cotizaciones, setCotizaciones] = useState<CotizacionListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCotizaciones = useCallback(async () => {
    if (!cliente || !token) return
    setLoading(true)
    setError(null)
    try {
      const res = await miCuentaService.getCotizacionesByCliente(cliente.id, token)
      const lista = res.data?.cotizacion ?? []
      setCotizaciones(Array.isArray(lista) ? lista : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar las cotizaciones.')
    } finally {
      setLoading(false)
    }
  }, [cliente, token])

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace(`/${locale}/login?redirect=/${locale}/cuenta/cotizaciones`)
    }
  }, [authLoading, isLoggedIn, router, locale])

  useEffect(() => {
    if (isLoggedIn && cliente && token) {
      fetchCotizaciones()
    }
  }, [isLoggedIn, cliente, token, fetchCotizaciones])

  if (authLoading) return <LoadingSkeleton />
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
            <FileText className="w-5 h-5 text-inxora-pink" aria-hidden />
            <h1 className="font-semibold text-gray-900 text-lg">Mis Cotizaciones</h1>
          </div>
          {!loading && cotizaciones.length > 0 && (
            <button
              onClick={fetchCotizaciones}
              className="ml-auto text-gray-400 hover:text-inxora-blue transition-colors p-1 rounded-lg hover:bg-gray-100"
              aria-label="Actualizar cotizaciones"
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
              <FileX className="w-8 h-8 text-red-400" aria-hidden />
            </div>
            <p className="text-gray-700 font-medium mb-1">
              No se pudieron cargar tus cotizaciones
            </p>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <Button variant="outline" onClick={fetchCotizaciones} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </Button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && cotizaciones.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="bg-inxora-pink/10 rounded-full p-5 w-fit mx-auto mb-5">
              <FileText className="w-10 h-10 text-inxora-pink" aria-hidden />
            </div>
            <h2 className="text-gray-900 font-semibold text-lg mb-2">
              Aún no tienes cotizaciones
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
              ¡Habla con Sara para solicitar una cotización personalizada para tu empresa!
            </p>
            <Link href={`/${locale}/cuenta/chat-sara`}>
              <Button className="gap-2 bg-inxora-blue hover:bg-inxora-blue/90 text-white">
                <MessageCircle className="w-4 h-4" />
                Chatear con Sara
              </Button>
            </Link>
          </div>
        )}

        {/* List */}
        {!loading && !error && cotizaciones.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {cotizaciones.length} cotización{cotizaciones.length !== 1 ? 'es' : ''} encontrada{cotizaciones.length !== 1 ? 's' : ''}
            </p>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Table header (desktop) */}
              <div className="hidden md:grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <span>Cotización</span>
                <span className="text-right">Fecha</span>
                <span className="text-center">Estado</span>
                <span className="text-right">Total</span>
                <span className="text-center">PDF</span>
              </div>

              {/* Rows */}
              {cotizaciones.map((cotizacion, idx) => {
                const url = pdfUrl(cotizacion)
                return (
                  <div
                    key={cotizacion.id}
                    className={`flex flex-col md:grid md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center gap-2 md:gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
                      idx < cotizaciones.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    {/* Quote info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-inxora-pink/10 rounded-xl p-2 flex-shrink-0">
                        <FileText className="w-4 h-4 text-inxora-pink" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          Cotización #{cotizacion.numero}
                        </p>
                        <p className="text-xs text-gray-400 md:hidden">
                          {formatDate(cotizacion.fecha_emision)}
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <p className="hidden md:block text-sm text-gray-500 text-right">
                      {formatDate(cotizacion.fecha_emision)}
                    </p>

                    {/* Status */}
                    <div className="md:flex md:justify-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoBadgeClass(estadoCodigo(cotizacion))}`}
                      >
                        {estadoLabel(cotizacion)}
                      </span>
                    </div>

                    {/* Total */}
                    <p className="text-sm font-semibold text-gray-900 md:text-right">
                      {formatCurrency(cotizacion.total, cotizacion.moneda_cotizacion?.codigo)}
                    </p>

                    {/* PDF download */}
                    <div className="md:flex md:justify-center">
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-inxora-pink hover:text-inxora-pink/80 border border-inxora-pink/30 hover:border-inxora-pink/60 rounded-lg px-3 py-1.5 transition-colors"
                          aria-label={`Descargar PDF de cotización #${cotizacion.numero}`}
                        >
                          <Download className="w-3.5 h-3.5" aria-hidden />
                          Descargar PDF
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
