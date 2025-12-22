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
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
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
