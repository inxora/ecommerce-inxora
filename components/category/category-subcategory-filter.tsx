'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CategoriesService, SubcategoriaNavegacion } from '@/lib/services/categories.service'
import { buildCategorySubcategoriaUrl, normalizeName } from '@/lib/product-url'
import { Categoria } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface CategorySubcategoryFilterProps {
  category: Categoria
  locale: string
}

export function CategorySubcategoryFilter({ category, locale }: CategorySubcategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams() as { locale?: string; slug?: string; subcategoria?: string; marca?: string }
  const [subcategorias, setSubcategorias] = useState<SubcategoriaNavegacion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<SubcategoriaNavegacion | null>(null)
  
  // ✅ FIX: Estabilizar params.subcategoria con useRef para evitar bucles infinitos
  const subcategoriaRef = useRef<string | undefined>(params.subcategoria)
  const categoryIdRef = useRef<number>(category.id)
  const lastCategoryIdRef = useRef<number>(category.id)
  const lastSubcategoriaRef = useRef<string | undefined>(params.subcategoria)

  // Cargar subcategorías de la categoría
  useEffect(() => {
    // Actualizar refs cuando cambien los valores
    subcategoriaRef.current = params.subcategoria
    categoryIdRef.current = category.id
    
    // Solo ejecutar si realmente cambió el categoryId o subcategoria
    const categoryIdChanged = lastCategoryIdRef.current !== category.id
    const subcategoriaChanged = lastSubcategoriaRef.current !== params.subcategoria
    
    if (!categoryIdChanged && !subcategoriaChanged) {
      return // No hacer nada si no hay cambios reales
    }
    
    // Actualizar los refs de seguimiento
    lastCategoryIdRef.current = category.id
    lastSubcategoriaRef.current = params.subcategoria
    
    const loadSubcategorias = async () => {
      try {
        setLoading(true)
        const categoriasNavegacion = await CategoriesService.getCategorias()
        const categoriaNavegacion = categoriasNavegacion.find(c => c.id === category.id)
        
        if (categoriaNavegacion) {
          // Filtrar solo subcategorías activas
          const subcategoriasActivas = categoriaNavegacion.subcategorias.filter(sub => sub.activo)
          setSubcategorias(subcategoriasActivas)
          
          // Si hay una subcategoría en la URL, establecerla como seleccionada
          if (params.subcategoria) {
            const subcategoriaFromUrl = subcategoriasActivas.find(
              sub => normalizeName(sub.nombre) === params.subcategoria
            )
            if (subcategoriaFromUrl) {
              setSelectedSubcategoria(subcategoriaFromUrl)
            } else {
              setSelectedSubcategoria(null)
            }
          } else {
            setSelectedSubcategoria(null)
          }
        }
      } catch (error) {
        console.error('Error loading subcategorias:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubcategorias()
  }, [category.id, params.subcategoria])

  const handleSubcategoriaClick = (subcategoria: SubcategoriaNavegacion) => {
    // Si ya está seleccionada, deseleccionar (volver a categoría)
    if (selectedSubcategoria?.id === subcategoria.id) {
      const categoryUrl = `/${locale}/${normalizeName(category.nombre)}`
      router.push(categoryUrl)
      setSelectedSubcategoria(null)
    } else {
      // Navegar a categoría/subcategoría
      const subcategoriaUrl = buildCategorySubcategoriaUrl(category, subcategoria, locale)
      router.push(subcategoriaUrl)
      setSelectedSubcategoria(subcategoria)
    }
  }

  const handleClearFilter = () => {
    const categoryUrl = `/${locale}/${normalizeName(category.nombre)}`
    router.push(categoryUrl)
    setSelectedSubcategoria(null)
  }

  if (loading) {
    return (
      <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-3"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-32"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  if (subcategorias.length === 0) {
    return null
  }

  const hasActiveFilter = selectedSubcategoria !== null

  return (
    <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Filtrar por Subcategoría
          </h3>
          {hasActiveFilter && (
            <Badge variant="secondary" className="text-xs">
              {1} activo
            </Badge>
          )}
        </div>
        {hasActiveFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilter}
            className="h-7 px-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {subcategorias.map((subcategoria) => {
          const isSelected = selectedSubcategoria?.id === subcategoria.id
          const productCount = subcategoria.total_productos || 0

          return (
            <button
              key={subcategoria.id}
              onClick={() => handleSubcategoriaClick(subcategoria)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                "border-2",
                isSelected
                  ? "bg-[#139ED4] text-white border-[#139ED4] shadow-md"
                  : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#139ED4] hover:bg-[#139ED4]/10 dark:hover:bg-[#139ED4]/20"
              )}
            >
              <span>{subcategoria.nombre}</span>
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className={cn(
                  "text-xs font-semibold",
                  isSelected
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                )}
              >
                {productCount}
              </Badge>
              {isSelected && (
                <X className="h-3 w-3 ml-1" />
              )}
            </button>
          )
        })}
      </div>

      {hasActiveFilter && (
        <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          Mostrando productos y marcas de las subcategorías seleccionadas
        </p>
      )}
    </div>
  )
}
