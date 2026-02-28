import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function safeRedirectPath(input: string | null): string {
  if (!input || !input.startsWith('/')) {
    return '/portal'
  }

  return input
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectPath = safeRedirectPath(requestUrl.searchParams.get('redirect') || requestUrl.searchParams.get('next'))

  const authError = requestUrl.searchParams.get('error_description') || requestUrl.searchParams.get('error')
  if (authError) {
    const failureUrl = new URL('/login', request.url)
    failureUrl.searchParams.set('message', 'Google sign-in failed. Please try again or use email login.')
    failureUrl.searchParams.set('redirect', redirectPath)
    return NextResponse.redirect(failureUrl)
  }

  if (!code) {
    const missingCodeUrl = new URL('/login', request.url)
    missingCodeUrl.searchParams.set('message', 'Sign-in did not complete. Please retry.')
    missingCodeUrl.searchParams.set('redirect', redirectPath)
    return NextResponse.redirect(missingCodeUrl)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const failureUrl = new URL('/login', request.url)
    failureUrl.searchParams.set('message', 'Could not complete Google sign-in. Please try again.')
    failureUrl.searchParams.set('redirect', redirectPath)
    return NextResponse.redirect(failureUrl)
  }

  return NextResponse.redirect(new URL(redirectPath, request.url))
}
