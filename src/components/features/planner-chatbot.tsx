'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bot, Copy, Loader2, RotateCcw, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  role: ChatRole
  content: string
}

type PlannerPreferences = {
  geographyFocus: 'rural-norcal' | 'bay-area' | 'mixed'
  responseStyle: 'quick-take' | 'deep-dive' | 'board-memo'
}

type PlannerApiResponse = {
  ok: boolean
  reply?: string
  message?: string
  requiresSignup?: boolean
  guestExpiresAt?: number
}

const STARTED_AT_KEY = 'nfpa_planner_chat_started_at'
const VISITOR_ID_KEY = 'nfpa_planner_chat_visitor_id'
const GUEST_GRACE_MS = 10 * 60 * 1000

const STARTER_PROMPTS = [
  'Prioritize ATP strategies for school corridors',
  'HSIP fit check: severe pedestrian crash corridor',
  'Build a 6-month complete streets action plan',
  'Draft board-ready tradeoffs summary',
]

const REVISION_CHIPS = [
  'Format as: Executive summary (150 words)',
  'Format as: Board memo with recommendation + tradeoffs',
  'Format as: 30/90/180-day implementation plan',
  'List assumptions and missing data that would strengthen this strategy.',
]

const GREETING_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    "Hi — I’m your Northern California & Bay Area planning copilot. Ask me about corridor safety, ATP/RTP strategy, VMT framing, implementation phasing, or grant competitiveness.",
}

function ensureVisitorId() {
  if (typeof window === 'undefined') return 'server'
  const existing = localStorage.getItem(VISITOR_ID_KEY)
  if (existing) return existing

  const id = `guest_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`
  localStorage.setItem(VISITOR_ID_KEY, id)
  return id
}

function ensureGuestStart() {
  if (typeof window === 'undefined') return Date.now()
  const current = localStorage.getItem(STARTED_AT_KEY)
  if (current) return Number(current)

  const now = Date.now()
  localStorage.setItem(STARTED_AT_KEY, String(now))
  return now
}

export function PlannerChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING_MESSAGE])
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requiresSignup, setRequiresSignup] = useState(false)
  const [guestStartedAt, setGuestStartedAt] = useState<number>(Date.now())
  const [nowMs, setNowMs] = useState<number>(Date.now())
  const [preferences, setPreferences] = useState<PlannerPreferences>({
    geographyFocus: 'mixed',
    responseStyle: 'quick-take',
  })

  useEffect(() => {
    setGuestStartedAt(ensureGuestStart())
  }, [])


  useEffect(() => {
    const interval = window.setInterval(() => setNowMs(Date.now()), 15000)
    return () => window.clearInterval(interval)
  }, [])

  const guestRemainingMs = Math.max(0, guestStartedAt + GUEST_GRACE_MS - nowMs)
  const guestMinutesLeft = Math.ceil(guestRemainingMs / 60000)

  const canSend = useMemo(() => {
    return draft.trim().length > 0 && !isSending && !requiresSignup
  }, [draft, isSending, requiresSignup])

  function resetChat() {
    setMessages([GREETING_MESSAGE])
    setDraft('')
    setError(null)
  }

  async function copyLatestDraft() {
    const latestAssistant = [...messages].reverse().find((message) => message.role === 'assistant')
    if (!latestAssistant?.content || typeof navigator === 'undefined') return

    await navigator.clipboard.writeText(latestAssistant.content)
  }

  async function sendMessage(userText: string) {
    if (!userText.trim() || isSending || requiresSignup) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: userText.trim() }]
    setMessages(nextMessages)
    setDraft('')
    setError(null)
    setIsSending(true)

    try {
      const response = await fetch('/api/chat/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: ensureVisitorId(),
          preferences,
          // Integrity hardening: only user turns are sent from client; assistant turns are generated server-side.
          messages: nextMessages.filter((message) => message.role === 'user').slice(-14),
        }),
      })

      const data = (await response.json()) as PlannerApiResponse

      if (!response.ok || !data.ok) {
        if (data.requiresSignup) {
          setRequiresSignup(true)
          setError('Your free guest session has ended. Create a free account to continue this thread and keep your planning context.')
          return
        }

        throw new Error(data.message || 'Could not generate a response right now.')
      }

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || '' }])
      }

      if (data.requiresSignup) {
        setRequiresSignup(true)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error'
      setError(message)
    } finally {
      setIsSending(false)
    }
  }

  async function onSend() {
    await sendMessage(draft)
  }

  async function onQuickPrompt(prompt: string) {
    if (isSending || requiresSignup) return
    await sendMessage(prompt)
  }

  async function onRevisionChip(prompt: string) {
    if (isSending || requiresSignup) return
    await sendMessage(prompt)
  }

  return (
    <div className="soft-card rounded-3xl p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--foreground)]/60">
        <Sparkles className="h-3.5 w-3.5" />
        AI Planning Copilot
      </div>

      <div className="mt-3 flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--pine)] text-white">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="section-title text-3xl text-[color:var(--ink)]">Ask the NorCal & Bay Area Urban Planning AI</h3>
          <p className="mt-2 text-[color:var(--foreground)]/78">
            Built for planners who need decision-grade guidance fast: concrete steps, explicit tradeoffs, and funding-aware recommendations.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--background)]/80 p-4">
        <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="text-xs text-[color:var(--foreground)]/70">
            Geography focus
            <select
              value={preferences.geographyFocus}
              onChange={(event) =>
                setPreferences((prev) => ({ ...prev, geographyFocus: event.target.value as PlannerPreferences['geographyFocus'] }))
              }
              className="mt-1 h-10 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm text-[color:var(--foreground)]"
            >
              <option value="mixed">Mixed NorCal + Bay Area</option>
              <option value="rural-norcal">Rural Northern California</option>
              <option value="bay-area">Bay Area</option>
            </select>
          </label>

          <label className="text-xs text-[color:var(--foreground)]/70">
            Response style
            <select
              value={preferences.responseStyle}
              onChange={(event) =>
                setPreferences((prev) => ({ ...prev, responseStyle: event.target.value as PlannerPreferences['responseStyle'] }))
              }
              className="mt-1 h-10 w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 text-sm text-[color:var(--foreground)]"
            >
              <option value="quick-take">Quick take</option>
              <option value="deep-dive">Deep dive</option>
              <option value="board-memo">Board memo</option>
            </select>
          </label>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void onQuickPrompt(prompt)}
              disabled={isSending || requiresSignup}
              className="rounded-full border border-[color:var(--line)] bg-[color:var(--fog)] px-3 py-1.5 text-xs text-[color:var(--foreground)]/80 transition hover:border-[color:var(--pine)]/60 hover:text-[color:var(--pine)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {!requiresSignup && guestRemainingMs > 0 && guestRemainingMs <= 2 * 60 * 1000 && (
          <div className="mb-3 rounded-xl border border-amber-300/70 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            You have about 2 minutes left in guest mode—save or create a free account to continue without interruption.
          </div>
        )}

        <div className="mb-3 flex flex-wrap gap-2">
          {REVISION_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => void onRevisionChip(chip)}
              disabled={isSending || requiresSignup}
              className="rounded-full border border-[color:var(--line)] bg-[color:var(--fog)] px-3 py-1.5 text-[11px] text-[color:var(--foreground)]/80 transition hover:border-[color:var(--pine)]/60 hover:text-[color:var(--pine)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === 'assistant'
                  ? 'bg-[color:var(--fog)] text-[color:var(--foreground)]'
                  : 'ml-4 bg-[color:var(--pine)] text-white'
              }`}
            >
              {message.content}
            </div>
          ))}

          {isSending && (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-[color:var(--fog)] px-4 py-3 text-sm text-[color:var(--foreground)]/75">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void onSend()
              }
            }}
            rows={3}
            placeholder="Example: Give me a practical ATP strategy for a Bay Area suburban corridor with school safety issues and constrained match capacity."
            className="flex-1 resize-none rounded-xl border border-[color:var(--line)] bg-[color:var(--background)] px-3 py-2 text-sm text-[color:var(--foreground)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[color:var(--pine)]"
          />
          <Button
            type="button"
            onClick={() => void onSend()}
            disabled={!canSend}
            className="h-auto min-w-[56px] self-end rounded-xl px-3 py-2"
            aria-label="Send message"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        <p className="mt-2 text-xs text-[color:var(--foreground)]/60">Enter to send • Shift+Enter for a new line</p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--foreground)]/65">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Guest access: 10-minute trial session
            </span>
            {!requiresSignup && guestRemainingMs > 0 && <span>Guest session: about {guestMinutesLeft} min remaining</span>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void copyLatestDraft()}
              className="inline-flex items-center gap-1 text-[color:var(--foreground)]/70 hover:text-[color:var(--pine)]"
            >
              <Copy className="h-3.5 w-3.5" /> Copy latest draft
            </button>
            <button
              type="button"
              onClick={resetChat}
              className="inline-flex items-center gap-1 text-[color:var(--foreground)]/70 hover:text-[color:var(--pine)]"
            >
              <RotateCcw className="h-3.5 w-3.5" /> New chat
            </button>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

        {requiresSignup && (
          <div className="mt-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--fog)] p-4">
            <p className="text-sm text-[color:var(--foreground)]/80">
              Your free guest session ended. Create a free account to continue this thread and keep your planning context.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/signup?redirect=/">Create account</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login?redirect=/">Log in</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
