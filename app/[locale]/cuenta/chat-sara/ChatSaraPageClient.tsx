'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { MessageSquarePlus, ArrowLeft, Loader2, Trash2, ImagePlus, X, Share2, FileText, Paperclip, Cloud, Image as ImageIcon, Send, Package, UserCircle2, MessageSquare, RefreshCw, Download, ShoppingBag, ChevronRight, ChevronDown, ChevronLeft, LogOut, Pencil, Check } from 'lucide-react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { useCurrency } from '@/lib/hooks/use-currency'
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
import {
  getChatSaraBasePath,
  getChatSaraHrefForSection,
  getChatSaraSectionFromPathname,
  type ChatSaraSection,
} from '@/lib/i18n/chat-sara-routes'

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

const BRAND_LOGO = '/sara-pose2.png'

function localeToBcp47(locale: string): string {
  if (locale === 'en') return 'en-US'
  if (locale === 'pt') return 'pt-BR'
  return 'es-PE'
}
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

/** Placeholders de adjuntos en distintos idiomas + legado en español */
const IMAGE_PLACEHOLDER_REGEX =
  /\[Imagen(es)?[^\]]*\]|\[\d+\s+imagen\(es\)\]|\[\d+\s+image\(s\)\]|\[\d+\s+imagem\(ns\)\]|\[\d+\s+documento\(s\)\]|\[\d+\s+document\(s\)\]/g
function hasImagePlaceholder(content: string): boolean {
  return /\[Imagen(es)?[^\]]*\]|\[\d+\s+imagen\(es\)\]|\[\d+\s+image\(s\)\]|\[\d+\s+imagem\(ns\)\]/.test(content)
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

/** Evita burbujas sin texto: el API a veces envía mensajes assistant/asesor con content vacío o solo espacios. */
function messageHasRenderableContent(msg: Message): boolean {
  if (msg.role === 'user') {
    if (msg.attachmentPreviews && msg.attachmentPreviews.length > 0) return true
    if (hasImagePlaceholder(msg.content)) return true
    return stripImagePlaceholder(msg.content).trim().length > 0
  }
  return msg.content.trim().length > 0
}

type ChatSaraT = (key: string, values?: Record<string, string | number | Date>) => string

function formatRelativeDate(s: string | null, locale: string, t: ChatSaraT): string {
  if (!s) return ''
  try {
    const d = new Date(s)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return t('relative.now')
    if (diffMins < 60) return t('relative.minutesAgo', { count: diffMins })
    if (diffHours < 24) return t('relative.hoursAgo', { count: diffHours })
    if (diffDays === 1) return t('relative.yesterday')
    if (diffDays < 7) return t('relative.daysAgo', { count: diffDays })
    return d.toLocaleDateString(localeToBcp47(locale), { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}

/** Fecha corta del último movimiento (misma línea que el relativo a la derecha). */
function formatShortChatDate(iso: string | null, locale: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(localeToBcp47(locale), { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}

/**
 * Texto relativo para la columna derecha del listado (evita duplicar la fecha larga).
 * Solo si hace menos de 7 días; si no, cadena vacía (la fecha corta va a la izquierda).
 */
function formatSidebarRelativeRight(iso: string | null, locale: string, t: ChatSaraT): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const diffMs = Date.now() - d.getTime()
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffDays >= 7) return ''
    return formatRelativeDate(iso, locale, t)
  } catch {
    return ''
  }
}

type UltimoPreviewParts = { body: string; rol: 'user' | 'assistant' | null }

/** Vista previa del último mensaje (texto limpio + rol). El recorte visual va con `line-clamp-2` en la lista. */
function getUltimoMensajePreviewParts(c: SaraConversacionItem): UltimoPreviewParts | null {
  const raw = (c.ultimo_mensaje ?? c.primer_mensaje ?? '').trim()
  if (!raw) return null
  const cleaned = stripImagePlaceholder(raw).replace(/\n/g, ' ').replace(/[ \t]+/g, ' ').trim()
  if (!cleaned) return null
  const body = cleaned
  const rolRaw = c.ultimo_mensaje_rol
  const rol: 'user' | 'assistant' | null =
    rolRaw === 'user' || rolRaw === 'assistant' ? rolRaw : null
  return { body, rol }
}

/** Devuelve el texto a mostrar como título de una conversación. */
function getConversacionTitle(c: SaraConversacionItem, locale: string, t: ChatSaraT): string {
  if (c.titulo?.trim()) return c.titulo.trim()
  if (c.primer_mensaje?.trim()) {
    const head = c.primer_mensaje.trim()
    return head.length > 40 ? `${head.slice(0, 40)}…` : head
  }
  if (c.lead_json?.razon_social) return c.lead_json.razon_social
  if (c.lead_json?.nombre_contacto) return c.lead_json.nombre_contacto
  /** No usar fecha de creación aquí: choca con la fecha de última actividad (`updated_at`) en la lista. */
  return t('conversationFallback')
}

// ─── helpers para vistas inline ─────────────────────────────────────────────

function mcFormatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(localeToBcp47(locale), { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch { return iso }
}

function mcFormatCurrency(amount: string | number | null | undefined, moneda: string | null | undefined, locale: string) {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0)
  const currency = moneda ?? 'PEN'
  try {
    return new Intl.NumberFormat(localeToBcp47(locale), { style: 'currency', currency, minimumFractionDigits: 2 }).format(num)
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
  locale,
}: {
  pedidos: PedidoListItem[]
  loading: boolean
  error: string | null
  onRetry: () => void
  token: string | null
  locale: string
}) {
  const t = useTranslations('chatSara')
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
      setDetalleError(t('pedidos.detailError'))
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
            aria-label={t('pedidos.back')}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Package className="h-5 w-5 text-[#13A0D8]" aria-hidden />
          <span className="font-bold text-slate-800 dark:text-white flex-1 truncate">
            {t('pedidos.orderNumber', { num: String(src.numero) })}
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
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{t('pedidos.summary')}</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                { label: t('pedidos.date'), value: mcFormatDate(src.fecha_creacion, locale) },
                ...(src.fecha_entrega_estimada ? [{ label: t('pedidos.estimatedDelivery'), value: mcFormatDate(src.fecha_entrega_estimada, locale) }] : []),
                ...(src.subtotal != null ? [{ label: t('pedidos.subtotal'), value: mcFormatCurrency(src.subtotal, monedaCodigo(src), locale) }] : []),
                ...(src.igv != null ? [{ label: t('pedidos.igv'), value: mcFormatCurrency(src.igv, monedaCodigo(src), locale) }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 bg-[#13A0D8]/5">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('pedidos.total')}</span>
                <span className="text-sm font-bold text-[#13A0D8]">
                  {mcFormatCurrency(src.total, monedaCodigo(src), locale)}
                </span>
              </div>
            </div>
          </div>

          {/* Productos */}
          {items.length > 0 && (
            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {t('pedidos.productsTitle', { count: items.length })}
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
                    t('pedidos.itemFallback', { n: i + 1 })
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
                          <p className="text-xs text-slate-400 mt-0.5">{t('pedidos.sku')}: {sku}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-0.5">
                          {t('pedidos.qty', { qty })}
                          {precio != null && ` · ${mcFormatCurrency(precio, monedaCodigo(src), locale)} c/u`}
                        </p>
                      </div>
                      {subtotal != null && (
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 shrink-0">
                          {mcFormatCurrency(subtotal, monedaCodigo(src), locale)}
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
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{t('pedidos.salesAdvisor')}</p>
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
        <p className="font-bold text-slate-800 dark:text-white flex-1">{t('pedidos.title')}</p>
        {!loading && (
          <button
            onClick={onRetry}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#13A0D8] hover:bg-slate-100 transition-colors"
            title={t('pedidos.refresh')}
            aria-label={t('pedidos.refreshOrders')}
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
              <RefreshCw className="h-3.5 w-3.5" /> {t('pedidos.retry')}
            </button>
          </div>
        )}
        {!loading && !error && pedidos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#13A0D8]/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-[#13A0D8]" aria-hidden />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('pedidos.emptyTitle')}</p>
            <p className="text-xs text-slate-400 max-w-[220px]">
              {t('pedidos.emptyHint')}
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
                      {t('pedidos.orderNumber', { num: String(p.numero) })}
                    </span>
                    <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${estadoClass(codigo, ESTADO_PEDIDO)}`}>
                      {nombre}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{mcFormatDate(p.fecha_creacion, locale)}</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {mcFormatCurrency(p.total, monedaCodigo(p), locale)}
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="text-[10px] text-slate-400 group-hover:text-[#13A0D8] flex items-center gap-0.5 transition-colors">
                      {t('pedidos.viewDetail')} <ChevronRight className="h-3 w-3" />
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
  locale,
}: {
  cotizaciones: CotizacionListItem[]
  loading: boolean
  error: string | null
  onRetry: () => void
  token: string | null
  locale: string
}) {
  const t = useTranslations('chatSara')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [detalleMap, setDetalleMap] = useState<Record<number, CotizacionDetalle>>({})
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set())
  const [errorIds, setErrorIds] = useState<Record<number, string>>({})

  const fetchDetalle = useCallback(async (c: CotizacionListItem) => {
    if (!token) return
    setLoadingIds((prev) => new Set(prev).add(c.id))
    setErrorIds((prev) => { const n = { ...prev }; delete n[c.id]; return n })
    try {
      const res = await miCuentaService.getCotizacionDetalle(c.id, token)
      setDetalleMap((prev) => ({ ...prev, [c.id]: res.data }))
    } catch {
      setErrorIds((prev) => ({ ...prev, [c.id]: t('cotizaciones.detailError') }))
    } finally {
      setLoadingIds((prev) => { const s = new Set(prev); s.delete(c.id); return s })
    }
  }, [token, t])

  const toggleRow = (c: CotizacionListItem) => {
    if (expandedId === c.id) { setExpandedId(null); return }
    setExpandedId(c.id)
    if (c.id in detalleMap || loadingIds.has(c.id)) return
    fetchDetalle(c)
  }

  const monedaSimbolo = (c: CotizacionListItem | CotizacionDetalle) => c.moneda_cotizacion?.simbolo ?? 'S/'
  const monedaCodigo  = (c: CotizacionListItem | CotizacionDetalle) => c.moneda_cotizacion?.codigo ?? 'PEN'

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-900">
      <header className="shrink-0 flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <FileText className="h-5 w-5 text-[#13A0D8]" aria-hidden />
        <p className="font-bold text-slate-800 dark:text-white flex-1">{t('cotizaciones.title')}</p>
        {!loading && (
          <button
            onClick={onRetry}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#13A0D8] hover:bg-slate-100 transition-colors"
            title={t('cotizaciones.refresh')} aria-label={t('cotizaciones.refreshQuotes')}
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
              <RefreshCw className="h-3.5 w-3.5" /> {t('cotizaciones.retry')}
            </button>
          </div>
        )}
        {!loading && !error && cotizaciones.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#13A0D8]/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#13A0D8]" aria-hidden />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('cotizaciones.emptyTitle')}</p>
            <p className="text-xs text-slate-400 max-w-[220px]">{t('cotizaciones.emptyHint')}</p>
          </div>
        )}

        {!loading && !error && cotizaciones.length > 0 && (
          <ul className="space-y-2">
            {cotizaciones.map((c) => {
              const estadoCodigo = typeof c.estado === 'object' ? c.estado.codigo : String(c.estado)
              const estadoNombre = typeof c.estado === 'object' ? c.estado.nombre : estadoStr(String(c.estado))
              const moneda = c.moneda_cotizacion?.codigo ?? 'PEN'
              const isExpanded = expandedId === c.id
              const detalle = detalleMap[c.id]
              const isDetailLoading = loadingIds.has(c.id)
              const detailError = errorIds[c.id]

              // Resuelve el array de ítems considerando los distintos nombres de campo que puede usar la API
              const items: CotizacionItemDetalle[] =
                detalle?.cotizacion_detalle ??
                detalle?.items ??
                detalle?.lineas ??
                detalle?.lineas_cotizacion ??
                []

              return (
                <li key={c.id}>
                  <div className={`rounded-2xl border overflow-hidden shadow-sm transition-all ${
                    isExpanded
                      ? 'border-[#13A0D8]/40 shadow-md'
                      : 'border-slate-100 dark:border-slate-700'
                  }`}>
                    {/* ── Fila cabecera clickeable ── */}
                    <button
                      type="button"
                      onClick={() => toggleRow(c)}
                      className="w-full text-left bg-white dark:bg-slate-800 p-4 group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{c.numero}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{mcFormatDate(c.fecha_emision, locale)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${estadoClass(estadoCodigo, ESTADO_COTIZACION)}`}>
                            {estadoNombre}
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-all ${
                            isExpanded
                              ? 'rotate-180 text-[#13A0D8]'
                              : 'text-slate-300 group-hover:text-[#13A0D8]'
                          }`} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-xs text-slate-400">
                          {c.fecha_vencimiento
                            ? t('cotizaciones.expiresOn', { date: mcFormatDate(c.fecha_vencimiento, locale) })
                            : t('cotizaciones.noExpiry')}
                        </span>
                        <span className="text-base font-extrabold text-[#13A0D8]">
                          {c.moneda_cotizacion?.simbolo ?? 'S/'}{' '}
                          {mcFormatCurrency(c.total, moneda, locale).replace(/[^0-9.,]/g, '')}
                        </span>
                      </div>
                    </button>

                    {/* ── Panel expandido (accordion) ── */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50">
                        {isDetailLoading && (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
                          </div>
                        )}
                        {detailError && (
                          <div className="flex flex-col items-center py-6 gap-2 text-center px-4">
                            <p className="text-sm text-slate-500">{detailError}</p>
                            <button
                              onClick={() => fetchDetalle(c)}
                              className="text-xs text-[#13A0D8] hover:underline flex items-center gap-1"
                            >
                              <RefreshCw className="h-3 w-3" /> {t('cotizaciones.retry')}
                            </button>
                          </div>
                        )}
                        {!isDetailLoading && !detailError && detalle && (
                          <div className="p-4 space-y-3">
                            {/* Productos */}
                            {items.length > 0 && (
                              <div className="space-y-2">
                                {items.map((item, idx) => {
                                  const nombre =
                                    item.producto_nombre ??
                                    item.descripcion_personalizada ??
                                    item.producto?.nombre ??
                                    item.descripcion ??
                                    t('cotizaciones.productFallback')
                                  const qty = item.cantidad ?? 1
                                  const unidad = item.unidad ?? 'UND'
                                  const unitPrice =
                                    item.precio_unitario_final ??
                                    item.precio_unitario_cliente ??
                                    item.precio_unitario
                                  const itemTotal = item.subtotal ?? item.total

                                  return (
                                    <div
                                      key={item.id ?? idx}
                                      className="flex items-start justify-between gap-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-3"
                                    >
                                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug flex-1 min-w-0">
                                        {nombre}
                                      </p>
                                      <div className="shrink-0 text-right">
                                        <p className="text-xs text-slate-400">
                                          {qty} {unidad} × {mcFormatCurrency(unitPrice, monedaCodigo(detalle), locale)}
                                        </p>
                                        {itemTotal != null && (
                                          <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                                            {mcFormatCurrency(itemTotal, monedaCodigo(detalle), locale)}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}

                            {/* Totales */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-3 space-y-2">
                              {detalle.subtotal != null && (
                                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                  <span>{t('cotizaciones.subtotal')}</span>
                                  <span>{mcFormatCurrency(detalle.subtotal, monedaCodigo(detalle), locale)}</span>
                                </div>
                              )}
                              {detalle.igv != null && (
                                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                  <span>{t('cotizaciones.igv')}</span>
                                  <span>{mcFormatCurrency(detalle.igv, monedaCodigo(detalle), locale)}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold text-slate-800 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-700">
                                <span>{t('cotizaciones.total')}</span>
                                <span className="text-[#13A0D8]">
                                  {monedaSimbolo(detalle)}{' '}
                                  {mcFormatCurrency(detalle.total, monedaCodigo(detalle), locale).replace(/[^0-9.,]/g, '')}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('chatSara')
  const { cliente, token, isLoggedIn, isLoading: authLoading, logout } = useClienteAuth()
  const { currency } = useCurrency()
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
  // En mobile: muestra el panel de conversaciones (true) o el chat (false)
  const [mobileShowConversations, setMobileShowConversations] = useState(!selectedSessionId)

  // ── Nav de cuenta: sección activa (URL) y expansión ──
  const [navExpanded, setNavExpanded] = useState(false)
  const activeSection: ChatSaraSection = useMemo(
    () => getChatSaraSectionFromPathname(pathname),
    [pathname]
  )
  const [pedidos, setPedidos] = useState<PedidoListItem[]>([])
  const [pedidosLoading, setPedidosLoading] = useState(false)
  const [pedidosError, setPedidosError] = useState<string | null>(null)
  const [cotizaciones, setCotizaciones] = useState<CotizacionListItem[]>([])
  const [cotizacionesLoading, setCotizacionesLoading] = useState(false)
  const [cotizacionesError, setCotizacionesError] = useState<string | null>(null)

  const { openAuthModal } = useAuthModal()
  const listRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
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
      .filter(messageHasRenderableContent)
  }, [])

  const visibleChatMessages = useMemo(
    () => messages.filter(messageHasRenderableContent),
    [messages]
  )

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
      setPedidosError(e instanceof Error ? e.message : t('errors.loadPedidos'))
    } finally {
      setPedidosLoading(false)
    }
  }, [cliente?.id, token, t])

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
      setCotizacionesError(e instanceof Error ? e.message : t('errors.loadCotizaciones'))
    } finally {
      setCotizacionesLoading(false)
    }
  }, [cliente?.id, token, t])

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
      const res = await getSaraConversaciones(cliente.id, undefined, token)
      setConversaciones(res.data ?? [])
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('errors.loadConversations'))
    } finally {
      setLoadingList(false)
    }
  }, [cliente?.id, token, t])

  useEffect(() => {
    if (cliente?.id) loadConversaciones()
  }, [cliente?.id, loadConversaciones])

  // Sincronizar session_id con la URL solo en la ruta de chat (no en /pedidos ni /cotizaciones)
  useEffect(() => {
    if (getChatSaraSectionFromPathname(pathname) !== 'chat') return

    if (initialSessionId) {
      setSelectedSessionId(initialSessionId)
      setLoadKey((k) => k + 1)
      return
    }
    const raw = searchParams?.get('session')
    const nextId = raw && raw.trim() ? raw.trim() : null
    setSelectedSessionId(nextId)
    setLoadKey((k) => k + 1)
  }, [initialSessionId, searchParams, pathname])

  const updateUrlForSession = useCallback(
    (sessionId: string | null) => {
      const path = getChatSaraBasePath(locale)
      const href = sessionId ? `${path}?session=${encodeURIComponent(sessionId)}` : path
      router.replace(href, { scroll: false })
    },
    [locale, router]
  )

  useEffect(() => {
    if (activeSection !== 'chat') return
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
    getSaraConversation(selectedSessionId, token)
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
  }, [activeSection, selectedSessionId, loadKey, scrollToBottom, normalizeMessages, token])

  useEffect(() => {
    if (activeSection !== 'chat') return
    if (!selectedSessionId || !isAsesorRespondiendo) return

    let cancelled = false
    const intervalId = window.setInterval(async () => {
      try {
        const res = await getSaraConversation(selectedSessionId, token)
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
  }, [activeSection, selectedSessionId, isAsesorRespondiendo, normalizeMessages, token])

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
    setMobileShowConversations(false)
  }, [updateUrlForSession])

  const borrarHistorialDeSesion = useCallback(
    async (sessionId: string, e?: React.MouseEvent) => {
      e?.stopPropagation()
      const confirmar = window.confirm(t('confirm.deleteHistory'))
      if (!confirmar) return
      try {
        await deleteSaraChatHistory(sessionId, token)
        if (selectedSessionId === sessionId) {
          setMessages([])
          setError(null)
        }
        loadConversaciones()
      } catch {
        setError(t('errors.deleteHistory'))
      }
    },
    [selectedSessionId, loadConversaciones, t, token]
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
    setEditTitle(getConversacionTitle(c, locale, t))
  }, [locale, t])

  const handleSaveRename = useCallback(async (sessionId: string) => {
    if (renameSavingRef.current) return
    const title = editTitle.trim()
    if (!title) { handleCancelRename(); return }
    renameSavingRef.current = true
    setSavingTitle(sessionId)
    try {
      await renameSaraConversacion(sessionId, title, token)
      setConversaciones((prev) =>
        prev.map((c) => (c.session_id === sessionId ? { ...c, titulo: title } : c))
      )
      setEditingSessionId(null)
      setEditTitle('')
    } catch {
      setError(t('errors.saveTitle'))
      setEditingSessionId(null)
      setEditTitle('')
    } finally {
      setSavingTitle(null)
      renameSavingRef.current = false
    }
  }, [editTitle, handleCancelRename, t, token])

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
      setError(t('errors.copyLink'))
    }
  }, [shareUrl, t])

  const addImageFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return
    setError(null)
    const toAdd: { file: File; ct: SaraChatAttachmentContentType }[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ct = file.type as SaraChatAttachmentContentType
      if (!ALLOWED_IMAGE_TYPES_SET.has(ct)) {
        setError(t('errors.attachmentRules', { maxImages: MAX_IMAGES }))
        return
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError(t('errors.imageMaxSize'))
        return
      }
      toAdd.push({ file, ct })
    }
    const currentLen = attachments.length
    const slot = MAX_IMAGES - currentLen
    if (slot <= 0) {
      setError(t('errors.maxImages', { max: MAX_IMAGES }))
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
  }, [attachments.length, t])

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const addDocumentFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return
    setError(null)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ct = file.type as SaraChatDocumentContentType
      if (!ALLOWED_DOCUMENT_TYPES_SET.has(ct)) {
        setError(t('errors.documentRules', { maxDocs: MAX_DOCUMENTS }))
        return
      }
      if (file.size > MAX_DOCUMENT_BYTES) {
        setError(t('errors.documentMaxSize'))
        return
      }
    }
    const slot = MAX_DOCUMENTS - documents.length
    if (slot <= 0) {
      setError(t('errors.maxDocuments', { max: MAX_DOCUMENTS }))
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
  }, [documents.length, t])

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const addFilesFromDrive = useCallback(async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      setError(t('errors.googleDrive'))
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
      setError(e instanceof Error ? e.message : t('errors.driveGeneric'))
    } finally {
      setDriveLoading(false)
    }
  }, [t])

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
    if (hasAttachments) parts.push(t('placeholders.imagesLine', { n: attachments.length }))
    if (hasDocuments) parts.push(t('placeholders.documentsLine', { n: documents.length }))
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
        apiDocuments,
        currency,
        token
      )
      if (res.response?.trim()) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.response }])
      }
      if (res.session_id) {
        const isoNow = new Date().toISOString()
        setConversaciones((prev) =>
          prev.map((row) =>
            row.session_id === res.session_id
              ? {
                  ...row,
                  updated_at: isoNow,
                  ultimo_mensaje: res.response?.trim() || row.ultimo_mensaje,
                  ultimo_mensaje_rol: 'assistant',
                }
              : row
          )
        )
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
                ultimo_mensaje: res.response?.trim() || undefined,
                ultimo_mensaje_rol: 'assistant',
                primer_mensaje: userContent || text || undefined,
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
        ? t('errors.send422')
        : (e instanceof ApiError ? e.message : t('errors.sendGeneric'))
      if (isGatewayErrorBody(msg)) msg = CHAT_GATEWAY_ERROR_MESSAGE
      setError(msg)
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
    } finally {
      setSending(false)
      scrollToBottom()
      window.setTimeout(() => chatInputRef.current?.focus(), 0)
    }
  }, [input, attachments, documents, sending, selectedSessionId, loadConversaciones, scrollToBottom, cliente?.id, updateUrlForSession, t, currency, token])

  /** Envía directamente un mensaje de categoría sin pasar por el input de texto. */
  const sendCategoryMessage = useCallback(async (cat: Categoria) => {
    if (sending) return
    // displayText: lo que ve el usuario en la burbuja
    const displayText = t('categoryPrompt', { name: cat.nombre })
    // apiText: lo que recibe el backend con el id para filtrar correctamente
    const apiText = `${displayText} [categoria_id:${cat.id}]`
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: displayText }])
    setSending(true)
    setActiveChipId(cat.id)
    scrollToBottom()
    try {
      const res = await sendSaraChatMessage(apiText, selectedSessionId ?? undefined, cliente?.id, undefined, undefined, currency, token)
      if (res.response?.trim()) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.response }])
      }
      if (res.session_id) {
        const isoNow = new Date().toISOString()
        setConversaciones((prev) =>
          prev.map((row) =>
            row.session_id === res.session_id
              ? {
                  ...row,
                  updated_at: isoNow,
                  ultimo_mensaje: res.response?.trim() || row.ultimo_mensaje,
                  ultimo_mensaje_rol: 'assistant',
                }
              : row
          )
        )
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
                ultimo_mensaje: res.response?.trim() || undefined,
                ultimo_mensaje_rol: 'assistant',
                primer_mensaje: displayText,
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
        ? t('errors.send422')
        : (e instanceof ApiError ? e.message : t('errors.sendGeneric'))
      if (isGatewayErrorBody(msg)) msg = CHAT_GATEWAY_ERROR_MESSAGE
      setError(msg)
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
    } finally {
      setSending(false)
      setActiveChipId(null)
      scrollToBottom()
      window.setTimeout(() => chatInputRef.current?.focus(), 0)
    }
  }, [sending, selectedSessionId, cliente?.id, loadConversaciones, scrollToBottom, updateUrlForSession, t, currency, token])

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
    <div className="flex h-[calc(100dvh-5rem-3.5rem)] md:h-[calc(100vh-5rem)] w-full min-h-0 bg-white dark:bg-slate-950">

      {/* ── Nav de secciones de cuenta (izquierda, expandible) ── */}
      {isLoggedIn && (
        <nav
          className={`hidden md:flex md:flex-col shrink-0 bg-[#171D4C] border-r border-white/5 py-3 z-10 transition-[width] duration-200 overflow-hidden ${
            navExpanded ? 'w-52' : 'w-14 items-center'
          }`}
          aria-label={t('nav.sectionsAria')}
        >
          {/* Botón toggle expandir/contraer */}
          <div className={`flex mb-3 ${navExpanded ? 'justify-end pr-2' : 'justify-center'}`}>
            <button
              type="button"
              onClick={() => setNavExpanded((v) => !v)}
              aria-label={navExpanded ? t('nav.collapse') : t('nav.expand')}
              title={navExpanded ? t('nav.collapseShort') : t('nav.expandShort')}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/50"
            >
              {navExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          {/* Avatar → Mi Perfil */}
          <Link
            href={`/${locale}/cuenta`}
            title={navExpanded ? undefined : t('nav.myProfile')}
            aria-label={t('nav.viewProfileAria')}
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
                  {cliente?.nombre ?? t('nav.myProfile')}
                </p>
                <p className="text-xs text-white/50 truncate leading-tight">{t('nav.viewProfile')}</p>
              </div>
            )}
          </Link>

          {/* Separador superior */}
          <div className={`h-px bg-white/10 my-2 ${navExpanded ? 'mx-3' : 'w-8'}`} />

          {/* Items de navegación */}
          {(
            [
              { section: 'chat' as const, Icon: MessageSquare, label: t('nav.chatSara'), sublabel: t('nav.chatSaraSub') },
              { section: 'pedidos' as const, Icon: Package, label: t('nav.orders'), sublabel: t('nav.ordersSub') },
              { section: 'cotizaciones' as const, Icon: FileText, label: t('nav.quotes'), sublabel: t('nav.quotesSub') },
            ]
          ).map(({ section, Icon, label, sublabel }) => (
            <Link
              key={section}
              href={getChatSaraHrefForSection(locale, section)}
              aria-label={label}
              aria-current={activeSection === section ? 'page' : undefined}
              title={navExpanded ? undefined : label}
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
            </Link>
          ))}

          {/* Cerrar sesión — anclado al fondo para eliminar espacio vacío */}
          <div className="mt-auto">
            <div className={`h-px bg-white/10 mb-2 ${navExpanded ? 'mx-3' : 'w-8 mx-auto'}`} />
            <button
              type="button"
              aria-label={t('nav.logoutAria')}
              title={navExpanded ? undefined : t('nav.logout')}
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
                <span className="text-sm font-medium">{t('nav.logout')}</span>
              )}
            </button>
          </div>
        </nav>
      )}

      {/* ── Historial de conversaciones (solo con sesión; sin panel vacío / aviso redundante para invitados) ── */}
      {isLoggedIn && (
      <aside
        className={`flex-col flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 overflow-hidden ${
          activeSection !== 'chat'
            ? 'hidden'
            : mobileShowConversations
              ? 'flex w-full md:w-auto md:transition-[width] md:duration-200'
              : 'hidden md:flex md:transition-[width] md:duration-200'
        } ${activeSection === 'chat' ? 'md:w-72' : ''}`}
      >
        {/* Barra superior: título + nueva conversación (sin menú ni volver al inicio) */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 p-2 min-h-[52px]">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate flex-1 min-w-0 px-1">
            {t('sidebar.conversations')}
          </span>
          <button
            type="button"
            onClick={startNewConversation}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#13A0D8] focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/30 transition-colors shrink-0"
            title={t('sidebar.newChat')}
            aria-label={t('sidebar.newChat')}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2 bg-white dark:bg-slate-900">
          {loadingList ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" aria-hidden />
            </div>
          ) : conversaciones.length === 0 ? (
              <div className="text-center py-8 px-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2">
                  <MessageSquarePlus className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('sidebar.noConversations')}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('sidebar.noConversationsHint')}</p>
              </div>
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
                        aria-label={t('sidebar.renameInputAria')}
                      />
                      {savingTitle === c.session_id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400 shrink-0" />
                      ) : (
                        <>
                          <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); handleSaveRename(c.session_id) }}
                            className="p-1 rounded-md text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 focus:outline-none shrink-0"
                            title={t('sidebar.saveName')}
                            aria-label={t('sidebar.saveName')}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); handleCancelRename() }}
                            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none shrink-0"
                            title={t('sidebar.cancel')}
                            aria-label={t('sidebar.cancelAria')}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    /* ── Vista normal ── */
                    <div
                      className={`group relative rounded-xl transition-colors ${
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
                          setMobileShowConversations(false)
                        }}
                        onDoubleClick={(e) => handleStartRename(c, e)}
                        className="w-full min-w-0 text-left py-2.5 pl-3 pr-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#13A0D8]/30"
                      >
                        {(() => {
                          const relativeRight = formatSidebarRelativeRight(c.updated_at, locale, t)
                          const shortDate = formatShortChatDate(c.updated_at, locale)
                          const previewParts = getUltimoMensajePreviewParts(c)
                          const previewTitle =
                            previewParts &&
                            `${previewParts.rol === 'user' ? `${t('sidebar.previewYou')}: ` : previewParts.rol === 'assistant' ? `${t('sidebar.previewSara')}: ` : ''}${previewParts.body}`
                          return (
                            <>
                              {/* Fila 1: título + tiempo relativo pegado a la derecha del ítem (reserva espacio al hover por acciones) */}
                              <div className="flex items-start justify-between gap-2 min-w-0 w-full pr-0 transition-[padding] duration-150 group-hover:pr-[5.25rem] group-focus-within:pr-[5.25rem]">
                                <span className="truncate text-sm font-medium text-left min-w-0 flex-1">
                                  {getConversacionTitle(c, locale, t)}
                                </span>
                                {relativeRight ? (
                                  <span className="text-slate-400 dark:text-slate-500 shrink-0 text-xs tabular-nums leading-snug pt-0.5 text-right ml-2">
                                    {relativeRight}
                                  </span>
                                ) : null}
                              </div>
                              {/* Fila 2: solo si hace ≥7 días (no hay relativo); evita duplicar con "Hace X min" + misma fecha */}
                              {!relativeRight && shortDate ? (
                                <span className="block text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                                  {shortDate}
                                </span>
                              ) : null}
                              {previewParts ? (
                                <span
                                  className="block line-clamp-2 break-words text-xs text-slate-400 dark:text-slate-500 mt-0.5 text-left leading-snug"
                                  title={previewTitle ?? undefined}
                                >
                                  {previewParts.rol === 'user' ? (
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                                      {t('sidebar.previewYou')}:{' '}
                                    </span>
                                  ) : previewParts.rol === 'assistant' ? (
                                    <span className="font-semibold text-[#13A0D8]">
                                      {t('sidebar.previewSara')}:{' '}
                                    </span>
                                  ) : null}
                                  <span className="font-normal">{previewParts.body}</span>
                                </span>
                              ) : null}
                            </>
                          )
                        })()}
                      </button>
                      <div
                        className="absolute right-1 top-1/2 z-10 flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-slate-200/90 bg-white/95 px-0.5 py-0.5 shadow-sm backdrop-blur-sm dark:border-slate-600 dark:bg-slate-800/95 opacity-0 pointer-events-none invisible transition-opacity duration-150 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:visible group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible"
                      >
                          <button
                            type="button"
                            onClick={(e) => handleStartRename(c, e)}
                            className="p-1.5 rounded-md hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#13A0D8]/40"
                            title={t('sidebar.rename')}
                            aria-label={t('sidebar.rename')}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => borrarHistorialDeSesion(c.session_id, e)}
                            className="p-1.5 rounded-md hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#13A0D8]/40"
                            title={t('sidebar.deleteHistory')}
                            aria-label={t('sidebar.deleteHistory')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => openShareModal(c.session_id, e)}
                            className="p-1.5 rounded-md hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#13A0D8]/40"
                            title={t('sidebar.share')}
                            aria-label={t('sidebar.share')}
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      )}

      {/* ── Área principal (chat / pedidos / cotizaciones) ── */}
      <main className={`flex-col min-h-0 overflow-hidden bg-white dark:bg-slate-900 ${
        activeSection === 'chat' && mobileShowConversations && isLoggedIn ? 'hidden md:flex md:flex-1' : 'flex flex-1'
      }`}>

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
            locale={locale}
          />
        )}

        {/* Vista: Chat con Sara (siempre montada para no perder estado, solo oculta) */}
        <div className={activeSection !== 'chat' ? 'hidden' : 'flex-1 flex flex-col min-h-0'}>

        {/* Header */}
        <header className="shrink-0 flex items-center gap-3 px-4 py-3 md:gap-4 md:px-5 md:py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="relative shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-[#13A0D8]/40">
            <Image
              src={BRAND_LOGO}
              alt={t('brand.alt')}
              fill
              className="object-cover object-top"
              unoptimized
            />
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 z-10" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-800 dark:text-white text-base truncate">{t('brand.name')}</p>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden />
              {t('chat.online')}
            </p>
          </div>
        </header>

        {/* ── Categorías (debajo del header, estilo grid circular) ── */}
        {isLoggedIn && categorias.length > 0 && (
          <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 sm:px-5 sm:py-4">
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

        {/* Mensajes: padding uniforme; burbujas a ancho completo del contenedor */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-900 p-4 sm:p-5"
        >
          {!isLoggedIn ? (
            /* ── Pantalla de bienvenida (no autenticado) ── */
            <div className="flex flex-col items-center justify-center h-full px-6 py-8 gap-6">
              {/* Título */}
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#13A0D8] mb-1">{t('welcome.badge')}</p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{t('welcome.title')}</h2>
              </div>

              {/* Desktop: grid con Sara al centro, cards arriba/izquierda/derecha */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto_auto] gap-4 place-items-center">

                {/* Fila 1 */}
                <div />
                {/* Card arriba (centro) */}
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 shadow-sm w-52">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#13A0D8]/10 text-[#13A0D8]">💬</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{t('welcome.cardQuotesHistory')}</p>
                </div>
                <div />

                {/* Fila 2: card izq · Sara · card der */}
                {/* Card izquierda */}
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 shadow-sm w-48 justify-end">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#13A0D8]/10 text-[#13A0D8]">⚡</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{t('welcome.cardFastQuotes')}</p>
                </div>

                {/* Sara */}
                <div className="w-52 h-64 overflow-hidden shrink-0 mx-4 drop-shadow-xl">
                  <Image src="/Sara-señalando.png" alt={t('brand.alt')} width={208} height={256} className="w-full h-full object-contain object-bottom" unoptimized priority />
                </div>

                {/* Card derecha */}
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 shadow-sm w-48">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#13A0D8]/10 text-[#13A0D8]">🕐</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{t('welcome.card247')}</p>
                </div>

                {/* Fila 3: botón centrado */}
                <div />
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="mt-2 w-52 py-3 rounded-xl bg-[#13A0D8] text-white font-semibold text-sm hover:bg-[#0d7ba8] focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/40 transition-colors shadow-sm"
                >
                  {t('welcome.loginCta')}
                </button>
                <div />
              </div>

              {/* Mobile: Sara arriba, cards y botón apilados */}
              <div className="sm:hidden flex flex-col items-center gap-4 w-full max-w-xs">
                <div className="h-52 drop-shadow-xl">
                  <Image src="/Sara-señalando.png" alt={t('brand.alt')} width={176} height={208} className="h-full w-auto object-contain object-bottom" unoptimized priority />
                </div>
                {[
                  { icon: '⚡', title: t('welcome.cardFastQuotes') },
                  { icon: '💬', title: t('welcome.cardQuotesHistory') },
                  { icon: '🕐', title: t('welcome.card247') },
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
                  {t('welcome.loginCta')}
                </button>
              </div>
            </div>
          ) : !selectedSessionId && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center max-w-sm mx-auto px-4 py-6">
              <div className="h-56 sm:h-64 mb-5 drop-shadow-xl">
                <Image
                  src="/Sara-señalando.png"
                  alt={t('brand.alt')}
                  width={220}
                  height={256}
                  className="h-full w-auto object-contain object-bottom"
                  unoptimized
                  priority
                />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('welcome.hello')}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
                {t('welcome.intro')}
              </p>
              <p className="text-[#13A0D8] font-semibold text-sm">
                {t('welcome.hintPrompt')}
              </p>
              <p className="text-slate-400 text-xs mt-1.5">
                {t('welcome.hintCreate')}
              </p>
            </div>
          ) : loadingChat ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-slate-300" aria-hidden />
            </div>
          ) : visibleChatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 min-h-[240px] text-center text-slate-500">
              <p className="text-sm font-medium">{t('welcome.emptyThread')}</p>
              <p className="text-xs mt-1">{t('welcome.emptyThreadHint')}</p>
            </div>
          ) : (
            <div className="w-full space-y-4">
              {visibleChatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`inline-block w-max max-w-[min(100%,42rem)] rounded-2xl px-4 py-3 text-left shadow-sm break-words [overflow-wrap:anywhere] ${
                      msg.role === 'user'
                        ? 'ml-auto bg-[#13A0D8] text-white rounded-br-md'
                        : msg.role === 'asesor'
                          ? 'bg-emerald-50/90 text-emerald-900 rounded-bl-md border border-emerald-100'
                          : error && msg.role === 'assistant' && i === visibleChatMessages.length - 1
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
                            {t('chat.attachedImage')}
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
                            ? t('chat.asesorLabel', { name: msg.asesor_nombre.trim() })
                            : t('chat.teamInxora')}
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
            <div className="flex justify-start w-full mt-2">
              <div className="inline-block w-fit bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm">
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
          <div className="shrink-0 px-4 sm:px-5 mb-2 py-2.5 bg-red-50/90 border border-red-100 text-red-700 text-sm rounded-xl" role="alert">
            {error}
          </div>
        )}

        {/* Input: mismo inset horizontal que el área de mensajes */}
        <div className={`shrink-0 px-4 sm:px-5 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 ${!isLoggedIn ? 'pointer-events-none select-none opacity-40' : ''}`}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            aria-label={t('chat.attachImageAria')}
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
            aria-label={t('chat.attachDocAria')}
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
                    aria-label={t('chat.removeImage')}
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
                    aria-label={t('chat.removeDoc')}
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
                aria-label={t('chat.attachAria')}
                aria-expanded={attachMenuOpen}
                aria-haspopup="true"
                title={t('chat.attachTitle')}
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
                    <span className="flex-1 font-medium">{t('chat.attachImage')}</span>
                    <span className="text-xs text-slate-400">{t('chat.attachImageMax')}</span>
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
                    <span className="flex-1 font-medium">{t('chat.attachDoc')}</span>
                    <span className="text-xs text-slate-400">{t('chat.attachDocTypes')}</span>
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
                    <span className="flex-1 font-medium">{t('chat.drive')}</span>
                  </button>
                </div>
              )}
            </div>
            <textarea
              ref={chatInputRef}
              placeholder={isLoggedIn ? t('chat.placeholder') : t('chat.placeholderLogin')}
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
              aria-label={t('chat.send')}
              title={t('chat.send')}
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
                {t('share.title')}
              </h2>
              <button
                type="button"
                onClick={() => setShareModalSessionId(null)}
                className="shrink-0 p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label={t('share.close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              {t('share.body')}
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
                {urlCopied ? t('share.copied') : t('share.copy')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Navegación inferior móvil (reemplaza el nav lateral en pantallas pequeñas) ── */}
      {isLoggedIn && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#171D4C] flex items-stretch border-t border-white/10">
          {(
            [
              { section: 'chat' as const, Icon: MessageSquare, label: t('mobile.chat') },
              { section: 'pedidos' as const, Icon: Package, label: t('mobile.orders') },
              { section: 'cotizaciones' as const, Icon: FileText, label: t('mobile.quotes') },
            ]
          ).map(({ section, Icon, label }) => (
            <Link
              key={section}
              href={getChatSaraHrefForSection(locale, section)}
              onClick={() => {
                if (section === 'chat') setMobileShowConversations(true)
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors focus:outline-none ${
                activeSection === section ? 'text-[#13A0D8]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
