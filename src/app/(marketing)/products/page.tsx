import Link from 'next/link'
import { ArrowRight, Bot, ExternalLink, FileText, Map, PlaneTakeoff, ShieldCheck, Workflow } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionEndCTA } from '@/components/features/section-end-cta'
import { offerCatalog } from '@/lib/commerce/offers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products',
  description:
    'OpenPlan, Marketing & Planning Analytics Software, DroneOps Intelligence, and Vibe Coding for Planners: delivery-ready products with transparent Stripe checkout links and customization paths for any profession.',
}

const products = [
  {
    id: 'openplan',
    name: 'OpenPlan',
    icon: Map,
    stage: 'Prelaunch access',
    description:
      'A modular planning operating system for lean public-sector and consultant teams that need stronger continuity across projects, decisions, risks, datasets, map context, and reporting.',
    capabilities: [
      'Project, risk, decision, and meeting continuity in one operational thread',
      'Map context and linked datasets carried closer to real delivery work',
      'Analysis-to-report workflow shaped for grant and public-sector narratives',
      'Honest methods, assumptions, and readiness disclosure built into the product posture',
    ],
    demoUrl: null as string | null,
    demoLabel: null as string | null,
  },
  {
    id: 'ads-automation',
    name: 'Marketing & Planning Analytics Software',
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
    demoLabel: 'Open Live Demo',
  },
  {
    id: 'drone-ops',
    name: 'DroneOps Intelligence',
    icon: PlaneTakeoff,
    stage: 'Pilot packaging',
    description:
      'Field-to-map drone workflow for infrastructure and planning teams that need dependable QA, reproducible deliverables, and authenticated customer access delivery after purchase.',
    capabilities: [
      'Mission intake + capture checklist discipline',
      'Map-ready export handoff patterns',
      'QA issue tagging and repeatability controls',
      'Authenticated customer access workflow tied to product purchase',
    ],
    demoUrl: null,
    demoLabel: null,
  },
  {
    id: 'vibe-coding-for-planners',
    name: 'Vibe Coding for Planners (PDF Guide)',
    icon: FileText,
    stage: 'Launch-ready',
    description:
      'A practical guide for planners who want faster drafting, better QA, and repeatable AI-assisted workflow hygiene.',
    capabilities: [
      'How-to workflow for planning-specific vibe coding',
      'Prompt patterns that preserve defensibility and auditability',
      'Lean QA checklists for client-facing technical docs',
      'Rapid implementation path for solo planners and small teams',
    ],
    demoUrl: null,
    demoLabel: null,
  },
]

const OPENPLAN_PRELAUNCH_DISCOUNT = 0.15

function hasPublishedStripeCheckout(envName: string): boolean {
  return Boolean(process.env[envName]?.trim())
}

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

const heroStats = [
  { label: 'Products', value: '4' },
  { label: 'Live checkout', value: 'Stripe-hosted' },
  { label: 'Launch posture', value: 'Transparent' },
]

export default function ProductsPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.8fr)] lg:items-end">
            <div className="max-w-3xl">
              <span className="pill">Software Products</span>
              <h1 className="section-title mt-5 text-5xl leading-[0.94] text-white md:text-6xl">
                Focused products.{' '}
                <span className="text-[color:var(--copper)]">Transparent pricing.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-white/82">
                Built for practical operations, budget realism, and measurable outcomes. Published products use
                secure Stripe-hosted checkout; products still being finalized route to scoped contact intake.
                Architecture is customizable for law, science, education, engineering, and real estate.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/18 bg-white/[0.06] p-4 backdrop-blur-sm">
              {heroStats.map((stat) => (
                <div key={stat.label} className="px-2 py-1">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/62">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 font-display text-xl leading-tight text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="pill">Product Catalog</span>
              <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
                Four products. Four different readiness stages.
              </h2>
            </div>
            <p className="max-w-md text-sm text-[color:var(--foreground)]/72">
              Each card shows the current launch posture. Pricing and checkout for live tiers appears below.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {products.map((product) => {
              const Icon = product.icon
              return (
                <Card
                  key={product.name}
                  hover
                  id={product.id}
                  className="scroll-mt-28 overflow-hidden p-0"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
                    <div className="border-b border-[color:var(--line)] bg-[linear-gradient(155deg,rgba(239,228,207,0.55),rgba(247,248,244,0.35)_60%,rgba(247,248,244,0))] p-6 md:p-7 lg:border-b-0 lg:border-r">
                      <div className="flex items-start justify-between gap-3">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--pine)] text-white shadow-[0_8px_22px_rgba(31,78,46,0.18)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="inline-flex items-center rounded-full border border-[color:var(--copper)]/55 bg-white/72 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--pine-deep)]">
                          {product.stage}
                        </span>
                      </div>
                      <h3 className="mt-5 text-2xl font-semibold text-[color:var(--ink)] md:text-[1.75rem]">
                        {product.name}
                      </h3>
                      <p className="mt-3 text-[0.975rem] text-[color:var(--foreground)]/78">{product.description}</p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {product.id === 'openplan' ? (
                          <>
                            <Button asChild size="sm">
                              <Link href="/openplan">
                                OpenPlan details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                              <Link href="/contact/openplan-updates">Request pilot updates</Link>
                            </Button>
                          </>
                        ) : null}

                        {product.demoUrl ? (
                          <Button asChild size="sm" variant={product.id === 'openplan' ? 'outline' : 'primary'}>
                            <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                              {product.demoLabel ?? 'View Demo'}
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        ) : null}

                        {!product.demoUrl && product.id !== 'openplan' ? (
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/contact?product=${encodeURIComponent(product.id)}`}>
                              Request access
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <CardContent className="p-6 md:p-7">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/58">
                        Capabilities
                      </p>
                      <ul className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                        {product.capabilities.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 py-2.5 text-[0.9rem] text-[color:var(--foreground)]/80"
                          >
                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--copper)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </div>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="xl" className="border-y border-[color:var(--line)] bg-[color:var(--fog)]/65">
        <Container>
          <div className="max-w-3xl">
            <span className="pill">Pricing & Checkout</span>
            <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
              Launch-ready pricing tiers
            </h2>
            <p className="mt-4 max-w-3xl text-[color:var(--foreground)]/80">
              Published tiers route through Stripe-hosted links; tiers still being finalized route to a scoped
              contact workflow with product/tier context attached. No hidden fees, no guaranteed funding or
              approval claims, and human-reviewed analysis at critical gates.
            </p>
          </div>

          <div className="mt-10 space-y-10">
            {offerCatalog.map((product) => {
              const isOpenPlan = product.id === 'openplan'

              return (
                <div key={product.id} className="space-y-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-[color:var(--ink)]">{product.name}</h3>
                      <p className="mt-1 max-w-2xl text-sm text-[color:var(--foreground)]/76">
                        {product.description}
                      </p>
                    </div>
                    {isOpenPlan ? (
                      <div className="inline-flex items-center gap-3 rounded-2xl border border-[color:var(--copper)]/45 bg-[color:var(--sand)]/65 px-4 py-2.5">
                        <span className="inline-flex h-6 items-center rounded-full bg-[color:var(--pine)] px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                          March 2026
                        </span>
                        <p className="text-xs font-semibold text-[color:var(--pine-deep)]">
                          Pre-launch: 15% off all tiers · auto-applied at checkout
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {product.tiers.map((tier) => {
                      const discountedPrice = isOpenPlan
                        ? Math.round(tier.monthlyUsd * (1 - OPENPLAN_PRELAUNCH_DISCOUNT))
                        : tier.monthlyUsd
                      const hasCheckout = hasPublishedStripeCheckout(tier.stripePaymentLinkEnv)
                      const ctaLabel = hasCheckout ? product.checkoutCtaLabel ?? 'Subscribe' : 'Request access'

                      return (
                        <Card
                          key={tier.id}
                          className="flex h-full flex-col border border-[color:var(--line)] bg-[color:var(--background)] p-5"
                        >
                          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/62">
                            {tier.name}
                          </p>
                          <p className="mt-2 font-display text-4xl font-semibold leading-none text-[color:var(--ink)]">
                            ${discountedPrice}
                            <span className="ml-1 text-base font-medium text-[color:var(--foreground)]/62">
                              {product.priceSuffix ?? '/mo'}
                            </span>
                          </p>
                          {isOpenPlan ? (
                            <p className="mt-1 text-xs text-[color:var(--foreground)]/68">
                              <span className="line-through">${tier.monthlyUsd}/mo</span> standard
                            </p>
                          ) : null}
                          <p className="mt-3 text-sm text-[color:var(--foreground)]/76">{tier.summary}</p>
                          <ul className="mt-4 space-y-1.5 text-sm text-[color:var(--foreground)]/80">
                            {tier.features.map((feature) => (
                              <li key={feature} className="flex gap-2">
                                <span className="text-[color:var(--copper)]">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-5 flex-1" />
                          <div className="mt-4">
                            <Button asChild size="sm" className="w-full">
                              <Link href={`/api/commerce/checkout?tier=${tier.id}`}>
                                {ctaLabel}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                            {!hasCheckout ? (
                              <p className="mt-2 text-xs text-[color:var(--foreground)]/64">
                                Checkout for this tier is being finalized. Scoped intake instead.
                              </p>
                            ) : null}
                            <p className="mt-2 text-[11px] leading-relaxed text-[color:var(--foreground)]/62">
                              Secure Stripe-hosted checkout. By continuing, you agree to our{' '}
                              <Link href="/terms" className="underline underline-offset-2 hover:text-[color:var(--pine)]">
                                Terms
                              </Link>
                              . AI may accelerate drafting/data prep; final analysis is human-reviewed. No guarantee of funding awards or regulatory approvals.
                            </p>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="mb-8 max-w-3xl">
            <span className="pill">How we ship</span>
            <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
              The product posture behind every tier.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <Card className="p-6 md:p-7">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--sand)] text-[color:var(--pine)]">
                <Workflow className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-[color:var(--ink)]">
                Custom software for any domain
              </h3>
              <p className="mt-3 text-[color:var(--foreground)]/80">
                Our product stack is intentionally modular. We adapt workflows, UI, automations, and QA controls
                for law, science, education, engineering, real estate, and other specialized sectors.
              </p>
              <ul className="mt-5 grid gap-2 text-sm text-[color:var(--foreground)]/78 md:grid-cols-2">
                <li className="flex gap-2"><span className="text-[color:var(--copper)]">•</span>Domain-specific terminology &amp; decision workflows</li>
                <li className="flex gap-2"><span className="text-[color:var(--copper)]">•</span>Role-based access + delivery automations</li>
                <li className="flex gap-2"><span className="text-[color:var(--copper)]">•</span>Branded client portals, reports, and QA gates</li>
                <li className="flex gap-2"><span className="text-[color:var(--copper)]">•</span>Sector-specific analytics and compliance framing</li>
              </ul>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {principles.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.title} className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--sand)] text-[color:var(--pine)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-[color:var(--ink)]">{item.title}</h4>
                        <p className="mt-1.5 text-sm text-[color:var(--foreground)]/78">{item.body}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </Container>
      </Section>

      <SectionEndCTA
        heading="Need a custom setup before checkout?"
        subhead="We can scope a bounded implementation plan first, then route you to the right purchase model (one-time guide or recurring subscription) once fit is clear."
        primary={{ href: '/contact', label: 'Discuss Product Access' }}
        secondary={{
          href: '/services',
          label: (
            <>
              Explore Services <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ),
        }}
      />
    </>
  )
}
