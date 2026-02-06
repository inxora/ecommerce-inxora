/**
 * Configuración de slots de banners. Fuente de verdad: docs/GUIA-GESTOR-BANNERS.md
 */

export type BannerSlotId =
  | 'home-hero'
  | 'home-right-destacados'
  | 'home-right-nuevos'
  | 'layout-header-strip'
  | 'home-below-hero'
  | 'home-below-categories'
  | 'home-middle'
  | 'home-between-sections'
  | 'home-pre-footer'
  | 'layout-footer-strip'

export interface BannerSlotConfig {
  aspectRatioDesktop: string // CSS aspect-ratio, ej: "21/9"
  aspectRatioMobile: string
  priority: boolean
  loading: 'lazy' | 'eager'
  fetchPriority: 'high' | 'low' | 'auto'
}

export const BANNER_SLOT_CONFIG: Record<BannerSlotId, BannerSlotConfig> = {
  'home-hero': {
    aspectRatioDesktop: '21/9',
    aspectRatioMobile: '4/3',
    priority: true,
    loading: 'eager',
    fetchPriority: 'high',
  },
  'home-right-destacados': {
    aspectRatioDesktop: '2/3',
    aspectRatioMobile: '2/3',
    priority: false,
    loading: 'lazy',
    fetchPriority: 'low',
  },
  'home-right-nuevos': {
    aspectRatioDesktop: '2/3',
    aspectRatioMobile: '2/3',
    priority: false,
    loading: 'lazy',
    fetchPriority: 'low',
  },
  'layout-header-strip': {
    aspectRatioDesktop: '24/1',
    aspectRatioMobile: '24/1',
    priority: false,
    loading: 'eager',
    fetchPriority: 'low',
  },
  'home-below-hero': {
    aspectRatioDesktop: '8/1',
    aspectRatioMobile: '4/1',
    priority: false,
    loading: 'lazy',
    fetchPriority: 'low',
  },
  'home-below-categories': {
    aspectRatioDesktop: '24/5',
    aspectRatioMobile: '24/5',
    priority: false,
    loading: 'lazy',
    fetchPriority: 'low',
  },
  'home-middle': {
    aspectRatioDesktop: '24/5',
    aspectRatioMobile: '24/5',
    priority: false,
    loading: 'lazy',
    fetchPriority: 'low',
  },
  'home-between-sections': {
    aspectRatioDesktop: '3/1',
    aspectRatioMobile: '2/1',
    priority: false,
    loading: 'lazy',
    fetchPriority: 'low',
  },
  'home-pre-footer': {
    aspectRatioDesktop: '32/5',
    aspectRatioMobile: '32/5',
    priority: false,
    loading: 'lazy',
    fetchPriority: 'low',
  },
  'layout-footer-strip': {
    aspectRatioDesktop: '24/1',
    aspectRatioMobile: '24/1',
    priority: false,
    loading: 'lazy',
    fetchPriority: 'low',
  },
}

export function getBannerSlotConfig(slug: string): BannerSlotConfig {
  const config = BANNER_SLOT_CONFIG[slug as BannerSlotId]
  return (
    config ?? {
      aspectRatioDesktop: '3/1',
      aspectRatioMobile: '2/1',
      priority: false,
      loading: 'lazy',
      fetchPriority: 'low',
    }
  )
}

/**
 * Clases Tailwind para aspect-ratio por slot (mobile-first).
 * Dimensiones según GUIA-GESTOR-BANNERS.md — evita CLS al reservar espacio.
 */
export const BANNER_ASPECT_CLASSES: Record<BannerSlotId, string> = {
  'home-hero': 'aspect-[4/3] md:aspect-[21/9]', // Desktop 1920×823, Mobile 750×562
  'home-right-destacados': 'aspect-[2/3]', // 400×600
  'home-right-nuevos': 'aspect-[2/3]', // 400×600
  'layout-header-strip': 'aspect-[24/1]', // 1920×80, 750×31
  'home-below-hero': 'aspect-[4/1] md:aspect-[8/1]', // Desktop 1920×240, Mobile 750×188
  'home-below-categories': 'aspect-[24/5]', // 1920×400, 375×78
  'home-middle': 'aspect-[24/5]', // 1920×400, 375×78
  'home-between-sections': 'aspect-[2/1] md:aspect-[3/1]', // Desktop 1920×300, Mobile 375×188
  'home-pre-footer': 'aspect-[32/5]', // 1920×300, 750×117
  'layout-footer-strip': 'aspect-[24/1]', // 1920×80, 750×31
}

export function getBannerAspectClasses(slug: string): string {
  return BANNER_ASPECT_CLASSES[slug as BannerSlotId] ?? 'aspect-[2/1] md:aspect-[3/1]'
}
