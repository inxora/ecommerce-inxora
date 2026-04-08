import { createWhatsAppUrl } from '@/lib/utils'

export const WHATSAPP_DEFAULT_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51913087207'

/**
 * Texto inicial del mensaje de WhatsApp para todos los CTAs de «Cotización industrial»
 * (hero, modal de bienvenida, Mi cuenta). Debe coincidir con la rama `home` de
 * `getPageContext` en `components/layout/whatsapp-float.tsx` si se vuelve a mostrar el flotante.
 */
export const WHATSAPP_INDUSTRIAL_QUOTATION_MESSAGE =
  'Hola Sara Xora, quiero información sobre sus productos.'

export function getIndustrialQuotationWhatsAppUrl(): string {
  return createWhatsAppUrl(
    WHATSAPP_DEFAULT_NUMBER,
    WHATSAPP_INDUSTRIAL_QUOTATION_MESSAGE
  )
}
