'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type Currency } from '@/lib/currency'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>('USD')

  // Load currency preference from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('stc-currency') as Currency
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'IDR')) {
      setCurrencyState(savedCurrency)
    }
  }, [])

  // Save currency preference to localStorage
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('stc-currency', newCurrency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
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