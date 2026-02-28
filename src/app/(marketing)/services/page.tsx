import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Database, FileText, MapPin, Plane, Sparkles } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Planning, GIS, funding strategy, and delivery automation services for agencies and consultancies operating in resource-constrained contexts.',
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

export default function ServicesPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">Service Portfolio</span>
            <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Integrated services built for real public-sector execution.</h1>
            <p className="mt-5 text-lg text-white/82 max-w-3xl">
              We combine planning, GIS, funding strategy, and production systems so agencies can make clear decisions and
              move projects forward with less rework.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/85">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-56 overflow-hidden rounded-2xl border border-[color:var(--line)]">
              <Image
                src="/images/site/workshop-maps.jpg"
                alt="Planning workshop maps and collaborative working session"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f2f]/55 via-transparent to-transparent" />
            </div>
            <div className="relative h-56 overflow-hidden rounded-2xl border border-[color:var(--line)]">
              <Image
                src="/images/site/mainstreet-aerial.jpg"
                alt="Aerial complete streets perspective in a U.S. small-town corridor"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f2f]/55 via-transparent to-transparent" />
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="grid grid-cols-1 gap-5">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.name} hover className="p-6 md:p-7">
                  <div className="grid grid-cols-1 lg:grid-cols-[0.78fr_0.22fr] gap-8">
                    <div>
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--sand)] text-[color:var(--pine)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-[color:var(--ink)]">{service.name}</h2>
                      <p className="mt-3 text-[1rem] text-[color:var(--foreground)]/78 max-w-3xl">{service.description}</p>

                      <ul className="mt-4 space-y-2.5">
                        {service.outcomes.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-[color:var(--foreground)]/75">
                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--copper)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex lg:justify-end lg:items-start">
                      <Button asChild variant="outline" className="w-full lg:w-auto">
                        <Link href={service.href}>View Service Detail</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[color:var(--sand)]/45 border-y border-[color:var(--line)]">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title text-4xl md:text-5xl text-[color:var(--ink)]">Not sure where to start?</h2>
            <p className="mt-4 text-lg text-[color:var(--foreground)]/82">
              Start with a 30-minute intake and we’ll recommend a scope that matches your timeline, budget, and decision risk.
            </p>
            <Button asChild size="lg" className="mt-7">
              <Link href="/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
