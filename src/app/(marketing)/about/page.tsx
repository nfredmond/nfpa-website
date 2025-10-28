/**
 * About Page
 * Nat Ford's professional biography and credentials
 */

import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Linkedin, MapPin, Award, Code2, Layers } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Nat Ford',
  description: 'Nathaniel "Nat" Ford Redmond is a Senior Transportation Planner with 8+ years experience in Northern California, specializing in rural planning, GIS, drone photogrammetry, and grant writing.',
}

const expertise = [
  {
    icon: MapPin,
    title: 'Regional & Transportation Planning',
    items: ['RTP/ATP development', 'Complete Streets & wayfinding', 'VMT & carbon reduction', 'Community engagement']
  },
  {
    icon: Layers,
    title: 'GIS & Spatial Analytics',
    items: ['PostGIS databases', 'Interactive dashboards', 'Safety & accessibility analysis', 'Data pipelines & automation']
  },
  {
    icon: Code2,
    title: 'Grant Writing & Funding',
    items: ['FTA 5339/5311/5310', 'ATP, HSIP, CRP, RAISE', 'TIRCP, Clean California', 'Benefit-cost analysis']
  },
]

const priorEmployment = [
  {
    title: 'Senior Transportation Planner',
    employer: 'Green DOT Transportation Solutions',
    years: '2021–2025',
    description: 'Led and contributed to RTPs, ATPs, VMT/CIP integration, and complete streets planning across Sierra, Plumas, Tehama, Del Norte, Calaveras, Alpine, and other Northern California counties.',
    highlights: [
      'Sierra County RTP – performance targets and fiscally constrained roadmap',
      'Tehama County VMT & CIP – carbon reduction implementation',
      'Del Norte ATP – coastal corridors and grant-ready applications',
      'Plumas Transit FTA 5339 – operations hub and fleet transition',
      'Multiple grant applications (ATP Cycles 5-6, RAISE, TIRCP, PROTECT)',
    ]
  },
  {
    title: 'Transportation Coordinator',
    employer: 'gRide (Genentech commuter program)',
    years: '2018–2021',
    description: 'Managed Bay Area commuter programs including first-wave electric buses, ferry service, car/vanpool coordination, coalition meetings, and BART shuttle connectors.',
    highlights: [
      'Coordinated electric bus pilot program deployment',
      'Managed multi-modal transportation network serving thousands',
      'Developed GIS-based commute mapping and analysis',
      'Facilitated regional transportation coalition meetings',
    ]
  },
  {
    title: 'Planning Intern',
    employer: 'San Francisco County Transportation Authority',
    years: '2017–2018',
    description: 'Supported research, report writing, survey design, traffic counts, community workshops, and contributions to ConnectSF and Vision Zero initiatives.',
    highlights: [
      'Contributed to ConnectSF comprehensive planning initiative',
      'Conducted community outreach and workshop facilitation',
      'Performed traffic counts and survey analysis',
      'Supported Vision Zero safety analysis',
    ]
  },
  {
    title: 'Legislative Intern',
    employer: 'Office of Supervisor Jane Kim (District 6, SF)',
    years: '2016–2017',
    description: 'Provided constituent communications, calendar management, meeting support, and event coordination for San Francisco Board of Supervisors office.',
    highlights: [
      'Managed constituent communications and inquiries',
      'Coordinated community meetings and events',
      'Supported policy research and legislative analysis',
    ]
  },
]

const counties = [
  'Sierra', 'Plumas', 'Tehama', 'Del Norte', 'Trinity', 'Alpine', 
  'Calaveras', 'Colusa', 'Siskiyou', 'Shasta', 'Butte', 'Humboldt',
  'El Dorado', 'Placer', 'Napa', 'San Joaquin'
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Section spacing="lg" className="bg-gradient-to-b from-[#F1F5F9] to-white dark:from-gray-900 dark:to-gray-950">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-6 leading-tight">
                Nathaniel "Nat" Ford Redmond
              </h1>
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  Nathaniel "Nat" Ford Redmond is a Senior Transportation Planner with 8+ years of experience 
                  serving Northern California communities. With a Master of Urban Planning (MUP) from San Jose 
                  State University and a B.A. in Urban Studies & Planning from San Francisco State University, 
                  Nathaniel specializes in rural and small-city contexts where resourcefulness and community engagement 
                  are essential.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  His work spans Regional Transportation Plans, Active Transportation Plans, VMT and carbon 
                  reduction analysis, complete streets design, and grant applications for FTA, ATP, RAISE, and 
                  other competitive programs. Nathaniel combines technical expertise in GIS, drone photogrammetry, 
                  and data analytics with plain-English communication that helps decision-makers move from 
                  analysis to action.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  He's an FAA-certified Remote Pilot, APA member, and Sponsorship Director for the Sacramento 
                  Valley Section of APA. Based in the Sierra Foothills near Grass Valley, Nathaniel serves public 
                  agencies and mission-driven teams throughout the region with expertise built through diverse 
                  roles spanning rural planning, Bay Area transportation coordination, and San Francisco policy work.
                </p>
              </div>
              
              <div className="flex gap-4 mt-8">
                <Button asChild size="lg">
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://linkedin.com/in/nfredmond" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 w-5 h-5" />
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 dark:text-white">Contact</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#1F4E2E] dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium dark:text-white">Sierra Foothills</div>
                        <div className="text-gray-600 dark:text-gray-400">Near Grass Valley, CA</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-[#1F4E2E] dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <a href="mailto:nfredmond@gmail.com" className="text-[#1F4E2E] dark:text-green-400 hover:underline">
                          nfredmond@gmail.com
                        </a>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">530.492.9775</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Linkedin className="w-5 h-5 text-[#1F4E2E] dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <a 
                          href="https://linkedin.com/in/nfredmond" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#1F4E2E] dark:text-green-400 hover:underline"
                        >
                          linkedin.com/in/nfredmond
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium mb-2 dark:text-white">Service Area</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Remote-friendly across Northern California with field capture and 
                      on-site facilitation as needed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Education & Credentials */}
      <Section spacing="xl" className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-8">
              Education & Credentials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Education</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-[#0F172A]">Master of Urban Planning (MUP)</div>
                      <div className="text-sm text-gray-600">San José State University</div>
                      <div className="text-sm text-gray-500">Concentration: Transportation Planning</div>
                      <div className="text-xs text-[#D4A63F] mt-1">2018 Bert Muhly Scholarship Recipient</div>
                      <div className="text-xs text-gray-500 mt-1">Led Urban Planning Coalition; Certificate in Transportation & Land Use Planning</div>
                    </div>
                    <div>
                      <div className="font-medium text-[#0F172A]">B.A., Urban Studies & Planning</div>
                      <div className="text-sm text-gray-600">San Francisco State University</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Certifications & Affiliations</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-[#D4A63F] mt-0.5 flex-shrink-0" />
                      <span>FAA Remote Pilot Certificate (Part 107)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-[#D4A63F] mt-0.5 flex-shrink-0" />
                      <span>American Planning Association Member</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-[#D4A63F] mt-0.5 flex-shrink-0" />
                      <span>SVS APA Sponsorship Director</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-[#D4A63F] mt-0.5 flex-shrink-0" />
                      <span>Young Professionals in Transportation Member</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-[#D4A63F] mt-0.5 flex-shrink-0" />
                      <span>Technical Lead, SVS APA Speaker Series</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Expertise Areas */}
      <Section spacing="xl">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
              Core Capabilities
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {expertise.map((area) => {
              const Icon = area.icon
              return (
                <Card key={area.title}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#1F4E2E] rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-3">{area.title}</h3>
                    <ul className="space-y-2">
                      {area.items.map((item) => (
                        <li key={item} className="text-sm text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Prior Employment & Background */}
      <Section spacing="xl" className="bg-[#F1F5F9] dark:bg-gray-900">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
              Background & Prior Roles
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Nathaniel's expertise is built through progressive roles in transportation planning, 
              coordination, and policy across Northern California and the Bay Area.
            </p>
            
            <div className="space-y-6">
              {priorEmployment.map((role) => (
                <Card key={role.employer}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-[#0F172A]">{role.title}</h3>
                        <p className="text-lg text-[#1F4E2E] font-medium">{role.employer}</p>
                      </div>
                      <div className="text-sm text-gray-600 font-medium mt-1 md:mt-0">{role.years}</div>
                    </div>
                    <p className="text-gray-700 mb-4">{role.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#0F172A]">Key Contributions:</p>
                      <ul className="space-y-2">
                        {role.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-3 items-start text-sm text-gray-700">
                            <Award className="w-4 h-4 text-[#D4A63F] flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4">
                For detailed project case studies from prior employment, visit the Projects page.
              </p>
              <Button asChild size="lg">
                <Link href="/projects">View Projects</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Geographic Experience */}
      <Section spacing="xl">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
              Northern California Counties Served
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Deep familiarity with Sierra Valley, I-5 corridor, coastal/forest contexts, mountain towns, 
              and interregional travel patterns across:
            </p>
            <div className="flex flex-wrap gap-3">
              {counties.map((county) => (
                <span 
                  key={county}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#F1F5F9] dark:bg-gray-800 text-[#0F172A] dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                >
                  {county} County
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" className="bg-[#1F4E2E] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let's discuss your project
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Free 30-minute funding feasibility review to explore opportunities and approach
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#1F4E2E]">
                <a href="mailto:nfredmond@gmail.com">Send Email</a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

