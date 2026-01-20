import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale
  let locale = await requestLocale
  
  // Fallback a 'es' si locale es undefined o null
  if (!locale) {
    locale = 'es'
  }
  
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  }
})
