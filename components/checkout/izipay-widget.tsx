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
        rawClientAnswer?: string
        clientAnswer?: { kr_answer: string }
        hash?: string
      }) => boolean | void
    ) => void
    onError: (cb: (err: { errorMessage?: string }) => void) => void
    setFormToken: (token: string) => Promise<void>
    renderElements: (el: HTMLElement) => Promise<void>
    removeForms: () => Promise<void>
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

    const CUSTOM_ID = 'izipay-inxora-custom-theme-v2'
    document.getElementById('izipay-inxora-custom-theme')?.remove()
    if (!document.getElementById(CUSTOM_ID)) {
      const s = document.createElement('style')
      s.id = CUSTOM_ID
      s.textContent = [
        /* Tema “checkout limpio” (referencia tipo marketplaces): tipografía neutra, bordes finos, mucho aire */
        ':root{--kr-global-color-primary:#F97316!important;--kr-button-color-background:#F97316!important;--kr-button-color-foreground:#ffffff!important;--kr-field-color-background:#ffffff!important;--kr-field-color-border:#dadce0!important;--kr-field-border-radius:6px!important;--kr-global-font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif!important}',
        /* Ancho completo (SDK neon fija ~300px por defecto) */
        '.kr-smart-form{--kr-form-smartform-width:100%!important;width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;-webkit-font-smoothing:antialiased!important;-moz-osx-font-smoothing:grayscale!important;color:#333!important}',
        '.kr-smart-form[kr-single-payment-button],.kr-smart-form[kr-grid],.kr-smart-form.kr-smart-form--compact{width:100%!important;max-width:100%!important}',
        '.kr-smart-form .kr-embedded,.kr-payment-form .kr-embedded{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important}',
        '.kr-brand-buttons,.kr-embedded .kr-brand-buttons{width:100%!important;max-width:100%!important;display:flex!important;flex-wrap:wrap!important;gap:10px!important;align-items:center!important;margin:0 0 18px!important;min-height:0!important}',
        '.kr-smart-form .kr-smart-form-wrapper.kr-type-embedded{width:100%!important;max-width:100%!important}',
        /* Contenedor: fondo blanco, sin “caja gris” extra */
        '.kr-smart-form,.kr-payment-form{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif!important;background:#fff!important;border-radius:8px!important;padding:0!important;border:none!important;box-shadow:none!important;width:100%!important;max-width:100%!important}',
        '.kr-form-content{padding:4px 2px 8px!important;width:100%!important;box-sizing:border-box!important}',
        /* Campos: borde 1px, foco simple (sin halo grande) */
        '.kr-input-relative-wrapper{background:#fff!important;border:1px solid #dadce0!important;border-radius:6px!important;margin-bottom:16px!important;overflow:hidden!important;padding:0!important;transition:border-color .15s ease,box-shadow .15s ease!important}',
        '.kr-input-relative-wrapper:focus-within{border-color:#F97316!important;box-shadow:none!important;outline:none!important}',
        '.kr-input-field{color:#333!important;font-size:15px!important;line-height:1.4!important;padding:13px 14px!important;background:transparent!important;border:none!important;width:100%!important}',
        /* Iconos decorativos más discretos; no afectar icono de marca en número de tarjeta (.kr-pan) */
        '.kr-embedded .kr-field-element:not(.kr-pan) .kr-icon .kr-icon-wrapper .kr-icon-wrapper-content svg,.kr-embedded .kr-field-element:not(.kr-pan) .kr-icon .kr-icon-wrapper .kr-icon-wrapper-content svg path{opacity:.55!important}',
        /* Logos de marca en fila — más livianos */
        '.kr-brand-buttons .kr-brand-button .kr-brand-button-icon svg,.kr-embedded .kr-brand-buttons .kr-brand-button .kr-brand-button-icon svg{border-color:#e8eaed!important;border-width:1px!important;border-radius:6px!important;box-shadow:none!important}',
        /* Etiquetas: sin todo en mayúsculas; más legibles */
        '.kr-card-list-label,.kr-card-list-header{color:#737373!important;font-size:13px!important;font-weight:500!important;text-transform:none!important;letter-spacing:0!important;margin-bottom:8px!important;display:block!important}',
        /* Errores */
        '.kr-field-error-label,.kr-error-field,.kr-form-error{color:#c62828!important;font-size:13px!important;margin-top:6px!important;background:transparent!important}',
        '.kr-on-error{border-color:#c62828!important}',
        '.kr-input-relative-wrapper:has(.kr-on-error){border-color:#c62828!important;box-shadow:none!important}',
        /* Botón principal: plano, sombra muy suave (estilo marketplace) */
        '.kr-payment-button{background:#F97316!important;background-color:#F97316!important;border:1px solid #ea580c!important;border-radius:8px!important;color:#fff!important;font-size:15px!important;font-weight:600!important;padding:15px 20px!important;width:100%!important;cursor:pointer!important;margin-top:8px!important;text-transform:none!important;letter-spacing:.01em!important;box-shadow:0 1px 2px rgba(0,0,0,.08)!important;transition:background .15s ease,border-color .15s ease,box-shadow .15s ease!important}',
        '.kr-payment-button span{color:#fff!important}',
        '.kr-payment-button:hover{background:#ea580c!important;background-color:#ea580c!important;border-color:#c2410c!important;box-shadow:0 2px 4px rgba(0,0,0,.1)!important}',
        '.kr-payment-button:active{background:#dc5f00!important;background-color:#dc5f00!important;transform:none!important;box-shadow:0 1px 2px rgba(0,0,0,.08)!important}',
        '.kr-payment-button:disabled{background:#FED7AA!important;background-color:#FED7AA!important;border-color:#fdba74!important;box-shadow:none!important;cursor:not-allowed!important;color:#9a3412!important}',
        '.kr-payment-button:disabled span{color:#9a3412!important}',
        /* Loading y modal 3DS */
        '.kr-loading-overlay{background:rgba(255,255,255,.9)!important;border-radius:8px!important}',
        '.kr-popin-modal-header{background:#F97316!important;color:#fff!important;border-radius:8px 8px 0 0!important}',
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
      console.log('[IzipayWidget] SDK ya en memoria — reiniciando con setFormToken + renderElements')
      registerKREvents()
      const KR = (window as unknown as KRWindow).KR
      const timeoutIds2: ReturnType<typeof setTimeout>[] = []
      const reiniciarKR = async () => {
        // Asegurarse de que el wrapper esté en el DOM antes de llamar al SDK
        const wrapper = containerRef.current ?? document.querySelector<HTMLElement>('.kr-smart-form')
        if (!wrapper) return
        if (formToken) wrapper.setAttribute('kr-form-token', formToken)
        try {
          if (KR?.setFormToken && formToken) {
            await KR.setFormToken(formToken)
          }
          // removeForms primero para evitar CLIENT_725 si ya había un formulario renderizado
          if (KR?.removeForms) {
            await KR.removeForms()
          }
          // Limpiar el wrapper completamente para evitar CLIENT_722
          // (.kr-smart-form solo puede tener un .kr-embedded como hijo directo)
          if (wrapper) wrapper.innerHTML = ''
          if (formToken) wrapper.setAttribute('kr-form-token', formToken)
          // renderElements le dice a Krypton que escanee y monte el formulario en el wrapper
          if (KR?.renderElements && wrapper) {
            await KR.renderElements(wrapper)
            console.log('[IzipayWidget] renderElements OK')
          }
        } catch (e) {
          console.warn('[IzipayWidget] reinicio KR falló:', e)
        }
      }
      const tid = setTimeout(() => { reiniciarKR() }, 150)
      timeoutIds2.push(tid)
      return () => { timeoutIds2.forEach((id) => clearTimeout(id)) }
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
    <div className="w-full min-w-0 rounded-xl overflow-hidden">
      <div
        ref={containerRef}
        className="kr-smart-form w-full min-w-0"
        // Krypton necesita kr-public-key en el elemento para saber qué clave usar
        // tanto en la carga inicial como en reinicio via renderElements
        {...(publicKey ? { 'kr-public-key': publicKey } : {})}
        {...(formToken ? { 'kr-form-token': formToken } : {})}
        data-testid="izipay-smart-form"
      />
    </div>
  )
}