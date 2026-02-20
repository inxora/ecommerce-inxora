import { Inter } from 'next/font/google'
import Script from 'next/script'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Google Tag Manager ID
const GTM_ID = 'GTM-WGHBCDFQ'

export const metadata: Metadata = {
  metadataBase: new URL('https://tienda.inxora.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/inxora.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/inxora.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
  // Open Graph para redes sociales (también ayuda a Google)
  openGraph: {
    type: 'website',
    siteName: 'INXORA',
    images: [
      {
        url: 'https://tienda.inxora.com/inxora.png',
        width: 512,
        height: 512,
        alt: 'INXORA Logo',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className={`${inter.className} overflow-x-hidden`}>
        {/* Google Tag Manager (noscript) - Inmediatamente después de la apertura del body */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Google Tag Manager - Script (Next.js lo optimiza automáticamente) */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />

        {children}

        {/* Chat Widget */}
        <Script
          id="chat-widget-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `/* config */`,
          }}
        />
        <Script src="/js/chat.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
