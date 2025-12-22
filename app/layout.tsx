import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  robots: {
    index: false,
    follow: false,
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
