/**
 * Urban & Transportation Planning Service Page
 */

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { CheckCircle, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Urban & Transportation Planning Services',
  description: 'Expert regional transportation plans, active transportation plans, VMT analysis, and carbon reduction programs for Northern California communities.',
}

const benefits = [
  {
    title: 'Clear Direction for Decision-Makers',
    description: 'Translate complex mobility data into board-ready recommendations that councilmembers and commissioners can understand and act on.',
  },
  {
    title: 'Grant-Ready Project Lists',
    description: 'Every plan includes prioritized, costed projects aligned with ATP, HSIP, SB-1, and IIJA funding cycles.',
  },
  {
    title: 'Data-Driven Outcomes',
    description: 'Performance targets, VMT screens, and safety analysis backed by reproducible GIS/SQL workflows.',
  },
  {
    title: 'Fast Time-to-Insight',
    description: 'Automated figure and table generation means less waiting for drafts and faster plan delivery.',
  },
]

const process = [
  {
    step: '1',
    name: 'Discovery & Data Assembly',
    description: 'Gather crash data (SWITRS/TIMS), traffic counts (HPMS/Caltrans), Census/ACS demographics, existing plans, and local priorities.',
    benefit: 'Ensures analysis reflects real conditions and community goals.',
  },
  {
    step: '2',
    name: 'Analysis & Screening',
    description: 'Run network gap analysis, safety hotspot identification, VMT modeling, and equity screens using PostGIS and proven methods.',
    benefit: 'Identifies high-value projects with defensible scoring.',
  },
  {
    step: '3',
    name: 'Scenario Development',
    description: 'Model alternatives with cross-sections, before/after visuals, cost bands, and phasing tied to funding windows.',
    benefit: 'Helps boards visualize trade-offs and select preferred directions.',
  },
  {
    step: '4',
    name: 'Plan Assembly & Review',
    description: 'Draft plan with narrative, maps, tables, and appendices; coordinate review with Caltrans, stakeholders, and public comment.',
    benefit: 'Transparent, auditable documentation ready for adoption.',
  },
  {
    step: '5',
    name: 'Implementation Support',
    description: 'Post-adoption grant application assistance, project scoping, and annual update guidance.',
    benefit: "Plans don't sit on shelves—they turn into funded projects.",
  },
]

const deliverables = [
  'Adopted Regional Transportation Plan (RTP) or Active Transportation Plan (ATP)',
  'Interactive web map with project locations and filters',
  'Fiscally constrained project list with cost estimates and funding sources',
  'Performance target tables (safety, pavement, accessibility)',
  'VMT or carbon reduction analysis with implementation strategies',
  'Before/after concept visualizations and complete streets cross-sections',
  'Public engagement summary and board presentation materials',
  'Grant application support package (narratives, exhibits, benefit-cost framing)',
]

const relatedProjects = [
  {
    title: 'Sierra County RTP',
    description: 'Data-driven targets and funding roadmap',
    href: '/projects/sierra-rtp',
  },
  {
    title: 'Del Norte County ATP',
    description: 'Coastal gaps to grant-ready projects',
    href: '/projects/del-norte-atp',
  },
  {
    title: 'Tehama County VMT & CIP',
    description: 'Carbon reduction implementation program',
    href: '/projects/tehama-vmt',
  },
]

export default function PlanningServicePage() {
  return (
    <>
      {/* Hero Section */}
      <Section spacing="lg" className="bg-gradient-to-b from-[#F1F5F9] to-white">
        <Container size="lg">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm text-[#D4A63F] font-medium mb-4">Urban & Transportation Planning</div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
              Turn mobility challenges into fundable, buildable solutions
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              From Regional Transportation Plans to Active Transportation Plans, we combine data-driven 
              analysis with clear communication to deliver plans that boards adopt and funders support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/contact">Request Information Package</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">View Planning Projects</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Benefits Section */}
      <Section spacing="xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardHeader>
                  <div className="w-10 h-10 bg-[#1F4E2E] rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* How It Works Section */}
      <Section spacing="xl" className="bg-[#F1F5F9]">
        <Container>
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-700">
              A proven five-step process that takes your community from data to decision
            </p>
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            {process.map((item) => (
              <Card key={item.step}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#D4A63F] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#0F172A] mb-2">{item.name}</h3>
                      <p className="text-gray-700 mb-3">{item.description}</p>
                      <p className="text-sm text-[#1F4E2E] font-medium">
                        <CheckCircle className="inline w-4 h-4 mr-1" />
                        {item.benefit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* What You Get Section */}
      <Section spacing="xl">
        <Container>
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
              What You Get
            </h2>
            <p className="text-lg text-gray-700">
              Complete planning deliverables ready for adoption and implementation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {deliverables.map((item) => (
              <div key={item} className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-[#1F4E2E] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Related Projects Section */}
      <Section spacing="xl" className="bg-[#F1F5F9]">
        <Container>
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
              See It In Action
            </h2>
            <p className="text-lg text-gray-700">
              Recent planning projects across Northern California
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((project) => (
              <Card key={project.title} hover>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={project.href}>
                      View case study <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg">
        <Container>
          <div className="bg-[#1F4E2E] text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to start your planning project?
            </h2>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
              Schedule a free consultation to discuss your community's needs, timeline, 
              and funding opportunities.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

