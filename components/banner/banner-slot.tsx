'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import type { Banner, BannerLayer } from '@/lib/types'
import { getBannerSlotConfig, getBannerAspectClasses } from '@/lib/config/banner-slots'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/** Hook para detectar viewport móvil (< 768px) */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

/** Renderiza contenido con formato inline: **negrita**, __subrayado__, *cursiva* */
function renderLayerContent(text: string): React.ReactNode {
  if (!text || typeof text !== 'string') return null
  const regex = /(\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_)/g
  const parts: React.ReactNode[] = []
  let key = 0
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, m.index)}</span>)
    }
    if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>)
    else if (m[3]) parts.push(<span key={key++} style={{ textDecoration: 'underline' }}>{m[3]}</span>)
    else if (m[4] || m[5]) parts.push(<em key={key++}>{m[4] || m[5]}</em>)
    lastIndex = m.index + m[0].length
  }
  if (lastIndex < text.length) parts.push(<span key={key++}>{text.slice(lastIndex)}</span>)
  if (parts.length === 0) return text
  if (parts.length === 1) return parts[0]
  return <>{parts}</>
}

interface BannerSlotProps {
  posicionSlug: string
  banners: Banner[]
  locale?: string
  /** Fallback cuando no hay banners: imagen estática para hero */
  fallbackImageUrl?: string | null
  fallbackAlt?: string
}

function resolveUrlDestino(url: string | null | undefined, locale: string): string {
  if (!url || url.trim() === '') return `/${locale}/catalogo`
  if (url.startsWith('http') || url.startsWith('//')) return url
  if (url.startsWith('/')) return url
  return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`
}

/** Mapea focal_point de BD a valor CSS object-position */
function getObjectPosition(focalPoint: string | null | undefined): string {
  if (!focalPoint || typeof focalPoint !== 'string') return 'center'
  const fp = focalPoint.trim()
  // Formato personalizado "30% 70%"
  if (/^\d+% \d+%$/.test(fp)) return fp
  const fpLower = fp.toLowerCase()
  const map: Record<string, string> = {
    center: 'center',
    top: 'top',
    north: 'top',
    bottom: 'bottom',
    south: 'bottom',
    left: 'left',
    west: 'left',
    right: 'right',
    east: 'right',
    'top left': 'top left',
    'top right': 'top right',
    'bottom left': 'bottom left',
    'bottom right': 'bottom right',
  }
  return map[fpLower] ?? 'center'
}

function BannerLayerElement({
  layer,
  banner,
  isMobile,
  locale,
}: {
  layer: BannerLayer
  banner: Banner
  isMobile: boolean
  locale: string
}) {
  const rawContenido = layer.contenido
  const contenidoStr =
    typeof rawContenido === 'string'
      ? rawContenido
      : Array.isArray(rawContenido)
        ? rawContenido.join('')
        : String(rawContenido ?? '')
  if (!contenidoStr) return null
  if (banner.todo_clicable && layer.tipo === 'button') return null

  const x = isMobile && layer.x_mobile != null ? layer.x_mobile : layer.x
  const y = isMobile && layer.y_mobile != null ? layer.y_mobile : layer.y
  const e = layer.estilos ?? {}

  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '90%',
  }

  const contentStyle: React.CSSProperties = {
    color: e.color ?? '#fff',
    fontSize: e.fontSize ?? 16,
    fontFamily: e.fontFamily ?? 'inherit',
    fontWeight: e.fontWeight === 'bold' ? 'bold' : (e.fontWeight as React.CSSProperties['fontWeight']),
    fontStyle: e.fontStyle,
    textDecoration: e.textDecoration,
    backgroundColor: e.backgroundColor,
    borderRadius: e.borderRadius != null ? `${e.borderRadius}px` : undefined,
    padding: layer.tipo === 'button' ? '8px 16px' : 0,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    textAlign: 'center',
    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
    lineHeight: 1.4,
  }

  const content = renderLayerContent(contenidoStr)
  const Tag = layer.tipo === 'h1' ? 'h2' : layer.tipo === 'p' ? 'p' : 'span'

  const el = (
    <Tag className="drop-shadow" style={contentStyle}>
      {content}
    </Tag>
  )

  const url = layer.tipo === 'button' ? (layer.url || banner.url_destino || '#') : null
  const href = url ? resolveUrlDestino(url, locale) : null

  if (href && layer.tipo === 'button') {
    return (
      <Link key={layer.id} href={href} className="inline-flex hover:opacity-90 transition-opacity" style={wrapperStyle}>
        {el}
      </Link>
    )
  }
  return (
    <div key={layer.id} style={wrapperStyle}>
      {el}
    </div>
  )
}

function SingleBannerContent({
  banner,
  config,
  locale,
  isMobile,
}: {
  banner: Banner
  config: ReturnType<typeof getBannerSlotConfig>
  locale: string
  isMobile: boolean
}) {
  const urlDesktop = banner.url_imagen_desktop
  const urlMobile = banner.url_imagen_mobile || banner.url_imagen_desktop
  const urlDestino = resolveUrlDestino(banner.url_destino, locale)

  const objectFit = isMobile ? (banner.object_fit_mobile ?? banner.object_fit ?? 'cover') : (banner.object_fit ?? 'cover')
  const focalPoint = isMobile ? (banner.focal_point_mobile ?? banner.focal_point) : banner.focal_point
  const objectPosition = getObjectPosition(focalPoint)

  const hasConfiguracionDiseno = banner.configuracion_diseno && banner.configuracion_diseno.length > 0
  const hasLegacyText = !!(banner.titulo_h1 || banner.subtitulo_p || banner.boton_texto)
  const hasOverlay = hasConfiguracionDiseno || hasLegacyText

  const imageContent = (
    <div className="absolute inset-0 z-0 min-w-full min-h-full">
      <picture className="block w-full h-full">
        <source media="(max-width: 767px)" srcSet={urlMobile} />
        <img
          src={urlDesktop}
          alt={banner.titulo_h1 || (() => {
            const c = banner.configuracion_diseno?.[0]?.contenido
            return (Array.isArray(c) ? c : c ? [c] : []).join(' ') || 'Banner'
          })()}
          className="block w-full h-full"
          style={{ objectFit, objectPosition }}
          loading={config.loading}
          fetchPriority={config.fetchPriority}
          decoding="async"
        />
      </picture>
    </div>
  )

  const overlayContent = hasConfiguracionDiseno ? (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <div className="absolute inset-0 pointer-events-auto">
        {banner.configuracion_diseno!.map((layer) => (
          <BannerLayerElement
            key={layer.id}
            layer={layer}
            banner={banner}
            isMobile={isMobile}
            locale={locale}
          />
        ))}
      </div>
    </div>
  ) : hasLegacyText ? (
    <div className="absolute inset-0 z-10 flex flex-col justify-end items-start text-left p-6 sm:p-8 lg:p-10 xl:p-12 pointer-events-none bg-transparent">
      <div className="pointer-events-auto max-w-2xl">
        {banner.titulo_h1 && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight">
            {banner.titulo_h1}
          </h2>
        )}
        {banner.subtitulo_p && (
          <p className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] max-w-xl">
            {banner.subtitulo_p}
          </p>
        )}
        {!banner.todo_clicable && banner.boton_texto && (
          <Link
            href={urlDestino}
            className="mt-4 sm:mt-5 inline-flex items-center gap-2 rounded-lg bg-inxora-blue hover:bg-inxora-blue/90 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-lg transition-all"
          >
            {banner.boton_texto}
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  ) : null

  if (banner.todo_clicable) {
    return (
      <Link
        href={urlDestino}
        className="block relative w-full h-full cursor-pointer hover:brightness-95 transition-[filter] duration-200"
      >
        {imageContent}
        {overlayContent}
      </Link>
    )
  }

  return (
    <div className="relative w-full h-full">
      {imageContent}
      {overlayContent}
    </div>
  )
}

export function BannerSlot({
  posicionSlug,
  banners,
  locale = 'es',
  fallbackImageUrl,
  fallbackAlt = 'Banner',
}: BannerSlotProps) {
  const config = getBannerSlotConfig(posicionSlug)
  const isMobile = useIsMobile()

  if (!banners || banners.length === 0) {
    if (fallbackImageUrl && posicionSlug === 'home-hero') {
      const aspectClasses = getBannerAspectClasses(posicionSlug)
      return (
        <div
          className={`banner-slot-fallback relative w-full overflow-hidden ${aspectClasses}`}
        >
          <div className="absolute inset-0">
            <picture className="block w-full h-full overflow-hidden">
              <source
                media="(max-width: 767px)"
                srcSet={fallbackImageUrl}
              />
              <img
                src={fallbackImageUrl}
                alt={fallbackAlt}
                className="w-full h-full object-cover object-center"
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>
      )
    }
    return null
  }

  const isCarousel = banners.length > 1
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentBanner = banners[currentIndex]

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % banners.length)
  }, [banners.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + banners.length) % banners.length)
  }, [banners.length])

  const aspectClasses = getBannerAspectClasses(posicionSlug)

  return (
    <div
      className={`banner-slot relative w-full overflow-hidden ${aspectClasses}`}
    >

      {isCarousel ? (
        <>
          <div className="absolute inset-0">
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'
                }`}
              >
                <SingleBannerContent
                  banner={banner}
                  config={config}
                  locale={locale}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </div>

          {/* Controles del carrusel */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              aria-label="Banner siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Ir a banner ${idx + 1}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="absolute inset-0">
          <SingleBannerContent
            banner={currentBanner}
            config={config}
            locale={locale}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  )
}
