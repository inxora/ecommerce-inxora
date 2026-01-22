import { Metadata } from 'next'
import HomeClient from './HomeClient'
import { ProductsService } from '@/lib/services/products.service'
import { CategoriesService } from '@/lib/services/categories.service'
import { getCategorias } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  
  const titles: Record<string, string> = {
    es: 'TIENDA INXORA | Suministros Industriales en Perú - Herramientas y Equipos',
    en: 'INXORA STORE | Industrial Supplies in Peru - Tools and Equipment',
    pt: 'LOJA INXORA | Suprimentos Industriais no Peru - Ferramentas e Equipamentos',
  }

  const descriptions: Record<string, string> = {
    es: 'Tienda online de suministros industriales en Perú. Encuentra herramientas eléctricas, equipos de seguridad, ferretería y más. Marcas como Milwaukee, DeWalt, 3M. Envíos a todo el país.',
    en: 'Online store for industrial supplies in Peru. Find power tools, safety equipment, hardware and more. Brands like Milwaukee, DeWalt, 3M. Nationwide shipping.',
    pt: 'Loja online de suprimentos industriais no Peru. Encontre ferramentas elétricas, equipamentos de segurança, ferragens e muito mais. Marcas como Milwaukee, DeWalt, 3M. Envio para todo o país.',
  }

  const baseUrl = 'https://tienda.inxora.com'

  return {
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
    keywords: 'suministros industriales, herramientas eléctricas, equipos de seguridad, ferretería industrial, Milwaukee, DeWalt, 3M, Perú, tienda online',
    robots: 'index, follow',
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'es': `${baseUrl}/es`,
        'en': `${baseUrl}/en`,
        'pt': `${baseUrl}/pt`,
      },
    },
    openGraph: {
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
      url: `${baseUrl}/${locale}`,
      siteName: 'Tienda INXORA',
      images: [
        {
          url: `${baseUrl}/suministros_industriales_inxora_ecommerce_2025_front_1_web.jpg`,
          width: 1200,
          height: 630,
          alt: 'Tienda INXORA - Suministros Industriales',
        },
      ],
      locale: locale === 'es' ? 'es_PE' : locale === 'pt' ? 'pt_BR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
      images: [`${baseUrl}/suministros_industriales_inxora_ecommerce_2025_front_1_web.jpg`],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  
  // ✅ OPTIMIZACIÓN CRÍTICA: Usar Promise.allSettled con timeout para evitar bloqueos
  // Si una petición tarda más de 5 segundos, continuar sin ella
  const productosPromise = Promise.race([
    ProductsService.getProductosRecientes(4),
    new Promise<{ products: any[], total: number }>((resolve) => 
      setTimeout(() => resolve({ products: [], total: 0 }), 5000)
    )
  ])
  
  const categoriasPromise = Promise.race([
    getCategorias(),
    new Promise<{ data: any[] }>((resolve) => 
      setTimeout(() => resolve({ data: [] }), 5000)
    )
  ])
  
  // Ejecutar en paralelo con manejo de errores
  const [productosResult, categoriasResult] = await Promise.allSettled([
    productosPromise,
    categoriasPromise
  ])
  
  // Procesar resultados con manejo de errores
  const featuredProducts = productosResult.status === 'fulfilled' 
    ? (productosResult.value?.products || [])
    : []
  
  const categoriesData = categoriasResult.status === 'fulfilled'
    ? (categoriasResult.value?.data || [])
    : []
  
  // Filtrar categorías (misma lógica que en HomeClient)
  const filteredCategories = categoriesData.filter(
    (cat) => 
      cat.nombre.toUpperCase() !== 'DESPACHO DE PRODUCTOS' &&
      cat.logo_url && 
      cat.logo_url.trim() !== ''
  )
  
  // Log de errores si ocurrieron (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    if (productosResult.status === 'rejected') {
      console.warn('[HomePage] Error loading featured products:', productosResult.reason)
    }
    if (categoriasResult.status === 'rejected') {
      console.warn('[HomePage] Error loading categories:', categoriasResult.reason)
    }
  }
  
  // JSON-LD Schema para WebSite con SearchAction
  // Nota: El schema de Organization está en el layout principal para estar disponible en todas las páginas
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tienda INXORA',
    url: 'https://tienda.inxora.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://tienda.inxora.com/${locale}/catalogo?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomeClient 
        locale={locale} 
        featuredProducts={featuredProducts}
        categories={filteredCategories}
      />
    </>
  )
}
