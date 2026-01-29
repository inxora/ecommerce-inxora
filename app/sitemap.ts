import { MetadataRoute } from 'next'
import { getCategorias, getMarcas } from '@/lib/supabase'
import { buildCategoryUrlFromObject, buildCategorySubcategoriaUrl, buildCategorySubcategoriaMarcaUrl, normalizeName } from '@/lib/product-url'
import { generateCanonicalUrl } from '@/lib/product-seo'
import { CategoriesService } from '@/lib/services/categories.service'
import { ProductsService } from '@/lib/services/products.service'
import { Producto } from '@/lib/supabase'

// Configuración para regenerar el sitemap automáticamente
// ISR: El sitemap se regenera máximo cada 1 hora (3600 segundos)
// Esto significa que productos nuevos aparecerán en máximo 1 hora
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tienda.inxora.com'
  const locale = 'es' // 🎯 CANÓNICO

  // ===============================
  // PRODUCTOS
  // ===============================

  // En build/preview limitamos a 100 productos para no alargar el build.
  // En runtime (cuando Google o un usuario piden /sitemap.xml) se usan hasta 5000 productos.
  // Si "Páginas descubiertas" en Search Console no sube: Google puede estar leyendo una versión
  // cacheada; revalidar en GSC o esperar a que Google vuelva a leer el sitemap (revalidate = 3600 s).
  const isBuildTime =
    process.env.NEXT_PHASE === 'phase-production-build' ||
    (process.env.VERCEL_ENV === 'production' && !process.env.VERCEL_URL) ||
    process.env.VERCEL_ENV === 'preview'
  const maxProductsForBuild = isBuildTime ? 100 : 5000

  if (isBuildTime) {
    console.log('🔧 [Sitemap] Build/Preview mode - limiting to 100 products for faster build')
  }
  
  // Generar URLs de productos de forma incremental para evitar alto consumo de memoria
  // Solo obtener los campos mínimos necesarios y procesar en lotes pequeños
  const productPages: MetadataRoute.Sitemap = []
  
  try {
    // Obtener productos en lotes pequeños y procesar inmediatamente
    // Esto evita acumular todos los productos en memoria
    let page = 1
    const limit = 100 // Reducir a 100 productos por página para menor consumo
    let hasMore = true
    let totalProcessed = 0
    const maxProducts = maxProductsForBuild

    while (hasMore && page <= 50 && totalProcessed < maxProducts) { // Máximo 50 páginas
      try {
        const result = await ProductsService.getProductos({
          page,
          limit,
          visible_web: true,
        })

        if (result.products && result.products.length > 0) {
          // Procesar productos inmediatamente y generar URLs sin acumular en memoria
          for (const product of result.products) {
            if (totalProcessed >= maxProducts) break
            
            if (product.seo_slug) {
              try {
                const canonicalUrl = generateCanonicalUrl(product, locale)
                // ✅ URLs con estructura: /producto/{categoria}/{subcategoria}/{marca}/{slug}
                productPages.push({
                  url: canonicalUrl,
                  lastModified: product.fecha_actualizacion
                    ? new Date(product.fecha_actualizacion)
                    : new Date(),
                  changeFrequency: 'weekly' as const,
                  priority: 0.8,
                })
                totalProcessed++
              } catch (urlError) {
                console.error(`❌ Error generating URL for product ${product.sku}:`, urlError)
              }
            }
          }
          
          // Si obtenemos menos productos que el límite, significa que es la última página
          if (result.products.length < limit) {
            hasMore = false
          } else {
            page++
          }
        } else {
          hasMore = false
        }
      } catch (pageError) {
        console.error(`❌ Error fetching products page ${page} for sitemap:`, pageError)
        hasMore = false
      }
    }

    console.log(`✅ Sitemap: Processed ${totalProcessed} products`)
  } catch (error) {
    console.error('❌ Exception processing products for sitemap:', error)
  }

  // ===============================
  // CATEGORÍAS
  // ===============================
  let categories: any[] = []
  try {
    const categoriesResult = await getCategorias()
    categories = categoriesResult.data || []
    console.log(`✅ Sitemap: Found ${categories.length} categories`)
  } catch (error) {
    console.error('❌ Error fetching categories for sitemap:', error)
  }

  // ===============================
  // PÁGINAS ESTÁTICAS
  // ===============================
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/${locale}`,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/${locale}/catalogo`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${locale}/contacto`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/${locale}/nosotros`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // ===============================
  // CATEGORÍAS (SOLO ES)
  // ===============================
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}${buildCategoryUrlFromObject(category, locale)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // ===============================
  // CATEGORÍAS CON SUBCATEGORÍA Y MARCA (SOLO ES)
  // ===============================
  const categorySubcategoriaMarcaPages: MetadataRoute.Sitemap = []
  
  // Generar URLs para cada combinación categoría/subcategoría/marca
  try {
    const categoriasNavegacion = await CategoriesService.getCategorias()
    
    for (const categoriaNavegacion of categoriasNavegacion) {
      // Buscar la categoría correspondiente en el array de categorías
      const category = categories.find(c => c.id === categoriaNavegacion.id)
      
      if (category && categoriaNavegacion.subcategorias && categoriaNavegacion.subcategorias.length > 0) {
        // Agregar URL para cada subcategoría con sus marcas
        for (const subcategoria of categoriaNavegacion.subcategorias) {
          if (subcategoria.activo && subcategoria.marcas && subcategoria.marcas.length > 0) {
            // Agregar URL para cada marca dentro de la subcategoría
            for (const marca of subcategoria.marcas) {
              if (marca.activo) {
                categorySubcategoriaMarcaPages.push({
                  url: `${baseUrl}${buildCategorySubcategoriaMarcaUrl(category, subcategoria, marca, locale)}`,
                  lastModified: new Date(),
                  changeFrequency: 'weekly' as const,
                  priority: 0.6, // Prioridad ligeramente menor que categorías base
                })
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error fetching subcategorias with marcas for sitemap:', error)
  }
  
  console.log(`✅ Sitemap: Found ${categorySubcategoriaMarcaPages.length} category-subcategoria-marca combinations`)

  // ===============================
  // PÁGINAS DE MARCA (/marca/[slug])
  // ===============================
  let marcaPages: MetadataRoute.Sitemap = []
  try {
    const { data: marcas } = await getMarcas()
    if (marcas?.length) {
      marcaPages = marcas.map((marca) => {
        const slug = normalizeName(marca.nombre) || String(marca.id)
        return {
          url: `${baseUrl}/${locale}/marca/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }
      })
      console.log(`✅ Sitemap: Found ${marcaPages.length} brand (marca) pages`)
    }
  } catch (error) {
    console.error('❌ Error fetching marcas for sitemap:', error)
  }

  return [...staticPages, ...categoryPages, ...categorySubcategoriaMarcaPages, ...marcaPages, ...productPages]
}
