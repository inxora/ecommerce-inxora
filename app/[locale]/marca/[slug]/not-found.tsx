'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MarcaNotFound() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'es'

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
          <Package className="h-10 w-10 text-gray-500 dark:text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Marca no encontrada
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Pronto estaremos aumentando nuestro catálogo. Mientras tanto, explora nuestras categorías o busca otro término.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" className="bg-inxora-blue hover:bg-inxora-blue/90">
            <Link href={`/${locale}/catalogo`}>Ver catálogo</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}`}>Ir al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
