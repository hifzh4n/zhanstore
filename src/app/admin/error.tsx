"use client"

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin route error', error)
  }, [error])

  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-xl border border-rose-200 bg-rose-50 p-6">
      <div className="flex items-center gap-2 text-rose-700">
        <AlertTriangle className="h-5 w-5" />
        <h2 className="text-lg font-bold">Admin page failed to load</h2>
      </div>
      <p className="text-sm text-rose-800">
        Check Vercel environment variables and Supabase configuration. If this persists, use the digest below for debugging.
      </p>
      <p className="rounded bg-white p-2 font-mono text-xs text-rose-700">Digest: {error.digest ?? 'n/a'}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
      >
        Try again
      </button>
    </div>
  )
}
