import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { LEAD_INBOX_COOKIE, isLeadInboxAuthorized } from '@/lib/security/lead-inbox-auth'

export const runtime = 'nodejs'

type LeadRow = {
  created_at: string
  first_name: string
  last_name: string
  email: string
  organization: string
  inquiry_type: string
  timeline: string
  status: string
  owner_name: string | null
  last_contact_on: string | null
  next_step_on: string | null
  source_path: string | null
  ip_address: string | null
  notes: string | null
  description: string
  meta: {
    routing_hint?: string | null
    topic?: string | null
    intent?: string | null
    product?: string | null
    tier?: string | null
  } | null
}

function csvCell(input: unknown) {
  const value = String(input ?? '')
  const escaped = value.replace(/"/g, '""')
  return `"${escaped}"`
}

const VALID_STATUS = new Set(['all', 'new', 'reviewing', 'qualified', 'closed'])
const VALID_TYPES = new Set([
  'all',
  'Planning support',
  'GIS / mapping',
  'Grant strategy',
  'OpenPlan product',
  'Ads automation product',
  'General inquiry',
])
const VALID_DAYS = new Set(['all', '7', '30', '90'])
const VALID_LANES = new Set(['all', 'openplan-pilot-updates', 'openplan-fit-conversation', 'openplan-general'])

export async function GET(req: NextRequest) {
  const secret = process.env.LEAD_INBOX_PASSWORD || ''
  const authCookie = req.cookies.get(LEAD_INBOX_COOKIE)?.value

  if (!secret || !isLeadInboxAuthorized(authCookie, secret)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return new NextResponse('Supabase env vars missing', { status: 503 })
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const searchParams = req.nextUrl.searchParams
  const q = (searchParams.get('q') || '').trim()
  const statusFilter = VALID_STATUS.has(searchParams.get('status') || 'all') ? searchParams.get('status') || 'all' : 'all'
  const typeFilter = VALID_TYPES.has(searchParams.get('type') || 'all') ? searchParams.get('type') || 'all' : 'all'
  const daysFilter = VALID_DAYS.has(searchParams.get('days') || 'all') ? searchParams.get('days') || 'all' : 'all'
  const laneFilter = VALID_LANES.has(searchParams.get('lane') || 'all') ? searchParams.get('lane') || 'all' : 'all'

  let query = supabase
    .from('leads')
    .select('created_at, first_name, last_name, email, organization, inquiry_type, timeline, status, owner_name, last_contact_on, next_step_on, source_path, ip_address, notes, description, meta')
    .order('created_at', { ascending: false })
    .limit(5000)

  if (statusFilter !== 'all') query = query.eq('status', statusFilter)
  if (typeFilter !== 'all') query = query.eq('inquiry_type', typeFilter)
  if (laneFilter !== 'all') query = query.contains('meta', { routing_hint: laneFilter })

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

  if (error) {
    return new NextResponse(`Export failed: ${error.message}`, { status: 500 })
  }

  const rows = (data || []) as LeadRow[]

  const header = [
    'created_at',
    'first_name',
    'last_name',
    'email',
    'organization',
    'inquiry_type',
    'timeline',
    'status',
    'owner_name',
    'last_contact_on',
    'next_step_on',
    'source_path',
    'routing_hint',
    'topic',
    'intent',
    'product',
    'tier',
    'ip_address',
    'notes',
    'description',
  ]

  const lines = [
    header.map(csvCell).join(','),
    ...rows.map((row) =>
      [
        row.created_at,
        row.first_name,
        row.last_name,
        row.email,
        row.organization,
        row.inquiry_type,
        row.timeline,
        row.status,
        row.owner_name || '',
        row.last_contact_on || '',
        row.next_step_on || '',
        row.source_path || '',
        row.meta?.routing_hint || '',
        row.meta?.topic || '',
        row.meta?.intent || '',
        row.meta?.product || '',
        row.meta?.tier || '',
        row.ip_address || '',
        row.notes || '',
        row.description,
      ]
        .map(csvCell)
        .join(',')
    ),
  ]

  const csv = lines.join('\n')
  const filename = `natford-leads-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
