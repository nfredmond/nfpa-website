import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Database, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GIS & Spatial Analysis',
  description: 'PostGIS, mapping automation, and spatial diagnostics for transportation and planning teams.',
}

const deliverables = [
  'PostGIS-backed data model with documented queries',
  'Safety, equity, and access diagnostics by corridor or area',
  'Board-ready map exports and web map layers',
  'Automated update workflow for recurring reporting',
]

export default function GISServicePage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <span className="pill">Service Detail</span>
          <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">GIS & Spatial Analysis</h1>
          <p className="mt-5 max-w-3xl text-lg text-white/82">
            Build decision-quality spatial intelligence from fragmented datasets and convert it into clear planning action.
          </p>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_0.3fr] gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Typical Deliverables</h2>
                <ul className="mt-4 space-y-2.5">
                  {deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-[color:var(--foreground)]/78">
                      <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-[color:var(--copper)]" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--sand)] text-[color:var(--pine)]">
                  <Database className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm text-[color:var(--foreground)]/78">
                  Need a GIS-first scope? We’ll map data sources, analysis needs, and the fastest production path.
                </p>
                <Button asChild className="mt-5 w-full">
                  <Link href="/contact">Request GIS Intake</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[color:var(--sand)]/45 border-y border-[color:var(--line)]">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="section-title text-4xl text-[color:var(--ink)]">Explore related planning work</h2>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/services/planning">
                <MapPin className="mr-2 h-4 w-4" />
                Urban & Transportation Planning
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
