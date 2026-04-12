import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Auth hook for the admin CMS.
 *
 * Subscribes to Supabase onAuthStateChange and exposes session,
 * user, loading state, signIn and signOut helpers.
 *
 * @returns {{
 *   session: import('@supabase/supabase-js').Session | null,
 *   user: import('@supabase/supabase-js').User | null,
 *   loading: boolean,
 *   signIn: (email: string, password: string) => Promise<{ error: Error | null }>,
 *   signOut: () => Promise<void>
 * }}
 */
export const useAuth = () => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Initial session fetch (async — may already exist in localStorage)
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return {
    session,
    user: session?.user ?? null,
    loading,
    signIn,
    signOut,
  }
}
