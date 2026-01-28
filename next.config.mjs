import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allowlist de orígenes (Vercel: limitar qué imágenes se optimizan)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'keeussaqlshdsegerqob.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'tienda.inxora.com',
      },
      {
        protocol: 'https',
        hostname: 'app.inxora.com',
      },
    ],
    // Cache 31 días: reduce transformaciones y cache writes (imágenes de producto no cambian a diario)
    minimumCacheTTL: 2678400, // 31 días
    // Un solo formato: menos transformaciones que ['image/avif', 'image/webp']
    formats: ['image/webp'],
    // Menos tamaños = menos variantes = menos transformaciones y cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256],
  },
  // Configuración para optimizar el build
  swcMinify: true,
  // Configuración de i18n
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default withNextIntl(nextConfig)
