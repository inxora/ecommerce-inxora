"use client"

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const handleImageError = (index: number) => {
    console.warn(`Error cargando imagen ${index} para producto: ${productName}`)
    setImageErrors(prev => new Set(prev).add(index))
  }

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Sin imagen</span>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-lg overflow-hidden border">
        {images[currentImage] && images[currentImage].trim() !== '' && images[currentImage] !== '/placeholder-product.svg' && !imageErrors.has(currentImage) ? (
          <Image
            src={images[currentImage]}
            alt={`${productName || 'Producto'} - Imagen ${currentImage + 1}`}
            fill
            className="object-contain"
            priority
            onError={() => handleImageError(currentImage)}
            unoptimized={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2" aria-label={productName || 'Producto sin imagen'}>
                {productName || 'Sin imagen disponible'}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Imagen no disponible
              </p>
            </div>
          </div>
        )}
        
        {/* Navigation arrows for multiple images */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="relative aspect-square">
              {images[currentImage] && images[currentImage].trim() !== '' && images[currentImage] !== '/placeholder-product.svg' && !imageErrors.has(currentImage) ? (
                <Image
                  src={images[currentImage]}
                  alt={`${productName || 'Producto'} - Imagen ampliada`}
                  fill
                  className="object-contain"
                  onError={() => handleImageError(currentImage)}
                  unoptimized={false}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2" aria-label={productName || 'Producto sin imagen'}>
                      {productName || 'Sin imagen disponible'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Imagen no disponible
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600",
                currentImage === index
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground"
              )}
            >
              {image && image.trim() !== '' && image !== '/placeholder-product.svg' && !imageErrors.has(index) ? (
                <Image
                  src={image}
                  alt={`${productName || 'Producto'} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(index)}
                  unoptimized={false}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs text-center line-clamp-2">
                    {productName || 'Sin imagen'}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}