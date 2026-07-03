/**
 * Currency utility functions for STC ImpactViz
 * Supports USD and IDR with live conversion rates
 */

export type Currency = 'USD' | 'IDR'

// Exchange rates (USD to IDR) - in production, this should be fetched from an API
const USD_TO_IDR_RATE = 15850 // Approximate rate, update as needed

export interface CurrencyConfig {
  code: Currency
  symbol: string
  name: string
  rate: number // Rate relative to USD
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1
  },
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    rate: USD_TO_IDR_RATE
  }
}

/**
 * Convert USD amount to specified currency
 */
export function convertCurrency(usdAmount: number, targetCurrency: Currency): number {
  return usdAmount * CURRENCIES[targetCurrency].rate
}

/**
 * Format currency amount with proper symbol and formatting
 */
export function formatCurrency(amount: number, currency: Currency, options?: {
  showDecimals?: boolean
  compact?: boolean
}): string {
  const config = CURRENCIES[currency]
  const convertedAmount = amount * config.rate
  
  const formatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: options?.showDecimals ? 2 : 0
  }

  if (options?.compact && convertedAmount >= 1000) {
    formatOptions.notation = 'compact'
    formatOptions.maximumFractionDigits = 1
  }

  try {
    if (currency === 'IDR') {
      // For IDR, use custom formatting since it's a large number currency
      const formatted = new Intl.NumberFormat('id-ID', formatOptions).format(convertedAmount)
      return formatted
    } else {
      return new Intl.NumberFormat('en-US', formatOptions).format(convertedAmount)
    }
  } catch (error) {
    // Fallback formatting
    const roundedAmount = Math.round(convertedAmount)
    return `${config.symbol}${roundedAmount.toLocaleString()}`
  }
}

/**
 * Get currency symbol for display
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCIES[currency].symbol
}

/**
 * Format currency amount with custom symbol (for shorter displays)
 */
export function formatCurrencyCompact(usdAmount: number, currency: Currency): string {
  const convertedAmount = convertCurrency(usdAmount, currency)
  const symbol = getCurrencySymbol(currency)
  
  if (currency === 'IDR') {
    // For IDR, show in millions or thousands for readability
    if (convertedAmount >= 1000000) {
      return `${symbol}${(convertedAmount / 1000000).toFixed(1)}M`
    } else if (convertedAmount >= 1000) {
      return `${symbol}${(convertedAmount / 1000).toFixed(0)}K`
    }
  } else {
    // For USD, show compact format for large amounts
    if (convertedAmount >= 1000) {
      return `${symbol}${(convertedAmount / 1000).toFixed(0)}K`
    }
  }
  
  return `${symbol}${Math.round(convertedAmount).toLocaleString()}`
}

/**
 * Get per-unit text for different currencies
 */
export function getPerUnitText(currency: Currency): string {
  if (currency === 'IDR') {
    return `/ton CO₂`
  }
  return `/ton CO₂`
}

/**
 * Carbon offset pricing in USD (will be converted)
 */
export const CARBON_OFFSET_PRICING = {
  STANDARD_RATE: 50, // $50 per ton CO2
  REFORESTATION: 25, // $25 per ton
  RENEWABLE_ENERGY: 45, // $45 per ton  
  DIRECT_AIR_CAPTURE: 150, // $150 per ton
}

/**
 * Reduction strategy costs in USD (will be converted)
 */
export const REDUCTION_COSTS = {
  RENEWABLE_ENERGY: 15000, // $15,000
  GAS_OPTIMIZATION: 5000, // $5,000
  ENERGY_EFFICIENCY: 25000, // $25,000
}