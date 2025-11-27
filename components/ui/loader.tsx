import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function Loader({ className, size = 'md', text }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader size="lg" text="Cargando productos..." />
    </div>
  )
}

export function ProductGridLoader({ count = 4 }: { count?: number }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader size="lg" text="Cargando productos..." />
    </div>
  )
}

