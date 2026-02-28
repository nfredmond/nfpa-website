import type { SupabaseClient } from '@supabase/supabase-js'

export type UsageSnapshot = {
  lastRequestAtMs: number | null
  requestsLastHour: number
  tokensUsed24h: number
}

type UsageEventRow = {
  created_at: string
  input_tokens: number | null
  output_tokens: number | null
  status: string | null
}

export function buildScopeKey(userId: string | null | undefined, visitorId: string | null | undefined, ip: string) {
  if (userId) return `user:${userId}`
  if (visitorId) return `guest:${visitorId}`
  return `guest-ip:${ip}`
}

export async function fetchUsageSnapshot(
  admin: SupabaseClient,
  scopeKey: string,
  route: string,
  nowMs: number
): Promise<UsageSnapshot> {
  const dayAgoIso = new Date(nowMs - 24 * 60 * 60 * 1000).toISOString()
  const hourCutoff = nowMs - 60 * 60 * 1000

  const { data, error } = await admin
    .from('ai_usage_events')
    .select('created_at,input_tokens,output_tokens,status')
    .eq('scope_key', scopeKey)
    .eq('route', route)
    .gte('created_at', dayAgoIso)
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    throw error
  }

  const rows = (data ?? []) as UsageEventRow[]
  const lastRequestAtMs = rows.length > 0 ? Date.parse(rows[0].created_at) : null

  const requestsLastHour = rows.reduce((count, row) => {
    const createdAtMs = Date.parse(row.created_at)
    if (!Number.isFinite(createdAtMs)) return count
    if (createdAtMs < hourCutoff) return count
    if (row.status === 'invalid_payload') return count
    return count + 1
  }, 0)

  const tokensUsed24h = rows.reduce((sum, row) => {
    if (row.status && ['rate_limited', 'invalid_payload'].includes(row.status)) return sum
    const inTokens = Number.isFinite(row.input_tokens ?? NaN) ? Number(row.input_tokens) : 0
    const outTokens = Number.isFinite(row.output_tokens ?? NaN) ? Number(row.output_tokens) : 0
    return sum + inTokens + outTokens
  }, 0)

  return {
    lastRequestAtMs,
    requestsLastHour,
    tokensUsed24h,
  }
}

type LogUsageInput = {
  scopeKey: string
  route: string
  requesterKind: 'guest' | 'member'
  userId?: string | null
  visitorId?: string | null
  ip?: string | null
  inputTokens?: number
  outputTokens?: number
  status?: string
  metadata?: Record<string, unknown>
}

export async function logUsageEvent(admin: SupabaseClient, event: LogUsageInput) {
  const { error } = await admin.from('ai_usage_events').insert({
    scope_key: event.scopeKey,
    route: event.route,
    requester_kind: event.requesterKind,
    user_id: event.userId ?? null,
    visitor_id: event.visitorId ?? null,
    ip: event.ip ?? null,
    input_tokens: event.inputTokens ?? 0,
    output_tokens: event.outputTokens ?? 0,
    status: event.status ?? 'completed',
    metadata: event.metadata ?? {},
  })

  if (error) {
    throw error
  }
}
