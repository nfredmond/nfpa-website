import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Common questions about services, delivery standards, and operational scope.',
}

const faqs = [
  {
    question: 'What services do you provide?',
    answer:
      'Planning strategy, GIS/spatial analytics, aerial mapping support, grant competitiveness work, and AI-enabled documentation workflows with human-reviewed outputs.',
  },
  {
    question: 'Are you Part 107 certified and insured?',
    answer:
      'Yes. FAA Part 107 operations are conducted with site-specific risk checks and required authorizations for controlled airspace.',
  },
  {
    question: 'Do you provide survey-grade measurements?',
    answer:
      'Default deliverables are planning-grade. If survey-grade precision is required, scope includes control/check workflows and licensed-surveyor coordination where needed.',
  },
  {
    question: 'What deliverable formats do you support?',
    answer:
      'Typical outputs include GeoPackage/GeoJSON, map apps, PDF/DOCX reports, GeoTIFF orthomosaics, terrain products, and presentation-ready graphics.',
  },
  {
    question: 'What do you need from clients to begin?',
    answer:
      'A decision owner, geography or corridor boundary, known constraints, key dates, and available data. We use this to structure an intake scope quickly.',
  },
  {
    question: 'What is a typical timeline?',
    answer:
      'Depends on scope: light diagnostics can land in 1–2 weeks, corridor studies often run 4–8 weeks, and larger planning packages may run 8–16+ weeks.',
  },
  {
    question: 'What is your data/privacy posture?',
    answer:
      'Client data is used only for contracted work, access-controlled, and not sold. Sensitive information is minimized and retained only as needed.',
  },
  {
    question: 'What work is explicitly out of scope?',
    answer:
      'We do not provide legal boundary surveying unless a licensed partner is engaged, and we avoid speculative visuals that could be mistaken for approved design.',
  },
]

export default function FAQPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">FAQ</span>
            <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Clear answers before the work begins.</h1>
            <p className="mt-5 text-lg text-white/82 max-w-3xl">
              Common questions on scope, standards, formats, timelines, and delivery expectations.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/85">
        <Container>
          <div className="relative h-52 overflow-hidden rounded-2xl border border-[color:var(--line)]">
            <Image
              src="/images/site/hero-corridor.jpg"
              alt="Northern California transportation corridor"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1c2a]/65 via-[#0d1c2a]/20 to-transparent" />
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="max-w-4xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-0">
                  <details className="group px-5 py-4">
                    <summary className="cursor-pointer list-none select-none text-lg font-semibold text-[color:var(--ink)] flex items-start justify-between gap-4">
                      <span>{faq.question}</span>
                      <span className="mt-1 text-[color:var(--pine)] transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--foreground)]/78">{faq.answer}</p>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
