'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Loader2, CreditCard } from 'lucide-react'

declare global {
  interface Window {
    KR?: unknown
  }
}

const IZIPAY_SCRIPT_ID = 'izipay-kr-payment-form-js'
const IZIPAY_THEME_SCRIPT_ID = 'izipay-classic-theme-js'
const IZIPAY_CSS_ID = 'izipay-classic-theme-css'
const IZIPAY_SCRIPT_URL = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
const IZIPAY_THEME_CSS_URL = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.css'
const IZIPAY_THEME_SCRIPT_URL = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js'

interface KRWindow {
  KR?: {
    onSubmit: (cb: (data: { clientAnswer?: { kr_answer: string }; hash?: string }) => boolean | void) => void
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

  // ── 1. Cargar CSS del tema ─────────────────────────────────────────────────
  useEffect(() => {
    if (!publicKey || typeof document === 'undefined') return
    if (document.getElementById(IZIPAY_CSS_ID)) return

    const link = document.createElement('link')
    link.id = IZIPAY_CSS_ID
    link.rel = 'stylesheet'
    link.href = IZIPAY_THEME_CSS_URL
    document.head.appendChild(link)
  }, [publicKey])

  // ── 2. Registrar eventos KR (cuando SDK ya está cargado o se carga) ────────
  const registerKREvents = useCallback(() => {
    const KR = (window as unknown as KRWindow).KR
    if (!KR?.onSubmit || !KR?.onError) return false

    KR.onSubmit((data) => {
      const krAnswer = data?.clientAnswer?.kr_answer ?? ''
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
      console.log('[IzipayWidget] SDK ya inicializado, aplicando formToken directamente')
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
