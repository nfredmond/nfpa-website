import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { Download, Mail } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LEAD_INBOX_COOKIE, isLeadInboxAuthorized } from '@/lib/security/lead-inbox-auth'

export const dynamic = 'force-dynamic'

type LeadStatus = 'new' | 'reviewing' | 'qualified' | 'closed'

type Lead = {
  id: string
  first_name: string
  last_name: string
  email: string
  organization: string
  inquiry_type: string
  timeline: string
  description: string
  status: LeadStatus
  owner_name: string | null
  notes: string | null
  source_path: string | null
  created_at: string
}

const STATUS_OPTIONS: Array<LeadStatus | 'all'> = ['all', 'new', 'reviewing', 'qualified', 'closed']
const DAYS_OPTIONS = ['all', '7', '30', '90'] as const
const INQUIRY_TYPE_OPTIONS = [
  'all',
  'Planning support',
  'GIS / mapping',
  'Grant strategy',
  'OpenPlan product',
  'Ads automation product',
  'General inquiry',
] as const

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

function statusClass(status: LeadStatus) {
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

function updateMessage(code?: string) {
  switch (code) {
    case 'ok':
      return { kind: 'ok' as const, text: 'Lead status updated.' }
    case 'crm-ok':
      return { kind: 'ok' as const, text: 'Lead owner/notes saved.' }
    case 'invalid':
    case 'crm-invalid':
      return { kind: 'error' as const, text: 'Invalid update request.' }
    case 'config':
      return { kind: 'error' as const, text: 'Supabase env vars missing for update action.' }
    case 'error':
    case 'crm-error':
      return { kind: 'error' as const, text: 'Could not update lead right now.' }
    default:
      return null
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
  searchParams: Promise<{ error?: string; update?: string; q?: string; status?: string; type?: string; days?: string }>
}) {
  const params = await searchParams
  const secret = process.env.LEAD_INBOX_PASSWORD || ''
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(LEAD_INBOX_COOKIE)?.value

  const isAuthorized = !!secret && isLeadInboxAuthorized(authCookie, secret)

  if (!isAuthorized) {
    return <LoginPanel showError={params.error === '1'} />
  }

  const q = (params.q || '').trim()
  const statusFilter: LeadStatus | 'all' = STATUS_OPTIONS.includes((params.status || 'all') as LeadStatus | 'all')
    ? ((params.status || 'all') as LeadStatus | 'all')
    : 'all'

  const typeFilter = INQUIRY_TYPE_OPTIONS.includes((params.type || 'all') as (typeof INQUIRY_TYPE_OPTIONS)[number])
    ? ((params.type || 'all') as (typeof INQUIRY_TYPE_OPTIONS)[number])
    : 'all'

  const daysFilter = DAYS_OPTIONS.includes((params.days || 'all') as (typeof DAYS_OPTIONS)[number])
    ? ((params.days || 'all') as (typeof DAYS_OPTIONS)[number])
    : 'all'

  const returnParams = new URLSearchParams()
  if (q) returnParams.set('q', q)
  if (statusFilter !== 'all') returnParams.set('status', statusFilter)
  if (typeFilter !== 'all') returnParams.set('type', typeFilter)
  if (daysFilter !== 'all') returnParams.set('days', daysFilter)
  const returnTo = `/lead-inbox${returnParams.toString() ? `?${returnParams.toString()}` : ''}`

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

  let query = supabase
    .from('leads')
    .select(
      'id, first_name, last_name, email, organization, inquiry_type, timeline, description, status, owner_name, notes, source_path, created_at'
    )
    .order('created_at', { ascending: false })
    .limit(200)

  if (statusFilter !== 'all') query = query.eq('status', statusFilter)
  if (typeFilter !== 'all') query = query.eq('inquiry_type', typeFilter)

  if (daysFilter !== 'all') {
    const days = Number(daysFilter)
    if (Number.isFinite(days) && days > 0) {
      const cutoffDate = new Date()
      cutoffDate.setUTCDate(cutoffDate.getUTCDate() - days)
      query = query.gte('created_at', cutoffDate.toISOString())
    }
  }

  if (q) {
    const cleaned = q.replace(/[%]/g, '').replace(/,/g, ' ').trim()
    if (cleaned) {
      query = query.or(
        `first_name.ilike.%${cleaned}%,last_name.ilike.%${cleaned}%,email.ilike.%${cleaned}%,organization.ilike.%${cleaned}%,description.ilike.%${cleaned}%,notes.ilike.%${cleaned}%`
      )
    }
  }

  const { data, error } = await query

  const leads = (data || []) as Lead[]
  const update = updateMessage(params.update)

  return (
    <>
      <Section spacing="md" className="border-b border-[color:var(--line)] bg-[color:var(--background)]/85">
        <Container>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="pill">Internal</p>
                <h1 className="section-title mt-3 text-4xl text-[color:var(--ink)]">Lead Inbox</h1>
                <p className="mt-2 text-sm text-[color:var(--foreground)]/75">
                  {leads.length} matching submissions from natfordplanning.com
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <a href="/api/lead-inbox/export">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact page</Link>
                </Button>
                <form action="/api/lead-inbox/auth" method="post">
                  <input type="hidden" name="action" value="logout" />
                  <Button type="submit" variant="outline">
                    Log out
                  </Button>
                </form>
              </div>
            </div>

            <form method="get" action="/lead-inbox" className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                name="q"
                defaultValue={q}
                placeholder="Search name, org, email, notes"
                className="h-10 rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
              />
              <select
                name="status"
                defaultValue={statusFilter}
                className="h-10 rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    Status: {status}
                  </option>
                ))}
              </select>
              <select
                name="type"
                defaultValue={typeFilter}
                className="h-10 rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
              >
                {INQUIRY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    Type: {opt}
                  </option>
                ))}
              </select>
              <select
                name="days"
                defaultValue={daysFilter}
                className="h-10 rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
              >
                <option value="all">Any date</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              <div className="md:col-span-4 flex gap-2">
                <Button type="submit" size="sm">
                  Apply filters
                </Button>
                <Button asChild type="button" size="sm" variant="outline">
                  <Link href="/lead-inbox">Reset</Link>
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          {update && (
            <div
              className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
                update.kind === 'ok'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {update.text}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Could not load leads: {error.message}
            </div>
          )}

          <div className="space-y-4">
            {leads.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-sm text-[color:var(--foreground)]/75">No leads match the current filters.</CardContent>
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
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${statusClass(
                            lead.status
                          )}`}
                        >
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

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <a href={`mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent('Nat Ford follow-up')}`}>
                          <Mail className="mr-1.5 h-4 w-4" />
                          Email
                        </a>
                      </Button>

                      {(['new', 'reviewing', 'qualified', 'closed'] as const).map((status) => (
                        <form key={status} action="/api/lead-inbox/status" method="post">
                          <input type="hidden" name="leadId" value={lead.id} />
                          <input type="hidden" name="status" value={status} />
                          <input type="hidden" name="returnTo" value={returnTo} />
                          <Button type="submit" size="sm" variant={lead.status === status ? 'secondary' : 'outline'}>
                            Mark {status}
                          </Button>
                        </form>
                      ))}
                    </div>

                    <form action="/api/lead-inbox/update" method="post" className="mt-4 grid grid-cols-1 md:grid-cols-[0.25fr_0.75fr_auto] gap-3 items-end">
                      <input type="hidden" name="leadId" value={lead.id} />
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <div>
                        <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/55">Owner</label>
                        <input
                          name="ownerName"
                          defaultValue={lead.owner_name || ''}
                          placeholder="e.g. Nathaniel"
                          className="h-10 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/55">Notes</label>
                        <textarea
                          name="notes"
                          defaultValue={lead.notes || ''}
                          rows={2}
                          placeholder="CRM notes, follow-up summary, next step"
                          className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 py-2 text-sm"
                        />
                      </div>
                      <Button type="submit" size="sm">
                        Save CRM
                      </Button>
                    </form>
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
