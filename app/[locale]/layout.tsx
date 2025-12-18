import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://tienda.inxora.com'),
  authors: [{ name: 'INXORA' }],
  creator: 'INXORA',
  publisher: 'INXORA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    // Agregar cuando tengas los códigos de verificación
    // google: 'tu-codigo-de-verificacion',
  },
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}