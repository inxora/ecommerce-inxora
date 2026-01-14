import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tienda INXORA - Suministros Industriales en Perú',
    short_name: 'INXORA',
    description: 'Tienda online de suministros industriales en Perú. Herramientas eléctricas, equipos de seguridad, ferretería y más.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#139ED4',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/inxora.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/inxora.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['shopping', 'business', 'industrial'],
    lang: 'es',
    dir: 'ltr',
    scope: '/',
    id: '/',
  }
}
