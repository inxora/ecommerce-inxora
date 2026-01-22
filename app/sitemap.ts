import { MetadataRoute } from 'next'
import { getCategorias } from '@/lib/supabase'
import { buildCategoryUrlFromObject, buildCategorySubcategoriaUrl, buildCategorySubcategoriaMarcaUrl } from '@/lib/product-url'
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
    const maxProducts = 5000 // Limitar a 5000 productos máximo para el sitemap

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

  // Los productos ya fueron procesados arriba de forma incremental
  // productPages ya contiene todas las URLs de productos generadas

  return [...staticPages, ...categoryPages, ...categorySubcategoriaMarcaPages, ...productPages]
}
