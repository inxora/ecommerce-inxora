import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://tienda.inxora.com'),
  authors: [{ name: 'INXORA' }],
  creator: 'INXORA',
  publisher: 'INXORA',

  alternates: {
    languages: {
      es: '/es',
      en: '/en',
      pt: '/pt',
    },
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    // google: 'CODIGO_DE_GSC'
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
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
