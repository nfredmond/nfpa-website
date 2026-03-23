import type { Metadata } from 'next'
import { ContactPageShell } from '@/components/features/contact-page-shell'

export const metadata: Metadata = {
  title: 'OpenPlan Fit Review',
  description: 'Start an OpenPlan fit conversation to assess whether the product matches your workflow and timing.',
}

export default function OpenPlanFitPage() {
  return (
    <ContactPageShell
      title="Let’s see whether OpenPlan is the right fit."
      subtitle="Start with a focused OpenPlan fit intake. We’ll align workflow, timing, and the right next step before anyone commits."
      initialIntent="fit"
      initialTopic="openplan"
      initialProduct="openplan"
    />
  )
}
