#!/usr/bin/env node

import fs from 'fs'
import process from 'process'
import { createClient } from '@supabase/supabase-js'

function usage() {
  console.log(`Usage:
  node scripts/provision-product-access.mjs --email <email> --product <product-id> --tier <tier-id> [--role customer|planner|admin] [--status active]

Example:
  node scripts/provision-product-access.mjs \
    --email buyer@example.com \
    --product drone-ops \
    --tier drone-professional \
    --role customer \
    --status active
`)
}

function parseArgs(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i]
    if (!current.startsWith('--')) continue
    const key = current.slice(2)
    const value = argv[i + 1]
    if (!value || value.startsWith('--')) {
      args[key] = 'true'
      continue
    }
    args[key] = value
    i += 1
  }
  return args
}

function loadDotenv(path) {
  if (!fs.existsSync(path)) return
  const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/)
  for (const line of lines) {
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

async function main() {
  loadDotenv('.env.local')

  const args = parseArgs(process.argv)
  const email = (args.email || '').trim().toLowerCase()
  const productId = (args.product || '').trim()
  const tierId = (args.tier || '').trim()
  const role = (args.role || 'customer').trim().toLowerCase()
  const status = (args.status || 'active').trim().toLowerCase()

  if (!email || !productId || !tierId) {
    usage()
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

  const usersPage = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (usersPage.error) throw usersPage.error

  let user = usersPage.data.users.find((candidate) => candidate.email?.toLowerCase() === email)
  if (!user) {
    const generatedPassword = `NF_${productId.replace(/[^a-z0-9]/gi, '_')}_Temp_2026!`
    const created = await admin.auth.admin.createUser({
      email,
      password: generatedPassword,
      email_confirm: true,
      user_metadata: { role, test_user: false },
      app_metadata: { role },
    })

    if (created.error) throw created.error
    user = created.data.user
  }

  const existingAccess =
    user?.app_metadata && typeof user.app_metadata.product_access === 'object'
      ? user.app_metadata.product_access
      : {}

  const productAccess = {
    ...existingAccess,
    [productId]: {
      tierId,
      status,
      updatedAt: new Date().toISOString(),
      source: 'manual_provision_script',
    },
  }

  const updatedUser = await admin.auth.admin.updateUserById(user.id, {
    app_metadata: {
      ...(user.app_metadata || {}),
      role,
      product_access: productAccess,
    },
    user_metadata: {
      ...(user.user_metadata || {}),
      role,
    },
  })

  if (updatedUser.error) throw updatedUser.error

  const accessUpsert = await admin
    .from('customer_product_access')
    .upsert(
      {
        email,
        product_id: productId,
        tier_id: tierId,
        status,
        source: 'manual_provision',
        metadata: {
          role,
          syncedBy: 'scripts/provision-product-access.mjs',
        },
      },
      { onConflict: 'email,product_id' }
    )

  if (accessUpsert.error) throw accessUpsert.error

  console.log(
    JSON.stringify(
      {
        ok: true,
        email,
        productId,
        tierId,
        role,
        status,
        userId: user.id,
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error('provision-product-access failed', error)
  process.exit(1)
})
