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

export const dynamic = 'force-dynamic'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'stripe', label: 'Stripe Tests' },
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

  if (admin) {
    const [{ count: entitlementCount }, { data: latestDelivery }, { count: ledgerCustomers }] = await Promise.all([
      (admin as any)
        .from('customer_product_access')
        .select('*', { count: 'exact', head: true }),
      (admin as any)
        .from('commerce_fulfillment_ledger')
        .select('created_at')
        .in('status', ['checkout_completed', 'invoice_paid'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      (admin as any)
        .from('customer_product_access')
        .select('email', { count: 'exact', head: true }),
    ])

    accessCount = entitlementCount ?? 0
    customerCount = ledgerCustomers ?? 0
    recentDeliveryAt = latestDelivery?.created_at ?? null

    if (currentTab === 'audit') {
      const { data: logs } = await (admin as any)
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
                    <label className="block text-sm text-[color:var(--foreground)]">
                      Recipient email
                      <input
                        className="mt-1 w-full rounded-lg border border-[color:var(--line)] bg-white/90 px-3 py-2 text-sm text-[color:var(--ink)]"
                        name="email"
                        type="email"
                        defaultValue={user.email ?? ''}
                        required
                      />
                    </label>
                    <Button type="submit" className="w-full">Create $1 Stripe test checkout</Button>
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
