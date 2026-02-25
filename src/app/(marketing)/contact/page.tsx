'use client'

import * as React from 'react'
import { Clock, Linkedin, Mail, MapPin, Send } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const inquiryTypes = [
  'Planning support',
  'GIS / mapping',
  'Grant strategy',
  'OpenPlan product',
  'Ads automation product',
  'General inquiry',
]

const timelines = ['Immediate (0-30 days)', 'Near-term (1-3 months)', 'Planning horizon (3+ months)']

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = new FormData(e.currentTarget)
    const firstName = String(form.get('firstName') || '')
    const lastName = String(form.get('lastName') || '')
    const email = String(form.get('email') || '')
    const organization = String(form.get('organization') || '')
    const inquiryType = String(form.get('inquiryType') || '')
    const timeline = String(form.get('timeline') || '')
    const description = String(form.get('description') || '')

    const subject = encodeURIComponent(`Website inquiry: ${inquiryType || 'New project'} — ${organization || firstName}`)
    const body = encodeURIComponent(
      [
        `Name: ${firstName} ${lastName}`.trim(),
        `Email: ${email}`,
        `Organization: ${organization}`,
        `Inquiry type: ${inquiryType}`,
        `Timeline: ${timeline}`,
        '',
        'Project details:',
        description,
      ].join('\n')
    )

    window.location.href = `mailto:nathaniel@natfordplanning.com?subject=${subject}&body=${body}`
    setSubmitted(true)
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
                      Submit this form to open a pre-filled email draft. This keeps communication transparent and simple while
                      full CRM routing is finalized.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-5">
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

                      <Button type="submit" size="lg">
                        <Send className="mr-2 h-4 w-4" />
                        Open Email Draft
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--pine)] text-white">
                      <Send className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-[color:var(--ink)]">Draft opened</h3>
                    <p className="mt-3 text-[color:var(--foreground)]/75">
                      If your email client didn’t open automatically, email us directly at{' '}
                      <a className="font-semibold text-[color:var(--pine)]" href="mailto:nathaniel@natfordplanning.com">
                        nathaniel@natfordplanning.com
                      </a>
                      .
                    </p>
                    <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                      Send Another Inquiry
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

              <Card className="bg-[#101c27] text-white border-white/15">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white">Discovery First</h3>
                  <p className="mt-2 text-sm text-white/78">
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
