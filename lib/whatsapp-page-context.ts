import { isLegalInfoWhatsAppSegment } from '@/lib/i18n/legal-routes'

export type WhatsAppPageContext = {
  pageType: string
  message: string
}

/**
 * Mensaje contextual según pathname (misma lógica que el widget flotante de WhatsApp).
 * Rutas tipo /{locale}/{categoria}/... usan rama `categoria` con el primer segmento de ruta.
 */
export function getWhatsAppPageContext(pathname: string): WhatsAppPageContext {
  const segments = pathname.replace(/^\/+/, '').split('/').filter(Boolean)
  const locale = segments[0]
  const mainSegment = segments[1]?.toLowerCase() ?? ''

  if (!mainSegment || mainSegment === locale || segments.length <= 1) {
    return {
      pageType: 'home',
      message: 'Hola Sara Xora, quiero información sobre sus productos.',
    }
  }

  switch (mainSegment) {
    case 'catalogo':
      return {
        pageType: 'catalogo',
        message: 'Hola Sara Xora, necesito asesoría para elegir productos de su catálogo.',
      }
    case 'producto':
      return {
        pageType: 'producto',
        message: 'Hola Sara Xora, tengo una consulta sobre un producto que vi en su catálogo.',
      }
    case 'contacto':
      return {
        pageType: 'contacto',
        message: 'Hola Sara Xora, quiero más información.',
      }
    case 'carrito':
      return {
        pageType: 'carrito',
        message: 'Hola Sara Xora, tengo dudas sobre mi cotización.',
      }
    case 'checkout':
      return {
        pageType: 'checkout',
        message: 'Hola Sara Xora, necesito ayuda con mi pedido.',
      }
    case 'buscar':
      return {
        pageType: 'busqueda',
        message: 'Hola Sara Xora, busco un producto específico.',
      }
    case 'nosotros':
    case 'envios':
    case 'cookies':
    case 'libro-reclamaciones':
    case 'favoritos':
      return {
        pageType: mainSegment,
        message: `Hola Sara Xora, tengo una consulta desde la página de ${mainSegment}.`,
      }
    default:
      if (isLegalInfoWhatsAppSegment(mainSegment)) {
        return {
          pageType: mainSegment,
          message: `Hola Sara Xora, tengo una consulta desde la página de ${mainSegment}.`,
        }
      }
      const isProduct = segments.length >= 5
      return {
        pageType: isProduct ? 'producto' : 'categoria',
        message: isProduct
          ? 'Hola Sara Xora, tengo una consulta sobre un producto que vi en su catálogo.'
          : `Hola Sara Xora, necesito asesoría sobre productos de ${mainSegment}.`,
      }
  }
}
