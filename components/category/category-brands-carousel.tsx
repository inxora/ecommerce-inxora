'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Marca, Categoria, buildBrandLogoUrl } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { buildCategorySubcategoriaUrl, buildCategorySubcategoriaMarcaUrl, buildCategoryUrl, normalizeName } from '@/lib/product-url'
import { CategoriesService } from '@/lib/services/categories.service'

interface CategoryBrandsCarouselProps {
  brands: Marca[]
  category: Categoria
}

interface BrandLogoProps {
  brand: Marca
}

function BrandLogo({ brand }: BrandLogoProps) {
  const [imageError, setImageError] = useState(false)

  // Usar buildBrandLogoUrl para construir la URL del logo, similar a cómo se hace con imágenes de productos
  const logoUrl = brand.logo_url ? buildBrandLogoUrl(brand.logo_url) : null

  if (!logoUrl || imageError) {
    return (
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center border-2 border-gray-300 dark:border-gray-500">
        <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">
          {brand.nombre.substring(0, 2).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-50 dark:bg-slate-700 p-1 sm:p-1.5 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow border-2 border-gray-200 dark:border-gray-600">
      <Image
        src={logoUrl}
        alt={brand.nombre}
        width={120}
        height={120}
        className="object-contain w-[85%] h-[85%]"
        loading="lazy"
        unoptimized={false}
        onError={() => setImageError(true)}
      />
    </div>
  )
}

export function CategoryBrandsCarousel({ brands, category }: CategoryBrandsCarouselProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [brandUrls, setBrandUrls] = useState<Record<number, string>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const params = useParams() as { locale?: string; subcategoria?: string }
  const locale = typeof params?.locale === 'string' ? params.locale : 'es'

  // Cargar subcategorías y construir URLs para cada marca
  useEffect(() => {
    const loadBrandUrls = async () => {
      try {
        const categoriasNavegacion = await CategoriesService.getCategorias()
        const categoriaNavegacion = categoriasNavegacion.find(c => c.id === category.id)
        
        if (categoriaNavegacion) {
          const urls: Record<number, string> = {}
          
          // Obtener subcategoría actual de la URL si existe
          const currentSubcategoriaSlug = params.subcategoria
          const subcategoriaActual = currentSubcategoriaSlug
            ? categoriaNavegacion.subcategorias.find(
                sub => normalizeName(sub.nombre) === currentSubcategoriaSlug
              )
            : null
          
          brands.forEach(brand => {
            // Si hay una subcategoría actual en la URL, usarla para construir la URL
            if (subcategoriaActual) {
              // Construir URL: categoría/subcategoría/marca
              urls[brand.id] = buildCategorySubcategoriaMarcaUrl(
                category,
                subcategoriaActual,
                brand,
                locale
              )
            } else {
            // Buscar la primera subcategoría que contiene esta marca
            const subcategoriaConMarca = categoriaNavegacion.subcategorias.find(sub => 
              sub.marcas && sub.marcas.some(m => m.id === brand.id)
            )
            
            if (subcategoriaConMarca) {
              // Construir URL: categoría/subcategoría/marca
              urls[brand.id] = buildCategorySubcategoriaMarcaUrl(
                category,
                subcategoriaConMarca,
                brand,
                locale
              )
            } else {
              // Si no se encuentra, usar la primera subcategoría activa
              const primeraSubcategoria = categoriaNavegacion.subcategorias.find(sub => sub.activo)
              if (primeraSubcategoria) {
                urls[brand.id] = buildCategorySubcategoriaUrl(category, primeraSubcategoria, locale)
              } else {
                // Fallback: solo categoría
                urls[brand.id] = buildCategoryUrl(category.nombre, locale)
                }
              }
            }
          })
          
          setBrandUrls(urls)
        }
      } catch (error) {
        console.error('Error loading brand URLs:', error)
        // En caso de error, construir URLs básicas
        const urls: Record<number, string> = {}
        brands.forEach(brand => {
          urls[brand.id] = buildCategoryUrl(category.nombre, locale)
        })
        setBrandUrls(urls)
      }
    }
    
    if (brands.length > 0) {
      loadBrandUrls()
    }
  }, [brands, category, locale, params])

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollability()
    const handleResize = () => checkScrollability()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [brands])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount = container.clientWidth / 2

    const newPosition = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
  }

  if (!brands || brands.length === 0) {
    return null
  }

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
        <h2 className="text-base sm:text-lg font-bold text-inxora-dark-blue dark:text-white">
          Marcas Disponibles
        </h2>
          {params.subcategoria && (
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              ({brands.length} {brands.length === 1 ? 'marca' : 'marcas'} {params.subcategoria ? '(filtradas)' : ''})
            </span>
          )}
        </div>
        {brands.length > 3 && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-1.5 sm:p-2 rounded-full bg-inxora-light-blue/20 dark:bg-slate-700 hover:bg-inxora-light-blue/30 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-inxora-blue dark:text-gray-300" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-1.5 sm:p-2 rounded-full bg-inxora-light-blue/20 dark:bg-slate-700 hover:bg-inxora-light-blue/30 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-inxora-blue dark:text-gray-300" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        onScroll={checkScrollability}
      >
        {brands.map((brand) => {
          // Usar URL de subcategoría/marca si está disponible, sino usar fallback
          const brandUrl = brandUrls[brand.id] || buildCategoryUrl(category.nombre, locale)
          return (
          <Link
            key={brand.id}
            href={brandUrl}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-2 sm:p-3 rounded-lg hover:bg-inxora-light-blue/10 dark:hover:bg-slate-700 transition-colors min-w-[100px] sm:min-w-[110px]"
          >
            <BrandLogo brand={brand} />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
              {brand.nombre}
            </span>
          </Link>
          )
        })}
      </div>
    </div>
  )
}

