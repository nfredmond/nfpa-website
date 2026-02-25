import { createHmac, timingSafeEqual } from 'crypto'

export const LEAD_INBOX_COOKIE = 'nf_leads_auth'

function toBuffer(value: string) {
  return Buffer.from(value, 'utf8')
}

export function computeLeadInboxToken(secret: string): string {
  return createHmac('sha256', secret).update('natford-lead-inbox').digest('hex')
}

export function isLeadInboxAuthorized(cookieValue: string | undefined, secret: string): boolean {
  if (!cookieValue) return false

  const expected = computeLeadInboxToken(secret)
  const a = toBuffer(cookieValue)
  const b = toBuffer(expected)

  if (a.length !== b.length) return false

  try {
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
