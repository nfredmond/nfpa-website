import Link from 'next/link'
import { ArrowRight, CheckCircle2, Map, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { offerCatalog } from '@/lib/commerce/offers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenPlan',
  description:
    'OpenPlan is a modular planning operating system for keeping projects, decisions, risks, datasets, and map context in one operational thread.',
}

const openPlan = offerCatalog.find((product) => product.id === 'openplan')
const OPENPLAN_PRELAUNCH_DISCOUNT = 0.15

const continuityLanes = [
  {
    title: 'Projects stay legible',
    body: 'Scope, owners, blockers, and deliverables stay visible instead of dissolving into email and meeting notes.',
  },
  {
    title: 'Map context stays attached',
    body: 'Analysis, linked datasets, and reporting context remain connected to the actual work instead of becoming isolated screenshots.',
  },
  {
    title: 'Risks and decisions stay alive',
    body: 'The product is being shaped around operational memory, not just dashboard snapshots.',
  },
]

const fitProfiles = [
  'Small and mid-sized public agencies',
  'Transportation planning teams',
  'Consultants supporting county, regional, rural, or tribal planning work',
  'Lean teams that need better continuity, auditability, and follow-through',
]

const goodFitSignals = [
  'You already have active projects, recurring meetings, and real delivery handoffs to manage.',
  'You want cleaner continuity across project state, map context, risks, and reporting.',
  'You are comfortable joining during an active product-hardening phase and giving grounded feedback.',
]

const waitSignals = [
  'You need a fully mature enterprise rollout with zero workflow shaping or onboarding nuance.',
  'You do not yet have a defined operating rhythm, accountable owner, or active delivery process to improve.',
  'You are looking for autonomous planning judgment rather than a human-reviewed operations tool.',
]

const prelaunchNotes = [
  'Early-access pricing reflects active product hardening and customer-shaping feedback before launch.',
  'If checkout is not finalized for a tier, we route to scoped intake instead of forcing a brittle purchase flow.',
  'If your workflow is high-stakes or unusual, the contact-first path is the safer move.',
]

const faqItems = [
  {
    question: 'What is OpenPlan?',
    answer:
      'OpenPlan is an emerging modular planning operating system designed to keep projects, decisions, risks, datasets, and map-based analysis in one operational thread.',
  },
  {
    question: 'Who is it for?',
    answer:
      'The strongest fit today is lean public-sector and transportation planning teams, plus consultants supporting rural, county, regional, or tribal planning work.',
  },
  {
    question: 'What problem is it meant to solve?',
    answer:
      'A lot of planning work breaks down after the meeting or analysis. Decisions, source files, risk notes, and next actions get scattered across different tools. OpenPlan is being shaped to reduce that handoff failure.',
  },
  {
    question: 'How is this different from a normal dashboard?',
    answer:
      'A dashboard reports status. OpenPlan is being built to preserve context across projects, decisions, meetings, datasets, and outputs so teams can move from evidence to action without losing the thread.',
  },
  {
    question: 'Is OpenPlan fully launched?',
    answer:
      'Not as a broad general-release product. The current phase is active buildout, prelaunch packaging, and early customer access. Direction is strong, but product hardening is still ongoing.',
  },
  {
    question: 'What does prelaunch access mean?',
    answer:
      'It means you are joining during an early customer-access phase while the product is still being hardened. Pricing reflects that stage, and the best-fit customers are teams willing to use the product seriously and share grounded feedback.',
  },
  {
    question: 'What kinds of workflows is OpenPlan being shaped around?',
    answer:
      'Current direction includes project and deliverable tracking, decisions/issues/risks, meeting continuity, linked datasets and map context, analysis-to-report continuity, and grant/proposal readiness support.',
  },
  {
    question: 'How should we think about AI here?',
    answer:
      'Carefully and practically. The useful standard is whether AI reduces rework, preserves context, and makes the next decision clearer. Final analysis still requires human judgment and review.',
  },
  {
    question: 'How should we think about data readiness and mapping?',
    answer:
      'With explicit honesty. If geometry is ready, say so. If coverage exists but thematic support is partial, say that too. Trust matters more than flashy maps.',
  },
]

function hasPublishedStripeCheckout(envName: string): boolean {
  return Boolean(process.env[envName]?.trim())
}

export default function OpenPlanPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh overflow-hidden text-white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.85fr)] lg:items-end">
            <div className="max-w-4xl">
              <span className="pill">OpenPlan — Prelaunch Access</span>
              <h1 className="section-title mt-5 text-5xl leading-[0.94] text-white md:text-6xl">
                A planning operating system that keeps the operational thread intact.
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-white/82">
                OpenPlan is being shaped for transportation and public-sector delivery work where analysis, decisions, risks, datasets,
                meetings, and reporting need to stay connected. The goal is not more dashboard clutter. The goal is cleaner execution.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-white text-[color:var(--pine)] hover:bg-[color:var(--sand)]">
                  <Link href="#pricing">
                    View prelaunch pricing <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/35 bg-white/8 text-white hover:bg-white/14 hover:text-white"
                >
                  <Link href="/contact/openplan-fit">Discuss fit first</Link>
                </Button>
              </div>
            </div>

            <Card className="relative border-white/16 bg-white/8 p-5 text-white shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              <div className="flex items-center justify-between gap-3 border-b border-white/12 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/62">Operational thread</p>
                  <p className="mt-1 text-lg font-semibold">What stays connected</p>
                </div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <Workflow className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {['Project scope', 'Key decision', 'Current risk', 'Linked dataset', 'Map context', 'Report output'].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-white/12 bg-black/10 px-4 py-3"
                  >
                    <span className="text-sm text-white/72">0{index + 1}</span>
                    <span className="font-medium text-white">{item}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--sand)] shadow-[0_0_18px_rgba(243,223,181,0.85)]" />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/72">
                The product direction is intentionally operational: fewer broken handoffs, clearer state, and more honest evidence-to-action continuity.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/85">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {continuityLanes.map((lane) => (
              <Card key={lane.title} className="border-[color:var(--line)] bg-[color:var(--background)] p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--sand)]/65 text-[color:var(--pine)]">
                  <Map className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-[color:var(--ink)]">{lane.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--foreground)]/78">{lane.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] lg:items-start">
            <div>
              <span className="pill">Best Fit</span>
              <h2 className="section-title mt-5 text-4xl text-[color:var(--ink)] md:text-5xl">
                Built for lean teams that need continuity, not software sprawl.
              </h2>
              <p className="mt-4 max-w-2xl text-[color:var(--foreground)]/80">
                The product is being designed around real planning delivery rhythm: a team needs to see what the project is, what changed,
                what is blocked, what evidence supports the next move, and what still needs review.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {fitProfiles.map((profile) => (
                  <div
                    key={profile}
                    className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] px-4 py-4 text-sm text-[color:var(--foreground)]/82"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--pine)]" />
                      <span>{profile}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-[color:var(--pine)]/18 bg-[linear-gradient(180deg,rgba(244,240,233,0.94),rgba(255,255,255,1))] p-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--pine)] text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pine)]/72">Messaging guardrail</p>
                  <p className="text-xl font-semibold text-[color:var(--ink)]">Honest product language only</p>
                </div>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[color:var(--foreground)]/82">
                <li>• Do not present prelaunch access as a guaranteed pilot admission.</li>
                <li>• Do not imply production readiness where hardening is still in progress.</li>
                <li>• Do not use AI-replaces-planners rhetoric.</li>
                <li>• Do not overstate mapping or data-readiness posture.</li>
              </ul>
              <p className="mt-5 rounded-2xl border border-[color:var(--pine)]/14 bg-white/70 px-4 py-4 text-sm text-[color:var(--foreground)]/78">
                The useful promise is practical: less rework, better continuity, clearer handoffs, and more trustworthy evidence-to-action flow.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/88">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="border-[color:var(--pine)]/18 bg-[color:var(--background)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pine)]/72">Good fit now</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">Best for teams already doing real delivery work.</h2>
              <div className="mt-5 space-y-3">
                {goodFitSignals.map((item) => (
                  <div key={item} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--fog)]/45 px-4 py-4 text-sm text-[color:var(--foreground)]/82">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--pine)]" />
                      <span>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-[color:var(--line)] bg-[color:var(--fog)]/55 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/62">Probably wait or talk first</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">Not ideal for teams expecting a finished enterprise platform today.</h2>
              <div className="mt-5 space-y-3">
                {waitSignals.map((item) => (
                  <div key={item} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] px-4 py-4 text-sm text-[color:var(--foreground)]/82">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section id="pricing" spacing="xl" className="border-y border-[color:var(--line)] bg-[color:var(--fog)]/72">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">Prelaunch Pricing</span>
            <h2 className="section-title mt-5 text-4xl text-[color:var(--ink)] md:text-5xl">Choose the access path that matches your operating need.</h2>
            <p className="mt-4 text-[color:var(--foreground)]/80">
              OpenPlan is still in active buildout. Prelaunch pricing reflects early access and shaping feedback, with a 15% discount applied before launch.
              If the right tier is not obvious yet, use the scoped discussion path first.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {prelaunchNotes.map((note) => (
              <div
                key={note}
                className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] px-4 py-4 text-sm leading-relaxed text-[color:var(--foreground)]/78"
              >
                {note}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {openPlan?.tiers.map((tier) => {
              const discountedPrice = Math.round(tier.monthlyUsd * (1 - OPENPLAN_PRELAUNCH_DISCOUNT))
              const hasCheckout = hasPublishedStripeCheckout(tier.stripePaymentLinkEnv)
              const ctaLabel = hasCheckout ? 'Start prelaunch access' : 'Request access'
              const isRecommended = tier.id === 'openplan-professional'

              return (
                <Card
                  key={tier.id}
                  className={`p-5 ${isRecommended ? 'border-[color:var(--pine)] shadow-lg shadow-[color:var(--pine)]/10' : 'border-[color:var(--line)]'} bg-[color:var(--background)]`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[color:var(--foreground)]/62">{tier.name}</p>
                    {isRecommended ? (
                      <span className="rounded-full bg-[color:var(--sand)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--pine)]">
                        Recommended
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-[color:var(--ink)]">
                    ${discountedPrice}
                    <span className="text-base font-medium text-[color:var(--foreground)]/62"> /mo</span>
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--foreground)]/68">
                    <span className="line-through">${tier.monthlyUsd}/mo</span> standard price before launch
                  </p>
                  <p className="mt-3 text-sm text-[color:var(--foreground)]/78">{tier.summary}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-[color:var(--foreground)]/78">
                    {tier.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <Button asChild className="w-full" size="sm">
                      <Link href={`/api/commerce/checkout?tier=${tier.id}`}>
                        {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    {!hasCheckout ? (
                      <p className="mt-2 text-xs text-[color:var(--foreground)]/65">
                        This tier will route to scoped intake until the final checkout link is published.
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-[color:var(--foreground)]/65">
                      Secure Stripe-hosted checkout. AI may accelerate drafting and data prep, but final analysis is human-reviewed. No guarantee of funding awards or regulatory approvals.
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/88">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-start">
            <Card className="border-[color:var(--line)] bg-[color:var(--background)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/62">Not ready to subscribe?</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">Use the softer path and stay in the loop.</h2>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--foreground)]/80">
                If your team is interested but not ready for prelaunch checkout, the right move is to ask for pilot updates or a fit conversation first. That keeps the process honest and prevents a forced purchase decision too early.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/contact/openplan-updates">Request pilot updates</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact/openplan-fit">Discuss fit first</Link>
                </Button>
              </div>
            </Card>

            <Card className="border-[color:var(--pine)]/16 bg-[color:var(--sand)]/28 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pine)]/72">Best use of this page</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--foreground)]/82">
                <li>• Read the fit guidance before treating pricing as the next automatic step.</li>
                <li>• Use prelaunch checkout only if your team is ready for active usage and grounded feedback.</li>
                <li>• Use the contact path if you want updates, scoping, or a cleaner fit decision first.</li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">OpenPlan FAQ</span>
            <h2 className="section-title mt-5 text-4xl text-[color:var(--ink)] md:text-5xl">Straight answers before anyone buys in.</h2>
            <p className="mt-4 max-w-3xl text-[color:var(--foreground)]/80">
              This page is designed to keep the OpenPlan offer clear: what it is, who it fits, what stage it is in, and how we talk about AI and mapping without bluffing.
            </p>
          </div>

          <div className="mt-8 max-w-4xl space-y-3">
            {faqItems.map((faq) => (
              <Card key={faq.question} className="border-[color:var(--line)] bg-[color:var(--background)]">
                <CardContent className="p-0">
                  <details className="group px-5 py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold text-[color:var(--ink)]">
                      <span>{faq.question}</span>
                      <span className="mt-1 text-[color:var(--pine)] transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--foreground)]/78">{faq.answer}</p>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="border-y border-[color:var(--line)] bg-[color:var(--fog)]/78 text-[color:var(--ink)] dark:bg-[#101c27] dark:text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--pine)] text-white shadow-lg shadow-[color:var(--pine)]/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="section-title mt-5 text-4xl text-[color:var(--ink)] dark:text-white md:text-5xl">Want to pressure-test fit before subscribing?</h2>
            <p className="mt-4 text-lg text-[color:var(--foreground)]/82 dark:text-white/80">
              That is the preferred move if your workflow is unusual, high-stakes, or still being defined. We can scope the right access path before asking you to commit.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact/openplan-fit">Discuss OpenPlan</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[color:var(--line)] text-[color:var(--ink)] hover:border-[color:var(--pine)] hover:bg-[color:var(--background)] hover:text-[color:var(--pine)] dark:border-white/35 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Link href="/products#openplan">
                  Compare all products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
