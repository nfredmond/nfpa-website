/**
 * Process Page
 * Capture → Compute → Communicate
 */

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, Database, MessageSquare, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Process',
  description: 'Capture → Compute → Communicate: Our three-step pipeline for clear, actionable planning deliverables.',
}

const steps = [
  {
    number: '1',
    title: 'Capture',
    icon: Camera,
    description: 'Data collection and field documentation',
    items: [
      'Plan: flight plan, authorizations, safety checklist',
      'Collect: drone imagery with 75/70 overlap (typical), control/check points where needed',
      'Context: counts, speeds, land use, policy and constraints',
    ],
    color: 'bg-[#1F4E2E]',
  },
  {
    number: '2',
    title: 'Compute',
    icon: Database,
    description: 'Analysis and technical processing',
    items: [
      'Photogrammetry: orthomosaics, DSM/DTM, point clouds, 3D meshes',
      'GIS: PostGIS modeling (access, safety, suitability, VMT levers)',
      'QA/QC: CRS standards, versioning, reproducible SQL/ETL; accuracy notes attached to each deliverable',
    ],
    color: 'bg-[#D4A63F]',
  },
  {
    number: '3',
    title: 'Communicate',
    icon: MessageSquare,
    description: 'Clear deliverables and decision support',
    items: [
      'Web maps & dashboards (Mapbox GL + Next.js)',
      'Cross-sections & before/after visuals for boards and the public',
      'Grant packaging: readiness checklists, benefits framing, cost bands',
      'Client portal: milestones, sign-offs, and change log',
    ],
    color: 'bg-[#4C84F7]',
  },
]

export default function ProcessPage() {
  return (
    <>
      <Section spacing="lg" className="bg-gradient-to-b from-[#F1F5F9] to-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
              Our Process
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-4">
              Capture → Compute → Communicate
            </p>
            <p className="text-lg text-gray-600">
              A three-step pipeline so agencies can trust what they see and act quickly.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="space-y-12 max-w-5xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative">
                  <Card>
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-2xl`}>
                            {step.number}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <Icon className="w-6 h-6 text-[#1F4E2E] mt-1" />
                            <div>
                              <h2 className="text-3xl font-bold text-[#0F172A] mb-2">
                                {step.title}
                              </h2>
                              <p className="text-lg text-gray-600 mb-4">
                                {step.description}
                              </p>
                            </div>
                          </div>
                          
                          <ul className="space-y-3">
                            {step.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex gap-3 items-start">
                                <ArrowRight className="w-5 h-5 text-[#D4A63F] flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-6">
                      <div className="w-px h-8 bg-gray-300"></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-[#F1F5F9]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white border-2 border-[#D4A63F]">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                  Deliverable Clarity
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Every figure and table traces back to the data and methods that produced it.
                </p>
                <Button asChild size="lg">
                  <Link href="/contact">Discuss Your Project</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  )
}

