import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SignOutButton } from '@/components/auth/signout-button'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { evaluateAdminAccess, getAdminAllowlist } from '@/lib/auth/admin-access'
import projectStatusData from '@/data/admin-project-status.json'

export const dynamic = 'force-dynamic'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'stripe', label: 'Stripe Tests' },
  { id: 'agent-ops', label: 'Agent Ops' },
  { id: 'ai-ops', label: 'AI Ops' },
  { id: 'projects', label: 'Projects' },
  { id: 'pages', label: 'Pages' },
  { id: 'settings', label: 'Settings' },
  { id: 'audit', label: 'Audit Log' },
] as const

type TabId = (typeof tabs)[number]['id']

function resolveTab(raw?: string): TabId {
  const normalized = (raw ?? '').toLowerCase()
  return (tabs.find((tab) => tab.id === normalized)?.id ?? 'overview') as TabId
}

type RemoteActionSpec = {
  id: 'reset' | 'restart' | 'stop' | 'doctor-fix'
  label: string
  description: string
  risk: 'standard' | 'warning' | 'high'
  confirmPhrase: string
}

const remoteActionSpecs: RemoteActionSpec[] = [
  {
    id: 'reset',
    label: 'Reset gateway',
    description: 'Stops and force-starts the gateway. Use when the relay is wedged.',
    risk: 'warning',
    confirmPhrase: 'RESET',
  },
  {
    id: 'restart',
    label: 'Restart gateway',
    description: 'Graceful gateway restart for stale connections or env updates.',
    risk: 'standard',
    confirmPhrase: 'RESTART',
  },
  {
    id: 'stop',
    label: 'Stop gateway',
    description: 'Brings remote control offline until a reset/restart is triggered elsewhere.',
    risk: 'high',
    confirmPhrase: 'STOP',
  },
  {
    id: 'doctor-fix',
    label: 'Run doctor --fix',
    description: 'Runs OpenClaw doctor fix routine for dependency/config repair.',
    risk: 'warning',
    confirmPhrase: 'DOCTOR',
  },
]

const remoteCapabilityMatrix = {
  supported: [
    'Gateway reset/restart/stop',
    'Remote doctor --fix',
    'Read-only status snapshot (agents + gateway health)',
  ],
  unsupported: [
    'Per-agent kill/restart from this panel',
    'Arbitrary shell command execution',
    'Direct token visibility in browser',
  ],
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/Los_Angeles',
    }).format(new Date(value))
  } catch {
    return value
  }
}

type AdminProjectSnapshot = {
  project: string
  status: string
  lastUpdate: string
  owner: string
  repoPath: string
  repoUrl?: string
  nextMilestone: string
}

const projectSnapshots = (projectStatusData.projects ?? []) as AdminProjectSnapshot[]

function getProjectStatusStyle(status: string) {
  const normalized = status.toLowerCase()

  if (normalized.includes('blocked') || normalized.includes('risk')) {
    return 'border border-red-300/70 bg-red-50 text-red-800'
  }

  if (normalized.includes('planning')) {
    return 'border border-amber-300/70 bg-amber-50 text-amber-900'
  }

  if (normalized.includes('active') || normalized.includes('progress') || normalized.includes('track')) {
    return 'border border-emerald-300/70 bg-emerald-50 text-emerald-800'
  }

  return 'border border-[color:var(--line)] bg-[color:var(--fog)]/55 text-[color:var(--foreground)]'
}

type AiUsageEventRow = {
  id: string
  scope_key: string
  route: string
  status: string
  input_tokens: number | null
  output_tokens: number | null
  created_at: string
  user_id: string | null
  visitor_id: string | null
  ip: string | null
  metadata: Record<string, unknown> | null
}

type AiAbuseControlRow = {
  id: string
  route: string | null
  user_id: string | null
  visitor_id: string | null
  ip: string | null
  reason: string | null
  active: boolean
  created_by_email: string
  created_at: string
  updated_at: string
}

function getEventTokens(row: AiUsageEventRow) {
  const input = Number.isFinite(row.input_tokens ?? NaN) ? Number(row.input_tokens) : 0
  const output = Number.isFinite(row.output_tokens ?? NaN) ? Number(row.output_tokens) : 0
  return input + output
}

function formatRouteLabel(route: string | null | undefined) {
  if (!route) return 'All routes'
  if (route === 'planner-chat') return 'Planner Chat'
  if (route === 'grant-lab') return 'Grant Lab'
  return route
}

function getRequesterLabel(row: {
  scope_key?: string | null
  user_id?: string | null
  visitor_id?: string | null
  ip?: string | null
}) {
  if (row.user_id) {
    return `user:${row.user_id}`
  }
  if (row.visitor_id) {
    return `visitor:${row.visitor_id}`
  }
  if (row.ip) {
    return `ip:${row.ip}`
  }
  return row.scope_key ?? 'unknown'
}

async function getRemoteAgentDashboardSnapshot() {
  const base = (process.env.AGENT_DASHBOARD_REMOTE_BASE_URL ?? '').trim().replace(/\/$/, '')
  const token = (process.env.AGENT_DASHBOARD_REMOTE_READ_TOKEN ?? '').trim()

  if (!base) {
    return {
      configured: false,
      error: 'Set AGENT_DASHBOARD_REMOTE_BASE_URL to enable remote dashboard integration.',
    }
  }

  try {
    const response = await fetch(`${base}/api/status?limit=20&activeMinutes=240`, {
      method: 'GET',
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      cache: 'no-store',
      next: { revalidate: 0 },
    })

    const payload = (await response.json().catch(() => null)) as
      | {
          ok?: boolean
          data?: {
            generatedAt?: string
            summary?: {
              totalAgents?: number
              active?: number
              warm?: number
              idle?: number
              tokenTotal?: string
            }
            gateway?: {
              connected?: boolean
              healthy?: boolean
            }
          }
          error?: string
        }
      | null

    if (!response.ok || !payload?.ok || !payload.data) {
      return {
        configured: true,
        available: false,
        base,
        error: payload?.error ?? `Remote dashboard unavailable (${response.status})`,
      }
    }

    return {
      configured: true,
      available: true,
      base,
      data: payload.data,
    }
  } catch (error) {
    return {
      configured: true,
      available: false,
      base,
      error: error instanceof Error ? error.message : 'Failed to query remote dashboard',
    }
  }
}

type AdminPageProps = {
  searchParams?: {
    tab?: string
    status?: string
    message?: string
  }
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/admin')
  }

  const adminAccess = await evaluateAdminAccess({ supabase, user })
  if (!adminAccess.ok) {
    const blockedGuidance =
      adminAccess.reason === 'google_required'
        ? {
            headline: 'Sign in with Google first',
            body: 'This account is allowlisted, but the current session is not Google-authenticated.',
            steps: [
              'Sign out, then select “Continue with Google” on login.',
              'Use the same allowlisted email address.',
              'Return to /admin after Google sign-in succeeds.',
            ],
          }
        : adminAccess.reason === 'mfa_required'
          ? {
              headline: 'MFA verification is required',
              body: 'Admin controls require an AAL2 session for sensitive operations.',
              steps: [
                'Enable MFA in your account security settings if not already enrolled.',
                'Re-authenticate to refresh your session assurance level.',
                `Current assurance level: ${adminAccess.currentAal ?? 'unknown'}.`,
              ],
            }
          : {
              headline: 'Your account is not allowlisted for admin',
              body: 'This surface is restricted to approved operator accounts only.',
              steps: [
                'Confirm you are signing in with your Nat Ford operations email.',
                'Request allowlist approval from Nathaniel or Bartholomew.',
                `Current account: ${user.email ?? 'unknown'}`,
              ],
            }

    return (
      <Section spacing="xl">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-300/70 bg-red-50 p-6">
            <h1 className="section-title text-3xl text-red-800">Admin access blocked</h1>
            <p className="mt-3 text-sm font-semibold text-red-800">{blockedGuidance.headline}</p>
            <p className="mt-2 text-sm text-red-700">{blockedGuidance.body}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-700">
              {blockedGuidance.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-red-700/80">Allowed admins: {getAdminAllowlist().join(', ')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/login?redirect=/admin"
                className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
              >
                Return to secure login
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center justify-center rounded-lg border border-red-300/70 bg-red-100/60 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
              >
                Open customer portal
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    )
  }

  const currentTab = resolveTab(searchParams?.tab)
  const admin = getSupabaseAdminClient()

  let accessCount = 0
  let recentDeliveryAt: string | null = null
  let customerCount = 0
  let auditRows: Array<{
    id: string
    actor_email: string
    action: string
    target: string | null
    status: string
    created_at: string
  }> = []
  let aiUsageRows: AiUsageEventRow[] = []
  let activeBans: AiAbuseControlRow[] = []
  const remoteDashboard = await getRemoteAgentDashboardSnapshot()

  if (admin) {
    const [{ count: entitlementCount }, { data: latestDelivery }, { count: ledgerCustomers }] = await Promise.all([
      admin
        .from('customer_product_access')
        .select('*', { count: 'exact', head: true }),
      admin
        .from('commerce_fulfillment_ledger')
        .select('created_at')
        .in('status', ['checkout_completed', 'invoice_paid'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      admin
        .from('customer_product_access')
        .select('email', { count: 'exact', head: true }),
    ])

    accessCount = entitlementCount ?? 0
    customerCount = ledgerCustomers ?? 0
    const latestDeliveryRecord = (latestDelivery as { created_at?: string | null } | null) ?? null
    recentDeliveryAt = latestDeliveryRecord?.created_at ?? null

    if (currentTab === 'audit') {
      const { data: logs } = await admin
        .from('admin_action_log')
        .select('id, actor_email, action, target, status, created_at')
        .order('created_at', { ascending: false })
        .limit(25)

      auditRows = (logs ?? []) as typeof auditRows
    }

    if (currentTab === 'ai-ops') {
      const dayAgoIso = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString()

      const [{ data: usageData }, { data: banData }] = await Promise.all([
        admin
          .from('ai_usage_events')
          .select('id, scope_key, route, status, input_tokens, output_tokens, created_at, user_id, visitor_id, ip, metadata')
          .gte('created_at', dayAgoIso)
          .order('created_at', { ascending: false })
          .limit(2000),
        admin
          .from('ai_abuse_controls')
          .select('id, route, user_id, visitor_id, ip, reason, active, created_by_email, created_at, updated_at')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(100),
      ])

      aiUsageRows = (usageData ?? []) as AiUsageEventRow[]
      activeBans = (banData ?? []) as AiAbuseControlRow[]
    }
  }

  const aiSummary = {
    totalRequests: aiUsageRows.length,
    totalTokens: aiUsageRows.reduce((sum, row) => sum + getEventTokens(row), 0),
    plannerRequests: aiUsageRows.filter((row) => row.route === 'planner-chat').length,
    plannerTokens: aiUsageRows.filter((row) => row.route === 'planner-chat').reduce((sum, row) => sum + getEventTokens(row), 0),
    grantRequests: aiUsageRows.filter((row) => row.route === 'grant-lab').length,
    grantTokens: aiUsageRows.filter((row) => row.route === 'grant-lab').reduce((sum, row) => sum + getEventTokens(row), 0),
  }

  const topRequesters = Array.from(
    aiUsageRows.reduce((map, row) => {
      const key = row.scope_key || getRequesterLabel(row)
      const existing = map.get(key) || {
        key,
        requester: getRequesterLabel(row),
        requests: 0,
        tokens: 0,
      }
      existing.requests += 1
      existing.tokens += getEventTokens(row)
      map.set(key, existing)
      return map
    }, new Map<string, { key: string; requester: string; requests: number; tokens: number }>()).values()
  )
    .sort((a, b) => {
      if (b.tokens !== a.tokens) return b.tokens - a.tokens
      return b.requests - a.requests
    })
    .slice(0, 12)

  const recentAiEvents = aiUsageRows.slice(0, 30)

  return (
    <Section spacing="xl">
      <Container>
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="section-title text-4xl text-[color:var(--ink)]">Admin Control Center</h1>
              <p className="mt-2 text-[color:var(--foreground)]/80">
                Auth-restricted command center for Stripe tests, page controls, and delivery operations.
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/64">
                Signed in as {user.email} · AAL2 verified
              </p>
            </div>
            <SignOutButton />
          </div>

          <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
            <CardContent className="flex flex-wrap gap-2 p-4">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/admin?tab=${tab.id}`}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    currentTab === tab.id
                      ? 'bg-[color:var(--pine)] text-white'
                      : 'bg-[color:var(--fog)]/55 text-[color:var(--foreground)] hover:bg-[color:var(--fog)]'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </CardContent>
          </Card>

          {searchParams?.status === 'ok' && (
            <p className="rounded-xl border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Action completed successfully.
            </p>
          )}

          {searchParams?.status === 'error' && (
            <p className="rounded-xl border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-800">
              Action failed. Review the details below and retry if appropriate.
            </p>
          )}

          {searchParams?.message && (
            <p className="rounded-xl border border-[color:var(--line)] bg-[color:var(--fog)]/40 px-3 py-2 text-sm text-[color:var(--foreground)]/82">
              {searchParams.message}
            </p>
          )}

          {currentTab === 'overview' && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/64">Active entitlements</p>
                  <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{accessCount}</p>
                </CardContent>
              </Card>
              <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/64">Tracked customer access rows</p>
                  <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{customerCount}</p>
                </CardContent>
              </Card>
              <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/64">Last successful delivery</p>
                  <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">{formatDate(recentDeliveryAt)}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {currentTab === 'users' && (
            <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-semibold text-[color:var(--ink)]">Admin allowlist</h2>
                <p className="text-sm text-[color:var(--foreground)]/78">
                  These are the only accounts allowed to access `/admin` and admin API actions.
                </p>
                <ul className="space-y-2">
                  {getAdminAllowlist().map((allowed) => (
                    <li key={allowed} className="rounded-lg border border-[color:var(--line)] bg-[color:var(--fog)]/45 px-3 py-2 text-sm text-[color:var(--foreground)]">
                      {allowed}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-[color:var(--foreground)]/65">
                  To customize without code edits, set `ADMIN_ALLOWLIST_EMAILS` in Vercel (comma-separated).
                </p>
              </CardContent>
            </Card>
          )}

          {currentTab === 'stripe' && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                <CardContent className="space-y-4 p-6">
                  <h2 className="text-xl font-semibold text-[color:var(--ink)]">$1 Stripe test checkout</h2>
                  <p className="text-sm text-[color:var(--foreground)]/78">
                    Launches a one-time $1 hosted checkout session for quick payment-flow testing and webhook verification.
                  </p>
                  <form method="post" action="/api/admin/stripe/test-dollar" className="space-y-3">
                    <label className="block text-sm font-medium text-[color:var(--foreground)]">
                      Recipient email
                      <input
                        className="mt-1 w-full rounded-lg border border-[color:var(--line)] bg-white/90 px-3 py-2 text-sm text-[color:var(--ink)]"
                        name="email"
                        type="email"
                        defaultValue={user.email ?? ''}
                        required
                      />
                    </label>

                    <fieldset className="space-y-1">
                      <legend className="text-sm font-medium text-[color:var(--foreground)]">Environment</legend>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="mode" value="test" defaultChecked className="accent-[color:var(--pine)]" />
                          Test Mode (default)
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="mode" value="live" className="accent-[color:var(--pine)]" />
                          Live Mode
                        </label>
                      </div>
                    </fieldset>

                    <Button type="submit" className="w-full">Create $1 Stripe checkout</Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                <CardContent className="space-y-3 p-6">
                  <h3 className="text-lg font-semibold text-[color:var(--ink)]">Operational notes</h3>
                  <ul className="space-y-2 text-sm text-[color:var(--foreground)]/78">
                    <li>• Uses secure Stripe Checkout (server-side API call).</li>
                    <li>• Writes through normal webhook lane for realistic end-to-end validation.</li>
                    <li>• If `STRIPE_SECRET_KEY` is missing, endpoint returns actionable config guidance.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {currentTab === 'agent-ops' && (
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                  <CardContent className="space-y-4 p-6">
                    <h2 className="text-xl font-semibold text-[color:var(--ink)]">Remote Agent Dashboard</h2>
                    <p className="text-sm text-[color:var(--foreground)]/78">
                      Secure bridge to the local-first OpenClaw dashboard from the Nat Ford admin surface.
                    </p>

                    {!remoteDashboard.configured ? (
                      <p className="rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        {remoteDashboard.error}
                      </p>
                    ) : remoteDashboard.available ? (
                      <div className="space-y-2 rounded-lg border border-[color:var(--line)] bg-[color:var(--fog)]/45 p-4 text-sm">
                        <p>
                          <strong>Gateway:</strong>{' '}
                          {remoteDashboard.data?.gateway?.connected
                            ? remoteDashboard.data?.gateway?.healthy
                              ? 'Connected + healthy'
                              : 'Connected (probe warning)'
                            : 'Disconnected'}
                        </p>
                        <p>
                          <strong>Total agents:</strong> {remoteDashboard.data?.summary?.totalAgents ?? 0}
                        </p>
                        <p>
                          <strong>Active / Warm / Idle:</strong> {remoteDashboard.data?.summary?.active ?? 0} /{' '}
                          {remoteDashboard.data?.summary?.warm ?? 0} / {remoteDashboard.data?.summary?.idle ?? 0}
                        </p>
                        <p>
                          <strong>Token total:</strong> {remoteDashboard.data?.summary?.tokenTotal ?? '—'}
                        </p>
                        <p>
                          <strong>Snapshot:</strong> {formatDate(remoteDashboard.data?.generatedAt ?? null)}
                        </p>
                      </div>
                    ) : (
                      <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-800">
                        {remoteDashboard.error}
                      </p>
                    )}

                    {remoteDashboard.configured && (
                      <a
                        href={`${remoteDashboard.base}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-[color:var(--pine)] px-4 py-2 text-sm font-semibold text-[color:var(--pine)] transition hover:bg-[color:var(--pine)] hover:text-white"
                      >
                        Open full dashboard
                      </a>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                  <CardContent className="space-y-4 p-6">
                    <h3 className="text-lg font-semibold text-[color:var(--ink)]">Control capability matrix</h3>
                    <p className="text-sm text-[color:var(--foreground)]/78">
                      This admin panel only exposes safe, audited controls. Per-agent controls stay in the full dashboard.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-emerald-300/60 bg-emerald-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-emerald-800">Supported here</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-emerald-900">
                          {remoteCapabilityMatrix.supported.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-amber-900">Not supported here</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-amber-900">
                          {remoteCapabilityMatrix.unsupported.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-lg font-semibold text-[color:var(--ink)]">Gated remote actions</h3>
                  <p className="text-sm text-[color:var(--foreground)]/78">
                    These controls call a secured proxy endpoint, never expose remote action tokens, and require an explicit confirmation phrase.
                  </p>

                  <div className="grid gap-3 lg:grid-cols-2">
                    {remoteActionSpecs.map((action) => {
                      const buttonClass =
                        action.risk === 'high'
                          ? 'border-red-300 bg-red-50 text-red-800 hover:bg-red-100'
                          : action.risk === 'warning'
                            ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                            : 'border-[color:var(--pine)] bg-[color:var(--pine)] text-white hover:opacity-95'

                      return (
                        <form key={action.id} method="post" action="/api/admin/agent-dashboard/action" className="rounded-xl border border-[color:var(--line)] bg-[color:var(--fog)]/35 p-4">
                          <input type="hidden" name="action" value={action.id} />
                          <p className="text-sm font-semibold text-[color:var(--ink)]">{action.label}</p>
                          <p className="mt-1 text-xs text-[color:var(--foreground)]/78">{action.description}</p>

                          <label className="mt-3 block text-xs font-medium uppercase tracking-[0.08em] text-[color:var(--foreground)]/72">
                            Type {action.confirmPhrase} to confirm
                            <input
                              name="confirmPhrase"
                              required
                              autoComplete="off"
                              spellCheck={false}
                              placeholder={action.confirmPhrase}
                              className="mt-1 h-10 w-full rounded-lg border border-[color:var(--line)] bg-white/95 px-3 text-sm text-[color:var(--ink)]"
                            />
                          </label>

                          <button type="submit" className={`mt-3 w-full rounded-lg border px-3 py-2 text-sm font-semibold ${buttonClass}`}>
                            {action.label}
                          </button>
                        </form>
                      )
                    })}
                  </div>

                  <p className="text-xs text-[color:var(--foreground)]/68">
                    Configure environment variables: AGENT_DASHBOARD_REMOTE_BASE_URL, AGENT_DASHBOARD_REMOTE_READ_TOKEN,
                    AGENT_DASHBOARD_REMOTE_ACTION_TOKEN.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {currentTab === 'ai-ops' && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/64">Total requests (24h)</p>
                    <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{aiSummary.totalRequests.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/64">Estimated tokens (24h)</p>
                    <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{aiSummary.totalTokens.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/64">Planner requests / tokens</p>
                    <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">
                      {aiSummary.plannerRequests.toLocaleString()} / {aiSummary.plannerTokens.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-[color:var(--line)] bg-[color:var(--background)] md:col-span-2 lg:col-span-1">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/64">Grant Lab requests / tokens</p>
                    <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">
                      {aiSummary.grantRequests.toLocaleString()} / {aiSummary.grantTokens.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                  <CardContent className="space-y-4 p-6">
                    <h2 className="text-xl font-semibold text-[color:var(--ink)]">Top requesters (last 24h)</h2>
                    <p className="text-sm text-[color:var(--foreground)]/76">Who is using the most tokens across Planner Chat and Grant Lab.</p>
                    {topRequesters.length === 0 ? (
                      <p className="text-sm text-[color:var(--foreground)]/72">No AI events recorded in the last 24 hours.</p>
                    ) : (
                      <ul className="space-y-2">
                        {topRequesters.map((entry) => (
                          <li key={entry.key} className="rounded-lg border border-[color:var(--line)] bg-[color:var(--fog)]/40 px-3 py-2 text-sm">
                            <p className="font-medium text-[color:var(--ink)]">{entry.requester}</p>
                            <p className="text-[color:var(--foreground)]/75">
                              Requests: {entry.requests.toLocaleString()} · Tokens: {entry.tokens.toLocaleString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                  <CardContent className="space-y-4 p-6">
                    <h2 className="text-xl font-semibold text-[color:var(--ink)]">Ban management</h2>
                    <p className="text-sm text-[color:var(--foreground)]/76">Block abusive traffic by user ID, visitor ID, or IP. Route can be global or tool-specific.</p>

                    <form method="post" action="/api/admin/ai-ops/ban" className="space-y-3">
                      <label className="block text-sm text-[color:var(--foreground)]">
                        Scope type
                        <select
                          name="scopeType"
                          required
                          className="mt-1 h-10 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
                        >
                          <option value="user_id">user_id</option>
                          <option value="visitor_id">visitor_id</option>
                          <option value="ip">ip</option>
                        </select>
                      </label>

                      <label className="block text-sm text-[color:var(--foreground)]">
                        Scope value
                        <input
                          name="scopeValue"
                          required
                          placeholder="UUID, visitor token, or IP"
                          className="mt-1 h-10 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
                        />
                      </label>

                      <label className="block text-sm text-[color:var(--foreground)]">
                        Route
                        <select
                          name="route"
                          required
                          className="mt-1 h-10 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
                        >
                          <option value="all">All routes</option>
                          <option value="planner-chat">Planner Chat</option>
                          <option value="grant-lab">Grant Lab</option>
                        </select>
                      </label>

                      <label className="block text-sm text-[color:var(--foreground)]">
                        Reason
                        <textarea
                          name="reason"
                          rows={3}
                          placeholder="Example: Repeated spam requests"
                          className="mt-1 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 py-2 text-sm"
                        />
                      </label>

                      <Button type="submit" className="w-full">Create ban</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                  <CardContent className="space-y-4 p-6">
                    <h2 className="text-xl font-semibold text-[color:var(--ink)]">Active bans</h2>
                    {activeBans.length === 0 ? (
                      <p className="text-sm text-[color:var(--foreground)]/72">No active bans.</p>
                    ) : (
                      <ul className="space-y-2">
                        {activeBans.map((ban) => (
                          <li key={ban.id} className="rounded-lg border border-[color:var(--line)] bg-[color:var(--fog)]/40 px-3 py-2 text-sm">
                            <p className="font-medium text-[color:var(--ink)]">{getRequesterLabel(ban)}</p>
                            <p className="text-xs text-[color:var(--foreground)]/75">Route: {formatRouteLabel(ban.route)}</p>
                            <p className="text-xs text-[color:var(--foreground)]/75">Reason: {ban.reason || 'No reason provided'}</p>
                            <p className="text-xs text-[color:var(--foreground)]/68">
                              Added by {ban.created_by_email} on {formatDate(ban.created_at)}
                            </p>
                            <form method="post" action="/api/admin/ai-ops/unban" className="mt-2">
                              <input type="hidden" name="banId" value={ban.id} />
                              <button
                                type="submit"
                                className="rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800 hover:bg-red-100"
                              >
                                Unban
                              </button>
                            </form>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                  <CardContent className="space-y-4 p-6">
                    <h2 className="text-xl font-semibold text-[color:var(--ink)]">Recent AI events</h2>
                    {recentAiEvents.length === 0 ? (
                      <p className="text-sm text-[color:var(--foreground)]/72">No events recorded in the last 24 hours.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-[color:var(--line)] text-[color:var(--foreground)]/70">
                              <th className="px-2 py-1.5 font-medium">Route</th>
                              <th className="px-2 py-1.5 font-medium">Requester</th>
                              <th className="px-2 py-1.5 font-medium">Status</th>
                              <th className="px-2 py-1.5 font-medium">Tokens</th>
                              <th className="px-2 py-1.5 font-medium">Key source</th>
                              <th className="px-2 py-1.5 font-medium">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentAiEvents.map((event) => {
                              const keySourceRaw = (event.metadata as { key_source?: unknown } | null)?.key_source
                              const keySource = keySourceRaw === 'user_provided' ? 'user_provided' : 'platform'

                              return (
                                <tr key={event.id} className="border-b border-[color:var(--line)]/60 text-[color:var(--foreground)]">
                                  <td className="px-2 py-1.5">{formatRouteLabel(event.route)}</td>
                                  <td className="max-w-[180px] truncate px-2 py-1.5" title={getRequesterLabel(event)}>
                                    {getRequesterLabel(event)}
                                  </td>
                                  <td className="px-2 py-1.5">{event.status}</td>
                                  <td className="px-2 py-1.5">{getEventTokens(event).toLocaleString()}</td>
                                  <td className="px-2 py-1.5">{keySource}</td>
                                  <td className="whitespace-nowrap px-2 py-1.5">{formatDate(event.created_at)}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentTab === 'projects' && (
            <div className="space-y-4">
              <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
                <CardContent className="space-y-2 p-6">
                  <h2 className="text-xl font-semibold text-[color:var(--ink)]">Project status tracker</h2>
                  <p className="text-sm text-[color:var(--foreground)]/78">
                    Lightweight cross-project pulse for company initiatives. Source file: <code>src/data/admin-project-status.json</code>
                  </p>
                  <p className="text-xs text-[color:var(--foreground)]/64">
                    Feed timestamp: {formatDate(projectStatusData.generatedAt)}
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                {projectSnapshots.map((project) => (
                  <Card key={project.project} className="border border-[color:var(--line)] bg-[color:var(--background)]">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-[color:var(--ink)]">{project.project}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${getProjectStatusStyle(project.status)}`}>
                          {project.status}
                        </span>
                      </div>

                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-xs uppercase tracking-[0.08em] text-[color:var(--foreground)]/62">Last update</dt>
                          <dd className="text-[color:var(--foreground)]">{formatDate(project.lastUpdate)}</dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-[0.08em] text-[color:var(--foreground)]/62">Owner</dt>
                          <dd className="text-[color:var(--foreground)]">{project.owner}</dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-[0.08em] text-[color:var(--foreground)]/62">Repo path/link</dt>
                          <dd className="break-all text-[color:var(--foreground)]">{project.repoPath}</dd>
                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 inline-block text-xs font-medium text-[color:var(--pine)] hover:underline"
                            >
                              Open repository
                            </a>
                          )}
                        </div>
                      </dl>

                      <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--fog)]/35 px-3 py-2 text-sm text-[color:var(--foreground)]">
                        <span className="font-medium text-[color:var(--ink)]">Next milestone:</span> {project.nextMilestone}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'pages' && (
            <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-semibold text-[color:var(--ink)]">Key admin pages</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { href: '/portal', label: 'Customer portal' },
                    { href: '/lead-inbox', label: 'Lead inbox' },
                    { href: '/products', label: 'Products page' },
                    { href: '/admin?tab=settings', label: 'Admin settings tab' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-lg border border-[color:var(--line)] bg-[color:var(--fog)]/45 px-3 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--fog)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {currentTab === 'settings' && (
            <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-semibold text-[color:var(--ink)]">Settings + customization shell</h2>
                <p className="text-sm text-[color:var(--foreground)]/78">
                  This tab is the launch point for deeper per-product admin controls (tabs, page toggles, onboarding automation, and pricing experiments).
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--fog)]/35 p-4">
                    <h3 className="font-medium text-[color:var(--ink)]">Feature flag lane</h3>
                    <p className="mt-1 text-sm text-[color:var(--foreground)]/76">Designate which products/tabs are visible by role.</p>
                  </div>
                  <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--fog)]/35 p-4">
                    <h3 className="font-medium text-[color:var(--ink)]">Onboarding automations</h3>
                    <p className="mt-1 text-sm text-[color:var(--foreground)]/76">Control welcome email + provisioning workflow behavior by tier.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentTab === 'audit' && (
            <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-semibold text-[color:var(--ink)]">Admin action audit log</h2>
                <p className="text-sm text-[color:var(--foreground)]/78">
                  Recent admin actions (Stripe tests, health checks, and gated operation attempts).
                </p>
                {auditRows.length === 0 ? (
                  <p className="text-sm text-[color:var(--foreground)]/72">No actions logged yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {auditRows.map((entry) => (
                      <li key={entry.id} className="rounded-lg border border-[color:var(--line)] bg-[color:var(--fog)]/40 px-3 py-2 text-sm">
                        <p className="font-medium text-[color:var(--ink)]">
                          {entry.action} · {entry.status}
                        </p>
                        <p className="text-[color:var(--foreground)]/76">
                          {entry.actor_email} {entry.target ? `→ ${entry.target}` : ''}
                        </p>
                        <p className="text-xs text-[color:var(--foreground)]/68">{formatDate(entry.created_at)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </Section>
  )
}
