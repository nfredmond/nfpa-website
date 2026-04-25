import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Code2, ExternalLink, GitFork, Landmark, Lock, ShieldCheck, Wrench } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  implementationOffers,
  implementationPackages,
  licenseLabel,
  openSourceProjects,
  readinessLabel,
  readinessNote,
} from '@/data/open-source-projects'

export const metadata: Metadata = {
  title: 'Open Source',
  description:
    'Nat Ford builds free and open-source planning, geospatial, aerial, modeling, and operations software — then helps teams deploy, customize, and support it.',
}

const principles = [
  {
    title: 'Open beats locked-in',
    body: 'If public-interest software matters, people should be able to inspect it, fork it, run it, and improve it without waiting for a vendor roadmap.',
    icon: GitFork,
  },
  {
    title: 'Primitives beat monoliths',
    body: 'AI agents are increasingly good at gluing together proven building blocks. The useful unit is often the component, schema, workflow, or package — not the giant closed app.',
    icon: Code2,
  },
  {
    title: 'Services fund stewardship',
    body: 'The code can be free. The hard work is deployment, security, data cleanup, integrations, onboarding, support, and keeping a custom fork healthy over time.',
    icon: Wrench,
  },
  {
    title: 'Transparency is a civic feature',
    body: 'For agencies, tribes, counties, and public-facing work, reusable source code can reduce duplicate spending and make methods easier to verify.',
    icon: Landmark,
  },
]

const manifesto = [
  'Most organizations do not need another black-box subscription. They need software they can inspect, adapt, and keep using when their workflow gets weird.',
  'The future is not one perfect app with every possible feature. The future is a strong spine of open tools, clear primitives, and local adaptations that agents and people can extend.',
  'Fork count matters. Reuse matters. A tool that gets copied, modified, and deployed in strange places is doing its job.',
  'Nat Ford will make money by being excellent stewards: setup, custom versions, hosting, support, training, integrations, and planning expertise — not by hiding useful code behind a tollbooth.',
]

const featuredOpenSourceProjects = openSourceProjects.filter((project) =>
  ['openplan', 'opengeo', 'aerial-intel-platform', 'clawmodeler', 'nat-ford-website'].includes(project.slug)
)

export default function OpenSourcePage() {
  return (
    <>
      <Section spacing="xl" className="hero-mesh text-white">
        <Container size="xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-end">
            <div className="max-w-4xl">
              <span className="pill border-white/20 bg-white/10 text-white">Open-source by default</span>
              <h1 className="section-title mt-6 text-5xl leading-[0.94] text-white md:text-7xl">
                Free code. Serious implementation.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/82 md:text-xl">
                Nat Ford builds open-source planning, geospatial, aerial, modeling, and operations software. The tools
                are meant to be inspected, forked, customized, and run by agencies, companies, developers, and AI agents.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="#projects">
                    Browse featured projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/35 text-white hover:border-white hover:text-white">
                  <Link href="/contact?topic=open-source-support">Get deployment support</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/16 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-sm">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/58">Commercial model</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">The code is free. The operating help is paid.</h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-white/78">
                <li>• Custom forks and company-specific versions.</li>
                <li>• Hosted administration, monitoring, release management, and support.</li>
                <li>• Enterprise SSO, roles, access control, and staff training.</li>
                <li>• Planning, GIS, data, AI, and software implementation for real workflows.</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="border-b border-[color:var(--line)] bg-[color:var(--fog)]/60">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => {
              const Icon = principle.icon
              return (
                <Card key={principle.title} className="p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--pine)] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-[color:var(--ink)]">{principle.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]/76">{principle.body}</p>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
            <div>
              <span className="pill">What we believe</span>
              <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
                Strong opinions, plainly stated.
              </h2>
              <p className="mt-5 text-[color:var(--foreground)]/76">
                This is the working doctrine behind the website rebuild and the product roadmap.
              </p>
            </div>
            <div className="divide-y divide-[color:var(--line)] rounded-[2rem] border border-[color:var(--line)] bg-white/70 dark:bg-white/[0.03]">
              {manifesto.map((item, index) => (
                <div key={item} className="grid gap-4 p-6 md:grid-cols-[3.5rem_1fr] md:p-7">
                  <div className="font-display text-3xl text-[color:var(--copper)]">{String(index + 1).padStart(2, '0')}</div>
                  <p className="text-lg leading-8 text-[color:var(--foreground)]/82">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="projects" spacing="xl" className="border-y border-[color:var(--line)] bg-[color:var(--sand)]/38">
        <Container size="xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="pill">Featured public projects</span>
              <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
                Building blocks worth forking.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[color:var(--foreground)]/72">
              Featured active surfaces are shown here. The full catalog, including research lineage and archive projects,
              lives on the project directory.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {featuredOpenSourceProjects.map((project) => (
              <Card key={project.slug} id={project.slug} className="scroll-mt-28 p-0">
                <CardContent className="p-6 md:p-7">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground)]/58">
                        <span>{project.category}</span>
                        <span>{readinessLabel(project.status)}</span>
                      </div>
                      <h3 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{project.name}</h3>
                    </div>
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center rounded-full border border-[color:var(--line)] px-3.5 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
                    >
                      GitHub <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </div>

                  <p className="mt-4 text-[0.98rem] leading-7 text-[color:var(--foreground)]/78">{project.summary}</p>

                  <div className="mt-5 grid gap-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--fog)]/42 p-4 text-sm md:grid-cols-3">
                    <div>
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/55">Readiness</p>
                      <p className="mt-1 font-semibold text-[color:var(--ink)]">{readinessLabel(project.status)}</p>
                    </div>
                    <div>
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/55">License</p>
                      <p className="mt-1 font-semibold text-[color:var(--ink)]">{licenseLabel(project)}</p>
                    </div>
                    <div>
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/55">Contribution path</p>
                      <p className="mt-1 font-semibold text-[color:var(--ink)]">Issues / forks / pull requests</p>
                    </div>
                    <p className="md:col-span-3 text-[0.82rem] leading-5 text-[color:var(--foreground)]/70">{readinessNote(project.status)}</p>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/58">
                        Open primitives
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm text-[color:var(--foreground)]/78">
                        {project.primitives.map((primitive) => (
                          <li key={primitive}>• {primitive}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/58">
                        Paid support
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]/78">{project.paidSupport}</p>
                    </div>
                  </div>

                  <p className="mt-5 border-t border-[color:var(--line)] pt-4 text-xs leading-5 text-[color:var(--foreground)]/58">
                    {project.licenseNote}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-[color:var(--line)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
                    >
                      Inspect repo <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                    <a
                      href={`${project.repoUrl}/issues`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-[color:var(--line)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
                    >
                      Issues / roadmap <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/products">
                View full project directory <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="mb-8 max-w-3xl">
            <span className="pill">How Nat Ford gets paid</span>
            <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
              We sell outcomes around the open tools.
            </h2>
            <p className="mt-5 text-[color:var(--foreground)]/76">
              Open source is not charity theater. It is a better adoption strategy and a better trust model. The paid
              work is the part most organizations actually need help with. Engagements typically range from a $3.5K fit
              audit to $18K+ managed deployments and custom forks.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {implementationOffers.map((offer) => (
              <Card key={offer.name} className="p-6">
                <h3 className="text-2xl font-semibold text-[color:var(--ink)]">{offer.name}</h3>
                <p className="mt-3 text-[color:var(--foreground)]/76">{offer.summary}</p>
                <ul className="mt-5 grid gap-2 text-sm text-[color:var(--foreground)]/76 sm:grid-cols-2">
                  {offer.examples.map((example) => (
                    <li key={example} className="border-t border-[color:var(--line)] pt-2">{example}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--fog)]/45 p-6 md:p-8">
            <div className="max-w-3xl">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground)]/58">How to engage</p>
              <h3 className="mt-3 text-3xl font-semibold text-[color:var(--ink)]">Choose the smallest responsible support lane.</h3>
              <p className="mt-3 text-[color:var(--foreground)]/76">
                Open-source work should not force a giant procurement step. Start with the support shape that matches the risk.
              </p>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-4">
              {implementationPackages.map((pkg) => (
                <div key={pkg.name} className="rounded-2xl border border-[color:var(--line)] bg-white/70 p-5 dark:bg-white/[0.03]">
                  <h4 className="text-lg font-semibold text-[color:var(--ink)]">{pkg.name}</h4>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]/74">{pkg.deliverable}</p>
                  <ul className="mt-4 space-y-1.5 text-xs leading-5 text-[color:var(--foreground)]/66">
                    {pkg.includes.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#0f1720] text-white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/58">
                <ShieldCheck className="h-4 w-4 text-[color:var(--copper)]" />
                Open does not mean careless
              </div>
              <h2 className="section-title mt-4 text-4xl text-white md:text-5xl">We publish the reusable parts. We protect the sensitive parts.</h2>
              <p className="mt-5 max-w-3xl text-white/76">
                Client data, credentials, confidential deliverables, and security-sensitive deployment details stay protected.
                Reusable code, schemas, templates, demo data, public methods, and documentation belong in the open whenever practical.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/16 bg-white/[0.06] p-6">
              <Lock className="h-8 w-8 text-[color:var(--copper)]" />
              <p className="mt-4 text-lg font-semibold">Trust comes from both transparency and discretion.</p>
              <p className="mt-3 text-sm leading-6 text-white/68">
                The operating rule is simple: open the building blocks; never leak people’s actual stuff.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
