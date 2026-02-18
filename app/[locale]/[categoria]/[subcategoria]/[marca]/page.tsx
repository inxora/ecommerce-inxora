import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCategorias, getMarcas, getMarcasByCategoria } from '@/lib/supabase'
import { ProductsService } from '@/lib/services/products.service'
import { CategoryClient } from '@/components/category/category-client'
import { getServerCurrency } from '@/lib/utils/server-currency'
import { FilterState } from '@/components/catalog/product-filters'
import { PageLoader } from '@/components/ui/loader'
import { notFound } from 'next/navigation'
import { normalizeName, buildCategorySubcategoriaMarcaUrl } from '@/lib/product-url'
import { CategoriesService } from '@/lib/services/categories.service'

// Caché optimizado: revalidar cada 60 segundos para mejorar rendimiento
export const dynamic = 'force-dynamic'
export const revalidate = 60

interface CategorySubcategoriaMarcaPageProps {
  params: Promise<{ categoria: string; subcategoria: string; marca: string; locale: string }>
  searchParams: Promise<{
    page?: string
    buscar?: string
    precioMin?: string
    precioMax?: string
    ordenar?: string
  }>
}

export async function generateMetadata({ params }: CategorySubcategoriaMarcaPageProps): Promise<Metadata> {
  try {
  const { categoria: categorySlug, subcategoria: subcategoriaSlug, marca: brandSlug, locale } = await params
  
  const categoriesData = await getCategorias()
  const category = categoriesData.data?.find(c => normalizeName(c.nombre) === categorySlug)
  
  if (!category) {
    return { title: 'Categoría no encontrada' }
  }

  // Obtener subcategoría desde el servicio
  const categoriasNavegacion = await CategoriesService.getCategorias()
  const categoriaNavegacion = categoriasNavegacion.find(c => c.id === category.id)
  const subcategoria = categoriaNavegacion?.subcategorias.find(
    s => normalizeName(s.nombre) === subcategoriaSlug
  )
  
  if (!subcategoria) {
    return { title: 'Subcategoría no encontrada' }
  }

  // Obtener marca por slug desde la subcategoría
  const brand = subcategoria.marcas?.find(m => normalizeName(m.nombre) === brandSlug)
  
  if (!brand) {
    return { title: 'Marca no encontrada' }
  }

  // Generar URL canónica
  const baseUrl = 'https://tienda.inxora.com'
  const canonicalUrl = `${baseUrl}${buildCategorySubcategoriaMarcaUrl(category, subcategoria, brand, locale)}`
  const title = `${brand.nombre} - ${subcategoria.nombre} - ${category.nombre} | TIENDA INXORA - Suministros Industriales`
  const description = `Encuentra productos de ${brand.nombre} en ${subcategoria.nombre} de ${category.nombre} en TIENDA INXORA. Los mejores suministros industriales en Perú con envío a todo el país.`
  const keywords = `${brand.nombre}, ${subcategoria.nombre}, ${category.nombre}, suministros industriales, TIENDA INXORA, Perú`

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
      title: `${brand.nombre} - ${subcategoria.nombre} - ${category.nombre} | TIENDA INXORA`,
      description: `Productos de ${brand.nombre} en ${subcategoria.nombre} de ${category.nombre} - Suministros industriales de calidad.`,
      url: canonicalUrl,
      siteName: 'TIENDA INXORA',
      locale: locale === 'es' ? 'es_PE' : locale === 'pt' ? 'pt_BR' : 'en_US',
      type: 'website',
      images: [{ url: `${baseUrl}/inxora.png`, width: 800, height: 600, alt: brand.nombre, type: 'image/jpeg' as const }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brand.nombre} - ${subcategoria.nombre} - ${category.nombre} | TIENDA INXORA`,
      description: `Productos de ${brand.nombre} en ${subcategoria.nombre} de ${category.nombre} - Suministros industriales de calidad.`,
      images: [`${baseUrl}/inxora.png`],
      creator: '@inxora',
      site: '@inxora',
    },
    robots: { index: true, follow: true },
  }
  } catch (error) {
    console.error('Error in generateMetadata for CategoryBrandPage:', error)
    // Retornar metadata por defecto en caso de error
    return {
      title: 'Categoría y Marca | TIENDA INXORA',
      description: 'Suministros industriales en Perú',
    }
  }
}

export default async function CategorySubcategoriaMarcaPage({ params, searchParams }: CategorySubcategoriaMarcaPageProps) {
  try {
  const { categoria: categorySlug, subcategoria: subcategoriaSlug, marca: brandSlug, locale } = await params
  
  // Validar que el locale sea válido (rutas especiales no deben llegar aquí)
  const validLocales = ['es', 'en', 'pt']
  if (!validLocales.includes(locale)) {
    notFound()
  }
  
  // Validar slugs - evitar rutas del sistema
  const invalidPrefixes = ['.', '_', 'api', 'favicon', 'icon', 'manifest', 'robots', 'sitemap']
  if (invalidPrefixes.some(prefix => categorySlug.startsWith(prefix) || categorySlug === prefix)) {
    notFound()
  }
  if (invalidPrefixes.some(prefix => subcategoriaSlug.startsWith(prefix) || subcategoriaSlug === prefix)) {
    notFound()
  }
  if (invalidPrefixes.some(prefix => brandSlug.startsWith(prefix) || brandSlug === prefix)) {
    notFound()
  }
  
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1')
  const itemsPerPage = 50

  // Fetch categories first to find matches
  const categoriesData = await getCategorias()
  const { data: allCategories, error: categoriesError } = categoriesData

  // Si hay un error de CORS o las categorías están vacías, mostrar error en lugar de 404
  if (categoriesError || !allCategories || allCategories.length === 0) {
    console.error('Error loading categories:', categoriesError)
  }

  // Find category by matching normalized name with slug
  const category = allCategories?.find(c => {
    const normalizedName = normalizeName(c.nombre)
    return normalizedName === categorySlug
  })

  if (!category) {
    // Si no hay categorías debido a un error de API, no mostrar 404
    if (categoriesError || !allCategories || allCategories.length === 0) {
      throw new Error('No se pueden cargar las categorías. Por favor, verifique la conexión con el servidor.')
    }
    notFound()
  }

  // Obtener subcategoría y marca desde el servicio de navegación
  const categoriasNavegacion = await CategoriesService.getCategorias()
  const categoriaNavegacion = categoriasNavegacion.find(c => c.id === category.id)
  
  if (!categoriaNavegacion) {
    console.error(`Category ${category.id} not found in navigation tree`)
    notFound()
  }
  
  // Buscar subcategoría
  const subcategoria = categoriaNavegacion.subcategorias.find(
    s => normalizeName(s.nombre) === subcategoriaSlug
  )

  if (!subcategoria) {
    console.error(`Subcategoria with slug "${subcategoriaSlug}" not found in category "${category.nombre}"`)
    notFound()
  }

  // Buscar marca dentro de la subcategoría
  const brand = subcategoria.marcas?.find(m => normalizeName(m.nombre) === brandSlug)

  if (!brand) {
    console.error(`Brand with slug "${brandSlug}" not found in subcategoria "${subcategoria.nombre}"`)
    notFound()
  }

  const categoryId = category.id
  const subcategoriaId = subcategoria.id
  const brandId = brand.id
  const moneda = await getServerCurrency()

  // Fetch remaining data in parallel
  // ✅ Ahora usa id_subcategoria para filtrado preciso
  const [productsData, relatedBrandsData] = await Promise.all([
    ProductsService.getProductos({
      page,
      limit: itemsPerPage,
      categoria_id: [categoryId],  // Fallback si el backend no soporta id_subcategoria
      id_subcategoria: subcategoriaId,  // ✅ Filtro preciso por subcategoría
      id_marca: [brandId], // Solo esta marca
      buscar: resolvedSearchParams.buscar,
      visible_web: true,
      moneda_usuario: moneda,
    }),
    getMarcasByCategoria(categoryId) // Para mostrar otras marcas disponibles
  ])

  const { products, total } = productsData
  
  // Obtener otras marcas de la subcategoría para mostrar
  const relatedBrands = subcategoria.marcas
    ? subcategoria.marcas
        .filter(m => m.id !== brandId)
        .map(m => ({
          id: m.id,
          nombre: m.nombre,
          codigo: m.codigo || '',
          descripcion: '',
          logo_url: m.logo_url || '',
          sitio_web: '',
          pais_origen: '',
          activo: m.activo,
          fecha_creacion: m.fecha_asociacion || new Date().toISOString()
        }))
    : []

  const { data: categories } = categoriesData
  
  // Obtener todas las marcas de la subcategoría para los filtros
  const brands = subcategoria.marcas
    ? subcategoria.marcas.map(m => ({
        id: m.id,
        nombre: m.nombre,
        codigo: m.codigo || '',
        descripcion: '',
        logo_url: m.logo_url || '',
        sitio_web: '',
        pais_origen: '',
        activo: m.activo,
        fecha_creacion: m.fecha_asociacion || new Date().toISOString()
      }))
    : []
  
  const totalPages = total > 0 && productsData.totalPages > 0
    ? productsData.totalPages 
    : Math.ceil((total || 0) / itemsPerPage)

  // Filters state: category from route, marca from route
  const filters: FilterState = {
    categoria: [String(categoryId)],
    marca: [String(brandId)], // Solo esta marca
    precioMin: resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined,
    precioMax: resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined,
    ordenar: resolvedSearchParams.ordenar,
  }

  // ✅ Obtener todas las subcategorías de la categoría para el filtro
  const subcategoriasActivas = categoriaNavegacion.subcategorias.filter(s => s.activo)

  return (
    <Suspense fallback={<PageLoader />}>
      <CategoryClient
        category={category}
        subcategoria={subcategoria}
        subcategorias={subcategoriasActivas}
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
  } catch (error) {
    // Si es un error de NOT_FOUND, simplemente re-lanzarlo sin logging
    if (error instanceof Error && error.message === 'NEXT_NOT_FOUND') {
      throw error
    }
    
    // Si es un error de conexión/API, mostrar error y re-lanzar
    if (error instanceof Error && (
      error.message.includes('No se pueden cargar') ||
      error.message.includes('CORS') ||
      error.message.includes('conexión')
    )) {
      console.error('Error in CategoryBrandPage:', error)
      throw error
    }
    
    // Solo loguear errores inesperados
    console.error('Unexpected error in CategoryBrandPage:', error)
    notFound()
  }
}
