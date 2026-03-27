import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { CurrencyProviderWrapper } from '@/components/providers/currency-provider-wrapper'
import { CartProvider } from '@/components/providers/cart-provider'
import { ClienteAuthProvider } from '@/lib/contexts/cliente-auth-context'
import { AuthModalProvider } from '@/lib/contexts/auth-modal-context'
import { AuthModal } from '@/components/auth/auth-modal'
import { Header } from '@/components/layout/header'
import { ConditionalFooter } from '@/components/layout/conditional-footer'
import { FloatWidgetsWrapper } from '@/components/layout/float-widgets-wrapper'
import { Metadata } from 'next'
import { CategoriesService } from '@/lib/services/categories.service'
import { getBannersActivos } from '@/lib/services/banners.service'

const supportedLocales = ['es', 'en', 'pt']

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const validLocale = (locale && supportedLocales.includes(locale)) ? locale : 'es'

  return {
    metadataBase: new URL('https://tienda.inxora.com'),
    alternates: {
      canonical: `/${validLocale}`,
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Validar que el locale sea uno de los soportados
  // Si no es válido o es undefined/null, usar 'es' como fallback
  const validLocale = (locale && supportedLocales.includes(locale)) ? locale : 'es'
  
  // Cargar categorías desde el servidor para mejor SEO y rendimiento
  let categories = []
  try {
    const categoriasNavegacion = await CategoriesService.getCategorias()
    // Filtrar la categoría "DESPACHO DE PRODUCTOS" (categoría oculta para trabajadores)
    categories = categoriasNavegacion.filter(
      (cat) => cat.nombre.toUpperCase() !== 'DESPACHO DE PRODUCTOS'
    )
  } catch (error) {
    console.error('Error loading categories in layout:', error)
    // Continuar con array vacío si hay error
  }

  // Banners de layout (header strip y footer strip)
  let bannersHeaderStrip: Awaited<ReturnType<typeof getBannersActivos>> = []
  let bannersFooterStrip: Awaited<ReturnType<typeof getBannersActivos>> = []
  try {
    const [headerResult, footerResult] = await Promise.all([
      getBannersActivos('layout-header-strip', 3600),
      getBannersActivos('layout-footer-strip', 3600),
    ])
    bannersHeaderStrip = headerResult
    bannersFooterStrip = footerResult
  } catch (error) {
    console.error('Error loading layout banners:', error)
  }
  
  try {
    const messages = await getMessages({ locale: validLocale })

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
        urlTemplate: `https://tienda.inxora.com/${validLocale}/catalogo?buscar={search_term_string}`,
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
        <CartProvider>
          <ClienteAuthProvider>
          <AuthModalProvider>
          <Header categories={categories} bannersHeaderStrip={bannersHeaderStrip} locale={validLocale} />

          <main>
            {children}
          </main>

          <ConditionalFooter bannersFooterStrip={bannersFooterStrip} locale={validLocale} />
          <FloatWidgetsWrapper />
          <AuthModal />
          </AuthModalProvider>
          </ClienteAuthProvider>
        </CartProvider>
      </CurrencyProviderWrapper>
    </NextIntlClientProvider>
    )
  } catch (error) {
    console.error('Error loading messages in LocaleLayout:', error)
    // Fallback: intentar cargar mensajes en español
    try {
      const fallbackMessages = await getMessages({ locale: 'es' })
      return (
        <NextIntlClientProvider locale="es" messages={fallbackMessages}>
          <CurrencyProviderWrapper>
            <CartProvider>
              <ClienteAuthProvider>
                <AuthModalProvider>
                <Header categories={categories} bannersHeaderStrip={bannersHeaderStrip} locale={validLocale} />
                <main>{children}</main>
                <ConditionalFooter bannersFooterStrip={bannersFooterStrip} locale={validLocale} />
                <FloatWidgetsWrapper />
                <AuthModal />
                </AuthModalProvider>
              </ClienteAuthProvider>
            </CartProvider>
          </CurrencyProviderWrapper>
        </NextIntlClientProvider>
      )
    } catch (fallbackError) {
      console.error('Error loading fallback messages:', fallbackError)
      // Último recurso: renderizar sin mensajes
      return (
        <CurrencyProviderWrapper>
          <CartProvider>
            <ClienteAuthProvider>
              <AuthModalProvider>
              <Header categories={categories} bannersHeaderStrip={bannersHeaderStrip} locale={validLocale} />
              <main>{children}</main>
              <ConditionalFooter bannersFooterStrip={bannersFooterStrip} locale={validLocale} />
              <FloatWidgetsWrapper />
              <AuthModal />
              </AuthModalProvider>
            </ClienteAuthProvider>
          </CartProvider>
        </CurrencyProviderWrapper>
      )
    }
  }
}