'use client'

/**
 * Mapa Leaflet en archivo separado para cargarlo solo en el cliente.
 * Evita "render is not a function" de react-leaflet + Next.js al aislar el módulo.
 */
import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const LIMA_CENTER = { lat: -12.046374, lng: -77.042793 }
const DEFAULT_ZOOM = 14
const MIN_HEIGHT = 280

export interface DeliveryAddressMapInnerProps {
  lat: number | null
  lng: number | null
  onMarkerMove?: (lat: number, lng: number) => void
  center?: { lat: number; lng: number }
  zoom?: number
  height?: number
}

export default function DeliveryAddressMapInner({
  lat,
  lng,
  onMarkerMove,
  center,
  zoom = DEFAULT_ZOOM,
  height = MIN_HEIGHT,
}: DeliveryAddressMapInnerProps) {
  const hasCoords = lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)
  const centerCoords: [number, number] = hasCoords
    ? [lat!, lng!]
    : [center?.lat ?? LIMA_CENTER.lat, center?.lng ?? LIMA_CENTER.lng]
  const position: [number, number] = hasCoords ? [lat!, lng!] : centerCoords

  const onMoveRef = useRef(onMarkerMove)
  onMoveRef.current = onMarkerMove

  const eventHandlers = useMemo(
    () => ({
      dragend(e: { target: { getLatLng: () => { lat: number; lng: number } } }) {
        const ll = e.target.getLatLng()
        onMoveRef.current?.(ll.lat, ll.lng)
      },
    }),
    []
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const Default = L.Icon.Default
    if (Default?.prototype && '_getIconUrl' in Default.prototype) {
      delete (Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
    }
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
  }, [])

  function CenterUpdater() {
    const map = useMap()
    useEffect(() => {
      map.setView(centerCoords, zoom)
    }, [map, centerCoords[0], centerCoords[1], zoom])
    return null
  }

  // react-leaflet v5 MapContainer espera un único hijo (context consumer); varios hijos provocan "render is not a function"
  const MapContent = () => (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} draggable={!!onMarkerMove} eventHandlers={eventHandlers} />
      <CenterUpdater />
    </>
  )

  return (
    <MapContainer
      center={centerCoords}
      zoom={zoom}
      className="w-full h-full rounded-xl"
      style={{ height, minHeight: MIN_HEIGHT }}
      zoomControl
      scrollWheelZoom
    >
      <MapContent />
    </MapContainer>
  )
}
