import Link from 'next/link'
import type { Metadata } from 'next'
import { CheckCircle2, ExternalLink, GitFork, Map, ShieldCheck, Sparkles, Wrench } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { implementationOffers, licenseLabel, openSourceProjects, readinessLabel, readinessNote } from '@/data/open-source-projects'

export const metadata: Metadata = {
  title: 'OpenPlan',
  description:
    'OpenPlan is a free, open-source planning operating system for keeping projects, decisions, risks, datasets, maps, grants, and reports in one operational thread.',
}

const openPlanProject = openSourceProjects.find((project) => project.slug === 'openplan')

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
    body: 'The product is shaped around operational memory, not just dashboard snapshots.',
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
  'You want cleaner continuity across project state, map context, risks, grants, programs, and reporting.',
  'You are comfortable using an open-source tool that can be forked, extended, and adapted to your local workflow.',
]

const managedSupportSignals = [
  'You want Nat Ford to host, configure, administer, and monitor OpenPlan for your team.',
  'You need a custom agency or company edition with your data model, branding, roles, and reporting templates.',
  'You want onboarding, training, enterprise SSO/role setup, 24-hour response support, and merge-forward maintenance.',
]

const faqItems = [
  {
    question: 'Is OpenPlan free?',
    answer:
      'Yes. The OpenPlan codebase is public and intended for open-source reuse once license terms are declared. Teams can inspect, fork, or self-host under the repo license. Nat Ford charges only for managed deployment, custom forks, onboarding, support, and surrounding planning services.',
  },
  {
    question: 'What is OpenPlan?',
    answer:
      'OpenPlan is a modular planning operating system designed to keep projects, decisions, risks, datasets, map-based analysis, grants, programs, and reports in one operational thread.',
  },
  {
    question: 'Who is it for?',
    answer:
      'The strongest fit today is lean public-sector and transportation planning teams, plus consultants supporting rural, county, regional, or tribal planning work.',
  },
  {
    question: 'How is this different from a normal dashboard?',
    answer:
      'A dashboard reports status. OpenPlan is being built to preserve context across projects, decisions, meetings, datasets, maps, grants, and outputs so teams can move from evidence to action without losing the thread.',
  },
  {
    question: 'Why open source it?',
    answer:
      'Because planning software should be reusable, inspectable, and adaptable. Agencies should not have to pay over and over for the same invisible scaffolding. Open code also lets people and AI agents build custom versions instead of waiting for a vendor to guess every edge case.',
  },
  {
    question: 'Can Nat Ford run OpenPlan for us?',
    answer:
      'Yes. That is the paid offer: managed deployment, custom fork, hosting/admin, data setup, templates, training, enterprise onboarding, and priority support.',
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

export default function OpenPlanPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh overflow-hidden text-white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.85fr)] lg:items-end">
            <div className="max-w-4xl">
              <span className="pill border-white/20 bg-white/10 text-white">OpenPlan — free and open source</span>
              <h1 className="section-title mt-5 text-5xl leading-[0.94] text-white md:text-6xl">
                A planning operating system anyone can inspect, fork, and adapt.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/82">
                OpenPlan keeps projects, decisions, risks, datasets, maps, grants, programs, and reports in one operational
                thread. The code is public because planning tools should be reusable building blocks, not black boxes.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-white text-[color:var(--pine)] hover:bg-[color:var(--sand)]">
                  <a href={openPlanProject?.repoUrl ?? 'https://github.com/nfredmond/openplan'} target="_blank" rel="noopener noreferrer">
                    View GitHub repo <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/35 bg-white/8 text-white hover:bg-white/14 hover:text-white"
                >
                  <Link href="/contact/openplan-fit">Request managed setup</Link>
                </Button>
              </div>
            </div>

            <Card className="relative border-white/16 bg-white/8 p-5 text-white shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              <div className="flex items-center justify-between gap-3 border-b border-white/12 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/62">Commercial model</p>
                  <p className="mt-1 text-lg font-semibold">Free code + paid stewardship</p>
                </div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <GitFork className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {['Public repo', 'Self-host path', 'Custom agency fork', 'Managed deployment', 'Data setup', '24-hour response'].map((item, index) => (
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
                The useful promise is not a locked subscription. It is a forkable operational spine with real support when your team needs production confidence.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/85">
        <Container>
          {openPlanProject ? (
            <div className="mb-5 grid gap-3 rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--fog)]/45 p-4 text-sm md:grid-cols-[0.8fr_0.8fr_1fr_auto] md:items-center">
              <div>
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/55">Readiness</p>
                <p className="mt-1 font-semibold text-[color:var(--ink)]">{readinessLabel(openPlanProject.status)}</p>
              </div>
              <div>
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/55">License</p>
                <p className="mt-1 font-semibold text-[color:var(--ink)]">{licenseLabel(openPlanProject)}</p>
              </div>
              <p className="text-[color:var(--foreground)]/72">{readinessNote(openPlanProject.status)}</p>
              <a
                href={`${openPlanProject.repoUrl}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] px-4 py-2 font-semibold hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
              >
                Issues / roadmap <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          ) : null}
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
              <span className="pill">Best fit</span>
              <h2 className="section-title mt-5 text-4xl text-[color:var(--ink)] md:text-5xl">
                Built for lean teams that need continuity, not software sprawl.
              </h2>
              <p className="mt-4 max-w-2xl text-[color:var(--foreground)]/80">
                OpenPlan is designed around real planning delivery rhythm: what is the project, what changed, what is blocked,
                what evidence supports the next move, and what still needs review.
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
                <li>• Do not imply AI replaces planning judgment.</li>
                <li>• Do not overstate data or mapping readiness.</li>
                <li>• Do not publish client confidential information in open repos.</li>
                <li>• Do not hide the fact that managed deployment/support is the paid path.</li>
              </ul>
              <p className="mt-5 rounded-2xl border border-[color:var(--pine)]/14 bg-white/70 px-4 py-4 text-sm text-[color:var(--foreground)]/78">
                Open-source is the trust model. Human-reviewed planning, careful implementation, and support remain the operating model.
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
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/62">Paid support is for</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">Teams that want the open-source base without carrying all the operations burden.</h2>
              <div className="mt-5 space-y-3">
                {managedSupportSignals.map((item) => (
                  <div key={item} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] px-4 py-4 text-sm text-[color:var(--foreground)]/82">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="xl" className="border-y border-[color:var(--line)] bg-[color:var(--fog)]/72">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">Managed OpenPlan support</span>
            <h2 className="section-title mt-5 text-4xl text-[color:var(--ink)] md:text-5xl">
              Use it free. Hire us when it needs to become your operating system.
            </h2>
            <p className="mt-4 text-[color:var(--foreground)]/80">
              The public code is the base. The paid work is deployment, custom configuration, data migration, permissions,
              onboarding, support, security patching, and keeping your fork moving with the mainline.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {implementationOffers.map((offer) => (
              <Card key={offer.name} className="border-[color:var(--line)] bg-[color:var(--background)] p-6">
                <div className="flex items-start gap-4">
                  <Wrench className="mt-1 h-5 w-5 shrink-0 text-[color:var(--pine)]" />
                  <div>
                    <h3 className="text-xl font-semibold text-[color:var(--ink)]">{offer.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]/76">{offer.summary}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">OpenPlan FAQ</span>
            <h2 className="section-title mt-5 text-4xl text-[color:var(--ink)] md:text-5xl">Straight answers before anyone commits.</h2>
            <p className="mt-4 max-w-3xl text-[color:var(--foreground)]/80">
              This page is designed to keep the OpenPlan offer clear: what it is, who it fits, what stage it is in, and how we talk about AI, mapping, support, and open source without bluffing.
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
            <h2 className="section-title mt-5 text-4xl text-[color:var(--ink)] dark:text-white md:text-5xl">
              Want OpenPlan without becoming the deployment team?
            </h2>
            <p className="mt-4 text-lg text-[color:var(--foreground)]/82 dark:text-white/80">
              We can run it, customize it, onboard your team, wire up your data, and keep the fork healthy while the open-source base keeps improving.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact/openplan-fit">Request managed setup</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[color:var(--line)] text-[color:var(--ink)] hover:border-[color:var(--pine)] hover:bg-[color:var(--background)] hover:text-[color:var(--pine)] dark:border-white/35 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
              >
                <a href={openPlanProject?.repoUrl ?? 'https://github.com/nfredmond/openplan'} target="_blank" rel="noopener noreferrer">
                  View GitHub repo
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
