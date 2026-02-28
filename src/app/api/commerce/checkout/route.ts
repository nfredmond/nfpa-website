import { NextRequest, NextResponse } from 'next/server'
import { findTierById } from '@/lib/commerce/offers'

const OPENPLAN_PRELAUNCH_END = process.env.OPENPLAN_PRELAUNCH_END ?? '2026-04-01T00:00:00-07:00'
const OPENPLAN_PRELAUNCH_PROMO_CODE = process.env.OPENPLAN_PRELAUNCH_PROMO_CODE ?? 'OPENPLAN15'
const STRIPE_ALLOWED_HOSTS = (process.env.STRIPE_ALLOWED_HOSTS ?? 'buy.stripe.com,checkout.stripe.com,pay.stripe.com')
  .split(',')
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean)

function buildContactFallback(request: NextRequest, tier: ReturnType<typeof findTierById>, reason: 'pending' | 'invalid') {
  const fallback = new URL('/contact', request.nextUrl.origin)
  fallback.searchParams.set('intent', 'subscription')
  fallback.searchParams.set('product', tier?.product.id ?? 'unknown')
  fallback.searchParams.set('tier', tier?.id ?? 'unknown')
  fallback.searchParams.set('checkout', reason)
  return fallback
}

function resolveStripePaymentLink(envName: string): string | null {
  const value = process.env[envName]
  if (!value?.trim()) {
    return null
  }

  return value.trim()
}

function isAllowedStripeHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase()
  return STRIPE_ALLOWED_HOSTS.some((allowed) => normalized === allowed || normalized.endsWith(`.${allowed}`))
}

function validateStripePaymentLink(paymentLink: string): URL | null {
  try {
    const parsed = new URL(paymentLink)
    if (parsed.protocol !== 'https:') return null
    if (!isAllowedStripeHost(parsed.hostname)) return null
    return parsed
  } catch {
    return null
  }
}

function applyCheckoutTracking(checkoutUrl: URL, tierId: string, productId: string) {
  if (!checkoutUrl.searchParams.get('client_reference_id')) {
    checkoutUrl.searchParams.set('client_reference_id', `${productId}:${tierId}`)
  }

  if (!checkoutUrl.searchParams.get('prefilled_email')) {
    // no-op: leave blank intentionally, but avoid provider overrides
  }

  if (!checkoutUrl.searchParams.get('utm_source')) checkoutUrl.searchParams.set('utm_source', 'natfordplanning.com')
  if (!checkoutUrl.searchParams.get('utm_medium')) checkoutUrl.searchParams.set('utm_medium', 'pricing-page')
  if (!checkoutUrl.searchParams.get('utm_campaign')) checkoutUrl.searchParams.set('utm_campaign', `checkout-${productId}`)
}

function maybeApplyOpenPlanPrelaunchPromo(checkoutUrl: URL, tierId: string, productId: string) {
  if (productId !== 'openplan') {
    return
  }

  const cutoff = new Date(OPENPLAN_PRELAUNCH_END)
  const now = new Date()
  if (Number.isNaN(cutoff.getTime()) || now >= cutoff) {
    return
  }

  const promoCode = OPENPLAN_PRELAUNCH_PROMO_CODE.trim()
  if (!promoCode) {
    return
  }

  checkoutUrl.searchParams.set('prefilled_promo_code', promoCode)
  checkoutUrl.searchParams.set('client_reference_id', `${tierId}-prelaunch`)
}

export async function GET(request: NextRequest) {
  const tierId = request.nextUrl.searchParams.get('tier')

  if (!tierId) {
    return NextResponse.json({ error: 'Missing tier query parameter' }, { status: 400 })
  }

  const tier = findTierById(tierId)
  if (!tier) {
    return NextResponse.json({ error: 'Unknown tier' }, { status: 404 })
  }

  const paymentLink = resolveStripePaymentLink(tier.stripePaymentLinkEnv)

  if (!paymentLink) {
    return NextResponse.redirect(buildContactFallback(request, tier, 'pending'), { status: 302 })
  }

  const checkoutUrl = validateStripePaymentLink(paymentLink)

  if (!checkoutUrl) {
    console.warn('Invalid Stripe payment link configured', {
      tierId: tier.id,
      env: tier.stripePaymentLinkEnv,
    })

    return NextResponse.redirect(buildContactFallback(request, tier, 'invalid'), { status: 302 })
  }

  applyCheckoutTracking(checkoutUrl, tier.id, tier.product.id)
  maybeApplyOpenPlanPrelaunchPromo(checkoutUrl, tier.id, tier.product.id)

  return NextResponse.redirect(checkoutUrl.toString(), { status: 302 })
}
