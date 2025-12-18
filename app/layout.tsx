import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import { CurrencyProviderWrapper } from '@/components/providers/currency-provider-wrapper'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TIENDA INXORA - Marketplace B2B de Suministros Industriales',
  description: 'Encuentra los mejores suministros industriales para tu empresa en Perú. Catálogo completo, precios competitivos y atención especializada.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/inxora.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Tienda INXORA',
    images: [
      {
        url: 'https://tienda.inxora.com/suministros_industriales_inxora_ecommerce_2025_front_1_web.jpg',
        width: 1200,
        height: 630,
        alt: 'Tienda INXORA - Suministros Industriales',
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
    <html lang="es">
      <body className={inter.className}>
        <CurrencyProviderWrapper>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        </CurrencyProviderWrapper>
        <Toaster />
        
        {/* Chat Widget SARA XORA */}
        <Script
          id="chat-widget-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.ChatWidgetConfig = {
                webhook: {
                  url: 'https://paneln8n.wayrixai.com/webhook/bf0ec96d-8d41-4d7a-bcad-35367ca6de80/chat',
                  route: 'general'
                },
                branding: {
                  logo: '/LOGO-03.png',
                  name: 'INXORA',
                  welcomeText: '¡Hola! Soy SARA XORA, tu asistente virtual. ¿En qué puedo ayudarte?',
                  responseTimeText: 'Respondemos en menos de 1 minuto.'
                },
                style: {
                  primaryColor: '#13A0D8',
                  secondaryColor: '#0d7ba8',
                  backgroundColor: '#ffffff',
                  fontColor: '#333333'
                }
              };
            `,
          }}
        />
        <Script src="/js/chat.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}