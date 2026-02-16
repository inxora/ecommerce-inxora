import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCategorias, getMarcas } from '@/lib/supabase'
import { ProductsService } from '@/lib/services/products.service'
import { getServerCurrency } from '@/lib/utils/server-currency'
import { CatalogClient } from '@/components/catalog/catalog-client'
import { FilterState } from '@/components/catalog/product-filters'
import { PageLoader } from '@/components/ui/loader'

// Caché optimizado: revalidar cada 60 segundos para mejorar rendimiento
export const dynamic = 'force-dynamic'
export const revalidate = 60

interface CatalogPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    page?: string
    categoria?: string | string[]
    marca?: string | string[]
    buscar?: string
    precioMin?: string
    precioMax?: string
    ordenar?: string
  }>
}

// Metadata dinámica basada en filtros y búsqueda
export async function generateMetadata({ params, searchParams }: CatalogPageProps): Promise<Metadata> {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  
  const baseUrl = 'https://tienda.inxora.com'
  const searchTerm = resolvedSearchParams.buscar || ''
  const page = parseInt(resolvedSearchParams.page || '1')
  
  // Obtener nombres de categorías y marcas si están filtradas
  let categoryNames: string[] = []
  let brandNames: string[] = []
  
  // Construir título dinámico
  let title = 'Catálogo de Productos'
  let description = 'Explora nuestro catálogo completo de suministros industriales en Perú.'
  let keywords = 'catálogo industrial, herramientas, equipos de seguridad, ferretería, suministros industriales, Perú'
  
  // Si hay búsqueda
  if (searchTerm) {
    title = `Resultados para "${searchTerm}"`
    description = `Encuentra ${searchTerm} en TIENDA INXORA. Suministros industriales, herramientas y equipos de seguridad en Perú. Envíos a todo el país.`
    keywords = `${searchTerm}, ${keywords}`
  }
  
  // Si hay filtro de categoría
  if (resolvedSearchParams.categoria) {
    const categoriaArray = Array.isArray(resolvedSearchParams.categoria) 
      ? resolvedSearchParams.categoria 
      : [resolvedSearchParams.categoria]
    
    // Obtener nombres de categorías
    try {
      const { data: categories } = await getCategorias()
      if (categories) {
        categoryNames = categoriaArray
          .map(id => categories.find(c => c.id === parseInt(id))?.nombre)
          .filter(Boolean) as string[]
      }
    } catch (e) {
      // Ignorar error, usar IDs
    }
    
    if (categoryNames.length > 0) {
      const categoryText = categoryNames.join(', ')
      title = searchTerm 
        ? `${searchTerm} en ${categoryText}`
        : `${categoryText} | Suministros Industriales`
      description = `Compra ${categoryText.toLowerCase()} en TIENDA INXORA. Las mejores marcas de suministros industriales en Perú. Envíos a todo el país.`
      keywords = `${categoryText}, ${keywords}`
    }
  }
  
  // Si hay filtro de marca
  if (resolvedSearchParams.marca) {
    const marcaArray = Array.isArray(resolvedSearchParams.marca)
      ? resolvedSearchParams.marca
      : [resolvedSearchParams.marca]
    
    // Obtener nombres de marcas
    try {
      const { data: brands } = await getMarcas()
      if (brands) {
        brandNames = marcaArray
          .map(id => brands.find(b => b.id === parseInt(id))?.nombre)
          .filter(Boolean) as string[]
      }
    } catch (e) {
      // Ignorar error
    }
    
    if (brandNames.length > 0) {
      const brandText = brandNames.join(', ')
      if (categoryNames.length > 0) {
        title = `${categoryNames[0]} ${brandText}`
      } else if (searchTerm) {
        title = `${searchTerm} - ${brandText}`
      } else {
        title = `Productos ${brandText} | Suministros Industriales`
      }
      description = `Encuentra productos ${brandText} en TIENDA INXORA. Distribuidor autorizado en Perú. Precios competitivos y envíos a todo el país.`
      keywords = `${brandText}, ${keywords}`
    }
  }
  
  // Si hay filtro de precio
  if (resolvedSearchParams.precioMin || resolvedSearchParams.precioMax) {
    const min = resolvedSearchParams.precioMin ? `S/${resolvedSearchParams.precioMin}` : ''
    const max = resolvedSearchParams.precioMax ? `S/${resolvedSearchParams.precioMax}` : ''
    if (min && max) {
      description += ` Rango de precio: ${min} - ${max}.`
    } else if (min) {
      description += ` Desde ${min}.`
    } else if (max) {
      description += ` Hasta ${max}.`
    }
  }
  
  // Agregar paginación al título si no es página 1
  if (page > 1) {
    title += ` - Página ${page}`
  }
  
  // Agregar sufijo de marca
  title += ' | TIENDA INXORA'
  
  // Construir URL canónica (sin parámetros de paginación para evitar duplicados)
  const canonicalParams = new URLSearchParams()
  if (searchTerm) canonicalParams.set('buscar', searchTerm)
  if (resolvedSearchParams.categoria) {
    const cats = Array.isArray(resolvedSearchParams.categoria) 
      ? resolvedSearchParams.categoria 
      : [resolvedSearchParams.categoria]
    cats.forEach(c => canonicalParams.append('categoria', c))
  }
  if (resolvedSearchParams.marca) {
    const marcas = Array.isArray(resolvedSearchParams.marca)
      ? resolvedSearchParams.marca
      : [resolvedSearchParams.marca]
    marcas.forEach(m => canonicalParams.append('marca', m))
  }
  
  const canonicalQuery = canonicalParams.toString()
  const canonicalUrl = canonicalQuery 
    ? `${baseUrl}/${locale}/catalogo?${canonicalQuery}`
    : `${baseUrl}/${locale}/catalogo`
  
  return {
    title,
    description,
    keywords,
    robots: {
      index: page === 1, // Solo indexar página 1 para evitar contenido duplicado
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'es': `${baseUrl}/es/catalogo${canonicalQuery ? `?${canonicalQuery}` : ''}`,
        'en': `${baseUrl}/en/catalogo${canonicalQuery ? `?${canonicalQuery}` : ''}`,
        'pt': `${baseUrl}/pt/catalogo${canonicalQuery ? `?${canonicalQuery}` : ''}`,
        'x-default': `${baseUrl}/es/catalogo${canonicalQuery ? `?${canonicalQuery}` : ''}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'TIENDA INXORA',
      locale: locale === 'es' ? 'es_PE' : locale === 'pt' ? 'pt_BR' : 'en_US',
      images: [
        {
          url: `${baseUrl}/suministros_industriales_inxora_ecommerce_2025_front_1_web.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/suministros_industriales_inxora_ecommerce_2025_front_1_web.jpg`],
    },
  }
}

export default async function CatalogPage({ params, searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await searchParams
  const { locale } = await params
  const page = parseInt(resolvedSearchParams.page || '1')
  const itemsPerPage = 50

  // Normalize categoria and marca to arrays
  const normalizeToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  const categoriaArray = normalizeToArray(resolvedSearchParams.categoria)
  const marcaArray = normalizeToArray(resolvedSearchParams.marca)

  const filters: FilterState = {
    categoria: categoriaArray.length > 0 ? categoriaArray : undefined,
    marca: marcaArray.length > 0 ? marcaArray : undefined,
    precioMin: resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined,
    precioMax: resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined,
    ordenar: resolvedSearchParams.ordenar,
  }

  const searchTerm = resolvedSearchParams.buscar || ''
  const moneda = await getServerCurrency()

  // Fetch data in parallel
  // Usar ProductsService.getProductos del endpoint externo
  const [productsData, categoriesData, marcasData] = await Promise.all([
    ProductsService.getProductos({
      page,
      limit: itemsPerPage,
      categoria_id: categoriaArray.length > 0 ? categoriaArray.map(c => parseInt(c)) : undefined,
      id_marca: marcaArray.length > 0 ? marcaArray.map(m => parseInt(m)) : undefined,
      buscar: searchTerm,
      visible_web: true,
      precioMin: resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined,
      precioMax: resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined,
      ordenar: resolvedSearchParams.ordenar,
      moneda_usuario: moneda,
    }),
    getCategorias(),
    getMarcas(),
  ])

  let { products, total } = productsData

  // Respaldo: si el API no filtra por precio, filtrar en servidor para que lo mostrado sea correcto
  const precioMinNum = resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined
  const precioMaxNum = resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined
  if ((precioMinNum !== undefined || precioMaxNum !== undefined) && products?.length) {
    products = products.filter((p) => {
      const price = p.precio_venta ?? 0
      if (precioMinNum !== undefined && price < precioMinNum) return false
      if (precioMaxNum !== undefined && price > precioMaxNum) return false
      return true
    })
  }
  const { data: categories } = categoriesData
  const { data: brands } = marcasData
  const totalPages = productsData.totalPages || Math.ceil((total || 0) / itemsPerPage)

  // JSON-LD Schema para CollectionPage / ItemList
  const baseUrl = 'https://tienda.inxora.com'
  
  // Construir nombre de la colección
  let collectionName = 'Catálogo de Productos'
  if (searchTerm) {
    collectionName = `Resultados para "${searchTerm}"`
  } else if (categoriaArray.length > 0 && categories) {
    const catNames = categoriaArray
      .map(id => categories.find(c => c.id === parseInt(id))?.nombre)
      .filter(Boolean)
    if (catNames.length > 0) {
      collectionName = catNames.join(', ')
    }
  }

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collectionName,
    description: `Explora ${total} productos en TIENDA INXORA. Suministros industriales de calidad en Perú.`,
    url: `${baseUrl}/${locale}/catalogo`,
    numberOfItems: total,
    provider: {
      '@type': 'Organization',
      name: 'TIENDA INXORA',
      url: baseUrl,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products?.length || 0,
      itemListElement: (products || []).slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: (page - 1) * itemsPerPage + index + 1,
        item: {
          '@type': 'Product',
          name: product.nombre,
          description: product.descripcion_corta || product.nombre,
          image: product.imagen_principal_url || `${baseUrl}/placeholder-product.png`,
          sku: product.sku_producto || String(product.sku),
          url: `${baseUrl}/${locale}/catalogo`, // URL simplificada
          offers: {
            '@type': 'Offer',
            price: product.precio_venta || 0,
            priceCurrency: 'PEN',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'TIENDA INXORA',
            },
          },
          ...(product.marca && {
            brand: {
              '@type': 'Brand',
              name: typeof product.marca === 'string' ? product.marca : product.marca.nombre,
            },
          }),
        },
      })),
    },
  }

  // BreadcrumbList para navegación
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Catálogo',
        item: `${baseUrl}/${locale}/catalogo`,
      },
      ...(searchTerm ? [{
        '@type': 'ListItem',
        position: 3,
        name: `Búsqueda: ${searchTerm}`,
        item: `${baseUrl}/${locale}/catalogo?buscar=${encodeURIComponent(searchTerm)}`,
      }] : []),
    ],
  }

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogClient
          products={products || []}
          categories={categories || []}
          brands={brands || []}
          total={total || 0}
          totalPages={totalPages}
          currentPage={page}
          filters={filters}
          searchTerm={searchTerm}
        />
      </Suspense>
    </>
  )
}

function CatalogSkeleton() {
  return <PageLoader />
}