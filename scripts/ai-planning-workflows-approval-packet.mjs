#!/usr/bin/env node
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'

const PRODUCT_ID = 'planner-ai-workflow-guide-v2'
const PRODUCT_NAME = 'AI-Assisted Planning Workflows'
const PACKET_HEADER = '# AI-Assisted Planning Workflows Launch Approval Packet'
const DRY_RUN_HEADER = '# AI-Assisted Planning Workflows Launch Dry-Run Proof'

const BLOCKLIST = [
  ['email address', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu],
  ['Stripe key or webhook signing secret', /\b(?:sk|rk|pk|whsec)_(?:live|test)?_?[A-Za-z0-9]{8,}\b/giu],
  ['full Stripe object ID', /\b(?:acct|ch|cs|cus|evt|in|li|link|pi|pm|price|prod|py|seti|sub)_(?:live|test)?_?[A-Za-z0-9]{8,}\b/giu],
  ['Stripe dashboard or payment URL', /https?:\/\/(?:dashboard\.stripe\.com|buy\.stripe\.com|checkout\.stripe\.com|pay\.stripe\.com)\/\S+/giu],
  ['card-like number', /\b(?:\d[ -]*?){13,19}\b/gu],
  ['JWT-like token', /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/gu],
  ['private key block', /-----BEGIN [A-Z ]*PRIVATE KEY-----/gu],
]

const FORBIDDEN_PACKET_PATTERNS = [
  ['claims fulfillment proof status as completed', /Fulfillment proof status:\s*`?(?:pass|passed|complete|completed|confirmed|provided|approved|yes)`?/giu],
  ['marks actual fulfillment proof row as completed', /^\|\s*Actual fulfillment proof\s*\|\s*`?(?:pass|passed|complete|completed|confirmed|provided|approved|yes)`?\s*\|/gim],
  ['states packet proves live checkout', /\bthis packet proves live checkout completion\b/giu],
  ['states packet proves customer fulfillment', /\bthis packet proves customer fulfillment\b/giu],
]

function usage() {
  console.log(`Usage: node scripts/ai-planning-workflows-approval-packet.mjs [options]

Generate or validate a no-secret launch approval packet that separates dry-run
readiness evidence from actual fulfillment proof for AI-Assisted Planning
Workflows.

Options:
  --dry-run-proof <path>  Read and summarize a launch dry-run proof artifact.
  --proof-file <path>     Write the launch approval packet to Markdown.
  --validate <path>       Validate an approval packet for boundary language and unsafe data.
  --self-test             Run local packet validation checks.
  --json                  Print JSON summary instead of Markdown when generating.
  --help                  Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    dryRunProof: null,
    proofFile: null,
    validateFile: null,
    selfTest: false,
    json: false,
  }

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    } else if (arg === '--dry-run-proof') {
      options.dryRunProof = requiredValue(argv, ++index, arg)
    } else if (arg.startsWith('--dry-run-proof=')) {
      options.dryRunProof = arg.slice('--dry-run-proof='.length)
    } else if (arg === '--proof-file') {
      options.proofFile = requiredValue(argv, ++index, arg)
    } else if (arg.startsWith('--proof-file=')) {
      options.proofFile = arg.slice('--proof-file='.length)
    } else if (arg === '--validate') {
      options.validateFile = requiredValue(argv, ++index, arg)
    } else if (arg.startsWith('--validate=')) {
      options.validateFile = arg.slice('--validate='.length)
    } else if (arg === '--self-test') {
      options.selfTest = true
    } else if (arg === '--json') {
      options.json = true
    } else {
      throw new Error(`Unknown option: ${arg}`)
    }
  }

  if (options.proofFile && options.validateFile) {
    throw new Error('Use --proof-file or --validate, not both')
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

function lineNumberForIndex(text, targetIndex) {
  return text.slice(0, targetIndex).split(/\r?\n/).length
}

function unsafeDataErrors(markdown) {
  const errors = []

  for (const [type, regex] of BLOCKLIST) {
    regex.lastIndex = 0
    let match
    while ((match = regex.exec(markdown)) !== null) {
      errors.push({ type, line: lineNumberForIndex(markdown, match.index) })
    }
  }

  return errors
}

function patternErrors(markdown, patterns) {
  const errors = []

  for (const [type, regex] of patterns) {
    regex.lastIndex = 0
    let match
    while ((match = regex.exec(markdown)) !== null) {
      errors.push({ type, line: lineNumberForIndex(markdown, match.index) })
    }
  }

  return errors
}

function extractLabel(markdown, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = markdown.match(new RegExp(`^${escapedLabel}:\\s*(.+)$`, 'm'))
  return match?.[1]?.trim() ?? null
}

function extractDryRunResult(markdown) {
  const lines = markdown.split(/\r?\n/)

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].trim() !== '## Result') {
      continue
    }

    for (let next = index + 1; next < lines.length; next += 1) {
      const value = lines[next].trim()
      if (!value) {
        continue
      }
      if (value === 'PASS' || value === 'FAIL') {
        return value
      }
      break
    }
  }

  const inline = markdown.match(/^Result:\s*(PASS|FAIL)$/m)
  return inline?.[1] ?? 'UNKNOWN'
}

function validateDryRunProofMarkdown(markdown) {
  const errors = unsafeDataErrors(markdown)

  if (!markdown.includes(DRY_RUN_HEADER)) {
    errors.push({ type: 'missing launch dry-run proof header', line: null })
  }
  if (!markdown.includes('## What This Does Not Prove')) {
    errors.push({ type: 'missing dry-run limitation section', line: null })
  }
  if (!/does not prove live checkout completion/i.test(markdown)) {
    errors.push({ type: 'missing live-checkout limitation', line: null })
  }
  if (!/Do not use it as customer fulfillment proof/i.test(markdown)) {
    errors.push({ type: 'missing customer-fulfillment limitation', line: null })
  }

  const result = extractDryRunResult(markdown)
  if (result !== 'PASS' && result !== 'FAIL') {
    errors.push({ type: 'missing dry-run PASS/FAIL result', line: null })
  }

  return errors
}

function summarizeDryRunProof(markdown, proofPath = null) {
  const errors = validateDryRunProofMarkdown(markdown)
  const resolvedPath = proofPath ? path.resolve(proofPath) : null

  return {
    attached: true,
    artifact: resolvedPath ? path.relative(process.cwd(), resolvedPath) || resolvedPath : 'provided markdown',
    generatedAt: extractLabel(markdown, 'Generated') ?? 'unknown',
    baseUrl: extractLabel(markdown, 'Base URL') ?? 'unknown',
    result: extractDryRunResult(markdown),
    validation: {
      ok: errors.length === 0,
      errors,
    },
  }
}

function pendingDryRunSummary() {
  return {
    attached: false,
    artifact: 'not attached',
    generatedAt: 'not attached',
    baseUrl: 'not attached',
    result: 'NOT ATTACHED',
    validation: {
      ok: true,
      errors: [],
    },
  }
}

function markdownCode(value) {
  return `\`${String(value).replaceAll('`', '')}\``
}

function renderApprovalPacket({ generatedAt = new Date().toISOString(), dryRun = pendingDryRunSummary() } = {}) {
  const dryRunStatus = dryRun.attached ? dryRun.result : 'PENDING'
  const dryRunArtifact = dryRun.attached ? markdownCode(dryRun.artifact) : 'not attached'

  const lines = [
    PACKET_HEADER,
    '',
    `Generated: ${generatedAt}`,
    `Product ID: ${markdownCode(PRODUCT_ID)}`,
    `Product Name: ${PRODUCT_NAME}`,
    'Evidence class: `readiness-only`',
    'Fulfillment proof status: `not-claimed`',
    '',
    'This packet is a no-secret launch readiness packet. It may include public website origins and generated timestamps, but it must not contain Stripe dashboard URLs, payment links, secret keys, customer records, buyer PII, raw emails, or card data.',
    '',
    'This packet does not claim actual fulfillment proof. Actual fulfillment proof requires a human-authorized checkout plus sanitized evidence validated by `npm run proof:ai-planning-workflows-fulfillment`.',
    '',
    '## Decision Boundary',
    '',
    '| Evidence track | Status | Artifact | Supports | Does not support |',
    '|---|---|---|---|---|',
    `| Dry-run readiness | ${markdownCode(dryRunStatus)} | ${dryRunArtifact} | Public readiness endpoint shape, canonical tier metadata, accepted legacy aliases, and checkout handoff metadata | Checkout completion, webhook delivery, ledger/access row writes, portal visibility, onboarding email delivery, refunds, or cleanup |`,
    '| Actual fulfillment proof | `NOT CLAIMED` | Human-only proof not attached | None in this packet | Customer delivery and entitlement proof remain approval-gated |',
    '',
    '## Dry-Run Readiness Summary',
    '',
    `- Dry-run proof attached: ${dryRun.attached ? 'yes' : 'no'}`,
    `- Dry-run result: ${dryRunStatus}`,
    `- Dry-run generated: ${dryRun.generatedAt}`,
    `- Dry-run base URL: ${dryRun.baseUrl}`,
    `- Dry-run artifact: ${dryRun.artifact}`,
    `- Dry-run artifact validation: ${dryRun.validation.ok ? 'PASS' : 'FAIL'}`,
    '',
    '## Required Human Fulfillment Proof',
    '',
    'Launch readiness can use the dry-run result as handoff evidence only. Actual fulfillment proof remains blocked until an authorized human operator completes checkout and validates a sanitized proof file.',
    '',
    '```bash',
    'npm run proof:ai-planning-workflows-fulfillment -- \\',
    '  --proof-file /tmp/ai-assisted-planning-workflows-fulfillment-proof.md',
    'npm run proof:ai-planning-workflows-fulfillment -- \\',
    '  --validate /tmp/ai-assisted-planning-workflows-fulfillment-proof.md \\',
    '  --require-complete',
    '```',
    '',
    '## Packet Validation',
    '',
    'Before sharing this packet, run:',
    '',
    '```bash',
    'npm run packet:ai-planning-workflows-approval -- --validate /path/to/approval-packet.md',
    '```',
  ]

  if (dryRun.validation.errors.length > 0) {
    lines.push('', '## Dry-Run Validation Errors', '')
    for (const error of dryRun.validation.errors) {
      lines.push(`- ${error.line ? `line ${error.line}` : 'file'}: ${error.type}`)
    }
  }

  return `${lines.join('\n')}\n`
}

function validateApprovalPacketMarkdown(markdown) {
  const errors = [
    ...unsafeDataErrors(markdown),
    ...patternErrors(markdown, FORBIDDEN_PACKET_PATTERNS),
  ]

  if (!markdown.includes(PACKET_HEADER)) {
    errors.push({ type: 'missing approval packet header', line: null })
  }
  if (!markdown.includes('Evidence class: `readiness-only`')) {
    errors.push({ type: 'missing readiness-only evidence class', line: null })
  }
  if (!markdown.includes('Fulfillment proof status: `not-claimed`')) {
    errors.push({ type: 'missing not-claimed fulfillment proof status', line: null })
  }
  if (!markdown.includes('This packet does not claim actual fulfillment proof.')) {
    errors.push({ type: 'missing no-fulfillment-proof claim boundary', line: null })
  }
  if (!/^\|\s*Actual fulfillment proof\s*\|\s*`NOT CLAIMED`\s*\|/m.test(markdown)) {
    errors.push({ type: 'missing actual fulfillment proof NOT CLAIMED row', line: null })
  }
  if (!/Checkout completion, webhook delivery, ledger\/access row writes/i.test(markdown)) {
    errors.push({ type: 'missing dry-run non-proof boundary', line: null })
  }

  return errors
}

async function readDryRunProof(proofFile) {
  if (!proofFile) {
    return pendingDryRunSummary()
  }

  const proofPath = path.resolve(proofFile)
  const markdown = await fs.readFile(proofPath, 'utf8')
  const summary = summarizeDryRunProof(markdown, proofPath)

  if (!summary.validation.ok) {
    const details = summary.validation.errors
      .map((error) => `${error.line ? `line ${error.line}` : 'file'}: ${error.type}`)
      .join('; ')
    throw new Error(`Dry-run proof validation failed for ${proofPath}: ${details}`)
  }

  return summary
}

async function writeApprovalPacket(proofFile, dryRun) {
  const proofPath = path.resolve(proofFile)
  const markdown = renderApprovalPacket({ dryRun })
  const errors = validateApprovalPacketMarkdown(markdown)

  if (errors.length > 0) {
    const details = errors.map((error) => `${error.line ? `line ${error.line}` : 'file'}: ${error.type}`).join('; ')
    throw new Error(`Generated approval packet did not pass validation: ${details}`)
  }

  await fs.mkdir(path.dirname(proofPath), { recursive: true })
  await fs.writeFile(proofPath, markdown, 'utf8')
  console.log(`Wrote launch approval packet: ${proofPath}`)
}

async function validateApprovalPacketFile(validateFile) {
  const proofPath = path.resolve(validateFile)
  const errors = validateApprovalPacketMarkdown(await fs.readFile(proofPath, 'utf8'))

  if (errors.length > 0) {
    console.error(`Launch approval packet validation failed for ${proofPath}`)
    for (const error of errors) {
      console.error(`- ${error.line ? `line ${error.line}` : 'file'}: ${error.type}`)
    }
    process.exit(1)
  }

  console.log(`Launch approval packet validation passed: ${proofPath}`)
  console.log('Dry-run readiness remains separated from actual fulfillment proof.')
}

function syntheticDryRunProof(result = 'PASS') {
  return `${DRY_RUN_HEADER}

Generated: 2026-04-25T18:30:00.000Z
Base URL: https://www.natfordplanning.com

This proof is no-secret and no-purchase: it reads public website endpoints, does not follow Stripe redirects, and does not write customer records.

## What This Does Not Prove

This dry-run does not prove live checkout completion, Stripe webhook delivery, fulfillment ledger writes, active customer access, portal visibility, onboarding email delivery, refunds, or cleanup. Do not use it as customer fulfillment proof.

## Result

${result}
`
}

function runSelfTest() {
  const dryRun = summarizeDryRunProof(syntheticDryRunProof(), '/tmp/ai-assisted-planning-workflows-launch-dry-run-proof.md')
  assert.equal(dryRun.validation.ok, true)
  assert.equal(dryRun.result, 'PASS')

  const packet = renderApprovalPacket({
    generatedAt: '2026-04-25T18:45:00.000Z',
    dryRun,
  })
  assert.deepEqual(validateApprovalPacketMarkdown(packet), [])
  assert.match(packet, /Dry-run readiness/)
  assert.match(packet, /Actual fulfillment proof \| `NOT CLAIMED`/)

  const missingBoundary = packet.replace('Fulfillment proof status: `not-claimed`', 'Fulfillment proof status: `confirmed`')
  assert(validateApprovalPacketMarkdown(missingBoundary).some((error) => error.type === 'claims fulfillment proof status as completed'))
  assert(validateApprovalPacketMarkdown(missingBoundary).some((error) => error.type === 'missing not-claimed fulfillment proof status'))

  const rowClaim = packet.replace('| Actual fulfillment proof | `NOT CLAIMED` |', '| Actual fulfillment proof | `PASS` |')
  assert(validateApprovalPacketMarkdown(rowClaim).some((error) => error.type === 'marks actual fulfillment proof row as completed'))

  const unsafePacket = `${packet}\nSecret: sk_live_123456789ABCDEFG\n`
  assert(validateApprovalPacketMarkdown(unsafePacket).some((error) => error.type === 'Stripe key or webhook signing secret'))

  const badDryRun = syntheticDryRunProof().replace('## What This Does Not Prove', '## Evidence')
  assert(validateDryRunProofMarkdown(badDryRun).some((error) => error.type === 'missing dry-run limitation section'))

  const unsafeDryRun = `${syntheticDryRunProof()}\nPayment link: https://buy.stripe.com/test_123456789\n`
  assert(validateDryRunProofMarkdown(unsafeDryRun).some((error) => error.type === 'Stripe dashboard or payment URL'))

  const pendingPacket = renderApprovalPacket({ generatedAt: '2026-04-25T18:45:00.000Z' })
  assert.deepEqual(validateApprovalPacketMarkdown(pendingPacket), [])
  assert.match(pendingPacket, /Dry-run proof attached: no/)

  console.log('ai-planning-workflows approval packet self-test passed')
}

async function main() {
  const options = parseArgs(process.argv)

  if (options.selfTest) {
    runSelfTest()
    return
  }

  if (options.validateFile) {
    await validateApprovalPacketFile(options.validateFile)
    return
  }

  const dryRun = await readDryRunProof(options.dryRunProof)

  if (options.proofFile) {
    await writeApprovalPacket(options.proofFile, dryRun)
    return
  }

  if (options.json) {
    console.log(JSON.stringify({ productId: PRODUCT_ID, productName: PRODUCT_NAME, dryRun }, null, 2))
  } else {
    console.log(renderApprovalPacket({ dryRun }))
  }
}

main().catch((error) => {
  console.error(`ai-planning-workflows-approval-packet failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
