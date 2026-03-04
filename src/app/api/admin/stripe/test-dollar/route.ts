import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminAllowlistedEmail } from '@/lib/auth/admin-access'

export const runtime = 'nodejs'

function buildAdminRedirect(request: NextRequest, status: 'ok' | 'error', message: string) {
  const url = new URL('/admin', request.nextUrl.origin)
  url.searchParams.set('tab', 'stripe')
  url.searchParams.set('status', status)
  url.searchParams.set('message', message)
  return url
}

function formEncode(payload: Record<string, string>) {
  return new URLSearchParams(payload).toString()
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email || !isAdminAllowlistedEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const recipientEmail = String(formData.get('email') ?? user.email).trim().toLowerCase()
  if (!recipientEmail) {
    return NextResponse.redirect(buildAdminRedirect(request, 'error', 'Missing recipient email'), { status: 302 })
  }

  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY ?? '').trim()
  if (!stripeSecretKey) {
    return NextResponse.redirect(
      buildAdminRedirect(request, 'error', 'Missing STRIPE_SECRET_KEY in environment config'),
      { status: 302 }
    )
  }

  const payload = formEncode({
    mode: 'payment',
    success_url: `${request.nextUrl.origin}/admin?tab=stripe&status=ok&message=Test+checkout+completed`,
    cancel_url: `${request.nextUrl.origin}/admin?tab=stripe&status=error&message=Test+checkout+canceled`,
    customer_email: recipientEmail,
    client_reference_id: 'admin-dollar-test',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': '100',
    'line_items[0][price_data][product_data][name]': 'Nat Ford Admin $1 Test',
    'line_items[0][quantity]': '1',
    'metadata[product_id]': 'admin-test',
    'metadata[tier_id]': 'admin-dollar-test',
  })

  const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload,
    cache: 'no-store',
  })

  const body = (await stripeResponse.json()) as { url?: string; error?: { message?: string } }

  if (!stripeResponse.ok || !body.url) {
    const message = body.error?.message ?? `Stripe request failed (${stripeResponse.status})`
    return NextResponse.redirect(buildAdminRedirect(request, 'error', message), { status: 302 })
  }

  return NextResponse.redirect(body.url, { status: 303 })
}
