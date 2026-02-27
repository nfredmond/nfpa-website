import { redirect } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { SignOutButton } from '@/components/auth/signout-button'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function formatJoinedDate(dateInput?: string | null) {
  if (!dateInput) return 'Unknown'

  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeZone: 'America/Los_Angeles',
    }).format(new Date(dateInput))
  } catch {
    return dateInput
  }
}

type PortalRole = 'customer' | 'planner' | 'admin'

function resolvePortalRole(user: {
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
}): PortalRole {
  const rawRole =
    (typeof user.app_metadata?.role === 'string' && user.app_metadata.role) ||
    (typeof user.user_metadata?.role === 'string' && user.user_metadata.role) ||
    'customer'

  const normalized = rawRole.toLowerCase()
  if (['admin', 'owner', 'super_admin'].includes(normalized)) return 'admin'
  if (['planner', 'staff', 'team'].includes(normalized)) return 'planner'
  return 'customer'
}

export default async function PortalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/portal')
  }

  const role = resolvePortalRole(user)

  return (
    <Section spacing="xl">
      <Container>
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="section-title text-4xl text-[color:var(--ink)]">Customer Portal</h1>
              <p className="mt-2 text-[color:var(--foreground)]/80">
                Welcome back. This account layer is now active and ready for client-facing features.
              </p>
            </div>
            <SignOutButton />
          </div>

          <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-[color:var(--ink)]">Account snapshot</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/60">Email</dt>
                  <dd className="mt-1 text-sm text-[color:var(--foreground)]">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/60">Joined</dt>
                  <dd className="mt-1 text-sm text-[color:var(--foreground)]">{formatJoinedDate(user.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/60">User ID</dt>
                  <dd className="mt-1 break-all text-sm text-[color:var(--foreground)]">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/60">Email confirmed</dt>
                  <dd className="mt-1 text-sm text-[color:var(--foreground)]">
                    {user.email_confirmed_at ? 'Yes' : 'Pending confirmation'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/60">Portal role</dt>
                  <dd className="mt-1 text-sm capitalize text-[color:var(--foreground)]">{role}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-[color:var(--ink)]">Documents</h3>
                <p className="mt-2 text-sm text-[color:var(--foreground)]/78">
                  Secure plan files, PDFs, and delivery packages for your projects.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-[color:var(--ink)]">Invoices</h3>
                <p className="mt-2 text-sm text-[color:var(--foreground)]/78">
                  Billing history, payment status, and downloadable invoice records.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-[color:var(--ink)]">Project Status</h3>
                <p className="mt-2 text-sm text-[color:var(--foreground)]/78">
                  Milestones, current phase, upcoming actions, and owner updates.
                </p>
              </CardContent>
            </Card>
          </div>

          {role !== 'customer' && (
            <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[color:var(--ink)]">Team Operations Section</h3>
                <p className="mt-2 text-sm text-[color:var(--foreground)]/78">
                  Internal workflow panel enabled for planner/admin roles: queue health, lead handoffs, and delivery readiness checks.
                </p>
              </CardContent>
            </Card>
          )}

          {role === 'admin' && (
            <Card className="border border-[color:var(--line)] bg-[color:var(--background)]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[color:var(--ink)]">Admin Controls</h3>
                <p className="mt-2 text-sm text-[color:var(--foreground)]/78">
                  Elevated controls for account governance, billing policy, and access-role administration.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </Section>
  )
}
