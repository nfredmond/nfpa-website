import { NextRequest, NextResponse } from 'next/server'
import { LEAD_INBOX_COOKIE, computeLeadInboxToken } from '@/lib/security/lead-inbox-auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const action = String(form.get('action') || 'login')
  const secret = process.env.LEAD_INBOX_PASSWORD || ''

  if (!secret) {
    return new NextResponse('Lead inbox auth is not configured. Set LEAD_INBOX_PASSWORD.', { status: 503 })
  }

  const redirectUrl = new URL('/lead-inbox', req.url)

  if (action === 'logout') {
    const res = NextResponse.redirect(redirectUrl, { status: 303 })
    res.cookies.delete(LEAD_INBOX_COOKIE)
    return res
  }

  const password = String(form.get('password') || '')

  if (!password || password !== secret) {
    redirectUrl.searchParams.set('error', '1')
    return NextResponse.redirect(redirectUrl, { status: 303 })
  }

  const token = computeLeadInboxToken(secret)
  const res = NextResponse.redirect(redirectUrl, { status: 303 })

  res.cookies.set(LEAD_INBOX_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 12,
  })

  return res
}
