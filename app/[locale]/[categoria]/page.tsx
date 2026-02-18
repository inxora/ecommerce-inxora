import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCategorias, getMarcas, getMarcasByCategoria, Categoria, Marca } from '@/lib/supabase'
import { ProductsService } from '@/lib/services/products.service'
import { CategoriesService } from '@/lib/services/categories.service'
import { getServerCurrency } from '@/lib/utils/server-currency'
import { CategoryClient } from '@/components/category/category-client'
import { FilterState } from '@/components/catalog/product-filters'
import { PageLoader } from '@/components/ui/loader'
import { notFound } from 'next/navigation'
import { normalizeName, buildCategoryUrlFromObject } from '@/lib/product-url'

// Caché optimizado: revalidar cada 60 segundos para mejorar rendimiento
export const dynamic = 'force-dynamic'
export const revalidate = 60

interface CategoryPageProps {
  params: Promise<{ categoria: string; locale: string }>
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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categoria: categorySlug, locale } = await params
  
  const categoriesData = await getCategorias()
  const category = categoriesData.data?.find(c => normalizeName(c.nombre) === categorySlug)
  
  if (!category) {
    return { title: 'Categoría no encontrada' }
  }

  // Generar URL canónica base (sin query parameters)
  const baseUrl = 'https://tienda.inxora.com'
  const canonicalUrl = `${baseUrl}${buildCategoryUrlFromObject(category, locale)}`
  const title = `${category.nombre} | TIENDA INXORA - Suministros Industriales`
  const description = `Encuentra productos de ${category.nombre} en TIENDA INXORA. Los mejores suministros industriales en Perú con envío a todo el país.`
  const keywords = `${category.nombre}, suministros industriales, TIENDA INXORA, Perú, ${category.nombre} productos`

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'INXORA' }],
    creator: 'INXORA',
    publisher: 'INXORA',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: canonicalUrl.replace(`/${locale}/`, '/es/'),
        en: canonicalUrl.replace(`/${locale}/`, '/en/'),
        pt: canonicalUrl.replace(`/${locale}/`, '/pt/'),
        'x-default': canonicalUrl.replace(`/${locale}/`, '/es/'),
      },
    },
    openGraph: {
      title: `${category.nombre} | TIENDA INXORA`,
      description: `Productos de ${category.nombre} - Suministros industriales de calidad.`,
      url: canonicalUrl,
      siteName: 'TIENDA INXORA',
      locale: locale === 'es' ? 'es_PE' : locale === 'pt' ? 'pt_BR' : 'en_US',
      type: 'website',
      images: [{ url: `${baseUrl}/inxora.png`, width: 800, height: 600, alt: category.nombre, type: 'image/jpeg' as const }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.nombre} | TIENDA INXORA`,
      description: `Productos de ${category.nombre} - Suministros industriales de calidad.`,
      images: [`${baseUrl}/inxora.png`],
      creator: '@inxora',
      site: '@inxora',
    },
    robots: { index: true, follow: true },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categoria: categorySlug, locale } = await params
  
  // Validar que el locale sea válido (rutas especiales no deben llegar aquí)
  const validLocales = ['es', 'en', 'pt']
  if (!validLocales.includes(locale)) {
    // Si el locale no es válido, es una ruta del sistema (como .well-known)
    notFound()
  }
  
  // Validar categorySlug - evitar rutas del sistema
  const invalidPrefixes = ['.', '_', 'api', 'favicon', 'icon', 'manifest', 'robots', 'sitemap']
  if (invalidPrefixes.some(prefix => categorySlug.startsWith(prefix) || categorySlug === prefix)) {
    notFound()
  }
  
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1')
  const itemsPerPage = 50

  // Normalize categoria and marca to arrays
  const normalizeToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  const marcaArray = normalizeToArray(resolvedSearchParams.marca)

  // Fetch all categories first to find the one matching the slug
  const categoriesData = await getCategorias()
  const { data: allCategories } = categoriesData
  
  // Find category by matching normalized name with slug
  const category = allCategories?.find(c => {
    const normalizedName = normalizeName(c.nombre)
    return normalizedName === categorySlug
  })

  if (!category) {
    notFound()
  }

  const categoryId = category.id
  const moneda = await getServerCurrency()

  // Only ONE category at a time - use the current category from the route
  // Multiple marcas are allowed
  const allCategoriaIds = [String(categoryId)]

  // Fetch remaining data in parallel
  // OPTIMIZACIÓN: Obtener subcategorías junto con el resto de datos
  const [brandsData, productsData, relatedBrandsData, categoriasNavegacion] = await Promise.all([
    getMarcas(),
    ProductsService.getProductos({
      page,
      limit: itemsPerPage,
      categoria_id: allCategoriaIds.map(id => parseInt(id)),
      id_marca: marcaArray.length > 0 ? marcaArray.map(m => parseInt(m)) : undefined,
      buscar: resolvedSearchParams.buscar,
      visible_web: true,
      moneda_usuario: moneda,
    }),
    getMarcasByCategoria(categoryId),
    CategoriesService.getCategorias() // ✅ Obtener subcategorías
  ])

  const { products, total } = productsData
  const relatedBrands = relatedBrandsData || []
  
  // ✅ Obtener subcategorías de la categoría actual
  const categoriaNavegacion = categoriasNavegacion.find(c => c.id === categoryId)
  const subcategorias = categoriaNavegacion?.subcategorias.filter(s => s.activo) || []

  const { data: categories } = categoriesData
  const { data: brands } = brandsData
  // Ensure totalPages is calculated correctly - use the total from the query response
  // The total should reflect all products matching the filters (categoria + marca + otros filtros)
  const totalPages = total > 0 && productsData.totalPages > 0
    ? productsData.totalPages 
    : Math.ceil((total || 0) / itemsPerPage)

  // Filters state: only ONE category at a time (current category is always selected)
  // Multiple marcas are allowed
  const filters: FilterState = {
    // Current category is always selected (it's in the route)
    categoria: [String(categoryId)],
    marca: marcaArray.length > 0 ? marcaArray : undefined,
    precioMin: resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined,
    precioMax: resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined,
    ordenar: resolvedSearchParams.ordenar,
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <CategoryClient
        category={category}
        subcategorias={subcategorias}
        products={products || []}
        categories={categories || []}
        brands={brands || []}
        relatedBrands={relatedBrands}
        total={total || 0}
        totalPages={totalPages}
        currentPage={page}
        filters={filters}
        searchTerm={resolvedSearchParams.buscar || ''}
      />
    </Suspense>
  )
}
