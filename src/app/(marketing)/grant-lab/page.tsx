'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Copy, Download, Loader2, Save, Sparkles } from 'lucide-react'
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
  scoringPriorities: string
  tone: 'balanced' | 'technical' | 'executive'
  targetWordCount: number | ''
  sectionFocus: string
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
  scoringPriorities: '',
  tone: 'balanced',
  targetWordCount: '',
  sectionFocus: '',
}

const GREETING_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    'Welcome to the Grant Narrative Lab. Fill in the form, generate a first draft, then chat with me to tighten competitiveness, clarity, and delivery readiness.',
}

const REVISION_CHIPS = [
  'Tighten this narrative for ATP scoring competitiveness.',
  'Rewrite this in a concise executive tone for city council review.',
  'Strengthen equity + safety argument with clearer implementation signals.',
  'Add a stronger risk/mitigation section for delivery credibility.',
  'List assumptions and missing data that would improve scoring strength.',
]

const VISITOR_ID_KEY = 'nfpa_grant_lab_visitor_id'
const STORAGE_KEY = 'nfpa_grant_lab_workspace_v1'
const STORAGE_PREF_KEY = 'nfpa_grant_lab_local_autosave'

function ensureVisitorId() {
  if (typeof window === 'undefined') return 'server'
  const existing = localStorage.getItem(VISITOR_ID_KEY)
  if (existing) return existing

  const id = `grant_guest_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`
  localStorage.setItem(VISITOR_ID_KEY, id)
  return id
}

export default function GrantLabPage() {
  const [context, setContext] = useState<GrantContext>(INITIAL_CONTEXT)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING_MESSAGE])
  const [chatDraft, setChatDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isWorking, setIsWorking] = useState(false)
  const [remainingBudget, setRemainingBudget] = useState<number | null>(null)
  const [budgetCap, setBudgetCap] = useState<number | null>(null)
  const [saveLabel, setSaveLabel] = useState('')
  const [persistLocalDrafts, setPersistLocalDrafts] = useState(false)
  const [mapPreviewUrl, setMapPreviewUrl] = useState<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const pref = localStorage.getItem(STORAGE_PREF_KEY) === '1'
    setPersistLocalDrafts(pref)

    if (!pref) {
      setSaveLabel('Local autosave is off (private mode).')
      return
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as { context?: GrantContext; messages?: ChatMessage[] }
      if (parsed.context) setContext({ ...INITIAL_CONTEXT, ...parsed.context })
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) setMessages(parsed.messages)
    } catch {
      // ignore malformed local cache
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    localStorage.setItem(STORAGE_PREF_KEY, persistLocalDrafts ? '1' : '0')

    if (!persistLocalDrafts) {
      localStorage.removeItem(STORAGE_KEY)
      setSaveLabel('Local autosave is off (private mode).')
      return
    }

    const payload = JSON.stringify({ context, messages })
    localStorage.setItem(STORAGE_KEY, payload)
    setSaveLabel(`Auto-saved locally on this device at ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`)
  }, [context, messages, persistLocalDrafts])

  useEffect(() => {
    const query = context.location.trim()
    if (query.length < 4) {
      setMapPreviewUrl('')
      return
    }

    const timer = window.setTimeout(() => {
      setMapPreviewUrl(`/api/maps/preview?location=${encodeURIComponent(query)}`)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [context.location])

  const canGenerate = useMemo(() => {
    return Boolean(context.grantProgram && context.goals.trim() && context.scope.trim()) && !isWorking
  }, [context.grantProgram, context.goals, context.scope, isWorking])

  const missingRequirements = [
    !context.goals.trim() ? 'Project goals' : null,
    !context.scope.trim() ? 'Project scope' : null,
  ].filter(Boolean) as string[]

  const grantProgramTip = useMemo(() => {
    if (context.grantProgram.includes('ATP')) {
      return 'Tip: Highlight school access, disadvantaged communities, and measurable safety/mode-shift outcomes.'
    }
    if (context.grantProgram.includes('HSIP')) {
      return 'Tip: Include collision patterns, severity trends, and countermeasure logic tied to crash reduction.'
    }
    if (context.grantProgram.includes('SS4A')) {
      return 'Tip: Show Safety Action Plan alignment and implementation readiness for near-term delivery.'
    }
    return 'Tip: Be explicit about readiness, local match strategy, and measurable outcomes.'
  }, [context.grantProgram])

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
          context: {
            ...context,
            targetWordCount: context.targetWordCount || undefined,
            sectionFocus: context.sectionFocus || undefined,
          },
          // Integrity hardening: only user turns are sent from client.
          messages: nextMessages.filter((message) => message.role === 'user').slice(-20),
        }),
      })

      const data = (await response.json()) as GrantApiResponse

      if (!response.ok || !data.ok) {
        if (data.requiresSignup) {
          setError('Your free guest session has ended. Create a free account to continue this thread and keep your draft context.')
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

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: 'Generate first draft using current form context.' }]
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

  async function onQuickRevision(prompt: string) {
    if (isWorking) return
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: prompt }]
    setMessages(nextMessages)
    await requestAssistant(nextMessages, 'chat')
  }

  function resetWorkspace() {
    setContext(INITIAL_CONTEXT)
    setMessages([GREETING_MESSAGE])
    setChatDraft('')
    setError(null)
  }

  function loadSampleProject() {
    setContext({
      ...INITIAL_CONTEXT,
      grantProgram: 'ATP (Active Transportation Program)',
      applicantName: 'Sample City of Sierra Valley',
      location: 'Sierra Valley, California',
      applicantType: 'City / County',
      projectName: 'Main St Safe Routes Corridor',
      fundingNeed: '$2.8M',
      localMatch: '$420k local + in-kind staff support',
      goals: 'Reduce severe injury risk for students and seniors while increasing safe walking/biking access to schools and downtown services.',
      scope:
        'Install high-visibility crossings, close 0.8 miles of sidewalk gaps, add curb ramps, speed feedback signs, and traffic calming at school-adjacent segments.',
      equitySafetyNeed:
        'Corridor serves low-income households and students with limited transportation options; current walking paths require crossing high-speed segments.',
      readiness: 'Concept alignment complete, outreach underway, ROW largely public, design can start within 90 days.',
      risks: 'Seasonal construction window and utility coordination timing.',
      scoringPriorities: 'School safety, disadvantaged community benefit, deliverability, and measurable mode-shift/safety outcomes.',
      tone: 'balanced',
      targetWordCount: 900,
      sectionFocus: '',
      extraNotes: 'Board wants phased implementation fallback if bids come in high.',
    })
  }

  function exportMarkdown() {
    const body = messages
      .map((message) => `## ${message.role === 'assistant' ? 'Assistant' : 'User'}\n\n${message.content}`)
      .join('\n\n---\n\n')

    const header = `# Grant AI Lab Export\n\nGenerated: ${new Date().toISOString()}\n\n`
    const blob = new Blob([header + body], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `grant-lab-export-${new Date().toISOString().slice(0, 10)}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function copyLatestDraft() {
    const latestAssistant = [...messages].reverse().find((message) => message.role === 'assistant')
    if (!latestAssistant?.content || typeof navigator === 'undefined') return

    await navigator.clipboard.writeText(latestAssistant.content)
    setSaveLabel('Copied latest draft')
  }

  async function copyExecutiveSummary() {
    const latestAssistant = [...messages].reverse().find((message) => message.role === 'assistant')
    if (!latestAssistant?.content || typeof navigator === 'undefined') return

    const summarySource = latestAssistant.content.slice(0, 1400)
    const summary = summarySource.length > 420 ? `${summarySource.slice(0, 420)}…` : summarySource
    await navigator.clipboard.writeText(summary)
    setSaveLabel('Copied executive summary')
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
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-[color:var(--foreground)]/70">
            <span>{saveLabel || 'Auto-save active'}</span>
            <button
              type="button"
              onClick={() => setPersistLocalDrafts((value) => !value)}
              className="inline-flex items-center gap-1 rounded-full border border-[color:var(--line)] px-3 py-1 hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
            >
              {persistLocalDrafts ? 'Auto-save: On (this device)' : 'Auto-save: Off (private mode)'}
            </button>
            <button
              type="button"
              onClick={resetWorkspace}
              className="inline-flex items-center gap-1 rounded-full border border-[color:var(--line)] px-3 py-1 hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
            >
              Reset workspace
            </button>
            <button
              type="button"
              onClick={exportMarkdown}
              className="inline-flex items-center gap-1 rounded-full border border-[color:var(--line)] px-3 py-1 hover:border-[color:var(--pine)] hover:text-[color:var(--pine)]"
            >
              <Download className="h-3.5 w-3.5" /> Export .md
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <Card className="p-0">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Project + Program Inputs</h2>
                <p className="mt-2 text-sm text-[color:var(--foreground)]/78">
                  Complete as much as you have. The assistant will flag assumptions where details are missing.
                </p>

                <form className="mt-5 space-y-4" onSubmit={onGenerateDraft}>
                  <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/60">Step 1 of 3 — Program + Applicant Context</p>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">Grant program *</label>
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
                    <p className="mt-1 text-xs text-[color:var(--foreground)]/70">{grantProgramTip}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Input label="Applicant" value={context.applicantName} onChange={(event) => setContext((prev) => ({ ...prev, applicantName: event.target.value }))} />
                    <Input label="Location" value={context.location} onChange={(event) => setContext((prev) => ({ ...prev, location: event.target.value }))} />
                    <Input label="Applicant type" value={context.applicantType} onChange={(event) => setContext((prev) => ({ ...prev, applicantType: event.target.value }))} />
                    <Input label="Project name" value={context.projectName} onChange={(event) => setContext((prev) => ({ ...prev, projectName: event.target.value }))} />
                    <Input label="Funding need" value={context.fundingNeed} onChange={(event) => setContext((prev) => ({ ...prev, fundingNeed: event.target.value }))} />
                    <Input label="Local match capacity" value={context.localMatch} onChange={(event) => setContext((prev) => ({ ...prev, localMatch: event.target.value }))} />
                  </div>

                  {context.location.trim().length >= 4 ? (
                    <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--fog)]/65 p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]/70">Mapbox location preview</p>
                        <p className="text-[11px] text-[color:var(--foreground)]/65">Map centered from location input</p>
                      </div>
                      {mapPreviewUrl ? (
                        <img
                          src={mapPreviewUrl}
                          alt={`Map preview for ${context.location}`}
                          className="h-44 w-full rounded-xl border border-[color:var(--line)] object-cover"
                        />
                      ) : (
                        <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-[color:var(--line)] bg-[color:var(--background)] text-sm text-[color:var(--foreground)]/65">
                          Loading map preview…
                        </div>
                      )}
                      <p className="mt-1 text-[11px] text-[color:var(--foreground)]/60">Map tiles © Mapbox © OpenStreetMap.</p>
                    </div>
                  ) : null}

                  <p className="pt-1 text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/60">Step 2 of 3 — Need, Scope, and Readiness</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <label className="text-sm text-[color:var(--foreground)]/80">
                      Tone
                      <select
                        value={context.tone}
                        onChange={(event) => setContext((prev) => ({ ...prev, tone: event.target.value as GrantContext['tone'] }))}
                        className="mt-1 h-10 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm"
                      >
                        <option value="balanced">Balanced</option>
                        <option value="technical">Technical</option>
                        <option value="executive">Executive</option>
                      </select>
                    </label>

                    <label className="text-sm text-[color:var(--foreground)]/80">
                      Target word count
                      <Input
                        type="number"
                        min={150}
                        max={1800}
                        value={context.targetWordCount}
                        onChange={(event) =>
                          setContext((prev) => ({
                            ...prev,
                            targetWordCount: event.target.value ? Number(event.target.value) : '',
                          }))
                        }
                      />
                    </label>

                    <Input
                      label="Section focus"
                      placeholder="e.g., Equity + Safety"
                      value={context.sectionFocus}
                      onChange={(event) => setContext((prev) => ({ ...prev, sectionFocus: event.target.value }))}
                    />
                  </div>

                  <label className="text-sm text-[color:var(--foreground)]/80">
                    Project goals (required)
                    <textarea
                      value={context.goals}
                      onChange={(event) => setContext((prev) => ({ ...prev, goals: event.target.value }))}
                      placeholder="State outcomes, target users, and why this investment is needed now."
                      className="mt-1 min-h-[88px] w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                    />
                  </label>

                  <label className="text-sm text-[color:var(--foreground)]/80">
                    Project scope (required)
                    <textarea
                      value={context.scope}
                      onChange={(event) => setContext((prev) => ({ ...prev, scope: event.target.value }))}
                      placeholder="Describe location, design elements, delivery phases, and implementation timeline."
                      className="mt-1 min-h-[104px] w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                    />
                  </label>

                  <label className="text-sm text-[color:var(--foreground)]/80">
                    Equity + safety need
                    <textarea
                      value={context.equitySafetyNeed}
                      onChange={(event) => setContext((prev) => ({ ...prev, equitySafetyNeed: event.target.value }))}
                      placeholder="Who benefits most, what safety gaps exist, and what harms are being reduced?"
                      className="mt-1 min-h-[88px] w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                    />
                  </label>

                  <details className="rounded-xl border border-[color:var(--line)] bg-[color:var(--fog)]/55 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-[color:var(--ink)]">Advanced project details (optional)</summary>
                    <p className="mt-1 text-xs text-[color:var(--foreground)]/70">Open this section for readiness, scoring strategy, risk, and political/board context.</p>

                    <div className="mt-3 space-y-3">
                      <textarea
                        value={context.readiness}
                        onChange={(event) => setContext((prev) => ({ ...prev, readiness: event.target.value }))}
                        placeholder="Readiness: outreach completed, CEQA/NEPA status, right-of-way, design progress"
                        className="min-h-[80px] w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                      />

                      <textarea
                        value={context.scoringPriorities}
                        onChange={(event) => setContext((prev) => ({ ...prev, scoringPriorities: event.target.value }))}
                        placeholder="Scoring priorities (e.g., disadvantaged communities, school safety, state of readiness)"
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
                          placeholder="Additional context / board priorities"
                          className="min-h-[80px] w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                        />
                      </div>
                    </div>
                  </details>

                  <p className="pt-1 text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)]/60">Step 3 of 3 — Generate and Refine</p>
                  {missingRequirements.length > 0 && (
                    <p className="text-xs text-[color:var(--foreground)]/70">
                      To generate a draft, add: {missingRequirements.join(' and ')}.
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={!canGenerate}>
                      {isWorking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      Generate grant narrative draft
                    </Button>
                    <Button type="button" variant="outline" onClick={loadSampleProject} disabled={isWorking}>
                      Load sample ATP project
                    </Button>
                    <Button type="button" variant="ghost" onClick={resetWorkspace} disabled={isWorking}>
                      Reset
                    </Button>
                    <Button type="button" variant="outline" onClick={exportMarkdown} disabled={messages.length < 2}>
                      <Save className="mr-2 h-4 w-4" /> Export draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Narrative Chat Editor</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => void copyLatestDraft()} disabled={messages.length < 2 || isWorking}>
                      <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy latest draft
                    </Button>
                    <Button type="button" variant="outline" onClick={() => void copyExecutiveSummary()} disabled={messages.length < 2 || isWorking}>
                      Copy executive summary
                    </Button>
                    {typeof remainingBudget === 'number' && typeof budgetCap === 'number' ? (
                      <span className="text-xs text-[color:var(--foreground)]/65">
                        Daily AI credits remaining: {remainingBudget.toLocaleString()} of {budgetCap.toLocaleString()}
                      </span>
                    ) : null}
                  </div>
                </div>

                <p className="mt-2 text-sm text-[color:var(--foreground)]/78">
                  Ask for revisions like “make this more competitive for ATP scoring,” “tighten to 350 words,” or “strengthen rural safety framing.”
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {REVISION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => void onQuickRevision(chip)}
                      disabled={isWorking}
                      className="rounded-full border border-[color:var(--line)] bg-[color:var(--fog)] px-3 py-1.5 text-xs text-[color:var(--foreground)]/80 transition hover:border-[color:var(--pine)]/60 hover:text-[color:var(--pine)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

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
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault()
                        void onSendChat()
                      }
                    }}
                    rows={4}
                    placeholder="Ask for edits, tone changes, section additions, or stronger score alignment..."
                    className="min-h-[96px] flex-1 resize-none rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 py-2 text-sm text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
                  />
                  <Button type="button" className="self-end" onClick={onSendChat} disabled={!chatDraft.trim() || isWorking}>
                    {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
                  </Button>
                </div>

                <p className="mt-2 text-xs text-[color:var(--foreground)]/60">Enter to send • Shift+Enter for a new line</p>

                {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

                <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--fog)] p-3 text-sm text-[color:var(--foreground)]/78">
                  Save your narrative drafts and unlock unlimited AI revisions with a{' '}
                  <Link href="/signup?redirect=/grant-lab" className="font-semibold text-[color:var(--pine)]">
                    free account
                  </Link>
                  .
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
