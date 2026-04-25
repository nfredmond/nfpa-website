'use client'

import * as React from 'react'
import Script from 'next/script'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void
    onTurnstileExpired?: () => void
    onTurnstileError?: () => void
  }
}

const inquiryTypes = [
  'Open-source software support',
  'Custom software development',
  'Planning support',
  'GIS / mapping',
  'Grant strategy',
  'OpenPlan product',
  'Ads automation product',
  'General inquiry',
]

const timelines = ['Immediate (0-30 days)', 'Near-term (1-3 months)', 'Planning horizon (3+ months)']

const budgetRanges = ['$3.5K – $8.5K', '$8.5K – $18K', '$18K +', 'Not sure yet']

const checkoutInquiryByProduct: Record<string, string> = {
  openplan: 'OpenPlan product',
  'ads-automation': 'Ads automation product',
  'drone-ops': 'General inquiry',
  'planner-ai-workflow-guide-v2': 'General inquiry',
}

const checkoutProductLabel: Record<string, string> = {
  openplan: 'OpenPlan Software',
  'ads-automation': 'Marketing & Planning Analytics Software',
  'drone-ops': 'DroneOps Intelligence',
  'planner-ai-workflow-guide-v2': 'AI-Assisted Planning Workflows',
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

type ContactIntakeFormProps = {
  initialIntent?: string
  initialTopic?: string
  initialProduct?: string
  initialTier?: string
}

export function ContactIntakeForm({
  initialIntent = '',
  initialTopic = '',
  initialProduct = '',
  initialTier = '',
}: ContactIntakeFormProps) {
  const [submitted, setSubmitted] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = React.useState('')

  const requestIntent = initialIntent.toLowerCase()
  const requestTopic = initialTopic.toLowerCase()
  const checkoutProduct = initialProduct.toLowerCase()
  const checkoutTier = initialTier

  const checkoutIntent = ['subscription', 'checkout', 'purchase'].includes(requestIntent)
  const pilotUpdatesIntent = ['updates', 'pilot-updates', 'waitlist-updates'].includes(requestIntent)
  const fitConversationIntent = ['fit', 'discovery', 'discuss-fit'].includes(requestIntent)
  const fundingReadinessIntent = ['scorecard-review', 'funding-readiness-review'].includes(requestIntent) || requestTopic === 'funding-readiness-scorecard'
  const openPlanIntent = requestTopic === 'openplan' || requestTopic === 'open-source-support' || checkoutProduct === 'openplan'
  const customSoftwareIntent = requestTopic === 'custom-software'

  const defaultInquiryType = fundingReadinessIntent
    ? 'Grant strategy'
    : customSoftwareIntent
      ? 'Custom software development'
      : requestTopic === 'open-source-support'
        ? 'Open-source software support'
        : checkoutInquiryByProduct[checkoutProduct] || (openPlanIntent ? 'OpenPlan product' : '')
  const defaultTimeline = checkoutIntent
    ? timelines[0]
    : pilotUpdatesIntent
      ? timelines[2]
      : fitConversationIntent || fundingReadinessIntent
        ? timelines[1]
        : ''
  const checkoutLabel = checkoutProductLabel[checkoutProduct] || checkoutProduct
  const defaultDescription = checkoutIntent
    ? ['Access/support request', `Product: ${checkoutLabel}`, checkoutTier ? `Prior selected tier: ${checkoutTier}` : null, '', 'Please share the right open-source setup, managed deployment, support, or access next step.']
        .filter(Boolean)
        .join('\n')
    : pilotUpdatesIntent && openPlanIntent
      ? ['OpenPlan updates request', 'Product: OpenPlan Software', '', 'Please keep me informed about open-source releases, managed deployment availability, pilot timing, and major product updates.']
          .filter(Boolean)
          .join('\n')
      : fitConversationIntent && openPlanIntent
        ? ['OpenPlan / open-source support request', 'Product: OpenPlan Software', '', 'Please help me assess whether OpenPlan, a custom fork, or managed open-source deployment is the right fit for our workflow.']
            .filter(Boolean)
            .join('\n')
        : customSoftwareIntent
          ? [
              'Custom software / AI implementation request',
              '',
              'Workflow or problem to solve:',
              'Current tools or systems involved:',
              'Users / roles who need access:',
              'What would make this successful in the next 30-90 days?',
            ].join('\n')
          : requestTopic === 'open-source-support'
            ? [
                'Open-source deployment/support request',
                '',
                'Project or repo of interest:',
                'Do you need hosting, custom fork, onboarding, support, or all of the above?',
                'Current data/systems involved:',
                'Timeline or urgency:',
              ].join('\n')
            : fundingReadinessIntent
              ? [
                  'Funding readiness review request',
                  '',
                  'If available, include your score band or current score from the Funding Readiness Scorecard.',
                  'Target funding window / program:',
                  'Top readiness gaps or concerns:',
                  'What outcome would be most helpful from a review?',
                ].join('\n')
              : ''

  React.useEffect(() => {
    if (!turnstileSiteKey) return

    window.onTurnstileSuccess = (token: string) => setTurnstileToken(token)
    window.onTurnstileExpired = () => setTurnstileToken('')
    window.onTurnstileError = () => setTurnstileToken('')

    return () => {
      delete window.onTurnstileSuccess
      delete window.onTurnstileExpired
      delete window.onTurnstileError
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (turnstileSiteKey && !turnstileToken) {
      setError('Please complete the anti-spam verification.')
      setIsSubmitting(false)
      return
    }

    const formEl = e.currentTarget
    const form = new FormData(formEl)

    const payload = {
      firstName: String(form.get('firstName') || ''),
      lastName: String(form.get('lastName') || ''),
      email: String(form.get('email') || ''),
      organization: String(form.get('organization') || ''),
      inquiryType: String(form.get('inquiryType') || ''),
      timeline: String(form.get('timeline') || ''),
      description: String(form.get('description') || ''),
      budgetRange: String(form.get('budgetRange') || ''),
      projectGeography: String(form.get('projectGeography') || ''),
      desiredStartDate: String(form.get('desiredStartDate') || ''),
      website: String(form.get('website') || ''),
      sourcePath: typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/contact',
      turnstileToken,
      topic: requestTopic,
      intent: requestIntent,
      product: checkoutProduct,
      tier: checkoutTier,
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string }

      if (!res.ok || !data.ok) {
        setError(data.message || 'Could not submit right now. Please try again in a moment.')
        return
      }

      formEl.reset()
      setSubmitted(true)
      setTurnstileToken('')
    } catch {
      setError('Connection issue. Please try again or email nathaniel@natfordplanning.com.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return !submitted ? (
    <>
      <p className="mb-6 text-sm text-[color:var(--foreground)]/70">
        Submit this form and we’ll route your request into our internal lead pipeline for follow-up.
      </p>
      {checkoutIntent ? (
        <div className="mb-6 rounded-xl border border-[color:var(--pine)]/25 bg-[color:var(--sand)]/35 px-4 py-3 text-sm text-[color:var(--foreground)]/85">
          <p className="font-semibold text-[color:var(--pine)]">Access/support request detected</p>
          <p className="mt-1">
            We captured your selected product context{checkoutTier ? ` (${checkoutTier})` : ''}. Complete the form and we’ll send the right open-source setup, managed deployment, or support next step.
          </p>
        </div>
      ) : null}
      {pilotUpdatesIntent && openPlanIntent ? (
        <div className="mb-6 rounded-xl border border-[color:var(--pine)]/25 bg-[color:var(--sand)]/35 px-4 py-3 text-sm text-[color:var(--foreground)]/85">
          <p className="font-semibold text-[color:var(--pine)]">OpenPlan pilot updates request</p>
          <p className="mt-1">
            This intake will be labeled for OpenPlan update follow-up so it can be separated from immediate managed-support requests.
          </p>
        </div>
      ) : null}
      {fitConversationIntent && openPlanIntent ? (
        <div className="mb-6 rounded-xl border border-[color:var(--pine)]/25 bg-[color:var(--sand)]/35 px-4 py-3 text-sm text-[color:var(--foreground)]/85">
          <p className="font-semibold text-[color:var(--pine)]">OpenPlan / open-source support request</p>
          <p className="mt-1">We captured that you want a fit discussion first, not a forced checkout path.</p>
        </div>
      ) : null}
      {fundingReadinessIntent ? (
        <div className="mb-6 rounded-xl border border-[color:var(--pine)]/25 bg-[color:var(--sand)]/35 px-4 py-3 text-sm text-[color:var(--foreground)]/85">
          <p className="font-semibold text-[color:var(--pine)]">Funding readiness review request</p>
          <p className="mt-1">
            Use this intake to share your score, timeline, and the main gaps you want help prioritizing. This is a scoped review request, not a guarantee of funding success.
          </p>
        </div>
      ) : null}
      <form key={`${requestTopic}:${requestIntent}:${checkoutProduct}:${checkoutTier}`} onSubmit={handleSubmit} className="space-y-5">
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First Name" name="firstName" required />
          <Input label="Last Name" name="lastName" required />
        </div>

        <Input label="Email" name="email" type="email" required />
        <Input label="Organization" name="organization" required />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiryType" className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">
              Inquiry Type
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              defaultValue={defaultInquiryType}
              required
              className="flex h-11 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
            >
              <option value="">Select one</option>
              {inquiryTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="timeline" className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">
              Desired Timeline
            </label>
            <select
              id="timeline"
              name="timeline"
              defaultValue={defaultTimeline}
              required
              className="flex h-11 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
            >
              <option value="">Select one</option>
              {timelines.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="budgetRange" className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">
              Budget Range <span className="font-normal text-[color:var(--foreground)]/55">(optional)</span>
            </label>
            <select
              id="budgetRange"
              name="budgetRange"
              defaultValue=""
              className="flex h-11 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
            >
              <option value="">Select a range</option>
              {budgetRanges.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Desired Start Window (optional)"
            name="desiredStartDate"
            type="date"
          />
        </div>

        <Input
          label="Project Geography (optional)"
          name="projectGeography"
          placeholder="County, region, or service area"
        />

        <Textarea
          label="Project Description"
          name="description"
          defaultValue={defaultDescription}
          placeholder="What decision are you trying to make? What constraints are you working with?"
          rows={7}
          required
        />

        {turnstileSiteKey && (
          <>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
            <div
              className="cf-turnstile"
              data-sitekey={turnstileSiteKey}
              data-callback="onTurnstileSuccess"
              data-expired-callback="onTurnstileExpired"
              data-error-callback="onTurnstileError"
              data-theme="auto"
            />
          </>
        )}

        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <Button type="submit" size="lg" disabled={isSubmitting || (Boolean(turnstileSiteKey) && !turnstileToken)}>
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting
            ? 'Submitting…'
            : pilotUpdatesIntent && openPlanIntent
              ? 'Request OpenPlan Updates'
              : fitConversationIntent && openPlanIntent
                ? 'Request OpenPlan Fit Review'
                : fundingReadinessIntent
                  ? 'Request Funding Readiness Review'
                  : 'Submit Inquiry'}
        </Button>
      </form>
    </>
  ) : (
    <div className="py-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--pine)] text-white">
        <Send className="h-6 w-6" />
      </div>
      <h3 className="text-2xl font-semibold text-[color:var(--ink)]">
        {pilotUpdatesIntent && openPlanIntent
          ? 'OpenPlan update request received'
          : fitConversationIntent && openPlanIntent
            ? 'OpenPlan fit request received'
            : fundingReadinessIntent
              ? 'Funding readiness request received'
              : 'Inquiry received'}
      </h3>
      <p className="mt-3 text-[color:var(--foreground)]/75">
        {pilotUpdatesIntent && openPlanIntent
          ? 'Thanks — your request is now labeled for OpenPlan pilot-update follow-up. We typically respond within 1–2 business days.'
          : fitConversationIntent && openPlanIntent
            ? 'Thanks — your request is now labeled for OpenPlan fit follow-up. We typically respond within 1–2 business days.'
            : fundingReadinessIntent
              ? 'Thanks — your request is now labeled for funding-readiness follow-up. We typically respond within 1–2 business days.'
              : 'Thanks — your message is now in our intake pipeline. We typically respond within 1–2 business days.'}
      </p>
      <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
        Submit Another Inquiry
      </Button>
    </div>
  )
}
