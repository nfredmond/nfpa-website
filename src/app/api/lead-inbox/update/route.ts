import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { LEAD_INBOX_COOKIE, isLeadInboxAuthorized } from '@/lib/security/lead-inbox-auth'

export const runtime = 'nodejs'

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
  const ownerName = String(form.get('ownerName') || '').trim().slice(0, 120)
  const notes = String(form.get('notes') || '').trim().slice(0, 8000)
  const lastContactOnRaw = String(form.get('lastContactOn') || '').trim()
  const nextStepOnRaw = String(form.get('nextStepOn') || '').trim()

  const isValidDate = (value: string) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)

  if (!leadId || !isValidDate(lastContactOnRaw) || !isValidDate(nextStepOnRaw)) {
    return safeRedirect(req, returnTo, 'crm-invalid')
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return safeRedirect(req, returnTo, 'config')
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const { error } = await supabase
    .from('leads')
    .update({
      owner_name: ownerName || null,
      notes: notes || null,
      last_contact_on: lastContactOnRaw || null,
      next_step_on: nextStepOnRaw || null,
    })
    .eq('id', leadId)

  if (error) {
    return safeRedirect(req, returnTo, 'crm-error')
  }

  return safeRedirect(req, returnTo, 'crm-ok')
}
