/**
 * Projects Overview Page
 */

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Grid } from '@/components/layout/grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects & Case Studies',
  description: 'Real-world planning, GIS, and grant projects across Northern California counties.',
}

const projects = [
  {
    title: 'Sierra County RTP',
    slug: 'sierra-rtp',
    county: 'Sierra County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Transportation Planning', 'GIS Analysis', 'Funding Strategy'],
    description: 'Data-driven performance targets and fiscally constrained investment roadmap for a high-elevation rural county.',
    metrics: ['10-year roadmap', 'Grant-ready projects', 'Cross-agency coordination'],
    priorRole: true,
  },
  {
    title: 'Del Norte County ATP',
    slug: 'del-norte-atp',
    county: 'Del Norte County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Active Transportation', 'Safe Routes', 'Grant Writing'],
    description: 'Converted coastal network gaps into competitive, phaseable ATP applications with community support.',
    metrics: ['Multi-cycle applications', 'School access focus', 'Coastal trail segments'],
    priorRole: true,
  },
  {
    title: 'Tehama County VMT & CIP',
    slug: 'tehama-vmt',
    county: 'Tehama County, CA',
    year: '2025',
    employer: 'Green DOT Transportation Solutions',
    services: ['Carbon Reduction', 'VMT Analysis', 'CIP Development'],
    description: 'Connected VMT-reducing strategies to a realistic Capital Improvement Program with measurable outcomes.',
    metrics: ['Countywide VMT screens', 'Prioritized CIP', 'Board-ready tables'],
    priorRole: true,
  },
  {
    title: 'Plumas Transit FTA 5339',
    slug: 'plumas-transit',
    county: 'Plumas County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Grant Writing', 'Transit Planning', 'Site Concepting'],
    description: 'Built compelling 5339 narrative connecting site feasibility, fleet transition, and community benefits.',
    metrics: ['Operations hub concept', 'EV charging strategy', 'Competitive submission'],
    priorRole: true,
  },
  {
    title: 'Placer County MIAS',
    slug: 'placer-mias',
    county: 'Placer County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Complete Streets', 'GIS Analysis', 'Project Prioritization'],
    description: 'Multimodal Infrastructure & Access Study screening corridors countywide with planning-level cost bands.',
    metrics: ['Multimodal corridors screened', 'Priority projects packaged', 'Data-driven treatments'],
    priorRole: true,
  },
  {
    title: 'El Dorado Next Gen Mobility',
    slug: 'el-dorado-nextgen',
    county: 'El Dorado County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Mobility Strategy', 'Transit & TDM', 'Data Storytelling'],
    description: 'Menu of near-term mobility programs with measurable outcomes and phasing tied to funding cycles.',
    metrics: ['Program menu developed', 'KPI framework', 'Phased implementation'],
    priorRole: true,
  },
  {
    title: 'Tehama County EVAC Routing',
    slug: 'tehama-evac',
    county: 'Tehama County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Emergency Planning', 'GIS Routing', 'Public Communication'],
    description: 'Evacuation zones and routing logic for wildfire and flood scenarios with public-facing graphics.',
    metrics: ['Zone maps developed', 'Scenario routing', 'Public playbooks'],
    priorRole: true,
  },
]

export default function ProjectsPage() {
  return (
    <>
      <Section spacing="lg" className="bg-gradient-to-b from-[#F1F5F9] to-white dark:from-gray-900 dark:to-gray-950">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-6 leading-tight">
              Projects & Case Studies
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Real-world planning, GIS, and grant projects across Northern California's rural counties
            </p>
            <div className="bg-white dark:bg-gray-800 border border-[#D4A63F] dark:border-amber-500 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 text-left max-w-3xl mx-auto">
              <p className="font-medium text-[#0F172A] dark:text-white mb-2">Attribution Policy</p>
              <p>
                Company portfolio includes work performed by Nat Ford Planning & Analysis. Projects completed by Nathaniel 
                in prior employment are clearly labeled below and described in detail on the{' '}
                <Link href="/about" className="text-[#1F4E2E] dark:text-green-400 hover:underline font-medium">About page</Link>.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-2">Representative Work (Prior Employment)</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Projects completed by Nathaniel while employed at {projects[0].employer} (2021–2025).
              These showcase technical capabilities and planning expertise.
            </p>
          </div>
          
          <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
            {projects.map((project) => (
              <Card key={project.slug} hover>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-[#D4A63F] font-medium">{project.county}</div>
                    <div className="text-sm text-gray-500">{project.year}</div>
                  </div>
                  {project.priorRole && (
                    <div className="mb-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                      Prior role: {project.employer}
                    </div>
                  )}
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((service) => (
                        <span 
                          key={service}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#F1F5F9] text-[#0F172A]"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.metrics.map((metric) => (
                        <span 
                          key={metric}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-gray-600 border border-gray-200"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/projects/${project.slug}`}>
                      View case study <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#1F4E2E] dark:bg-green-900 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to start your project?
            </h2>
            <p className="text-lg text-gray-200 dark:text-gray-300 mb-8">
              Schedule a free consultation to discuss your community's needs and explore how we can help.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

