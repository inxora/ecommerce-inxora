import { getRequestConfig } from 'next-intl/server'

const locales = ['es', 'en', 'pt']

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale
  let locale = await requestLocale
  
  // Validar que el locale sea uno de los soportados
  // Si no es válido o es undefined/null, usar 'es' como fallback
  if (!locale || !locales.includes(locale)) {
    locale = 'es'
  }
  
  try {
    return {
      locale,
      messages: (await import(`./messages/${locale}.json`)).default
    }
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error)
    // Fallback a mensajes en español si falla la carga
    return {
      locale: 'es',
      messages: (await import(`./messages/es.json`)).default
    }
  }
})
