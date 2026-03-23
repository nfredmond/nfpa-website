import Link from 'next/link'
import { ArrowRight, ClipboardList, Download, FileText } from 'lucide-react'
import type { Metadata } from 'next'
import { FundingReadinessScorecard } from '@/components/features/funding-readiness-scorecard'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  fundingReadinessBands,
  fundingReadinessCommonGaps,
  fundingReadinessQuestions,
} from '@/data/funding-readiness-scorecard'

const domains = Array.from(new Set(fundingReadinessQuestions.map((question) => question.domain)))

export const metadata: Metadata = {
  title: 'Funding Readiness Scorecard',
  description:
    'A practical self-check for agencies, tribes, counties, and RTPAs to assess whether a transportation project package is ready for a focused funding push.',
}

export default function FundingReadinessScorecardPage() {
  return (
    <>
      <Section spacing="lg" className="border-b border-[color:var(--line)] bg-[color:var(--background)]">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.72fr_0.28fr] lg:items-end">
            <div className="max-w-4xl">
              <span className="pill">Resource</span>
              <h1 className="section-title mt-5 text-5xl leading-[0.96] text-[color:var(--ink)] md:text-6xl">
                Funding Readiness Scorecard
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-[color:var(--foreground)]/82">
                A practical self-check for rural transportation agencies, small towns, counties, RTPAs, transportation commissions,
                and tribal governments that need to know whether a project package is actually ready for a funding push.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href="#scorecard">Start the scorecard</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/Funding_Readiness_Scorecard_Worksheet.pdf" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download worksheet
                  </a>
                </Button>
              </div>
            </div>

            <Card className="border-[color:var(--line)] bg-[color:var(--fog)]/42 text-[color:var(--ink)]">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground)]/62">What this is</p>
                <ul className="mt-4 space-y-3 text-sm text-[color:var(--foreground)]/82">
                  <li className="flex items-start gap-2.5">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--copper)]" />
                    <span>10-question readiness check grounded in real application packaging work.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--copper)]" />
                    <span>Plain-English readiness bands: Needs Foundation Work, Almost Ready, and Ready to Pursue.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--copper)]" />
                    <span>Useful for internal alignment before you spend scarce time on a live funding window.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-[color:var(--line)] bg-[color:var(--background)]/84">
        <Container>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.62fr_0.38fr]">
            <div>
              <p className="pill mb-4">How to use it</p>
              <h2 className="section-title text-4xl text-[color:var(--ink)] md:text-5xl">
                Pressure-test the package before the deadline pressure hits.
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-[color:var(--foreground)]/82">
                The scorecard is designed to surface avoidable weakness early: fuzzy scope, shaky cost logic, unorganized evidence,
                unclear approvals, or missing narrative support. It is not a promise of funding. It is a cleaner way to see what still needs work.
              </p>
              <div className="mt-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)] px-5 py-4 text-sm text-[color:var(--foreground)]/78">
                <strong className="text-[color:var(--ink)]">Important note:</strong> This tool is a practical self-assessment. It does not determine grant eligibility,
                regulatory sufficiency, board readiness, or award likelihood on its own.
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground)]/62">Domains covered</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {domains.map((domain) => (
                    <span
                      key={domain}
                      className="inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--sand)]/42 px-3 py-1.5 text-sm font-semibold text-[color:var(--ink)]"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="max-w-3xl">
            <p className="pill mb-4">Result bands</p>
            <h2 className="section-title text-4xl text-[color:var(--ink)] md:text-5xl">Three simple outcomes. Clear next step.</h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {fundingReadinessBands.map((band) => (
              <Card key={band.name} hover className="h-full">
                <CardContent className="flex h-full flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground)]/62">{band.rangeLabel}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">{band.name}</h3>
                  <p className="mt-3 text-sm text-[color:var(--foreground)]/78">{band.summary}</p>
                  <p className="mt-4 text-sm text-[color:var(--foreground)]/78">{band.guidance}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="scorecard" spacing="xl" className="border-y border-[color:var(--line)] bg-[color:var(--fog)]/64">
        <Container>
          <div className="mb-8 max-w-3xl">
            <p className="pill mb-4">Interactive self-assessment</p>
            <h2 className="section-title text-4xl text-[color:var(--ink)] md:text-5xl">Score your current package.</h2>
            <p className="mt-4 text-lg text-[color:var(--foreground)]/82">
              Answer each question using the same standard: not in place, partial, or ready. Once complete, you will see your current readiness band and a recommended next move.
            </p>
          </div>

          <FundingReadinessScorecard />
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="p-6 sm:p-7">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--sand)] text-[color:var(--pine)]">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-[color:var(--ink)]">Common gaps we see</h2>
                <ul className="mt-5 space-y-3">
                  {fundingReadinessCommonGaps.map((gap) => (
                    <li key={gap} className="flex items-start gap-2.5 text-sm text-[color:var(--foreground)]/78">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--copper)]" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 sm:p-7">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--sand)] text-[color:var(--pine)]">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-[color:var(--ink)]">Worksheet download</h2>
                <p className="mt-4 text-[0.98rem] text-[color:var(--foreground)]/78">
                  Prefer an offline version for internal staff review or a board packet prep meeting? Download the worksheet PDF and mark the same ten questions outside the browser.
                </p>
                <ul className="mt-5 space-y-3 text-sm text-[color:var(--foreground)]/78">
                  <li className="flex items-start gap-2.5">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--copper)]" />
                    <span>Same ten scoring questions and result bands as the web version.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--copper)]" />
                    <span>Extra notes space for ownership, missing evidence, and next actions.</span>
                  </li>
                </ul>
                <Button asChild className="mt-6" size="lg">
                  <a href="/Funding_Readiness_Scorecard_Worksheet.pdf" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download worksheet PDF
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="border-y border-[color:var(--line)] bg-[color:var(--sand)]/48">
        <Container>
          <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--background)]/76 px-6 py-10 text-center md:px-10 md:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground)]/62">Next step</p>
            <h2 className="section-title mt-3 text-4xl text-[color:var(--ink)] md:text-5xl">
              Want a tighter view of what to fix first?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--foreground)]/82">
              Nat Ford can help translate your score into a focused action plan: what to define, what evidence to organize, and what pieces need to be submission-ready before the next funding window.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact/funding-readiness">Request funding readiness review</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services/grants">
                  View grant services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
