import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

type FacebookSignedRequestPayload = {
  algorithm?: string
  issued_at?: number
  user_id?: string
  [key: string]: unknown
}

function decodeBase64Url(input: string): Buffer {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return Buffer.from(padded, 'base64')
}

function parseSignedRequest(signedRequest: string, appSecret: string): FacebookSignedRequestPayload | null {
  const [encodedSignature, encodedPayload] = signedRequest.split('.', 2)
  if (!encodedSignature || !encodedPayload) return null

  const signature = decodeBase64Url(encodedSignature)
  const expected = createHmac('sha256', appSecret).update(encodedPayload).digest()

  if (signature.length !== expected.length) return null
  if (!timingSafeEqual(signature, expected)) return null

  try {
    const payloadRaw = decodeBase64Url(encodedPayload).toString('utf-8')
    const payload = JSON.parse(payloadRaw) as FacebookSignedRequestPayload
    if ((payload.algorithm || '').toUpperCase() !== 'HMAC-SHA256') return null
    return payload
  } catch {
    return null
  }
}

function getBaseUrl(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/$/, '')
  }

  const origin = request.nextUrl.origin
  if (/^https?:\/\//i.test(origin)) {
    return origin.replace(/\/$/, '')
  }

  return 'https://www.natfordplanning.com'
}

export async function POST(request: NextRequest) {
  const appSecret = process.env.FACEBOOK_APP_SECRET?.trim() || process.env.META_APP_SECRET?.trim()
  if (!appSecret) {
    return NextResponse.json({ error: 'Server not configured for Facebook data deletion callback.' }, { status: 503 })
  }

  const form = await request.formData()
  const signedRequest = form.get('signed_request')
  if (typeof signedRequest !== 'string' || !signedRequest.trim()) {
    return NextResponse.json({ error: 'Missing signed_request.' }, { status: 400 })
  }

  const payload = parseSignedRequest(signedRequest, appSecret)
  if (!payload) {
    return NextResponse.json({ error: 'Invalid signed_request.' }, { status: 400 })
  }

  const confirmationCode = randomUUID().replace(/-/g, '').slice(0, 12)
  const userId = String(payload.user_id || 'unknown')

  // TODO: Wire durable deletion queue + audit log persistence if/when FB user data is stored.
  // Current site does not persist Facebook user profile data directly.
  console.info('[facebook:data-deletion] request accepted', {
    confirmationCode,
    userId,
    issuedAt: payload.issued_at || null,
  })

  const baseUrl = getBaseUrl(request)
  const statusUrl = `${baseUrl}/facebook/data-deletion?code=${encodeURIComponent(confirmationCode)}`

  return NextResponse.json({
    url: statusUrl,
    confirmation_code: confirmationCode,
  })
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code') || 'pending'
  const baseUrl = getBaseUrl(request)

  return NextResponse.json({
    status: 'ready',
    callback: `${baseUrl}/api/facebook/data-deletion`,
    example_status_url: `${baseUrl}/facebook/data-deletion?code=${encodeURIComponent(code)}`,
  })
}
