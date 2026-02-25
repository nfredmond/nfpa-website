import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Camera, Database, MessageSquare } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Process',
  description: 'Capture → Compute → Communicate: an implementation-focused delivery framework.',
}

const steps = [
  {
    number: '01',
    title: 'Capture',
    icon: Camera,
    description: 'Assemble field and context data quickly, with collection discipline and traceability.',
    items: [
      'Flight and field prep with risk checks and task clarity',
      'Imagery/data collection aligned to analysis objective',
      'Constraint mapping: policy, land use, safety, and funding context',
    ],
  },
  {
    number: '02',
    title: 'Compute',
    icon: Database,
    description: 'Turn raw inputs into defensible analysis with reproducible methods.',
    items: [
      'Photogrammetry and GIS processing with documented assumptions',
      'Spatial diagnostics for access, safety, equity, and feasibility',
      'QA checks and versioning before stakeholder-facing output',
    ],
  },
  {
    number: '03',
    title: 'Communicate',
    icon: MessageSquare,
    description: 'Translate technical findings into fundable, board-usable decisions.',
    items: [
      'Maps, narratives, and visuals designed for mixed audiences',
      'Funding and implementation framing tied to real constraints',
      'Clear handoff package for next-step execution',
    ],
  },
]

export default function ProcessPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">Delivery Method</span>
            <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Capture → Compute → Communicate.</h1>
            <p className="mt-5 text-lg text-white/82 max-w-3xl">
              A disciplined three-stage workflow that keeps technical quality high while preserving momentum to funding
              and implementation.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/85">
        <Container>
          <div className="relative h-60 overflow-hidden rounded-2xl border border-[color:var(--line)]">
            <Image
              src="/images/site/mainstreet-aerial.jpg"
              alt="Aerial perspective of a complete-streets style corridor"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1c2a]/70 via-[#0d1c2a]/25 to-transparent" />
            <p className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#12301f]">
              Built for decision velocity
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="max-w-5xl mx-auto space-y-4">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <Card key={step.number} hover className="p-6 md:p-7">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-[0.24fr_0.76fr] gap-6">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground)]/55">Step {step.number}</p>
                        <div className="mt-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--sand)] text-[color:var(--pine)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="mt-4 text-3xl font-semibold text-[color:var(--ink)]">{step.title}</h2>
                      </div>

                      <div>
                        <p className="text-[1rem] text-[color:var(--foreground)]/78">{step.description}</p>
                        <ul className="mt-4 space-y-2.5">
                          {step.items.map((item) => (
                            <li key={item} className="flex gap-2.5 items-start text-sm text-[color:var(--foreground)]/75">
                              <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-[color:var(--copper)]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[color:var(--sand)]/45 border-y border-[color:var(--line)]">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title text-4xl md:text-5xl text-[color:var(--ink)]">Want this process applied to your project?</h2>
            <p className="mt-4 text-lg text-[color:var(--foreground)]/82">
              We’ll scope a delivery path with milestones, review points, and funding relevance from day one.
            </p>
            <Button asChild size="lg" className="mt-7">
              <Link href="/contact">Discuss Your Project</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
