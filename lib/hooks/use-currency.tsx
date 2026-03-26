'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrencyByCode } from '@/lib/constants/currencies'
import { getMonedas, type MonedaAPI } from '@/lib/services/monedas.service'

interface CurrencyContextType {
  currency: string
  setCurrency: (currency: string) => void
  currencySymbol: string
  availableCurrencies: MonedaAPI[]
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const CURRENCY_STORAGE_KEY = 'inxora-selected-currency'
const CURRENCY_COOKIE_KEY = 'inxora-selected-currency'

function setCurrencyCookie(value: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${CURRENCY_COOKIE_KEY}=${value};path=/;max-age=31536000`
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>('PEN')
  const [availableCurrencies, setAvailableCurrencies] = useState<MonedaAPI[]>([])
  const router = useRouter()

  // Carga inmediata desde localStorage para evitar flash
  useEffect(() => {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY)
    if (saved) {
      setCurrencyState(saved)
      setCurrencyCookie(saved)
    }
  }, [])

  // Fetch de monedas disponibles desde la API; valida la moneda guardada
  useEffect(() => {
    getMonedas()
      .then((monedas) => {
        setAvailableCurrencies(monedas)
        const saved = localStorage.getItem(CURRENCY_STORAGE_KEY)
        if (saved && !monedas.some((m) => m.codigo === saved)) {
          const principal = monedas.find((m) => m.es_principal)?.codigo ?? 'PEN'
          setCurrencyState(principal)
          localStorage.setItem(CURRENCY_STORAGE_KEY, principal)
          setCurrencyCookie(principal)
        }
      })
      .catch(() => {})
  }, [])

  const setCurrency = useCallback(
    (newCurrency: string) => {
      setCurrencyState(newCurrency)
      localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency)
      setCurrencyCookie(newCurrency)
      router.refresh()
    },
    [router]
  )

  const currencySymbol =
    availableCurrencies.find((m) => m.codigo === currency)?.simbolo ??
    getCurrencyByCode(currency).symbol

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencySymbol, availableCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
