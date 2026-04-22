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

type LeadMeta = {
  topic?: string | null
  intent?: string | null
  product?: string | null
  tier?: string | null
  routing_hint?: string | null
  budget_range?: string | null
  project_geography?: string | null
  desired_start_date?: string | null
}

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
  last_contact_on: string | null
  next_step_on: string | null
  meta: LeadMeta | null
}

type SummaryLead = {
  status: LeadStatus
  inquiry_type: string
  next_step_on: string | null
  meta: LeadMeta | null
}

type FollowupState = 'none' | 'overdue' | 'today' | 'upcoming'

type SavedViewFilters = {
  status?: LeadStatus
  type?: (typeof INQUIRY_TYPE_OPTIONS)[number]
  lane?: (typeof ROUTING_OPTIONS)[number]['value']
}

type SavedViewDefinition = {
  key: string
  label: string
  description: string
  filters: SavedViewFilters
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

const ROUTING_OPTIONS = [
  { value: 'all', label: 'All lanes' },
  { value: 'openplan-pilot-updates', label: 'OpenPlan: Pilot updates' },
  { value: 'openplan-fit-conversation', label: 'OpenPlan: Fit conversation' },
  { value: 'openplan-general', label: 'OpenPlan: General' },
] as const

const OWNER_PRESETS = ['Nathaniel', 'Bartholomew', 'Elena'] as const

const SAVED_VIEWS: SavedViewDefinition[] = [
  {
    key: 'openplan-new-leads',
    label: 'OpenPlan new leads',
    description: 'Fresh OpenPlan submissions that still need first-pass triage.',
    filters: { type: 'OpenPlan product', status: 'new' },
  },
  {
    key: 'openplan-fit-review',
    label: 'Fit leads needing review',
    description: 'OpenPlan fit-conversation leads currently sitting in review.',
    filters: { lane: 'openplan-fit-conversation', status: 'reviewing' },
  },
  {
    key: 'openplan-pilot-uncontacted',
    label: 'Pilot-update leads not yet contacted',
    description: 'Pilot update signups still marked new and awaiting outreach.',
    filters: { lane: 'openplan-pilot-updates', status: 'new' },
  },
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

function formatDateOnly(input?: string | null) {
  if (!input) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeZone: 'America/Los_Angeles',
    }).format(new Date(`${input}T12:00:00Z`))
  } catch {
    return input
  }
}

function todayIsoInLosAngeles() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${lookup.year}-${lookup.month}-${lookup.day}`
}

function addDaysToIso(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function getFollowupState(nextStepOn: string | null, status: LeadStatus, todayIso: string): FollowupState {
  if (!nextStepOn || status === 'closed') return 'none'
  if (nextStepOn < todayIso) return 'overdue'
  if (nextStepOn === todayIso) return 'today'
  return 'upcoming'
}

function followupCardClass(state: FollowupState) {
  switch (state) {
    case 'overdue':
      return 'border-red-200 bg-[linear-gradient(135deg,rgba(255,244,244,0.96),rgba(255,255,255,1))] shadow-[0_14px_34px_rgba(185,28,28,0.08)]'
    case 'today':
      return 'border-amber-200 bg-[linear-gradient(135deg,rgba(255,250,237,0.98),rgba(255,255,255,1))] shadow-[0_14px_34px_rgba(217,119,6,0.08)]'
    default:
      return 'border-[color:var(--line)] bg-white'
  }
}

function followupBadgeClass(state: FollowupState) {
  switch (state) {
    case 'overdue':
      return 'border-red-200 bg-red-50 text-red-700'
    case 'today':
      return 'border-amber-200 bg-amber-50 text-amber-800'
    case 'upcoming':
      return 'border-blue-200 bg-blue-50 text-blue-700'
    default:
      return 'border-[color:var(--line)] bg-[color:var(--background)] text-[color:var(--foreground)]/70'
  }
}

function followupBadgeText(state: FollowupState, nextStepOn: string | null, status: LeadStatus) {
  if (status === 'closed') return 'Closed'
  if (!nextStepOn) return 'No next step'
  switch (state) {
    case 'overdue':
      return 'Overdue next step'
    case 'today':
      return 'Due today'
    case 'upcoming':
      return 'Upcoming next step'
    default:
      return 'No next step'
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
    case 'contact-ok':
      return { kind: 'ok' as const, text: 'First contact logged. Lead moved to reviewing.' }
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

function routingLabel(routingHint?: string | null) {
  switch (routingHint) {
    case 'openplan-pilot-updates':
      return 'OpenPlan · Pilot updates'
    case 'openplan-fit-conversation':
      return 'OpenPlan · Fit conversation'
    case 'openplan-general':
      return 'OpenPlan · General'
    default:
      return null
  }
}

function laneCardClass(routingHint: string) {
  switch (routingHint) {
    case 'openplan-pilot-updates':
      return 'border-blue-200 bg-[linear-gradient(135deg,rgba(236,246,255,0.96),rgba(255,255,255,1))]'
    case 'openplan-fit-conversation':
      return 'border-[color:var(--pine)]/18 bg-[linear-gradient(135deg,rgba(244,240,233,0.98),rgba(255,255,255,1))]'
    case 'openplan-general':
      return 'border-violet-200 bg-[linear-gradient(135deg,rgba(245,240,255,0.96),rgba(255,255,255,1))]'
    default:
      return 'border-[color:var(--line)] bg-[color:var(--background)]'
  }
}

function savedViewHref(filters: { status?: string; type?: string; lane?: string }) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.type) params.set('type', filters.type)
  if (filters.lane) params.set('lane', filters.lane)
  return `/lead-inbox?${params.toString()}`
}

function summaryLeadMatchesFilters(lead: SummaryLead, filters: SavedViewFilters) {
  if (filters.status && lead.status !== filters.status) return false
  if (filters.type && lead.inquiry_type !== filters.type) return false
  if (filters.lane && lead.meta?.routing_hint !== filters.lane) return false
  return true
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
  searchParams: Promise<{ error?: string; update?: string; q?: string; status?: string; type?: string; days?: string; lane?: string }>
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

  const laneFilter = ROUTING_OPTIONS.some((option) => option.value === (params.lane || 'all')) ? (params.lane || 'all') : 'all'

  const returnParams = new URLSearchParams()
  if (q) returnParams.set('q', q)
  if (statusFilter !== 'all') returnParams.set('status', statusFilter)
  if (typeFilter !== 'all') returnParams.set('type', typeFilter)
  if (daysFilter !== 'all') returnParams.set('days', daysFilter)
  if (laneFilter !== 'all') returnParams.set('lane', laneFilter)
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

  let summaryQuery = supabase.from('leads').select('status, inquiry_type, next_step_on, meta').order('created_at', { ascending: false }).limit(1000)

  let query = supabase
    .from('leads')
    .select(
      'id, first_name, last_name, email, organization, inquiry_type, timeline, description, status, owner_name, notes, source_path, created_at, last_contact_on, next_step_on, meta'
    )
    .order('created_at', { ascending: false })
    .limit(200)

  if (statusFilter !== 'all') query = query.eq('status', statusFilter)
  if (typeFilter !== 'all') {
    query = query.eq('inquiry_type', typeFilter)
    summaryQuery = summaryQuery.eq('inquiry_type', typeFilter)
  }
  if (laneFilter !== 'all') query = query.contains('meta', { routing_hint: laneFilter })

  if (daysFilter !== 'all') {
    const days = Number(daysFilter)
    if (Number.isFinite(days) && days > 0) {
      const cutoffDate = new Date()
      cutoffDate.setUTCDate(cutoffDate.getUTCDate() - days)
      const cutoffIso = cutoffDate.toISOString()
      query = query.gte('created_at', cutoffIso)
      summaryQuery = summaryQuery.gte('created_at', cutoffIso)
    }
  }

  if (q) {
    const cleaned = q.replace(/[%]/g, '').replace(/,/g, ' ').trim()
    if (cleaned) {
      const searchExpr = `first_name.ilike.%${cleaned}%,last_name.ilike.%${cleaned}%,email.ilike.%${cleaned}%,organization.ilike.%${cleaned}%,description.ilike.%${cleaned}%,notes.ilike.%${cleaned}%`
      query = query.or(searchExpr)
      summaryQuery = summaryQuery.or(searchExpr)
    }
  }

  const [{ data, error }, { data: summaryData, error: summaryError }] = await Promise.all([query, summaryQuery])

  const leads = (data || []) as Lead[]
  const summaryLeads = (summaryData || []) as SummaryLead[]
  const update = updateMessage(params.update)

  const laneSummaries = ROUTING_OPTIONS.filter((option) => option.value !== 'all').map((option) => {
    const matching = summaryLeads.filter((lead) => lead.meta?.routing_hint === option.value)
    const counts = {
      total: matching.length,
      new: matching.filter((lead) => lead.status === 'new').length,
      reviewing: matching.filter((lead) => lead.status === 'reviewing').length,
      qualified: matching.filter((lead) => lead.status === 'qualified').length,
      closed: matching.filter((lead) => lead.status === 'closed').length,
    }

    return {
      ...option,
      counts,
    }
  })

  const savedViews = SAVED_VIEWS.map((view) => {
    const count = summaryLeads.filter((lead) => summaryLeadMatchesFilters(lead, view.filters)).length
    const isActive =
      statusFilter === (view.filters.status || 'all') &&
      typeFilter === (view.filters.type || 'all') &&
      laneFilter === (view.filters.lane || 'all') &&
      daysFilter === 'all' &&
      !q

    return {
      ...view,
      href: savedViewHref(view.filters),
      count,
      isActive,
    }
  })

  const todayIso = todayIsoInLosAngeles()
  const nextWeekIso = addDaysToIso(todayIso, 7)

  const visibleSummaryLeads = summaryLeads.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false
    if (laneFilter !== 'all' && lead.meta?.routing_hint !== laneFilter) return false
    return true
  })

  const actionableSummaryLeads = visibleSummaryLeads.filter((lead) => lead.status !== 'closed')

  const followupSummary = {
    overdue: actionableSummaryLeads.filter((lead) => !!lead.next_step_on && lead.next_step_on < todayIso).length,
    dueToday: actionableSummaryLeads.filter((lead) => lead.next_step_on === todayIso).length,
    dueNext7: actionableSummaryLeads.filter(
      (lead) => !!lead.next_step_on && lead.next_step_on > todayIso && lead.next_step_on <= nextWeekIso
    ).length,
    missing: actionableSummaryLeads.filter((lead) => !lead.next_step_on).length,
  }

  return (
    <>
      <Section spacing="md" className="hero-mesh text-white">
        <Container>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="pill">Internal · OpenPlan Ops</span>
              <h1 className="section-title mt-4 text-4xl leading-[1] text-white md:text-5xl">Lead Inbox</h1>
              <p className="mt-3 text-sm text-white/78">
                {leads.length} matching submissions from natfordplanning.com · filtered to the current working slice.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                variant="outline"
                className="border-white/35 bg-white/10 text-white hover:border-white/60 hover:bg-white/18 hover:text-white"
              >
                <a href={`/api/lead-inbox/export${returnParams.toString() ? `?${returnParams.toString()}` : ''}`}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/35 bg-white/10 text-white hover:border-white/60 hover:bg-white/18 hover:text-white"
              >
                <Link href="/contact">Contact page</Link>
              </Button>
              <form action="/api/lead-inbox/auth" method="post">
                <input type="hidden" name="action" value="logout" />
                <Button
                  type="submit"
                  variant="outline"
                  className="border-white/35 bg-white/10 text-white hover:border-white/60 hover:bg-white/18 hover:text-white"
                >
                  Log out
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-b border-[color:var(--line)] bg-[color:var(--background)]/85">
        <Container>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/60">
                Routing lane
              </span>
              {ROUTING_OPTIONS.filter((option) => option.value !== 'all').map((option) => {
                const active = laneFilter === option.value
                const href = option.value === laneFilter ? '/lead-inbox' : `/lead-inbox?lane=${encodeURIComponent(option.value)}`
                return (
                  <Link
                    key={option.value}
                    href={href}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                      active
                        ? 'border-[color:var(--pine)] bg-[color:var(--sand)]/55 text-[color:var(--pine)]'
                        : 'border-[color:var(--line)] bg-[color:var(--background)] text-[color:var(--foreground)]/72 hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]'
                    }`}
                  >
                    {option.label}
                  </Link>
                )
              })}
            </div>

            <div className="rounded-2xl border border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(250,247,241,0.9),rgba(255,255,255,1))] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/58">Saved views</p>
                  <p className="mt-1 text-sm text-[color:var(--foreground)]/72">
                    One-click triage slices for the highest-value OpenPlan follow-up queues.
                  </p>
                </div>
                <Link href="/lead-inbox" className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--pine)] hover:opacity-80">
                  Clear to full inbox
                </Link>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {savedViews.map((view) => (
                  <Link
                    key={view.key}
                    href={view.href}
                    className={`group rounded-2xl border px-4 py-3 transition ${
                      view.isActive
                        ? 'border-[color:var(--pine)] bg-[color:var(--sand)]/65 shadow-[0_10px_30px_rgba(54,83,62,0.08)]'
                        : 'border-[color:var(--line)] bg-white/88 hover:border-[color:var(--pine)]/45 hover:shadow-[0_10px_30px_rgba(25,45,35,0.06)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--ink)]">{view.label}</p>
                        <p className="mt-1 text-sm text-[color:var(--foreground)]/70">{view.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                            view.isActive
                              ? 'bg-[color:var(--pine)] text-white'
                              : 'bg-[color:var(--foreground)]/8 text-[color:var(--foreground)]/64 group-hover:bg-[color:var(--pine)]/10 group-hover:text-[color:var(--pine)]'
                          }`}
                        >
                          {view.isActive ? 'Active' : 'Open'}
                        </span>
                        <div className="text-right">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]/52">Matches</p>
                          <p className="mt-0.5 text-2xl font-semibold text-[color:var(--ink)]">{view.count}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <form method="get" action="/lead-inbox" className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
              <select
                name="lane"
                defaultValue={laneFilter}
                className="h-10 rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
              >
                {ROUTING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    Lane: {option.label}
                  </option>
                ))}
              </select>
              <div className="md:col-span-5 flex flex-wrap gap-2">
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

          {(error || summaryError) && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Could not load lead data: {error?.message || summaryError?.message}
            </div>
          )}

          <div className="mb-5 grid gap-4 lg:grid-cols-3">
            {laneSummaries.map((lane) => (
              <Card key={lane.value} className={laneCardClass(lane.value)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/62">OpenPlan lane</p>
                      <h2 className="mt-2 text-xl font-semibold text-[color:var(--ink)]">{lane.label}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.72rem] uppercase tracking-[0.16em] text-[color:var(--foreground)]/56">Total</p>
                      <p className="mt-1 text-3xl font-semibold text-[color:var(--ink)]">{lane.counts.total}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-2 py-2 text-amber-800">
                      <p className="font-semibold">{lane.counts.new}</p>
                      <p className="mt-1 uppercase tracking-[0.08em]">New</p>
                    </div>
                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-2 py-2 text-blue-800">
                      <p className="font-semibold">{lane.counts.reviewing}</p>
                      <p className="mt-1 uppercase tracking-[0.08em]">Reviewing</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-2 text-emerald-800">
                      <p className="font-semibold">{lane.counts.qualified}</p>
                      <p className="mt-1 uppercase tracking-[0.08em]">Qualified</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-slate-700">
                      <p className="font-semibold">{lane.counts.closed}</p>
                      <p className="mt-1 uppercase tracking-[0.08em]">Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-5 rounded-[28px] border border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(255,252,247,0.96),rgba(255,255,255,1))] p-5 shadow-[0_16px_40px_rgba(24,33,25,0.04)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/58">Follow-up radar</p>
                <p className="mt-1 text-sm text-[color:var(--foreground)]/72">Current working slice, filtered to what you are looking at right now.</p>
              </div>
              <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/52">Today: {formatDateOnly(todayIso)}</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Card className="border-red-200 bg-[linear-gradient(135deg,rgba(255,244,244,0.96),rgba(255,255,255,1))]">
                <CardContent className="p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-red-700">Overdue</p>
                  <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{followupSummary.overdue}</p>
                  <p className="mt-1 text-sm text-[color:var(--foreground)]/68">Next steps already past due.</p>
                </CardContent>
              </Card>
              <Card className="border-amber-200 bg-[linear-gradient(135deg,rgba(255,249,236,0.98),rgba(255,255,255,1))]">
                <CardContent className="p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-amber-800">Due today</p>
                  <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{followupSummary.dueToday}</p>
                  <p className="mt-1 text-sm text-[color:var(--foreground)]/68">Touches that need attention before day-end.</p>
                </CardContent>
              </Card>
              <Card className="border-blue-200 bg-[linear-gradient(135deg,rgba(240,247,255,0.98),rgba(255,255,255,1))]">
                <CardContent className="p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-blue-700">Next 7 days</p>
                  <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{followupSummary.dueNext7}</p>
                  <p className="mt-1 text-sm text-[color:var(--foreground)]/68">Scheduled follow-ups coming up soon.</p>
                </CardContent>
              </Card>
              <Card className="border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(246,246,246,0.9),rgba(255,255,255,1))]">
                <CardContent className="p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/64">No next step</p>
                  <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{followupSummary.missing}</p>
                  <p className="mt-1 text-sm text-[color:var(--foreground)]/68">Actionable leads missing a dated next move.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {leads.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-sm text-[color:var(--foreground)]/75">No leads match the current filters.</CardContent>
              </Card>
            ) : (
              leads.map((lead) => {
                const followupState = getFollowupState(lead.next_step_on, lead.status, todayIso)

                return (
                  <Card key={lead.id} className={followupCardClass(followupState)}>
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
                          <div className="flex flex-wrap justify-end gap-2">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${statusClass(
                                lead.status
                              )}`}
                            >
                              {lead.status}
                            </span>
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${followupBadgeClass(
                                followupState
                              )}`}
                            >
                              {followupBadgeText(followupState, lead.next_step_on, lead.status)}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-[color:var(--foreground)]/68">{formatDate(lead.created_at)}</p>
                        </div>
                      </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-3 lg:grid-cols-6">
                      <div>
                        <p className="text-[color:var(--foreground)]/68 text-xs uppercase tracking-[0.12em]">Inquiry Type</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{lead.inquiry_type}</p>
                      </div>
                      <div>
                        <p className="text-[color:var(--foreground)]/68 text-xs uppercase tracking-[0.12em]">Timeline</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{lead.timeline}</p>
                      </div>
                      <div>
                        <p className="text-[color:var(--foreground)]/68 text-xs uppercase tracking-[0.12em]">Source</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{lead.source_path || '/contact'}</p>
                      </div>
                      <div>
                        <p className="text-[color:var(--foreground)]/68 text-xs uppercase tracking-[0.12em]">Lane</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{routingLabel(lead.meta?.routing_hint) || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[color:var(--foreground)]/68 text-xs uppercase tracking-[0.12em]">Last contact</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{formatDateOnly(lead.last_contact_on)}</p>
                      </div>
                      <div>
                        <p className="text-[color:var(--foreground)]/68 text-xs uppercase tracking-[0.12em]">Next step</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{formatDateOnly(lead.next_step_on)}</p>
                      </div>
                    </div>

                    {routingLabel(lead.meta?.routing_hint) ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full border border-[color:var(--pine)]/20 bg-[color:var(--sand)]/45 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--pine)]">
                          {routingLabel(lead.meta?.routing_hint)}
                        </span>
                        {lead.meta?.tier ? (
                          <span className="inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--background)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--foreground)]/72">
                            Tier: {lead.meta.tier}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    {lead.meta?.budget_range || lead.meta?.project_geography || lead.meta?.desired_start_date ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {lead.meta?.budget_range ? (
                          <span className="inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--background)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--foreground)]/72">
                            Budget: {lead.meta.budget_range}
                          </span>
                        ) : null}
                        {lead.meta?.project_geography ? (
                          <span className="inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--background)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--foreground)]/72">
                            Geo: {lead.meta.project_geography}
                          </span>
                        ) : null}
                        {lead.meta?.desired_start_date ? (
                          <span className="inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--background)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--foreground)]/72">
                            Start: {lead.meta.desired_start_date}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

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

                      {lead.status === 'new' ? (
                        <form action="/api/lead-inbox/status" method="post">
                          <input type="hidden" name="leadId" value={lead.id} />
                          <input type="hidden" name="status" value="reviewing" />
                          <input type="hidden" name="actionType" value="first-contact" />
                          <input type="hidden" name="returnTo" value={returnTo} />
                          <Button type="submit" size="sm">
                            First contact sent
                          </Button>
                        </form>
                      ) : null}

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

                    <div className="mt-4 rounded-2xl border border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(248,246,242,0.92),rgba(255,255,255,1))] p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/58">Assignment rail</p>
                          <p className="mt-1 text-sm text-[color:var(--foreground)]/72">Quick-assign an owner or edit the full CRM record below.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {OWNER_PRESETS.map((owner) => (
                            <form key={owner} action="/api/lead-inbox/update" method="post">
                              <input type="hidden" name="leadId" value={lead.id} />
                              <input type="hidden" name="returnTo" value={returnTo} />
                              <input type="hidden" name="ownerName" value={owner} />
                              <input type="hidden" name="notes" value={lead.notes || ''} />
                              <input type="hidden" name="lastContactOn" value={lead.last_contact_on || ''} />
                              <input type="hidden" name="nextStepOn" value={lead.next_step_on || ''} />
                              <Button type="submit" size="sm" variant={lead.owner_name === owner ? 'secondary' : 'outline'}>
                                Assign {owner}
                              </Button>
                            </form>
                          ))}
                        </div>
                      </div>

                      <form action="/api/lead-inbox/update" method="post" className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[0.22fr_0.18fr_0.18fr_0.42fr_auto] xl:items-end">
                        <input type="hidden" name="leadId" value={lead.id} />
                        <input type="hidden" name="returnTo" value={returnTo} />
                        <div>
                          <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/68">Owner</label>
                          <input
                            name="ownerName"
                            defaultValue={lead.owner_name || ''}
                            placeholder="e.g. Nathaniel"
                            className="h-10 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/68">Last contact</label>
                          <input
                            type="date"
                            name="lastContactOn"
                            defaultValue={lead.last_contact_on || ''}
                            className="h-10 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/68">Next step</label>
                          <input
                            type="date"
                            name="nextStepOn"
                            defaultValue={lead.next_step_on || ''}
                            className="h-10 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/68">Notes</label>
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
                    </div>
                  </CardContent>
                </Card>
                )
              })
            )}
          </div>
        </Container>
      </Section>
    </>
  )
}
