import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { evaluateAdminAccess } from '@/lib/auth/admin-access'
import { logAdminAction } from '@/lib/auth/admin-audit'

export const runtime = 'nodejs'

const SUCCESS_STATUSES = ['checkout_completed', 'invoice_paid']

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminAccess = await evaluateAdminAccess({ supabase, user })
  if (!adminAccess.ok) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'webhook_health_check',
      status: 'denied',
      metadata: { reason: adminAccess.reason, currentAal: adminAccess.currentAal },
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const windowMinutes = Number(request.nextUrl.searchParams.get('windowMinutes') ?? '120')
  const thresholdMinutes = Number.isFinite(windowMinutes) && windowMinutes > 0 ? Math.min(windowMinutes, 1440) : 120

  const admin = getSupabaseAdminClient()
  if (!admin) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'webhook_health_check',
      status: 'error',
      metadata: { reason: 'supabase_admin_unavailable' },
    })
    return NextResponse.json({ error: 'Supabase admin client unavailable' }, { status: 500 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase admin DB client uses generated table types not yet wired in this repo.
  const adminClient = admin as any

  const cutoff = new Date(Date.now() - thresholdMinutes * 60_000).toISOString()

  const { data, error } = await adminClient
    .from('commerce_fulfillment_ledger')
    .select('stripe_event_id, stripe_event_type, status, created_at')
    .in('status', SUCCESS_STATUSES)
    .gte('created_at', cutoff)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'webhook_health_check',
      status: 'error',
      metadata: { reason: 'query_failed', message: error.message },
    })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const latest = data?.[0] ?? null
  const ok = !!latest

  await logAdminAction({
    actorUserId: user.id,
    actorEmail: user.email,
    action: 'webhook_health_check',
    status: ok ? 'success' : 'error',
    metadata: {
      windowMinutes: thresholdMinutes,
      latestEventId: latest?.stripe_event_id ?? null,
      latestEventType: latest?.stripe_event_type ?? null,
    },
  })

  return NextResponse.json({
    ok,
    windowMinutes: thresholdMinutes,
    cutoff,
    latest,
    alert: ok ? null : `No successful webhook deliveries in the last ${thresholdMinutes} minutes`,
  })
}
