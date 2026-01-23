import { api, apiClient } from '@/lib/api/client'

// Tipos para la respuesta del endpoint
export interface MarcaNavegacion {
  id: number
  nombre: string
  codigo: string | null
  logo_url: string | null
  activo: boolean
  es_especialista: boolean
  total_productos: number
  fecha_asociacion: string
}

export interface SubcategoriaNavegacion {
  id: number
  nombre: string
  codigo: string
  descripcion: string
  categoria_id: number
  orden: number
  activo: boolean
  imagen_url: string | null
  color_tema: string | null
  total_productos: number
  marcas: MarcaNavegacion[] | null
}

export interface CategoriaNavegacion {
  id: number
  nombre: string
  descripcion: string
  logo_url: string | null
  activo: boolean
  subcategorias: SubcategoriaNavegacion[] // Ahora viene como array directamente
}

export interface ArbolNavegacionResponse {
  success: boolean
  data: {
    categorias: CategoriaNavegacion[]
    total_categorias: number
  }
  message: string
  metadata: {
    incluir_inactivas: boolean
    incluir_conteos: boolean
    total_categorias: number
  }
  timestamp: string
  status_code: number | null
}

export const CategoriesService = {
  /**
   * Obtiene el árbol de navegación completo con categorías, subcategorías y marcas
   * Con timeout y manejo de errores optimizado
   */
  getArbolNavegacion: async (): Promise<ArbolNavegacionResponse> => {
    try {
      // ✅ FIX: Usar revalidate en todos los entornos para compatibilidad con build estático
      // En desarrollo: revalidar cada 60 segundos
      // En producción: revalidar cada 60 segundos (permite build estático + datos frescos)
      const cacheOptions = { next: { revalidate: 60 } }
      
      // Usar apiClient directamente para poder agregar timeout
      const response = await apiClient<ArbolNavegacionResponse>('/api/test/ecommerce/arbol-navegacion', {
        method: 'GET',
        ...cacheOptions,
      })
      
      // Validar estructura de respuesta
      if (!response || !response.success || !response.data || !Array.isArray(response.data.categorias)) {
        console.error('Invalid response structure from arbol-navegacion endpoint:', response)
        throw new Error('Invalid response structure from API')
      }
      
      return response
    } catch (error) {
      console.error('Error fetching arbol-navegacion:', error)
      // Si es un timeout, loggear específicamente
      if (error instanceof Error && error.message.includes('timeout')) {
        console.error('Error: Timeout obteniendo árbol de navegación')
      }
      // Si es un error de CORS, lanzar error más descriptivo
      if (error instanceof Error && error.name === 'CORSError') {
        throw new Error('CORS error: No se puede acceder al endpoint. Verifique la configuración CORS del servidor.')
      }
      throw error
    }
  },

  /**
   * Obtiene las categorías con sus subcategorías ya parseadas (ahora vienen como array directamente)
   * Sin caché para verificar que el endpoint funcione correctamente
   */
  getCategorias: async (): Promise<CategoriaNavegacion[]> => {
    try {
      const response = await CategoriesService.getArbolNavegacion()
      
      // Validar que las subcategorías sean arrays válidos
      const categorias = response.data.categorias.map(categoria => {
        // Validar que subcategorias sea un array
        if (!Array.isArray(categoria.subcategorias)) {
          console.warn(`Invalid subcategorias for category ${categoria.id}: expected array, got ${typeof categoria.subcategorias}`)
          return {
            ...categoria,
            subcategorias: [] as SubcategoriaNavegacion[]
          }
        }
        
        return categoria
      })
      
      return categorias
    } catch (error) {
      console.error('Error in getCategorias:', error)
      throw error
    }
  },

  /**
   * Obtiene las marcas de una categoría específica desde el árbol de navegación
   */
  getMarcasByCategoria: async (categoriaId: number): Promise<MarcaNavegacion[]> => {
    try {
      const categorias = await CategoriesService.getCategorias()
      
      const categoria = categorias.find(cat => cat.id === categoriaId)
      if (!categoria) {
        console.warn(`Category ${categoriaId} not found in arbol-navegacion`)
        return []
      }

      // Recolectar todas las marcas de las subcategorías
      const marcasMap = new Map<number, MarcaNavegacion>()
      
      categoria.subcategorias.forEach(subcategoria => {
        if (subcategoria.marcas && Array.isArray(subcategoria.marcas)) {
          subcategoria.marcas.forEach(marca => {
            // Validar que la marca tenga los campos necesarios
            if (marca && marca.id && marca.nombre) {
              // Usar Map para evitar duplicados por ID
              if (!marcasMap.has(marca.id)) {
                marcasMap.set(marca.id, marca)
              }
            }
          })
        }
      })

      return Array.from(marcasMap.values())
    } catch (error) {
      console.error(`Error getting marcas for category ${categoriaId}:`, error)
      return []
    }
  },

  /**
   * Obtiene las subcategorías con sus marcas limitadas (para mostrar en el sidebar)
   * @param categoriaId - ID de la categoría
   * @param maxMarcasPorSubcategoria - Máximo de marcas a mostrar por subcategoría (default: 6)
   */
  getSubcategoriasConMarcas: async (
    categoriaId: number, 
    maxMarcasPorSubcategoria: number = 6
  ): Promise<SubcategoriaNavegacion[]> => {
    try {
      const categorias = await CategoriesService.getCategorias()
      
      const categoria = categorias.find(cat => cat.id === categoriaId)
      if (!categoria) {
        console.warn(`Category ${categoriaId} not found in arbol-navegacion`)
        return []
      }

      // Filtrar subcategorías que tengan marcas y limitar la cantidad de marcas
      return categoria.subcategorias
        .filter(sub => {
          // Validar que tenga marcas y sea un array válido
          return sub.marcas && Array.isArray(sub.marcas) && sub.marcas.length > 0
        })
        .map(subcategoria => ({
          ...subcategoria,
          // Limitar las marcas a maxMarcasPorSubcategoria
          marcas: subcategoria.marcas 
            ? subcategoria.marcas.slice(0, maxMarcasPorSubcategoria).filter(marca => marca && marca.id && marca.nombre)
            : null
        }))
        .filter(sub => sub.marcas && Array.isArray(sub.marcas) && sub.marcas.length > 0) // Filtrar subcategorías sin marcas después del slice
    } catch (error) {
      console.error(`Error getting subcategorias with marcas for category ${categoriaId}:`, error)
      return []
    }
  }
}
