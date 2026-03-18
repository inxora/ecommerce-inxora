'use client'

import { createContext, useCallback, useContext, useState } from 'react'

interface AuthModalOptions {
  onSuccess?: () => void
  /** Si se especifica, el modal abre directamente en ese modo en vez de 'login' */
  initialMode?: 'login' | 'register'
}

interface AuthModalContextValue {
  isOpen: boolean
  options: AuthModalOptions
  openAuthModal: (options?: AuthModalOptions) => void
  closeAuthModal: () => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<AuthModalOptions>({})

  const openAuthModal = useCallback((opts?: AuthModalOptions) => {
    setOptions(opts ?? {})
    setIsOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsOpen(false)
    setOptions({})
  }, [])

  return (
    <AuthModalContext.Provider value={{ isOpen, options, openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider')
  return ctx
}
