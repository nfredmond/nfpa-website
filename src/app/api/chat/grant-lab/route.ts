import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// OpenAI Responses API expects provider-native model IDs.
// OpenClaw alias `openai-codex/gpt-5.3-codex` maps to `gpt-5.3-codex` here.
const CHAT_MODEL = 'gpt-5.3-codex'
const MAX_CONTEXT_MESSAGES = 20
const MAX_MESSAGE_CHARS = 5000
const MAX_TOTAL_INPUT_CHARS = 32000
const MAX_OUTPUT_TOKENS_GUEST = 1400
const MAX_OUTPUT_TOKENS_MEMBER = 2200

const GUEST_MAX_REQUESTS_PER_HOUR = 45
const MEMBER_MAX_REQUESTS_PER_HOUR = 120
const GUEST_MIN_INTERVAL_MS = 1200
const MEMBER_MIN_INTERVAL_MS = 350

const GUEST_DAILY_TOKEN_BUDGET = 45000
const MEMBER_DAILY_TOKEN_BUDGET = 120000

const SYSTEM_PROMPT = `You are a senior Northern California transportation + land use grant strategist.

Your job:
- Help users draft strong, realistic, program-specific grant application narrative text.
- Ask for missing details when needed, but still provide a useful draft when details are partial.
- Make content practical for rural and small-city agencies, MPOs, tribal governments, and Bay Area public-sector teams.

Output requirements:
- Write in plain English with specific implementation language.
- Include clear assumptions when details are missing.
- Be honest about risk, match constraints, delivery readiness, and schedule dependencies.
- Avoid fabricated statutes, fake citations, or invented numbers.
- When revising a prior draft, preserve good material and show what changed.

Default structure for first draft:
1) Problem Statement
2) Project Overview
3) Community Need + Equity/Safety
4) Deliverability + Readiness
5) Funding + Match Strategy
6) Expected Outcomes + Evaluation
7) Why this proposal is competitive now`

const grantContextSchema = z.object({
  grantProgram: z.string().trim().min(1).max(120),
  applicantName: z.string().trim().max(160).optional(),
  location: z.string().trim().max(180).optional(),
  applicantType: z.string().trim().max(120).optional(),
  projectName: z.string().trim().max(180).optional(),
  fundingNeed: z.string().trim().max(180).optional(),
  localMatch: z.string().trim().max(180).optional(),
  goals: z.string().trim().max(1600).optional(),
  scope: z.string().trim().max(2200).optional(),
  equitySafetyNeed: z.string().trim().max(1600).optional(),
  readiness: z.string().trim().max(1200).optional(),
  risks: z.string().trim().max(1200).optional(),
  extraNotes: z.string().trim().max(1200).optional(),
})

const requestSchema = z.object({
  visitorId: z.string().trim().max(120).optional(),
  mode: z.enum(['draft', 'chat']).default('chat'),
  context: grantContextSchema,
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
      })
    )
    .min(1)
    .max(MAX_CONTEXT_MESSAGES),
})

type VisitorState = {
  windowStartedAt: number
  lastRequestAt: number
  requests: number[]
  tokenBudgetUsed: number
}

type GrantStateStore = Map<string, VisitorState>

declare global {
  // eslint-disable-next-line no-var
  var __grantLabState: GrantStateStore | undefined
}

function getStateStore(): GrantStateStore {
  if (!globalThis.__grantLabState) {
    globalThis.__grantLabState = new Map<string, VisitorState>()
  }
  return globalThis.__grantLabState
}

function jsonError(message: string, status = 400, extras: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, message, ...extras }, { status })
}

function getRequesterIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = req.headers.get('x-real-ip')?.trim()
  return forwarded || realIp || 'unknown-ip'
}

function estimateTokens(text: string): number {
  const chars = text.length
  return Math.ceil(chars / 4)
}

function normalizeRateWindow(state: VisitorState, now: number, windowMs = 60 * 60 * 1000) {
  state.requests = state.requests.filter((timestamp) => now - timestamp <= windowMs)
}

function normalizeDailyBudget(state: VisitorState, now: number) {
  if (now - state.windowStartedAt >= 24 * 60 * 60 * 1000) {
    state.windowStartedAt = now
    state.tokenBudgetUsed = 0
    state.requests = []
    state.lastRequestAt = 0
  }
}

function extractOutputText(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return ''

  const maybeText = (payload as { output_text?: unknown }).output_text
  if (typeof maybeText === 'string' && maybeText.trim().length > 0) {
    return maybeText.trim()
  }

  const output = (payload as { output?: unknown }).output
  if (!Array.isArray(output)) return ''

  const parts: string[] = []
  for (const item of output) {
    if (!item || typeof item !== 'object') continue

    const content = (item as { content?: unknown }).content
    if (!Array.isArray(content)) continue

    for (const block of content) {
      if (!block || typeof block !== 'object') continue
      const blockType = (block as { type?: unknown }).type
      const text = (block as { text?: unknown }).text

      if ((blockType === 'output_text' || blockType === 'text') && typeof text === 'string' && text.trim()) {
        parts.push(text.trim())
      }
    }
  }

  return parts.join('\n\n').trim()
}

function formatGrantContext(context: z.infer<typeof grantContextSchema>): string {
  const lines = [
    `Grant Program: ${context.grantProgram}`,
    `Applicant Name: ${context.applicantName || 'Not provided'}`,
    `Location: ${context.location || 'Not provided'}`,
    `Applicant Type: ${context.applicantType || 'Not provided'}`,
    `Project Name: ${context.projectName || 'Not provided'}`,
    `Funding Need: ${context.fundingNeed || 'Not provided'}`,
    `Local Match Capacity: ${context.localMatch || 'Not provided'}`,
    `Project Goals: ${context.goals || 'Not provided'}`,
    `Project Scope: ${context.scope || 'Not provided'}`,
    `Equity + Safety Need: ${context.equitySafetyNeed || 'Not provided'}`,
    `Readiness + Delivery Status: ${context.readiness || 'Not provided'}`,
    `Known Risks / Constraints: ${context.risks || 'Not provided'}`,
    `Extra Notes: ${context.extraNotes || 'Not provided'}`,
  ]

  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const parsed = requestSchema.safeParse(await req.json())
    if (!parsed.success) {
      return jsonError('Invalid grant lab payload.', 400)
    }

    const { visitorId, mode, context, messages } = parsed.data
    const contextText = formatGrantContext(context)
    const messageText = messages.map((message) => `[${message.role}] ${message.content}`).join('\n\n')
    const totalChars = contextText.length + messageText.length

    if (totalChars > MAX_TOTAL_INPUT_CHARS) {
      return jsonError('This thread is too long. Start a fresh thread or shorten the context.', 413)
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const now = Date.now()
    const ip = getRequesterIp(req)
    const requesterKey = user?.id ? `user:${user.id}` : `guest:${visitorId || ip}`

    const stateStore = getStateStore()
    const state =
      stateStore.get(requesterKey) ||
      ({
        windowStartedAt: now,
        lastRequestAt: 0,
        requests: [],
        tokenBudgetUsed: 0,
      } satisfies VisitorState)

    stateStore.set(requesterKey, state)
    normalizeDailyBudget(state, now)
    normalizeRateWindow(state, now)

    const maxPerHour = user ? MEMBER_MAX_REQUESTS_PER_HOUR : GUEST_MAX_REQUESTS_PER_HOUR
    const minIntervalMs = user ? MEMBER_MIN_INTERVAL_MS : GUEST_MIN_INTERVAL_MS

    if (state.lastRequestAt && now - state.lastRequestAt < minIntervalMs) {
      return jsonError('You are sending messages too quickly. Please wait a moment.', 429)
    }

    if (state.requests.length >= maxPerHour) {
      return jsonError('You have reached the hourly limit for this tool. Please retry shortly.', 429)
    }

    const budgetCap = user ? MEMBER_DAILY_TOKEN_BUDGET : GUEST_DAILY_TOKEN_BUDGET
    const estimatedInputTokens = estimateTokens(`${contextText}\n\n${messageText}`)

    if (state.tokenBudgetUsed + estimatedInputTokens > budgetCap) {
      return jsonError('Daily AI usage budget reached for this session. Please continue tomorrow or sign in for higher limits.', 429, {
        requiresSignup: !user,
        remainingBudget: Math.max(0, budgetCap - state.tokenBudgetUsed),
      })
    }

    state.lastRequestAt = now
    state.requests.push(now)
    state.tokenBudgetUsed += estimatedInputTokens

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return jsonError('Grant AI is not configured yet.', 503)
    }

    const maxOutputTokens = user ? MAX_OUTPUT_TOKENS_MEMBER : MAX_OUTPUT_TOKENS_GUEST

    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        max_output_tokens: maxOutputTokens,
        input: [
          {
            role: 'system',
            content: [{ type: 'input_text', text: SYSTEM_PROMPT }],
          },
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: `Current workflow mode: ${mode}.\nGrant context:\n${contextText}`,
              },
            ],
          },
          ...messages.map((message) => ({
            role: message.role,
            content: [{ type: 'input_text', text: message.content }],
          })),
        ],
      }),
    })

    if (!openAiResponse.ok) {
      const details = await openAiResponse.text()
      console.error('Grant lab upstream error', {
        status: openAiResponse.status,
        details,
      })
      return jsonError('Grant assistant is temporarily unavailable. Please retry in a minute.', 502)
    }

    const payload = (await openAiResponse.json()) as unknown
    const reply = extractOutputText(payload)

    if (!reply) {
      return jsonError('No response generated. Please try again.', 502)
    }

    const outputTokens = estimateTokens(reply)
    state.tokenBudgetUsed += outputTokens

    return NextResponse.json({
      ok: true,
      reply,
      model: CHAT_MODEL,
      remainingBudget: Math.max(0, budgetCap - state.tokenBudgetUsed),
      budgetCap,
      isAuthenticated: !!user,
    })
  } catch (error) {
    console.error('Grant lab route error', error)
    return jsonError('Unexpected server error.', 500)
  }
}
