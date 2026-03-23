import type { Metadata } from 'next'
import { ContactPageShell } from '@/components/features/contact-page-shell'

export const metadata: Metadata = {
  title: 'OpenPlan Pilot Updates',
  description: 'Request OpenPlan pilot updates and prelaunch availability notes from Nat Ford.',
}

export default function OpenPlanUpdatesPage() {
  return (
    <ContactPageShell
      title="Stay close to OpenPlan without forcing a purchase decision."
      subtitle="Use this intake to request OpenPlan pilot updates and prelaunch availability notes. We will route it with the right product context."
      initialIntent="updates"
      initialTopic="openplan"
      initialProduct="openplan"
    />
  )
}
