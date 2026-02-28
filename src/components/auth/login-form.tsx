'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

type LoginFormProps = {
  redirectPath: string
  infoMessage?: string | null
}

export function LoginForm({ redirectPath, infoMessage }: LoginFormProps) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  async function onGoogleSignIn() {
    setError(null)
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

      throw new Error('Google sign-in is temporarily unavailable. Please try email login or retry in a moment.')
    } catch (oauthError) {
      const message = oauthError instanceof Error ? oauthError.message : 'Unable to start Google sign-in.'
      setError(message)
      setIsGoogleLoading(false)
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      const rawMessage = signInError.message || 'Unable to sign in.'
      const normalized = rawMessage.toLowerCase()
      if (normalized.includes('email') && normalized.includes('confirm')) {
        setError('Please confirm your email first, then try signing in again.')
      } else {
        setError(rawMessage)
      }
      setIsLoading(false)
      return
    }

    router.push(redirectPath)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 text-left">
      {infoMessage && (
        <p className="rounded-xl border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {infoMessage}
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
        onClick={onGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? 'Connecting to Google…' : 'Continue with Google'}
      </Button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/55">
        <span className="h-px flex-1 bg-[color:var(--line)]" />
        <span>Email login</span>
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
        autoComplete="current-password"
        required
      />

      <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
        {isLoading ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="text-sm text-[color:var(--foreground)]/78">
        Forgot your password?{' '}
        <Link href="/reset-password" className="font-semibold text-[color:var(--pine)]">
          Reset it
        </Link>
      </p>

      <p className="text-sm text-[color:var(--foreground)]/78">
        New customer?{' '}
        <Link href={`/signup?redirect=${encodeURIComponent(redirectPath)}`} className="font-semibold text-[color:var(--pine)]">
          Create an account
        </Link>
      </p>
    </form>
  )
}
