'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  role: ChatRole
  content: string
}

type GrantContext = {
  grantProgram: string
  applicantName: string
  location: string
  applicantType: string
  projectName: string
  fundingNeed: string
  localMatch: string
  goals: string
  scope: string
  equitySafetyNeed: string
  readiness: string
  risks: string
  extraNotes: string
}

type GrantApiResponse = {
  ok: boolean
  reply?: string
  message?: string
  requiresSignup?: boolean
  remainingBudget?: number
  budgetCap?: number
}

const GRANT_PROGRAMS = [
  'ATP (Active Transportation Program)',
  'HSIP (Highway Safety Improvement Program)',
  'RAISE (USDOT)',
  'PROTECT (USDOT)',
  'Safe Streets and Roads for All (SS4A)',
  'FTA 5307 / 5339',
  'TIRCP',
  'Reconnecting Communities / Neighborhood Access',
  'Other (custom)',
]

const INITIAL_CONTEXT: GrantContext = {
  grantProgram: GRANT_PROGRAMS[0],
  applicantName: '',
  location: '',
  applicantType: 'City / County',
  projectName: '',
  fundingNeed: '',
  localMatch: '',
  goals: '',
  scope: '',
  equitySafetyNeed: '',
  readiness: '',
  risks: '',
  extraNotes: '',
}

const VISITOR_ID_KEY = 'nfpa_grant_lab_visitor_id'

function ensureVisitorId() {
  if (typeof window === 'undefined') return 'server'
  const existing = localStorage.getItem(VISITOR_ID_KEY)
  if (existing) return existing

  const id = `grant_guest_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`
  localStorage.setItem(VISITOR_ID_KEY, id)
  return id
}

function buildDraftPrompt(context: GrantContext) {
  return [
    `Please draft a competitive narrative for this grant application using the supplied details.`,
    `Grant program: ${context.grantProgram}`,
    `Applicant: ${context.applicantName || 'Not provided'}`,
    `Location: ${context.location || 'Not provided'}`,
    `Applicant type: ${context.applicantType || 'Not provided'}`,
    `Project name: ${context.projectName || 'Not provided'}`,
    `Funding need: ${context.fundingNeed || 'Not provided'}`,
    `Local match: ${context.localMatch || 'Not provided'}`,
    `Goals: ${context.goals || 'Not provided'}`,
    `Scope: ${context.scope || 'Not provided'}`,
    `Equity and safety need: ${context.equitySafetyNeed || 'Not provided'}`,
    `Readiness: ${context.readiness || 'Not provided'}`,
    `Risks: ${context.risks || 'Not provided'}`,
    `Extra notes: ${context.extraNotes || 'Not provided'}`,
    `Return a polished draft with clear section headings and practical language.`,
  ].join('\n')
}

export default function GrantLabPage() {
  const [context, setContext] = useState<GrantContext>(INITIAL_CONTEXT)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Welcome to the Grant Narrative Lab. Fill in the form, generate a first draft, then chat with me to tighten competitiveness, clarity, and delivery readiness.',
    },
  ])
  const [chatDraft, setChatDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isWorking, setIsWorking] = useState(false)
  const [remainingBudget, setRemainingBudget] = useState<number | null>(null)
  const [budgetCap, setBudgetCap] = useState<number | null>(null)

  const canGenerate = useMemo(() => {
    return Boolean(context.grantProgram && context.goals.trim() && context.scope.trim()) && !isWorking
  }, [context.grantProgram, context.goals, context.scope, isWorking])

  async function requestAssistant(nextMessages: ChatMessage[], mode: 'draft' | 'chat') {
    setError(null)
    setIsWorking(true)

    try {
      const response = await fetch('/api/chat/grant-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: ensureVisitorId(),
          mode,
          context,
          messages: nextMessages.slice(-20),
        }),
      })

      const data = (await response.json()) as GrantApiResponse

      if (!response.ok || !data.ok) {
        if (data.requiresSignup) {
          setError('You reached the guest usage limit. Create a free account to keep working.')
          return
        }
        throw new Error(data.message || 'Grant assistant is currently unavailable.')
      }

      if (typeof data.remainingBudget === 'number') setRemainingBudget(data.remainingBudget)
      if (typeof data.budgetCap === 'number') setBudgetCap(data.budgetCap)

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || '' }])
      }
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unexpected error'
      setError(message)
    } finally {
      setIsWorking(false)
    }
  }

  async function onGenerateDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canGenerate) return

    const prompt = buildDraftPrompt(context)
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: prompt }]
    setMessages(nextMessages)
    await requestAssistant(nextMessages, 'draft')
  }

  async function onSendChat() {
    const text = chatDraft.trim()
    if (!text || isWorking) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setChatDraft('')
    await requestAssistant(nextMessages, 'chat')
  }

  return (
    <>
      <Section spacing="lg" className="hero-mesh text-white">
        <Container>
          <div className="max-w-4xl">
            <span className="pill">New · Grant AI</span>
            <h1 className="section-title mt-5 text-5xl md:text-6xl leading-[0.96] text-white">AI Grant Narrative Lab</h1>
            <p className="mt-5 text-lg text-white/84 max-w-3xl">
              Choose a grant program, enter your criteria, generate a narrative draft, then refine it by chat. Built for Northern California and Bay Area planners who need practical, fundable language.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <Card className="p-0">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Project + Program Inputs</h2>
                <p className="mt-2 text-sm text-[color:var(--foreground)]/78">
                  Complete as much as you have. The assistant will flag assumptions where details are missing.
                </p>

                <form className="mt-5 space-y-4" onSubmit={onGenerateDraft}>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">Grant program</label>
                    <select
                      value={context.grantProgram}
                      onChange={(event) => setContext((prev) => ({ ...prev, grantProgram: event.target.value }))}
                      className="h-11 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                    >
                      {GRANT_PROGRAMS.map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Input label="Applicant" value={context.applicantName} onChange={(event) => setContext((prev) => ({ ...prev, applicantName: event.target.value }))} />
                    <Input label="Location" value={context.location} onChange={(event) => setContext((prev) => ({ ...prev, location: event.target.value }))} />
                    <Input label="Applicant type" value={context.applicantType} onChange={(event) => setContext((prev) => ({ ...prev, applicantType: event.target.value }))} />
                    <Input label="Project name" value={context.projectName} onChange={(event) => setContext((prev) => ({ ...prev, projectName: event.target.value }))} />
                    <Input label="Funding need" value={context.fundingNeed} onChange={(event) => setContext((prev) => ({ ...prev, fundingNeed: event.target.value }))} />
                    <Input label="Local match" value={context.localMatch} onChange={(event) => setContext((prev) => ({ ...prev, localMatch: event.target.value }))} />
                  </div>

                  <textarea
                    value={context.goals}
                    onChange={(event) => setContext((prev) => ({ ...prev, goals: event.target.value }))}
                    placeholder="Project goals and outcomes (required for draft generation)"
                    className="min-h-[88px] w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                  />

                  <textarea
                    value={context.scope}
                    onChange={(event) => setContext((prev) => ({ ...prev, scope: event.target.value }))}
                    placeholder="Scope, location details, phases, and delivery plan (required for draft generation)"
                    className="min-h-[104px] w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                  />

                  <textarea
                    value={context.equitySafetyNeed}
                    onChange={(event) => setContext((prev) => ({ ...prev, equitySafetyNeed: event.target.value }))}
                    placeholder="Safety and equity context"
                    className="min-h-[88px] w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                  />

                  <textarea
                    value={context.readiness}
                    onChange={(event) => setContext((prev) => ({ ...prev, readiness: event.target.value }))}
                    placeholder="Readiness: outreach completed, CEQA/NEPA status, right-of-way, design progress"
                    className="min-h-[80px] w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <textarea
                      value={context.risks}
                      onChange={(event) => setContext((prev) => ({ ...prev, risks: event.target.value }))}
                      placeholder="Risks and constraints"
                      className="min-h-[80px] w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                    />
                    <textarea
                      value={context.extraNotes}
                      onChange={(event) => setContext((prev) => ({ ...prev, extraNotes: event.target.value }))}
                      placeholder="Extra notes, political context, board priorities"
                      className="min-h-[80px] w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={!canGenerate}>
                      {isWorking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      Generate grant narrative draft
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setContext(INITIAL_CONTEXT)
                        setMessages([
                          {
                            role: 'assistant',
                            content:
                              'Welcome to the Grant Narrative Lab. Fill in the form, generate a first draft, then chat with me to tighten competitiveness, clarity, and delivery readiness.',
                          },
                        ])
                        setError(null)
                      }}
                      disabled={isWorking}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Narrative Chat Editor</h2>
                  {typeof remainingBudget === 'number' && typeof budgetCap === 'number' ? (
                    <span className="text-xs text-[color:var(--foreground)]/65">Usage left: {remainingBudget.toLocaleString()} / {budgetCap.toLocaleString()}</span>
                  ) : null}
                </div>

                <p className="mt-2 text-sm text-[color:var(--foreground)]/78">
                  Ask for revisions like “make this more competitive for ATP scoring,” “tighten to 350 words,” or “strengthen rural safety framing.”
                </p>

                <div className="mt-4 max-h-[560px] space-y-3 overflow-y-auto rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)]/80 p-3">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.role === 'assistant'
                          ? 'bg-[color:var(--fog)] text-[color:var(--foreground)]'
                          : 'ml-3 bg-[color:var(--pine)] text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                  {isWorking && (
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-[color:var(--fog)] px-4 py-3 text-sm text-[color:var(--foreground)]/75">
                      <Loader2 className="h-4 w-4 animate-spin" /> Working on your draft...
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <textarea
                    value={chatDraft}
                    onChange={(event) => setChatDraft(event.target.value)}
                    rows={4}
                    placeholder="Ask for edits, tone changes, section additions, or stronger score alignment..."
                    className="min-h-[96px] flex-1 resize-none rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 py-2 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                  />
                  <Button type="button" className="self-end" onClick={onSendChat} disabled={!chatDraft.trim() || isWorking}>
                    {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
                  </Button>
                </div>

                {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

                <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--fog)] p-3 text-sm text-[color:var(--foreground)]/78">
                  Need longer sessions? <Link href="/signup?redirect=/grant-lab" className="font-semibold text-[color:var(--pine)]">Create a free account</Link> for higher usage limits.
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 rounded-2xl border border-[color:var(--line)] bg-[color:var(--fog)]/70 p-5">
            <h3 className="text-lg font-semibold text-[color:var(--ink)]">What this lab is best for</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-[color:var(--foreground)]/80">
              <li>• Rapid first-draft generation customized to a specific grant program</li>
              <li>• Iterative revisions based on scoring criteria, equity/safety framing, and readiness realities</li>
              <li>• Converting rough project notes into coherent, board-ready narrative language</li>
            </ul>
            <Link href="/products" className="mt-4 inline-flex items-center text-sm font-semibold text-[color:var(--pine)]">
              Explore full product stack <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
