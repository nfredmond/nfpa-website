import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { findTierById } from '@/lib/commerce/offers'

export const runtime = 'nodejs'

type StripeEvent = {
  id: string
  type: string
  data?: {
    object?: Record<string, unknown>
  }
}

function getWebhookSecret() {
  return (
    process.env.STRIPE_WEBHOOK_SECRET ||
    process.env.COMMERCE_STRIPE_WEBHOOK_SECRET ||
    process.env.OPENPLAN_STRIPE_WEBHOOK_SECRET ||
    ''
  ).trim()
}

function parseStripeSignature(signatureHeader: string) {
  const fields = signatureHeader.split(',').map((part) => part.trim())
  const timestampField = fields.find((field) => field.startsWith('t='))
  const v1Field = fields.find((field) => field.startsWith('v1='))

  if (!timestampField || !v1Field) {
    return null
  }

  const timestamp = timestampField.slice(2)
  const signature = v1Field.slice(3)
  if (!timestamp || !signature) {
    return null
  }

  return { timestamp, signature }
}

function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string) {
  const parsed = parseStripeSignature(signatureHeader)
  if (!parsed) return false

  const signedPayload = `${parsed.timestamp}.${rawBody}`
  const expected = createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex')

  try {
    return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(parsed.signature, 'utf8'))
  } catch {
    return false
  }
}

function statusForEventType(eventType: string): string {
  switch (eventType) {
    case 'checkout.session.completed':
      return 'checkout_completed'
    case 'invoice.payment_succeeded':
      return 'invoice_paid'
    case 'invoice.payment_failed':
      return 'invoice_payment_failed'
    case 'customer.subscription.deleted':
      return 'subscription_deleted'
    case 'customer.subscription.updated':
      return 'subscription_updated'
    case 'charge.refunded':
      return 'charge_refunded'
    default:
      return 'received'
  }
}

function inferProductAndTier(clientReferenceId: string | null) {
  if (!clientReferenceId) {
    return { productId: null, tierId: null }
  }

  if (clientReferenceId.includes(':')) {
    const [productId, tierId] = clientReferenceId.split(':', 2)
    return {
      productId: productId || null,
      tierId: tierId || null,
    }
  }

  if (clientReferenceId.endsWith('-prelaunch')) {
    const tierId = clientReferenceId.replace(/-prelaunch$/, '')
    const tier = findTierById(tierId)
    return {
      productId: tier?.product.id ?? null,
      tierId: tier?.id ?? tierId,
    }
  }

  const tier = findTierById(clientReferenceId)
  return {
    productId: tier?.product.id ?? null,
    tierId: tier?.id ?? clientReferenceId,
  }
}

function asString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signatureHeader = request.headers.get('stripe-signature')
  const webhookSecret = getWebhookSecret()

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Missing webhook secret configuration' }, { status: 500 })
  }

  if (!signatureHeader || !verifyStripeSignature(rawBody, signatureHeader, webhookSecret)) {
    return NextResponse.json({ error: 'Stripe signature verification failed' }, { status: 400 })
  }

  let event: StripeEvent
  try {
    event = JSON.parse(rawBody) as StripeEvent
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  if (!event?.id || !event?.type) {
    return NextResponse.json({ error: 'Missing Stripe event id/type' }, { status: 400 })
  }

  const admin = getSupabaseAdminClient()
  if (!admin) {
    return NextResponse.json({ error: 'Supabase admin client unavailable' }, { status: 500 })
  }

  const object = event.data?.object ?? {}

  const checkoutSessionId = asString(object.id)
  const clientReferenceId = asString(object.client_reference_id)
  const metadata = (object.metadata ?? {}) as Record<string, unknown>
  const metadataTierId = asString(metadata.tier_id) || asString(metadata.tierId)
  const metadataProductId = asString(metadata.product_id) || asString(metadata.productId)

  const inferred = inferProductAndTier(clientReferenceId)

  const row = {
    stripe_event_id: event.id,
    stripe_event_type: event.type,
    stripe_checkout_session_id: checkoutSessionId,
    stripe_payment_intent_id: asString(object.payment_intent),
    stripe_invoice_id: asString(object.invoice),
    stripe_subscription_id: asString(object.subscription) || asString(object.id),
    stripe_customer_id: asString(object.customer),
    customer_email:
      asString(object.customer_email) ||
      asString((object.customer_details as Record<string, unknown> | undefined)?.email) ||
      asString(object.receipt_email),
    product_id: metadataProductId || inferred.productId,
    tier_id: metadataTierId || inferred.tierId,
    status: statusForEventType(event.type),
    source: 'stripe_webhook',
    payload: object,
  }

  const { error } = await (admin as any)
    .from('commerce_fulfillment_ledger')
    .upsert(row, { onConflict: 'stripe_event_id' })

  if (error) {
    console.error('commerce webhook ledger upsert failed', {
      eventId: event.id,
      eventType: event.type,
      error: error.message,
    })
    return NextResponse.json({ error: 'Ledger upsert failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
