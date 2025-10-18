/**
 * FAQ Page
 * Frequently Asked Questions
 */

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Common questions about our urban planning, GIS, aerial mapping, and grant services.',
}

const faqs = [
  {
    question: 'What services do you provide?',
    answer: 'Urban & transportation planning (RTP/ATP, corridor strategies, speed management), GIS & analytics (PostGIS, suitability/accessibility), aerial mapping & photogrammetry (orthomosaics, DSM/DTM, point clouds/meshes), grant strategy & writing (5339/5311/5310, ATP, CRP, SB-1, IIJA), and AI-enabled documentation (automated reports, figure/table pipelines, citation QA).',
  },
  {
    question: 'Are you Part 107 certified and insured?',
    answer: 'Yes—FAA Part 107 operations with appropriate insurance. Flights in restricted airspace are conducted only with authorization and site-specific risk checks.',
  },
  {
    question: 'Do you provide survey-grade measurements?',
    answer: 'We deliver planning-grade mapping by default. When survey-grade accuracy is required, we include ground control/check points and/or partner with a licensed surveyor—clearly labeled in the deliverables.',
  },
  {
    question: 'What formats do you deliver?',
    answer: 'Common outputs: GeoPackage/GeoJSON, PostGIS schemas, Web maps (Mapbox GL), PDFs, DOCX, orthomosaics (GeoTIFF/tiles), DSM/DTM, point clouds (LAS/LAZ), and textured 3D meshes (OBJ/GLB).',
  },
  {
    question: 'How do client portals work?',
    answer: 'Clients get role-based access (Supabase Auth) to a project page with files, map links, messages, and sign-offs. Signed URLs protect sensitive deliverables.',
  },
  {
    question: 'What do you need from clients to start?',
    answer: 'A point of contact, project location or study area, goals and constraints, any existing data (shapefiles, counts, policies), key dates, and funding targets. Our intake wizard collects this up front.',
  },
  {
    question: 'What is your typical timeline?',
    answer: 'Depends on scope. Example ranges: concept cross-sections (1–2 weeks), small corridor studies (4–8 weeks), county ATP add-ons (8–16 weeks). We provide a schedule with milestones and review windows.',
  },
  {
    question: 'What about privacy and sensitive areas?',
    answer: 'We avoid imagery capture over private backyards/sensitive sites unless necessary and authorized. We comply with local/FAA restrictions and redact private information in public-facing graphics.',
  },
  {
    question: 'Where do you work?',
    answer: 'Based near Grass Valley, CA, with on-site capture across Northern California and remote support everywhere.',
  },
  {
    question: "What don't you do?",
    answer: "We don't provide legal land surveying or set property boundaries unless a licensed partner is explicitly engaged. We also avoid speculative/marketing-only visuals that could be misinterpreted as approved designs.",
  },
]

export default function FAQPage() {
  return (
    <>
      <Section spacing="lg" className="bg-gradient-to-b from-[#F1F5F9] to-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Common questions about our services, process, and approach
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-[#0F172A] mb-3">
                    {faq.question}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

