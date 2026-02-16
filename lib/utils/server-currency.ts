/**
 * Helper para leer la moneda del usuario desde cookies en el servidor.
 * La moneda se sincroniza desde el cliente (useCurrency) vía cookie inxora-selected-currency.
 */
import { cookies } from 'next/headers'
import { isValidCurrency, type CurrencyCode } from '@/lib/constants/currencies'

export type ServerCurrency = CurrencyCode

const CURRENCY_COOKIE_KEY = 'inxora-selected-currency'

/**
 * Obtiene la moneda seleccionada por el usuario desde las cookies.
 * Usar en Server Components antes de llamar a ProductsService.
 * @returns CurrencyCode - default 'PEN' si no hay cookie o es inválida
 */
export async function getServerCurrency(): Promise<ServerCurrency> {
  const cookieStore = await cookies()
  const value = cookieStore.get(CURRENCY_COOKIE_KEY)?.value
  if (value && isValidCurrency(value)) {
    return value
  }
  return 'PEN'
}
