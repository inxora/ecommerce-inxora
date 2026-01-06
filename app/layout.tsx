import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Metadata removida - cada página define su propia metadata de robots
// Esto permite que las páginas individuales controlen su indexación

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
