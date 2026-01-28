'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Categoria } from '@/lib/supabase'
import { buildCategoryUrlFromObject } from '@/lib/product-url'

interface CategoriesCarouselProps {
  categories: Categoria[]
  locale: string
}

export function CategoriesCarousel({ categories, locale }: CategoriesCarouselProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
  }, [categories])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount = container.clientWidth * 0.8

    const newPosition = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
  }

  const handleImageError = (categoryId: number) => {
    setImageErrors(prev => ({ ...prev, [categoryId]: true }))
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No hay categorías disponibles</p>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Botones de navegación */}
      {categories.length > 4 && (
        <>
          {/* Botón izquierdo */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 ${
              !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-inxora-dark-blue dark:text-white" />
          </button>

          {/* Botón derecho */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 ${
              !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-inxora-dark-blue dark:text-white" />
          </button>
        </>
      )}

      {/* Gradientes laterales para indicar más contenido */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background-light dark:from-background-dark to-transparent z-[5] pointer-events-none" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background-light dark:from-background-dark to-transparent z-[5] pointer-events-none" />
      )}

      {/* Contenedor del carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-4"
        onScroll={checkScrollability}
      >
        {categories.map((category) => {
          const categoryUrl = buildCategoryUrlFromObject(category, locale)
          const hasError = imageErrors[category.id]

          return (
            <Link
              key={category.id}
              href={categoryUrl}
              className="group flex-shrink-0 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
              style={{ width: 'clamp(140px, 18vw, 200px)' }}
            >
              {/* Contenedor de imagen con efecto hover */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                {category.logo_url && !hasError ? (
                  <Image
                    src={category.logo_url}
                    alt={`Categoría ${category.nombre} - Suministros industriales`}
                    title={`Categoría ${category.nombre} - Suministros industriales`}
                    fill
                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 200px"
                    className="object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={() => handleImageError(category.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-inxora-light-blue/20 to-inxora-blue/20">
                    <span className="text-2xl sm:text-3xl font-bold text-inxora-blue">
                      {category.nombre.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Nombre de la categoría */}
              <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-inxora-dark-blue dark:text-white leading-tight line-clamp-2 group-hover:text-inxora-blue dark:group-hover:text-inxora-light-blue transition-colors">
                {category.nombre}
              </h3>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
