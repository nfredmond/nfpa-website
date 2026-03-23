import type { Metadata } from 'next'
import { ContactPageShell } from '@/components/features/contact-page-shell'

export const metadata: Metadata = {
  title: 'Funding Readiness Review',
  description:
    'Request a focused intake to review scorecard results, identify key readiness gaps, and define the cleanest next step.',
}

export default function FundingReadinessContactPage() {
  return (
    <ContactPageShell
      title="Let’s review your funding readiness."
      subtitle="Use this intake to share your scorecard result, major gaps, and target funding timeline so we can recommend a practical next step. This intake is not a funding guarantee or formal eligibility determination."
      initialTopic="funding-readiness-scorecard"
      initialIntent="scorecard-review"
    />
  )
}
