export default function TerminosPage({ params }: { params: { locale: string } }) {
  const { locale } = params

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 lg:p-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Términos y Condiciones
          </h1>

          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 space-y-6">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Estos Términos y Condiciones regulan el acceso y uso del sitio web de INXORA, con RUC 20603436475 (TECNOTOTAL S.A.C.), así como la contratación de productos y servicios ofrecidos a través del mismo. Al acceder y utilizar este sitio web, el usuario acepta estos términos en su totalidad.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Información General</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                INXORA es una plataforma digital dedicada a la comercialización de suministros industriales en Perú. El titular del sitio web es TECNOTOTAL S.A.C., con RUC 20603436475.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Condiciones de Uso</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                El usuario se compromete a utilizar el sitio web, sus servicios y contenidos sin contravenir la legislación vigente, la buena fe, los usos generalmente aceptados y el orden público. Queda prohibido el uso del sitio web con fines ilícitos o lesivos para INXORA o cualquier tercero.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Propiedad Intelectual</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Todos los contenidos del sitio web (textos, imágenes, marcas, logotipos, archivos de software, etc.) son propiedad de INXORA o de terceros que han autorizado su uso. Queda prohibida su reproducción, distribución o modificación sin autorización expresa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Responsabilidad</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                INXORA no se responsabiliza por los daños y perjuicios de cualquier naturaleza que puedan derivarse de la falta de disponibilidad o continuidad del funcionamiento del sitio web, así como de los errores u omisiones en los contenidos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Modificaciones</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                INXORA se reserva el derecho de modificar, en cualquier momento y sin previo aviso, la presentación y configuración del sitio web, así como los presentes Términos y Condiciones.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">6. Ley Aplicable y Jurisdicción</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Estos Términos y Condiciones se rigen por la legislación peruana. Para cualquier controversia que pudiera derivarse del acceso o uso del sitio web, las partes se someten a los juzgados y tribunales de Lima, Perú.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}


