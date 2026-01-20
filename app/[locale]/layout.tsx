import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { CurrencyProviderWrapper } from '@/components/providers/currency-provider-wrapper'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://tienda.inxora.com'),

  alternates: {
    canonical: '/es',
    languages: {
      es: '/es',
      en: '/en',
      pt: '/pt',
      'x-default': '/es',
    },
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Fallback a 'es' si locale es undefined o null
  const validLocale = locale || 'es'
  const messages = await getMessages()

  // JSON-LD Schema para Organization - disponible en todas las páginas
  // IMPORTANTE: Para que Google muestre el logo en resultados enriquecidos, debe cumplir:
  // - Mínimo 112x112px (recomendado 512x512px o más)
  // - Formato PNG, JPG o SVG
  // - URL absoluta y accesible públicamente
  // - Debe estar en la página principal (/es)
  // - El logo puede ser un string directo o un objeto ImageObject
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'INXORA',
    legalName: 'INXORA',
    url: 'https://tienda.inxora.com',
    // Logo como string directo (formato preferido por Google para resultados enriquecidos)
    logo: 'https://tienda.inxora.com/inxora.png',
    // También incluir como ImageObject para compatibilidad completa
    image: {
      '@type': 'ImageObject',
      url: 'https://tienda.inxora.com/inxora.png',
      width: 512,
      height: 512,
      contentUrl: 'https://tienda.inxora.com/inxora.png',
    },
    description: 'Tienda online de suministros industriales en Perú. Suministros industriales, herramientas eléctricas, equipos de seguridad y ferretería industrial.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      areaServed: 'PE',
      availableLanguage: ['Spanish', 'English', 'Portuguese'],
    },
    sameAs: [],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://tienda.inxora.com/es/catalogo?buscar={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <NextIntlClientProvider locale={validLocale} messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <CurrencyProviderWrapper>
        <Header />

        <main>
          {children}
        </main>

        <Footer />
      </CurrencyProviderWrapper>
    </NextIntlClientProvider>
  )
}
