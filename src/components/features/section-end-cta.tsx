import * as React from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'

export interface SectionEndCTAProps {
  heading: string
  subhead?: string
  primary: { href: string; label: React.ReactNode }
  secondary?: { href: string; label: React.ReactNode }
}

export function SectionEndCTA({ heading, subhead, primary, secondary }: SectionEndCTAProps) {
  return (
    <Section
      spacing="lg"
      className="border-y border-[color:var(--line)] bg-[color:var(--sand)]/45 dark:bg-[#101c27]"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title text-4xl text-[color:var(--ink)] dark:text-white md:text-5xl">
            {heading}
          </h2>
          {subhead ? (
            <p className="mt-4 text-lg text-[color:var(--foreground)]/82 dark:text-white/80">
              {subhead}
            </p>
          ) : null}
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={primary.href}>{primary.label}</Link>
            </Button>
            {secondary ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[color:var(--line)] text-[color:var(--ink)] hover:border-[color:var(--pine)] hover:bg-[color:var(--background)] hover:text-[color:var(--pine)] dark:border-white/35 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  )
}
