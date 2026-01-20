import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
      {
        protocol: 'https',
        hostname: 'app.inxora.com',
      },
    ],
  },
  // Configuración para optimizar el build
  swcMinify: true,
  // Configuración de i18n
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default withNextIntl(nextConfig)
