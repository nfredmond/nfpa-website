import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { isAdminAllowlistedEmail } from '@/lib/auth/admin-access'

export const runtime = 'nodejs'

const SUCCESS_STATUSES = ['checkout_completed', 'invoice_paid']

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email || !isAdminAllowlistedEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const windowMinutes = Number(request.nextUrl.searchParams.get('windowMinutes') ?? '120')
  const thresholdMinutes = Number.isFinite(windowMinutes) && windowMinutes > 0 ? Math.min(windowMinutes, 1440) : 120

  const admin = getSupabaseAdminClient()
  if (!admin) {
    return NextResponse.json({ error: 'Supabase admin client unavailable' }, { status: 500 })
  }

  const cutoff = new Date(Date.now() - thresholdMinutes * 60_000).toISOString()

  const { data, error } = await (admin as any)
    .from('commerce_fulfillment_ledger')
    .select('stripe_event_id, stripe_event_type, status, created_at')
    .in('status', SUCCESS_STATUSES)
    .gte('created_at', cutoff)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const latest = data?.[0] ?? null
  const ok = !!latest

  return NextResponse.json({
    ok,
    windowMinutes: thresholdMinutes,
    cutoff,
    latest,
    alert: ok ? null : `No successful webhook deliveries in the last ${thresholdMinutes} minutes`,
  })
}
