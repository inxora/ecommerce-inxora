import { Inter } from 'next/font/google'
import Script from 'next/script'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/inxora.png', type: 'image/png' },
    ],
    apple: [
      { url: '/inxora.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className={inter.className}>
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
