import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

const principles = [
  'Truth without spin: assumptions and limitations are explicitly disclosed.',
  'Fair exchange: pricing is transparent, sustainable, and never opportunistic.',
  'Protect the vulnerable: recommendations must not shift harm onto disadvantaged or tribal communities.',
  'Repair quickly: if scope, timing, or quality slips, we communicate early and make it right.',
  'Generosity by default: community benefit is built into operations, not treated as an afterthought.',
]

export default function EthicsPage() {
  return (
    <>
      <Section spacing="xl" className="bg-gradient-to-b from-[#F1F5F9] to-white dark:from-gray-900 dark:to-gray-950">
        <Container size="lg">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-6">Ethics & AI Disclosure</h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Nat Ford Planning & Analysis is committed to fair, sustainable, and community-first practice. Profit supports resilience and long-term service, not extraction.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-4">Business Covenant</h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 list-disc pl-6">
              {principles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#F8FAFC] dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-5">
            <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white">Client AI Disclosure</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              AI is used to accelerate drafting, data cleaning, and formatting. Final analysis, conclusions, and recommendations are reviewed and approved by qualified staff.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Regulatory claims are citation-backed or explicitly marked for verification. Deliverables include methods and assumptions suitable for client and public review.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-5">
            <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white">Data & Community Commitments</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Client data is not sold and is not reused across clients without explicit permission. Sensitive data is minimized, access-controlled, and retained only as long as necessary.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We maintain hardship capacity for under-resourced agencies and publish periodic impact notes on giveback and community benefit activity.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
