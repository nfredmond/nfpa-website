/**
 * Sierra County RTP Case Study
 */

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sierra County RTP - Case Study',
  description: 'Data-driven performance targets and fiscally constrained investment roadmap for Sierra County.',
}

const metrics = [
  { label: 'Planning Period', value: '10 years' },
  { label: 'Projects Identified', value: 'Grant-ready pipeline' },
  { label: 'Funding Sources', value: 'SB-1, IIJA, SHOPP' },
  { label: 'Performance Areas', value: 'Safety, Preservation, Access' },
]

export default function SierraRTPCaseStudy() {
  return (
    <>
      {/* Header */}
      <Section spacing="md" className="bg-[#F1F5F9]">
        <Container>
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/projects">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Projects
            </Link>
          </Button>
          
          <div className="max-w-4xl">
            <div className="text-sm text-[#D4A63F] font-medium mb-2">Sierra County, CA • 2024</div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4 leading-tight">
              Sierra County RTP: Data-Driven Targets & Funding Path
            </h1>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-[#0F172A] border border-gray-200">
                Transportation Planning
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-[#0F172A] border border-gray-200">
                GIS Analysis
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-[#0F172A] border border-gray-200">
                Funding Strategy
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Metrics */}
      <Section spacing="md" className="bg-white border-b border-gray-200">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#1F4E2E] mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Content */}
      <Section spacing="xl">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Context */}
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Context</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Rural, high-elevation county with aging infrastructure, limited transit, and seasonal 
                tourism pressures. Sierra County needed a clear pathway to maintain existing transportation 
                assets while addressing safety concerns and improving access for residents and visitors.
              </p>
            </div>

            {/* Challenge */}
            <Card className="bg-[#F1F5F9]">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Challenge</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Establish realistic performance targets and a prioritized investment path under tight 
                  fiscal constraints. The county needed defensible project selection criteria and clear 
                  alignment with state and federal funding programs to maximize competitive grant success.
                </p>
              </CardContent>
            </Card>

            {/* Approach */}
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Approach</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-[#1F4E2E] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                      Data Integration & Analysis
                    </h3>
                    <p className="text-gray-700">
                      Integrated ACS/DOF growth trends, HPMS traffic data, SWITRS safety records, and 
                      maintenance backlogs into a PostGIS model for comprehensive analysis.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-[#1F4E2E] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                      Interactive Visualization
                    </h3>
                    <p className="text-gray-700">
                      Built Mapbox GL views and simple dashboards to pressure-test targets and funding 
                      scenarios with county staff and decision-makers.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-[#1F4E2E] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                      Grant Alignment
                    </h3>
                    <p className="text-gray-700">
                      Developed project narratives tied to specific outcomes (safety, preservation, access) 
                      and aligned with likely funding sources including SB-1, IIJA, and SHOPP coordination.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Outputs */}
            <div className="bg-white border-2 border-[#D4A63F] rounded-lg p-8">
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Outputs</h2>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-[#D4A63F] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Performance targets tables with defensible baselines and 10-year goals</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-[#D4A63F] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Fiscally constrained project list prioritized by scoring criteria</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-[#D4A63F] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Grant-ready narratives tied to measurable outcomes</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-[#D4A63F] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Interactive web map for public engagement and stakeholder coordination</span>
                </li>
              </ul>
            </div>

            {/* Outcomes */}
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Outcomes</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                A clear 10-year roadmap aligning projects with likely funding sources (SB-1, IIJA, SHOPP 
                coordination), improving board and Caltrans alignment and speeding near-term applications.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The data-driven approach provided audit-ready documentation and reproducible workflows, 
                enabling annual updates and responsive adjustments as funding opportunities evolve.
              </p>
            </div>

            {/* Credits */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Project Role</h3>
                <p className="text-gray-700">
                  Lead author & GIS analysis; collaborators: Sierra County transportation staff and Caltrans District 2 partners.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section spacing="lg" className="bg-[#1F4E2E] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Similar project in mind?
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Let's discuss how data-driven planning can support your community's transportation goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#1F4E2E]">
                <Link href="/projects">View More Projects</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

