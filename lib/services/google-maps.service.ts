/**
 * Servicio de geocoding/reverse/autocomplete vía backend (sin exponer API key en front).
 * Todas las coordenadas y direcciones vienen de estos endpoints.
 */

import { api } from '@/lib/api/client'

export interface AutocompletePrediction {
  place_id: string
  description: string
  structured_formatting?: { main_text?: string; secondary_text?: string }
}

export interface PlaceDetailsResponse {
  lat?: number
  lng?: number
  address?: string
  place_id?: string
  formatted_address?: string
  address_components?: Array<{ long_name: string; short_name: string; types: string[] }>
}

export interface ReverseGeocodeResponse {
  lat?: number
  lng?: number
  address?: string
  direccion?: string
  distrito?: string
  provincia?: string
  departamento?: string
  id_distrito?: number
  id_provincia?: number
  id_ciudad?: number
  ubigeo?: string
}

export interface GeocodificarBody {
  direccion: string
  distrito?: string
  provincia?: string
  departamento?: string
}

export interface GeocodificarResponse {
  lat?: number
  lng?: number
  address?: string
  formatted_address?: string
}

export const GoogleMapsService = {
  /** GET /api/google-maps/autocomplete?q=<texto> — sugerencias de dirección */
  async autocomplete(q: string): Promise<AutocompletePrediction[]> {
    if (!q?.trim()) return []
    const res = await api.get<{ predictions?: AutocompletePrediction[]; data?: AutocompletePrediction[] }>(
      '/api/google-maps/autocomplete',
      { q: q.trim() }
    )
    const list = (res as { predictions?: AutocompletePrediction[] }).predictions ?? (res as { data?: AutocompletePrediction[] }).data
    return Array.isArray(list) ? list : []
  },

  /** GET /api/google-maps/place-details?place_id=<id> — detalle y coordenadas */
  async getPlaceDetails(placeId: string): Promise<PlaceDetailsResponse> {
    const res = await api.get<{ data?: PlaceDetailsResponse } | PlaceDetailsResponse>(
      '/api/google-maps/place-details',
      { place_id: placeId }
    )
    const data = (res as { data?: PlaceDetailsResponse }).data ?? res
    return (data as PlaceDetailsResponse) ?? {}
  },

  /** GET /api/google-maps/reverse?lat=&lng= — coordenadas → dirección (y opcionalmente distrito/provincia/departamento/ids) */
  async reverse(lat: number, lng: number): Promise<ReverseGeocodeResponse> {
    const res = await api.get<{ data?: ReverseGeocodeResponse } | ReverseGeocodeResponse>(
      '/api/google-maps/reverse',
      { lat: String(lat), lng: String(lng) }
    )
    const data = (res as { data?: ReverseGeocodeResponse }).data ?? res
    return (data as ReverseGeocodeResponse) ?? {}
  },

  /** POST /api/google-maps/geocodificar — dirección (ej. "Distrito X, Provincia Y, Departamento Z") → coordenadas */
  async geocodificar(body: GeocodificarBody): Promise<GeocodificarResponse> {
    const res = await api.post<{ data?: GeocodificarResponse } | GeocodificarResponse>(
      '/api/google-maps/geocodificar',
      body
    )
    const data = (res as { data?: GeocodificarResponse }).data ?? res
    return (data as GeocodificarResponse) ?? {}
  },
}
