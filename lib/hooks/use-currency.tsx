'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrencyByCode, isValidCurrency, type CurrencyCode } from '@/lib/constants/currencies'

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  currencySymbol: string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const CURRENCY_STORAGE_KEY = 'inxora-selected-currency'
const CURRENCY_COOKIE_KEY = 'inxora-selected-currency'

/** Sincroniza la moneda en cookie para que el servidor la lea (SSR, moneda_usuario en API) */
function setCurrencyCookie(value: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${CURRENCY_COOKIE_KEY}=${value};path=/;max-age=31536000`
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('PEN')
  const router = useRouter()
  const currencyInfo = getCurrencyByCode(currency)

  useEffect(() => {
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY)
    if (savedCurrency && isValidCurrency(savedCurrency)) {
      setCurrencyState(savedCurrency)
      setCurrencyCookie(savedCurrency)
    }
  }, [])

  const setCurrency = useCallback((newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency)
    setCurrencyCookie(newCurrency)
    router.refresh()
  }, [router])

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencySymbol: currencyInfo.symbol }}>
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

