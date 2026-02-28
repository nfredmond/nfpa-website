'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Download, FileText, Search } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const fundingPrograms = [
  {
    program: 'Active Transportation Program (ATP)',
    agency: 'California Transportation Commission (CTC)',
    category: 'Bike/Ped, SRTS, Planning/Capital',
    cycle: 'Biennial; Call ~Spring/Summer; Awards ~Winter',
    nextWindow: '2026 Cycle – Call ~Spring/Summer (TBD)',
    localMatch: 'Varies; disadvantaged communities often exempt',
    notes: 'Score emphasis on safety, equity, connectivity, and school access.',
  },
  {
    program: 'Highway Safety Improvement Program (HSIP)',
    agency: 'Caltrans/CTC',
    category: 'Systemic + spot safety projects',
    cycle: 'Every ~2 years',
    nextWindow: '2026 (TBD)',
    localMatch: '10% typical',
    notes: 'Requires crash-data-backed countermeasure justification.',
  },
  {
    program: 'Carbon Reduction Program (CRP)',
    agency: 'Caltrans/CTC/MPOs',
    category: 'VMT and emissions reduction',
    cycle: 'Annual/Biennial by region',
    nextWindow: 'Regional windows 2025–2026 (TBD)',
    localMatch: 'Varies',
    notes: 'Strong quantifiable GHG/VMT logic materially improves competitiveness.',
  },
  {
    program: 'FTA Section 5339 Bus & Bus Facilities',
    agency: 'Federal Transit Administration',
    category: 'Transit capital and facilities',
    cycle: 'Annual NOFO',
    nextWindow: '2026 NOFO ~Q1–Q2 (TBD)',
    localMatch: '20% typical',
    notes: 'Narrative strength around state-of-good-repair and transition readiness is critical.',
  },
  {
    program: 'Safe Streets and Roads for All (SS4A)',
    agency: 'U.S. DOT',
    category: 'Comprehensive safety action plans + implementation grants',
    cycle: 'Annual NOFO',
    nextWindow: '2026 NOFO (TBD)',
    localMatch: '20% typical (implementation)',
    notes: 'Strong roadway safety problem statements and measurable outcomes are essential.',
  },
  {
    program: 'Tribal Transportation Program (TTP)',
    agency: 'FHWA / BIA',
    category: 'Tribal transportation planning + construction',
    cycle: 'Formula + competitive components',
    nextWindow: 'Annual/Fiscal cycle (varies)',
    localMatch: 'Varies by program component',
    notes: 'Align project scope with tribal priorities, safety outcomes, and long-term O&M feasibility.',
  },
]

const resources = [
  {
    title: 'Capability One-Pager',
    description:
      'Current service overview with explicit attribution that representative project experience was completed at Green DOT Transportation Solutions (Senior Transportation Planner + Project Manager, ~4 years), not by Nat Ford.',
    file: '/NFPA_Capability_OnePager.pdf',
    ready: true,
  },
  {
    title: 'GIS Readiness Assessment',
    description: 'Checklist for agencies preparing to operationalize GIS workflows.',
    file: '#',
    ready: false,
  },
  {
    title: 'Grant Application Playbook',
    description: 'Structured framework for stronger narratives and submission discipline.',
    file: '#',
    ready: false,
  },
]

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredPrograms = fundingPrograms.filter(
    (program) =>
      program.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.agency.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">Resources</span>
            <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Tools, references, and funding intelligence.</h1>
            <p className="mt-5 text-lg text-white/82 max-w-3xl">
              Practical resources for planning teams that need clear direction, strong grant positioning, and reusable
              templates.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/85">
        <Container>
          <div className="relative h-56 overflow-hidden rounded-2xl border border-[color:var(--line)]">
            <Image
              src="/images/site/workshop-maps.jpg"
              alt="Planning workshop maps and collaborative project materials"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1c2a]/65 via-[#0d1c2a]/25 to-transparent" />
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <h2 className="section-title text-4xl md:text-5xl text-[color:var(--ink)]">Downloadable Resources</h2>
          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-5">
            {resources.map((resource) => (
              <Card key={resource.title} hover>
                <CardContent className="p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--sand)] text-[color:var(--pine)]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-[color:var(--ink)]">{resource.title}</h3>
                  <p className="mt-2 text-sm text-[color:var(--foreground)]/75">{resource.description}</p>
                  {resource.ready ? (
                    <>
                      <Button asChild variant="outline" className="mt-5 w-full">
                        <a href={resource.file} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                      {resource.title === 'Capability One-Pager' && (
                        <p className="mt-3 text-xs leading-relaxed text-[color:var(--foreground)]/68">
                          Includes explicit prior-role attribution for Green DOT Transportation Solutions experience.
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="mt-5 rounded-full border border-[color:var(--line)] px-4 py-2 text-center text-xs uppercase tracking-[0.15em] text-[color:var(--foreground)]/55">
                      Coming soon
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="xl" className="bg-[color:var(--fog)]/65 border-y border-[color:var(--line)]">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-7 w-7 text-[color:var(--pine)]" />
              <h2 className="section-title text-4xl text-[color:var(--ink)]">Grant Funding Calendar</h2>
            </div>
            <p className="mb-6 max-w-4xl text-sm text-[color:var(--foreground)]/78">
              Includes federal and California examples. We support nationwide funding strategy and can map this to your state,
              tribal, county/county-equivalent, RTPA, transportation commission, or MPO context.
            </p>

            <div className="relative max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--foreground)]/45" />
              <Input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              {filteredPrograms.map((program, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                      <div>
                        <CardTitle>{program.program}</CardTitle>
                        <CardDescription className="mt-1">{program.agency}</CardDescription>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-[color:var(--sand)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--ink)]">
                        {program.nextWindow}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-[color:var(--foreground)]/55 text-xs uppercase tracking-[0.12em]">Category</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{program.category}</p>
                      </div>
                      <div>
                        <p className="text-[color:var(--foreground)]/55 text-xs uppercase tracking-[0.12em]">Cycle</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{program.cycle}</p>
                      </div>
                      <div>
                        <p className="text-[color:var(--foreground)]/55 text-xs uppercase tracking-[0.12em]">Local match</p>
                        <p className="mt-1 text-[color:var(--foreground)]/82">{program.localMatch}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] p-3 text-sm text-[color:var(--foreground)]/78">
                      <span className="font-semibold text-[color:var(--ink)]">Notes:</span> {program.notes}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPrograms.length === 0 && (
              <Card>
                <CardContent className="p-10 text-center text-[color:var(--foreground)]/65">No programs match your search.</CardContent>
              </Card>
            )}
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--fog)]/78 px-6 py-10 text-center text-[color:var(--ink)] dark:bg-[#101c27] dark:text-white">
            <h2 className="section-title text-4xl text-[color:var(--ink)] dark:text-white md:text-5xl">Need a grant strategy partner?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--foreground)]/82 dark:text-white/80">
              We can help prioritize opportunities, shape narratives, and build a submission plan that your team can execute.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="secondary" size="lg">
                <Link href="/services/grants">Grant Services</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[color:var(--line)] text-[color:var(--ink)] hover:border-[color:var(--pine)] hover:bg-[color:var(--background)] hover:text-[color:var(--pine)] dark:border-white/35 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
