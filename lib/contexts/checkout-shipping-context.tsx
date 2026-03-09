'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface CheckoutShippingState {
  costoEnvio: number
  envioLabel: string
}

const defaultState: CheckoutShippingState = {
  costoEnvio: 0,
  envioLabel: '',
}

type SetCheckoutShipping = (state: CheckoutShippingState) => void

const CheckoutShippingContext = createContext<{
  shipping: CheckoutShippingState
  setCheckoutShipping: SetCheckoutShipping
} | null>(null)

export function CheckoutShippingProvider({ children }: { children: ReactNode }) {
  const [shipping, setShipping] = useState<CheckoutShippingState>(defaultState)
  const setCheckoutShipping = useCallback<SetCheckoutShipping>((state) => {
    setShipping(state)
  }, [])
  return (
    <CheckoutShippingContext.Provider value={{ shipping, setCheckoutShipping }}>
      {children}
    </CheckoutShippingContext.Provider>
  )
}

export function useCheckoutShipping() {
  const ctx = useContext(CheckoutShippingContext)
  if (!ctx) {
    return {
      shipping: defaultState,
      setCheckoutShipping: () => {},
    }
  }
  return ctx
}
