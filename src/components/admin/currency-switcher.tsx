"use client"

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { AdminCurrency } from '@/lib/admin-dashboard'

type AdminCurrencySwitcherProps = {
  currency: AdminCurrency;
}

export function AdminCurrencySwitcher({ currency }: AdminCurrencySwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const nextSearch = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams])

  const switchCurrency = (nextCurrency: AdminCurrency) => {
    nextSearch.set('currency', nextCurrency)
    router.replace(`${pathname}?${nextSearch.toString()}`)
  }

  return (
    <div className="inline-flex rounded-md border bg-white p-1 shadow-sm">
      {(['USD', 'MYR'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => switchCurrency(option)}
          className={`rounded px-3 py-1 text-xs font-semibold ${
            currency === option ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
