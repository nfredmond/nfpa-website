import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funding & Grant Services',
  description: 'Program-fit strategy, narratives, and submission packaging for competitive funding.',
}

const deliverables = [
  'Funding fit matrix tied to project readiness',
  'Scoring-aware narrative strategy',
  'Submission package structure and quality control',
  'Implementation positioning for post-award success',
]

export default function GrantsServicePage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <span className="pill">Service Detail</span>
          <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Funding & Grant Services</h1>
          <p className="mt-5 max-w-3xl text-lg text-white/82">
            Improve competitiveness with clearer fit, stronger narrative logic, and operationally realistic packaging.
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
                  <FileText className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm text-[color:var(--foreground)]/78">
                  We can start with a focused review and identify the highest-probability funding path.
                </p>
                <Button asChild className="mt-5 w-full">
                  <Link href="/contact">Request Grant Intake</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  )
}
