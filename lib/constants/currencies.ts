/**
 * Helpers de monedas para uso fuera de React (cart-restrictions, product-card, etc.).
 * La lista de monedas disponibles viene de la API (/api/monedas/) a través del CurrencyProvider.
 */

export type CurrencyCode = string

/** Mapeo código ISO 4217 → código de país ISO 3166-1 alpha-2 para flag-icons (fi fi-xx). */
const CURRENCY_COUNTRY_CODE: Record<string, string> = {
  PEN: 'pe', USD: 'us', EUR: 'eu', CLP: 'cl', BRL: 'br', CNY: 'cn',
  AUD: 'au', CAD: 'ca', CHF: 'ch', COP: 'co', CZK: 'cz', DKK: 'dk',
  GBP: 'gb', HKD: 'hk', HUF: 'hu', IDR: 'id', ILS: 'il', INR: 'in',
  ISK: 'is', JPY: 'jp', KRW: 'kr', MXN: 'mx', MYR: 'my', NOK: 'no',
  NZD: 'nz', PHP: 'ph', PLN: 'pl', RON: 'ro', SEK: 'se', SGD: 'sg',
  THB: 'th', TRY: 'tr', ZAR: 'za',
}

/** Mapeo código ISO 4217 → símbolo. Usado en contextos sin React (ej: cart-restrictions). */
const CURRENCY_SYMBOL: Record<string, string> = {
  PEN: 'S/', USD: '$', EUR: '€', CLP: '$', BRL: 'R$', CNY: '¥',
  AUD: 'A$', CAD: 'C$', CHF: 'Fr', COP: '$', CZK: 'Kč', DKK: 'kr',
  GBP: '£', HKD: 'HK$', HUF: 'Ft', IDR: 'Rp', ILS: '₪', INR: '₹',
  ISK: 'kr', JPY: '¥', KRW: '₩', MXN: '$', MYR: 'RM', NOK: 'kr',
  NZD: 'NZ$', PHP: '₱', PLN: 'zł', RON: 'lei', SEK: 'kr', SGD: 'S$',
  THB: '฿', TRY: '₺', ZAR: 'R',
}

/** Devuelve el código de país para el flag icon. */
export function getCountryCode(currencyCode: string): string {
  return CURRENCY_COUNTRY_CODE[currencyCode] ?? currencyCode.slice(0, 2).toLowerCase()
}

/** Devuelve { symbol, countryCode } para un código de moneda. Usado en contextos sin React. */
export function getCurrencyByCode(code: string): { symbol: string; countryCode: string } {
  return {
    symbol: CURRENCY_SYMBOL[code] ?? code,
    countryCode: getCountryCode(code),
  }
}

/**
 * Devuelve el símbolo correcto para mostrar el precio.
 * Si el API envía el código (ej. "AUD") en precio_simbolo, lo traduce al símbolo (ej. "A$").
 */
export function getDisplaySymbol(symbolOrCode: string | undefined | null): string {
  if (symbolOrCode == null || symbolOrCode === '') return ''
  const trimmed = String(symbolOrCode).trim()
  return CURRENCY_SYMBOL[trimmed] ?? trimmed
}
