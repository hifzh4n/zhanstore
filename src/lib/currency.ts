import type { CurrencyCode } from './store'

const CURRENCY_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  MYR: 4.7,
}

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  USD: 'en-US',
  MYR: 'ms-MY',
}

export function convertUsdToCurrency(amountInUsd: number, currency: CurrencyCode): number {
  return amountInUsd * CURRENCY_RATES[currency]
}

export function formatPrice(amountInUsd: number, currency: CurrencyCode): string {
  const converted = convertUsdToCurrency(amountInUsd, currency)

  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted)
}
