import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { evaluateAdminAccess } from '@/lib/auth/admin-access'
import { logAdminAction } from '@/lib/auth/admin-audit'

export const runtime = 'nodejs'

function normalizeBaseUrl(raw: string | undefined) {
  return (raw ?? '').trim().replace(/\/$/, '')
}

export async function GET() {
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
      action: 'agent_dashboard_remote_status',
      status: 'denied',
      metadata: { reason: adminAccess.reason, currentAal: adminAccess.currentAal },
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const baseUrl = normalizeBaseUrl(process.env.AGENT_DASHBOARD_REMOTE_BASE_URL)
  const readToken = (process.env.AGENT_DASHBOARD_REMOTE_READ_TOKEN ?? '').trim()

  if (!baseUrl) {
    return NextResponse.json({ ok: false, error: 'Missing AGENT_DASHBOARD_REMOTE_BASE_URL' }, { status: 500 })
  }

  try {
    const remote = await fetch(`${baseUrl}/api/status?limit=50&activeMinutes=240`, {
      method: 'GET',
      headers: readToken
        ? {
            Authorization: `Bearer ${readToken}`,
          }
        : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })

    const payload = await remote.json().catch(() => null)
    const ok = remote.ok && !!payload?.ok

    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'agent_dashboard_remote_status',
      status: ok ? 'success' : 'error',
      metadata: {
        httpStatus: remote.status,
        remoteOk: payload?.ok ?? false,
      },
    })

    return NextResponse.json(
      {
        ok,
        remoteStatus: remote.status,
        payload,
      },
      {
        status: ok ? 200 : 502,
      }
    )
  } catch (error) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'agent_dashboard_remote_status',
      status: 'error',
      metadata: { reason: 'fetch_failed', message: error instanceof Error ? error.message : String(error) },
    })

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to query remote dashboard',
      },
      { status: 502 }
    )
  }
}
