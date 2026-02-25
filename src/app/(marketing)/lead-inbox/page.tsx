import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LEAD_INBOX_COOKIE, isLeadInboxAuthorized } from '@/lib/security/lead-inbox-auth'

export const dynamic = 'force-dynamic'

type Lead = {
  id: string
  first_name: string
  last_name: string
  email: string
  organization: string
  inquiry_type: string
  timeline: string
  description: string
  status: 'new' | 'reviewing' | 'qualified' | 'closed'
  source_path: string | null
  created_at: string
}

function formatDate(input: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/Los_Angeles',
    }).format(new Date(input))
  } catch {
    return input
  }
}

function statusClass(status: Lead['status']) {
  switch (status) {
    case 'qualified':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'reviewing':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'closed':
      return 'bg-gray-100 text-gray-700 border-gray-200'
    default:
      return 'bg-amber-100 text-amber-800 border-amber-200'
  }
}

function LoginPanel({ showError }: { showError: boolean }) {
  return (
    <Section spacing="xl">
      <Container>
        <div className="max-w-lg mx-auto">
          <Card>
            <CardContent className="p-7">
              <h1 className="section-title text-4xl text-[color:var(--ink)]">Lead Inbox</h1>
              <p className="mt-3 text-sm text-[color:var(--foreground)]/75">
                Internal page. Enter the inbox password to view website submissions.
              </p>

              {showError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Incorrect password. Try again.
                </div>
              )}

              <form action="/api/lead-inbox/auth" method="post" className="mt-5 space-y-4">
                <input type="hidden" name="action" value="login" />
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">
                    Inbox password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="flex h-11 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                  />
                </div>
                <Button type="submit">Open Inbox</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}

export default async function LeadInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const secret = process.env.LEAD_INBOX_PASSWORD || ''
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(LEAD_INBOX_COOKIE)?.value

  const isAuthorized = !!secret && isLeadInboxAuthorized(authCookie, secret)

  if (!isAuthorized) {
    return <LoginPanel showError={params.error === '1'} />
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return (
      <Section spacing="xl">
        <Container>
          <Card>
            <CardContent className="p-7">
              <h1 className="section-title text-4xl text-[color:var(--ink)]">Lead Inbox</h1>
              <p className="mt-3 text-sm text-[color:var(--foreground)]/75">
                Missing Supabase environment variables. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
              </p>
            </CardContent>
          </Card>
        </Container>
      </Section>
    )
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const { data, error } = await supabase
    .from('leads')
    .select('id, first_name, last_name, email, organization, inquiry_type, timeline, description, status, source_path, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  const leads = (data || []) as Lead[]

  return (
    <>
      <Section spacing="md" className="border-b border-[color:var(--line)] bg-[color:var(--background)]/85">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="pill">Internal</p>
              <h1 className="section-title mt-3 text-4xl text-[color:var(--ink)]">Lead Inbox</h1>
              <p className="mt-2 text-sm text-[color:var(--foreground)]/75">
                {leads.length} recent submissions from natfordplanning.com
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/contact">Contact page</Link>
              </Button>
              <form action="/api/lead-inbox/auth" method="post">
                <input type="hidden" name="action" value="logout" />
                <Button type="submit" variant="outline">Log out</Button>
              </form>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Could not load leads: {error.message}
            </div>
          )}

          <div className="space-y-4">
            {leads.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-sm text-[color:var(--foreground)]/75">No leads yet.</CardContent>
              </Card>
            ) : (
              leads.map((lead) => (
                <Card key={lead.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-[color:var(--ink)]">
                          {lead.first_name} {lead.last_name}
                        </h2>
                        <p className="text-sm text-[color:var(--foreground)]/75 mt-1">
                          {lead.organization} · {lead.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${statusClass(lead.status)}`}>
                          {lead.status}
                        </span>
                        <p className="mt-2 text-xs text-[color:var(--foreground)]/55">{formatDate(lead.created_at)}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-[color:var(--foreground)]/55 text-xs uppercase tracking-[0.12em]">Inquiry Type</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{lead.inquiry_type}</p>
                      </div>
                      <div>
                        <p className="text-[color:var(--foreground)]/55 text-xs uppercase tracking-[0.12em]">Timeline</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{lead.timeline}</p>
                      </div>
                      <div>
                        <p className="text-[color:var(--foreground)]/55 text-xs uppercase tracking-[0.12em]">Source</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{lead.source_path || '/contact'}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)]/82 whitespace-pre-wrap">
                      {lead.description}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </Container>
      </Section>
    </>
  )
}
