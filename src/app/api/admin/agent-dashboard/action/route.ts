import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { evaluateAdminAccess } from '@/lib/auth/admin-access'
import { logAdminAction } from '@/lib/auth/admin-audit'
import { sanitizeTextForLog } from '@/lib/security/redact-secrets'

export const runtime = 'nodejs'

const ALLOWED_ACTIONS = new Set(['reset', 'stop', 'restart', 'doctor-fix'])
const ACTION_CONFIRM_PHRASE: Record<string, string> = {
  reset: 'RESET',
  restart: 'RESTART',
  stop: 'STOP',
  'doctor-fix': 'DOCTOR',
}

function requiredPhraseForAction(action: string) {
  return ACTION_CONFIRM_PHRASE[action] ?? 'CONFIRM'
}

function adminRedirect(request: NextRequest, status: 'ok' | 'error', message: string) {
  const url = new URL('/admin', request.nextUrl.origin)
  url.searchParams.set('tab', 'agent-ops')
  url.searchParams.set('status', status)
  url.searchParams.set('message', message)
  return url
}

function normalizeBaseUrl(raw: string | undefined) {
  const value = (raw ?? '').trim().replace(/\/$/, '')
  return value
}

export async function POST(request: NextRequest) {
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
      action: 'agent_dashboard_remote_action',
      status: 'denied',
      metadata: { reason: adminAccess.reason, currentAal: adminAccess.currentAal },
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const action = String(formData.get('action') ?? '').trim().toLowerCase()
  const providedConfirmPhrase = String(formData.get('confirmPhrase') ?? '')
    .trim()
    .toUpperCase()

  if (!ALLOWED_ACTIONS.has(action)) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'agent_dashboard_remote_action',
      status: 'error',
      metadata: { reason: 'invalid_action', action },
    })
    return NextResponse.redirect(adminRedirect(request, 'error', `Unsupported action: ${action || 'none'}`), { status: 302 })
  }

  const expectedConfirmPhrase = requiredPhraseForAction(action)
  if (providedConfirmPhrase !== expectedConfirmPhrase) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'agent_dashboard_remote_action',
      target: action,
      status: 'denied',
      metadata: { reason: 'confirm_phrase_mismatch', expectedConfirmPhrase },
    })

    return NextResponse.redirect(
      adminRedirect(request, 'error', `Confirmation phrase mismatch. Type ${expectedConfirmPhrase} to run ${action}.`),
      { status: 302 }
    )
  }

  const baseUrl = normalizeBaseUrl(process.env.AGENT_DASHBOARD_REMOTE_BASE_URL)
  const actionToken = (process.env.AGENT_DASHBOARD_REMOTE_ACTION_TOKEN ?? '').trim()

  if (!baseUrl || !actionToken) {
    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'agent_dashboard_remote_action',
      target: action,
      status: 'error',
      metadata: {
        reason: 'missing_remote_config',
        hasBaseUrl: Boolean(baseUrl),
        hasActionToken: Boolean(actionToken),
      },
    })
    return NextResponse.redirect(
      adminRedirect(request, 'error', 'Missing AGENT_DASHBOARD_REMOTE_BASE_URL or AGENT_DASHBOARD_REMOTE_ACTION_TOKEN'),
      { status: 302 }
    )
  }

  await logAdminAction({
    actorUserId: user.id,
    actorEmail: user.email,
    action: 'agent_dashboard_remote_action',
    target: action,
    status: 'started',
    metadata: { baseUrl },
  })

  const timeoutMs = Number(process.env.AGENT_DASHBOARD_REMOTE_TIMEOUT_MS ?? '45000')

  let response: Response
  try {
    response = await fetch(`${baseUrl}/api/actions/${action}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${actionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ confirm: true }),
      cache: 'no-store',
      signal: AbortSignal.timeout(Number.isFinite(timeoutMs) ? Math.max(5000, timeoutMs) : 45000),
    })
  } catch (error) {
    const errorMessage = sanitizeTextForLog(error instanceof Error ? error.message : String(error))

    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'agent_dashboard_remote_action',
      target: action,
      status: 'error',
      metadata: { reason: 'fetch_failed', message: errorMessage },
    })

    return NextResponse.redirect(adminRedirect(request, 'error', `Dashboard action request failed: ${errorMessage || 'unknown error'}`), {
      status: 302,
    })
  }

  const payload = (await response.json().catch(() => null)) as
    | {
        ok?: boolean
        error?: string
        result?: {
          stderr?: string
          stdout?: string
        }
      }
    | null

  if (!response.ok || !payload?.ok) {
    const message = sanitizeTextForLog(payload?.error || payload?.result?.stderr || `Action failed (${response.status})`)

    await logAdminAction({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'agent_dashboard_remote_action',
      target: action,
      status: 'error',
      metadata: { reason: 'remote_error', status: response.status, message },
    })

    return NextResponse.redirect(adminRedirect(request, 'error', message), { status: 302 })
  }

  const stdoutSnippet = sanitizeTextForLog(payload.result?.stdout?.slice(0, 160) ?? '')

  await logAdminAction({
    actorUserId: user.id,
    actorEmail: user.email,
    action: 'agent_dashboard_remote_action',
    target: action,
    status: 'success',
    metadata: {
      status: response.status,
      message: stdoutSnippet || null,
    },
  })

  return NextResponse.redirect(
    adminRedirect(request, 'ok', stdoutSnippet ? `Action completed: ${action} (${stdoutSnippet})` : `Action completed: ${action}`),
    { status: 302 }
  )
}
