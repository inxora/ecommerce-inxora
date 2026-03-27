'use client'

import dynamic from 'next/dynamic'

const MIN_HEIGHT = 280

export interface DeliveryAddressMapProps {
  lat: number | null
  lng: number | null
  onMarkerMove?: (lat: number, lng: number) => void
  center?: { lat: number; lng: number }
  interactive?: boolean
  markerTitle?: string
  ariaLabel?: string
  zoom?: number
  loading?: boolean
  error?: string | null
  errorHint?: string
  onErrorRetry?: () => void
  /** Texto mostrado mientras carga el mapa (i18n desde el padre) */
  loadingText?: string
  ariaLabelLoading?: string
  retryLabel?: string
  height?: number
  className?: string
}

/** Mapa con Google Maps JS API; carga en chunk solo en cliente. */
const DeliveryAddressMapClient = dynamic(
  () => import('./delivery-address-map-inner'),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-xl bg-gray-100 dark:bg-slate-700 animate-pulse flex items-center justify-center"
        style={{ minHeight: MIN_HEIGHT }}
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm">Cargando mapa...</span>
      </div>
    ),
  }
)

export function DeliveryAddressMap(props: DeliveryAddressMapProps) {
  const {
    lat,
    lng,
    onMarkerMove,
    center,
    interactive = true,
    markerTitle,
    ariaLabel,
    zoom = 14,
    loading = false,
    error = null,
    errorHint,
    loadingText = 'Cargando mapa...',
    ariaLabelLoading = 'Cargando mapa',
    retryLabel = 'Reintentar',
    height = MIN_HEIGHT,
    className = '',
  } = props

  if (loading) {
    return (
      <div
        className={`rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 animate-pulse ${className}`}
        style={{ minHeight: height }}
        aria-busy="true"
        aria-label={ariaLabelLoading}
      >
        <div className="w-full flex items-center justify-center" style={{ minHeight: height }}>
          <span className="text-gray-500 dark:text-gray-400 text-sm">{loadingText}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 ${className}`}
        style={{ minHeight: height }}
        role="alert"
      >
        <p className="text-amber-800 dark:text-amber-200 text-sm">{error}</p>
        <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
          {errorHint}
          {props.onErrorRetry && (
            <button
              type="button"
              onClick={props.onErrorRetry}
              className="ml-1 underline font-medium hover:no-underline focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
            >
              {retryLabel}
            </button>
          )}
        </p>
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 ${className}`}
      style={{ minHeight: height }}
    >
      <DeliveryAddressMapClient
        lat={lat}
        lng={lng}
        onMarkerMove={onMarkerMove}
        center={center}
        interactive={interactive}
        markerTitle={markerTitle}
        ariaLabel={ariaLabel}
        zoom={zoom}
        height={height}
      />
    </div>
  )
}
