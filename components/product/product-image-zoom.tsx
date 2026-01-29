'use client'

import { useState, useRef } from 'react'
import { ZoomIn } from 'lucide-react'
import Image from 'next/image'

interface ProductImageZoomProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function ProductImageZoom({ src, alt, className = '', priority = false }: ProductImageZoomProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [imageError, setImageError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setMousePosition({ 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)) 
    })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // Verificar si la imagen es válida o es un placeholder
  const hasValidImage = src && src.trim() !== '' && src !== '/placeholder-product.svg' && !imageError

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {hasValidImage ? (
        <>
        <div
          className="absolute inset-0 transition-transform duration-300 will-change-transform"
          style={{
            transform: isHovering ? 'scale(2)' : 'scale(1)',
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
          }}
        >
          <Image
            src={src}
            alt={alt || 'Imagen del producto'}
            title={alt || 'Imagen del producto'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
            loading={priority ? undefined : 'lazy'}
            quality={priority ? 90 : 75}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            unoptimized
              onError={(e) => {
                // Silenciar el error para evitar que cierre el servidor
                console.warn(`Error cargando imagen: ${src}`)
                setImageError(true)
                // Prevenir propagación del error
                e.stopPropagation()
              }}
              onLoad={() => {
                setImageError(false)
              }}
          />
        </div>
          {/* Fallback que se muestra si la imagen falla */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 z-10">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2" aria-label={alt || 'Producto sin imagen'}>
                  {alt || 'Sin imagen disponible'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Imagen no disponible
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2" aria-label={alt || 'Producto sin imagen'}>
              {alt || 'Sin imagen disponible'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Imagen no disponible
            </p>
          </div>
        </div>
      )}
      
      {/* Zoom Icon Overlay */}
      <div
        className={`absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-white/90 rounded-full p-3 shadow-lg">
          <ZoomIn className="h-6 w-6 text-gray-800" />
        </div>
      </div>
    </div>
  )
}

