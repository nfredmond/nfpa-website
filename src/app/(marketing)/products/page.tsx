import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, ExternalLink, GitFork, Handshake, PackageOpen, ShieldCheck, Wrench } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SectionEndCTA } from '@/components/features/section-end-cta'
import {
  implementationOffers,
  implementationPackages,
  licenseLabel,
  openSourceProjects,
  readinessLabel,
  readinessNote,
  sourceAvailabilityLabel,
} from '@/data/open-source-projects'

export const metadata: Metadata = {
  title: 'Products & Source Projects',
  description:
    'Browse selected Nat Ford planning, geospatial, aerial, modeling, operations, and AI products with source status and support options.',
}

const stats = [
  { label: 'Catalog posture', value: 'Selective + useful' },
  { label: 'Success metric', value: 'Adoption + deployments' },
  { label: 'Paid offer', value: 'Implementation + support' },
]

export default function ProductsPage() {
  return (
    <>
      <Section spacing="xl" className="hero-mesh text-white">
        <Container size="xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-end">
            <div className="max-w-4xl">
              <span className="pill border-white/20 bg-white/10 text-white">Product and source catalog</span>
              <h1 className="section-title mt-5 text-5xl leading-[0.94] text-white md:text-7xl">
                Not a product shelf. A set of building blocks.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/82">
                Nat Ford publishes and packages useful primitives for planning, GIS, drone data, modeling, AI workflows,
                business operations, and planner training. Use the public source where it is published. Hire us when you
                need deployment, customization, integration, onboarding, or a 24-hour response support lane.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/open-source">
                    Read the philosophy <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/35 text-white hover:border-white hover:text-white">
                  <Link href="/contact?topic=custom-software">Scope implementation support</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-2 rounded-2xl border border-white/18 bg-white/[0.06] p-4 backdrop-blur-sm">
              {stats.map((stat) => (
                <div key={stat.label} className="border-b border-white/12 px-2 py-3 last:border-b-0">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/62">{stat.label}</p>
                  <p className="mt-1.5 font-display text-2xl leading-tight text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="border-b border-[color:var(--line)] bg-[color:var(--fog)]/62">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            <Card className="p-6">
              <PackageOpen className="h-8 w-8 text-[color:var(--pine)]" />
              <h2 className="mt-4 text-2xl font-semibold text-[color:var(--ink)]">Inspectable where public</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]/76">
                Public repos let people and agents inspect the method, run the code, and adapt the tool without waiting on a sales call.
                Release-track products are labeled clearly instead of pretending every artifact is already public source.
              </p>
            </Card>
            <Card className="p-6">
              <GitFork className="h-8 w-8 text-[color:var(--pine)]" />
              <h2 className="mt-4 text-2xl font-semibold text-[color:var(--ink)]">Forkable by design</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]/76">
                We would rather see a useful custom fork than a brittle plugin system pretending every edge case is generic.
              </p>
            </Card>
            <Card className="p-6">
              <Wrench className="h-8 w-8 text-[color:var(--pine)]" />
              <h2 className="mt-4 text-2xl font-semibold text-[color:var(--ink)]">Supported when serious</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]/76">
                Paid work starts when uptime, governance, training, security, data migration, and custom workflows matter.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container size="xl">
          <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="pill">Selected catalog</span>
              <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
                Products Nat Ford is building on.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[color:var(--foreground)]/72">
              Repository pages are the source of truth when a public repo is available. Release-track and commercial-guide
              entries are labeled separately so the catalog stays useful without overstating source availability.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {openSourceProjects.map((project) => (
              <Card key={project.slug} id={project.slug} className="scroll-mt-28 p-0">
                <CardContent className="p-6 md:p-7">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground)]/58">
                        <span>{project.category}</span>
                        <span>{readinessLabel(project.status)}</span>
                        <span>{sourceAvailabilityLabel(project)}</span>
                      </div>
                      <h3 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{project.name}</h3>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] px-3.5 py-2 text-sm font-semibold transition hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
                        >
                          Demo <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      ) : null}
                      {project.repoUrl ? (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-[color:var(--pine)] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--pine-deep)]"
                        >
                          GitHub <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      ) : (
                        <Link
                          href="/contact?topic=custom-software"
                          className="inline-flex items-center justify-center rounded-full bg-[color:var(--pine)] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--pine-deep)]"
                        >
                          Discuss access <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      )}
                    </div>
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
                      <p className="mt-1 font-semibold text-[color:var(--ink)]">{project.contributionPath ?? 'Use GitHub issues / forks'}</p>
                    </div>
                    <p className="md:col-span-3 text-[0.82rem] leading-5 text-[color:var(--foreground)]/70">{readinessNote(project.status)}</p>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/58">
                        Useful primitives
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm text-[color:var(--foreground)]/78">
                        {project.primitives.map((primitive) => (
                          <li key={primitive}>• {primitive}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/58">
                        Hire Nat Ford for
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]/78">{project.paidSupport}</p>
                    </div>
                  </div>

                  <p className="mt-5 border-t border-[color:var(--line)] pt-4 text-xs leading-5 text-[color:var(--foreground)]/58">
                    {project.licenseNote}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.repoUrl ? (
                      <>
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full border border-[color:var(--line)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
                        >
                          Inspect repo <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </a>
                        <a
                          href={`${project.repoUrl}/fork`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full border border-[color:var(--line)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
                        >
                          Fork it <GitFork className="ml-1.5 h-3.5 w-3.5" />
                        </a>
                        <a
                          href={`${project.repoUrl}/issues`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full border border-[color:var(--line)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
                        >
                          Issues / roadmap <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </a>
                      </>
                    ) : (
                      <Link
                        href="/contact?topic=custom-software"
                        className="inline-flex items-center rounded-full border border-[color:var(--line)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
                      >
                        Discuss implementation <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="xl" className="border-y border-[color:var(--line)] bg-[color:var(--sand)]/38">
        <Container>
          <div className="mb-8 max-w-3xl">
            <span className="pill">Paid implementation offers</span>
            <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
              Free software still needs operators.
            </h2>
            <p className="mt-5 text-[color:var(--foreground)]/76">
              Most teams do not fail because the code was unavailable. They fail because nobody owned deployment,
              data quality, permissions, training, support, and the last-mile workflow. That is where we help. Engagements
              typically range from a $3.5K fit audit to $18K+ managed deployments and custom forks.
            </p>
          </div>

          <div className="mb-10 grid gap-4 lg:grid-cols-4">
            {implementationPackages.map((pkg) => (
              <Card key={pkg.name} className="p-5">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/58">Engagement package</p>
                <h3 className="mt-3 text-xl font-semibold text-[color:var(--ink)]">{pkg.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]/76">{pkg.bestFor}</p>
                <p className="mt-4 border-t border-[color:var(--line)] pt-3 text-sm font-semibold text-[color:var(--pine)]">{pkg.deliverable}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {implementationOffers.map((offer) => (
              <Card key={offer.name} className="p-6">
                <div className="flex items-start gap-4">
                  <Handshake className="mt-1 h-6 w-6 shrink-0 text-[color:var(--pine)]" />
                  <div>
                    <h3 className="text-2xl font-semibold text-[color:var(--ink)]">{offer.name}</h3>
                    <p className="mt-3 text-[color:var(--foreground)]/76">{offer.summary}</p>
                  </div>
                </div>
                <ul className="mt-5 grid gap-2 text-sm text-[color:var(--foreground)]/76 sm:grid-cols-2">
                  {offer.examples.map((example) => (
                    <li key={example} className="border-t border-[color:var(--line)] pt-2">{example}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#0f1720] text-white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/58">
                <ShieldCheck className="h-4 w-4 text-[color:var(--copper)]" />
                Security and confidentiality boundary
              </div>
              <h2 className="section-title mt-4 text-4xl text-white md:text-5xl">
                Open source is not an excuse to leak client work.
              </h2>
              <p className="mt-5 max-w-3xl text-white/76">
                We publish reusable code, public methods, schemas, templates, and demo data. We do not publish client
                confidential information, credentials, privileged internal operations, or sensitive deployment details.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact?topic=open-source-support">
                Talk about a supported deployment <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>

      <SectionEndCTA
        heading="Bring the open-source base. We will help make it operational."
        subhead="Start with a scoped implementation conversation for a custom fork, managed deployment, data migration, staff onboarding, or support agreement."
        primary={{ label: 'Request implementation support', href: '/contact?topic=open-source-support' }}
        secondary={{ label: 'Read the open-source position', href: '/open-source' }}
      />
    </>
  )
}
