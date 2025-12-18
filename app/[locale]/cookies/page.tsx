import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | TIENDA INXORA',
  description: 'Información sobre el uso de cookies en el sitio web de INXORA. Tipos de cookies y cómo gestionarlas.',
  robots: 'index, follow',
}

export default function CookiesPage({ params }: { params: { locale: string } }) {
  const { locale } = params

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 lg:p-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Política de Cookies
          </h1>

          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 space-y-6">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Esta Política de Cookies explica qué son las cookies y cómo las utiliza INXORA, con RUC 20603436475 (TECNOTOTAL S.A.C.), en su sitio web. Al navegar o utilizar nuestros servicios, el usuario acepta el uso que hacemos de las cookies, de acuerdo con lo establecido en esta política.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">¿Qué son las cookies?</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten que el sitio recuerde información sobre su visita, lo que puede facilitar su próxima visita y hacer que el sitio le resulte más útil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">¿Qué tipos de cookies utiliza este sitio web?</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
                <li><strong>Cookies técnicas:</strong> Son necesarias para el funcionamiento del sitio web y no requieren consentimiento del usuario.</li>
                <li><strong>Cookies de personalización:</strong> Permiten al usuario acceder al servicio con algunas características de carácter general predefinidas.</li>
                <li><strong>Cookies de análisis:</strong> Permiten el seguimiento y análisis del comportamiento de los usuarios en el sitio web.</li>
                <li><strong>Cookies publicitarias:</strong> Permiten la gestión de los espacios publicitarios que, en su caso, el editor haya incluido en una página web.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">¿Cómo puede el usuario gestionar las cookies?</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                El usuario puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su dispositivo. En caso de que bloquee el uso de cookies en su navegador, es posible que algunos servicios o funcionalidades del sitio web no estén disponibles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Cookies de terceros</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Este sitio web puede utilizar servicios de terceros que recopilarán información con fines estadísticos, de uso del sitio por parte del usuario y para la prestación de otros servicios relacionados con la actividad del sitio web y otros servicios de Internet.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Actualizaciones y cambios en la política de cookies</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                INXORA puede modificar esta Política de Cookies en función de exigencias legislativas, reglamentarias, o con la finalidad de adaptar dicha política a las instrucciones dictadas por la Autoridad de Protección de Datos Personales. Se aconseja a los usuarios que la visiten periódicamente.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}


