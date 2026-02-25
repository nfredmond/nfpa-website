import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { LEAD_INBOX_COOKIE, isLeadInboxAuthorized } from '@/lib/security/lead-inbox-auth'

export const runtime = 'nodejs'

const VALID_STATUS = new Set(['new', 'reviewing', 'qualified', 'closed'])

export async function POST(req: NextRequest) {
  const secret = process.env.LEAD_INBOX_PASSWORD || ''
  const authCookie = req.cookies.get(LEAD_INBOX_COOKIE)?.value

  if (!secret || !isLeadInboxAuthorized(authCookie, secret)) {
    return NextResponse.redirect(new URL('/lead-inbox?error=1', req.url), { status: 303 })
  }

  const form = await req.formData()
  const leadId = String(form.get('leadId') || '').trim()
  const status = String(form.get('status') || '').trim()

  if (!leadId || !VALID_STATUS.has(status)) {
    return NextResponse.redirect(new URL('/lead-inbox?update=invalid', req.url), { status: 303 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.redirect(new URL('/lead-inbox?update=config', req.url), { status: 303 })
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const { error } = await supabase.from('leads').update({ status }).eq('id', leadId)

  if (error) {
    return NextResponse.redirect(new URL('/lead-inbox?update=error', req.url), { status: 303 })
  }

  return NextResponse.redirect(new URL('/lead-inbox?update=ok', req.url), { status: 303 })
}
