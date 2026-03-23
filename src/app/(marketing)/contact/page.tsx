import type { Metadata } from 'next'
import { ContactPageShell } from '@/components/features/contact-page-shell'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a focused intake with Nat Ford so scope, timeline, and delivery model are clear before work begins.',
}

export default function ContactPage() {
  return (
    <ContactPageShell
      title="Let’s scope the right project."
      subtitle="Start with a focused intake. We’ll align scope, timeline, and delivery model before work begins."
    />
  )
}
