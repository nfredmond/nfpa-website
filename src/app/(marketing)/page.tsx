import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Code2,
  Database,
  ExternalLink,
  FileText,
  GitFork,
  Landmark,
  MapPin,
  Plane,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import JsonLd from '@/components/features/json-ld'
import { PlannerChatbot } from '@/components/features/planner-chatbot'
import organizationData from '@/data/organization.json'
import servicesData from '@/data/services.json'
import projectsData from '@/data/projects.json'
import { implementationOffers, openSourceProjects } from '@/data/open-source-projects'

const planningServices = [
  {
    name: 'Transportation planning',
    description: 'RTPs, ATPs, VMT analysis, corridor strategy, implementation plans, and board-ready decision materials.',
    icon: MapPin,
    href: '/services/planning',
  },
  {
    name: 'GIS, data, and modeling',
    description: 'PostGIS, QGIS, web maps, data pipelines, scenario analysis, and local-first modeling workflows.',
    icon: Database,
    href: '/services/gis',
  },
  {
    name: 'Aerial intelligence',
    description: 'Drone mapping, photogrammetry, mission workflows, orthomosaics, terrain models, and site intelligence.',
    icon: Plane,
    href: '/services/aerial',
  },
  {
    name: 'Grants and implementation',
    description: 'Funding strategy, grant narratives, readiness reviews, scope packaging, and delivery support.',
    icon: FileText,
    href: '/services/grants',
  },
]

const softwareServices = [
  {
    name: 'Custom internal software',
    description: 'Dashboards, portals, CRMs, workflow tools, reporting systems, and automation for any company with a real process problem.',
    icon: Code2,
  },
  {
    name: 'Open-source deployment',
    description: 'We install, configure, host, monitor, and administer open tools so your team can use them without becoming maintainers overnight.',
    icon: Wrench,
  },
  {
    name: 'AI agent workflows',
    description: 'Agent-ready documentation, local CI loops, QA traces, source-cited outputs, and editable deliverable packages.',
    icon: Bot,
  },
]

const openSourceBeliefs = [
  'Open code earns trust faster than a sales deck.',
  'Agents prefer tools they can install, fork, inspect, and glue together.',
  'The moat is stewardship: implementation, support, taste, domain knowledge, and keeping custom forks healthy.',
  'For public-sector work, reusable code and open methods reduce duplicate spending and improve accountability.',
]

const proofStats = [
  { label: 'Public repos', value: `${openSourceProjects.length}+` },
  { label: 'Company model', value: 'Free code + paid stewardship' },
  { label: 'Core domains', value: 'Planning, GIS, aerial, AI, ops' },
]

export default function HomePage() {
  const featuredProjects = openSourceProjects.slice(0, 4)

  return (
    <>
      <JsonLd data={organizationData} />
      <JsonLd data={servicesData} />
      <JsonLd data={projectsData} />

      <Section spacing="xl" className="hero-mesh-light nf-topography text-[color:var(--ink)] dark:text-white">
        <Container size="xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div className="max-w-4xl">
              <div className="nf-kicker">
                <span>Nat Ford Planning &amp; Analysis</span>
                <span>Open-source planning, GIS, AI, and operations software</span>
              </div>

              <h1 className="section-title mt-7 text-5xl leading-[0.94] text-[color:var(--ink)] dark:text-white sm:text-6xl lg:text-[5.45rem]">
                Free software. Custom implementation. Serious planning work.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[color:var(--foreground)]/82 dark:text-white/85 sm:text-xl">
                Nat Ford builds free and open-source tools for transportation planning, geospatial analysis, drone mapping,
                modeling, and business operations. We make money by helping agencies and companies deploy, customize,
                administer, and support the software when the work has to hold up in public.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/open-source">
                    Read the open-source position <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/products">Browse public projects</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link href="/contact?topic=custom-software">Scope custom software</Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-3 md:grid-cols-3">
                {proofStats.map((stat) => (
                  <div key={stat.label} className="nf-proof-strip">
                    <span className="block text-[0.66rem] uppercase tracking-[0.16em] text-[color:var(--foreground)]/58 dark:text-white/54">
                      {stat.label}
                    </span>
                    <span className="mt-1 block text-[0.95rem] font-semibold text-[color:var(--ink)] dark:text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="nf-ops-board float-slow">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground)]/60 dark:text-white/55">
                    Operating model
                  </p>
                  <h2 className="section-title mt-3 text-3xl text-[color:var(--ink)] dark:text-white sm:text-[2.3rem]">
                    Open the primitives. Charge for stewardship.
                  </h2>
                </div>

                <div className="nf-brand-plaque hidden sm:flex">
                  <Image
                    src="/logos/nf-monogram-square-light.png"
                    alt="Nat Ford monogram"
                    width={512}
                    height={512}
                    className="block h-14 w-14 dark:hidden"
                  />
                  <Image
                    src="/logos/nf-monogram-square-dark.png"
                    alt=""
                    aria-hidden="true"
                    width={512}
                    height={512}
                    className="hidden h-14 w-14 dark:block"
                  />
                </div>
              </div>

              <div className="mt-6 relative h-44 w-full overflow-hidden rounded-[1.75rem] border border-[color:var(--line)]/80">
                <Image
                  src="/images/site/drone-corridor-valley-2026-03.jpg"
                  alt="Drone view of a rural valley corridor and arterial roadway used for mobility planning analysis"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,32,0.04),rgba(15,23,32,0.74))]" />
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/78">Planning + software</p>
                  <p className="mt-1 text-xl font-semibold text-white">Field evidence, open tools, practical delivery.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {openSourceBeliefs.map((belief) => (
                  <div key={belief} className="flex gap-3 border-t border-[color:var(--line)] pt-3 text-sm leading-6 text-[color:var(--foreground)]/76 dark:text-white/72">
                    <GitFork className="mt-1 h-4 w-4 shrink-0 text-[color:var(--copper)]" />
                    <span>{belief}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="border-y border-[color:var(--line)] bg-[color:var(--fog)]/60">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {softwareServices.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.name} className="p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--pine)] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold text-[color:var(--ink)]">{service.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]/76">{service.description}</p>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container size="xl">
          <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="pill">Public open-source work</span>
              <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
                Projects you can inspect, fork, and build on.
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">
                View full project directory <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {featuredProjects.map((project) => (
              <Card key={project.slug} hover className="p-0">
                <CardContent className="p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground)]/58">
                        {project.category} · {project.status}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{project.name}</h3>
                    </div>
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center rounded-full border border-[color:var(--line)] px-3 py-1.5 text-sm font-semibold hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
                    >
                      GitHub <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                  <p className="mt-4 text-[0.98rem] leading-7 text-[color:var(--foreground)]/78">{project.summary}</p>
                  <p className="mt-5 border-t border-[color:var(--line)] pt-4 text-sm leading-6 text-[color:var(--foreground)]/70">
                    <span className="font-semibold text-[color:var(--ink)]">Paid support:</span> {project.paidSupport}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="xl" className="border-y border-[color:var(--line)] bg-[color:var(--sand)]/38">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
            <div>
              <span className="pill">Implementation services</span>
              <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
                Use the free tools. Hire us when it needs to run.
              </h2>
              <p className="mt-5 text-[color:var(--foreground)]/76">
                This is the business model: open-source adoption, paid operations. Less tollbooth, more trail crew.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {implementationOffers.map((offer) => (
                <Card key={offer.name} className="p-5">
                  <h3 className="text-xl font-semibold text-[color:var(--ink)]">{offer.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]/76">{offer.summary}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="mb-8 max-w-3xl">
            <span className="pill">Planning services still matter</span>
            <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
              Software does not replace planning judgment.
            </h2>
            <p className="mt-5 text-[color:var(--foreground)]/76">
              Nat Ford still does the planning work: rural transportation plans, active transportation plans, grant packages,
              VMT analysis, GIS, field review, and board-ready documentation. The software makes the work more reusable,
              auditable, and faster to adapt.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {planningServices.map((service) => {
              const Icon = service.icon
              return (
                <Link key={service.name} href={service.href} className="group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pine)]">
                  <Card hover className="h-full p-6">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--pine)] text-white transition group-hover:bg-[color:var(--pine-deep)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-[color:var(--ink)]">{service.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]/76">{service.description}</p>
                  </Card>
                </Link>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#0f1720] text-white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.52fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/58">
                <ShieldCheck className="h-4 w-4 text-[color:var(--copper)]" />
                Open-source, not reckless
              </div>
              <h2 className="section-title mt-4 text-4xl text-white md:text-5xl">
                We open the building blocks. We protect the client work.
              </h2>
              <p className="mt-5 max-w-3xl text-white/76">
                Public code, demo data, schemas, templates, and methods can create shared value. Client data, credentials,
                confidential deliverables, and security-sensitive deployment details stay protected. That line is not fuzzy.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/16 bg-white/[0.06] p-6">
              <Landmark className="h-8 w-8 text-[color:var(--copper)]" />
              <p className="mt-4 text-lg font-semibold">Public-sector technology should be reusable.</p>
              <p className="mt-3 text-sm leading-6 text-white/68">
                Agencies should not pay repeatedly for the same invisible code when open methods and shared tools can do the job better.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <PlannerChatbot />
    </>
  )
}
