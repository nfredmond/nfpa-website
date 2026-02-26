import Link from 'next/link'
import { ArrowRight, Bot, Map, ShieldCheck, Workflow, PlaneTakeoff } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { offerCatalog } from '@/lib/commerce/offers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products',
  description:
    'OpenPlan, Ads Automation, and DroneOps Intelligence: delivery-ready products with transparent subscription lanes.',
}

const products = [
  {
    id: 'openplan',
    name: 'OpenPlan',
    icon: Map,
    stage: 'Active build',
    description:
      'Transportation analysis platform for corridor-level diagnostics, equity/safety context, and grant-ready outputs.',
    capabilities: [
      'Corridor-first workflow for practical project framing',
      'Equity and safety indicators in one operational view',
      'Report generation aligned with funding narratives',
      'Methods and assumptions disclosure built into output design',
    ],
    demoUrl: null,
    demoLabel: null,
  },
  {
    id: 'ads-automation',
    name: 'Ads Automation',
    icon: Bot,
    stage: 'Client-proven v1',
    description:
      'Operations automation product lineage built from a real client engagement and evolving toward a reusable v2 stack.',
    capabilities: [
      'Cross-channel sync and operational hygiene automation',
      'Faster campaign reporting and review cycles',
      'Structured migration path from custom build to reusable product',
      'Built with maintainability and multi-industry expansion in mind',
    ],
    demoUrl: 'https://ads-chatbot.vercel.app',
    demoLabel: 'View Web Demo',
  },
  {
    id: 'drone-ops',
    name: 'DroneOps Intelligence',
    icon: PlaneTakeoff,
    stage: 'Pilot packaging',
    description:
      'Field-to-map drone workflow lane for infrastructure and planning teams that need dependable QA and reproducible deliverables.',
    capabilities: [
      'Mission intake + capture checklist discipline',
      'Map-ready export handoff patterns',
      'QA issue tagging and repeatability controls',
      'Grounded implementation path for low-budget teams',
    ],
    demoUrl: null,
    demoLabel: null,
  },
]

const principles = [
  {
    icon: Workflow,
    title: 'Workflow-first design',
    body: 'Every feature should reduce friction in real delivery sequences, not just add dashboard surface area.',
  },
  {
    icon: ShieldCheck,
    title: 'Auditability over hype',
    body: 'Outputs are designed for reviewability: assumptions clear, claims verifiable, and handoff-ready.',
  },
]

export default function ProductsPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">Product Suite</span>
            <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Focused products. Transparent pricing lanes.</h1>
            <p className="mt-5 text-lg text-white/82 max-w-3xl">
              Built for practical operations, budget realism, and measurable outcomes. Subscriptions use secure Stripe-hosted checkout.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="grid grid-cols-1 gap-6">
            {products.map((product) => {
              const Icon = product.icon
              return (
                <Card key={product.name} hover id={product.id} className="p-6 md:p-8 scroll-mt-28">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                    <div className="max-w-3xl">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--sand)] text-[color:var(--pine)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="mt-4 flex items-center gap-3 flex-wrap">
                        <h2 className="text-3xl font-semibold text-[color:var(--ink)]">{product.name}</h2>
                        <span className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--fog)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]/70">
                          {product.stage}
                        </span>
                      </div>
                      <p className="mt-3 text-[1rem] text-[color:var(--foreground)]/78">{product.description}</p>
                    </div>
                  </div>

                  <CardContent className="px-0 pb-0 pt-5">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.capabilities.map((item) => (
                        <li
                          key={item}
                          className="rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)]/78"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>

                    {product.demoUrl ? (
                      <div className="mt-5">
                        <Button asChild variant="outline">
                          <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                            {product.demoLabel ?? 'View Demo'} <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="xl" className="bg-[color:var(--fog)]/65 border-y border-[color:var(--line)]">
        <Container>
          <div className="space-y-3">
            <span className="pill">Subscriptions</span>
            <h2 className="section-title text-4xl md:text-5xl text-[color:var(--ink)]">Launch-ready subscription tiers</h2>
            <p className="max-w-4xl text-[color:var(--foreground)]/80">
              Choose a plan lane that matches operational load. Checkout routes through Stripe hosted links. If a lane is not yet published,
              we route you to a scoped contact workflow.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {offerCatalog.map((product) => (
              <div key={product.id} className="space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold text-[color:var(--ink)]">{product.name}</h3>
                  <p className="mt-1 text-sm text-[color:var(--foreground)]/76">{product.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {product.tiers.map((tier) => (
                    <Card key={tier.id} className="p-5 border border-[color:var(--line)] bg-[color:var(--background)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[color:var(--foreground)]/62">{tier.name}</p>
                      <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">${tier.monthlyUsd}<span className="text-base font-medium text-[color:var(--foreground)]/62">/mo</span></p>
                      <p className="mt-2 text-sm text-[color:var(--foreground)]/75">{tier.summary}</p>
                      <ul className="mt-4 space-y-1.5 text-sm text-[color:var(--foreground)]/78">
                        {tier.features.map((feature) => (
                          <li key={feature}>• {feature}</li>
                        ))}
                      </ul>
                      <div className="mt-5">
                        <Button asChild size="sm" className="w-full">
                          <Link href={`/api/commerce/checkout?tier=${tier.id}`}>
                            Subscribe via Stripe <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[color:var(--fog)]/65 border-y border-[color:var(--line)]">
        <Container>
          <div className="max-w-5xl">
            <span className="pill">Build Principles</span>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {principles.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.title} className="p-6">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--sand)] text-[color:var(--pine)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-[color:var(--ink)]">{item.title}</h3>
                    <p className="mt-2 text-sm text-[color:var(--foreground)]/78">{item.body}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="border-y border-[color:var(--line)] bg-[color:var(--fog)]/78 text-[color:var(--ink)] dark:bg-[#101c27] dark:text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-title text-4xl text-[color:var(--ink)] dark:text-white md:text-5xl">Need a custom lane before subscribing?</h2>
            <p className="mt-4 text-lg text-[color:var(--foreground)]/82 dark:text-white/80">
              We can scope a bounded implementation plan first, then convert to a recurring subscription when value is proven.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">Discuss Product Access</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[color:var(--line)] text-[color:var(--ink)] hover:border-[color:var(--pine)] hover:bg-[color:var(--background)] hover:text-[color:var(--pine)] dark:border-white/35 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Link href="/services">
                  Explore Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
