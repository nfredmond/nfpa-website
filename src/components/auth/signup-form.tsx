'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

type SignupFormProps = {
  redirectPath: string
}

export function SignupForm({ redirectPath }: SignupFormProps) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  async function onGoogleSignup() {
    setError(null)
    setSuccess(null)
    setIsGoogleLoading(true)

    try {
      const supabase = createClient()
      const callbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
        },
      })

      if (oauthError) {
        throw oauthError
      }

      if (data?.url) {
        window.location.assign(data.url)
        return
      }

      throw new Error('Google sign-up is temporarily unavailable. Please use email signup or retry in a minute.')
    } catch (oauthError) {
      const message = oauthError instanceof Error ? oauthError.message : 'Unable to start Google sign-up.'
      setError(message)
      setIsGoogleLoading(false)
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (password.length < 8) {
      setError('Please use at least 8 characters for your password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setIsLoading(false)
      return
    }

    if (data.session) {
      router.push(redirectPath)
      router.refresh()
      return
    }

    setSuccess('Account created. Please check your email to confirm your account before signing in.')
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

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onGoogleSignup}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? 'Connecting to Google…' : 'Sign up with Google'}
      </Button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/55">
        <span className="h-px flex-1 bg-[color:var(--line)]" />
        <span>Email signup</span>
        <span className="h-px flex-1 bg-[color:var(--line)]" />
      </div>

      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />

      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        required
      />

      <Input
        type="password"
        label="Confirm password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        autoComplete="new-password"
        required
      />

      <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
        {isLoading ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-xs text-[color:var(--foreground)]/70">
        After signup, we send a verification email before first login.
      </p>

      <p className="text-sm text-[color:var(--foreground)]/78">
        Already have an account?{' '}
        <Link href={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="font-semibold text-[color:var(--pine)]">
          Sign in
        </Link>
      </p>
    </form>
  )
}
