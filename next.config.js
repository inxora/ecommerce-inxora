const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Manejar errores de imágenes de forma más silenciosa
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Configuración para manejar errores 400/404 - no cerrar el servidor
    // Temporalmente deshabilitar optimización en desarrollo para evitar errores 400/504 que cierran el servidor
    unoptimized: process.env.NODE_ENV === 'development',
    loader: 'default',
  },
  // Prevenir que errores de imágenes cierren el servidor
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 60 segundos en lugar de 25
    pagesBufferLength: 5, // Aumentar buffer para evitar descargas frecuentes
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3001'],
    },
  },
};

module.exports = withNextIntl(nextConfig);