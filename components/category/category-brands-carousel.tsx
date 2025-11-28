'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Marca, Categoria, buildBrandLogoUrl } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { buildCategoryUrl } from '@/lib/product-url'

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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const params = useParams() as { locale?: string }
  const locale = typeof params?.locale === 'string' ? params.locale : 'es'
  const categoryUrl = buildCategoryUrl(category.nombre, locale)

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
        <h2 className="text-base sm:text-lg font-bold text-inxora-dark-blue dark:text-white">
          Marcas Disponibles
        </h2>
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
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`${categoryUrl}?marca=${brand.id}`}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-2 sm:p-3 rounded-lg hover:bg-inxora-light-blue/10 dark:hover:bg-slate-700 transition-colors min-w-[100px] sm:min-w-[110px]"
          >
            <BrandLogo brand={brand} />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
              {brand.nombre}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

