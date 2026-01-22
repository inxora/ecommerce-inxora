import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCategorias } from '@/lib/supabase'
import { ProductsService } from '@/lib/services/products.service'
import { CategoryClient } from '@/components/category/category-client'
import { FilterState } from '@/components/catalog/product-filters'
import { PageLoader } from '@/components/ui/loader'
import { notFound } from 'next/navigation'
import { normalizeName, buildCategorySubcategoriaUrl } from '@/lib/product-url'
import { CategoriesService, SubcategoriaNavegacion } from '@/lib/services/categories.service'

// Caché optimizado: revalidar cada 60 segundos para mejorar rendimiento
export const dynamic = 'force-dynamic'
export const revalidate = 60

interface CategorySubcategoriaPageProps {
  params: Promise<{ slug: string; subcategoria: string; locale: string }>
  searchParams: Promise<{
    page?: string
    buscar?: string
    precioMin?: string
    precioMax?: string
    ordenar?: string
    marca?: string
  }>
}

export async function generateMetadata({ params }: CategorySubcategoriaPageProps): Promise<Metadata> {
  try {
    const { slug: categorySlug, subcategoria: subcategoriaSlug, locale } = await params
    
    // ✅ OPTIMIZACIÓN: Cargar categorías y árbol de navegación en paralelo
    const [categoriesData, categoriasNavegacion] = await Promise.all([
      getCategorias(),
      CategoriesService.getCategorias()
    ])
    
    const category = categoriesData.data?.find(c => normalizeName(c.nombre) === categorySlug)
    
    if (!category) {
      return { title: 'Categoría no encontrada' }
    }

    const categoriaNavegacion = categoriasNavegacion.find(c => c.id === category.id)
    const subcategoria = categoriaNavegacion?.subcategorias.find(
      s => normalizeName(s.nombre) === subcategoriaSlug
    )
    
    if (!subcategoria) {
      return { title: 'Subcategoría no encontrada' }
    }

    // Generar URL canónica
    const baseUrl = 'https://tienda.inxora.com'
    const canonicalUrl = `${baseUrl}${buildCategorySubcategoriaUrl(category, subcategoria, locale)}`

    return {
      title: `${subcategoria.nombre} - ${category.nombre} | TIENDA INXORA - Suministros Industriales`,
      description: `Encuentra productos de ${subcategoria.nombre} en ${category.nombre} en TIENDA INXORA. Los mejores suministros industriales en Perú con envío a todo el país.`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${subcategoria.nombre} - ${category.nombre} | TIENDA INXORA`,
        description: `Productos de ${subcategoria.nombre} en ${category.nombre} - Suministros industriales de calidad.`,
        url: canonicalUrl,
      },
    }
  } catch (error) {
    console.error('Error in generateMetadata for CategorySubcategoriaPage:', error)
    // Retornar metadata por defecto en caso de error
    return {
      title: 'Categoría y Subcategoría | TIENDA INXORA',
      description: 'Suministros industriales en Perú',
    }
  }
}

export default async function CategorySubcategoriaPage({ params, searchParams }: CategorySubcategoriaPageProps) {
  try {
    const { slug: categorySlug, subcategoria: subcategoriaSlug, locale } = await params
    
    // ✅ OPTIMIZACIÓN 2: Validaciones tempranas y no bloqueantes
    const validLocales = ['es', 'en', 'pt']
    if (!validLocales.includes(locale) || locale.startsWith('.') || locale.startsWith('_')) {
      if (!locale.startsWith('.well-known') && !locale.startsWith('.')) {
        console.error(`[CategorySubcategoriaPage] Invalid locale: ${locale}`)
      }
      notFound()
    }
    if (categorySlug.startsWith('.') || categorySlug.startsWith('_')) {
      console.error(`[CategorySubcategoriaPage] Invalid categorySlug (starts with . or _): ${categorySlug}`)
      notFound()
    }
    if (subcategoriaSlug.startsWith('.') || subcategoriaSlug.startsWith('_')) {
      console.error(`[CategorySubcategoriaPage] Invalid subcategoriaSlug (starts with . or _): ${subcategoriaSlug}`)
      notFound()
    }
    
    const resolvedSearchParams = await searchParams
    const page = parseInt(resolvedSearchParams.page || '1')
    const itemsPerPage = 50

    // ✅ OPTIMIZACIÓN 1: Eliminar waterfalls - cargar categorías y árbol de navegación en paralelo
    const [categoriesData, categoriasNavegacion] = await Promise.all([
      getCategorias(),
      CategoriesService.getCategorias()
    ])
    
    const { data: allCategories, error: categoriesError } = categoriesData

    // Validación de errores de API
    if (categoriesError || !allCategories || allCategories.length === 0) {
      console.error('Error loading categories:', categoriesError)
      console.error('Category slug being searched:', categorySlug)
      throw new Error('No se pueden cargar las categorías. Por favor, verifique la conexión con el servidor.')
    }

    // ✅ OPTIMIZACIÓN 2: Simplificar lógica de búsqueda - buscar categoría y subcategoría de forma eficiente
    const category = allCategories.find(c => normalizeName(c.nombre) === categorySlug)

    if (!category) {
      console.error(`[CategorySubcategoriaPage] Category with slug "${categorySlug}" not found`)
      if (allCategories.length > 0) {
        console.log('[CategorySubcategoriaPage] Available categories:', allCategories.slice(0, 5).map(c => ({
          id: c.id,
          nombre: c.nombre,
          normalized: normalizeName(c.nombre)
        })))
      }
      notFound()
    }

    // Buscar subcategoría en el árbol de navegación ya cargado
    const categoriaNavegacion = categoriasNavegacion.find(c => c.id === category.id)
    
    if (!categoriaNavegacion) {
      console.error(`[CategorySubcategoriaPage] Category ${category.id} not found in navigation tree`)
      notFound()
    }
    
    const subcategoria = categoriaNavegacion.subcategorias.find(
      s => normalizeName(s.nombre) === subcategoriaSlug
    )

    if (!subcategoria) {
      console.error(`[CategorySubcategoriaPage] Subcategoria with slug "${subcategoriaSlug}" not found in category "${category.nombre}"`)
      if (categoriaNavegacion.subcategorias.length > 0) {
        console.log('[CategorySubcategoriaPage] Available subcategorias:', categoriaNavegacion.subcategorias.slice(0, 5).map(s => ({
          id: s.id,
          nombre: s.nombre,
          normalized: normalizeName(s.nombre),
          activo: s.activo
        })))
      }
      notFound()
    }

    const categoryId = category.id
    const subcategoriaId = subcategoria.id

    // Obtener marcas de la subcategoría
    const marcasSubcategoria = subcategoria.marcas || []
    const marcaIds = marcasSubcategoria.map(m => m.id)

    // Mapear marcas para los filtros
    const brands = marcasSubcategoria.map(m => ({
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
    
    // Si no hay marcas, retornar página vacía temprano
    if (marcasSubcategoria.length === 0) {
      return (
        <Suspense fallback={<PageLoader />}>
          <CategoryClient
            category={category}
            products={[]}
            categories={allCategories}
            brands={[]}
            relatedBrands={[]}
            total={0}
            totalPages={0}
            currentPage={1}
            filters={{
              categoria: [String(categoryId)],
            }}
            searchTerm={resolvedSearchParams.buscar || ''}
          />
        </Suspense>
      )
    }

    // Preparar filtro de marca
    const marcaFilter = resolvedSearchParams.marca 
      ? [resolvedSearchParams.marca]
      : marcaIds.length > 0 
        ? marcaIds.map(m => String(m))
        : undefined

    // ✅ OPTIMIZACIÓN 1: Fetch de productos (no puede ser paralelo porque depende de categoryId y marcaIds)
    // pero ya tenemos las categorías cargadas, así que esto es lo más rápido posible
    const productsData = await ProductsService.getProductos({
      page,
      limit: itemsPerPage + 20, // Obtener algunos productos adicionales para filtrar por subcategoría
      categoria_id: [categoryId],
      id_marca: marcaFilter ? marcaFilter.map(m => parseInt(m)) : marcaIds,
      buscar: resolvedSearchParams.buscar,
      visible_web: true,
    })

    // Filtrar productos por subcategoria_principal.id
    const productosFiltradosPorSubcategoria = (productsData.products || []).filter(
      producto => producto.subcategoria_principal?.id === subcategoriaId
    )

    // Si no hay productos, retornar página vacía temprano
    if (productosFiltradosPorSubcategoria.length === 0) {
      return (
        <Suspense fallback={<PageLoader />}>
          <CategoryClient
            category={category}
            products={[]}
            categories={allCategories}
            brands={brands}
            relatedBrands={brands}
            total={0}
            totalPages={0}
            currentPage={1}
            filters={{
              categoria: [String(categoryId)],
              marca: marcaFilter,
            }}
            searchTerm={resolvedSearchParams.buscar || ''}
          />
        </Suspense>
      )
    }

    // Calcular paginación
    const totalFiltrado = productosFiltradosPorSubcategoria.length
    const totalPagesFiltrado = Math.ceil(totalFiltrado / itemsPerPage)
    
    // Paginar los productos filtrados
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const products = productosFiltradosPorSubcategoria.slice(startIndex, endIndex)

    // Preparar filtros
    const filters: FilterState = {
      categoria: [String(categoryId)],
      marca: marcaFilter,
      precioMin: resolvedSearchParams.precioMin ? parseInt(resolvedSearchParams.precioMin) : undefined,
      precioMax: resolvedSearchParams.precioMax ? parseInt(resolvedSearchParams.precioMax) : undefined,
      ordenar: resolvedSearchParams.ordenar,
    }

    return (
      <Suspense fallback={<PageLoader />}>
        <CategoryClient
          category={category}
          products={products}
          categories={allCategories}
          brands={brands}
          relatedBrands={brands}
          total={totalFiltrado}
          totalPages={totalPagesFiltrado}
          currentPage={page}
          filters={filters}
          searchTerm={resolvedSearchParams.buscar || ''}
        />
      </Suspense>
    )
  } catch (error) {
    console.error('Error in CategorySubcategoriaPage:', error)
    
    // Si es un error de conexión/API, re-lanzar para que Next.js lo maneje como error de servidor
    if (error instanceof Error && (
      error.message.includes('No se pueden cargar') ||
      error.message.includes('CORS') ||
      error.message.includes('conexión')
    )) {
      throw error
    }
    
    // Para otros errores, mostrar 404
    notFound()
  }
}
