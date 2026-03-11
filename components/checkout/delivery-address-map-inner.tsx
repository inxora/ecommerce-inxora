'use client'

/**
 * Mapa de dirección de entrega con Google Maps JavaScript API.
 * Marcador arrastrable; al soltar se llama onMarkerMove(lat, lng) para geocodificación inversa (backend).
 */
import { useEffect, useRef, useCallback } from 'react'

const LIMA_CENTER = { lat: -12.046374, lng: -77.042793 }
const DEFAULT_ZOOM = 14
const MIN_HEIGHT = 280

export interface DeliveryAddressMapInnerProps {
  lat: number | null
  lng: number | null
  onMarkerMove?: (lat: number, lng: number) => void
  center?: { lat: number; lng: number }
  interactive?: boolean
  markerTitle?: string
  ariaLabel?: string
  zoom?: number
  height?: number
}

export default function DeliveryAddressMapInner({
  lat,
  lng,
  onMarkerMove,
  center,
  interactive = true,
  markerTitle,
  ariaLabel,
  zoom = DEFAULT_ZOOM,
  height = MIN_HEIGHT,
}: DeliveryAddressMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const onMoveRef = useRef(onMarkerMove)
  onMoveRef.current = onMarkerMove

  const hasCoords = lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)
  const centerLat = hasCoords ? lat! : (center?.lat ?? LIMA_CENTER.lat)
  const centerLng = hasCoords ? lng! : (center?.lng ?? LIMA_CENTER.lng)

  const initMap = useCallback(() => {
    const g = typeof window !== 'undefined' ? (window as Window & { google?: typeof google }).google : undefined
    if (!g || !containerRef.current) return

    const map = new g.maps.Map(containerRef.current, {
      center: { lat: centerLat, lng: centerLng },
      zoom,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      scaleControl: true,
    })
    mapRef.current = map

    const marker = new g.maps.Marker({
      position: { lat: centerLat, lng: centerLng },
      map,
      draggable: Boolean(interactive && onMoveRef.current),
      title: markerTitle ?? (interactive ? 'Arrastra para ajustar la ubicación' : 'Ubicación de recojo'),
    })
    markerRef.current = marker

    if (interactive && onMoveRef.current) {
      marker.addListener('dragend', () => {
        const pos = marker.getPosition()
        if (pos) onMoveRef.current?.(pos.lat(), pos.lng())
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- centerLat/centerLng only for initial view

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey?.trim()) return
    if (!containerRef.current) return

    if (window.google?.maps) {
      initMap()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    script.onload = () => initMap()
    document.head.appendChild(script)

    return () => {
      if (markerRef.current) markerRef.current.setMap(null)
      markerRef.current = null
      mapRef.current = null
    }
  }, [initMap])

  // Actualizar posición del marcador y centro cuando cambian lat/lng desde fuera
  useEffect(() => {
    const map = mapRef.current
    const marker = markerRef.current
    if (!map || !marker) return
    const pos = { lat: centerLat, lng: centerLng }
    marker.setPosition(pos)
    map.panTo(pos)
  }, [centerLat, centerLng])

  const apiKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : ''
  if (!apiKey?.trim()) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-sm p-4"
        style={{ minHeight: height }}
      >
        Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para mostrar el mapa.
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-xl"
      style={{ height, minHeight: MIN_HEIGHT }}
      aria-label={ariaLabel ?? (interactive ? 'Mapa de ubicación de entrega' : 'Mapa de ubicación de recojo')}
    />
  )
}
