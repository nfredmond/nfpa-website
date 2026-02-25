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
  source_path: string | null
  ip_address: string | null
  notes: string | null
  description: string
}

function csvCell(input: unknown) {
  const value = String(input ?? '')
  const escaped = value.replace(/"/g, '""')
  return `"${escaped}"`
}

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

  const { data, error } = await supabase
    .from('leads')
    .select('created_at, first_name, last_name, email, organization, inquiry_type, timeline, status, owner_name, source_path, ip_address, notes, description')
    .order('created_at', { ascending: false })
    .limit(5000)

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
    'source_path',
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
        row.source_path || '',
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
