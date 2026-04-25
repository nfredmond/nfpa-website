#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_BASE_URL = 'https://www.natfordplanning.com'
const PRODUCT_ID = 'planner-ai-workflow-guide-v2'
const PRODUCT_NAME = 'AI-Assisted Planning Workflows'
const EXPECTED_TIERS = [
  {
    canonicalId: 'planner-ai-workflow-guide-starter',
    legacyAlias: 'vibe-coding-planners-starter',
    envKey: 'STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_29',
    legacyEnvKey: 'STRIPE_LINK_VIBE_CODING_PLANNERS_29',
  },
  {
    canonicalId: 'planner-ai-workflow-guide-practitioner',
    legacyAlias: 'vibe-coding-planners-practitioner',
    envKey: 'STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_39',
    legacyEnvKey: 'STRIPE_LINK_VIBE_CODING_PLANNERS_39',
  },
  {
    canonicalId: 'planner-ai-workflow-guide-team',
    legacyAlias: 'vibe-coding-planners-team',
    envKey: 'STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_49',
    legacyEnvKey: 'STRIPE_LINK_VIBE_CODING_PLANNERS_49',
  },
]
const STRIPE_ALLOWED_HOSTS = new Set(['buy.stripe.com', 'checkout.stripe.com', 'pay.stripe.com'])
const REDIRECT_STATUSES = new Set([302, 307, 308])

function usage() {
  console.log(`Usage: node scripts/ai-planning-workflows-launch-dry-run.mjs [options]

No-secret production dry-run for AI-Assisted Planning Workflows launch readiness.
It reads public website endpoints, does not follow Stripe redirects, and does not
create purchases or write customer records.

Options:
  --base-url <url>       Website origin to test. Default: ${DEFAULT_BASE_URL}
  --canonical-only       Check only canonical tier routes, not legacy aliases.
  --proof-file <path>    Write a no-secret Markdown proof artifact.
  --json                Print JSON instead of human-readable output.
  --help                Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    baseUrl: process.env.LAUNCH_SMOKE_BASE_URL || DEFAULT_BASE_URL,
    includeLegacyAliases: true,
    proofFile: null,
    json: false,
  }

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--base-url') {
      options.baseUrl = argv[index + 1]
      index += 1
      continue
    }

    if (arg.startsWith('--base-url=')) {
      options.baseUrl = arg.slice('--base-url='.length)
      continue
    }

    if (arg === '--canonical-only') {
      options.includeLegacyAliases = false
      continue
    }

    if (arg === '--proof-file') {
      options.proofFile = argv[index + 1]
      index += 1
      continue
    }

    if (arg.startsWith('--proof-file=')) {
      options.proofFile = arg.slice('--proof-file='.length)
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  if (!options.baseUrl) {
    throw new Error('Missing --base-url value')
  }

  return options
}

function makeUrl(baseUrl, pathname) {
  return new URL(pathname, baseUrl)
}

function normalizeOrigin(baseUrl) {
  const parsed = new URL(baseUrl)
  return parsed.origin
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })
  const text = await response.text()

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}: ${text.slice(0, 200)}`)
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    throw new Error(`${url} did not return JSON: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function fetchCheckoutRedirect(baseUrl, routeTierId) {
  const checkoutUrl = makeUrl(baseUrl, '/api/commerce/checkout')
  checkoutUrl.searchParams.set('tier', routeTierId)

  const response = await fetch(checkoutUrl, {
    redirect: 'manual',
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })

  return {
    requestUrl: checkoutUrl.toString(),
    status: response.status,
    location: response.headers.get('location'),
  }
}

function validateReadiness(readiness) {
  const failures = []
  const warnings = []
  const liveTiers = Array.isArray(readiness?.tiers) ? readiness.tiers : []
  const tierResults = EXPECTED_TIERS.map((expected) => {
    const tier = liveTiers.find((candidate) => candidate?.tierId === expected.canonicalId)
    const configuredEnvKey = tier?.configuredEnvKey ?? null
    const configuredByAcceptedKey =
      configuredEnvKey === expected.envKey || configuredEnvKey === expected.legacyEnvKey

    if (!tier) {
      failures.push(`Readiness endpoint is missing ${expected.canonicalId}`)
    } else {
      if (tier.productId !== PRODUCT_ID) {
        failures.push(`${expected.canonicalId} productId is ${tier.productId || 'missing'}, expected ${PRODUCT_ID}`)
      }
      if (tier.productName !== PRODUCT_NAME) {
        failures.push(`${expected.canonicalId} productName is ${tier.productName || 'missing'}, expected ${PRODUCT_NAME}`)
      }
      if (tier.envKey !== expected.envKey) {
        failures.push(`${expected.canonicalId} envKey is ${tier.envKey || 'missing'}, expected ${expected.envKey}`)
      }
      if (!tier.configured) {
        failures.push(`${expected.canonicalId} is not configured in readiness endpoint`)
      }
      if (!configuredByAcceptedKey) {
        failures.push(
          `${expected.canonicalId} configuredEnvKey is ${configuredEnvKey || 'missing'}, expected ${expected.envKey} or ${expected.legacyEnvKey}`
        )
      }
      if (configuredEnvKey === expected.legacyEnvKey) {
        warnings.push(`${expected.canonicalId} is configured through legacy fallback ${expected.legacyEnvKey}`)
      }
    }

    return {
      tierId: expected.canonicalId,
      configured: Boolean(tier?.configured),
      readinessEnvKey: tier?.envKey ?? null,
      configuredEnvKey,
    }
  })

  return {
    ok: failures.length === 0,
    failures,
    warnings,
    summary: readiness?.summary ?? null,
    tiers: tierResults,
  }
}

function routeIdsForTier(expected, includeLegacyAliases) {
  const routeIds = [{ routeTierId: expected.canonicalId, canonicalTierId: expected.canonicalId, routeType: 'canonical' }]
  if (includeLegacyAliases) {
    routeIds.push({ routeTierId: expected.legacyAlias, canonicalTierId: expected.canonicalId, routeType: 'legacy-alias' })
  }
  return routeIds
}

function validateCheckoutRedirect(probe, route) {
  const failures = []
  let stripeHost = null
  let clientReferenceId = null
  let utmCampaign = null

  if (!REDIRECT_STATUSES.has(probe.status)) {
    failures.push(`${route.routeTierId} returned ${probe.status}, expected 302/307/308`)
  }

  if (!probe.location) {
    failures.push(`${route.routeTierId} did not return a Location header`)
  } else {
    try {
      const location = new URL(probe.location)
      stripeHost = location.hostname
      clientReferenceId = location.searchParams.get('client_reference_id')
      utmCampaign = location.searchParams.get('utm_campaign')

      if (!STRIPE_ALLOWED_HOSTS.has(stripeHost)) {
        failures.push(`${route.routeTierId} redirected to ${stripeHost}, expected an allowed Stripe host`)
      }

      const expectedClientReferenceId = `${PRODUCT_ID}:${route.canonicalTierId}`
      if (clientReferenceId !== expectedClientReferenceId) {
        failures.push(
          `${route.routeTierId} client_reference_id is ${clientReferenceId || 'missing'}, expected ${expectedClientReferenceId}`
        )
      }

      if (utmCampaign !== `checkout-${PRODUCT_ID}`) {
        failures.push(`${route.routeTierId} utm_campaign is ${utmCampaign || 'missing'}, expected checkout-${PRODUCT_ID}`)
      }
    } catch (error) {
      failures.push(`${route.routeTierId} returned an invalid Location header: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return {
    ok: failures.length === 0,
    failures,
    routeTierId: route.routeTierId,
    canonicalTierId: route.canonicalTierId,
    routeType: route.routeType,
    status: probe.status,
    stripeHost,
    clientReferenceId,
    utmCampaign,
  }
}

function buildProofMarkdown(result) {
  const lines = [
    '# AI-Assisted Planning Workflows Launch Dry-Run Proof',
    '',
    `Generated: ${result.generatedAt}`,
    `Base URL: ${result.baseUrl}`,
    '',
    'This proof is no-secret and no-purchase: it reads public website endpoints, does not follow Stripe redirects, and does not write customer records.',
    '',
    '## Readiness',
    '',
    `- Result: ${result.readiness.ok ? 'PASS' : 'FAIL'}`,
    `- Configured AI tiers: ${result.readiness.tiers.filter((tier) => tier.configured).length}/${EXPECTED_TIERS.length}`,
    `- Global configured tiers: ${result.readiness.summary?.configuredTiers ?? 'unknown'}/${result.readiness.summary?.totalTiers ?? 'unknown'}`,
  ]

  for (const warning of result.readiness.warnings) {
    lines.push(`- Note: ${warning}`)
  }

  lines.push(
    '',
    '| Tier ID | Readiness Env Key | Configured Env Key |',
    '|---|---|---|'
  )

  for (const tier of result.readiness.tiers) {
    lines.push(`| \`${tier.tierId}\` | \`${tier.readinessEnvKey ?? 'missing'}\` | \`${tier.configuredEnvKey ?? 'missing'}\` |`)
  }

  lines.push(
    '',
    '## Checkout Handoff',
    '',
    '| Route Tier | Canonical Tier | Status | Stripe Host | Client Reference | Result |',
    '|---|---|---:|---|---|---|'
  )

  for (const checkout of result.checkout) {
    lines.push(
      `| \`${checkout.routeTierId}\` | \`${checkout.canonicalTierId}\` | ${checkout.status} | \`${checkout.stripeHost ?? 'missing'}\` | \`${checkout.clientReferenceId ?? 'missing'}\` | ${checkout.ok ? 'PASS' : 'FAIL'} |`
    )
  }

  lines.push(
    '',
    '## Fulfillment Handoff Contract',
    '',
    'For a real `checkout.session.completed`, `/api/commerce/webhook` must write these access rows after Stripe signs and delivers the event:',
    '',
    '| Product ID | Tier ID | Status | Source |',
    '|---|---|---|---|'
  )

  for (const tier of EXPECTED_TIERS) {
    lines.push(`| \`${PRODUCT_ID}\` | \`${tier.canonicalId}\` | \`active\` | \`stripe_webhook\` |`)
  }

  lines.push(
    '',
    '## Result',
    '',
    result.ok ? 'PASS' : 'FAIL'
  )

  if (result.failures.length > 0) {
    lines.push('', 'Failures:')
    for (const failure of result.failures) {
      lines.push(`- ${failure}`)
    }
  }

  return `${lines.join('\n')}\n`
}

function printHuman(result) {
  console.log('AI-Assisted Planning Workflows launch dry-run smoke')
  console.log(`Base URL: ${result.baseUrl}`)
  console.log(`Generated: ${result.generatedAt}`)
  console.log('Mode: no purchase, no Stripe redirect follow, no customer writes')
  console.log('')

  console.log(`Readiness: ${result.readiness.ok ? 'PASS' : 'FAIL'}`)
  console.log(`Configured AI tiers: ${result.readiness.tiers.filter((tier) => tier.configured).length}/${EXPECTED_TIERS.length}`)
  console.log(`Global configured tiers: ${result.readiness.summary?.configuredTiers ?? 'unknown'}/${result.readiness.summary?.totalTiers ?? 'unknown'}`)
  for (const warning of result.readiness.warnings) {
    console.log(`NOTE ${warning}`)
  }
  console.log('')

  for (const checkout of result.checkout) {
    const status = checkout.ok ? 'PASS' : 'FAIL'
    console.log(
      `${status} ${checkout.routeTierId} -> status=${checkout.status} host=${checkout.stripeHost ?? 'missing'} client_reference_id=${checkout.clientReferenceId ?? 'missing'}`
    )
  }

  console.log('')
  console.log('Fulfillment handoff contract:')
  for (const tier of EXPECTED_TIERS) {
    console.log(`- ${PRODUCT_ID} / ${tier.canonicalId} -> active via stripe_webhook`)
  }

  if (result.proofFile) {
    console.log('')
    console.log(`Proof file: ${result.proofFile}`)
  }

  if (result.failures.length > 0) {
    console.log('')
    console.log('Failures:')
    for (const failure of result.failures) {
      console.log(`- ${failure}`)
    }
  }

  console.log('')
  console.log(`Result: ${result.ok ? 'PASS' : 'FAIL'}`)
}

async function main() {
  const options = parseArgs(process.argv)
  const baseUrl = normalizeOrigin(options.baseUrl)
  const readinessUrl = makeUrl(baseUrl, '/api/commerce/readiness')
  const readiness = await fetchJson(readinessUrl)
  const readinessResult = validateReadiness(readiness)
  const checkoutResults = []

  for (const expected of EXPECTED_TIERS) {
    for (const route of routeIdsForTier(expected, options.includeLegacyAliases)) {
      const probe = await fetchCheckoutRedirect(baseUrl, route.routeTierId)
      checkoutResults.push(validateCheckoutRedirect(probe, route))
    }
  }

  const failures = [
    ...readinessResult.failures,
    ...checkoutResults.flatMap((checkout) => checkout.failures),
  ]

  const result = {
    ok: failures.length === 0,
    generatedAt: new Date().toISOString(),
    baseUrl,
    readiness: readinessResult,
    checkout: checkoutResults,
    failures,
    proofFile: options.proofFile,
  }

  if (options.proofFile) {
    const proofPath = path.resolve(options.proofFile)
    await fs.mkdir(path.dirname(proofPath), { recursive: true })
    await fs.writeFile(proofPath, buildProofMarkdown({ ...result, proofFile: proofPath }), 'utf8')
    result.proofFile = proofPath
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    printHuman(result)
  }

  if (!result.ok) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(`ai-planning-workflows-launch-dry-run failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
