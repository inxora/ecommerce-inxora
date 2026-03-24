'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Loader2, CreditCard } from 'lucide-react'

declare global {
  interface Window {
    KR?: unknown
  }
}

const IZIPAY_SCRIPT_ID = 'izipay-kr-payment-form-js'
const IZIPAY_THEME_SCRIPT_ID = 'izipay-neon-theme-js'
const IZIPAY_CSS_ID = 'izipay-neon-theme-css'
const IZIPAY_SCRIPT_URL = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
const IZIPAY_THEME_CSS_URL = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/neon.css'
const IZIPAY_THEME_SCRIPT_URL = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/neon.js'

interface KRWindow {
  KR?: {
    onSubmit: (
      cb: (data: {
        // El SDK puede exponer rawClientAnswer (string) o clientAnswer.kr_answer
        rawClientAnswer?: string
        clientAnswer?: { kr_answer: string }
        hash?: string
      }) => boolean | void
    ) => void
    onError: (cb: (err: { errorMessage?: string }) => void) => void
  }
}

export interface IzipayWidgetProps {
  formToken: string | null
  publicKey: string | null
  onPaymentSuccess: (krAnswer: string, krHash: string) => void
  onPaymentError: (msg: string) => void
  loading?: boolean
}

export function IzipayWidget({
  formToken,
  publicKey,
  onPaymentSuccess,
  onPaymentError,
  loading = false,
}: IzipayWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMountedRef = useRef(true)

  // Callbacks estables para React Strict Mode
  const onSuccessRef = useRef(onPaymentSuccess)
  const onErrorRef = useRef(onPaymentError)
  onSuccessRef.current = onPaymentSuccess
  onErrorRef.current = onPaymentError

  const invokeSuccess = useCallback((krAnswer: string, krHash: string) => {
    onSuccessRef.current(krAnswer, krHash)
  }, [])

  const invokeError = useCallback((msg: string) => {
    onErrorRef.current(msg)
  }, [])

  // ── 1. Cargar CSS del tema neon + estilos personalizados INXORA ───────────
  useEffect(() => {
    if (!publicKey || typeof document === 'undefined') return

    if (!document.getElementById(IZIPAY_CSS_ID)) {
      const link = document.createElement('link')
      link.id = IZIPAY_CSS_ID
      link.rel = 'stylesheet'
      link.href = IZIPAY_THEME_CSS_URL
      document.head.appendChild(link)
    }

    const CUSTOM_ID = 'izipay-inxora-custom-theme'
    if (!document.getElementById(CUSTOM_ID)) {
      const s = document.createElement('style')
      s.id = CUSTOM_ID
      s.textContent = [
        /* Variables CSS globales de Krypton — sobrescriben todo desde la raíz */
        ':root{--kr-global-color-primary:#F97316!important;--kr-button-color-background:#F97316!important;--kr-button-color-foreground:#ffffff!important;--kr-field-color-background:#ffffff!important;--kr-field-color-border:#E2E8F0!important;--kr-field-border-radius:10px!important;--kr-global-font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}',
        /* Contenedor principal */
        '.kr-smart-form,.kr-payment-form{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;background:#F8F9FA!important;border-radius:12px!important;padding:0!important;border:none!important;box-shadow:none!important}',
        '.kr-form-content{padding:16px!important}',
        /* Wrappers reales de campos (selector correcto según inspector) */
        '.kr-input-relative-wrapper{background:#fff!important;border:1.5px solid #E2E8F0!important;border-radius:10px!important;margin-bottom:10px!important;overflow:hidden!important;padding:0!important}',
        '.kr-input-relative-wrapper:focus-within{border-color:#F97316!important;box-shadow:0 0 0 3px rgba(249,115,22,.12)!important}',
        /* También los wrappers por tipo que pueden existir */
        '[class*="kr-"][class*="-wrapper"]{background:#fff!important;border:1.5px solid #E2E8F0!important;border-radius:10px!important;margin-bottom:10px!important;overflow:hidden!important}',
        '[class*="kr-"][class*="-wrapper"]:focus-within{border-color:#F97316!important;box-shadow:0 0 0 3px rgba(249,115,22,.12)!important}',
        /* Input real */
        '.kr-input-field{color:#1E293B!important;font-size:14px!important;padding:11px 14px!important;background:transparent!important;border:none!important;width:100%!important}',
        /* Label de tarjetas */
        '.kr-card-list-label,.kr-card-list-header{color:#64748B!important;font-size:11px!important;font-weight:600!important;text-transform:uppercase!important;letter-spacing:.08em!important}',
        /* Errores */
        '.kr-field-error-label,.kr-error-field,.kr-form-error{color:#EF4444!important;font-size:12px!important;margin-top:4px!important;background:transparent!important}',
        '.kr-on-error{border-color:#EF4444!important}',
        '.kr-input-relative-wrapper:has(.kr-on-error){border-color:#EF4444!important;box-shadow:0 0 0 3px rgba(239,68,68,.1)!important}',
        /* Botón — sobrescribir variable + color texto */
        '.kr-payment-button{background:#F97316!important;background-color:#F97316!important;border-color:#F97316!important;border-radius:10px!important;color:#fff!important;font-size:14px!important;font-weight:600!important;padding:13px 20px!important;width:100%!important;cursor:pointer!important;margin-top:6px!important;text-transform:none!important;box-shadow:0 4px 12px rgba(249,115,22,.30)!important}',
        '.kr-payment-button span{color:#fff!important}',
        '.kr-payment-button:hover{background:#EA6C0A!important;background-color:#EA6C0A!important}',
        '.kr-payment-button:active{background:#DC5F00!important;background-color:#DC5F00!important;transform:scale(.99)!important}',
        '.kr-payment-button:disabled{background:#FED7AA!important;background-color:#FED7AA!important;box-shadow:none!important;cursor:not-allowed!important}',
        /* Loading y modal 3DS */
        '.kr-loading-overlay{background:rgba(248,249,250,.85)!important;border-radius:12px!important}',
        '.kr-popin-modal-header{background:#F97316!important;color:#fff!important;border-radius:12px 12px 0 0!important}',
      ].join('')
      document.head.appendChild(s)
    }
  }, [publicKey])

  // ── 2. Registrar eventos KR (cuando SDK ya está cargado o se carga) ────────
  const registerKREvents = useCallback(() => {
    const KR = (window as unknown as KRWindow).KR
    if (!KR?.onSubmit || !KR?.onError) return false

    KR.onSubmit((data) => {
      // rawClientAnswer es el string JSON que necesita el backend para verificar firma
      const krAnswer = data?.rawClientAnswer ?? data?.clientAnswer?.kr_answer ?? ''
      const krHash = data?.hash ?? ''
      if (krAnswer && krHash) {
        invokeSuccess(krAnswer, krHash)
      } else {
        invokeError('Respuesta de pago incompleta.')
      }
      return false
    })

    KR.onError((err) => {
      invokeError(err?.errorMessage ?? 'Error al procesar el pago.')
    })
    return true
  }, [invokeSuccess, invokeError])

  // ── 3. Cargar JS del SDK dinámicamente con useEffect ─────────────────────────
  useEffect(() => {
    if (!publicKey || typeof document === 'undefined') return

    const scriptYaExiste = document.querySelector('script[kr-public-key]')
    const krYaInicializado = typeof window !== 'undefined' && window.KR && window.KR !== false

    if (scriptYaExiste && krYaInicializado) {
      console.log('[IzipayWidget] SDK ya inicializado, registrando callbacks y aplicando formToken')
      // Siempre re-registrar callbacks — cada instancia del widget puede tener
      // handlers distintos (checkout vs página de pago por link de Sara)
      registerKREvents()
      const wrapper = containerRef.current ?? document.querySelector('.kr-smart-form')
      if (wrapper && formToken) {
        wrapper.setAttribute('kr-form-token', formToken)
        console.log('[IzipayWidget] formToken aplicado sobre instancia existente')
      }
      return
    }

    const timeoutIds: ReturnType<typeof setTimeout>[] = []

    const waitForKRAndRegister = (attempts = 0) => {
      if (!isMountedRef.current) return
      if (registerKREvents()) {
        console.log('[IzipayWidget] SDK listo')
        return
      }
      if (attempts < 30) {
        const id = setTimeout(() => waitForKRAndRegister(attempts + 1), 100)
        timeoutIds.push(id)
      } else {
        invokeError('El SDK de Izipay no se inicializó correctamente.')
      }
    }

    // Si el script ya existe, asegurar tema y registrar eventos
    if (document.getElementById(IZIPAY_SCRIPT_ID)) {
      if (!document.getElementById(IZIPAY_THEME_SCRIPT_ID)) {
        const themeScript = document.createElement('script')
        themeScript.id = IZIPAY_THEME_SCRIPT_ID
        themeScript.src = IZIPAY_THEME_SCRIPT_URL
        themeScript.async = true
        document.head.appendChild(themeScript)
      }
      const id0 = setTimeout(() => waitForKRAndRegister(), 100)
      timeoutIds.push(id0)
      return () => {
        timeoutIds.forEach((id) => clearTimeout(id))
      }
    }

    const script = document.createElement('script')
    script.id = IZIPAY_SCRIPT_ID
    script.src = IZIPAY_SCRIPT_URL
    script.setAttribute('kr-public-key', publicKey)
    script.setAttribute('kr-language', 'es-PE')
    script.async = true

    script.onload = () => {
      console.log('[IzipayWidget] script cargado')

      // Cargar JS del tema (classic.js) después del script principal
      if (!document.getElementById(IZIPAY_THEME_SCRIPT_ID)) {
        const themeScript = document.createElement('script')
        themeScript.id = IZIPAY_THEME_SCRIPT_ID
        themeScript.src = IZIPAY_THEME_SCRIPT_URL
        themeScript.async = true
        document.head.appendChild(themeScript)
      }

      const waitForKR = (attempts = 0) => {
        if (!isMountedRef.current) return
        if (registerKREvents()) {
          console.log('[IzipayWidget] SDK listo')
          return
        }
        if (attempts < 30) {
          const id = setTimeout(() => waitForKR(attempts + 1), 100)
          timeoutIds.push(id)
        } else {
          invokeError('El SDK de Izipay no se inicializó correctamente.')
        }
      }

      const id1 = setTimeout(() => waitForKR(), 150)
      timeoutIds.push(id1)
    }

    script.onerror = () => {
      invokeError('Error al cargar el SDK de Izipay.')
    }

    document.head.appendChild(script)

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id))
    }
  }, [publicKey, formToken, registerKREvents])

  // ── 4. Asignar kr-form-token al contenedor cuando esté disponible ─────────
  useEffect(() => {
    isMountedRef.current = true

    if (containerRef.current && formToken) {
      containerRef.current.setAttribute('kr-form-token', formToken)
      console.log('[IzipayWidget] formToken aplicado')
    }

    return () => {
      isMountedRef.current = false
    }
  }, [formToken])

  // ── Placeholder cuando no hay formToken ───────────────────────────────────
  if (!formToken) {
    return (
      <div className="rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-6">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" aria-hidden />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Cargando formulario de pago…
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CreditCard className="w-8 h-8 text-blue-400" aria-hidden />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Preparando formulario seguro…
            </p>
          </div>
        )}
      </div>
    )
  }

  // ── Smart Form: el SDK inyecta el formulario automáticamente ───────────────
  return (
    <div className="rounded-xl overflow-hidden">
      <div
        ref={containerRef}
        className="kr-smart-form"
        data-testid="izipay-smart-form"
      />
    </div>
  )
}