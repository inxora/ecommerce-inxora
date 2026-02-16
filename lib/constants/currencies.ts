/**
 * Configuración de monedas soportadas.
 * Símbolos alineados con precio_simbolo del API.
 * countryCode: ISO 3166-1 alpha-2 para flag-icons (fi fi-xx)
 */
export const CURRENCIES = [
  { code: 'PEN' as const, symbol: 'S/', name: 'Sol Peruano', countryCode: 'pe' },
  { code: 'USD' as const, symbol: '$', name: 'Dólar Estadounidense', countryCode: 'us' },
  { code: 'CLP' as const, symbol: '$', name: 'Peso Chileno', countryCode: 'cl' },
  { code: 'COP' as const, symbol: '$', name: 'Peso Colombiano', countryCode: 'co' },
  { code: 'AUD' as const, symbol: 'A$', name: 'Dólar Australiano', countryCode: 'au' },
  { code: 'BRL' as const, symbol: 'R$', name: 'Real Brasileño', countryCode: 'br' },
  { code: 'CAD' as const, symbol: 'C$', name: 'Dólar Canadiense', countryCode: 'ca' },
  { code: 'CHF' as const, symbol: 'Fr', name: 'Franco Suizo', countryCode: 'ch' },
  { code: 'CNY' as const, symbol: '¥', name: 'Yuan Chino', countryCode: 'cn' },
  { code: 'CZK' as const, symbol: 'Kč', name: 'Corona Checa', countryCode: 'cz' },
  { code: 'DKK' as const, symbol: 'kr', name: 'Corona Danesa', countryCode: 'dk' },
  { code: 'EUR' as const, symbol: '€', name: 'Euro', countryCode: 'eu' },
  { code: 'GBP' as const, symbol: '£', name: 'Libra Esterlina', countryCode: 'gb' },
  { code: 'HKD' as const, symbol: 'HK$', name: 'Dólar de Hong Kong', countryCode: 'hk' },
  { code: 'HUF' as const, symbol: 'Ft', name: 'Forinto Húngaro', countryCode: 'hu' },
  { code: 'IDR' as const, symbol: 'Rp', name: 'Rupia Indonesia', countryCode: 'id' },
  { code: 'ILS' as const, symbol: '₪', name: 'Nuevo Shekel', countryCode: 'il' },
  { code: 'INR' as const, symbol: '₹', name: 'Rupia India', countryCode: 'in' },
  { code: 'ISK' as const, symbol: 'kr', name: 'Corona Islandesa', countryCode: 'is' },
  { code: 'JPY' as const, symbol: '¥', name: 'Yen Japonés', countryCode: 'jp' },
  { code: 'KRW' as const, symbol: '₩', name: 'Won Surcoreano', countryCode: 'kr' },
  { code: 'MXN' as const, symbol: '$', name: 'Peso Mexicano', countryCode: 'mx' },
  { code: 'MYR' as const, symbol: 'RM', name: 'Ringgit Malayo', countryCode: 'my' },
  { code: 'NOK' as const, symbol: 'kr', name: 'Corona Noruega', countryCode: 'no' },
  { code: 'NZD' as const, symbol: 'NZ$', name: 'Dólar Neozelandés', countryCode: 'nz' },
  { code: 'PHP' as const, symbol: '₱', name: 'Peso Filipino', countryCode: 'ph' },
  { code: 'PLN' as const, symbol: 'zł', name: 'Złoty Polaco', countryCode: 'pl' },
  { code: 'RON' as const, symbol: 'lei', name: 'Leu Rumano', countryCode: 'ro' },
  { code: 'SEK' as const, symbol: 'kr', name: 'Corona Sueca', countryCode: 'se' },
  { code: 'SGD' as const, symbol: 'S$', name: 'Dólar de Singapur', countryCode: 'sg' },
  { code: 'THB' as const, symbol: '฿', name: 'Baht Tailandés', countryCode: 'th' },
  { code: 'TRY' as const, symbol: '₺', name: 'Lira Turca', countryCode: 'tr' },
  { code: 'ZAR' as const, symbol: 'R', name: 'Rand Sudafricano', countryCode: 'za' },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]['code']

export const CURRENCY_CODES: CurrencyCode[] = CURRENCIES.map((c) => c.code)

export function getCurrencyByCode(code: string) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
}

export function isValidCurrency(code: string): code is CurrencyCode {
  return CURRENCY_CODES.includes(code as CurrencyCode)
}

/**
 * Devuelve el símbolo correcto para mostrar el precio.
 * Si el API envía el código (ej. "AUD") en precio_simbolo, lo traduce al símbolo (ej. "A$").
 */
export function getDisplaySymbol(symbolOrCode: string | undefined | null): string {
  if (symbolOrCode == null || symbolOrCode === '') return ''
  const trimmed = String(symbolOrCode).trim()
  if (isValidCurrency(trimmed)) {
    return getCurrencyByCode(trimmed).symbol
  }
  return trimmed
}
