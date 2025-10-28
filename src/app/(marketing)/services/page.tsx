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
    description: 'Regional Transportation Plans, Active Transportation Plans, VMT analysis, and carbon reduction programs that boards adopt and funders support.',
    icon: MapPin,
    href: '/services/planning',
    services: ['RTPs & ATPs', 'VMT & Carbon Reduction', 'Complete Streets', 'Speed & Safety Management'],
    deliverables: [
      'RTP/ATP chapters with fiscally constrained project lists',
      'Performance target tables (safety, pavement, accessibility)',
      'Before/after concept visualizations & cross-sections',
      'Interactive web maps with project filters',
      'Grant application support packages'
    ]
  },
  {
    name: 'GIS & Spatial Analysis',
    description: 'PostGIS databases, interactive web mapping, and spatial analytics that turn data into actionable insights for transportation and community planning.',
    icon: Database,
    href: '/services/gis',
    services: ['PostGIS Development', 'Interactive Maps', 'Suitability Analysis', 'Custom Dashboards'],
    deliverables: [
      'PostGIS database schemas with documented queries',
      'Interactive Mapbox/Leaflet web applications',
      'Safety hotspot & accessibility analysis maps',
      'Automated data pipelines & refresh workflows',
      'Export-ready figures & presentation materials'
    ]
  },
  {
    name: 'Aerial Mapping & Photogrammetry',
    description: 'FAA Part 107 certified drone operations delivering orthomosaics, digital elevation models, 3D meshes, and progress documentation for sites and corridors.',
    icon: Plane,
    href: '/services/aerial',
    services: ['Orthomosaic Imagery', 'Digital Elevation Models', '3D Meshes', 'Progress Tracking'],
    deliverables: [
      'GeoTIFF orthomosaics (sub-inch accuracy)',
      'Digital Elevation Models (DEMs) for drainage/grading',
      'Textured 3D meshes for visualization',
      'Time-series progress photography',
      'Deliverables in GIS-ready formats (GeoTIFF, LAS, OBJ)'
    ]
  },
  {
    name: 'Funding & Grant Services',
    description: 'Opportunity scanning, compelling narratives, benefit-cost analysis, and full application assembly for FTA, ATP, HSIP, CRP, RAISE, TIRCP, and Clean California programs.',
    icon: FileText,
    href: '/services/grants',
    services: ['Opportunity Scans', 'Narrative Development', 'Benefit-Cost Analysis', 'Application Assembly'],
    deliverables: [
      'Funding opportunity calendars & eligibility matrices',
      'Project narratives tied to scoring criteria',
      'Benefit-cost worksheets & economic justification',
      'Application assembly with exhibits & attachments',
      'Post-award compliance & reporting support'
    ]
  },
  {
    name: 'AI-Enabled Documentation',
    description: 'Automated report generation, figure/table pipelines, citation management, and document QA/QC using AI workflows that reduce production time without sacrificing accuracy.',
    icon: Sparkles,
    href: '/services/ai',
    services: ['Automated Reports', 'Figure/Table Generation', 'Literature Reviews', 'Document QA/QC'],
    deliverables: [
      'Automated figure & table generation pipelines',
      'Citation-managed literature reviews',
      'Template-based report assembly workflows',
      'Batch document QA/QC (cross-references, formatting)',
      'Reproducible documentation for audits & updates'
    ]
  },
]

export default function ServicesPage() {
  return (
    <>
      <Section spacing="lg" className="bg-gradient-to-b from-[#F1F5F9] to-white dark:from-gray-900 dark:to-gray-950">
        <Container size="lg">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-6 leading-tight">
              Integrated Planning Services
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              From transportation planning to drone mapping, we combine technical expertise with 
              plain-English communication to deliver clear, fundable outcomes for Northern California communities.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="space-y-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.name} hover className="overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-2 p-6">
                      <CardHeader className="p-0 mb-4">
                        <div className="w-12 h-12 bg-[#1F4E2E] dark:bg-green-600 rounded-lg flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl">{service.name}</CardTitle>
                        <CardDescription className="text-base mt-2">{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="mb-4">
                          <p className="text-sm font-medium text-[#0F172A] dark:text-white mb-2">Service Areas:</p>
                          <div className="flex flex-wrap gap-2">
                            {service.services.map((item) => (
                              <span key={item} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] dark:bg-gray-700 text-[#0F172A] dark:text-gray-200">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </div>
                    <div className="bg-[#F1F5F9] dark:bg-gray-900 p-6 lg:border-l border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-[#0F172A] dark:text-white mb-3">Typical Deliverables:</p>
                      <ul className="space-y-2">
                        {service.deliverables.map((deliverable) => (
                          <li key={deliverable} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                            <ArrowRight className="w-3 h-3 text-[#D4A63F] dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        <Button asChild variant="ghost" size="sm" className="text-xs">
                          <Link href={service.href}>
                            Learn more <ArrowRight className="ml-2 w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#1F4E2E] dark:bg-green-900 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not sure where to start?
            </h2>
            <p className="text-lg text-gray-200 dark:text-gray-300 mb-8">
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

