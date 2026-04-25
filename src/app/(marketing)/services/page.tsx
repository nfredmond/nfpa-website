import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Code2, Database, FileText, MapPin, Plane, Sparkles } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionEndCTA } from '@/components/features/section-end-cta'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Planning, GIS, funding strategy, open-source software deployment, and custom software development for agencies, consultancies, and companies with real workflow problems.'
}

const services = [
  {
    name: 'Urban & Transportation Planning',
    description:
      'RTPs, ATPs, corridor strategy, and board-ready planning packages grounded in local implementation realities.',
    icon: MapPin,
    href: '/services/planning',
    outcomes: [
      'Clear project prioritization tied to constraints',
      'Defensible analysis narratives for public review',
      'Implementation-ready scope and phasing guidance',
    ],
  },
  {
    name: 'GIS & Spatial Analysis',
    description:
      'Spatial data systems, map products, and diagnostics that turn fragmented data into decision-ready intelligence.',
    icon: Database,
    href: '/services/gis',
    outcomes: [
      'PostGIS-backed reproducible workflows',
      'Hotspot and accessibility mapping that withstands scrutiny',
      'Production-friendly map exports for reports and presentations',
    ],
  },
  {
    name: 'Aerial Mapping & Photogrammetry',
    description:
      'FAA-certified capture and geospatial outputs for corridor, site, and asset-level understanding.',
    icon: Plane,
    href: '/services/aerial',
    outcomes: [
      'Orthomosaics and terrain products for planning context',
      'Faster field-to-analysis turnaround',
      'Visual evidence packages for stakeholder alignment',
    ],
  },
  {
    name: 'Funding & Grant Services',
    description:
      'Opportunity fit, scoring-aware narratives, and grant package assembly to increase competitiveness.',
    icon: FileText,
    href: '/services/grants',
    outcomes: [
      'Program alignment and timing clarity',
      'Stronger benefit framing with cleaner logic chains',
      'Submission-ready package discipline',
    ],
  },
  {
    name: 'Open-Source & Custom Software',
    description:
      'Open-source project deployment, custom internal tools, AI workflows, dashboards, portals, automations, and supported company-specific forks.',
    icon: Code2,
    href: '/open-source',
    outcomes: [
      'Free code with paid implementation support',
      'Custom forks, hosting, onboarding, and support',
      'Software for planning teams and non-planning companies alike',
    ],
  },
  {
    name: 'AI-Enabled Documentation',
    description:
      'Automation for report drafting, table/figure generation, and QA with human-reviewed outputs.',
    icon: Sparkles,
    href: '/services/ai',
    outcomes: [
      'Shorter production cycles without quality loss',
      'Methods and assumptions clarity in final documents',
      'Reduced formatting and revision churn',
    ],
  },
]

const capabilityMatrix = [
  { label: 'Planning', value: 'RTP · ATP · Corridor' },
  { label: 'Data', value: 'PostGIS · QA · Maps' },
  { label: 'Field', value: 'Drone · Ortho · DSM' },
  { label: 'Funding', value: 'Fit · Scoring · Package' },
  { label: 'Software', value: 'Open source · AI · Apps' },
]

export default function ServicesPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.85fr)] lg:items-end">
            <div className="max-w-3xl">
              <span className="pill">Service Portfolio</span>
              <h1 className="section-title mt-5 text-5xl leading-[0.94] text-white md:text-6xl">
                Integrated services built for real{' '}
                <span className="text-[color:var(--copper)]">public-sector execution</span>.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-white/82">
                Planning, GIS, funding strategy, open-source software support, and custom software development — combined so agencies and companies can make clear decisions, automate real workflows, and move work forward with less rework.
              </p>
            </div>

            <div className="rounded-2xl border border-white/18 bg-white/[0.06] p-5 backdrop-blur-sm">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/70">
                Capability coverage
              </p>
              <dl className="mt-4 space-y-2.5">
                {capabilityMatrix.map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-white/72">{item.label}</dt>
                    <dd className="text-right text-sm text-white/88">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/85">
        <Container>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <figure className="relative h-60 overflow-hidden rounded-2xl border border-[color:var(--line)]">
              <Image
                src="/images/site/drone-intersection-topdown-2026-03.jpg"
                alt="Top-down drone capture of a civic intersection used for lane and safety analysis"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f2f]/70 via-[#0f1f2f]/20 to-transparent" />
              <figcaption className="absolute bottom-3 left-4 right-4 text-xs font-medium uppercase tracking-[0.12em] text-white/90">
                Top-down capture · lane & safety analysis
              </figcaption>
            </figure>
            <figure className="relative h-60 overflow-hidden rounded-2xl border border-[color:var(--line)]">
              <Image
                src="/images/site/drone-town-overview-2026-03.jpg"
                alt="Oblique drone overview of a small-town street network and surrounding valley context"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f2f]/70 via-[#0f1f2f]/20 to-transparent" />
              <figcaption className="absolute bottom-3 left-4 right-4 text-xs font-medium uppercase tracking-[0.12em] text-white/90">
                Oblique overview · corridor & context
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="mb-10 max-w-3xl">
            <span className="pill">Six integrated lanes</span>
            <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)] md:text-5xl">
              Each service stands alone. Together, they compress the delivery cycle.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {services.map((service, index) => {
              const Icon = service.icon
              const num = String(index + 1).padStart(2, '0')
              return (
                <Card key={service.name} hover className="overflow-hidden p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,0.82fr)_auto]">
                    <div className="flex items-center justify-center border-b border-[color:var(--line)] bg-[color:var(--sand)]/45 px-5 py-4 lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
                      <span className="font-display text-3xl font-semibold text-[color:var(--pine)]">{num}</span>
                    </div>

                    <div className="border-b border-[color:var(--line)] p-6 lg:border-b-0 lg:border-r lg:p-7">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--sand)] text-[color:var(--pine)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-[color:var(--ink)] md:text-[1.7rem]">
                        {service.name}
                      </h3>
                      <p className="mt-2.5 max-w-xl text-[1rem] text-[color:var(--foreground)]/78">
                        {service.description}
                      </p>
                    </div>

                    <div className="border-b border-[color:var(--line)] p-6 lg:border-b-0 lg:border-r lg:p-7">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--foreground)]/58">
                        Typical outcomes
                      </p>
                      <ul className="mt-3 space-y-2">
                        {service.outcomes.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-[color:var(--foreground)]/80"
                          >
                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--copper)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center p-6 lg:p-7">
                      <Button asChild variant="outline" className="w-full whitespace-nowrap lg:w-auto">
                        <Link href={service.href}>
                          View Overview
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      <SectionEndCTA
        heading="Not sure where to start?"
        subhead="Start with a 30-minute intake and we’ll recommend a scope that matches your timeline, budget, and decision risk."
        primary={{ href: '/contact', label: 'Schedule Consultation' }}
      />
    </>
  )
}
