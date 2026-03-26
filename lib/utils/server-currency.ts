/**
 * Helper para leer la moneda del usuario desde cookies en el servidor.
 * La moneda se sincroniza desde el cliente (useCurrency) vía cookie inxora-selected-currency.
 */
import { cookies } from 'next/headers'

export type ServerCurrency = string

const CURRENCY_COOKIE_KEY = 'inxora-selected-currency'

/**
 * Obtiene la moneda seleccionada por el usuario desde las cookies.
 * Usar en Server Components antes de llamar a ProductsService.
 * @returns string - default 'PEN' si no hay cookie
 */
export async function getServerCurrency(): Promise<ServerCurrency> {
  const cookieStore = await cookies()
  return cookieStore.get(CURRENCY_COOKIE_KEY)?.value ?? 'PEN'
}
