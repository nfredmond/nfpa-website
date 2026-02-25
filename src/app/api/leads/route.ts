import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type LeadPayload = {
  firstName: string
  lastName: string
  email: string
  organization: string
  inquiryType: string
  timeline: string
  description: string
  website?: string // honeypot
  sourcePath?: string
}

function badRequest(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status })
}

function normalize(input: unknown): string {
  return String(input ?? '').trim()
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as Partial<LeadPayload>

    // Honeypot anti-spam field (must stay empty)
    if (normalize(payload.website)) {
      return NextResponse.json({ ok: true })
    }

    const firstName = normalize(payload.firstName)
    const lastName = normalize(payload.lastName)
    const email = normalize(payload.email).toLowerCase()
    const organization = normalize(payload.organization)
    const inquiryType = normalize(payload.inquiryType)
    const timeline = normalize(payload.timeline)
    const description = normalize(payload.description)
    const sourcePath = normalize(payload.sourcePath) || '/contact'

    if (!firstName || !lastName || !email || !organization || !inquiryType || !timeline || !description) {
      return badRequest('Please complete all required fields.')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest('Please enter a valid email address.')
    }

    if (description.length < 20) {
      return badRequest('Please add more detail so we can route your request correctly.')
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return badRequest('Lead capture is not configured yet. Please email nathaniel@natfordplanning.com.', 503)
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
    const userAgent = req.headers.get('user-agent') || null

    const { error } = await supabase.from('leads').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      organization,
      inquiry_type: inquiryType,
      timeline,
      description,
      source_path: sourcePath,
      meta: {
        ip: forwardedFor,
        user_agent: userAgent,
      },
    })

    if (error) {
      console.error('Lead insert error', error)
      return badRequest('Could not submit your request right now. Please try again or email us directly.', 500)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Lead API error', error)
    return badRequest('Invalid request payload.', 400)
  }
}
