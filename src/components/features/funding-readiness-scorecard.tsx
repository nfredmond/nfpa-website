'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  fundingReadinessBands,
  fundingReadinessQuestions,
  fundingReadinessScoringLabels,
} from '@/data/funding-readiness-scorecard'

const maxScore = fundingReadinessQuestions.length * 2

function getBand(score: number) {
  return fundingReadinessBands.find((band) => score >= band.min && score <= band.max) || fundingReadinessBands[0]
}

export function FundingReadinessScorecard() {
  const [answers, setAnswers] = React.useState<Record<string, number | null>>(() =>
    Object.fromEntries(fundingReadinessQuestions.map((question) => [question.id, null]))
  )

  const answeredCount = fundingReadinessQuestions.filter((question) => answers[question.id] !== null).length
  const isComplete = answeredCount === fundingReadinessQuestions.length
  const score = fundingReadinessQuestions.reduce((sum, question) => sum + (answers[question.id] ?? 0), 0)
  const band = getBand(score)
  const progress = Math.round((answeredCount / fundingReadinessQuestions.length) * 100)
  const scoreProgress = Math.round((score / maxScore) * 100)

  const reset = () => {
    setAnswers(Object.fromEntries(fundingReadinessQuestions.map((question) => [question.id, null])))
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.72fr_0.28fr]">
      <div className="space-y-4">
        {fundingReadinessQuestions.map((question, index) => (
          <Card key={question.id} className="overflow-visible">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground)]/62">
                    Question {index + 1} · {question.domain}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[color:var(--ink)]">{question.prompt}</h3>
                  <p className="mt-2 max-w-3xl text-sm text-[color:var(--foreground)]/74">{question.note}</p>
                </div>
                <span className="inline-flex rounded-full border border-[color:var(--line)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]/72">
                  {answers[question.id] === null ? 'Unscored' : `${answers[question.id]} / 2`}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                {fundingReadinessScoringLabels.map((option) => {
                  const checked = answers[question.id] === option.value

                  return (
                    <label
                      key={option.value}
                      className={[
                        'block cursor-pointer rounded-2xl border p-4 transition',
                        checked
                          ? 'border-[color:var(--pine)] bg-[color:var(--sand)]/45 shadow-sm'
                          : 'border-[color:var(--line)] bg-[color:var(--background)] hover:border-[color:var(--pine)]/45',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        className="sr-only"
                        checked={checked}
                        onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
                      />
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-base font-semibold text-[color:var(--ink)]">{option.label}</span>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--fog)] text-sm font-semibold text-[color:var(--ink)]">
                          {option.value}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[color:var(--foreground)]/74">{option.description}</p>
                    </label>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="xl:sticky xl:top-24 xl:self-start">
        <Card className="border-[color:var(--line)] bg-[color:var(--background)]">
          <CardContent className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground)]/62">
              Live result
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">Funding readiness snapshot</h3>
            <p className="mt-2 text-sm text-[color:var(--foreground)]/76">
              This is a self-assessment, not a guarantee of award. Use it to identify the next gaps to close before a funding push.
            </p>

            <div className="mt-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--fog)]/7 px-4 py-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/62">Questions answered</p>
                  <p className="mt-1 text-3xl font-semibold text-[color:var(--ink)]">
                    {answeredCount}
                    <span className="text-lg text-[color:var(--foreground)]/55">/{fundingReadinessQuestions.length}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/62">Current score</p>
                  <p className="mt-1 text-3xl font-semibold text-[color:var(--ink)]">
                    {score}
                    <span className="text-lg text-[color:var(--foreground)]/55">/{maxScore}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[color:var(--line)]/45">
                <div className="h-full rounded-full bg-[color:var(--pine)] transition-all duration-300" style={{ width: `${isComplete ? scoreProgress : progress}%` }} />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--sand)]/38 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/62">Result band</p>
              <h4 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{isComplete ? band.name : 'Complete all questions to reveal your band'}</h4>
              <p className="mt-1 text-sm font-semibold text-[color:var(--pine)]">{isComplete ? band.rangeLabel : '10 questions · 20 points total'}</p>
              <p className="mt-3 text-sm text-[color:var(--foreground)]/78">
                {isComplete
                  ? band.summary
                  : 'Answer each question using the same standard: not in place, partial, or ready.'}
              </p>
              <p className="mt-3 text-sm text-[color:var(--foreground)]/78">
                {isComplete
                  ? band.guidance
                  : 'When complete, you will see a plain-English result and a recommended next step.'}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/contact/funding-readiness">
                  Request a funding readiness review <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <a href="/Funding_Readiness_Scorecard_Worksheet.pdf" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download worksheet PDF
                </a>
              </Button>
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-4 w-full rounded-full border border-[color:var(--line)] px-4 py-2.5 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
            >
              Reset assessment
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
