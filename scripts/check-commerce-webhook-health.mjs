#!/usr/bin/env node

import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const SUCCESS_STATUSES = ['checkout_completed', 'invoice_paid']

function loadDotenv(path) {
  if (!fs.existsSync(path)) return
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue
    const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/)
    if (!match) continue
    const key = match[1]
    if (process.env[key]) continue
    let value = match[2]
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

function getArg(name, fallback) {
  const prefix = `--${name}=`
  const found = process.argv.find((arg) => arg.startsWith(prefix))
  if (!found) return fallback
  return found.slice(prefix.length)
}

async function main() {
  loadDotenv('.env.local')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  const windowMinutes = Number(getArg('windowMinutes', process.env.WEBHOOK_HEALTH_WINDOW_MINUTES ?? '120'))

  if (!supabaseUrl || !serviceRole) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  const minutes = Number.isFinite(windowMinutes) && windowMinutes > 0 ? Math.min(windowMinutes, 1440) : 120
  const cutoff = new Date(Date.now() - minutes * 60_000).toISOString()

  const supabase = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false },
  })

  const { data, error } = await supabase
    .from('commerce_fulfillment_ledger')
    .select('stripe_event_id, stripe_event_type, status, created_at')
    .in('status', SUCCESS_STATUSES)
    .gte('created_at', cutoff)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    throw new Error(error.message)
  }

  const latest = data?.[0]
  if (!latest) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          alert: `No successful webhook deliveries in last ${minutes} minutes`,
          cutoff,
        },
        null,
        2
      )
    )
    process.exit(2)
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        windowMinutes: minutes,
        cutoff,
        latest,
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error('check-commerce-webhook-health failed')
  console.error(error?.message ?? String(error))
  process.exit(1)
})
