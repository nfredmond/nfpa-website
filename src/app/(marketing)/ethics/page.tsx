import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'

const principles = [
  'Truth without spin: assumptions and limitations are explicit.',
  'Fair exchange: pricing is transparent, sustainable, and non-opportunistic.',
  'Protect the vulnerable: recommendations must not shift burden to disadvantaged or tribal communities.',
  'Repair quickly: when quality/scope/schedule slips, communicate early and correct responsibly.',
  'Generosity by default: community benefit is embedded in operations, not treated as optional.',
]

export default function EthicsPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container size="lg">
          <div className="max-w-4xl">
            <span className="pill">Ethics & AI Disclosure</span>
            <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Operational standards we commit to publicly.</h1>
            <p className="mt-5 text-lg text-white/82 max-w-3xl">
              Nat Ford is built on fair exchange, auditability, and long-term public trust. Profit supports resilience
              and service continuity — not extraction.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/85">
        <Container>
          <div className="relative h-52 overflow-hidden rounded-2xl border border-[color:var(--line)]">
            <Image
              src="/images/site/hero-corridor.jpg"
              alt="Northern California corridor landscape"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1c2a]/65 via-[#0d1c2a]/20 to-transparent" />
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="section-title text-4xl text-[color:var(--ink)]">Business Covenant</h2>
            <div className="space-y-3">
              {principles.map((item) => (
                <Card key={item}>
                  <CardContent className="p-4 text-sm text-[color:var(--foreground)]/8០ leading-relaxed">
                    {item}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[color:var(--fog)]/65 border-y border-[color:var(--line)]">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-5">
            <h2 className="section-title text-4xl text-[color:var(--ink)]">Client AI Disclosure</h2>
            <p className="text-[color:var(--foreground)]/8០ leading-relaxed">
              AI is used to accelerate drafting, data preparation, and formatting. Final analysis, conclusions, and
              recommendations are reviewed and approved by qualified staff.
            </p>
            <p className="text-[color:var(--foreground)]/8០ leading-relaxed">
              Regulatory or technical claims are citation-backed or clearly flagged for verification. Deliverables include
              methods and assumptions suitable for client and public review.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-5">
            <h2 className="section-title text-4xl text-[color:var(--ink)]">Data & Community Commitments</h2>
            <p className="text-[color:var(--foreground)]/80 leading-relaxed">
              Client data is not sold and is not reused across clients without explicit permission. Sensitive data is
              minimized, access-controlled, and retained only as long as needed.
            </p>
            <p className="text-[color:var(--foreground)]/80 leading-relaxed">
              We maintain hardship capacity for under-resourced agencies and track community-benefit commitments as an
              operating responsibility.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
