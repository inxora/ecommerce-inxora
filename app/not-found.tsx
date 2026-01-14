'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Contador regresivo antes de redirigir
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Redirigir después de 5 segundos
      router.replace('/es')
    }
  }, [countdown, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="text-center px-4 max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Página no encontrada
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Serás redirigido automáticamente a la página principal en {countdown} segundo{countdown !== 1 ? 's' : ''}...
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/es"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Ir a la página principal ahora
          </Link>
          <Link
            href="/es/catalogo"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
