import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Experience Archive',
  description:
    'Representative prior-employment project history demonstrating planning and GIS execution experience.',
}

const projects = [
  {
    title: 'Sierra County RTP',
    county: 'Sierra County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Transportation Planning', 'GIS Analysis', 'Funding Strategy'],
    description: 'Performance targets and fiscally constrained investment roadmap for a high-elevation rural county.',
  },
  {
    title: 'Del Norte County ATP',
    county: 'Del Norte County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Active Transportation', 'Safe Routes', 'Grant Writing'],
    description: 'Converted network gaps into phaseable ATP applications with stronger local support.',
  },
  {
    title: 'Tehama County VMT & CIP',
    county: 'Tehama County, CA',
    year: '2025',
    employer: 'Green DOT Transportation Solutions',
    services: ['Carbon Reduction', 'VMT Analysis', 'CIP Development'],
    description: 'Connected VMT-reducing strategies to realistic capital programming pathways.',
  },
  {
    title: 'Plumas Transit FTA 5339',
    county: 'Plumas County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Grant Writing', 'Transit Planning', 'Site Concepting'],
    description: 'Built grant narrative linking site feasibility, fleet transition, and public benefit outcomes.',
  },
  {
    title: 'Placer County MIAS',
    county: 'Placer County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Complete Streets', 'GIS Analysis', 'Prioritization'],
    description: 'Countywide multimodal screening with planning-level cost bands and packaging guidance.',
  },
  {
    title: 'El Dorado Next Gen Mobility',
    county: 'El Dorado County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Mobility Strategy', 'Transit & TDM', 'Data Storytelling'],
    description: 'Developed phased mobility program options with KPI and implementation structure.',
  },
]

export default function ProjectsPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">Experience Archive</span>
            <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Representative prior-employment project history.</h1>
            <p className="mt-5 text-lg text-white/82 max-w-3xl">
              This page is included for experience attribution and technical context. These items are not presented as Nat
              Ford LLC company portfolio projects.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--sand)]/45 p-4 text-sm text-[color:var(--foreground)]/82 max-w-4xl">
            <p>
              <span className="font-semibold text-[color:var(--ink)]">Attribution note:</span> Project work listed below
              was completed while Nathaniel was employed at Green DOT Transportation Solutions.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <Card key={`${project.title}-${project.year}`} hover>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/55">{project.county}</span>
                    <span className="text-xs font-semibold text-[color:var(--foreground)]/55">{project.year}</span>
                  </div>

                  <h2 className="text-2xl font-semibold text-[color:var(--ink)] leading-tight">{project.title}</h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[color:var(--pine)] font-semibold">Prior role: {project.employer}</p>
                  <p className="mt-3 text-sm text-[color:var(--foreground)]/78">{project.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.services.map((service) => (
                      <span
                        key={service}
                        className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--background)] px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--foreground)]/72"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#101c27] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title text-4xl md:text-5xl text-white">Explore current offerings</h2>
            <p className="mt-4 text-lg text-white/80">
              For current Nat Ford services and products, use the main service and product pages.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/services">View Services</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/35 text-white hover:bg-white/10 hover:text-white">
                <Link href="/products">View Products</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
