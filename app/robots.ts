import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Regla principal para todos los bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // APIs y sistema
          '/api/',
          '/_next/',
          '/_vercel/',

          // Paneles privados / internos
          '/dashboard',
          '/cotizaciones',
          '/cotizaciones-kanban',
          '/usuarios',
          '/clientes',
          '/productos/edit',
          '/configuracion',
          '/seo-management',
          '/system-info',
          '/analisis',
          '/facturas',
          '/ordenes',
          '/proveedores',
          '/financiamiento',
          '/entities',
          '/marca-categoria',
          '/disponibilidades',
          '/sara-xora',
          '/login',
        ],
        crawlDelay: 1, // 1 segundo entre peticiones para evitar sobrecarga
      },
      // Regla específica para Googlebot (más permisivo)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/login',
          '/admin',
        ],
        crawlDelay: 0, // Google puede rastrear sin delay
      },
      // Regla para Google Images (optimizar indexación de imágenes)
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
        ],
      },
      // Regla para Bingbot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/login',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: 'https://tienda.inxora.com/sitemap.xml',
    host: 'https://tienda.inxora.com', // URL canónica del sitio
  }
}
