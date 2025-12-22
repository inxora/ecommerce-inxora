import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
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
      },
    ],
    sitemap: 'https://tienda.inxora.com/sitemap.xml',
  }
}
