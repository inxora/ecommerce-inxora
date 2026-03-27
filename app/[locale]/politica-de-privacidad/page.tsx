import type { Metadata } from 'next'
import { getPrivacyDocument } from '@/lib/legal/politica-de-privacidad'
import type { TermsSection } from '@/lib/legal/terms-y-condiciones/types'

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params
  const doc = getPrivacyDocument(locale)
  return {
    title: doc.meta.title,
    description: doc.meta.description,
    robots: 'index, follow',
  }
}

function isSubsectionSection(section: TermsSection): section is Extract<TermsSection, { subsections: unknown }> {
  return 'subsections' in section && Array.isArray(section.subsections)
}

export default function PoliticaDePrivacidadPage({ params }: PageProps) {
  const { locale } = params
  const doc = getPrivacyDocument(locale)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 lg:p-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            {doc.heading}
          </h1>

          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 space-y-6">
            {doc.sections.map((section) => (
              <section key={section.number} className="scroll-mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                  {section.number}. {section.title}
                </h2>

                {isSubsectionSection(section) ? (
                  <div className="space-y-5">
                    {section.subsections.map((sub) => (
                      <div key={sub.label}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                          {sub.label} {sub.title}
                        </h3>
                        {sub.paragraphs.map((p, i) => (
                          <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 last:mb-0">
                            {p}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  section.paragraphs.map((p, i) => (
                    <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 last:mb-0">
                      {p}
                    </p>
                  ))
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
