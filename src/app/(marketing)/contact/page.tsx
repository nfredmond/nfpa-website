'use client'

import * as React from 'react'
import Script from 'next/script'
import { Clock, Linkedin, Mail, MapPin, Send } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
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
  'Planning support',
  'GIS / mapping',
  'Grant strategy',
  'OpenPlan product',
  'Ads automation product',
  'General inquiry',
]

const timelines = ['Immediate (0-30 days)', 'Near-term (1-3 months)', 'Planning horizon (3+ months)']

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = React.useState('')

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
      website: String(form.get('website') || ''), // honeypot
      sourcePath: typeof window !== 'undefined' ? window.location.pathname : '/contact',
      turnstileToken,
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

  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">Contact</span>
            <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Let’s scope the right project lane.</h1>
            <p className="mt-5 text-lg text-white/82 max-w-3xl">
              Start with a focused intake. We’ll align scope, timeline, and delivery model before work begins.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.42fr] gap-8 items-start">
            <Card>
              <CardContent className="p-6 sm:p-8">
                {!submitted ? (
                  <>
                    <p className="text-sm text-[color:var(--foreground)]/70 mb-6">
                      Submit this form and we’ll route your request into our internal lead pipeline for follow-up.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="First Name" name="firstName" required />
                        <Input label="Last Name" name="lastName" required />
                      </div>

                      <Input label="Email" name="email" type="email" required />
                      <Input label="Organization" name="organization" required />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="inquiryType" className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">
                            Inquiry Type
                          </label>
                          <select
                            id="inquiryType"
                            name="inquiryType"
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

                      <Textarea
                        label="Project Description"
                        name="description"
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

                      {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                          {error}
                        </div>
                      )}

                      <Button type="submit" size="lg" disabled={isSubmitting || (Boolean(turnstileSiteKey) && !turnstileToken)}>
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Submitting…' : 'Submit Inquiry'}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--pine)] text-white">
                      <Send className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-[color:var(--ink)]">Inquiry received</h3>
                    <p className="mt-3 text-[color:var(--foreground)]/75">
                      Thanks — your message is now in our intake pipeline. We typically respond within 1–2 business days.
                    </p>
                    <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                      Submit Another Inquiry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-[color:var(--ink)]">Contact Information</h3>

                  <div className="flex items-start gap-3 text-sm text-[color:var(--foreground)]/78">
                    <MapPin className="h-4 w-4 mt-0.5 text-[color:var(--pine)]" />
                    <span>Sierra Foothills · Near Grass Valley, California</span>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-[color:var(--foreground)]/78">
                    <Mail className="h-4 w-4 mt-0.5 text-[color:var(--pine)]" />
                    <a href="mailto:nathaniel@natfordplanning.com" className="font-semibold text-[color:var(--pine)] hover:underline">
                      nathaniel@natfordplanning.com
                    </a>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-[color:var(--foreground)]/78">
                    <Linkedin className="h-4 w-4 mt-0.5 text-[color:var(--pine)]" />
                    <a href="https://linkedin.com/in/nfredmond" target="_blank" rel="noopener noreferrer" className="font-semibold text-[color:var(--pine)] hover:underline">
                      linkedin.com/in/nfredmond
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[color:var(--ink)] mb-3">Response Expectations</h3>
                  <div className="flex items-start gap-3 text-sm text-[color:var(--foreground)]/78">
                    <Clock className="h-4 w-4 mt-0.5 text-[color:var(--pine)]" />
                    <span>Typical response: 1–2 business days. For urgent matters, email directly.</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[color:var(--line)] bg-[color:var(--fog)]/75 text-[color:var(--ink)] dark:border-white/15 dark:bg-[#101c27] dark:text-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[color:var(--ink)] dark:text-white">Discovery First</h3>
                  <p className="mt-2 text-sm text-[color:var(--foreground)]/78 dark:text-white/78">
                    Every new engagement begins with a scoped intake so recommendations remain realistic, fair, and executable.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
