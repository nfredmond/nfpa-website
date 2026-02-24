import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Grid } from '@/components/layout/grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, Map } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products',
  description:
    'OpenPlan and Ads Automation: Nat Ford Planning & Analysis software products for transportation agencies, tribes, consultancies, and service businesses.',
}

const products = [
  {
    name: 'OpenPlan',
    icon: Map,
    stage: 'Active build',
    description:
      'A transportation and land-use planning SaaS focused on corridor analysis, equity/safety diagnostics, and grant-ready reporting for agencies, tribes, and consultancies.',
    capabilities: [
      'Corridor-based analysis workspace',
      'Accessibility, safety, and equity scoring',
      'Census/LODES/transit/crash data integration',
      'Report generation for grant workflows',
    ],
  },
  {
    name: 'Ads Automation',
    icon: Bot,
    stage: 'Client-proven v1',
    description:
      'An ads operations platform that synchronizes campaign intelligence and reporting workflows. Built from a production client engagement and evolving toward a multi-industry v2 product.',
    capabilities: [
      'Cross-platform campaign workflow support',
      'Operational automation and sync logic',
      'Client reporting acceleration',
      'Roadmap to reusable multi-industry productization',
    ],
  },
]

export default function ProductsPage() {
  return (
    <>
      <Section spacing="lg" className="bg-gradient-to-b from-[#F1F5F9] to-white dark:from-gray-900 dark:to-gray-950">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-6 leading-tight">
              Product Suite
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Two focused SaaS products built to create leverage: one for transportation planning,
              one for automation-heavy client operations.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <Grid cols={{ default: 1, md: 2 }} gap="lg">
            {products.map((product) => {
              const Icon = product.icon
              return (
                <Card key={product.name} hover>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-[#1F4E2E] rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#0F172A] border border-gray-200">
                        {product.stage}
                      </span>
                    </div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {product.capabilities.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <ArrowRight className="w-4 h-4 text-[#D4A63F] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </Grid>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#1F4E2E] dark:bg-green-900 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Interested in a pilot?</h2>
            <p className="text-lg text-gray-200 dark:text-gray-300 mb-8">
              We can scope a pilot engagement for agencies, consultancies, or operations teams that need measurable gains quickly.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Discuss Product Access</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
