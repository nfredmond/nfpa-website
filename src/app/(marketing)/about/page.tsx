import Link from 'next/link'
import { Award, Code2, Layers, Mail, MapPin } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Nathaniel Ford Redmond is a transportation planner and GIS practitioner based in Northern California and serving agencies across the United States.',
}

const expertise = [
  {
    icon: MapPin,
    title: 'Regional & Transportation Planning',
    items: ['RTP/ATP development', 'Complete streets design support', 'VMT and carbon reduction analysis', 'Community-facing implementation strategy'],
  },
  {
    icon: Layers,
    title: 'GIS & Spatial Analytics',
    items: ['PostGIS data systems', 'Interactive planning maps', 'Safety and accessibility diagnostics', 'Automated map/report pipelines'],
  },
  {
    icon: Code2,
    title: 'Funding & Grant Competitiveness',
    items: ['Program fit and positioning', 'Narrative development', 'Benefit-cost framing', 'Grant package execution support'],
  },
]

const priorEmployment = [
  {
    title: 'Senior Transportation Planner',
    employer: 'Green DOT Transportation Solutions',
    years: '2021–2025',
    highlights: [
      'Led and supported RTP/ATP planning across multiple Northern California counties',
      'Delivered VMT and carbon reduction integration work tied to implementable CIP pathways',
      'Contributed to numerous grant applications including ATP, RAISE, TIRCP, and PROTECT',
    ],
  },
  {
    title: 'Transportation Coordinator',
    employer: 'gRide (Genentech commuter program)',
    years: '2018–2021',
    highlights: [
      'Coordinated multimodal commuter services including early electric bus deployment',
      'Managed cross-system operations with transit, shuttle, ferry, and carpool components',
      'Supported coalition coordination and commuter performance reporting',
    ],
  },
  {
    title: 'Planning Intern',
    employer: 'San Francisco County Transportation Authority',
    years: '2017–2018',
    highlights: [
      'Supported ConnectSF and Vision Zero analysis and reporting',
      'Assisted with survey work, community workshops, and policy research',
      'Produced planning support materials for technical and public audiences',
    ],
  },
]

const counties = [
  'Sierra',
  'Plumas',
  'Tehama',
  'Del Norte',
  'Trinity',
  'Alpine',
  'Calaveras',
  'Colusa',
  'Siskiyou',
  'Shasta',
  'Butte',
  'Humboldt',
  'El Dorado',
  'Placer',
]

export default function AboutPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
            <div>
              <span className="pill">Founder Profile</span>
              <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Nathaniel Ford Redmond</h1>
              <p className="mt-5 text-lg text-white/85 max-w-3xl">
                Nathaniel is a transportation planner and GIS practitioner based in Northern California and serving
                agencies across the United States. His operating style is straightforward: clear assumptions,
                defensible methods, and recommendations that can actually be funded and delivered.
              </p>
              <p className="mt-4 text-base text-white/78 max-w-3xl">
                He combines planning discipline with technical systems — including spatial data engineering,
                automation, and product thinking — to reduce delivery friction from analysis through execution.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/contact">Book Intro Call</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/35 text-white hover:bg-white/10 hover:text-white">
                  <a href="https://linkedin.com/in/nfredmond" target="_blank" rel="noopener noreferrer">
                    View LinkedIn
                  </a>
                </Button>
              </div>
            </div>

            <Card className="bg-white/95">
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[color:var(--foreground)]/55">Base</p>
                  <p className="mt-1 font-semibold text-[color:var(--ink)]">Sierra Foothills · Near Grass Valley, CA</p>
                </div>
                <div className="h-px bg-[color:var(--line)]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[color:var(--foreground)]/55">Email</p>
                  <a className="mt-1 inline-block font-semibold text-[color:var(--pine)] hover:underline" href="mailto:nathaniel@natfordplanning.com">
                    nathaniel@natfordplanning.com
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[color:var(--foreground)]/55">Phone</p>
                  <p className="mt-1 font-semibold text-[color:var(--ink)]">530-492-9775</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[color:var(--foreground)]/55">Coverage</p>
                  <p className="mt-1 text-sm text-[color:var(--foreground)]/78">
                    Remote-first across the United States with in-person facilitation and field work when needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="max-w-3xl">
            <span className="pill">Core Capabilities</span>
            <h2 className="section-title mt-4 text-4xl md:text-5xl text-[color:var(--ink)]">Technical breadth, implementation discipline.</h2>
          </div>

          <div className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-5">
            {expertise.map((area) => {
              const Icon = area.icon
              return (
                <Card key={area.title} hover>
                  <CardContent className="p-6">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--sand)] text-[color:var(--pine)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-[color:var(--ink)]">{area.title}</h3>
                    <ul className="mt-3 space-y-2">
                      {area.items.map((item) => (
                        <li key={item} className="text-sm text-[color:var(--foreground)]/78">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="xl" className="bg-[color:var(--fog)]/65 border-y border-[color:var(--line)]">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">Background</span>
            <h2 className="section-title mt-4 text-4xl md:text-5xl text-[color:var(--ink)]">Prior roles that shaped the operating approach.</h2>
          </div>

          <div className="mt-8 space-y-4">
            {priorEmployment.map((role) => (
              <Card key={role.employer}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h3 className="text-2xl font-semibold text-[color:var(--ink)]">{role.title}</h3>
                      <p className="text-[color:var(--pine)] font-medium">{role.employer}</p>
                    </div>
                    <p className="text-sm font-semibold text-[color:var(--foreground)]/65">{role.years}</p>
                  </div>

                  <ul className="mt-4 space-y-2.5">
                    {role.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2.5 items-start text-sm text-[color:var(--foreground)]/78">
                        <Award className="mt-0.5 h-4 w-4 text-[color:var(--copper)] shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">Representative Regional Experience</span>
            <h2 className="section-title mt-4 text-4xl text-[color:var(--ink)]">Selected counties served in Northern California (experience base, now delivered nationwide).</h2>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {counties.map((county) => (
                <span
                  key={county}
                  className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--background)] px-3 py-1.5 text-sm text-[color:var(--foreground)]/85"
                >
                  {county} County
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="border-y border-[color:var(--line)] bg-[color:var(--fog)]/78 text-[color:var(--ink)] dark:bg-[#101c27] dark:text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-title text-4xl text-[color:var(--ink)] dark:text-white md:text-5xl">Need a planner who can execute, not just advise?</h2>
            <p className="mt-4 text-lg text-[color:var(--foreground)]/82 dark:text-white/80">Start with a focused intake and we’ll map the fastest credible path from analysis to implementation.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[color:var(--line)] text-[color:var(--ink)] hover:border-[color:var(--pine)] hover:bg-[color:var(--background)] hover:text-[color:var(--pine)] dark:border-white/35 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
              >
                <a href="mailto:nathaniel@natfordplanning.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
