import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { evaluateAdminAccess } from '@/lib/auth/admin-access'
import { logAdminAction } from '@/lib/auth/admin-audit'

export const runtime = 'nodejs'

const banPayloadSchema = z.object({
  scopeType: z.enum(['user_id', 'visitor_id', 'ip']),
  scopeValue: z.string().trim().min(1).max(200),
  route: z.enum(['all', 'planner-chat', 'grant-lab']).default('all'),
  reason: z.string().trim().max(300).optional(),
})

function buildAdminRedirect(request: NextRequest, status: 'ok' | 'error', message: string) {
  const url = new URL('/admin', request.nextUrl.origin)
  url.searchParams.set('tab', 'ai-ops')
  url.searchParams.set('status', status)
  url.searchParams.set('message', message)
  return url
}

function normalizeReason(reason: string | undefined) {
  const trimmed = reason?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : 'No reason provided'
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    await logAdminAction({
      actorEmail: 'unknown',
      action: 'ai_ops_ban_create',
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
      action: 'ai_ops_ban_create',
      status: 'denied',
      metadata: { reason: adminAccess.reason, currentAal: adminAccess.currentAal },
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const parsed = banPayloadSchema.safeParse({
    scopeType: String(formData.get('scopeType') ?? ''),
    scopeValue: String(formData.get('scopeValue') ?? ''),
    route: String(formData.get('route') ?? 'all'),
    reason: String(formData.get('reason') ?? ''),
  })

  if (!parsed.success) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'ai_ops_ban_create',
      status: 'error',
      metadata: { reason: 'invalid_payload', issues: parsed.error.flatten() },
    })
    return NextResponse.redirect(buildAdminRedirect(request, 'error', 'Invalid ban input.'), { status: 302 })
  }

  const { scopeType, scopeValue, route, reason } = parsed.data
  const normalizedScopeValue = scopeValue.trim()

  if (scopeType === 'user_id' && !z.string().uuid().safeParse(normalizedScopeValue).success) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'ai_ops_ban_create',
      target: `${scopeType}:${normalizedScopeValue}`,
      status: 'error',
      metadata: { reason: 'invalid_user_id' },
    })
    return NextResponse.redirect(buildAdminRedirect(request, 'error', 'user_id must be a valid UUID.'), { status: 302 })
  }

  const admin = getSupabaseAdminClient()
  if (!admin) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'ai_ops_ban_create',
      target: `${scopeType}:${normalizedScopeValue}`,
      status: 'error',
      metadata: { reason: 'supabase_admin_unavailable' },
    })
    return NextResponse.redirect(buildAdminRedirect(request, 'error', 'Admin database client is unavailable.'), { status: 302 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase admin DB client uses generated table types not yet wired in this repo.
  const adminClient = admin as any

  const routeValue = route === 'all' ? null : route
  const reasonValue = normalizeReason(reason)

  const payload = {
    route: routeValue,
    user_id: scopeType === 'user_id' ? normalizedScopeValue : null,
    visitor_id: scopeType === 'visitor_id' ? normalizedScopeValue : null,
    ip: scopeType === 'ip' ? normalizedScopeValue : null,
    reason: reasonValue,
    active: true,
    created_by_email: user.email.toLowerCase(),
  }

  const { data, error } = await adminClient
    .from('ai_abuse_controls')
    .insert(payload)
    .select('id')
    .single()

  if (error) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'ai_ops_ban_create',
      target: `${scopeType}:${normalizedScopeValue}`,
      status: 'error',
      metadata: { reason: 'insert_failed', route: routeValue ?? 'all', dbMessage: error.message },
    })
    return NextResponse.redirect(buildAdminRedirect(request, 'error', 'Failed to create ban rule.'), { status: 302 })
  }

  await logAdminAction({
    actorUserId: user.id,
    actorEmail: user.email,
    action: 'ai_ops_ban_create',
    target: `${scopeType}:${normalizedScopeValue}`,
    status: 'success',
    metadata: {
      banId: data?.id ?? null,
      route: routeValue ?? 'all',
      reason: reasonValue,
    },
  })

  return NextResponse.redirect(buildAdminRedirect(request, 'ok', 'Ban rule created.'), { status: 302 })
}
