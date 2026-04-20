'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useStore } from '@/lib/store'
import type { ReactNode } from 'react'

export function AppProvider({ children }: Readonly<{ children: ReactNode }>) {
  const setAuthSession = useStore((state) => state.setAuthSession)
  const setAuthLoading = useStore((state) => state.setAuthLoading)

  useEffect(() => {
    let isMounted = true

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return
      setAuthSession(data.session)
    }

    syncSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session)
    })

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
      setAuthLoading(false)
    }
  }, [setAuthLoading, setAuthSession])

  return children
}
