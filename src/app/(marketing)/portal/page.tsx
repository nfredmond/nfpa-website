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

export default async function PortalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/portal')
  }

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
              </dl>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
