'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  CreditCard, Building2, QrCode, Lock, CheckCircle,
  AlertCircle, Loader2, Package, Clock, ChevronRight,
  ShieldCheck, Receipt
} from 'lucide-react'
import { IzipayWidget } from '@/components/checkout/izipay-widget'
import { pagosService, ApiError } from '@/lib/services/pagos.service'
import { apiClient } from '@/lib/api/client'
import { formatPriceWithThousands } from '@/lib/utils'

// ── Tipos ────────────────────────────────────────────────────────────────────

interface PedidoDetalle {
  sku: number
  descripcion: string
  cantidad: number
  precio_unitario: number
  precio_total: number
  imagen: string | null
}

interface LinkPagoData {
  token: string
  id_pedido: number
  numero: string
  total: number
  subtotal: number
  igv: number
  costo_envio: number
  tipo_entrega: string
  expira_en: string
  detalles: PedidoDetalle[]
}

type MetodoPago = 'tarjeta' | 'yape' | 'transfer'
type Estado = 'cargando' | 'listo' | 'pagando' | 'pagado' | 'error' | 'expirado'

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `S/ ${formatPriceWithThousands(n)}`
}

function tiempoRestante(expiraEn: string): string {
  const diff = new Date(expiraEn).getTime() - Date.now()
  if (diff <= 0) return 'Expirado'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 0) return `${h}h ${m}m restantes`
  return `${m} min restantes`
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function PagarPage() {
  const params = useParams()
  const router = useRouter()
  const token = params?.token as string

  const [estado, setEstado] = useState<Estado>('cargando')
  const [pedido, setPedido] = useState<LinkPagoData | null>(null)
  const [metodo, setMetodo] = useState<MetodoPago>('tarjeta')
  const [formToken, setFormToken] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [loadingToken, setLoadingToken] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [countdown, setCountdown] = useState('')
  const pedidoIdRef = useRef<number | null>(null)

  // ── Cargar pedido desde el link ────────────────────────────────────────────
  useEffect(() => {
    if (!token) return
    setEstado('cargando')
    apiClient<{ success: boolean; data: LinkPagoData }>(
      `/api/pagos/link/${token}`,
      { method: 'GET', timeout: 15000 }
    )
      .then((res) => {
        if (res.success && res.data) {
          setPedido(res.data)
          pedidoIdRef.current = res.data.id_pedido
          setEstado('listo')
        } else {
          setEstado('error')
        }
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError) {
          if (err.status === 410) setEstado('expirado')
          else setEstado('error')
        } else {
          setEstado('error')
        }
      })
  }, [token])

  // ── Countdown ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pedido?.expira_en) return
    const interval = setInterval(() => {
      setCountdown(tiempoRestante(pedido.expira_en))
    }, 60000)
    setCountdown(tiempoRestante(pedido.expira_en))
    return () => clearInterval(interval)
  }, [pedido?.expira_en])

  // ── Obtener formToken al elegir tarjeta ───────────────────────────────────
  const obtenerFormToken = useCallback(async () => {
    if (!pedido || formToken) return
    setLoadingToken(true)
    try {
      // Crear token con el id_pedido (sin autenticación de cliente — link público)
      const res = await apiClient<{ success: boolean; data: { formToken: string; publicKey: string } }>(
        `/api/pagos/link/${token}/form-token`,
        { method: 'POST', timeout: 20000 }
      )
      if (res.success) {
        setFormToken(res.data.formToken)
        setPublicKey(res.data.publicKey)
      }
    } catch {
      setErrorMsg('No se pudo cargar el formulario de tarjeta. Intenta de nuevo.')
    } finally {
      setLoadingToken(false)
    }
  }, [pedido, formToken, token])

  useEffect(() => {
    if (metodo === 'tarjeta' && estado === 'listo') {
      obtenerFormToken()
    }
  }, [metodo, estado, obtenerFormToken])

  // ── Handlers de pago ──────────────────────────────────────────────────────
  const handleIzipaySuccess = useCallback((krAnswer: string, krHash: string) => {
    setEstado('pagando')
    apiClient<{ success: boolean; data: { orderStatus: string } }>(
      `/api/pagos/validar-link`,
      {
        method: 'POST',
        body: JSON.stringify({ kr_answer: krAnswer, kr_hash: krHash, token }),
        timeout: 20000,
      }
    )
      .then((res) => {
        if (res.data?.orderStatus === 'PAID') {
          setEstado('pagado')
        } else {
          setErrorMsg('El pago no pudo ser confirmado. Intenta de nuevo.')
          setEstado('listo')
        }
      })
      .catch(() => {
        setErrorMsg('Error al validar el pago. Contacta a soporte.')
        setEstado('listo')
      })
  }, [token])

  const handleIzipayError = useCallback((msg: string) => {
    setErrorMsg(msg)
  }, [])

  // ── Renders de estado ──────────────────────────────────────────────────────

  if (estado === 'cargando') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Cargando tu pedido...</p>
        </div>
      </div>
    )
  }

  if (estado === 'expirado') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Link expirado</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Este link de pago ha expirado o ya fue utilizado. Solicita uno nuevo a través del chat con Sara.
          </p>
          <Link
            href="/es/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Ir al chat con Sara <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  if (estado === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Link no válido</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No encontramos este link de pago. Verifica que el link esté completo o solicita uno nuevo.
          </p>
          <Link
            href="/es/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Ir al chat con Sara <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  if (estado === 'pagado') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-9 h-9 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">¡Pago confirmado!</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tu pago fue procesado exitosamente. Número de pedido:{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{pedido?.numero}</span>
          </p>
          <div className="flex gap-3">
            <Link
              href="/es/chat"
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center"
            >
              Volver al chat
            </Link>
            <Link
              href={`/es/pedido/${pedidoIdRef.current}`}
              className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-sm font-semibold text-white transition-colors text-center"
            >
              Ver pedido
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Vista principal ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* Header de seguridad */}
      <div className="w-full bg-slate-900 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 h-9 flex items-center justify-center gap-6">
          {[
            { icon: Lock, label: 'Pago seguro SSL' },
            { icon: ShieldCheck, label: 'Compra protegida' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-slate-400">
              <Icon className="w-3 h-3 text-orange-400" />
              <span className="text-[11px] font-medium tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pagar pedido</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Generado por Sara · {pedido?.numero}
            </p>
          </div>
          {countdown && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              {countdown}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">

          {/* LEFT: Métodos de pago */}
          <div className="space-y-4">

            {/* Selector de método */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
                Elige cómo pagar
              </p>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: 'tarjeta' as MetodoPago, icon: CreditCard, label: 'Tarjeta', desc: 'Visa · MC · Amex', color: 'blue' },
                  { id: 'yape' as MetodoPago, icon: QrCode, label: 'Yape QR', desc: 'Escanea el QR', color: 'purple' },
                  { id: 'transfer' as MetodoPago, icon: Building2, label: 'Transferencia', desc: 'BCP · Soles/USD', color: 'emerald' },
                ] as const).map(({ id, icon: Icon, label, desc, color }) => {
                  const active = metodo === id
                  const borders: Record<string, string> = {
                    blue: 'border-blue-400 bg-blue-50 dark:bg-blue-950/20',
                    purple: 'border-purple-400 bg-purple-50 dark:bg-purple-950/20',
                    emerald: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
                  }
                  const icons: Record<string, string> = {
                    blue: 'bg-blue-500',
                    purple: 'bg-purple-500',
                    emerald: 'bg-emerald-500',
                  }
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMetodo(id)}
                      className={[
                        'flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all text-center',
                        active ? borders[color] : 'border-slate-200 dark:border-slate-700 hover:border-slate-300',
                      ].join(' ')}
                    >
                      <div className={['w-9 h-9 rounded-xl flex items-center justify-center', active ? icons[color] : 'bg-slate-100 dark:bg-slate-800'].join(' ')}>
                        <Icon className={['w-4 h-4', active ? 'text-white' : 'text-slate-500'].join(' ')} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Error global */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* ── Tarjeta (Izipay) ─────────────────────────────────────────── */}
            {metodo === 'tarjeta' && (
              <div className="rounded-2xl border border-blue-200 dark:border-blue-800/50 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 bg-blue-600">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Pago con tarjeta</p>
                      <p className="text-xs text-blue-200">Procesado por Izipay</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {['VISA', 'MC', 'AMEX'].map((b) => (
                      <span key={b} className="text-[9px] font-bold text-white bg-white/20 px-1.5 py-0.5 rounded">{b}</span>
                    ))}
                  </div>
                </div>
                <div className="p-5 bg-blue-50 dark:bg-blue-950/10">
                  <IzipayWidget
                    formToken={formToken}
                    publicKey={publicKey}
                    onPaymentSuccess={handleIzipaySuccess}
                    onPaymentError={handleIzipayError}
                    loading={loadingToken}
                  />
                </div>
                <div className="px-5 py-3 bg-white dark:bg-slate-900 border-t border-blue-100 dark:border-blue-900/50 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Datos procesados directamente por Izipay · SSL 256 bits · INXORA no almacena datos de tarjeta.
                  </p>
                </div>
              </div>
            )}

            {/* ── Yape ─────────────────────────────────────────────────────── */}
            {metodo === 'yape' && (
              <div className="rounded-2xl border border-purple-200 dark:border-purple-800/50 overflow-hidden">
                <div className="px-5 py-3.5 bg-purple-600 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <QrCode className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-bold text-white">Yape (QR)</p>
                  </div>
                </div>
                <div className="p-5 bg-purple-50 dark:bg-purple-950/10 flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-36 h-36 bg-white rounded-2xl p-2 border border-purple-100 flex-shrink-0">
                    <Image src="/qr_inxora.jpeg" alt="QR Yape INXORA" fill className="object-contain rounded-xl" sizes="144px" />
                  </div>
                  <div className="space-y-2.5">
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Cómo pagar con Yape</p>
                    {['Abre tu app de Yape.', 'Toca "Yapear con QR" y escanea el código.', `Ingresa el monto exacto: ${fmt(pedido?.total ?? 0)}`, 'Envíanos el comprobante por WhatsApp.'].map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Transferencia ─────────────────────────────────────────────── */}
            {metodo === 'transfer' && (
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/50 overflow-hidden">
                <div className="px-5 py-3.5 bg-emerald-500 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Banco de Crédito del Perú</p>
                    <p className="text-xs text-emerald-100">Transferencia interbancaria</p>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { flag: '🇵🇪', currency: 'Soles', code: 'PEN', account: '192-7293189-0-73', cci: '002-192-007293189073-34' },
                    { flag: '🇺🇸', currency: 'Dólares', code: 'USD', account: '1917331690183', cci: '00219100733169018351' },
                  ].map(({ flag, currency, code, account, cci }) => (
                    <div key={code} className="bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-900/50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-b border-emerald-100 dark:border-emerald-900/50">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{flag} {currency}</span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">{code}</span>
                      </div>
                      <div className="p-3.5 space-y-2.5">
                        {[['N° de cuenta', account], ['CCI', cci]].map(([label, value]) => (
                          <div key={label}>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{label}</p>
                            <div className="flex items-center gap-2">
                              <span className="flex-1 text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 truncate">{value}</span>
                              <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(value)}
                                className="text-xs text-slate-500 hover:text-orange-500 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-orange-300 transition-colors"
                              >
                                Copiar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Resumen del pedido */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-orange-400 to-amber-400" />
              <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                    <Receipt className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Resumen</span>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                  {pedido?.detalles.length ?? 0} {(pedido?.detalles.length ?? 0) === 1 ? 'ítem' : 'ítems'}
                </span>
              </div>

              {/* Total hero */}
              <div className="px-5 py-4 bg-gradient-to-br from-orange-500 to-amber-500">
                <p className="text-xs font-semibold text-orange-100 uppercase tracking-widest mb-1">Total a pagar</p>
                <p className="text-2xl font-bold text-white">{fmt(pedido?.total ?? 0)}</p>
              </div>

              {/* Productos */}
              <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto">
                {pedido?.detalles.map((d) => (
                  <div key={d.sku} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden relative">
                      {d.imagen ? (
                        <Image src={d.imagen} alt={d.descripcion} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">{d.descripcion}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">x{d.cantidad}</p>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex-shrink-0">{fmt(d.precio_total)}</p>
                  </div>
                ))}
              </div>

              {/* Desglose */}
              <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Subtotal (sin IGV)</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{fmt(pedido?.subtotal ?? 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">IGV (18%)</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{fmt(pedido?.igv ?? 0)}</span>
                </div>
                {(pedido?.costo_envio ?? 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Envío</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{fmt(pedido?.costo_envio ?? 0)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Total</span>
                  <span className="text-base font-bold text-orange-600 dark:text-orange-400">{fmt(pedido?.total ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay procesando */}
      {estado === 'pagando' && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 overflow-y-auto overscroll-contain">
          <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 text-center space-y-3 w-full max-w-sm mb-[env(safe-area-inset-bottom,0px)] sm:mb-0">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Procesando pago...</p>
            <p className="text-xs text-slate-500">No cierres esta ventana</p>
          </div>
        </div>
      )}
    </div>
  )
}