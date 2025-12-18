'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Currency = 'PEN' | 'USD'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  currencySymbol: string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const CURRENCY_STORAGE_KEY = 'inxora-selected-currency'

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('PEN')

  useEffect(() => {
    // Cargar moneda desde localStorage al montar
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency
    if (savedCurrency === 'PEN' || savedCurrency === 'USD') {
      setCurrencyState(savedCurrency)
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency)
  }

  const currencySymbol = currency === 'PEN' ? 'S/' : '$'

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencySymbol }}>
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

