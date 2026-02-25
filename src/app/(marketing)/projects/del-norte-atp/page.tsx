import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Del Norte County ATP (Experience Archive)',
  description: 'Prior-employment experience summary for Del Norte County ATP support.',
}

export default function DelNorteATPPage() {
  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <p className="pill">Experience Archive</p>
          <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">Del Norte County ATP</h1>
          <p className="mt-5 max-w-3xl text-lg text-white/82">
            Prior-employment project support focused on converting active transportation network gaps into grant-ready,
            phaseable projects.
          </p>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <p className="text-sm text-[color:var(--foreground)]/75">
            This is an experience attribution page. Full case-study formatting is currently being standardized across the archive.
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Experience Archive
            </Link>
          </Button>
        </Container>
      </Section>
    </>
  )
}
