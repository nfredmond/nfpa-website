/**
 * Resources Page
 * Funding calendar and downloadable resources
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, FileText, Calendar, Search } from 'lucide-react'

const fundingPrograms = [
  {
    program: 'Active Transportation Program (ATP)',
    agency: 'California Transportation Commission (CTC)',
    category: 'Bike/Ped, SRTS, Planning/Capital',
    cycle: 'Biennial; Call ~Spring/Summer; Awards ~Winter',
    nextWindow: '2026 Cycle – Call ~2026-04 to 2026-07 (TBD)',
    localMatch: 'Varies; disadvantaged communities often exempt',
    notes: 'Score emphasis on safety, equity, network connectivity, school access; strong exhibits + public engagement help.',
  },
  {
    program: 'Highway Safety Improvement Program (HSIP)',
    agency: 'Caltrans/CTC',
    category: 'Systemic & spot safety; low-cost countermeasures',
    cycle: 'Every ~2 years; Calls mid-year',
    nextWindow: '2026 (TBD)',
    localMatch: '10% typical',
    notes: 'Requires data-driven crash justifications; proven countermeasures list.',
  },
  {
    program: 'Carbon Reduction Program (CRP)',
    agency: 'Caltrans/CTC/MPOs',
    category: 'VMT/Emissions reduction projects',
    cycle: 'Annual/Biennial (varies by region)',
    nextWindow: '2025–2026 windows via MPOs (TBD)',
    localMatch: 'Varies',
    notes: 'Strong linkage to quantifiable GHG/VMT reductions; readiness matters.',
  },
  {
    program: 'CMAQ (Congestion Mitigation and Air Quality)',
    agency: 'MPOs/CTC',
    category: 'Air quality & congestion reduction',
    cycle: 'Programmed by MPOs; rolling',
    nextWindow: 'Annual programming windows',
    localMatch: 'Typically 11.47%',
    notes: 'Coordinate early with MPO; emissions benefit methodology required.',
  },
  {
    program: 'SB-1 Local Partnership Program (LPP)',
    agency: 'CTC',
    category: 'Capital projects; jurisdictions with dedicated revenues',
    cycle: 'Annual/biannual cycles',
    nextWindow: '2025–2026 (TBD)',
    localMatch: 'At least 1:1 with local/other',
    notes: 'Competitive and formula subprograms; shovel-ready projects score well.',
  },
  {
    program: 'FTA Section 5339 Bus & Bus Facilities',
    agency: 'Federal Transit Administration',
    category: 'Transit capital; facilities, fleet, charging',
    cycle: 'Annual NOFO (Winter–Spring)',
    nextWindow: '2026 NOFO ~Q1–Q2 2026 (TBD)',
    localMatch: '20% typical (can vary w/ flex/other)',
    notes: 'Strong narrative on state of good repair, resiliency, and ZEB transition.',
  },
  {
    program: 'FTA Section 5311 Rural Area Formula',
    agency: 'FTA/State DOT (Caltrans DRMT)',
    category: 'Rural transit operating/capital',
    cycle: 'Annual; state-managed',
    nextWindow: 'FY 2026 programming via Caltrans DRMT',
    localMatch: 'Varies by use',
    notes: 'Coordinate with regional apportionments and STIP/locals.',
  },
  {
    program: 'FTA Section 5310 Enhanced Mobility',
    agency: 'FTA/State (Caltrans)',
    category: 'Mobility for seniors/people with disabilities',
    cycle: 'Annual/Biennial (state cycles)',
    nextWindow: '2025–2026 Caltrans call (TBD)',
    localMatch: '20% capital; 50% operating (typical)',
    notes: 'Coordinated plan consistency; vehicles & mobility mgmt common.',
  },
  {
    program: 'TIRCP (Transit & Intercity Rail Capital Program)',
    agency: 'CalSTA/CTC',
    category: 'Large transit capital & integration',
    cycle: 'Biennial, funding-dependent',
    nextWindow: 'TBD',
    localMatch: 'Leverage expected',
    notes: 'Requires strong GHG reductions and regional integration.',
  },
]

const resources = [
  {
    title: 'Capability One-Pager',
    description: 'Quick overview of services, experience, and why us',
    icon: FileText,
    file: '/NFPA_Capability_OnePager.pdf',
  },
  {
    title: 'GIS Readiness Assessment',
    description: 'Checklist for small municipalities considering GIS implementation',
    icon: FileText,
    file: '#', // TODO: Create this
  },
  {
    title: 'Grant Application Guide',
    description: 'Complete guide to preparing competitive applications',
    icon: FileText,
    file: '#', // TODO: Create this
  },
]

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  
  const filteredPrograms = fundingPrograms.filter(program =>
    program.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.agency.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <>
      <Section spacing="lg" className="bg-gradient-to-b from-[#F1F5F9] to-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
              Planning Resources
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Grant funding calendar and downloadable guides for Northern California planning
            </p>
          </div>
        </Container>
      </Section>

      {/* Downloadable Resources */}
      <Section spacing="xl">
        <Container>
          <h2 className="text-3xl font-bold text-[#0F172A] mb-8 text-center">
            Downloadable Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <Card key={resource.title} hover>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#1F4E2E] rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <a href={resource.file} download>
                        <Download className="mr-2 w-4 h-4" />
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Funding Calendar */}
      <Section spacing="xl" className="bg-[#F1F5F9]">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-8 h-8 text-[#1F4E2E]" />
              <h2 className="text-3xl font-bold text-[#0F172A]">
                Grant Funding Calendar
              </h2>
            </div>
            
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredPrograms.map((program, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{program.program}</CardTitle>
                        <div className="text-sm text-gray-600">{program.agency}</div>
                      </div>
                      <div className="text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#D4A63F] text-[#0F172A] font-medium">
                          {program.nextWindow}
                        </span>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{program.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-[#0F172A]">Typical Cycle:</span>
                        <p className="text-gray-600">{program.cycle}</p>
                      </div>
                      <div>
                        <span className="font-medium text-[#0F172A]">Local Match:</span>
                        <p className="text-gray-600">{program.localMatch}</p>
                      </div>
                    </div>
                    {program.notes && (
                      <div className="mt-4 p-3 bg-[#F1F5F9] rounded-md">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-[#0F172A]">Notes:</span> {program.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredPrograms.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-600">No programs match your search.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section spacing="lg">
        <Container>
          <div className="bg-[#1F4E2E] text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Need Help with Grant Applications?
            </h2>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
              We can help identify opportunities, develop narratives, and assemble competitive applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/services/grants">Grant Services</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#1F4E2E]">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

