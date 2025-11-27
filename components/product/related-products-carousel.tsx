'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/catalog/product-card'
import { Producto } from '@/lib/supabase'

interface RelatedProductsCarouselProps {
  products: Producto[]
  title?: string
}

export function RelatedProductsCarousel({ products, title = 'Productos Relacionados' }: RelatedProductsCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateScrollButtons = () => {
      if (!scrollContainerRef.current) return
      const container = scrollContainerRef.current
      const { scrollLeft, scrollWidth, clientWidth } = container
      setScrollPosition(scrollLeft)
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }

    const container = scrollContainerRef.current
    if (container) {
      updateScrollButtons()
      container.addEventListener('scroll', updateScrollButtons)
      window.addEventListener('resize', updateScrollButtons)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateScrollButtons)
        window.removeEventListener('resize', updateScrollButtons)
      }
    }
  }, [products])

  if (!products || products.length === 0) {
    return null
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    // Calcular el ancho del card según el tamaño de pantalla
    const isMobile = window.innerWidth < 640
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024
    const cardWidth = isMobile ? 280 : isTablet ? 320 : 360
    const gap = isMobile ? 16 : 24
    const scrollAmount = (cardWidth + gap) * 1.5 // Scroll 1.5 cards a la vez

    const currentScroll = container.scrollLeft
    const newPosition = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount

    const maxScroll = container.scrollWidth - container.clientWidth
    const clampedPosition = Math.max(0, Math.min(newPosition, maxScroll))

    container.scrollTo({
      left: clampedPosition,
      behavior: 'smooth'
    })
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        {products.length > 2 && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        )}
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
        onScroll={(e) => {
          const target = e.currentTarget
          setScrollPosition(target.scrollLeft)
        }}
      >
        {products.map((product) => (
          <div key={product.sku} className="flex-shrink-0 w-[240px] sm:w-[260px] lg:w-[280px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

