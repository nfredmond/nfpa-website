import type { Metadata } from 'next'
import { ContactPageShell } from '@/components/features/contact-page-shell'

export const metadata: Metadata = {
  title: 'OpenPlan Updates',
  description: 'Request OpenPlan open-source release, pilot, and managed deployment updates from Nat Ford.',
}

export default function OpenPlanUpdatesPage() {
  return (
    <ContactPageShell
      title="Stay close to OpenPlan without forcing a purchase decision."
      subtitle="Use this intake to request OpenPlan open-source release, pilot, and managed deployment updates. We will route it with the right product context."
      initialIntent="updates"
      initialTopic="openplan"
      initialProduct="openplan"
    />
  )
}
