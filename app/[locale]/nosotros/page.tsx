import Link from 'next/link'

export default function NosotrosPage({ params }: { params: { locale: string } }) {
  const { locale } = params

  return (
    <div className="bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nosotros</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            INXORA es el primer marketplace industrial del Perú, potenciado con inteligencia artificial, enfocado en simplificar y optimizar la compra de suministros industriales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Nuestra propuesta</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Eliminamos intermediarios, reducimos tiempos de cotización y brindamos asesoría técnica especializada para cada industria. Con precios directos de fábrica y despacho consolidado a nivel nacional, ayudamos a las empresas a comprar mejor y más rápido.
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Cotizaciones rápidas y transparentes en menos de 24 horas</li>
              <li>Precios directos de fabricantes y distribuidores</li>
              <li>Soporte técnico especializado por sector</li>
              <li>Despacho eficiente y cobertura nacional</li>
              <li>Opciones de facturación a crédito</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cómo funciona</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Un proceso simple: cotiza al instante, confirma por WhatsApp y recibe atención 24/7. Trabajamos con proveedores aliados para garantizar calidad certificada y seguridad en cada transacción.
            </p>
            <div className="mt-4">
              <Link
                href={`/${locale}/catalogo`}
                className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
              >
                Ver Catálogo Completo
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reconocimientos y Alianzas</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            INXORA ha sido reconocida por su innovación y compromiso con la industria. Seguimos construyendo alianzas con los mejores fabricantes para ofrecer productos certificados y soporte técnico confiable.
          </p>
          <div className="mt-4">
            <Link
              href={`/${locale}/contacto`}
              className="inline-flex items-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary/5"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}