/**
 * Servicio de banners dinámicos.
 * Consume los endpoints de la API: /api/banners/public, /api/banners/, /api/banners/{id}
 */

import type { Banner, BannerLayer } from '@/lib/types'
import { api, apiClient } from '@/lib/api/client'

const BANNERS_PUBLIC_ENDPOINT = '/api/banners/public'
const BANNERS_BASE_ENDPOINT = '/api/banners'
const CACHE_REVALIDATE = 60 // segundos

/** Respuesta del endpoint /api/banners/public - array directo */
export interface BannerAPI {
  id: number
  nombre_interno?: string
  posicion_slug: string
  url_imagen_desktop: string
  url_imagen_mobile: string | null
  url_destino: string | null
  boton_texto?: string | null
  titulo_h1?: string | null
  subtitulo_p?: string | null
  focal_point: string | null
  focal_point_mobile?: string | null
  object_fit?: 'cover' | 'contain'
  object_fit_mobile?: 'cover' | 'contain' | null
  configuracion_diseno?: BannerLayer[]
  orden: number
  todo_clicable: boolean
  promocion?: unknown
}

/** Normaliza slug para comparación: home-hero <-> home_hero */
function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase().replace(/-/g, '_')
}

/** Mapea BannerAPI al tipo Banner de la aplicación */
function mapBannerAPIToBanner(b: BannerAPI): Banner {
  return {
    id: b.id,
    posicion_slug: b.posicion_slug,
    titulo_h1: b.titulo_h1 ?? null,
    subtitulo_p: b.subtitulo_p ?? null,
    url_imagen_desktop: b.url_imagen_desktop,
    url_imagen_mobile: b.url_imagen_mobile ?? null,
    url_destino: b.url_destino ?? null,
    boton_texto: b.boton_texto ?? null,
    todo_clicable: b.todo_clicable ?? false,
    focal_point: b.focal_point ?? null,
    focal_point_mobile: b.focal_point_mobile ?? null,
    object_fit: b.object_fit ?? 'cover',
    object_fit_mobile: b.object_fit_mobile ?? null,
    configuracion_diseno: b.configuracion_diseno ?? [],
    orden: b.orden ?? 0,
    activo: true,
    fecha_inicio: null,
    fecha_fin: null,
    fecha_creacion: '',
    fecha_actualizacion: '',
  }
}

export const BannersService = {
  /**
   * Obtiene los banners públicos activos para una posición.
   * Consume GET /api/banners/public y filtra por posicion_slug.
   *
   * @param slugPosicion - Slug de la posición (ej: home-hero, home-middle). Acepta home-hero o home_hero.
   * @returns Array de banners ordenados por campo orden
   */
  getBannersActivos: async (slugPosicion: string): Promise<Banner[]> => {
    if (!slugPosicion || typeof slugPosicion !== 'string') {
      return []
    }

    try {
      const response = await apiClient<BannerAPI[]>(BANNERS_PUBLIC_ENDPOINT, {
        method: 'GET',
        next: { revalidate: CACHE_REVALIDATE },
      })

      if (!Array.isArray(response)) {
        return []
      }

      const slugNorm = normalizeSlug(slugPosicion)
      const filtered = response
        .filter((b) => b && typeof b === 'object' && b.url_imagen_desktop)
        .filter((b) => normalizeSlug(b.posicion_slug) === slugNorm)
        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))

      return filtered.map(mapBannerAPIToBanner)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[BannersService] Error fetching banners for "${slugPosicion}":`, error)
      }
      return []
    }
  },

  /**
   * Obtiene todos los banners (endpoint base).
   * GET /api/banners/
   */
  getBanners: async (): Promise<Banner[]> => {
    try {
      const response = await apiClient<BannerAPI[]>(BANNERS_BASE_ENDPOINT, {
        method: 'GET',
        next: { revalidate: CACHE_REVALIDATE },
      })

      if (!Array.isArray(response)) {
        return []
      }

      return response
        .filter((b) => b && typeof b === 'object' && b.url_imagen_desktop)
        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
        .map(mapBannerAPIToBanner)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[BannersService] Error fetching all banners:', error)
      }
      return []
    }
  },

  /**
   * Obtiene un banner por ID.
   * GET /api/banners/{banner_id}
   */
  getBannerById: async (bannerId: number): Promise<Banner | null> => {
    try {
      const response = await apiClient<BannerAPI>(`${BANNERS_BASE_ENDPOINT}/${bannerId}`, {
        method: 'GET',
        next: { revalidate: CACHE_REVALIDATE },
      })

      if (!response || typeof response !== 'object' || !response.url_imagen_desktop) {
        return null
      }

      return mapBannerAPIToBanner(response)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[BannersService] Error fetching banner ${bannerId}:`, error)
      }
      return null
    }
  },
}

/** Alias para compatibilidad con el código existente */
export const getBannersActivos = BannersService.getBannersActivos
