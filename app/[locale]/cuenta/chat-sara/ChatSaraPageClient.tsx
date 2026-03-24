'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { MessageSquarePlus, ArrowLeft, Loader2, Trash2, ImagePlus, X, Share2, FileText, Paperclip, Cloud, Image as ImageIcon, Send, Menu, Package, UserCircle2, MessageSquare, RefreshCw, Download, ShoppingBag, ChevronRight, ChevronLeft, LogOut, Pencil, Check } from 'lucide-react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import {
  getSaraConversaciones,
  getSaraConversation,
  sendSaraChatMessage,
  deleteSaraChatHistory,
  renameSaraConversacion,
  ApiError,
  CHAT_GATEWAY_ERROR_MESSAGE,
  isGatewayErrorBody,
} from '@/lib/services/sara-chat.service'
import type {
  SaraConversacionItem,
  SaraChatAttachmentContentType,
  SaraChatDocumentContentType,
} from '@/lib/services/sara-chat.service'
import { formatPhoneForWhatsApp } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuthModal } from '@/lib/contexts/auth-modal-context'
import {
  getDriveAccessToken,
  openDrivePicker,
  downloadDriveFileAsBase64,
} from '@/lib/google-drive-picker'
import {
  miCuentaService,
  type PedidoListItem,
  type PedidoDetalle,
  type PedidoItemDetalle,
  type CotizacionListItem,
  type CotizacionDetalle,
  type CotizacionItemDetalle,
} from '@/lib/services/mi-cuenta.service'

type Message = {
  role: 'user' | 'assistant' | 'asesor'
  content: string
  asesor_nombre?: string
  attachmentPreviews?: string[]
}

interface Categoria {
  id: number
  nombre: string
  logo_url?: string | null
  activo?: boolean
}

const BRAND = { logo: '/sara-pose2.png', name: 'SARA XORA', typingText: 'Sara está escribiendo…' }
const STYLE = { primary: '#13A0D8', secondary: '#0d7ba8' }
const PHONE_REGEX = /(\+?51)?[\s.-]*([9]\d{2})[\s.-]*(\d{3})[\s.-]*(\d{3})\b/g

const MAX_IMAGES = 5
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES: SaraChatAttachmentContentType[] = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_IMAGE_TYPES_SET = new Set(ALLOWED_IMAGE_TYPES)
type PendingAttachment = { id: string; content_type: SaraChatAttachmentContentType; data: string; preview: string }

const MAX_DOCUMENTS = 3
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024
const ALLOWED_DOCUMENT_TYPES: SaraChatDocumentContentType[] = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]
const ALLOWED_DOCUMENT_TYPES_SET = new Set(ALLOWED_DOCUMENT_TYPES)
type PendingDocument = { id: string; content_type: SaraChatDocumentContentType; data: string; name: string; size: number }

function linkifyPhones(text: string): string {
  return text.replace(PHONE_REGEX, (match) => {
    const digits = match.replace(/\D/g, '')
    const normalized = formatPhoneForWhatsApp(digits).replace('+', '')
    return `[${match.trim()}](https://wa.me/${normalized})`
  })
}

const IMAGE_PLACEHOLDER_REGEX = /\[Imagen(es)? enviada\(s\)\]|\[\d+ imagen\(es\)\]|\[\d+ documento\(s\)\]/g
function hasImagePlaceholder(content: string): boolean {
  return /\[Imagen(es)? enviada\(s\)\]|\[\d+ imagen\(es\)\]/.test(content)
}
/** Texto que sale del textarea/input: CRLF → LF, sin tocar saltos de línea reales. */
function normalizeOutgoingChatInput(raw: string): string {
  return raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
}
function stripImagePlaceholder(content: string): string {
  return content
    .replace(IMAGE_PLACEHOLDER_REGEX, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Antes: /\s{2,}/g colapsaba \r\n (Windows) a un espacio y destruía las listas
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function formatRelativeDate(s: string | null): string {
  if (!s) return ''
  try {
    const d = new Date(s)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours} h`
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}

/** Devuelve el texto a mostrar como título de una conversación. */
function getConversacionTitle(c: SaraConversacionItem): string {
  if (c.titulo?.trim()) return c.titulo.trim()
  if (c.primer_mensaje?.trim()) {
    const t = c.primer_mensaje.trim()
    return t.length > 40 ? `${t.slice(0, 40)}…` : t
  }
  if (c.lead_json?.razon_social) return c.lead_json.razon_social
  if (c.lead_json?.nombre_contacto) return c.lead_json.nombre_contacto
  if (c.created_at) return formatRelativeDate(c.created_at)
  return 'Conversación'
}

// ─── helpers para vistas inline ─────────────────────────────────────────────

function mcFormatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch { return iso }
}

function mcFormatCurrency(amount: string | number | null | undefined, moneda?: string | null) {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0)
  const currency = moneda ?? 'PEN'
  try {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency, minimumFractionDigits: 2 }).format(num)
  } catch { return `${currency} ${num.toFixed(2)}` }
}

const ESTADO_PEDIDO: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  en_proceso: 'bg-blue-100 text-blue-700',
  en_camino: 'bg-sky-100 text-sky-700',
  entregado: 'bg-green-100 text-green-700',
  completado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
}
const ESTADO_COTIZACION: Record<string, string> = {
  // códigos del backend
  pendiente: 'bg-yellow-100 text-yellow-700',
  borrador: 'bg-slate-100 text-slate-500',
  en_revision: 'bg-blue-100 text-blue-700',
  enviada: 'bg-sky-100 text-sky-700',
  evaluando: 'bg-blue-100 text-blue-700',
  aprobada: 'bg-green-100 text-green-700',
  aceptada: 'bg-green-100 text-green-700',
  en_proceso: 'bg-indigo-100 text-indigo-700',
  rechazada: 'bg-red-100 text-red-700',
  cancelada: 'bg-red-100 text-red-700',
  vencida: 'bg-slate-100 text-slate-500',
  completada: 'bg-green-100 text-green-700',
}
function estadoClass(estado: string, map: Record<string, string>) {
  return map[estado.toLowerCase().replace(/\s+/g, '_')] ?? 'bg-slate-100 text-slate-600'
}
function estadoStr(estado: string, label?: string | null) {
  return label ?? estado.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}

// ─── PedidosInlineView ────────────────────────────────────────────────────────

function PedidosInlineView({
  pedidos,
  loading,
  error,
  onRetry,
  token,
}: {
  pedidos: PedidoListItem[]
  loading: boolean
  error: string | null
  onRetry: () => void
  token: string | null
  locale: string
}) {
  const [selected, setSelected] = useState<PedidoListItem | null>(null)
  const [detalle, setDetalle] = useState<PedidoDetalle | null>(null)
  const [detalleLoading, setDetalleLoading] = useState(false)
  const [detalleError, setDetalleError] = useState<string | null>(null)

  const openDetalle = async (p: PedidoListItem) => {
    setSelected(p)
    setDetalle(null)
    setDetalleError(null)
    if (!token) return
    setDetalleLoading(true)
    try {
      const res = await miCuentaService.getPedidoDetalle(p.id, token)
      if (res?.data) setDetalle(res.data)
    } catch {
      setDetalleError('No se pudo cargar el detalle del pedido.')
    } finally {
      setDetalleLoading(false)
    }
  }

  const closeDetalle = () => {
    setSelected(null)
    setDetalle(null)
    setDetalleError(null)
  }

  // ── helpers locales ──────────────────────────────────────────────────────
  const estadoCodigo = (item: PedidoListItem): string => {
    if (typeof item.estado === 'object' && item.estado !== null) {
      return (item.estado as { codigo: string }).codigo ?? ''
    }
    return typeof item.estado === 'string' ? item.estado : ''
  }
  const estadoNombre = (item: PedidoListItem): string => {
    if (item.estado_label) return item.estado_label
    if (typeof item.estado === 'object' && item.estado !== null) {
      return (item.estado as { nombre: string }).nombre ?? estadoCodigo(item)
    }
    return estadoStr(estadoCodigo(item), null)
  }
  const monedaCodigo = (item: PedidoListItem): string => {
    if (item.moneda_pedido?.codigo) return item.moneda_pedido.codigo
    if (typeof item.moneda === 'string' && item.moneda) return item.moneda
    return 'PEN'
  }

  // ── vista detalle ─────────────────────────────────────────────────────────
  if (selected) {
    const src = detalle ?? selected
    const codigo = estadoCodigo(src)
    const nombre = estadoNombre(src)
    const items: PedidoItemDetalle[] =
      detalle?.items ?? detalle?.lineas ?? detalle?.lineas_pedido ?? []
    const asesor = (detalle as PedidoDetalle | null)?.asesor_ventas ?? null

    return (
      <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-900">
        {/* Header detalle */}
        <header className="shrink-0 flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800 shadow-sm">
          <button
            onClick={closeDetalle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#13A0D8] hover:bg-slate-100 transition-colors"
            aria-label="Volver"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Package className="h-5 w-5 text-[#13A0D8]" aria-hidden />
          <span className="font-bold text-slate-800 dark:text-white flex-1 truncate">
            Pedido #{src.numero}
          </span>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${estadoClass(codigo, ESTADO_PEDIDO)}`}>
            {nombre}
          </span>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {detalleLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-7 w-7 animate-spin text-slate-300" />
            </div>
          )}
          {detalleError && (
            <p className="text-sm text-red-500 text-center">{detalleError}</p>
          )}

          {/* Resumen financiero */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Resumen</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                { label: 'Fecha', value: mcFormatDate(src.fecha_creacion) },
                ...(src.fecha_entrega_estimada ? [{ label: 'Entrega estimada', value: mcFormatDate(src.fecha_entrega_estimada) }] : []),
                ...(src.subtotal != null ? [{ label: 'Subtotal', value: mcFormatCurrency(src.subtotal, monedaCodigo(src)) }] : []),
                ...(src.igv != null ? [{ label: 'IGV', value: mcFormatCurrency(src.igv, monedaCodigo(src)) }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 bg-[#13A0D8]/5">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Total</span>
                <span className="text-sm font-bold text-[#13A0D8]">
                  {mcFormatCurrency(src.total, monedaCodigo(src))}
                </span>
              </div>
            </div>
          </div>

          {/* Productos */}
          {items.length > 0 && (
            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Productos ({items.length})
                </p>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {items.map((it, i) => {
                  const imgSrc =
                    it.producto?.imagen_url ??
                    it.producto?.imagen_principal ??
                    it.imagen_url ??
                    null
                  const nombre =
                    it.producto?.nombre ??
                    it.descripcion ??
                    `Ítem ${i + 1}`
                  const sku = it.producto?.sku ?? it.producto?.codigo ?? null
                  const qty = it.cantidad ?? 1
                  const precio = it.precio_unitario_cliente ?? it.precio_unitario ?? null
                  const subtotal = it.total ?? it.subtotal ?? null
                  return (
                    <li key={it.id ?? i} className="flex items-center gap-3 px-4 py-3">
                      {imgSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgSrc}
                          alt={nombre}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-white line-clamp-2 leading-snug">
                          {nombre}
                        </p>
                        {sku && (
                          <p className="text-xs text-slate-400 mt-0.5">SKU: {sku}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-0.5">
                          Cant: {qty}
                          {precio != null && ` · ${mcFormatCurrency(precio, monedaCodigo(src))} c/u`}
                        </p>
                      </div>
                      {subtotal != null && (
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 shrink-0">
                          {mcFormatCurrency(subtotal, monedaCodigo(src))}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Asesor de ventas */}
          {asesor && (
            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Asesor de ventas</p>
              </div>
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#13A0D8]/10 flex items-center justify-center text-[#13A0D8] font-bold text-sm shrink-0">
                  {asesor.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {asesor.nombre} {asesor.apellidos}
                  </p>
                  {asesor.correo && (
                    <p className="text-xs text-slate-500 truncate">{asesor.correo}</p>
                  )}
                  {asesor.telefono_directo && (
                    <p className="text-xs text-slate-500">{asesor.telefono_directo}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── vista lista ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="shrink-0 flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <Package className="h-5 w-5 text-[#13A0D8]" aria-hidden />
        <p className="font-bold text-slate-800 dark:text-white flex-1">Mis Pedidos</p>
        {!loading && (
          <button
            onClick={onRetry}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#13A0D8] hover:bg-slate-100 transition-colors"
            title="Actualizar"
            aria-label="Actualizar pedidos"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-slate-300" aria-hidden />
          </div>
        )}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <p className="text-sm text-slate-500">{error}</p>
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 text-sm text-[#13A0D8] hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reintentar
            </button>
          </div>
        )}
        {!loading && !error && pedidos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#13A0D8]/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-[#13A0D8]" aria-hidden />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Aún no tienes pedidos</p>
            <p className="text-xs text-slate-400 max-w-[220px]">
              Escríbele a Sara para cotizar y generar tu primer pedido.
            </p>
          </div>
        )}
        {!loading && !error && pedidos.length > 0 && (
          <ul className="space-y-2">
            {pedidos.map((p) => {
              const codigo = estadoCodigo(p)
              const nombre = estadoNombre(p)
              return (
                <li
                  key={p.id}
                  onClick={() => openDetalle(p)}
                  className="group bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 flex flex-col gap-1.5 border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-[#13A0D8]/40 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800 dark:text-white truncate group-hover:text-[#13A0D8] transition-colors">
                      Pedido #{p.numero}
                    </span>
                    <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${estadoClass(codigo, ESTADO_PEDIDO)}`}>
                      {nombre}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{mcFormatDate(p.fecha_creacion)}</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {mcFormatCurrency(p.total, monedaCodigo(p))}
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="text-[10px] text-slate-400 group-hover:text-[#13A0D8] flex items-center gap-0.5 transition-colors">
                      Ver detalle <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─── CotizacionesInlineView ───────────────────────────────────────────────────

function CotizacionesInlineView({
  cotizaciones,
  loading,
  error,
  onRetry,
  token,
}: {
  cotizaciones: CotizacionListItem[]
  loading: boolean
  error: string | null
  onRetry: () => void
  token: string | null
}) {
  const [selected, setSelected] = useState<CotizacionListItem | null>(null)
  const [detalle, setDetalle] = useState<CotizacionDetalle | null>(null)
  const [detalleLoading, setDetalleLoading] = useState(false)
  const [detalleError, setDetalleError] = useState<string | null>(null)

  const openDetalle = async (c: CotizacionListItem) => {
    setSelected(c)
    setDetalle(null)
    setDetalleError(null)
    if (!token) return
    setDetalleLoading(true)
    try {
      const res = await miCuentaService.getCotizacionDetalle(c.id, token)
      setDetalle(res.data)
    } catch {
      setDetalleError('No se pudo cargar el detalle. Inténtalo de nuevo.')
    } finally {
      setDetalleLoading(false)
    }
  }

  const monedaSimbolo = (c: CotizacionListItem) => c.moneda_cotizacion?.simbolo ?? 'S/'
  const monedaCodigo  = (c: CotizacionListItem) => c.moneda_cotizacion?.codigo ?? 'PEN'

  // ── Vista detalle ────────────────────────────────────────────────────────────
  if (selected) {
    const src = detalle ?? selected
    const items: CotizacionItemDetalle[] =
      detalle?.items ?? detalle?.lineas ?? detalle?.lineas_cotizacion ?? []
    const pdfLink = detalle?.pdf_url ?? detalle?.url_descarga ?? detalle?.url_pdf ?? null
    const estadoCodigo = typeof src.estado === 'object' ? src.estado.codigo : String(src.estado)
    const estadoNombre = typeof src.estado === 'object' ? src.estado.nombre : estadoStr(String(src.estado))
    const asesor = detalle?.asesor_ventas ?? (selected as CotizacionDetalle).asesor_ventas ?? null

    return (
      <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-900">
        {/* Header detalle */}
        <header className="shrink-0 flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 shadow-sm">
          <button
            type="button"
            onClick={() => { setSelected(null); setDetalle(null); setDetalleError(null) }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Volver a cotizaciones"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{src.numero}</p>
            <p className="text-xs text-slate-400 mt-0.5">{mcFormatDate(src.fecha_emision)}</p>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${estadoClass(estadoCodigo, ESTADO_COTIZACION)}`}>
            {estadoNombre}
          </span>
        </header>

        <div className="flex-1 overflow-y-auto">
          {detalleLoading && (
            <div className="flex justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-slate-300" />
            </div>
          )}
          {detalleError && (
            <div className="flex flex-col items-center py-10 gap-3 text-center px-4">
              <p className="text-sm text-slate-500">{detalleError}</p>
              <button
                onClick={() => openDetalle(selected)}
                className="text-sm text-[#13A0D8] hover:underline flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reintentar
              </button>
            </div>
          )}
          {!detalleLoading && !detalleError && (
            <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">

              {/* Resumen financiero */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Resumen</span>
                  {pdfLink && (
                    <a
                      href={pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#13A0D8] hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" /> Descargar PDF
                    </a>
                  )}
                </div>
                <div className="space-y-1.5 text-sm">
                  {src.subtotal != null && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Subtotal</span>
                      <span>{mcFormatCurrency(src.subtotal, monedaCodigo(src))}</span>
                    </div>
                  )}
                  {src.igv != null && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>IGV (18%)</span>
                      <span>{mcFormatCurrency(src.igv, monedaCodigo(src))}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-800 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-600 mt-1.5">
                    <span>Total</span>
                    <span className="text-[#13A0D8]">
                      {monedaSimbolo(src)} {mcFormatCurrency(src.total, monedaCodigo(src)).replace(/[^0-9.,]/g, '')}
                    </span>
                  </div>
                </div>
                {src.fecha_vencimiento && (
                  <p className="text-xs text-slate-400 mt-3">
                    Válida hasta: <span className="font-medium">{mcFormatDate(src.fecha_vencimiento)}</span>
                  </p>
                )}
              </div>

              {/* Productos */}
              {items.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Productos ({items.length})
                  </p>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const imgSrc =
                        item.producto?.imagen_url ??
                        item.producto?.imagen_principal ??
                        item.imagen_url ??
                        null
                      const nombre =
                        item.producto?.nombre ??
                        item.descripcion ??
                        'Producto'
                      const sku = item.producto?.sku ?? item.producto?.codigo ?? null
                      const qty = item.cantidad ?? 1
                      const precioUnit = item.precio_unitario_cliente ?? item.precio_unitario
                      const totalItem = item.total ?? item.subtotal

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-3 shadow-sm"
                        >
                          <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 flex items-center justify-center">
                            {imgSrc ? (
                              <Image
                                src={imgSrc}
                                alt={nombre}
                                width={64}
                                height={64}
                                className="w-full h-full object-contain"
                                unoptimized
                              />
                            ) : (
                              <span className="text-2xl opacity-40">📦</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white leading-snug line-clamp-2">
                              {nombre}
                            </p>
                            {sku && <p className="text-xs text-slate-400 mt-0.5">SKU: {sku}</p>}
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-xs text-slate-500">
                                {qty} × {mcFormatCurrency(precioUnit, monedaCodigo(src))}
                              </span>
                              {totalItem != null && (
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                  {mcFormatCurrency(totalItem, monedaCodigo(src))}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Asesor */}
              {asesor && (
                <div className="bg-[#13A0D8]/5 rounded-2xl p-4 border border-[#13A0D8]/10">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Tu asesor</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {asesor.nombre} {asesor.apellidos}
                  </p>
                  {asesor.correo && <p className="text-xs text-slate-500 mt-0.5">{asesor.correo}</p>}
                  {asesor.telefono_directo && <p className="text-xs text-slate-500 mt-0.5">{asesor.telefono_directo}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Vista lista ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-900">
      <header className="shrink-0 flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <FileText className="h-5 w-5 text-[#13A0D8]" aria-hidden />
        <p className="font-bold text-slate-800 dark:text-white flex-1">Mis Cotizaciones</p>
        {!loading && (
          <button
            onClick={onRetry}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#13A0D8] hover:bg-slate-100 transition-colors"
            title="Actualizar" aria-label="Actualizar cotizaciones"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-slate-300" aria-hidden />
          </div>
        )}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <p className="text-sm text-slate-500">{error}</p>
            <button onClick={onRetry} className="flex items-center gap-1.5 text-sm text-[#13A0D8] hover:underline">
              <RefreshCw className="h-3.5 w-3.5" /> Reintentar
            </button>
          </div>
        )}
        {!loading && !error && cotizaciones.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#13A0D8]/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#13A0D8]" aria-hidden />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Aún no tienes cotizaciones</p>
            <p className="text-xs text-slate-400 max-w-[220px]">
              Habla con Sara para solicitar una cotización personalizada.
            </p>
          </div>
        )}
        {!loading && !error && cotizaciones.length > 0 && (
          <ul className="space-y-2 max-w-2xl mx-auto">
            {cotizaciones.map((c) => {
              const estadoCodigo = typeof c.estado === 'object' ? c.estado.codigo : String(c.estado)
              const estadoNombre = typeof c.estado === 'object' ? c.estado.nombre : estadoStr(String(c.estado))
              const moneda = c.moneda_cotizacion?.codigo ?? 'PEN'
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => openDetalle(c)}
                    className="w-full text-left bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-[#13A0D8]/30 transition-all p-4 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                          {c.numero}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{mcFormatDate(c.fecha_emision)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${estadoClass(estadoCodigo, ESTADO_COTIZACION)}`}>
                          {estadoNombre}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#13A0D8] transition-colors" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-xs text-slate-400">
                        {c.fecha_vencimiento ? `Vence: ${mcFormatDate(c.fecha_vencimiento)}` : 'Sin fecha de vencimiento'}
                      </span>
                      <span className="text-base font-extrabold text-[#13A0D8]">
                        {c.moneda_cotizacion?.simbolo ?? 'S/'} {mcFormatCurrency(c.total, moneda).replace(/[^0-9.,]/g, '')}
                      </span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export function ChatSaraPageClient({
  locale,
  initialSessionId,
  categorias: categoriasProp = [],
}: {
  locale: string
  /** Cuando se abre desde /chat-sara/share/[sessionId], pre-selecciona esta conversación */
  initialSessionId?: string
  /** Categorías precargadas en el servidor para evitar llamadas desde el cliente */
  categorias?: Categoria[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cliente, token, isLoggedIn, isLoading: authLoading, logout } = useClienteAuth()
  const [conversaciones, setConversaciones] = useState<SaraConversacionItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(initialSessionId ?? null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingChat, setLoadingChat] = useState(false)
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<PendingAttachment[]>([])
  const [documents, setDocuments] = useState<PendingDocument[]>([])
  const [sending, setSending] = useState(false)
  const [isAsesorRespondiendo, setIsAsesorRespondiendo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareModalSessionId, setShareModalSessionId] = useState<string | null>(null)
  const [urlCopied, setUrlCopied] = useState(false)
  const [attachMenuOpen, setAttachMenuOpen] = useState(false)
  // ── Renombrar conversación ──
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [savingTitle, setSavingTitle] = useState<string | null>(null)
  const renameSavingRef = useRef(false)
  // ── Chips de categorías (precargadas desde el servidor) ──
  const categorias = categoriasProp
  const [activeChipId, setActiveChipId] = useState<number | null>(null)
  const [driveLoading, setDriveLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // ── Nav de cuenta: sección activa y expansión ──
  const [navExpanded, setNavExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState<'chat' | 'pedidos' | 'cotizaciones'>('chat')
  const [pedidos, setPedidos] = useState<PedidoListItem[]>([])
  const [pedidosLoading, setPedidosLoading] = useState(false)
  const [pedidosError, setPedidosError] = useState<string | null>(null)
  const [cotizaciones, setCotizaciones] = useState<CotizacionListItem[]>([])
  const [cotizacionesLoading, setCotizacionesLoading] = useState(false)
  const [cotizacionesError, setCotizacionesError] = useState<string | null>(null)

  const { openAuthModal } = useAuthModal()
  const listRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileInputDocRef = useRef<HTMLInputElement>(null)
  const attachMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!attachMenuOpen) return
    const close = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) setAttachMenuOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [attachMenuOpen])

  const skipLoadMessagesRef = useRef(false)
  const [loadKey, setLoadKey] = useState(0)

  const normalizeMessages = useCallback((raw: unknown): Message[] => {
    let parsed = raw
    if (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed) as unknown
      } catch {
        parsed = []
      }
    }
    const msgs = Array.isArray(parsed) ? parsed : []
    return msgs
      .filter(
        (m): m is { role: 'user' | 'assistant' | 'asesor'; content: string; asesor_nombre?: string } =>
          typeof m === 'object' &&
          m !== null &&
          (m as { role?: unknown }).role !== undefined &&
          ((m as { role: string }).role === 'user' ||
            (m as { role: string }).role === 'assistant' ||
            (m as { role: string }).role === 'asesor') &&
          typeof (m as { content?: unknown }).content === 'string'
      )
      .map((m) => ({
        role: m.role,
        content: m.content,
        asesor_nombre: typeof m.asesor_nombre === 'string' ? m.asesor_nombre : undefined,
      }))
  }, [])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [])

  const fetchPedidos = useCallback(async () => {
    if (!cliente?.id || !token) return
    setPedidosLoading(true)
    setPedidosError(null)
    try {
      const res = await miCuentaService.getPedidosByCliente(cliente.id, token)
      // La API devuelve { data: { pedidos: [...] } }
      const lista = res.data?.pedidos ?? []
      setPedidos(Array.isArray(lista) ? lista : [])
    } catch (e) {
      setPedidosError(e instanceof Error ? e.message : 'No se pudieron cargar los pedidos.')
    } finally {
      setPedidosLoading(false)
    }
  }, [cliente?.id, token])

  const fetchCotizaciones = useCallback(async () => {
    if (!cliente?.id || !token) return
    setCotizacionesLoading(true)
    setCotizacionesError(null)
    try {
      const res = await miCuentaService.getCotizacionesByCliente(cliente.id, token)
      // La API devuelve { data: { cotizacion: [...] } }
      const lista = res.data?.cotizacion ?? []
      setCotizaciones(Array.isArray(lista) ? lista : [])
    } catch (e) {
      setCotizacionesError(e instanceof Error ? e.message : 'No se pudieron cargar las cotizaciones.')
    } finally {
      setCotizacionesLoading(false)
    }
  }, [cliente?.id, token])

  useEffect(() => {
    if (!isLoggedIn) return
    if (activeSection === 'pedidos' && pedidos.length === 0 && !pedidosLoading && !pedidosError) {
      fetchPedidos()
    }
    if (activeSection === 'cotizaciones' && cotizaciones.length === 0 && !cotizacionesLoading && !cotizacionesError) {
      fetchCotizaciones()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, isLoggedIn])

  const loadConversaciones = useCallback(async () => {
    if (!cliente?.id) return
    setLoadingList(true)
    setError(null)
    try {
      const res = await getSaraConversaciones(cliente.id)
      setConversaciones(res.data ?? [])
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error al cargar conversaciones')
    } finally {
      setLoadingList(false)
    }
  }, [cliente?.id])

  useEffect(() => {
    if (cliente?.id) loadConversaciones()
  }, [cliente?.id, loadConversaciones])

  // Leer session_id desde la URL al cargar (para que al recargar se mantenga el chat seleccionado)
  useEffect(() => {
    if (initialSessionId) {
      setSelectedSessionId(initialSessionId)
      setLoadKey((k) => k + 1)
      return
    }
    const sessionFromUrl = searchParams?.get('session')
    if (sessionFromUrl && sessionFromUrl.trim()) {
      setSelectedSessionId(sessionFromUrl.trim())
      setLoadKey((k) => k + 1)
    }
  }, [initialSessionId, searchParams])

  const updateUrlForSession = useCallback(
    (sessionId: string | null) => {
      const path = `/${locale}/cuenta/chat-sara`
      const href = sessionId ? `${path}?session=${encodeURIComponent(sessionId)}` : path
      router.replace(href, { scroll: false })
    },
    [locale, router]
  )

  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([])
      setIsAsesorRespondiendo(false)
      return
    }
    if (skipLoadMessagesRef.current) {
      skipLoadMessagesRef.current = false
      setLoadingChat(false)
      return
    }
    setLoadingChat(true)
    setError(null)
    getSaraConversation(selectedSessionId)
      .then((res) => {
        setMessages(normalizeMessages(res?.data?.mensajes))
        setIsAsesorRespondiendo(res?.data?.estado === 'asesor_respondiendo')
        setTimeout(() => scrollToBottom(), 80)
      })
      .catch(() => {
        setMessages([])
        setIsAsesorRespondiendo(false)
      })
      .finally(() => setLoadingChat(false))
  }, [selectedSessionId, loadKey, scrollToBottom, normalizeMessages])

  useEffect(() => {
    if (!selectedSessionId || !isAsesorRespondiendo) return

    let cancelled = false
    const intervalId = window.setInterval(async () => {
      try {
        const res = await getSaraConversation(selectedSessionId)
        if (cancelled) return
        setMessages((prev) => {
          const next = normalizeMessages(res?.data?.mensajes)
          return JSON.stringify(prev) === JSON.stringify(next) ? prev : next
        })
        const sigueRespondiendo = res?.data?.estado === 'asesor_respondiendo'
        setIsAsesorRespondiendo(sigueRespondiendo)
      } catch {
        // Evitar romper UI por un fallo transitorio de red
      }
    }, 3000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [selectedSessionId, isAsesorRespondiendo, normalizeMessages])

  const isNearBottom = useCallback((threshold = 120) => {
    const el = listRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold
  }, [])

  const startNewConversation = useCallback(() => {
    setSelectedSessionId(null)
    setMessages([])
    setInput('')
    setError(null)
    updateUrlForSession(null)
  }, [updateUrlForSession])

  const borrarHistorialDeSesion = useCallback(
    async (sessionId: string, e?: React.MouseEvent) => {
      e?.stopPropagation()
      const confirmar = window.confirm('¿Borrar todo el historial de esta conversación?')
      if (!confirmar) return
      try {
        await deleteSaraChatHistory(sessionId)
        if (selectedSessionId === sessionId) {
          setMessages([])
          setError(null)
        }
        loadConversaciones()
      } catch {
        setError('No se pudo borrar el historial. Inténtalo de nuevo.')
      }
    },
    [selectedSessionId, loadConversaciones]
  )

  const openShareModal = useCallback((sessionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setShareModalSessionId(sessionId)
    setUrlCopied(false)
  }, [])

  // ── Callbacks para renombrar conversación ──
  const handleCancelRename = useCallback(() => {
    setEditingSessionId(null)
    setEditTitle('')
  }, [])

  const handleStartRename = useCallback((c: SaraConversacionItem, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingSessionId(c.session_id)
    setEditTitle(getConversacionTitle(c))
  }, [])

  const handleSaveRename = useCallback(async (sessionId: string) => {
    if (renameSavingRef.current) return
    const title = editTitle.trim()
    if (!title) { handleCancelRename(); return }
    renameSavingRef.current = true
    setSavingTitle(sessionId)
    try {
      await renameSaraConversacion(sessionId, title)
      setConversaciones((prev) =>
        prev.map((c) => (c.session_id === sessionId ? { ...c, titulo: title } : c))
      )
      setEditingSessionId(null)
      setEditTitle('')
    } catch {
      setError('No se pudo guardar el nombre. Inténtalo de nuevo.')
      setEditingSessionId(null)
      setEditTitle('')
    } finally {
      setSavingTitle(null)
      renameSavingRef.current = false
    }
  }, [editTitle, handleCancelRename])

  const shareUrl = shareModalSessionId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/chat-sara/share/${encodeURIComponent(shareModalSessionId)}`
    : ''

  const copyShareUrl = useCallback(async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    } catch {
      setError('No se pudo copiar el enlace.')
    }
  }, [shareUrl])

  const addImageFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return
    setError(null)
    const allowedTypesStr = 'JPEG, PNG o WebP'
    const toAdd: { file: File; ct: SaraChatAttachmentContentType }[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ct = file.type as SaraChatAttachmentContentType
      if (!ALLOWED_IMAGE_TYPES_SET.has(ct)) {
        setError(`Solo ${allowedTypesStr}, máximo ${MAX_IMAGES} y 5 MB cada una.`)
        return
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError('Cada imagen debe pesar como máximo 5 MB.')
        return
      }
      toAdd.push({ file, ct })
    }
    const currentLen = attachments.length
    const slot = MAX_IMAGES - currentLen
    if (slot <= 0) {
      setError(`Máximo ${MAX_IMAGES} imágenes por mensaje.`)
      return
    }
    const toProcess = toAdd.slice(0, slot)
    toProcess.forEach(({ file, ct }) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1]! : dataUrl
        setAttachments((prev) => {
          if (prev.length >= MAX_IMAGES) return prev
          return [
            ...prev,
            { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, content_type: ct, data: base64, preview: dataUrl },
          ]
        })
      }
      reader.readAsDataURL(file)
    })
  }, [attachments.length])

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const addDocumentFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return
    setError(null)
    const allowedStr = 'PDF, Word (.docx) y Excel (.xlsx)'
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ct = file.type as SaraChatDocumentContentType
      if (!ALLOWED_DOCUMENT_TYPES_SET.has(ct)) {
        setError(`Solo ${allowedStr}, máximo ${MAX_DOCUMENTS} y 10 MB cada uno.`)
        return
      }
      if (file.size > MAX_DOCUMENT_BYTES) {
        setError('Cada documento debe pesar como máximo 10 MB.')
        return
      }
    }
    const slot = MAX_DOCUMENTS - documents.length
    if (slot <= 0) {
      setError(`Máximo ${MAX_DOCUMENTS} documentos por mensaje.`)
      return
    }
    const toProcess = Array.from(files).slice(0, slot)
    toProcess.forEach((file) => {
      const ct = file.type as SaraChatDocumentContentType
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1]! : dataUrl
        setDocuments((prev) => {
          if (prev.length >= MAX_DOCUMENTS) return prev
          return [
            ...prev,
            { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, content_type: ct, data: base64, name: file.name, size: file.size },
          ]
        })
      }
      reader.readAsDataURL(file)
    })
  }, [documents.length])

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const addFilesFromDrive = useCallback(async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      setError('Google Drive no configurado (falta NEXT_PUBLIC_GOOGLE_CLIENT_ID).')
      return
    }
    setAttachMenuOpen(false)
    setDriveLoading(true)
    setError(null)
    try {
      const token = await getDriveAccessToken(clientId)
      const appId = process.env.NEXT_PUBLIC_GOOGLE_APP_ID
      const picked = await openDrivePicker(clientId, token, appId)
      if (picked.length === 0) {
        setDriveLoading(false)
        return
      }
      const norm = (m: string) => (m === 'image/jpg' ? 'image/jpeg' : m)
      const newAttachments: PendingAttachment[] = []
      const newDocuments: PendingDocument[] = []
      for (const file of picked) {
        const mime = norm(file.mimeType)
        const size = file.size ?? 0
        if (ALLOWED_IMAGE_TYPES_SET.has(mime as SaraChatAttachmentContentType)) {
          if (newAttachments.length >= MAX_IMAGES) continue
          if (size > MAX_IMAGE_BYTES) continue
          const { content_type, data } = await downloadDriveFileAsBase64(token, file.id, mime)
          const preview = `data:${content_type};base64,${data}`
          newAttachments.push({
            id: `drive-${file.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            content_type: content_type as SaraChatAttachmentContentType,
            data,
            preview,
          })
        } else if (ALLOWED_DOCUMENT_TYPES_SET.has(mime as SaraChatDocumentContentType)) {
          if (newDocuments.length >= MAX_DOCUMENTS) continue
          if (size > MAX_DOCUMENT_BYTES) continue
          const { content_type, data } = await downloadDriveFileAsBase64(token, file.id, mime)
          newDocuments.push({
            id: `drive-${file.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            content_type: content_type as SaraChatDocumentContentType,
            data,
            name: file.name,
            size: size || 0,
          })
        }
      }
      if (newAttachments.length) setAttachments((p) => [...p, ...newAttachments].slice(0, MAX_IMAGES))
      if (newDocuments.length) setDocuments((p) => [...p, ...newDocuments].slice(0, MAX_DOCUMENTS))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al usar Google Drive.')
    } finally {
      setDriveLoading(false)
    }
  }, [])

  const sendMessage = useCallback(async () => {
    const text = normalizeOutgoingChatInput(input)
    const hasAttachments = attachments.length > 0
    const hasDocuments = documents.length > 0
    if ((!text && !hasAttachments && !hasDocuments) || sending) return

    const apiAttachments =
      attachments.length > 0 ? attachments.map((a) => ({ content_type: a.content_type, data: a.data })) : undefined
    const apiDocuments =
      documents.length > 0 ? documents.map((d) => ({ content_type: d.content_type, data: d.data })) : undefined
    const parts = []
    if (text) parts.push(text)
    if (hasAttachments) parts.push(`[${attachments.length} imagen(es)]`)
    if (hasDocuments) parts.push(`[${documents.length} documento(s)]`)
    const userContent = parts.length ? parts.join('\n') : ''
    const previews = attachments.map((a) => a.preview)

    setInput('')
    setAttachments([])
    setDocuments([])
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: userContent, attachmentPreviews: previews }])
    setSending(true)
    scrollToBottom()
    try {
      const res = await sendSaraChatMessage(
        text || '',
        selectedSessionId ?? undefined,
        cliente?.id,
        apiAttachments,
        apiDocuments
      )
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }])
      if (res.session_id) {
        skipLoadMessagesRef.current = true
        setSelectedSessionId(res.session_id)
        updateUrlForSession(res.session_id)
        if (!selectedSessionId) {
          setConversaciones((prev) => {
            if (prev.some((c) => c.session_id === res.session_id)) return prev
            const now = new Date().toISOString()
            return [
              {
                id: 0,
                session_id: res.session_id,
                id_cliente: cliente?.id ?? null,
                estado: '',
                id_cotizacion: null,
                lead_json: null,
                created_at: now,
                updated_at: now,
              } as SaraConversacionItem,
              ...prev,
            ]
          })
          loadConversaciones()
        }
      }
    } catch (e) {
      const is422 = e instanceof ApiError && e.status === 422
      let msg = is422
        ? 'Solo imágenes (JPEG/PNG/WebP, máx. 5 y 5 MB c/u) y documentos (PDF/Word/Excel, máx. 3 y 10 MB c/u).'
        : (e instanceof ApiError ? e.message : 'Error al enviar. Inténtalo de nuevo.')
      if (isGatewayErrorBody(msg)) msg = CHAT_GATEWAY_ERROR_MESSAGE
      setError(msg)
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
    } finally {
      setSending(false)
      scrollToBottom()
    }
  }, [input, attachments, documents, sending, selectedSessionId, loadConversaciones, scrollToBottom, cliente?.id, updateUrlForSession])

  /** Envía directamente un mensaje de categoría sin pasar por el input de texto. */
  const sendCategoryMessage = useCallback(async (cat: Categoria) => {
    if (sending) return
    // displayText: lo que ve el usuario en la burbuja
    const displayText = `Muéstrame los productos de la categoría ${cat.nombre}`
    // apiText: lo que recibe el backend con el id para filtrar correctamente
    const apiText = `${displayText} [categoria_id:${cat.id}]`
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: displayText }])
    setSending(true)
    setActiveChipId(cat.id)
    scrollToBottom()
    try {
      const res = await sendSaraChatMessage(apiText, selectedSessionId ?? undefined, cliente?.id)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }])
      if (res.session_id) {
        skipLoadMessagesRef.current = true
        setSelectedSessionId(res.session_id)
        updateUrlForSession(res.session_id)
        if (!selectedSessionId) {
          setConversaciones((prev) => {
            if (prev.some((c) => c.session_id === res.session_id)) return prev
            const now = new Date().toISOString()
            return [
              {
                id: 0,
                session_id: res.session_id,
                id_cliente: cliente?.id ?? null,
                estado: '',
                id_cotizacion: null,
                lead_json: null,
                created_at: now,
                updated_at: now,
              } as SaraConversacionItem,
              ...prev,
            ]
          })
          loadConversaciones()
        }
      }
    } catch (e) {
      const is422 = e instanceof ApiError && e.status === 422
      let msg = is422
        ? 'Solo imágenes (JPEG/PNG/WebP, máx. 5 y 5 MB c/u) y documentos (PDF/Word/Excel, máx. 3 y 10 MB c/u).'
        : (e instanceof ApiError ? e.message : 'Error al enviar. Inténtalo de nuevo.')
      if (isGatewayErrorBody(msg)) msg = CHAT_GATEWAY_ERROR_MESSAGE
      setError(msg)
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
    } finally {
      setSending(false)
      setActiveChipId(null)
      scrollToBottom()
    }
  }, [sending, selectedSessionId, cliente?.id, loadConversaciones, scrollToBottom, updateUrlForSession])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#13A0D8]" aria-hidden />
      </div>
    )
  }

  const markdownLink = ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-[#13A0D8] hover:text-[#0d7ba8] focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/40 rounded">
      {children}
    </a>
  )
  const markdownImg = ({ src, alt }: { src?: string; alt?: string }) => (
    <span className="inline-block max-w-[200px] max-h-[200px] rounded-lg overflow-hidden my-1 shadow-sm">
      <img src={src} alt={alt ?? ''} className="max-w-full max-h-[200px] w-auto h-auto object-contain" />
    </span>
  )

  // Iniciales del usuario para el avatar del nav
  const userInitial = (cliente?.nombre ?? 'U').slice(0, 1).toUpperCase()

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full min-h-0 bg-white dark:bg-slate-950">

      {/* ── Nav de secciones de cuenta (izquierda, expandible) ── */}
      {isLoggedIn && (
        <nav
          className={`flex flex-col shrink-0 bg-[#171D4C] border-r border-white/5 py-3 z-10 transition-[width] duration-200 overflow-hidden ${
            navExpanded ? 'w-52' : 'w-14 items-center'
          }`}
          aria-label="Secciones de mi cuenta"
        >
          {/* Botón toggle expandir/contraer */}
          <div className={`flex mb-3 ${navExpanded ? 'justify-end pr-2' : 'justify-center'}`}>
            <button
              type="button"
              onClick={() => setNavExpanded((v) => !v)}
              aria-label={navExpanded ? 'Contraer menú' : 'Expandir menú'}
              title={navExpanded ? 'Contraer' : 'Expandir'}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/50"
            >
              {navExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          {/* Avatar → Mi Perfil */}
          <Link
            href={`/${locale}/cuenta`}
            title={navExpanded ? undefined : 'Mi Perfil'}
            aria-label="Ver mi perfil"
            className={`flex items-center gap-3 transition-colors hover:bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/50 ${
              navExpanded ? 'w-full px-3 py-2' : 'w-10 h-10 justify-center'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#13A0D8] flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-white/10">
              {userInitial}
            </div>
            {navExpanded && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate leading-tight">
                  {cliente?.nombre ?? 'Mi Perfil'}
                </p>
                <p className="text-xs text-white/50 truncate leading-tight">Ver perfil</p>
              </div>
            )}
          </Link>

          {/* Separador superior */}
          <div className={`h-px bg-white/10 my-2 ${navExpanded ? 'mx-3' : 'w-8'}`} />

          {/* Items de navegación */}
          {(
            [
              { section: 'chat', Icon: MessageSquare, label: 'Chat con Sara', sublabel: 'Asistente IA' },
              { section: 'pedidos', Icon: Package, label: 'Mis Pedidos', sublabel: 'Estado y seguimiento' },
              { section: 'cotizaciones', Icon: FileText, label: 'Mis Cotizaciones', sublabel: 'Descarga PDFs' },
            ] as const
          ).map(({ section, Icon, label, sublabel }) => (
            <button
              key={section}
              type="button"
              aria-label={label}
              aria-current={activeSection === section ? 'page' : undefined}
              title={navExpanded ? undefined : label}
              onClick={() => setActiveSection(section)}
              className={`flex items-center gap-3 transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/50 ${
                navExpanded ? 'w-full px-3 py-2.5' : 'w-10 h-10 justify-center'
              } ${
                activeSection === section
                  ? 'bg-[#13A0D8] text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {navExpanded && (
                <div className="min-w-0 text-left">
                  <p className="text-sm font-medium truncate leading-tight">{label}</p>
                  <p className={`text-xs truncate leading-tight ${activeSection === section ? 'text-white/70' : 'text-white/30'}`}>
                    {sublabel}
                  </p>
                </div>
              )}
            </button>
          ))}

          {/* Cerrar sesión — anclado al fondo para eliminar espacio vacío */}
          <div className="mt-auto">
            <div className={`h-px bg-white/10 mb-2 ${navExpanded ? 'mx-3' : 'w-8 mx-auto'}`} />
            <button
              type="button"
              aria-label="Cerrar sesión"
              title={navExpanded ? undefined : 'Cerrar sesión'}
              onClick={() => {
                logout()
                router.push(`/${locale}/login`)
              }}
              className={`flex items-center gap-3 transition-colors rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-400/30 ${
                navExpanded ? 'w-full px-3 py-2.5' : 'w-10 h-10 justify-center'
              }`}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {navExpanded && (
                <span className="text-sm font-medium">Cerrar sesión</span>
              )}
            </button>
          </div>
        </nav>
      )}

      {/* ── Historial de conversaciones (solo visible en sección chat) ── */}
      <aside
        className={`flex flex-col flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-[width] duration-200 overflow-hidden ${
          activeSection !== 'chat' ? 'hidden' : sidebarCollapsed ? 'w-14' : 'w-72'
        }`}
      >
        {/* Barra superior */}
        <div
          className={`flex border-b border-slate-100 dark:border-slate-800 ${
            sidebarCollapsed ? 'flex-col items-center gap-0.5 py-2' : 'items-center gap-1 p-2 min-h-[52px]'
          }`}
        >
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/30 shrink-0"
            aria-label={sidebarCollapsed ? 'Abrir menú' : 'Cerrar menú'}
            title={sidebarCollapsed ? 'Abrir menú' : 'Cerrar menú'}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            href={`/${locale}`}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/30 transition-colors shrink-0"
            aria-label="Volver"
            title="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          {!sidebarCollapsed && (
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate flex-1 px-1">
              Conversaciones
            </span>
          )}
          <button
            type="button"
            onClick={startNewConversation}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#13A0D8] focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/30 transition-colors shrink-0"
            title="Nueva conversación"
            aria-label="Nueva conversación"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2 bg-white dark:bg-slate-900">
          {!isLoggedIn ? (
            !sidebarCollapsed && (
              <div className="mx-3 mt-3 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-4">
                <p className="text-sm font-semibold leading-snug mb-1 text-slate-800 dark:text-white">
                  Inicia sesión para empezar a guardar tus conversaciones
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  Una vez que hayas iniciado sesión, podrás acceder a tus conversaciones recientes aquí.
                </p>
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="text-[#13A0D8] text-sm font-semibold hover:underline focus:outline-none"
                >
                  Iniciar sesión
                </button>
              </div>
            )
          ) : loadingList ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" aria-hidden />
            </div>
          ) : conversaciones.length === 0 ? (
            !sidebarCollapsed && (
              <div className="text-center py-8 px-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2">
                  <MessageSquarePlus className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Sin conversaciones</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">La conversación se crea al enviar el primer mensaje.</p>
              </div>
            )
          ) : (
            <ul className="space-y-0.5 px-2">
              {conversaciones.map((c) => (
                <li key={c.session_id}>
                  {editingSessionId === c.session_id ? (
                    /* ── Edición inline del título ── */
                    <div className="mx-0.5 my-0.5 flex items-center gap-1 rounded-xl border-2 border-[#13A0D8]/50 bg-white dark:bg-slate-800 px-2 py-1.5">
                      <input
                        autoFocus
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value.slice(0, 100))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') { e.preventDefault(); handleSaveRename(c.session_id) }
                          if (e.key === 'Escape') { e.preventDefault(); handleCancelRename() }
                        }}
                        onBlur={() => {
                          if (savingTitle === c.session_id) return
                          if (editTitle.trim()) {
                            handleSaveRename(c.session_id)
                          } else {
                            handleCancelRename()
                          }
                        }}
                        disabled={savingTitle === c.session_id}
                        className="flex-1 min-w-0 text-sm font-medium text-slate-800 dark:text-white bg-transparent outline-none disabled:opacity-60 placeholder:text-slate-400"
                        maxLength={100}
                        aria-label="Nombre de la conversación"
                      />
                      {savingTitle === c.session_id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400 shrink-0" />
                      ) : (
                        <>
                          <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); handleSaveRename(c.session_id) }}
                            className="p-1 rounded-md text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 focus:outline-none shrink-0"
                            title="Guardar nombre"
                            aria-label="Guardar nombre"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); handleCancelRename() }}
                            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none shrink-0"
                            title="Cancelar"
                            aria-label="Cancelar edición"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    /* ── Vista normal ── */
                    <div
                      className={`group relative flex items-center gap-2 rounded-xl transition-colors ${
                        selectedSessionId === c.session_id
                          ? 'bg-[#13A0D8]/10 text-[#13A0D8]'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setLoadKey((k) => k + 1)
                          setSelectedSessionId(c.session_id)
                          updateUrlForSession(c.session_id)
                        }}
                        onDoubleClick={(e) => {
                          if (!sidebarCollapsed) handleStartRename(c, e)
                        }}
                        className={`flex-1 min-w-0 text-left py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#13A0D8]/30 ${
                          sidebarCollapsed ? 'px-2 flex justify-center' : 'px-3'
                        }`}
                      >
                        {sidebarCollapsed ? (
                          <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                            {getConversacionTitle(c).slice(0, 1).toUpperCase()}
                          </span>
                        ) : (
                          <>
                            <span className="block truncate text-sm font-medium">
                              {getConversacionTitle(c)}
                            </span>
                            <span className="block truncate text-xs text-slate-400 mt-0.5">
                              {formatRelativeDate(c.updated_at)}
                            </span>
                          </>
                        )}
                      </button>
                      {!sidebarCollapsed && (
                        <div className="flex items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => handleStartRename(c, e)}
                            className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none"
                            title="Renombrar conversación"
                            aria-label="Renombrar conversación"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => borrarHistorialDeSesion(c.session_id, e)}
                            className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none"
                            title="Borrar historial"
                            aria-label="Borrar historial"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => openShareModal(c.session_id, e)}
                            className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none"
                            title="Compartir"
                            aria-label="Compartir"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* ── Área principal (chat / pedidos / cotizaciones) ── */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-slate-900">

        {/* Vista: Mis Pedidos */}
        {activeSection === 'pedidos' && (
          <PedidosInlineView
            pedidos={pedidos}
            loading={pedidosLoading}
            error={pedidosError}
            onRetry={fetchPedidos}
            token={token}
            locale={locale}
          />
        )}

        {/* Vista: Mis Cotizaciones */}
        {activeSection === 'cotizaciones' && (
          <CotizacionesInlineView
            cotizaciones={cotizaciones}
            loading={cotizacionesLoading}
            error={cotizacionesError}
            onRetry={fetchCotizaciones}
            token={token ?? null}
          />
        )}

        {/* Vista: Chat con Sara (siempre montada para no perder estado, solo oculta) */}
        <div className={activeSection !== 'chat' ? 'hidden' : 'flex-1 flex flex-col min-h-0'}>

        {/* Header */}
        <header className="shrink-0 flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#13A0D8]/40">
            <Image
              src="/sara-pose2.png"
              alt="Sara Xora"
              fill
              className="object-cover object-top"
              unoptimized
            />
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 z-10" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-800 dark:text-white text-base truncate">{BRAND.name}</p>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden />
              En línea
            </p>
          </div>
        </header>

        {/* ── Categorías (debajo del header, estilo grid circular) ── */}
        {isLoggedIn && categorias.length > 0 && (
          <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-3 py-3 sm:px-5 sm:py-4">
            {/*
              Mobile:  scroll horizontal, items de tamaño fijo
              Desktop: grid que se expande para llenar el ancho completo (auto-fit)
            */}
            <div className="
              flex gap-4 overflow-x-auto scrollbar-none pb-1
              lg:grid lg:overflow-visible lg:pb-0 lg:gap-x-2 lg:gap-y-1
              lg:[grid-template-columns:repeat(auto-fit,minmax(60px,1fr))]
            ">
              {categorias.map((cat) => {
                const isActive = activeChipId === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => sendCategoryMessage(cat)}
                    disabled={sending}
                    title={cat.nombre}
                    className="group flex flex-col items-center gap-1.5 shrink-0 lg:shrink lg:min-w-0 lg:w-full focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {/* Círculo: fijo en mobile, se adapta al grid en desktop */}
                    <div className={`
                      w-14 h-14 sm:w-16 sm:h-16
                      lg:w-12 lg:h-12 xl:w-14 xl:h-14
                      lg:mx-auto
                      rounded-full bg-gray-100 dark:bg-slate-800
                      flex items-center justify-center overflow-hidden
                      border-2 transition-all duration-200 shadow-sm
                      p-2 sm:p-2.5
                      ${isActive
                        ? 'border-[#13A0D8] shadow-lg shadow-[#13A0D8]/25 scale-105'
                        : 'border-transparent group-hover:border-[#13A0D8] group-hover:shadow-md'
                      }
                    `}>
                      {isActive ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#13A0D8]" />
                      ) : cat.logo_url ? (
                        <Image
                          src={cat.logo_url}
                          alt={cat.nombre}
                          width={56}
                          height={56}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <span className="text-xl sm:text-2xl">📦</span>
                      )}
                    </div>
                    {/* Nombre: ancho fijo en mobile, ancho completo en desktop */}
                    <span className={`
                      text-[10px] sm:text-[11px]
                      w-14 sm:w-16 lg:w-full
                      font-semibold text-center uppercase tracking-wide leading-tight line-clamp-2
                      transition-colors
                      ${isActive
                        ? 'text-[#13A0D8]'
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-[#13A0D8]'
                      }
                    `}>
                      {cat.nombre}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Mensajes */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-900"
        >
          {!isLoggedIn ? (
            /* ── Pantalla de bienvenida (no autenticado) ── */
            <div className="flex flex-col items-center justify-center h-full px-6 py-8 gap-6">
              {/* Título */}
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#13A0D8] mb-1">Asistente industrial IA</p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Chatea con Sara Xora</h2>
              </div>

              {/* Desktop: grid con Sara al centro, cards arriba/izquierda/derecha */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto_auto] gap-4 place-items-center">

                {/* Fila 1 */}
                <div />
                {/* Card arriba (centro) */}
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 shadow-sm w-52">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#13A0D8]/10 text-[#13A0D8]">💬</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Historial de cotizaciones</p>
                </div>
                <div />

                {/* Fila 2: card izq · Sara · card der */}
                {/* Card izquierda */}
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 shadow-sm w-48 justify-end">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#13A0D8]/10 text-[#13A0D8]">⚡</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Cotizaciones rápidas</p>
                </div>

                {/* Sara */}
                <div className="w-52 h-64 overflow-hidden shrink-0 mx-4 drop-shadow-xl">
                  <Image src="/Sara-señalando.png" alt="Sara Xora" width={208} height={256} className="w-full h-full object-contain object-bottom" unoptimized priority />
                </div>

                {/* Card derecha */}
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 shadow-sm w-48">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#13A0D8]/10 text-[#13A0D8]">🕐</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Disponible 24/7</p>
                </div>

                {/* Fila 3: botón centrado */}
                <div />
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="mt-2 w-52 py-3 rounded-xl bg-[#13A0D8] text-white font-semibold text-sm hover:bg-[#0d7ba8] focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/40 transition-colors shadow-sm"
                >
                  Iniciar sesión / Registrarse
                </button>
                <div />
              </div>

              {/* Mobile: Sara arriba, cards y botón apilados */}
              <div className="sm:hidden flex flex-col items-center gap-4 w-full max-w-xs">
                <div className="h-52 drop-shadow-xl">
                  <Image src="/Sara-señalando.png" alt="Sara Xora" width={176} height={208} className="h-full w-auto object-contain object-bottom" unoptimized priority />
                </div>
                {[
                  { icon: '⚡', title: 'Cotizaciones rápidas' },
                  { icon: '💬', title: 'Historial de cotizaciones' },
                  { icon: '🕐', title: 'Disponible 24/7' },
                ].map(({ icon, title }) => (
                  <div key={title} className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 shadow-sm w-full">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#13A0D8]/10 text-[#13A0D8]">{icon}</span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{title}</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="w-full py-3 rounded-xl bg-[#13A0D8] text-white font-semibold text-sm hover:bg-[#0d7ba8] focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/40 transition-colors shadow-sm"
                >
                  Iniciar sesión / Registrarse
                </button>
              </div>
            </div>
          ) : !selectedSessionId && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center max-w-sm mx-auto px-4 py-6">
              <div className="h-56 sm:h-64 mb-5 drop-shadow-xl">
                <Image
                  src="/Sara-señalando.png"
                  alt="Sara Xora"
                  width={220}
                  height={256}
                  className="h-full w-auto object-contain object-bottom"
                  unoptimized
                  priority
                />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Hola, soy Sara</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
                Tu asistente de INXORA. Pregúntame por productos, cotizaciones o envíos.
              </p>
              <p className="text-[#13A0D8] font-semibold text-sm">
                Escribe tu consulta o lo que necesites cotizar.
              </p>
              <p className="text-slate-400 text-xs mt-1.5">
                La conversación se crea al enviar tu primer mensaje.
              </p>
            </div>
          ) : loadingChat ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-slate-300" aria-hidden />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 min-h-[240px] text-center text-slate-500">
              <p className="text-sm font-medium">No hay mensajes en esta conversación.</p>
              <p className="text-xs mt-1">Escribe abajo para enviar tu primer mensaje.</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#13A0D8] text-white rounded-br-md'
                        : msg.role === 'asesor'
                          ? 'bg-emerald-50/90 text-emerald-900 rounded-bl-md border border-emerald-100'
                          : error && msg.role === 'assistant' && i === messages.length - 1
                            ? 'bg-red-50 text-red-800 rounded-bl-md border border-red-100'
                            : 'bg-white text-slate-800 rounded-bl-md border border-slate-100 shadow-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <>
                        {msg.attachmentPreviews && msg.attachmentPreviews.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {msg.attachmentPreviews.map((src, j) => (
                              <span key={j} className="relative inline-block rounded-lg overflow-hidden border border-white/30 max-w-[120px] max-h-[120px]">
                                <img src={src} alt="" className="object-cover w-full h-full max-w-[120px] max-h-[120px]" />
                              </span>
                            ))}
                          </div>
                        )}
                        {!msg.attachmentPreviews?.length && hasImagePlaceholder(msg.content) && (
                          <span className="inline-flex items-center gap-1.5 text-white/90 text-sm">
                            <ImageIcon className="w-4 h-4 shrink-0" aria-hidden />
                            Imagen adjunta
                          </span>
                        )}
                        {(stripImagePlaceholder(msg.content) || (!msg.attachmentPreviews?.length && !hasImagePlaceholder(msg.content))) && (
                          <span
                            className={`whitespace-pre-wrap break-words ${
                              msg.attachmentPreviews?.length || hasImagePlaceholder(msg.content) ? 'block mt-1' : ''
                            }`}
                          >
                            {msg.attachmentPreviews?.length || hasImagePlaceholder(msg.content) ? stripImagePlaceholder(msg.content) : msg.content}
                          </span>
                        )}
                      </>
                    ) : msg.role === 'asesor' ? (
                      <>
                        <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5">
                          {msg.asesor_nombre?.trim()
                            ? `${msg.asesor_nombre.trim()} (Asesor Inxora)`
                            : 'Equipo Inxora'}
                        </span>
                        <div className="text-sm prose prose-p:my-1 prose-p:leading-relaxed max-w-none">
                          <ReactMarkdown components={{ a: markdownLink, img: markdownImg }}>
                            {linkifyPhones(msg.content)}
                          </ReactMarkdown>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm prose prose-p:my-1 prose-p:leading-relaxed max-w-none">
                        <ReactMarkdown components={{ a: markdownLink, img: markdownImg }}>
                          {linkifyPhones(msg.content)}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {sending && (
            <div className="flex justify-start mt-4 max-w-3xl mx-auto">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm">
                <span className="inline-flex gap-1 text-slate-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Error inline: suave */}
        {error && (
          <div className="shrink-0 mx-4 mb-2 px-4 py-2.5 bg-red-50/90 border border-red-100 text-red-700 text-sm rounded-xl" role="alert">
            {error}
          </div>
        )}

        {/* Input fijo: pill, sombra sutil, adjuntos compactos */}
        <div className={`shrink-0 p-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 ${!isLoggedIn ? 'pointer-events-none select-none opacity-40' : ''}`}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            aria-label="Adjuntar imagen"
            onChange={(e) => {
              addImageFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <input
            ref={fileInputDocRef}
            type="file"
            accept=".pdf,.docx,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            multiple
            className="sr-only"
            aria-label="Adjuntar documento"
            onChange={(e) => {
              addDocumentFiles(e.target.files)
              e.target.value = ''
            }}
          />
          {(attachments.length > 0 || documents.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((a) => (
                <div key={a.id} className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                  <img src={a.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    aria-label="Quitar imagen"
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => removeAttachment(a.id)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {documents.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs max-w-[180px]"
                >
                  <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="flex-1 min-w-0 truncate" title={d.name}>{d.name}</span>
                  <button
                    type="button"
                    aria-label="Quitar documento"
                    className="p-1 rounded text-slate-400 hover:bg-slate-200 hover:text-slate-600 focus:outline-none"
                    onClick={() => removeDocument(d.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-end" ref={attachMenuRef}>
            <div className="relative shrink-0">
              <button
                type="button"
                className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[#13A0D8] hover:border-[#13A0D8]/30 focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/30 transition-colors flex items-center justify-center disabled:opacity-50"
                aria-label="Adjuntar"
                aria-expanded={attachMenuOpen}
                aria-haspopup="true"
                title="Adjuntar"
                disabled={sending || !isLoggedIn}
                onClick={(e) => {
                  e.stopPropagation()
                  setAttachMenuOpen((v) => !v)
                }}
              >
                <Paperclip className="h-5 w-5" />
              </button>
              {attachMenuOpen && (
                <div
                  className="absolute bottom-full left-0 mb-2 min-w-[220px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-20"
                  role="menu"
                >
                  <button
                    type="button"
                    role="menuitem"
                    disabled={attachments.length >= MAX_IMAGES}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:bg-slate-50 rounded-lg mx-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      setAttachMenuOpen(false)
                      fileInputRef.current?.click()
                    }}
                  >
                    <ImagePlus className="h-5 w-5 text-slate-500 shrink-0" />
                    <span className="flex-1 font-medium">Imagen</span>
                    <span className="text-xs text-slate-400">máx. 5</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={documents.length >= MAX_DOCUMENTS}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:bg-slate-50 rounded-lg mx-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      setAttachMenuOpen(false)
                      fileInputDocRef.current?.click()
                    }}
                  >
                    <FileText className="h-5 w-5 text-slate-500 shrink-0" />
                    <span className="flex-1 font-medium">Documento</span>
                    <span className="text-xs text-slate-400">PDF, Word, Excel</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={driveLoading || (attachments.length >= MAX_IMAGES && documents.length >= MAX_DOCUMENTS)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:bg-slate-50 rounded-lg mx-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      addFilesFromDrive()
                    }}
                  >
                    <Cloud className="h-5 w-5 text-slate-500 shrink-0" />
                    <span className="flex-1 font-medium">Google Drive</span>
                  </button>
                </div>
              )}
            </div>
            <textarea
              placeholder={isLoggedIn ? 'Escribe un mensaje…' : 'Inicia sesión para escribir…'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending || !isLoggedIn}
              className="flex-1 min-h-[42px] max-h-28 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/20 focus:border-[#13A0D8] placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-800 dark:text-slate-200 text-sm bg-white dark:bg-slate-800 shadow-sm"
              rows={1}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={sending || !isLoggedIn || (!input.trim() && attachments.length === 0 && documents.length === 0)}
              className="h-10 w-10 shrink-0 rounded-xl bg-[#13A0D8] text-white flex items-center justify-center hover:bg-[#0d7ba8] focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Enviar"
              title="Enviar"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        </div> {/* ← cierre del wrapper div de la sección chat */}
      </main>

      {/* Modal compartir: estilo Gemini */}
      {shareModalSessionId && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-3 sm:p-4 bg-black/40 overflow-y-auto overscroll-contain"
          onClick={() => setShareModalSessionId(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-md w-full max-h-[min(90dvh,calc(100dvh-2rem))] overflow-y-auto p-4 sm:p-6 border border-slate-100 mb-[env(safe-area-inset-bottom,0px)] sm:mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 id="share-modal-title" className="text-base sm:text-lg font-semibold text-slate-800 pr-2">
                Compartir conversación
              </h2>
              <button
                type="button"
                onClick={() => setShareModalSessionId(null)}
                className="shrink-0 p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              Cualquiera con el enlace podrá ver esta conversación (debe tener cuenta).
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full min-w-0 px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 truncate focus:outline-none"
              />
              <Button
                onClick={copyShareUrl}
                className="bg-[#13A0D8] hover:bg-[#0d7ba8] w-full sm:w-auto shrink-0 rounded-xl font-medium shadow-sm"
              >
                {urlCopied ? 'Copiado' : 'Copiar enlace'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
