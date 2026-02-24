import Link from 'next/link'
import { MapPin, Database, Plane, FileText, Sparkles, ArrowRight, Bot, Map } from 'lucide-react'
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
    description:
      'RTPs, ATPs, VMT analysis, and carbon reduction programs for Northern California communities.',
    icon: MapPin,
    href: '/services/planning',
  },
  {
    name: 'GIS & Spatial Analysis',
    description: 'PostGIS databases, interactive mapping, and data-driven decision support tools.',
    icon: Database,
    href: '/services/gis',
  },
  {
    name: 'Aerial Mapping & Photogrammetry',
    description: 'Orthomosaics, DEMs, 3D models, and site documentation with professional drone capture.',
    icon: Plane,
    href: '/services/aerial',
  },
  {
    name: 'Funding & Grant Services',
    description: 'Grant identification, narrative development, and application assembly for competitive programs.',
    icon: FileText,
    href: '/services/grants',
  },
  {
    name: 'AI-Enabled Documentation',
    description: 'Automated report builds, figure/table pipelines, and citation QA for faster delivery.',
    icon: Sparkles,
    href: '/services/ai',
  },
]

const products = [
  {
    name: 'OpenPlan',
    icon: Map,
    description:
      'Transportation planning SaaS for corridor analysis, equity/safety diagnostics, and grant-ready reporting.',
  },
  {
    name: 'Ads Automation',
    icon: Bot,
    description:
      'Automation-focused product line built from a client-proven ads operations platform, evolving into multi-industry v2.',
  },
]

const trustedBy = [
  { name: 'Sierra County', note: '(served by Nathaniel in prior role)' },
  { name: 'Del Norte County', note: '(served by Nathaniel in prior role)' },
  { name: 'Tehama County', note: '(served by Nathaniel in prior role)' },
  { name: 'Plumas County', note: '(served by Nathaniel in prior role)' },
  { name: 'El Dorado County Transportation Commission', note: '(served by Nathaniel in prior role)' },
]

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationData} />
      <JsonLd data={servicesData} />
      <JsonLd data={projectsData} />

      <Section spacing="xl" className="bg-gradient-to-b from-[#F1F5F9] to-white dark:from-gray-900 dark:to-gray-950">
        <Container size="lg">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] dark:text-white mb-6 leading-tight">
              Planning expertise with software leverage
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Nat Ford Planning & Analysis helps agencies, tribes, and consultancies move from analysis to funded implementation — with clear planning services and two focused SaaS products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/products">Explore Products</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <Container>
          <p className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6 uppercase tracking-wide">
            Agencies Served by Nathaniel (Prior Employment)
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {trustedBy.map((client) => (
              <div key={client.name} className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {client.name} <span className="text-xs text-gray-500 dark:text-gray-500">{client.note}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">Core Services</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Technical planning support built for practical delivery, funding competitiveness, and board-ready decision making.
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

      <Section spacing="xl" className="bg-[#F1F5F9] dark:bg-gray-900">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">Product Suite</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Two software products designed to compound delivery speed and analytical power.
            </p>
          </div>

          <Grid cols={{ default: 1, md: 2 }} gap="lg">
            {products.map((product) => {
              const Icon = product.icon
              return (
                <Card key={product.name} hover>
                  <CardHeader>
                    <div className="w-12 h-12 bg-[#1F4E2E] rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </Grid>

          <div className="text-center mt-10">
            <Button asChild size="lg" variant="outline">
              <Link href="/products">View Product Details</Link>
            </Button>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#1F4E2E] dark:bg-green-900 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need planning support or product access?</h2>
            <p className="text-lg text-gray-200 dark:text-gray-300 mb-8">
              We can scope consulting support, software pilots, or both — based on your timeline and budget.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Start the Conversation</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
