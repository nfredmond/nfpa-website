#!/usr/bin/env node
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'

const PRODUCT_ID = 'planner-ai-workflow-guide-v2'
const TIERS = [
  'planner-ai-workflow-guide-starter',
  'planner-ai-workflow-guide-practitioner',
  'planner-ai-workflow-guide-team',
]
const ROUTE_TIERS = [
  ...TIERS,
  'vibe-coding-planners-starter',
  'vibe-coding-planners-practitioner',
  'vibe-coding-planners-team',
]
const isTbd = (value) => value === '' || value.toUpperCase() === 'TBD'
const oneOf = (values) => (value) => isTbd(value) || values.includes(value)
const suffixOnly = (value) => isTbd(value) || /^[A-Za-z0-9]{4,12}$/.test(value)

const FIELDS = [
  ['Smoke completed at UTC', 'ISO UTC timestamp, e.g. 2026-04-25T18:30:00Z', (value) => isTbd(value) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)],
  ['Target mode', 'test or live', oneOf(['test', 'live'])],
  ['Tier ID', TIERS.join(', '), oneOf(TIERS)],
  ['Checkout route tier used', 'canonical tier ID or accepted legacy route alias', oneOf(ROUTE_TIERS)],
  ['Stripe event ID suffix only', 'last 4-12 alphanumeric chars only; no evt_ prefix', suffixOnly],
  ['Stripe session ID suffix only', 'last 4-12 alphanumeric chars only; no cs_ prefix', suffixOnly],
  ['Webhook delivery status', 'succeeded, delivered, failed, not-found, or not-tested', oneOf(['succeeded', 'delivered', 'failed', 'not-found', 'not-tested'])],
  ['Ledger row present', 'yes or no', oneOf(['yes', 'no'])],
  ['Access row active', 'yes or no', oneOf(['yes', 'no'])],
  ['Portal access visible', 'yes or no', oneOf(['yes', 'no'])],
  ['Onboarding/email state', 'sent, pending_email_config, email_failed, manual-delivery-ready, or not-tested', oneOf(['sent', 'pending_email_config', 'email_failed', 'manual-delivery-ready', 'not-tested'])],
  ['Operator', 'role/name initials only; no email or buyer identity', (value) => isTbd(value) || /^[A-Za-z0-9 ._-]{2,40}$/.test(value)],
  ['External evidence reference', 'approved evidence vault/ticket reference only; no URL or raw ID', (value) => isTbd(value) || /^[A-Za-z0-9 ._:/#-]{2,96}$/.test(value)],
]

const BLOCKLIST = [
  ['email address', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu],
  ['Stripe key or webhook signing secret', /\b(?:sk|rk|pk|whsec)_(?:live|test)?_?[A-Za-z0-9]{8,}\b/giu],
  ['full Stripe object ID', /\b(?:acct|ch|cs|cus|evt|in|li|link|pi|pm|price|prod|py|seti|sub)_(?:live|test)?_?[A-Za-z0-9]{8,}\b/giu],
  ['URL', /https?:\/\/\S+/giu],
  ['card-like number', /\b(?:\d[ -]*?){13,19}\b/gu],
  ['JWT-like token', /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/gu],
  ['private key block', /-----BEGIN [A-Z ]*PRIVATE KEY-----/gu],
]

function usage() {
  console.log(`Usage: node scripts/ai-planning-workflows-fulfillment-proof.mjs [options]

Generate or validate a no-secret, sanitized proof template for the human-only
AI-Assisted Planning Workflows fulfillment smoke.

Options:
  --proof-file <path>  Write a blank sanitized Markdown proof template.
  --validate <path>    Validate an edited proof Markdown for obvious unsafe data.
  --require-complete   Fail validation when sanitized proof fields still say TBD.
  --self-test          Run local sanitizer checks.
  --help               Show this help.
`)
}

function parseArgs(argv) {
  const options = { proofFile: null, validateFile: null, requireComplete: false, selfTest: false }

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    } else if (arg === '--proof-file') {
      options.proofFile = requiredValue(argv, ++index, arg)
    } else if (arg.startsWith('--proof-file=')) {
      options.proofFile = arg.slice('--proof-file='.length)
    } else if (arg === '--validate') {
      options.validateFile = requiredValue(argv, ++index, arg)
    } else if (arg.startsWith('--validate=')) {
      options.validateFile = arg.slice('--validate='.length)
    } else if (arg === '--require-complete') {
      options.requireComplete = true
    } else if (arg === '--self-test') {
      options.selfTest = true
    } else {
      throw new Error(`Unknown option: ${arg}`)
    }
  }

  if (options.proofFile && options.validateFile) {
    throw new Error('Use --proof-file or --validate, not both')
  }
  if (options.requireComplete && !options.validateFile) {
    throw new Error('Use --require-complete with --validate')
  }
  return options
}

function requiredValue(argv, index, arg) {
  const value = argv[index]
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${arg}`)
  }
  return value
}

function stripCode(value) {
  const trimmed = value.trim()
  return trimmed.startsWith('`') && trimmed.endsWith('`') ? trimmed.slice(1, -1).trim() : trimmed
}

function renderTemplate(generatedAt = new Date().toISOString()) {
  const lines = [
    '# AI-Assisted Planning Workflows Fulfillment Smoke Proof',
    '',
    `Generated: ${generatedAt}`,
    `Product ID: \`${PRODUCT_ID}\``,
    '',
    'This artifact is for sanitized operator proof only. Do not paste buyer PII, card details, Stripe links, secret keys, full Stripe object IDs, Supabase exports, raw emails, or dashboard screenshots.',
    '',
    '## Human Confirmation',
    '',
    '- [ ] Human operator completed the authorized checkout; no agent drove Stripe checkout.',
    '- [ ] Stripe webhook delivery, fulfillment ledger, active access, onboarding state, and portal visibility were checked by an authorized human.',
    '- [ ] Sensitive proof is stored only in the approved external evidence location.',
    '- [ ] This file contains suffixes/references only, not raw customer or payment evidence.',
    '',
    '## Sanitized Proof',
    '',
    '| Field | Sanitized value | Required safe format |',
    '|---|---|---|',
    ...FIELDS.map(([label, safeFormat]) => `| ${label} | \`TBD\` | ${safeFormat} |`),
    '',
    '## Fulfillment Contract Checked',
    '',
    '| Product ID | Tier ID | Expected access status | Expected source |',
    '|---|---|---|---|',
    ...TIERS.map((tierId) => `| \`${PRODUCT_ID}\` | \`${tierId}\` | \`active\` | \`stripe_webhook\` |`),
    '',
    '## Validator',
    '',
    'Before sharing or committing a sanitized proof, run:',
    '',
    '```bash',
    'npm run proof:ai-planning-workflows-fulfillment -- --validate /path/to/proof.md --require-complete',
    '```',
  ]

  return `${lines.join('\n')}\n`
}

function validateMarkdown(markdown, { requireComplete = false } = {}) {
  const errors = []

  for (const [type, regex] of BLOCKLIST) {
    regex.lastIndex = 0
    let match
    while ((match = regex.exec(markdown)) !== null) {
      errors.push({ type, line: lineNumberForIndex(markdown, match.index) })
    }
  }

  const { values, lineNumbers } = extractProofValues(markdown)
  for (const [label, , validate] of FIELDS) {
    if (!values.has(label)) {
      errors.push({ type: `missing proof field: ${label}`, line: null })
      continue
    }

    const value = stripCode(values.get(label))
    if (requireComplete && isTbd(value)) {
      errors.push({ type: `missing sanitized value for ${label}`, line: lineNumbers.get(label) })
    } else if (!validate(value)) {
      errors.push({ type: `unsafe value format for ${label}`, line: lineNumbers.get(label) })
    }
  }

  return errors
}

function lineNumberForIndex(text, targetIndex) {
  return text.slice(0, targetIndex).split(/\r?\n/).length
}

function extractProofValues(markdown) {
  const labels = new Set(FIELDS.map(([label]) => label))
  const values = new Map()
  const lineNumbers = new Map()

  markdown.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim()
    if (!line.startsWith('|') || line.includes('|---')) {
      return
    }

    const cells = line
      .slice(1, line.endsWith('|') ? -1 : undefined)
      .split('|')
      .map((cell) => cell.trim())
    const label = stripCode(cells[0] ?? '')

    if (labels.has(label) && cells.length >= 2) {
      values.set(label, cells[1])
      lineNumbers.set(label, index + 1)
    }
  })

  return { values, lineNumbers }
}

async function writeProofFile(proofFile) {
  const proofPath = path.resolve(proofFile)
  await fs.mkdir(path.dirname(proofPath), { recursive: true })
  await fs.writeFile(proofPath, renderTemplate(), 'utf8')
  console.log(`Wrote sanitized fulfillment proof template: ${proofPath}`)
}

async function validateProofFile(validateFile, options) {
  const proofPath = path.resolve(validateFile)
  const errors = validateMarkdown(await fs.readFile(proofPath, 'utf8'), options)

  if (errors.length > 0) {
    console.error(`Fulfillment proof validation failed for ${proofPath}`)
    for (const error of errors) {
      console.error(`- ${error.line ? `line ${error.line}` : 'file'}: ${error.type}`)
    }
    process.exit(1)
  }

  console.log(`Fulfillment proof validation passed: ${proofPath}`)
  console.log('No obvious PII, raw Stripe IDs, URLs, or secret-like values found.')
  if (options.requireComplete) {
    console.log('All sanitized proof fields are completed.')
  }
}

function runSelfTest() {
  const template = renderTemplate('2026-04-25T18:30:00Z')
  assert.deepEqual(validateMarkdown(template), [])
  assert(validateMarkdown(template, { requireComplete: true }).some((error) => error.type === 'missing sanitized value for Smoke completed at UTC'))

  const missingField = template.replace('| Ledger row present | `TBD` | yes or no |\n', '')
  assert(validateMarkdown(missingField).some((error) => error.type === 'missing proof field: Ledger row present'))

  let complete = template
  for (const [label, value] of [
    ['Smoke completed at UTC', '2026-04-25T18:30:00Z'],
    ['Target mode', 'test'],
    ['Tier ID', 'planner-ai-workflow-guide-starter'],
    ['Checkout route tier used', 'planner-ai-workflow-guide-starter'],
    ['Stripe event ID suffix only', 'ABCD1234'],
    ['Stripe session ID suffix only', 'WXYZ5678'],
    ['Webhook delivery status', 'succeeded'],
    ['Ledger row present', 'yes'],
    ['Access row active', 'yes'],
    ['Portal access visible', 'yes'],
    ['Onboarding/email state', 'sent'],
    ['Operator', 'BH'],
    ['External evidence reference', 'evidence-vault/APW-2026-04-25'],
  ]) {
    complete = complete.replace(`| ${label} | \`TBD\` |`, `| ${label} | \`${value}\` |`)
  }
  assert.deepEqual(validateMarkdown(complete, { requireComplete: true }), [])

  for (const [label, unsafeValue] of [
    ['Smoke completed at UTC', '2026-04-25 18:30:00'],
    ['Target mode', 'production'],
    ['Tier ID', 'starter'],
    ['Checkout route tier used', 'planner-ai-workflow-guide-enterprise'],
    ['Stripe event ID suffix only', 'ABC'],
    ['Stripe session ID suffix only', 'WXYZ-5678'],
    ['Webhook delivery status', 'ok'],
    ['Ledger row present', 'true'],
    ['Access row active', 'active'],
    ['Portal access visible', 'visible'],
    ['Onboarding/email state', 'done'],
    ['Operator', 'Authorized Operator With Full Name Too Long'],
    ['External evidence reference', 'evidence reference with unsupported punctuation !'],
  ]) {
    const invalidField = template.replace(`| ${label} | \`TBD\` |`, `| ${label} | \`${unsafeValue}\` |`)
    assert(
      validateMarkdown(invalidField).some((error) => error.type === `unsafe value format for ${label}`),
      `Expected unsafe format rejection for ${label}`,
    )
  }

  for (const [type, unsafeText] of [
    ['email address', 'Operator: buyer@example.com'],
    ['full Stripe object ID', 'Stripe event: evt_123456789ABCDEFG'],
    ['Stripe key or webhook signing secret', 'Secret: sk_live_123456789ABCDEFG'],
    ['URL', 'Dashboard: https://dashboard.stripe.com/test/events/evt_123456789ABCDEFG'],
    ['card-like number', 'Card: 4242 4242 4242 4242'],
    ['JWT-like token', 'Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoiYiIsImMiOiJkIn0.abcdefghiABCDEFGHI1234567890'],
  ]) {
    assert(validateMarkdown(`${template}\n${unsafeText}\n`).some((error) => error.type === type), `Expected ${type} rejection`)
  }

  const fullIdInSuffix = template.replace('| Stripe event ID suffix only | `TBD` |', '| Stripe event ID suffix only | `evt_123456789ABCDEFG` |')
  assert(validateMarkdown(fullIdInSuffix).some((error) => error.type === 'full Stripe object ID'))

  console.log('ai-planning-workflows fulfillment proof sanitizer self-test passed')
}

async function main() {
  const options = parseArgs(process.argv)

  if (options.selfTest) {
    runSelfTest()
  } else if (options.validateFile) {
    await validateProofFile(options.validateFile, { requireComplete: options.requireComplete })
  } else if (options.proofFile) {
    await writeProofFile(options.proofFile)
  } else {
    console.log(renderTemplate())
  }
}

main().catch((error) => {
  console.error(`ai-planning-workflows-fulfillment-proof failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
