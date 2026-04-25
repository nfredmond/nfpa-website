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

  vm.runInNewContext(compiled.outputText, {
    exports: compiledModule.exports,
    module: compiledModule,
    process: { env: {} },
  }, { filename: filePath })

  return compiledModule.exports
}

const {
  getStripePaymentLinkEnvNames,
  resolveStripePaymentLinkEnv,
} = loadTsModule('src/lib/commerce/stripe-payment-links.ts')
const { findTierById } = loadTsModule('src/lib/commerce/offers.ts')

const canonical = 'STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_29'
const legacy = 'STRIPE_LINK_VIBE_CODING_PLANNERS_29'
const plain = (value) => JSON.parse(JSON.stringify(value))

assert.deepEqual(plain(getStripePaymentLinkEnvNames(canonical)), [canonical, legacy])

assert.deepEqual(plain(resolveStripePaymentLinkEnv(canonical, {
  [canonical]: ' https://buy.stripe.com/canonical ',
  [legacy]: 'https://buy.stripe.com/legacy',
})), {
  envKey: canonical,
  envAliases: [legacy],
  configuredEnvKey: canonical,
  paymentLink: 'https://buy.stripe.com/canonical',
})

assert.deepEqual(plain(resolveStripePaymentLinkEnv(canonical, {
  [canonical]: '   ',
  [legacy]: ' https://buy.stripe.com/legacy ',
})), {
  envKey: canonical,
  envAliases: [legacy],
  configuredEnvKey: legacy,
  paymentLink: 'https://buy.stripe.com/legacy',
})

assert.deepEqual(plain(resolveStripePaymentLinkEnv(canonical, {})), {
  envKey: canonical,
  envAliases: [legacy],
  configuredEnvKey: null,
  paymentLink: null,
})

assert.deepEqual(plain(resolveStripePaymentLinkEnv('STRIPE_LINK_OPENPLAN_STARTER', {
  STRIPE_LINK_OPENPLAN_STARTER: ' https://buy.stripe.com/openplan ',
})), {
  envKey: 'STRIPE_LINK_OPENPLAN_STARTER',
  envAliases: [],
  configuredEnvKey: 'STRIPE_LINK_OPENPLAN_STARTER',
  paymentLink: 'https://buy.stripe.com/openplan',
})

const canonicalTier = findTierById('planner-ai-workflow-guide-starter')
assert.equal(canonicalTier?.stripePaymentLinkEnv, canonical)

const legacyTierAlias = findTierById('vibe-coding-planners-starter')
assert.equal(legacyTierAlias?.id, 'planner-ai-workflow-guide-starter')
assert.equal(legacyTierAlias?.stripePaymentLinkEnv, canonical)

console.log('commerce env resolution smoke test passed')
