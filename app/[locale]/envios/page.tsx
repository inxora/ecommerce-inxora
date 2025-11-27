'use client'

import { Truck, Shield, MapPin, CheckCircle, Building2, HelpCircle, Factory, Wrench, Lock } from 'lucide-react'
import { Accordion, AccordionItem } from '@/components/ui/accordion'

export default function EnviosPage({ params }: { params: { locale: string } }) {
  const { locale } = params

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-transform">
              <Truck className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Delivery Última Milla – Tarifa Plana
            </h1>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-12">
            {/* Introducción */}
            <section className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              <div className="pl-8">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  En <span className="font-bold text-blue-600 dark:text-blue-400">INXORA</span> brindamos un servicio de delivery seguro, confiable y con garantía, pensado para empresas, obras e industrias que requieren entregas puntuales y sin riesgos.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 border-l-4 border-blue-500">
                  <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                    Con nuestra <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">tarifa plana de S/ 20</span> en Lima Metropolitana y Callao, ofrecemos un servicio profesional para pedidos menores de <strong>50 kg</strong> y un volumen total ≤ <strong>1.5 m (largo) x 1.2 m (ancho) x 1.2 m (alto)</strong> (capacidad útil de minivan).
                  </p>
                </div>
              </div>
            </section>

            {/* Seguridad y garantía */}
            <section className="relative">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Seguridad y garantía en cada entrega
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 group">
                      <div className="mt-1.5 w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                        <span className="font-semibold text-gray-900 dark:text-white">Personal capacitado</span> con SCTR (Seguro Complementario de Trabajo de Riesgo), EPPs completos y formación en manejo defensivo.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 group">
                      <div className="mt-1.5 w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                        <span className="font-semibold text-gray-900 dark:text-white">Vehículos equipados</span> con conos de señalización, tacos de seguridad, circulina, alarma y accesorios obligatorios para ingresar a plantas industriales, obras de construcción y empresas con protocolos de seguridad.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 group">
                      <div className="mt-1.5 w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                        <span className="font-semibold text-gray-900 dark:text-white">Procedimientos de entrega controlados</span>, garantizando cumplimiento de normas de seguridad y requerimientos de acceso.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cobertura distrital */}
            <section className="relative">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-3 shadow-lg">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Cobertura distrital
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <p className="font-bold text-lg text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        Callao
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">Todos sus distritos</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
                      <p className="font-bold text-lg text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                        Lima Metropolitana
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        Cercado de Lima, San Martín de Porres, Los Olivos, Independencia, El Agustino, San Juan de Lurigancho, San Luis, Santa Anita, La Victoria, Breña, Jesús María, Lince, Barranco, Miraflores, Pueblo Libre, Magdalena, San Miguel, San Borja, San Isidro, San Juan de Miraflores, Santiago de Surco.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Condiciones de servicio */}
            <section className="relative">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 shadow-lg">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Condiciones de servicio
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border-2 border-emerald-200 dark:border-emerald-800 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Válido solo</span> para productos adquiridos en nuestro e-commerce INXORA.
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border-2 border-emerald-200 dark:border-emerald-800 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Peso máximo:</span> 50 kg
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border-2 border-emerald-200 dark:border-emerald-800 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Volumen máximo:</span> 1.5 m x 1.2 m x 1.2 m
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border-2 border-emerald-200 dark:border-emerald-800 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-gray-700 dark:text-gray-300">
                        Si tu carga supera los límites indicados o la ubicación está fuera de la zona de cobertura, <span className="font-semibold text-emerald-600 dark:text-emerald-400">solicita una cotización personalizada</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Información de contacto */}
            <section className="relative">
              <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl p-8 shadow-2xl transform hover:scale-[1.02] transition-transform">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-white text-lg leading-relaxed">
                    <strong className="text-xl">¿No encuentras el producto en nuestra web?</strong>
                  </p>
                  <p className="text-white/90 mt-3 leading-relaxed">
                    Solicita cotización personalizada a{' '}
                    <a href="tel:+51946885531" className="font-bold text-white underline hover:text-blue-100 transition-colors">
                      +51 946 885 531
                    </a>{' '}
                    o{' '}
                    <a href="mailto:jhuamani@inxora.com" className="font-bold text-white underline hover:text-blue-100 transition-colors">
                      jhuamani@inxora.com
                    </a>{' '}
                    y coordinamos tu despacho.
                  </p>
                </div>
              </div>
            </section>

            {/* Ideal para */}
            <section className="relative">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-3 shadow-lg">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Ideal para
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-500 rounded-lg p-2">
                          <Factory className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Empresas industriales y manufactureras</h3>
                      </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-6 border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-orange-500 rounded-lg p-2">
                          <Wrench className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Obras de construcción y proyectos de ingeniería</h3>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-6 border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-green-500 rounded-lg p-2">
                          <Lock className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Plantas con protocolos de seguridad y control de accesos</h3>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border-l-4 border-red-500">
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
                      Con <span className="font-bold text-red-600 dark:text-red-400">INXORA</span> no solo adquieres un servicio de delivery, sino un <span className="font-semibold">socio logístico confiable</span> que entiende los requisitos del sector industrial.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ adicional */}
            <section className="relative mt-16">
              <div className="flex items-start gap-4 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 shadow-lg">
                  <HelpCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    FAQ adicional
                  </h2>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-purple-900">
                    <Accordion>
                <AccordionItem
                  question="¿El personal de entrega cumple requisitos de seguridad industrial?"
                  answer="Sí. Todo nuestro personal cuenta con SCTR, EPPs completos y capacitación en manejo defensivo, cumpliendo protocolos de seguridad en plantas y obras."
                />
                <AccordionItem
                  question="¿Los vehículos están equipados para ingreso a empresas e industrias?"
                  answer="Sí. Contamos con conos, tacos, circulina, alarma y accesorios de seguridad exigidos en entornos industriales y de construcción."
                />
                <AccordionItem
                  question="¿Qué pasa si mi carga supera los límites de peso o volumen?"
                  answer="Si el pedido es mayor a 50 kg o excede 1.5 m x 1.2 m x 1.2 m, el despacho se cotiza de manera personalizada según la carga y el destino."
                />
                <AccordionItem
                  question="¿El servicio aplica en cualquier distrito del Perú?"
                  answer="No. La tarifa plana de S/20 solo aplica en Lima Metropolitana y Callao (ver distritos aplicados). Para ubicaciones más lejanas, solicita una cotización especial."
                />
                    </Accordion>
                  </div>
                </div>
              </div>
            </section>
        </div>
      </div>
    </div>
  )
}
