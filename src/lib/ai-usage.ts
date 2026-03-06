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

type AbuseControlRow = {
  id: string
  route: string | null
  user_id: string | null
  visitor_id: string | null
  ip: string | null
  reason: string | null
}

export type ActiveAiBan = {
  id: string
  route: string | null
  reason: string | null
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

function rowMatchesRequester(
  row: AbuseControlRow,
  requester: { userId?: string | null; visitorId?: string | null; ip?: string | null }
) {
  const hasAnyScope = Boolean(row.user_id || row.visitor_id || row.ip)
  if (!hasAnyScope) return false

  if (row.user_id && row.user_id !== requester.userId) return false
  if (row.visitor_id && row.visitor_id !== requester.visitorId) return false
  if (row.ip && row.ip !== requester.ip) return false

  return true
}

async function fetchActiveBansForIdentifier(
  admin: SupabaseClient,
  params: {
    column: 'user_id' | 'visitor_id' | 'ip'
    value: string
    route: string
  }
): Promise<AbuseControlRow[]> {
  const { column, value, route } = params
  const selectColumns = 'id,route,user_id,visitor_id,ip,reason'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase admin DB client uses generated table types not yet wired in this repo.
  const adminClient = admin as any

  const [routeSpecificResult, globalResult] = await Promise.all([
    adminClient
      .from('ai_abuse_controls')
      .select(selectColumns)
      .eq('active', true)
      .eq(column, value)
      .eq('route', route)
      .order('created_at', { ascending: false })
      .limit(50),
    adminClient
      .from('ai_abuse_controls')
      .select(selectColumns)
      .eq('active', true)
      .eq(column, value)
      .is('route', null)
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  if (routeSpecificResult.error) {
    throw routeSpecificResult.error
  }

  if (globalResult.error) {
    throw globalResult.error
  }

  return [...(routeSpecificResult.data ?? []), ...(globalResult.data ?? [])] as AbuseControlRow[]
}

export async function findActiveAiBan(
  admin: SupabaseClient,
  params: {
    route: string
    userId?: string | null
    visitorId?: string | null
    ip?: string | null
  }
): Promise<ActiveAiBan | null> {
  const checks: Array<Promise<AbuseControlRow[]>> = []

  if (params.userId) {
    checks.push(
      fetchActiveBansForIdentifier(admin, {
        column: 'user_id',
        value: params.userId,
        route: params.route,
      })
    )
  }

  if (params.visitorId) {
    checks.push(
      fetchActiveBansForIdentifier(admin, {
        column: 'visitor_id',
        value: params.visitorId,
        route: params.route,
      })
    )
  }

  if (params.ip) {
    checks.push(
      fetchActiveBansForIdentifier(admin, {
        column: 'ip',
        value: params.ip,
        route: params.route,
      })
    )
  }

  if (checks.length === 0) {
    return null
  }

  const groups = await Promise.all(checks)
  const deduped = new Map<string, AbuseControlRow>()

  for (const group of groups) {
    for (const row of group) {
      if (!row?.id) continue
      if (!deduped.has(row.id)) {
        deduped.set(row.id, row)
      }
    }
  }

  const match = Array.from(deduped.values()).find((row) =>
    rowMatchesRequester(row, {
      userId: params.userId ?? null,
      visitorId: params.visitorId ?? null,
      ip: params.ip ?? null,
    })
  )

  if (!match) {
    return null
  }

  return {
    id: match.id,
    route: match.route,
    reason: match.reason,
  }
}
