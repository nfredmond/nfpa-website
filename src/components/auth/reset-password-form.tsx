'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/update-password`

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (resetError) {
      setError(resetError.message)
      setIsLoading(false)
      return
    }

    setSuccess('Password reset email sent. Check your inbox (and spam) for the secure reset link.')
    setIsLoading(false)
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
        type="email"
        label="Account email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Sending link…' : 'Send reset link'}
      </Button>

      <p className="text-sm text-[color:var(--foreground)]/78">
        Back to{' '}
        <Link href="/login" className="font-semibold text-[color:var(--pine)]">
          login
        </Link>
      </p>
    </form>
  )
}
