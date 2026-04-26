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
  openSourceProjects,
  readinessLabel,
  readinessNote,
  licenseLabel,
} = loadTsModule('src/data/open-source-projects.ts')

const expectedCatalogSlugs = [
  'openplan',
  'opengeo',
  'aerial-intel-platform',
  'clawmodeler',
  'ads-chatbot',
  'clawchat',
  'planner-ai-workflow-guide-v2',
]

const expectedFeaturedPublicRepoSlugs = [
  'openplan',
  'opengeo',
  'aerial-intel-platform',
  'clawmodeler',
  'ads-chatbot',
]

const forbiddenPublicCatalogSlugs = [
  'nat-ford-website',
  'podcast-processor-codex',
  'dot-dashboard',
  'dot_dashboard_2.0',
  'drone-mapper',
  'freechamp',
  'demand-model',
]

const plain = (value) => JSON.parse(JSON.stringify(value))
const slugs = openSourceProjects.map((project) => project.slug)

assert.deepEqual(plain(slugs), expectedCatalogSlugs, 'Public product catalog changed without updating the approved allowlist guardrail.')
assert.equal(new Set(slugs).size, slugs.length, 'Public product catalog contains duplicate slugs.')

for (const forbiddenSlug of forbiddenPublicCatalogSlugs) {
  assert.ok(!slugs.map((slug) => slug.toLowerCase()).includes(forbiddenSlug), `Forbidden/internal catalog slug surfaced publicly: ${forbiddenSlug}`)
}

const aiWorkflows = openSourceProjects.find((project) => project.slug === 'planner-ai-workflow-guide-v2')
assert.ok(aiWorkflows, 'AI-Assisted Planning Workflows catalog entry is missing.')
assert.equal(aiWorkflows.name, 'AI-Assisted Planning Workflows')
assert.equal(aiWorkflows.status, 'Commercial guide')
assert.equal(aiWorkflows.category, 'Training product')
assert.equal(aiWorkflows.repoUrl, undefined, 'Commercial guide should not pretend to be a public source repository.')
assert.equal(licenseLabel(aiWorkflows), 'Commercial guide')
assert.equal(readinessLabel(aiWorkflows.status), 'Commercial guide')
assert.match(readinessNote(aiWorkflows.status), /Paid educational product/)
assert.ok(!JSON.stringify(aiWorkflows).toLowerCase().includes('vibe coding'), 'Legacy casual product name leaked into the public catalog entry.')
assert.ok(!JSON.stringify(aiWorkflows).toLowerCase().includes('vibe-coding'), 'Legacy route alias leaked into the public catalog entry.')

const projectsPage = fs.readFileSync(path.join(rootDir, 'src/app/(marketing)/products/page.tsx'), 'utf8')
const openSourcePage = fs.readFileSync(path.join(rootDir, 'src/app/(marketing)/open-source/page.tsx'), 'utf8')
const publicCatalogSource = `${projectsPage}\n${openSourcePage}\n${JSON.stringify(openSourceProjects)}`.toLowerCase()

for (const legacyPhrase of ['vibe coding', 'vibe-coding']) {
  assert.ok(!publicCatalogSource.includes(legacyPhrase), `Legacy AI Workflows name/route phrase leaked into public catalog source: ${legacyPhrase}`)
}

for (const stalePhrase of ['research lineage', 'archive projects']) {
  assert.ok(!publicCatalogSource.includes(stalePhrase), `Public catalog copy suggests non-allowlisted ${stalePhrase} are surfaced.`)
}

const featuredRepoSlugs = openSourceProjects
  .filter((project) => project.repoUrl && ['Public alpha', 'Active build'].includes(project.status))
  .map((project) => project.slug)
assert.deepEqual(plain(featuredRepoSlugs), expectedFeaturedPublicRepoSlugs, 'Featured open-source repos should stay limited to true public repo lanes.')

for (const project of openSourceProjects) {
  assert.ok(project.name.trim(), `${project.slug} is missing a name.`)
  assert.ok(project.summary.trim(), `${project.slug} is missing a summary.`)
  assert.ok(project.licenseSpdx.trim(), `${project.slug} is missing a license/status label.`)
  assert.ok(project.paidSupport.trim(), `${project.slug} is missing a support path.`)
  assert.ok(project.primitives.length >= 3, `${project.slug} should expose at least three useful primitives.`)
}

console.log('public catalog guardrail smoke test passed')
