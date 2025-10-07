'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WhatsAppFloatProps {
  productName?: string
  productUrl?: string
}

export function WhatsAppFloat({ productName, productUrl }: WhatsAppFloatProps) {
  const getWhatsAppMessage = () => {
    if (productName && productUrl) {
      return `Hola, estoy interesado en el producto: ${productName}. Enlace: ${productUrl}`
    }
    
    if (typeof window !== 'undefined' && window.location.pathname.includes('/catalogo')) {
      return 'Hola, estoy navegando por su catálogo y me gustaría obtener más información sobre sus productos.'
    }
    
    if (typeof window !== 'undefined' && window.location.pathname.includes('/contacto')) {
      return 'Hola, me gustaría obtener más información sobre sus servicios.'
    }
    
    return 'Hola, me gustaría obtener más información sobre sus productos y servicios.'
  }

  const generateWhatsAppUrl = (message: string) => {
    const phoneNumber = '+51999999999' // Número de WhatsApp de INXORA
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`
  }

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage()
    const whatsappUrl = generateWhatsAppUrl(message)
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        size="lg"
        className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none"
      >
        <MessageCircle className="h-6 w-6 mr-2" />
        <span className="sr-only">Contáctanos</span>
      </Button>
      
      <div className="hidden sm:block absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <p className="text-sm text-gray-700 font-medium">
          Contáctanos
        </p>
        <p className="text-xs text-gray-500 mt-1">
          ¿Necesitas ayuda? Escríbenos por WhatsApp
        </p>
      </div>
    </div>
  )
}