import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto | TIENDA INXORA - Atención al Cliente',
  description: 'Contáctanos para cotizaciones rápidas, asesoría técnica especializada y atención inmediata. WhatsApp, email y teléfono disponibles 24/7.',
  keywords: 'contacto INXORA, cotización industrial, atención al cliente, soporte técnico, WhatsApp',
  openGraph: {
    title: 'Contacto | TIENDA INXORA',
    description: 'Contáctanos para cotizaciones rápidas y asesoría técnica especializada.',
    type: 'website',
  },
}

export default function ContactoPage({ params }: { params: { locale: string } }) {
  const { locale } = params

  return (
    <div className="bg-background-light dark:bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contacto</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Estamos aquí para ayudarte. Contáctanos para cotizaciones rápidas, asesoría técnica especializada y atención inmediata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Envíanos un mensaje</h2>
            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                <input type="text" className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary h-11 px-4" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary h-11 px-4" placeholder="tucorreo@ejemplo.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asunto</label>
                <input type="text" className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary h-11 px-4" placeholder="Consulta, cotización, soporte" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mensaje</label>
                <textarea className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary h-24 px-4" placeholder="Cuéntanos cómo podemos ayudarte" />
              </div>
              <button type="submit" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90">
                Enviar mensaje
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Atención inmediata</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Puedes cotizar al instante, responder por WhatsApp y confirmar despachos. Nuestro equipo brinda atención 24/7.
            </p>
            <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Dirección:</strong> Av. Óscar R. Benavides 3046, Lima 15081, Perú</p>
              <p><strong>Teléfono:</strong> +51 946 885 531</p>
              <p><strong>Email:</strong> contacto@inxora.com</p>
              <p><strong>WhatsApp:</strong> Atención inmediata</p>
            </div>
            <div className="mt-6 flex gap-3">
              <Link href={`/${locale}/catalogo`} className="inline-flex items-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary/5">
                Ver catálogo
              </Link>
              <Link href={`/${locale}`} className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90">
                Ir al inicio
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">FAQ y soporte</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Encuentra respuestas a preguntas frecuentes y soporte técnico para tus compras industriales.
          </p>
          <div className="mt-4">
            <Link href={`/${locale}/categorias`} className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90">
              Ver categorías
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}