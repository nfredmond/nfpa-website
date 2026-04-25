import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { inferProductAndTierFromClientReference, normalizeCommerceProductTierReference } from '@/lib/commerce/offers'

export const runtime = 'nodejs'

const WELCOME_EVENT_TYPES = new Set(['checkout.session.completed'])

type StripeEvent = {
  id: string
  type: string
  data?: {
    object?: Record<string, unknown>
  }
}

function getWebhookSecrets(): string[] {
  const secrets = [
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_TEST_WEBHOOK_SECRET,
    process.env.COMMERCE_STRIPE_WEBHOOK_SECRET,
    process.env.OPENPLAN_STRIPE_WEBHOOK_SECRET,
  ]
  return secrets.filter((s) => s && s.trim().length > 0) as string[]
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

function accessStatusForEventType(eventType: string): string {
  switch (eventType) {
    case 'checkout.session.completed':
    case 'invoice.payment_succeeded':
    case 'customer.subscription.updated':
      return 'active'
    case 'invoice.payment_failed':
      return 'past_due'
    case 'customer.subscription.deleted':
      return 'canceled'
    case 'charge.refunded':
      return 'refunded'
    default:
      return 'pending'
  }
}

function normalizeEmail(value: string | null): string | null {
  return value ? value.trim().toLowerCase() : null
}

function shouldTriggerWelcome(eventType: string, accessStatus: string) {
  return WELCOME_EVENT_TYPES.has(eventType) && accessStatus === 'active'
}

function getUntypedAdminDbClient(admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase admin DB client uses generated table types not yet wired in this repo.
  return admin as any
}

async function maybeSendWelcomeEmail(params: {
  to: string
  productId: string
  tierId: string
}) {
  const apiKey = (process.env.RESEND_API_KEY ?? '').trim()
  const from = (process.env.ONBOARDING_FROM_EMAIL ?? '').trim()

  if (!apiKey || !from) {
    return {
      status: 'pending_email_config' as const,
      providerMessageId: null,
      providerError: 'Missing RESEND_API_KEY or ONBOARDING_FROM_EMAIL',
    }
  }

  const { to, productId, tierId } = params

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Welcome — your ${productId} access is active`,
      html: `<p>Your <strong>${productId}</strong> access is now active.</p>
<p>Tier: <strong>${tierId}</strong></p>
<p>You can sign in at <a href="https://www.natfordplanning.com/login">https://www.natfordplanning.com/login</a>.</p>
<p>If you need support, reply to this email and we will provision updates quickly.</p>`,
    }),
    cache: 'no-store',
  })

  const body = (await response.json()) as { id?: string; message?: string }

  if (!response.ok) {
    return {
      status: 'email_failed' as const,
      providerMessageId: null,
      providerError: body?.message ?? `Resend request failed (${response.status})`,
    }
  }

  return {
    status: 'email_sent' as const,
    providerMessageId: body?.id ?? null,
    providerError: null,
  }
}

async function queueOnboardingEvent(params: {
  admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>
  stripeEventId: string
  customerEmail: string
  productId: string
  tierId: string
  eventType: string
  metadata: Record<string, unknown>
}) {
  const { admin, stripeEventId, customerEmail, productId, tierId, eventType, metadata } = params

  const sendResult = await maybeSendWelcomeEmail({
    to: customerEmail,
    productId,
    tierId,
  })

  const status = sendResult.status === 'email_sent' ? 'sent' : sendResult.status
  const adminDbClient = getUntypedAdminDbClient(admin)

  const { error } = await adminDbClient
    .from('customer_onboarding_events')
    .upsert(
      {
        stripe_event_id: stripeEventId,
        customer_email: customerEmail,
        product_id: productId,
        tier_id: tierId,
        event_type: eventType,
        status,
        provider_message_id: sendResult.providerMessageId,
        provider_error: sendResult.providerError,
        sent_at: sendResult.status === 'email_sent' ? new Date().toISOString() : null,
        metadata,
      },
      { onConflict: 'stripe_event_id' }
    )

  if (error) {
    console.error('onboarding event upsert failed', {
      stripeEventId,
      customerEmail,
      productId,
      tierId,
      eventType,
      error: error.message,
    })
  }
}

function asString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

async function syncEntitlementToUserMetadata(params: {
  admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>
  email: string
  productId: string
  tierId: string
  accessStatus: string
}) {
  const { admin, email, productId, tierId, accessStatus } = params

  try {
    const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    if (listed?.error) {
      throw listed.error
    }

    const target = (listed?.data?.users ?? []).find(
      (user: { email?: string | null }) => user.email?.toLowerCase() === email
    )

    if (!target?.id) {
      return
    }

    const existingAccess =
      target.app_metadata && typeof target.app_metadata.product_access === 'object'
        ? target.app_metadata.product_access
        : {}

    const productAccess = {
      ...(existingAccess as Record<string, unknown>),
      [productId]: {
        tierId,
        status: accessStatus,
        updatedAt: new Date().toISOString(),
      },
    }

    const nextAppMetadata = {
      ...(target.app_metadata ?? {}),
      product_access: productAccess,
    }

    await admin.auth.admin.updateUserById(target.id, {
      app_metadata: nextAppMetadata,
    })
  } catch (error) {
    console.error('commerce webhook metadata sync failed', {
      email,
      productId,
      tierId,
      accessStatus,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signatureHeader = request.headers.get('stripe-signature')
  const webhookSecrets = getWebhookSecrets()

  if (webhookSecrets.length === 0) {
    return NextResponse.json({ error: 'Missing webhook secret configuration' }, { status: 500 })
  }

  if (!signatureHeader) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 })
  }

  const isValid = webhookSecrets.some((secret) => verifyStripeSignature(rawBody, signatureHeader, secret.trim()))

  if (!isValid) {
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

  const adminDbClient = getUntypedAdminDbClient(admin)

  const object = event.data?.object ?? {}

  const checkoutSessionId = asString(object.id)
  const clientReferenceId = asString(object.client_reference_id)
  const metadata = (object.metadata ?? {}) as Record<string, unknown>
  const metadataTierId = asString(metadata.tier_id) || asString(metadata.tierId)
  const metadataProductId = asString(metadata.product_id) || asString(metadata.productId)

  const inferred = inferProductAndTierFromClientReference(clientReferenceId)
  const metadataReference = normalizeCommerceProductTierReference(metadataProductId, metadataTierId)

  const customerEmail = normalizeEmail(
    asString(object.customer_email) ||
      asString((object.customer_details as Record<string, unknown> | undefined)?.email) ||
      asString(object.receipt_email)
  )

  const productId = metadataReference.productId || inferred.productId
  const tierId = metadataReference.tierId || inferred.tierId

  const row = {
    stripe_event_id: event.id,
    stripe_event_type: event.type,
    stripe_checkout_session_id: checkoutSessionId,
    stripe_payment_intent_id: asString(object.payment_intent),
    stripe_invoice_id: asString(object.invoice),
    stripe_subscription_id: asString(object.subscription) || asString(object.id),
    stripe_customer_id: asString(object.customer),
    customer_email: customerEmail,
    product_id: productId,
    tier_id: tierId,
    status: statusForEventType(event.type),
    source: 'stripe_webhook',
    payload: object,
  }

  const { error } = await adminDbClient
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

  if (customerEmail && productId && tierId) {
    const accessStatus = accessStatusForEventType(event.type)
    const { error: accessError } = await adminDbClient
      .from('customer_product_access')
      .upsert(
        {
          email: customerEmail,
          product_id: productId,
          tier_id: tierId,
          status: accessStatus,
          source: 'stripe_webhook',
          stripe_event_id: event.id,
          checkout_session_id: checkoutSessionId,
          metadata: {
            stripeEventType: event.type,
            clientReferenceId,
          },
        },
        { onConflict: 'email,product_id' }
      )

    if (accessError) {
      console.error('commerce webhook access upsert failed', {
        eventId: event.id,
        eventType: event.type,
        email: customerEmail,
        productId,
        tierId,
        error: accessError.message,
      })
    } else {
      await syncEntitlementToUserMetadata({
        admin,
        email: customerEmail,
        productId,
        tierId,
        accessStatus,
      })

      if (shouldTriggerWelcome(event.type, accessStatus)) {
        await queueOnboardingEvent({
          admin,
          stripeEventId: event.id,
          customerEmail,
          productId,
          tierId,
          eventType: event.type,
          metadata: {
            source: 'stripe_webhook',
            checkoutSessionId,
            clientReferenceId,
          },
        })
      }
    }
  }

  return NextResponse.json({ ok: true })
}
