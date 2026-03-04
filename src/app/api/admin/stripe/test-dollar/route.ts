import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { evaluateAdminAccess } from '@/lib/auth/admin-access'
import { logAdminAction } from '@/lib/auth/admin-audit'

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

  if (!user?.email) {
    await logAdminAction({
      actorEmail: 'unknown',
      action: 'stripe_test_dollar_checkout',
      status: 'denied',
      metadata: { reason: 'no_user' },
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminAccess = await evaluateAdminAccess({ supabase, user })
  if (!adminAccess.ok) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'stripe_test_dollar_checkout',
      status: 'denied',
      metadata: { reason: adminAccess.reason, currentAal: adminAccess.currentAal },
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const mode = String(formData.get('mode') ?? 'test')
  const isLive = mode === 'live'

  const recipientEmail = String(formData.get('email') ?? user.email).trim().toLowerCase()
  if (!recipientEmail) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'stripe_test_dollar_checkout',
      status: 'error',
      metadata: { reason: 'missing_recipient_email' },
    })
    return NextResponse.redirect(buildAdminRedirect(request, 'error', 'Missing recipient email'), { status: 302 })
  }

  await logAdminAction({
    actorUserId: user.id,
    actorEmail: user.email,
    action: 'stripe_test_dollar_checkout',
    target: recipientEmail,
    status: 'started',
    metadata: { env: isLive ? 'live' : 'test' },
  })

  const envKey = isLive ? 'STRIPE_SECRET_KEY' : 'STRIPE_TEST_SECRET_KEY'
  const stripeSecretKey = (process.env[envKey] ?? '').trim()
  if (!stripeSecretKey) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'stripe_test_dollar_checkout',
      target: recipientEmail,
      status: 'error',
      metadata: { reason: `missing_${envKey}` },
    })
    return NextResponse.redirect(
      buildAdminRedirect(request, 'error', `Missing ${envKey} in environment config`),
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

  const body = (await stripeResponse.json()) as { id?: string; url?: string; error?: { message?: string } }

  if (!stripeResponse.ok || !body.url) {
    const message = body.error?.message ?? `Stripe request failed (${stripeResponse.status})`
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'stripe_test_dollar_checkout',
      target: recipientEmail,
      status: 'error',
      metadata: { stripeStatus: stripeResponse.status, stripeMessage: message },
    })
    return NextResponse.redirect(buildAdminRedirect(request, 'error', message), { status: 302 })
  }

  await logAdminAction({
    actorUserId: user.id,
    actorEmail: user.email,
    action: 'stripe_test_dollar_checkout',
    target: recipientEmail,
    status: 'success',
    metadata: { checkoutSessionId: body.id ?? null },
  })

  return NextResponse.redirect(body.url, { status: 303 })
}
