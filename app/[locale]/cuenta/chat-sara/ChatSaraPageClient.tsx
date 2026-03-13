'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { MessageSquarePlus, ArrowLeft, Loader2, Trash2, ImagePlus, X, Share2, FileText, Paperclip, Cloud, Image as ImageIcon, Send, Menu } from 'lucide-react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import {
  getSaraConversaciones,
  getSaraConversation,
  sendSaraChatMessage,
  deleteSaraChatHistory,
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
import { ChatAuthModal } from '@/components/auth/chat-auth-modal'
import {
  getDriveAccessToken,
  openDrivePicker,
  downloadDriveFileAsBase64,
} from '@/lib/google-drive-picker'

type Message = {
  role: 'user' | 'assistant' | 'asesor'
  content: string
  attachmentPreviews?: string[]
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
function stripImagePlaceholder(content: string): string {
  return content.replace(IMAGE_PLACEHOLDER_REGEX, '').replace(/\s{2,}/g, ' ').trim()
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
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

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [])

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
        setTimeout(() => scrollToBottom(), 80)
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingChat(false))
  }, [selectedSessionId, loadKey, scrollToBottom])

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

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full min-h-0 bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`flex flex-col flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-[width] duration-200 overflow-hidden ${
          sidebarCollapsed ? 'w-14 lg:w-14' : 'w-full lg:w-72'
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
        <div className="flex-1 overflow-y-auto py-2">
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
                  onClick={() => setAuthModalOpen(true)}
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
                      className={`flex-1 min-w-0 text-left py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#13A0D8]/30 ${
                        sidebarCollapsed ? 'px-2 flex justify-center' : 'px-3'
                      }`}
                    >
                      {sidebarCollapsed ? (
                        <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                          {(c.lead_json?.razon_social || c.lead_json?.nombre_contacto || 'C').slice(0, 1)}
                        </span>
                      ) : (
                        <>
                          <span className="block truncate text-sm font-medium">
                            {c.lead_json?.razon_social || c.lead_json?.nombre_contacto || 'Conversación'}
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Área de chat */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-slate-900">
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
                <div className="w-52 h-64 rounded-2xl overflow-hidden ring-2 ring-[#13A0D8]/30 shadow-xl shrink-0 mx-4">
                  <Image src="/sara-pose2.png" alt="Sara Xora" width={208} height={256} className="w-full h-full object-cover object-center" unoptimized priority />
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
                  onClick={() => setAuthModalOpen(true)}
                  className="mt-2 w-52 py-3 rounded-xl bg-[#13A0D8] text-white font-semibold text-sm hover:bg-[#0d7ba8] focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/40 transition-colors shadow-sm"
                >
                  Iniciar sesión / Registrarse
                </button>
                <div />
              </div>

              {/* Mobile: Sara arriba, cards y botón apilados */}
              <div className="sm:hidden flex flex-col items-center gap-4 w-full max-w-xs">
                <div className="w-44 h-56 rounded-2xl overflow-hidden ring-2 ring-[#13A0D8]/30 shadow-xl">
                  <Image src="/sara-pose2.png" alt="Sara Xora" width={176} height={224} className="w-full h-full object-cover object-center" unoptimized priority />
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
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-[#13A0D8] text-white font-semibold text-sm hover:bg-[#0d7ba8] focus:outline-none focus:ring-2 focus:ring-[#13A0D8]/40 transition-colors shadow-sm"
                >
                  Iniciar sesión / Registrarse
                </button>
              </div>
            </div>
          ) : !selectedSessionId && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center max-w-sm mx-auto px-4 py-6">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-6 ring-1 ring-slate-100 dark:ring-slate-700">
                <Image src={BRAND.logo} alt="" width={40} height={40} unoptimized className="rounded-xl" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">Hola, soy Sara</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                Tu asistente de INXORA. Pregúntame por productos, cotizaciones o envíos.
              </p>
              <p className="text-[#13A0D8] font-medium text-sm">
                Escribe tu consulta o lo que necesites cotizar.
              </p>
              <p className="text-slate-400 text-xs mt-2">
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
                          <span className={msg.attachmentPreviews?.length || hasImagePlaceholder(msg.content) ? 'block mt-1' : ''}>
                            {msg.attachmentPreviews?.length || hasImagePlaceholder(msg.content) ? stripImagePlaceholder(msg.content) : msg.content}
                          </span>
                        )}
                      </>
                    ) : msg.role === 'asesor' ? (
                      <>
                        <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5">
                          Equipo Inxora
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
      </main>

      {/* Modal auth */}
      {authModalOpen && (
        <ChatAuthModal open={authModalOpen} locale={locale} onClose={() => setAuthModalOpen(false)} />
      )}

      {/* Modal compartir: estilo Gemini */}
      {shareModalSessionId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setShareModalSessionId(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="share-modal-title" className="text-lg font-semibold text-slate-800">
                Compartir conversación
              </h2>
              <button
                type="button"
                onClick={() => setShareModalSessionId(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              Cualquiera con el enlace podrá ver esta conversación (debe tener cuenta).
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 truncate focus:outline-none"
              />
              <Button
                onClick={copyShareUrl}
                className="bg-[#13A0D8] hover:bg-[#0d7ba8] shrink-0 rounded-xl font-medium shadow-sm"
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
