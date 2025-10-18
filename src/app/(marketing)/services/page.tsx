/**
 * Services Overview Page
 */

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Grid } from '@/components/layout/grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Database, Plane, FileText, Sparkles, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Comprehensive planning, GIS, aerial mapping, grant writing, and AI-enabled documentation services for Northern California communities.',
}

const services = [
  {
    name: 'Urban & Transportation Planning',
    description: 'Regional Transportation Plans, Active Transportation Plans, VMT analysis, and carbon reduction programs.',
    icon: MapPin,
    href: '/services/planning',
    services: ['RTPs & ATPs', 'VMT & Carbon Reduction', 'Complete Streets', 'Speed & Safety Management']
  },
  {
    name: 'GIS & Spatial Analysis',
    description: 'PostGIS databases, interactive web mapping, and data-driven decision support tools.',
    icon: Database,
    href: '/services/gis',
    services: ['PostGIS Development', 'Interactive Maps', 'Suitability Analysis', 'Custom Dashboards']
  },
  {
    name: 'Aerial Mapping & Photogrammetry',
    description: 'Professional drone capture for orthomosaics, DEMs, 3D models, and site documentation.',
    icon: Plane,
    href: '/services/aerial',
    services: ['Orthomosaic Imagery', 'Digital Elevation Models', '3D Meshes', 'Progress Tracking']
  },
  {
    name: 'Funding & Grant Services',
    description: 'Grant identification, narrative development, and application assembly for FTA, ATP, CRP, and more.',
    icon: FileText,
    href: '/services/grants',
    services: ['Opportunity Scans', 'Narrative Development', 'Benefit-Cost Analysis', 'Application Assembly']
  },
  {
    name: 'AI-Enabled Documentation',
    description: 'Automated report builds, figure/table pipelines, and citation management for faster delivery.',
    icon: Sparkles,
    href: '/services/ai',
    services: ['Automated Reports', 'Figure/Table Generation', 'Literature Reviews', 'Document QA/QC']
  },
]

export default function ServicesPage() {
  return (
    <>
      <Section spacing="lg" className="bg-gradient-to-b from-[#F1F5F9] to-white">
        <Container size="lg">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
              Integrated Planning Services
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              From transportation planning to drone mapping, we combine technical expertise with 
              plain-English communication to deliver clear, fundable outcomes for Northern California communities.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.name} hover>
                  <CardHeader>
                    <div className="w-12 h-12 bg-[#1F4E2E] rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.services.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <ArrowRight className="w-4 h-4 text-[#D4A63F] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={service.href}>
                        Learn more <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </Grid>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#1F4E2E] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not sure where to start?
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Schedule a free 30-minute consultation to discuss your needs and explore how our integrated services can help.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

