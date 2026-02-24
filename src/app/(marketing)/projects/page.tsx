import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Grid } from '@/components/layout/grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Experience Archive',
  description:
    'Representative prior-employment experience demonstrating planning and GIS capabilities. Not listed as Nat Ford Planning & Analysis company project portfolio.',
}

const projects = [
  {
    title: 'Sierra County RTP',
    county: 'Sierra County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Transportation Planning', 'GIS Analysis', 'Funding Strategy'],
    description:
      'Data-driven performance targets and fiscally constrained investment roadmap for a high-elevation rural county.',
  },
  {
    title: 'Del Norte County ATP',
    county: 'Del Norte County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Active Transportation', 'Safe Routes', 'Grant Writing'],
    description:
      'Converted coastal network gaps into competitive, phaseable ATP applications with community support.',
  },
  {
    title: 'Tehama County VMT & CIP',
    county: 'Tehama County, CA',
    year: '2025',
    employer: 'Green DOT Transportation Solutions',
    services: ['Carbon Reduction', 'VMT Analysis', 'CIP Development'],
    description:
      'Connected VMT-reducing strategies to a realistic Capital Improvement Program with measurable outcomes.',
  },
  {
    title: 'Plumas Transit FTA 5339',
    county: 'Plumas County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Grant Writing', 'Transit Planning', 'Site Concepting'],
    description:
      'Built 5339 narrative connecting site feasibility, fleet transition, and community benefits.',
  },
  {
    title: 'Placer County MIAS',
    county: 'Placer County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Complete Streets', 'GIS Analysis', 'Project Prioritization'],
    description:
      'Screened multimodal corridors countywide with planning-level cost bands and project packaging.',
  },
  {
    title: 'El Dorado Next Gen Mobility',
    county: 'El Dorado County, CA',
    year: '2024',
    employer: 'Green DOT Transportation Solutions',
    services: ['Mobility Strategy', 'Transit & TDM', 'Data Storytelling'],
    description: 'Developed near-term mobility programs with KPI framework and phased implementation.',
  },
]

export default function ProjectsPage() {
  return (
    <>
      <Section spacing="lg" className="bg-gradient-to-b from-[#F1F5F9] to-white dark:from-gray-900 dark:to-gray-950">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-6 leading-tight">
              Experience Archive
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Prior-employment work history demonstrating Nathaniel’s technical planning and delivery experience.
            </p>
            <div className="bg-white dark:bg-gray-800 border border-[#D4A63F] dark:border-amber-500 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 text-left max-w-3xl mx-auto">
              <p className="font-medium text-[#0F172A] dark:text-white mb-2">Attribution Clarification</p>
              <p>
                The projects on this page were completed by Nathaniel while employed at Green DOT Transportation Solutions.
                They are shown as experience history and are not presented as Nat Ford Planning & Analysis company portfolio projects.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
            {projects.map((project) => (
              <Card key={`${project.title}-${project.year}`} hover>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-[#D4A63F] font-medium">{project.county}</div>
                    <div className="text-sm text-gray-500">{project.year}</div>
                  </div>
                  <div className="mb-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                    Prior role: {project.employer}
                  </div>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#1F4E2E] dark:bg-green-900 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore current offerings</h2>
            <p className="text-lg text-gray-200 dark:text-gray-300 mb-8">
              For current Nat Ford Planning & Analysis offerings, see Services and Products.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/services">View Services</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#1F4E2E]">
                <Link href="/products">View Products</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
