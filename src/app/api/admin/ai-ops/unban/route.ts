import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { evaluateAdminAccess } from '@/lib/auth/admin-access'
import { logAdminAction } from '@/lib/auth/admin-audit'

export const runtime = 'nodejs'

const unbanSchema = z.object({
  banId: z.string().uuid(),
})

function buildAdminRedirect(request: NextRequest, status: 'ok' | 'error', message: string) {
  const url = new URL('/admin', request.nextUrl.origin)
  url.searchParams.set('tab', 'ai-ops')
  url.searchParams.set('status', status)
  url.searchParams.set('message', message)
  return url
}

function identifyBanTarget(record: {
  user_id?: string | null
  visitor_id?: string | null
  ip?: string | null
}) {
  if (record.user_id) return `user_id:${record.user_id}`
  if (record.visitor_id) return `visitor_id:${record.visitor_id}`
  if (record.ip) return `ip:${record.ip}`
  return 'unknown'
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    await logAdminAction({
      actorEmail: 'unknown',
      action: 'ai_ops_ban_deactivate',
      status: 'denied',
      metadata: { reason: 'no_user' },
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminAccess = await evaluateAdminAccess({ supabase, user })
  if (!adminAccess.ok) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'ai_ops_ban_deactivate',
      status: 'denied',
      metadata: { reason: adminAccess.reason, currentAal: adminAccess.currentAal },
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const parsed = unbanSchema.safeParse({
    banId: String(formData.get('banId') ?? ''),
  })

  if (!parsed.success) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'ai_ops_ban_deactivate',
      status: 'error',
      metadata: { reason: 'invalid_payload', issues: parsed.error.flatten() },
    })
    return NextResponse.redirect(buildAdminRedirect(request, 'error', 'Invalid unban request.'), { status: 302 })
  }

  const admin = getSupabaseAdminClient()
  if (!admin) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'ai_ops_ban_deactivate',
      target: parsed.data.banId,
      status: 'error',
      metadata: { reason: 'supabase_admin_unavailable' },
    })
    return NextResponse.redirect(buildAdminRedirect(request, 'error', 'Admin database client is unavailable.'), { status: 302 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase admin DB client uses generated table types not yet wired in this repo.
  const adminClient = admin as any

  const { data, error } = await adminClient
    .from('ai_abuse_controls')
    .update({ active: false })
    .eq('id', parsed.data.banId)
    .eq('active', true)
    .select('id, route, user_id, visitor_id, ip')
    .maybeSingle()

  if (error) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'ai_ops_ban_deactivate',
      target: parsed.data.banId,
      status: 'error',
      metadata: { reason: 'update_failed', dbMessage: error.message },
    })
    return NextResponse.redirect(buildAdminRedirect(request, 'error', 'Failed to deactivate ban rule.'), { status: 302 })
  }

  if (!data) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'ai_ops_ban_deactivate',
      target: parsed.data.banId,
      status: 'error',
      metadata: { reason: 'not_found_or_inactive' },
    })
    return NextResponse.redirect(buildAdminRedirect(request, 'error', 'Ban rule not found or already inactive.'), { status: 302 })
  }

  await logAdminAction({
    actorUserId: user.id,
    actorEmail: user.email,
    action: 'ai_ops_ban_deactivate',
    target: identifyBanTarget(data),
    status: 'success',
    metadata: {
      banId: data.id,
      route: data.route ?? 'all',
    },
  })

  return NextResponse.redirect(buildAdminRedirect(request, 'ok', 'Ban rule deactivated.'), { status: 302 })
}
