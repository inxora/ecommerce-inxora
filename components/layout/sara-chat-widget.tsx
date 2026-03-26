'use client'

/**
 * Widget de Chat Sara Xora (INXORA).
 * Redirige a la página de chat con Sara. Para usar el chat el usuario debe estar registrado.
 * Solo 2 widgets flotantes: WhatsApp y Sara (logo LOGO-03.png).
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import { MessageSquarePlus, ImagePlus, X, FileText, Paperclip, Cloud, Image as ImageIcon } from 'lucide-react'
import { useClienteAuth } from '@/lib/contexts/cliente-auth-context'
import { useCurrency } from '@/lib/hooks/use-currency'
import {
  sendSaraChatMessage,
  getSaraConversation,
  deleteSaraChatHistory,
  ApiError,
  CHAT_GATEWAY_ERROR_MESSAGE,
  isGatewayErrorBody,
  type SaraChatAttachmentContentType,
  type SaraChatDocumentContentType,
} from '@/lib/services/sara-chat.service'
import { formatPhoneForWhatsApp } from '@/lib/utils'
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

const BRAND = {
  logo: '/LOGO-03.png',
  name: 'INXORA',
  /** Estado vacío: CTA para el primer mensaje. No se crea conversación en backend hasta que el usuario envíe. */
  welcomeText: '¡Hola! Soy **SARA XORA**, tu asistente virtual.',
  emptyStateCta: 'Escribe tu consulta o lo que necesites cotizar.',
  emptyStateHint: 'Puedes preguntar por productos, pedir una cotización o hablar con un asesor. La conversación se inicia al enviar tu primer mensaje.',
  typingText: 'SARA XORA está escribiendo...',
}
const STYLE = {
  primaryColor: '#13A0D8',
  secondaryColor: '#0d7ba8',
  backgroundColor: '#ffffff',
  fontColor: '#333333',
}
const PLACEHOLDER = 'Escribe tu mensaje...'
const CHAT_SESSION_STORAGE_KEY = 'inxora_chat_session_id'
const CHAT_MESSAGES_STORAGE_KEY = 'inxora_chat_messages'

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

const PHONE_REGEX = /(\+?51)?[\s.-]*([9]\d{2})[\s.-]*(\d{3})[\s.-]*(\d{3})\b/g

function linkifyPhonesToWhatsApp(text: string): string {
  return text.replace(PHONE_REGEX, (match) => {
    const digits = match.replace(/\D/g, '')
    const normalized = formatPhoneForWhatsApp(digits).replace('+', '')
    const url = `https://wa.me/${normalized}`
    return `[${match.trim()}](${url})`
  })
}

const IMAGE_PLACEHOLDER_REGEX = /\[Imagen(es)? enviada\(s\)\]|\[\d+ imagen\(es\)\]|\[\d+ documento\(s\)\]/g
function hasImagePlaceholder(content: string): boolean {
  return /\[Imagen(es)? enviada\(s\)\]|\[\d+ imagen\(es\)\]/.test(content)
}
function normalizeOutgoingChatInput(raw: string): string {
  return raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
}
function stripImagePlaceholder(content: string): string {
  return content
    .replace(IMAGE_PLACEHOLDER_REGEX, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const markdownComponents = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="sara-chat-link"
      style={{ color: STYLE.primaryColor, textDecoration: 'underline' }}
      title={href?.startsWith('https://wa.me/') ? 'Abrir en WhatsApp' : undefined}
    >
      {children}
    </a>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <span className="sara-msg-img-wrap">
      <img src={src} alt={alt ?? ''} className="sara-msg-img" />
    </span>
  ),
}

export function SaraChatWidget({ onOpenChange }: { onOpenChange?: (open: boolean) => void } = {}) {
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const locale = pathname.split('/')[1] ?? 'es'
  const { cliente } = useClienteAuth()
  const { currency } = useCurrency()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<PendingAttachment[]>([])
  const [documents, setDocuments] = useState<PendingDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attachMenuOpen, setAttachMenuOpen] = useState(false)
  const [driveLoading, setDriveLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
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

  useEffect(() => {
    onOpenChange?.(open)
  }, [open, onOpenChange])

  // Rehidratar mensajes al montar: primero desde backend (si hay session_id), sino desde sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const sessionId = sessionStorage.getItem(CHAT_SESSION_STORAGE_KEY)
    if (sessionId) {
      getSaraConversation(sessionId)
        .then((res) => {
          const msgs = res?.data?.mensajes
          if (Array.isArray(msgs) && msgs.length > 0) {
            const valid = msgs.filter(
              (m): m is Message =>
                m && typeof m === 'object' && (m.role === 'user' || m.role === 'assistant' || m.role === 'asesor') && typeof m.content === 'string'
            )
            if (valid.length > 0) {
              setMessages(valid)
              sessionStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(valid))
            }
          }
        })
        .catch(() => {
          // Fallback: cargar desde sessionStorage
          const raw = sessionStorage.getItem(CHAT_MESSAGES_STORAGE_KEY)
          if (!raw) return
          try {
            const parsed = JSON.parse(raw) as unknown
            if (Array.isArray(parsed) && parsed.every(m => m && typeof m === 'object' && 'role' in m && 'content' in m)) {
              setMessages(parsed as Message[])
            }
          } catch {
            // ignorar datos corruptos
          }
        })
    } else {
      const raw = sessionStorage.getItem(CHAT_MESSAGES_STORAGE_KEY)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed) && parsed.every(m => m && typeof m === 'object' && 'role' in m && 'content' in m)) {
          setMessages(parsed as Message[])
        }
      } catch {
        // ignorar datos corruptos
      }
    }
  }, [])

  // Persistir mensajes en sessionStorage cuando cambien (solo escribir; no borrar aquí para no pisar la carga inicial)
  useEffect(() => {
    if (typeof window === 'undefined' || messages.length === 0) return
    sessionStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  /** Obtiene session_id desde sessionStorage (cada pestaña tiene el suyo; al recargar se mantiene). */
  const getStoredSessionId = useCallback((): string | null => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(CHAT_SESSION_STORAGE_KEY)
  }, [])

  // Refrescar conversación mientras el chat está abierto (polling) para ver mensajes del asesor en tiempo casi real
  useEffect(() => {
    if (!open) return
    const sessionId = getStoredSessionId()
    if (!sessionId) return
    const POLL_INTERVAL_MS = 7000
    const interval = setInterval(() => {
      getSaraConversation(sessionId)
        .then((res) => {
          const msgs = res?.data?.mensajes
          if (Array.isArray(msgs) && msgs.length > 0) {
            const valid = msgs.filter(
              (m): m is Message =>
                m && typeof m === 'object' && (m.role === 'user' || m.role === 'assistant' || m.role === 'asesor') && typeof m.content === 'string'
            )
            if (valid.length > 0) setMessages(valid)
          }
        })
        .catch(() => {})
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [open, getStoredSessionId])

  const startNewConversation = useCallback(async () => {
    const sessionId = getStoredSessionId()
    const hasHistory = messages.length > 0
    if (hasHistory && sessionId && typeof window !== 'undefined') {
      const confirmar = window.confirm('¿Borrar todo el historial del chat? Podrás seguir chateando con la misma conversación.')
      if (!confirmar) return
      try {
        await deleteSaraChatHistory(sessionId)
      } catch {
        setError('No se pudo borrar el historial. Inténtalo de nuevo.')
        return
      }
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CHAT_MESSAGES_STORAGE_KEY)
      // Mantenemos CHAT_SESSION_STORAGE_KEY si existía; la conversación en backend solo tiene sentido con mensajes
    }
    setMessages([])
    setError(null)
    inputRef.current?.focus()
  }, [messages.length])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [])

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
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              content_type: ct,
              data: base64,
              preview: dataUrl,
            },
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
    if ((!text && !hasAttachments && !hasDocuments) || loading) return

    const apiAttachments =
      attachments.length > 0
        ? attachments.map((a) => ({ content_type: a.content_type, data: a.data }))
        : undefined
    const apiDocuments =
      documents.length > 0
        ? documents.map((d) => ({ content_type: d.content_type, data: d.data }))
        : undefined
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
    setLoading(true)
    scrollToBottom()

    const sid = getStoredSessionId()
    try {
      const res = await sendSaraChatMessage(
        text || '',
        sid ?? undefined,
        cliente?.id,
        apiAttachments,
        apiDocuments,
        currency
      )
      if (res.session_id && typeof window !== 'undefined') {
        sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, res.session_id)
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }])
      scrollToBottom()
    } catch (e) {
      let msg =
        e instanceof ApiError
          ? e.message || 'Error de conexión. Inténtalo de nuevo.'
          : 'No se pudo enviar el mensaje. Inténtalo de nuevo.'
      const is422 = e instanceof ApiError && e.status === 422
      if (is422) msg = 'Solo imágenes (JPEG/PNG/WebP, máx. 5 y 5 MB c/u) y documentos (PDF/Word/Excel, máx. 3 y 10 MB c/u).'
      if (isGatewayErrorBody(msg)) msg = CHAT_GATEWAY_ERROR_MESSAGE
      setError(
        is422
          ? 'Solo imágenes (JPEG/PNG/WebP, máx. 5 y 5 MB c/u) y documentos (PDF/Word/Excel, máx. 3 y 10 MB c/u).'
          : msg
      )
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
      scrollToBottom()
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, attachments, documents, loading, getStoredSessionId, scrollToBottom, cliente?.id])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const hasMessages = messages.length > 0

  return (
    <>
      <style jsx>{`
        .sara-bubble {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: ${STYLE.backgroundColor};
          border: 3px solid ${STYLE.primaryColor};
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          z-index: 999000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: saraBubbleBounce 2.5s infinite ease-in-out;
        }
        .sara-bubble:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        .sara-bubble.hidden {
          display: none !important;
        }
        .sara-bubble :global(img) {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }
        @keyframes saraBubbleBounce {
          0%, 100% { transform: translateY(0); }
          10% { transform: translateY(-7px); }
          20% { transform: translateY(0); }
          25% { transform: scale(1.1); }
          35% { transform: scale(1); }
          70% { box-shadow: 0 0 0 0 rgba(19, 160, 216, 0.4); }
          80% { box-shadow: 0 0 0 8px rgba(19, 160, 216, 0); }
        }
        @media (min-width: 1024px) {
          .sara-bubble {
            width: 80px;
            height: 80px;
          }
          .sara-bubble :global(img) {
            width: 56px;
            height: 56px;
          }
        }
        @media (max-width: 767px) {
          .sara-bubble {
            bottom: 15px;
            right: 15px;
            width: 50px;
            height: 50px;
          }
          .sara-bubble :global(img) {
            width: 32px;
            height: 32px;
          }
        }

        .sara-panel {
          position: fixed;
          bottom: 15px;
          right: 15px;
          width: 360px;
          height: 500px;
          max-height: 90vh;
          background: ${STYLE.backgroundColor};
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          border: 1px solid rgba(0,0,0,0.1);
          z-index: 998999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          animation: saraChatFadeIn 0.3s forwards;
        }
        @keyframes saraChatFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 768px) {
          .sara-panel {
            width: 400px;
            height: 600px;
            max-height: 85vh;
          }
        }
        @media (min-width: 1024px) {
          .sara-panel {
            width: 420px;
            height: 650px;
            max-height: 85vh;
          }
        }
        @media (max-width: 767px) {
          .sara-panel {
            width: 95%;
            right: 2.5%;
            height: 70vh;
            bottom: 10px;
            border-radius: 12px;
          }
        }

        .sara-brand-header {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          background: linear-gradient(135deg, ${STYLE.primaryColor}10, ${STYLE.backgroundColor});
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .sara-brand-header :global(img) {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: contain;
        }
        .sara-brand-header span {
          font-size: 18px;
          color: ${STYLE.fontColor};
          font-weight: 600;
        }
        .sara-close-btn {
          margin-left: auto;
          background: rgba(0,0,0,0.05);
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #333;
          opacity: 0.7;
          transition: all 0.2s;
        }
        .sara-close-btn:hover {
          background: rgba(0,0,0,0.1);
          opacity: 1;
        }
        .sara-new-chat-btn {
          margin-left: auto;
          background: rgba(0,0,0,0.05);
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #333;
          opacity: 0.7;
          transition: all 0.2s;
          margin-right: 8px;
        }
        .sara-new-chat-btn:hover {
          background: rgba(0,0,0,0.1);
          opacity: 1;
        }
        @media (max-width: 767px) {
          .sara-brand-header span { font-size: 16px; }
        }

        .sara-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          overscroll-behavior: contain;
          background: ${STYLE.backgroundColor};
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 767px) {
          .sara-messages { padding: 15px; }
        }

        .sara-msg {
          padding: 12px 16px;
          margin: 4px 0 12px;
          border-radius: 12px;
          max-width: 80%;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
          animation: saraMessageAppear 0.3s ease-out forwards;
        }
        @keyframes saraMessageAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sara-msg.user {
          margin-left: auto;
          background: linear-gradient(135deg, ${STYLE.primaryColor}, ${STYLE.secondaryColor});
          color: white;
          border-radius: 18px 4px 18px 18px;
          box-shadow: 0 2px 8px rgba(19, 160, 216, 0.15);
        }
        .sara-msg.assistant {
          background: #f8f8f8;
          color: ${STYLE.fontColor};
          border-radius: 4px 18px 18px 18px;
          border: 1px solid rgba(0,0,0,0.08);
          max-width: 85%;
        }
        .sara-msg.sara-empty-state {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sara-msg.sara-empty-state .sara-empty-cta {
          margin: 0;
          font-weight: 600;
          color: ${STYLE.primaryColor};
          font-size: 14px;
        }
        .sara-msg.sara-empty-state .sara-empty-hint {
          margin: 0;
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }
        .sara-msg.asesor {
          background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
          color: #1b5e20;
          border-radius: 4px 18px 18px 18px;
          border: 1px solid rgba(30, 120, 60, 0.25);
          max-width: 85%;
        }
        .sara-msg.asesor :global(.sara-asesor-label) {
          display: block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          color: #2e7d32;
        }
        .sara-msg.error {
          background: #fef2f2;
          border-color: #fecaca;
          color: #991b1b;
        }
        .sara-user-images {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 8px;
        }
        .sara-user-img-wrap {
          display: inline-block;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.3);
          max-width: 80px;
          max-height: 80px;
        }
        .sara-user-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          max-width: 80px;
          max-height: 80px;
          display: block;
        }
        .sara-user-image-placeholder {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          opacity: 0.95;
        }
        .sara-user-text-block {
          display: block;
          margin-top: 4px;
        }
        .sara-msg.user .sara-user-text,
        .sara-msg.user .sara-user-text-block {
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .sara-msg-img-wrap {
          display: inline-block;
          max-width: 200px;
          max-height: 200px;
          border-radius: 8px;
          overflow: hidden;
          margin: 4px 0;
        }
        .sara-msg-img {
          max-width: 100%;
          max-height: 200px;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }
        .sara-msg :global(.sara-chat-link) {
          color: ${STYLE.primaryColor};
          text-decoration: underline;
        }
        .sara-msg :global(.sara-chat-link:hover) {
          text-decoration: none;
        }

        .sara-typing {
          color: #666;
          font-style: italic;
          font-size: 14px;
          padding: 10px 16px;
          background: #f0f0f0;
          border-radius: 4px 18px 18px 18px;
          margin-bottom: 12px;
          max-width: 85%;
          animation: saraPulse 1.5s infinite ease-in-out;
        }
        @keyframes saraPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .sara-input-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px 16px;
          border-top: 1px solid rgba(0,0,0,0.05);
          background: ${STYLE.backgroundColor};
        }
        .sara-file-input {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
          pointer-events: none;
        }
        .sara-attachments {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .sara-attachment-thumb {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e0e0e0;
          flex-shrink: 0;
        }
        .sara-attachment-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .sara-attachment-remove {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 50%;
          background: rgba(0,0,0,0.6);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .sara-attachment-remove:hover {
          background: rgba(0,0,0,0.8);
        }
        .sara-documents {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sara-document-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: #f5f5f5;
          border-radius: 8px;
          font-size: 12px;
        }
        .sara-document-name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sara-document-size {
          color: #666;
          flex-shrink: 0;
        }
        .sara-input-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sara-attach-btn {
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: #fff;
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s, color 0.2s;
        }
        .sara-attach-btn:hover:not(:disabled) {
          border-color: ${STYLE.primaryColor};
          color: ${STYLE.primaryColor};
        }
        .sara-attach-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .sara-attach-wrap {
          position: relative;
        }
        .sara-attach-menu {
          position: absolute;
          bottom: 100%;
          left: 0;
          margin-bottom: 6px;
          min-width: 220px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          padding: 6px;
          z-index: 10;
        }
        .sara-attach-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border: none;
          border-radius: 8px;
          background: none;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .sara-attach-menu-item:hover:not(:disabled) {
          background: #f3f4f6;
        }
        .sara-attach-menu-item:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .sara-attach-menu-label {
          flex: 1;
          min-width: 0;
        }
        .sara-attach-menu-hint {
          flex-shrink: 0;
          font-size: 11px;
          color: #9ca3af;
        }
        .sara-input-wrap :global(.sara-input-row textarea) {
          flex: 1;
          min-height: 42px;
          max-height: 120px;
          padding: 10px 14px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 14px;
          resize: none;
          font-family: inherit;
          line-height: 1.4;
          transition: border 0.3s ease;
        }
        .sara-input-wrap :global(.sara-input-row textarea:focus) {
          outline: none;
          border-color: ${STYLE.primaryColor};
          box-shadow: 0 0 0 2px ${STYLE.primaryColor}20;
        }
        @media (max-width: 767px) {
          .sara-input-wrap :global(.sara-input-row textarea) { font-size: 16px; }
        }
        .sara-send-btn {
          height: 42px;
          min-width: 80px;
          padding: 0 16px;
          background: ${STYLE.primaryColor};
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }
        .sara-send-btn:hover:not(:disabled) {
          background: ${STYLE.secondaryColor};
        }
        .sara-send-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <button
        type="button"
        className="sara-bubble"
        aria-label="Ir al chat con Sara Xora (requiere registrarse)"
        onClick={() => router.push(`/${locale}/cuenta/chat-sara`)}
      >
        <Image src={BRAND.logo} alt="SARA XORA - Asistente virtual de INXORA" width={48} height={48} unoptimized />
      </button>

      {open && (
        <div className="sara-panel" role="dialog" aria-label="Chat Sara Xora">
          <div className="sara-brand-header">
            <Image src={BRAND.logo} alt={BRAND.name} width={40} height={40} unoptimized />
            <span>{BRAND.name}</span>
            <button
              type="button"
              className="sara-new-chat-btn"
              aria-label="Limpiar chat y empezar de nuevo"
              title="Limpiar chat y empezar de nuevo"
              onClick={startNewConversation}
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>
            <button type="button" className="sara-close-btn" aria-label="Cerrar chat" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="sara-messages" ref={listRef}>
            {!hasMessages && (
              <div className="sara-msg assistant sara-empty-state">
                <ReactMarkdown components={markdownComponents}>{BRAND.welcomeText}</ReactMarkdown>
                <p className="sara-empty-cta">{BRAND.emptyStateCta}</p>
                <p className="sara-empty-hint">{BRAND.emptyStateHint}</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`sara-msg ${msg.role} ${error && msg.role === 'assistant' && i === messages.length - 1 ? 'error' : ''}`}
              >
                {msg.role === 'user' ? (
                  <>
                    {msg.attachmentPreviews && msg.attachmentPreviews.length > 0 && (
                      <div className="sara-user-images">
                        {msg.attachmentPreviews.map((src, j) => (
                          <span key={j} className="sara-user-img-wrap">
                            <img src={src} alt="" className="sara-user-img" />
                          </span>
                        ))}
                      </div>
                    )}
                    {!msg.attachmentPreviews?.length && hasImagePlaceholder(msg.content) && (
                      <span className="sara-user-image-placeholder">
                        <ImageIcon className="w-4 h-4 shrink-0" aria-hidden />
                        Imagen adjunta
                      </span>
                    )}
                    {(stripImagePlaceholder(msg.content) || (!msg.attachmentPreviews?.length && !hasImagePlaceholder(msg.content))) && (
                      <span
                        className={`sara-user-text ${msg.attachmentPreviews?.length || hasImagePlaceholder(msg.content) ? 'sara-user-text-block' : ''}`}
                      >
                        {msg.attachmentPreviews?.length || hasImagePlaceholder(msg.content) ? stripImagePlaceholder(msg.content) : msg.content}
                      </span>
                    )}
                  </>
                ) : msg.role === 'asesor' ? (
                  <>
                    <span className="sara-asesor-label">Equipo Inxora</span>
                    <ReactMarkdown components={markdownComponents}>
                      {linkifyPhonesToWhatsApp(msg.content)}
                    </ReactMarkdown>
                  </>
                ) : (
                  <ReactMarkdown components={markdownComponents}>
                    {linkifyPhonesToWhatsApp(msg.content)}
                  </ReactMarkdown>
                )}
              </div>
            ))}
            {loading && <div className="sara-typing">{BRAND.typingText}</div>}
          </div>

          <div className="sara-input-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sara-file-input"
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
              className="sara-file-input"
              aria-label="Adjuntar documento"
              onChange={(e) => {
                addDocumentFiles(e.target.files)
                e.target.value = ''
              }}
            />
            {attachments.length > 0 && (
              <div className="sara-attachments">
                {attachments.map((a) => (
                  <div key={a.id} className="sara-attachment-thumb">
                    <img src={a.preview} alt="" />
                    <button
                      type="button"
                      className="sara-attachment-remove"
                      aria-label="Quitar imagen"
                      onClick={() => removeAttachment(a.id)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {documents.length > 0 && (
              <div className="sara-documents">
                {documents.map((d) => (
                  <div key={d.id} className="sara-document-item">
                    <FileText className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="sara-document-name" title={d.name}>{d.name}</span>
                    <span className="sara-document-size">{(d.size / 1024).toFixed(1)} KB</span>
                    <button
                      type="button"
                      className="sara-attachment-remove"
                      aria-label="Quitar documento"
                      onClick={() => removeDocument(d.id)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="sara-input-row" ref={attachMenuRef}>
              <div className="sara-attach-wrap">
                <button
                  type="button"
                  className="sara-attach-btn"
                  aria-label="Adjuntar"
                  aria-expanded={attachMenuOpen}
                  aria-haspopup="true"
                  title="Adjuntar imagen o documento"
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation()
                    setAttachMenuOpen((v) => !v)
                  }}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                {attachMenuOpen && (
                  <div className="sara-attach-menu" role="menu">
                    <button
                      type="button"
                      role="menuitem"
                      className="sara-attach-menu-item"
                      disabled={attachments.length >= MAX_IMAGES}
                      onClick={(e) => {
                        e.stopPropagation()
                        setAttachMenuOpen(false)
                        fileInputRef.current?.click()
                      }}
                    >
                      <ImagePlus className="w-4 h-4" />
                      <span className="sara-attach-menu-label">Imagen</span>
                      <span className="sara-attach-menu-hint">máx. 5, 5 MB c/u</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="sara-attach-menu-item"
                      disabled={documents.length >= MAX_DOCUMENTS}
                      onClick={(e) => {
                        e.stopPropagation()
                        setAttachMenuOpen(false)
                        fileInputDocRef.current?.click()
                      }}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="sara-attach-menu-label">Documento</span>
                      <span className="sara-attach-menu-hint">PDF, Word, Excel</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="sara-attach-menu-item"
                      disabled={driveLoading || (attachments.length >= MAX_IMAGES && documents.length >= MAX_DOCUMENTS)}
                      onClick={(e) => {
                        e.stopPropagation()
                        addFilesFromDrive()
                      }}
                    >
                      <Cloud className="w-4 h-4" />
                      <span className="sara-attach-menu-label">Desde Google Drive</span>
                      <span className="sara-attach-menu-hint">imágenes o documentos</span>
                    </button>
                  </div>
                )}
              </div>
              <textarea
                ref={inputRef}
                placeholder={PLACEHOLDER}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
                aria-label="Mensaje"
              />
              <button
                type="button"
                className="sara-send-btn"
                onClick={sendMessage}
                disabled={loading || (!input.trim() && attachments.length === 0 && documents.length === 0)}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
