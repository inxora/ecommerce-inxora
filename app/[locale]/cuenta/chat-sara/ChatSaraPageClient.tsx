'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { MessageSquarePlus, ArrowLeft, Loader2, Trash2, ImagePlus, X, Share2, FileText, Paperclip, Cloud } from 'lucide-react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import {
  getSaraConversaciones,
  getSaraConversation,
  sendSaraChatMessage,
  deleteSaraChatHistory,
  ApiError,
} from '@/lib/services/sara-chat.service'
import type {
  SaraConversacionItem,
  SaraChatAttachmentContentType,
  SaraChatDocumentContentType,
} from '@/lib/services/sara-chat.service'
import { formatPhoneForWhatsApp } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  getDriveAccessToken,
  openDrivePicker,
  downloadDriveFileAsBase64,
} from '@/lib/google-drive-picker'

type Message = { role: 'user' | 'assistant' | 'asesor'; content: string }

const BRAND = { logo: '/Sara Xora - IA.png', name: 'SARA XORA', typingText: 'Sara está escribiendo...' }
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

export function ChatSaraPageClient({
  locale,
  initialSessionId,
}: {
  locale: string
  /** Cuando se abre desde /chat-sara/share/[sessionId], pre-selecciona esta conversación */
  initialSessionId?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cliente, isLoggedIn, isLoading: authLoading } = useClienteAuth()
  const [conversaciones, setConversaciones] = useState<SaraConversacionItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(initialSessionId ?? null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingChat, setLoadingChat] = useState(false)
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<PendingAttachment[]>([])
  const [documents, setDocuments] = useState<PendingDocument[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareModalSessionId, setShareModalSessionId] = useState<string | null>(null)
  const [urlCopied, setUrlCopied] = useState(false)
  const [attachMenuOpen, setAttachMenuOpen] = useState(false)
  const [driveLoading, setDriveLoading] = useState(false)
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
  /** Evitar que el efecto de "cargar mensajes al cambiar sesión" sobrescriba los mensajes recién enviados */
  const skipLoadMessagesRef = useRef(false)
  /** Al hacer clic en una conversación siempre cargamos; si es la misma sesión el efecto no se dispara, así que forzamos con loadKey */
  const [loadKey, setLoadKey] = useState(0)

  // Redirigir si no está logueado
  useEffect(() => {
    if (authLoading) return
    if (!isLoggedIn) {
      router.replace(`/${locale}/login?redirect=/${locale}/cuenta/chat-sara`)
    }
  }, [isLoggedIn, authLoading, router, locale])

  // Cargar lista de conversaciones
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

  // Abrir conversación desde URL de compartir: ?session=xxx (cuenta) o initialSessionId (ruta /chat-sara/share/xxx)
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

  // Al seleccionar una conversación, cargar mensajes (salvo si acabamos de enviar y ya tenemos los mensajes en estado)
  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([])
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
        let raw = res?.data?.mensajes
        if (typeof raw === 'string') {
          try {
            raw = JSON.parse(raw) as Message[]
          } catch {
            raw = []
          }
        }
        const msgs = Array.isArray(raw) ? raw : []
        setMessages(
          msgs.filter(
            (m): m is Message =>
              m?.role === 'user' || m?.role === 'assistant' || m?.role === 'asesor'
          ) as Message[]
        )
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingChat(false))
  }, [selectedSessionId, loadKey])

  // Refrescar conversación mientras hay una sesión seleccionada (polling) para ver mensajes del asesor en tiempo casi real
  useEffect(() => {
    if (!selectedSessionId) return
    const POLL_INTERVAL_MS = 7000
    const interval = setInterval(() => {
      getSaraConversation(selectedSessionId)
        .then((res) => {
          let raw = res?.data?.mensajes
          if (typeof raw === 'string') {
            try {
              raw = JSON.parse(raw) as Message[]
            } catch {
              raw = []
            }
          }
          const msgs = Array.isArray(raw) ? raw : []
          setMessages(
            msgs.filter(
              (m): m is Message =>
                m?.role === 'user' || m?.role === 'assistant' || m?.role === 'asesor'
            ) as Message[]
          )
        })
        .catch(() => {})
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [selectedSessionId])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const startNewConversation = useCallback(async () => {
    const sessionId = selectedSessionId
    const hasHistory = messages.length > 0
    if (hasHistory && sessionId) {
      const confirmar = window.confirm(
        '¿Borrar todo el historial y empezar una nueva conversación?'
      )
      if (!confirmar) return
      try {
        await deleteSaraChatHistory(sessionId)
      } catch {
        setError('No se pudo borrar el historial. Inténtalo de nuevo.')
        return
      }
    }
    setSelectedSessionId(null)
    setMessages([])
    setInput('')
    setError(null)
  }, [selectedSessionId, messages.length])

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
    const text = input.trim()
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
    const userContent = parts.length ? parts.join(' ') : ''

    setInput('')
    setAttachments([])
    setDocuments([])
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: userContent }])
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
      }
      if (!selectedSessionId) loadConversaciones()
    } catch (e) {
      const is422 = e instanceof ApiError && e.status === 422
      const msg = is422
        ? 'Solo imágenes (JPEG/PNG/WebP, máx. 5 y 5 MB c/u) y documentos (PDF/Word/Excel, máx. 3 y 10 MB c/u).'
        : (e instanceof ApiError ? e.message : 'Error al enviar. Inténtalo de nuevo.')
      setError(msg)
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
    } finally {
      setSending(false)
      scrollToBottom()
    }
  }, [input, attachments, documents, sending, selectedSessionId, loadConversaciones, scrollToBottom, cliente?.id])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatDate = (s: string | null) => {
    if (!s) return ''
    try {
      const d = new Date(s)
      return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return s
    }
  }

  if (authLoading || !isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#13A0D8]" />
      </div>
    )
  }

  // Altura = 100vh menos el header (~5rem); diseño más amigable
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] w-full min-h-0 bg-gradient-to-br from-slate-50/80 to-blue-50/30">
      {/* Sidebar: lista de conversaciones */}
      <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200/80 bg-white/90 lg:rounded-r-2xl lg:shadow-sm flex-shrink-0 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
          <Link
            href={`/${locale}`}
            className="text-sm text-slate-600 hover:text-[#13A0D8] flex items-center gap-1.5 transition-colors rounded-lg px-2 py-1 -ml-1 hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={startNewConversation}
            className="flex items-center gap-1.5 rounded-full border-[#13A0D8]/40 text-[#13A0D8] hover:bg-[#13A0D8]/10 hover:border-[#13A0D8]"
          >
            <MessageSquarePlus className="h-4 w-4" /> Nueva
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 mb-2">Tus conversaciones</p>
          {loadingList ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-7 w-7 animate-spin text-[#13A0D8]" />
            </div>
          ) : conversaciones.length === 0 ? (
            <div className="text-center py-6 px-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <MessageSquarePlus className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">Aún no tienes conversaciones.</p>
              <p className="text-xs text-slate-400 mt-1">Pulsa &quot;Nueva&quot; y escribe abajo para empezar.</p>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {conversaciones.map((c) => (
                <li key={c.session_id}>
                  <div
                    className={`group relative flex items-center gap-1 rounded-xl text-sm transition-all duration-200 ${
                      selectedSessionId === c.session_id
                        ? 'bg-[#13A0D8] text-white shadow-md shadow-[#13A0D8]/20'
                        : 'hover:bg-slate-100 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setLoadKey((k) => k + 1)
                        setSelectedSessionId(c.session_id)
                      }}
                      className="flex-1 min-w-0 text-left px-3 py-2.5 rounded-xl"
                    >
                      <span className="block truncate font-medium">
                        {c.lead_json?.razon_social || c.lead_json?.nombre_contacto || 'Conversación'}
                      </span>
                      <span className="block truncate text-xs opacity-80 mt-0.5">
                        {formatDate(c.updated_at)} · {c.estado}
                      </span>
                    </button>
                    <div className={`flex items-center pr-1 shrink-0 transition-opacity ${selectedSessionId === c.session_id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <button
                        type="button"
                        onClick={(e) => borrarHistorialDeSesion(c.session_id, e)}
                        className="p-1.5 rounded-lg hover:bg-black/10 text-current transition-colors"
                        title="Borrar historial"
                        aria-label="Borrar historial"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => openShareModal(c.session_id, e)}
                        className="p-1.5 rounded-lg hover:bg-black/10 text-current transition-colors"
                        title="Compartir conversación"
                        aria-label="Compartir conversación"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Área de chat */}
      <main className="flex-1 flex flex-col min-h-0 bg-white/70 backdrop-blur-sm lg:rounded-l-2xl lg:shadow-sm border border-slate-200/50 overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4 flex items-center gap-3 bg-white/80">
          <div className="relative">
            <Image src={BRAND.logo} alt={BRAND.name} width={40} height={40} unoptimized className="rounded-xl" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" title="En línea" />
          </div>
          <div>
            <span className="font-semibold text-slate-800">{BRAND.name}</span>
            <p className="text-xs text-slate-500">Tu asistente · En línea</p>
          </div>
        </div>
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-white/50 to-transparent"
        >
          {!selectedSessionId && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto px-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#13A0D8]/20 to-[#13A0D8]/5 flex items-center justify-center mb-5 shadow-inner">
                <Image src={BRAND.logo} alt="" width={48} height={48} unoptimized className="opacity-90" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-1">¡Hola! Soy Sara</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Tu asistente de INXORA. Pregúntame por productos, cotizaciones, envíos o lo que necesites.
              </p>
              <p className="text-slate-400 text-sm">
                Selecciona una conversación a la izquierda o escribe abajo para empezar una nueva.
              </p>
            </div>
          ) : loadingChat ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#13A0D8]" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center text-slate-500 py-12">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <MessageSquarePlus className="h-7 w-7 text-slate-400" />
              </div>
              <p className="font-medium">No hay mensajes en esta conversación.</p>
              <p className="text-sm mt-1">Escribe algo y envíalo para comenzar.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#13A0D8] text-white rounded-br-md'
                      : msg.role === 'asesor'
                        ? 'bg-emerald-50 text-emerald-900 rounded-bl-md border border-emerald-200/80'
                        : 'bg-white text-slate-800 rounded-bl-md border border-slate-200/80'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : msg.role === 'asesor' ? (
                    <>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-1">
                        Equipo Inxora
                      </span>
                      <ReactMarkdown
                        components={{
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                              style={{ color: STYLE.primary }}
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {linkifyPhones(msg.content)}
                      </ReactMarkdown>
                    </>
                  ) : (
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                            style={{ color: STYLE.primary }}
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {linkifyPhones(msg.content)}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))
          )}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm italic text-slate-500 shadow-sm">
                {BRAND.typingText}
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="mx-4 mb-2 px-4 py-2.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}
        <div className="p-4 border-t border-slate-100 bg-white/80 flex flex-col gap-3">
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
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-1">
              {attachments.map((a) => (
                <div key={a.id} className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                  <img src={a.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    aria-label="Quitar imagen"
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    onClick={() => removeAttachment(a.id)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {documents.length > 0 && (
            <div className="flex flex-col gap-1.5 px-1">
              {documents.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                >
                  <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="flex-1 min-w-0 truncate" title={d.name}>
                    {d.name}
                  </span>
                  <span className="text-slate-500 text-xs shrink-0">{(d.size / 1024).toFixed(1)} KB</span>
                  <button
                    type="button"
                    aria-label="Quitar documento"
                    className="p-1 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                    onClick={() => removeDocument(d.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-end" ref={attachMenuRef}>
            <div className="relative shrink-0">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#13A0D8] hover:border-[#13A0D8]/30"
                aria-label="Adjuntar"
                aria-expanded={attachMenuOpen}
                aria-haspopup="true"
                title="Adjuntar imagen o documento"
                disabled={sending}
                onClick={(e) => {
                  e.stopPropagation()
                  setAttachMenuOpen((v) => !v)
                }}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              {attachMenuOpen && (
                <div
                  className="absolute bottom-full left-0 mb-2 min-w-[240px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-10"
                  role="menu"
                >
                  <button
                    type="button"
                    role="menuitem"
                    disabled={attachments.length >= MAX_IMAGES}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation()
                      setAttachMenuOpen(false)
                      fileInputRef.current?.click()
                    }}
                  >
                    <ImagePlus className="h-5 w-5 text-slate-500 shrink-0" />
                    <span className="flex-1 font-medium">Imagen</span>
                    <span className="text-xs text-slate-400">máx. 5, 5 MB c/u</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={documents.length >= MAX_DOCUMENTS}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation()
                      addFilesFromDrive()
                    }}
                  >
                    <Cloud className="h-5 w-5 text-slate-500 shrink-0" />
                    <span className="flex-1 font-medium">Desde Google Drive</span>
                    <span className="text-xs text-slate-400">imágenes o documentos</span>
                  </button>
                </div>
              )}
            </div>
            <textarea
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              className="flex-1 min-h-[44px] max-h-32 px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/30 focus:border-[#13A0D8] placeholder:text-slate-400 text-slate-800"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={sending || (!input.trim() && attachments.length === 0 && documents.length === 0)}
              className="bg-[#13A0D8] hover:bg-[#0d7ba8] shrink-0 h-11 px-5 rounded-xl font-medium shadow-sm"
            >
              Enviar
            </Button>
          </div>
        </div>
      </main>

      {/* Modal compartir: copiar URL */}
      {shareModalSessionId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShareModalSessionId(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="share-modal-title" className="text-lg font-semibold text-slate-800">
                Compartir conversación
              </h2>
              <button
                type="button"
                onClick={() => setShareModalSessionId(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-2">
              Cualquiera con el enlace podrá ver esta conversación (debe tener cuenta).
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 truncate"
              />
              <Button
                onClick={copyShareUrl}
                className="bg-[#13A0D8] hover:bg-[#0d7ba8] shrink-0 rounded-xl"
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
