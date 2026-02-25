import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

export default function PrivacyPage() {
  return (
    <>
      <Section spacing="xl" className="bg-gradient-to-b from-[#F1F5F9] to-white dark:from-gray-900 dark:to-gray-950">
        <Container size="lg">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-6">Privacy Policy</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Last updated: February 24, 2026</p>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-6 text-gray-700 dark:text-gray-300">
            <p>
              Nat Ford Planning & Analysis respects your privacy and is committed to responsible data stewardship.
              This policy explains how we collect, use, and protect information.
            </p>

            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">What We Collect</h2>
              <p>
                We collect contact and project information needed to provide requested services, operate products, and
                communicate about project delivery.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">How We Use Data</h2>
              <p>
                Data is used only for service delivery, product operation, support, and related business administration.
                We do not sell client data.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">AI and Data Handling</h2>
              <p>
                AI-assisted workflows may process project content for drafting and analysis support. Final conclusions are
                human-reviewed. Client data is not reused across clients without explicit permission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">Retention and Access Controls</h2>
              <p>
                We minimize sensitive data collection, apply access controls, and retain data only as long as necessary
                for contracted work, legal obligations, and operational continuity.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A] dark:text-white mb-2">Contact</h2>
              <p>
                Privacy questions: <a className="underline" href="mailto:nathaniel@natfordplanning.com">nathaniel@natfordplanning.com</a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
