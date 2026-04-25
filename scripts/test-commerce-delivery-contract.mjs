#!/usr/bin/env node
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

const rootDir = path.resolve(new URL('..', import.meta.url).pathname)

function loadTsModule(relativePath) {
  const filePath = path.join(rootDir, relativePath)
  const source = fs.readFileSync(filePath, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filePath,
  })
  const compiledModule = { exports: {} }

  vm.runInNewContext(
    compiled.outputText,
    {
      exports: compiledModule.exports,
      module: compiledModule,
      process: { env: {} },
    },
    { filename: filePath }
  )

  return compiledModule.exports
}

const {
  buildCheckoutClientReferenceId,
  findTierById,
  inferProductAndTierFromClientReference,
  normalizeCommerceProductTierReference,
  offerCatalog,
  resolveCommerceCheckoutProductTierReference,
} = loadTsModule('src/lib/commerce/offers.ts')
const {
  getStripePaymentLinkEnvNames,
} = loadTsModule('src/lib/commerce/stripe-payment-links.ts')

const plain = (value) => JSON.parse(JSON.stringify(value))

const expectedTiers = [
  {
    canonicalId: 'planner-ai-workflow-guide-starter',
    legacyAlias: 'vibe-coding-planners-starter',
    price: 29,
    envKey: 'STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_29',
    legacyEnvKey: 'STRIPE_LINK_VIBE_CODING_PLANNERS_29',
  },
  {
    canonicalId: 'planner-ai-workflow-guide-practitioner',
    legacyAlias: 'vibe-coding-planners-practitioner',
    price: 39,
    envKey: 'STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_39',
    legacyEnvKey: 'STRIPE_LINK_VIBE_CODING_PLANNERS_39',
  },
  {
    canonicalId: 'planner-ai-workflow-guide-team',
    legacyAlias: 'vibe-coding-planners-team',
    price: 49,
    envKey: 'STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_49',
    legacyEnvKey: 'STRIPE_LINK_VIBE_CODING_PLANNERS_49',
  },
]

const product = offerCatalog.find((candidate) => candidate.id === 'planner-ai-workflow-guide-v2')
assert.equal(product?.name, 'AI-Assisted Planning Workflows')
assert.equal(product?.checkoutCtaLabel, 'Buy now')
assert.equal(product?.priceSuffix, 'one-time')
assert.equal(product?.tiers.length, expectedTiers.length)

for (const expected of expectedTiers) {
  const tier = findTierById(expected.canonicalId)
  assert.equal(tier?.product.id, product.id)
  assert.equal(tier?.id, expected.canonicalId)
  assert.deepEqual(plain(tier?.aliases), [expected.legacyAlias])
  assert.equal(tier?.monthlyUsd, expected.price)
  assert.equal(tier?.stripePaymentLinkEnv, expected.envKey)

  const aliasTier = findTierById(expected.legacyAlias)
  assert.equal(aliasTier?.id, expected.canonicalId)
  assert.equal(aliasTier?.product.id, product.id)

  assert.deepEqual(plain(getStripePaymentLinkEnvNames(expected.envKey)), [
    expected.envKey,
    expected.legacyEnvKey,
  ])

  const checkoutClientReferenceId = buildCheckoutClientReferenceId(product.id, tier.id)
  assert.equal(checkoutClientReferenceId, `${product.id}:${expected.canonicalId}`)
  assert.deepEqual(plain(inferProductAndTierFromClientReference(checkoutClientReferenceId)), {
    productId: product.id,
    tierId: expected.canonicalId,
  })

  assert.deepEqual(plain(inferProductAndTierFromClientReference(expected.legacyAlias)), {
    productId: product.id,
    tierId: expected.canonicalId,
  })

  assert.deepEqual(plain(inferProductAndTierFromClientReference(`${product.id}:${expected.legacyAlias}`)), {
    productId: product.id,
    tierId: expected.canonicalId,
  })

  assert.deepEqual(plain(normalizeCommerceProductTierReference(product.id, expected.legacyAlias)), {
    productId: product.id,
    tierId: expected.canonicalId,
  })

  assert.deepEqual(plain(resolveCommerceCheckoutProductTierReference({
    clientReferenceId: `${product.id}:${expected.legacyAlias}`,
    metadata: {},
  })), {
    productId: product.id,
    tierId: expected.canonicalId,
  })

  assert.deepEqual(plain(resolveCommerceCheckoutProductTierReference({
    clientReferenceId: null,
    metadata: {
      product_id: product.id,
      tier_id: expected.legacyAlias,
    },
  })), {
    productId: product.id,
    tierId: expected.canonicalId,
  })

  assert.deepEqual(plain(resolveCommerceCheckoutProductTierReference({
    clientReferenceId: `${product.id}:${expected.canonicalId}`,
    metadata: {
      productId: product.id,
      tierId: expected.legacyAlias,
    },
  })), {
    productId: product.id,
    tierId: expected.canonicalId,
  })
}

assert.deepEqual(plain(resolveCommerceCheckoutProductTierReference({
  clientReferenceId: `${product.id}:planner-ai-workflow-guide-starter`,
  metadata: {
    product_id: product.id,
    tier_id: 'vibe-coding-planners-team',
  },
})), {
  productId: product.id,
  tierId: 'planner-ai-workflow-guide-team',
})

assert.deepEqual(plain(inferProductAndTierFromClientReference('openplan-starter-prelaunch')), {
  productId: 'openplan',
  tierId: 'openplan-starter',
})

console.log('commerce delivery contract smoke test passed')
