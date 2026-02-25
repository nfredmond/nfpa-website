import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

export default function TermsPage() {
  return (
    <>
      <Section spacing="xl" className="bg-gradient-to-b from-[#F1F5F9] to-white dark:from-gray-900 dark:to-gray-950">
        <Container size="lg">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-6">Terms of Service</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Last updated: February 24, 2026</p>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-6 text-gray-700 dark:text-gray-300">
            <p>
              These Terms govern your use of Nat Ford Planning & Analysis services and products, including OpenPlan.
              By using our services, you agree to these Terms.
            </p>

            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">Service Commitments</h2>
              <p>
                We provide professional planning and software services using transparent methods, clear assumptions,
                and fair pricing principles. Scope, deliverables, timeline, and exclusions are documented in each
                proposal or statement of work.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">AI Use and Human Review</h2>
              <p>
                AI may be used to accelerate drafting, data cleaning, formatting, and interpretation support. Final
                analysis, conclusions, and recommendations are reviewed and approved by qualified staff.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">Fees, Scope Changes, and Payment</h2>
              <p>
                Pricing is based on transparent scope and effort assumptions. Scope changes are handled through a
                non-punitive written addendum with options to reduce scope, extend schedule, or adjust fee.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">No Guarantee of Funding or Outcomes</h2>
              <p>
                Planning recommendations and grant support improve competitiveness but do not guarantee funding awards,
                approvals, or downstream outcomes outside our direct control.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">Confidentiality</h2>
              <p>
                We treat client information as confidential and use it only for contracted work, subject to applicable
                law and agreed disclosure terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">Contact</h2>
              <p>
                Questions about these Terms: <a className="underline" href="mailto:nathaniel@natfordplanning.com">nathaniel@natfordplanning.com</a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
