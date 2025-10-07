import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Producto no encontrado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            El producto que buscas no existe o no está disponible.
          </p>
          <Link
            href="/es/catalogo"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}