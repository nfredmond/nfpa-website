'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export function UpdatePasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (mounted) {
        setHasRecoverySession(!!data.session)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setHasRecoverySession(!!session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (password.length < 8) {
      setError('Please use at least 8 characters for your new password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setIsLoading(false)
      return
    }

    await supabase.auth.signOut()
    setSuccess('Password updated. Please sign in with your new password.')
    setIsLoading(false)

    setTimeout(() => {
      router.push('/login?message=Password updated. Please sign in with your new password.')
      router.refresh()
    }, 700)
  }

  if (hasRecoverySession === null) {
    return <p className="mt-6 text-sm text-[color:var(--foreground)]/70">Checking reset session…</p>
  }

  if (!hasRecoverySession) {
    return (
      <div className="mt-6 rounded-xl border border-amber-300/70 bg-amber-50 p-4 text-left text-sm text-amber-900">
        <p className="font-semibold">No active reset session found.</p>
        <p className="mt-2">
          Please open the password reset link from your email again, or request a new reset link.
        </p>
        <p className="mt-3">
          <Link href="/reset-password" className="font-semibold text-[color:var(--pine)]">
            Request new reset link
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 text-left">
      {success && (
        <p className="rounded-xl border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {success}
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-300/70 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <Input
        type="password"
        label="New password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        required
      />

      <Input
        type="password"
        label="Confirm new password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        autoComplete="new-password"
        required
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Updating password…' : 'Update password'}
      </Button>
    </form>
  )
}
