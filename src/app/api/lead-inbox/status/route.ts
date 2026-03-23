import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { LEAD_INBOX_COOKIE, isLeadInboxAuthorized } from '@/lib/security/lead-inbox-auth'

export const runtime = 'nodejs'

const VALID_STATUS = new Set(['new', 'reviewing', 'qualified', 'closed'])

function safeRedirect(req: NextRequest, returnTo: string, updateCode: string) {
  const target = returnTo.startsWith('/lead-inbox') ? returnTo : '/lead-inbox'
  const url = new URL(target, req.url)
  url.searchParams.set('update', updateCode)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(req: NextRequest) {
  const secret = process.env.LEAD_INBOX_PASSWORD || ''
  const authCookie = req.cookies.get(LEAD_INBOX_COOKIE)?.value

  const form = await req.formData()
  const returnTo = String(form.get('returnTo') || '/lead-inbox')

  if (!secret || !isLeadInboxAuthorized(authCookie, secret)) {
    return safeRedirect(req, '/lead-inbox?error=1', 'error')
  }

  const leadId = String(form.get('leadId') || '').trim()
  const status = String(form.get('status') || '').trim()
  const actionType = String(form.get('actionType') || '').trim()

  if (!leadId || !VALID_STATUS.has(status)) {
    return safeRedirect(req, returnTo, 'invalid')
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return safeRedirect(req, returnTo, 'config')
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const updatePayload: { status: string; last_contact_on?: string } = { status }
  if (actionType === 'first-contact') {
    updatePayload.last_contact_on = new Date().toISOString().slice(0, 10)
  }

  const { error } = await supabase.from('leads').update(updatePayload).eq('id', leadId)

  if (error) {
    return safeRedirect(req, returnTo, 'error')
  }

  return safeRedirect(req, returnTo, actionType === 'first-contact' ? 'contact-ok' : 'ok')
}
