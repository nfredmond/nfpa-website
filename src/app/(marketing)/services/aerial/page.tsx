import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Plane } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aerial Mapping & Photogrammetry',
  description: 'FAA-certified drone capture and mapping outputs for planning, documentation, and analysis.',
}

const deliverables = [
  'Orthomosaics and terrain products for corridor context',
  'Visual evidence packs for boards and stakeholders',
  'Progress tracking imagery for implementation phases',
  'GIS-ready handoff formats for downstream analysis',
]

export default function AerialServicePage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <span className="pill">Service Detail</span>
          <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Aerial Mapping & Photogrammetry</h1>
          <p className="mt-5 max-w-3xl text-lg text-white/82">
            High-clarity field capture that shortens the path from on-site conditions to usable planning intelligence.
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
                  <Plane className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm text-[color:var(--foreground)]/78">
                  Need a site capture plan? We’ll scope airspace, timing, outputs, and integration with your planning workflow.
                </p>
                <Button asChild className="mt-5 w-full">
                  <Link href="/contact">Request Aerial Scope</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  )
}
