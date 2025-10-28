/**
 * Homepage
 * Main landing page for Nat Ford Planning & Design
 */

import Link from 'next/link'
import { MapPin, Database, Plane, FileText, Sparkles, ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Grid } from '@/components/layout/grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import JsonLd from '@/components/features/json-ld'
import organizationData from '@/data/organization.json'
import servicesData from '@/data/services.json'
import projectsData from '@/data/projects.json'

const services = [
  {
    name: 'Urban & Transportation Planning',
    description: 'RTPs, ATPs, VMT analysis, and carbon reduction programs for Northern California communities.',
    icon: MapPin,
    href: '/services/planning',
    features: ['Regional Transportation Plans', 'Active Transportation Plans', 'VMT & Carbon Reduction', 'Complete Streets Design']
  },
  {
    name: 'GIS & Spatial Analysis',
    description: 'PostGIS databases, interactive mapping, and data-driven decision support tools.',
    icon: Database,
    href: '/services/gis',
    features: ['PostGIS Development', 'Interactive Web Maps', 'Suitability Analysis', 'Custom Dashboards']
  },
  {
    name: 'Aerial Mapping & Photogrammetry',
    description: 'Orthomosaics, DEMs, 3D models, and site documentation with professional drone capture.',
    icon: Plane,
    href: '/services/aerial',
    features: ['Orthomosaic Imagery', 'Digital Elevation Models', '3D Textured Meshes', 'Progress Documentation']
  },
  {
    name: 'Funding & Grant Services',
    description: 'Grant identification, narrative development, and application assembly for FTA, ATP, CRP, and more.',
    icon: FileText,
    href: '/services/grants',
    features: ['Grant Opportunity Scans', 'Narrative Development', 'Benefit-Cost Analysis', 'Application Assembly']
  },
  {
    name: 'AI-Enabled Documentation',
    description: 'Automated report builds, figure/table pipelines, and citation management for faster delivery.',
    icon: Sparkles,
    href: '/services/ai',
    features: ['Automated Reports', 'Figure/Table Generation', 'Literature Reviews', 'Document QA/QC']
  },
]

const featuredProjects = [
  {
    title: 'Sierra County RTP',
    county: 'Sierra County, CA',
    description: 'Data-driven performance targets and fiscally constrained investment roadmap for a high-elevation rural county.',
    metrics: ['10-year roadmap', 'Grant-ready projects', 'Clear funding path'],
    href: '/projects/sierra-rtp',
  },
  {
    title: 'Del Norte County ATP',
    county: 'Del Norte County, CA',
    description: 'Converted coastal network gaps into competitive, phaseable ATP applications with community support.',
    metrics: ['Multi-cycle applications', 'School access focus', 'Coastal trail segments'],
    href: '/projects/del-norte-atp',
  },
  {
    title: 'Tehama County VMT & CIP',
    county: 'Tehama County, CA',
    description: 'Connected VMT-reducing strategies to a realistic Capital Improvement Program with measurable outcomes.',
    metrics: ['Countywide VMT screens', 'Prioritized CIP', 'Board-ready tables'],
    href: '/projects/tehama-vmt',
  },
]

const trustedBy = [
  { name: 'Sierra County', note: '(served by Nat in prior role)' },
  { name: 'Del Norte County', note: '(served by Nat in prior role)' },
  { name: 'Tehama County', note: '(served by Nat in prior role)' },
  { name: 'Plumas County', note: '(served by Nat in prior role)' },
  { name: 'El Dorado County Transportation Commission', note: '(served by Nat in prior role)' },
]

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationData} />
      <JsonLd data={servicesData} />
      <JsonLd data={projectsData} />
      
      {/* Hero Section */}
      <Section spacing="xl" className="bg-gradient-to-b from-[#F1F5F9] to-white dark:from-gray-900 dark:to-gray-950">
        <Container size="lg">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] dark:text-white mb-6 leading-tight">
              Planning clarity from street to skyline
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Data-driven urban planning, GIS, and aerial insights for Northern California communities. 
              Expert transportation planning, grant writing, and spatial analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">View Projects</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Trusted By Section */}
      <Section spacing="md" className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <Container>
          <p className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6 uppercase tracking-wide">
            Agencies Served by Nathaniel
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {trustedBy.map((client) => (
              <div key={client.name} className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {client.name} <span className="text-xs text-gray-500 dark:text-gray-500">{client.note}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
            Projects for these agencies were completed while Nathaniel was employed at Green DOT Transportation Solutions (2021–2025). 
            See the About page for full employment history.
          </p>
        </Container>
      </Section>

      {/* Services Section */}
      <Section spacing="xl">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
              Comprehensive Planning Services
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              From regional planning to field-level precision, we integrate technical analysis 
              with plain-English communication for clear, fundable outcomes.
            </p>
          </div>
          
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
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                          <ArrowRight className="w-4 h-4 text-[#D4A63F] mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
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

      {/* Featured Projects Section */}
      <Section spacing="xl" className="bg-[#F1F5F9] dark:bg-gray-900">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
              Representative Work
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Examples of planning and analysis work performed by Nathaniel in prior roles
            </p>
          </div>
          
          <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
            {featuredProjects.map((project) => (
              <Card key={project.title} hover>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-[#D4A63F] font-medium">{project.county}</div>
                    <div className="text-xs text-gray-500 italic">(Prior role)</div>
                  </div>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.metrics.map((metric) => (
                      <span 
                        key={metric}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-[#0F172A] border border-gray-200"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={project.href}>
                      View case study <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Value Proposition Section */}
      <Section spacing="xl">
        <Container>
          <div className="bg-[#1F4E2E] text-white rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Grant-Funded Planning That Works
              </h2>
              <p className="text-lg text-gray-200 mb-8">
                We don't just write grant applications—we integrate planning, GIS, and aerial documentation 
                into fundable packages. From opportunity scans to shovel-ready submissions, we help small 
                municipalities access federal and state funding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/services/grants">Explore Grant Services</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#1F4E2E]">
                  <Link href="/contact">Free Funding Feasibility Review</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white mb-4">
              Ready to move from analysis to action?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Schedule a free 30-minute consultation to discuss your planning needs, 
              funding opportunities, and how we can help.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Get Started Today</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

