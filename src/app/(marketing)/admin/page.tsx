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
    const reasonMessage =
      adminAccess.reason === 'google_required'
        ? 'Admin access requires Google-authenticated identity.'
        : adminAccess.reason === 'mfa_required'
          ? 'Admin access requires MFA (AAL2).'
          : 'This admin surface is restricted to the allowlist.'

    return (
      <Section spacing="xl">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-300/70 bg-red-50 p-6">
            <h1 className="section-title text-3xl text-red-800">Admin access blocked</h1>
            <p className="mt-3 text-sm text-red-700">
              {reasonMessage} Current account: <strong>{user.email}</strong>
            </p>
            <p className="mt-2 text-xs text-red-700/80">Allowed: {getAdminAllowlist().join(', ')}</p>
            <p className="mt-1 text-xs text-red-700/80">Current auth assurance level: {adminAccess.currentAal ?? 'unknown'}</p>
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
  }

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
                  <h3 className="text-lg font-semibold text-[color:var(--ink)]">Gated remote actions</h3>
                  <p className="text-sm text-[color:var(--foreground)]/78">
                    These controls call a secured proxy endpoint and never expose remote action tokens in the browser.
                  </p>

                  <form method="post" action="/api/admin/agent-dashboard/action" className="grid gap-2">
                    <input type="hidden" name="action" value="reset" />
                    <Button type="submit" className="w-full justify-center">Reset gateway</Button>
                  </form>

                  <form method="post" action="/api/admin/agent-dashboard/action" className="grid gap-2">
                    <input type="hidden" name="action" value="restart" />
                    <Button type="submit" className="w-full justify-center">Restart gateway</Button>
                  </form>

                  <form method="post" action="/api/admin/agent-dashboard/action" className="grid gap-2">
                    <input type="hidden" name="action" value="stop" />
                    <button
                      type="submit"
                      className="w-full rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
                    >
                      Stop gateway
                    </button>
                  </form>

                  <form method="post" action="/api/admin/agent-dashboard/action" className="grid gap-2">
                    <input type="hidden" name="action" value="doctor-fix" />
                    <button
                      type="submit"
                      className="w-full rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
                    >
                      Run doctor --fix
                    </button>
                  </form>

                  <p className="text-xs text-[color:var(--foreground)]/68">
                    Configure environment variables: AGENT_DASHBOARD_REMOTE_BASE_URL, AGENT_DASHBOARD_REMOTE_READ_TOKEN,
                    AGENT_DASHBOARD_REMOTE_ACTION_TOKEN.
                  </p>
                </CardContent>
              </Card>
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
