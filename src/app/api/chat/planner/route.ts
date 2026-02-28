import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// OpenAI Responses API expects provider-native model IDs.
// OpenClaw alias `openai-codex/gpt-5.3-codex` maps to `gpt-5.3-codex` here.
const CHAT_MODEL = 'gpt-5.3-codex'
const MAX_CONTEXT_MESSAGES = 16
const MAX_MESSAGE_CHARS = 4000
const MAX_TOTAL_INPUT_CHARS = 24000
const MAX_OUTPUT_TOKENS = 1800

const GUEST_GRACE_MS = 10 * 60 * 1000
const GUEST_MAX_REQUESTS_PER_HOUR = 60
const GUEST_MIN_INTERVAL_MS = 1200

const MEMBER_MAX_REQUESTS_PER_HOUR = 180
const MEMBER_MIN_INTERVAL_MS = 400

const SYSTEM_PROMPT = `You are a senior urban planner specializing in Northern California and the Bay Area, with deep expertise in transportation + land use implementation.

Operating style:
- Practical, concrete, and decision-grade (no generic fluff).
- Lead with a concise recommendation, then unpack tradeoffs.
- Highlight risk, timeline pressure, match constraints, and staffing implications.
- If assumptions are required, label them explicitly.

Preferred response format (when appropriate):
1) Quick take
2) Why this works (or where it breaks)
3) Execution steps (30/60/90-day style when useful)
4) Risks + mitigation
5) Optional: grant/funding angle

Domain focus:
- ATP, RTP, HSIP, CRP, SS4A, RAISE, PROTECT, FTA transit capital programs.
- Corridor safety, school access, complete streets, VMT framing, and grant competitiveness.
- Small agency realities: limited staff capacity, matching-fund pressure, phased delivery, and board/public communication.

Safety and scope:
- Do not invent data, statutes, or citations.
- If uncertain, state uncertainty clearly.
- This is planning support, not legal advice.`

const preferenceSchema = z
  .object({
    geographyFocus: z.enum(['rural-norcal', 'bay-area', 'mixed']).optional(),
    responseStyle: z.enum(['quick-take', 'deep-dive', 'board-memo']).optional(),
  })
  .optional()

const requestSchema = z.object({
  visitorId: z.string().trim().max(120).optional(),
  preferences: preferenceSchema,
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
  firstSeenAt: number
  lastRequestAt: number
  requests: number[]
}

type PlannerStateStore = Map<string, VisitorState>

declare global {
  // eslint-disable-next-line no-var
  var __plannerChatState: PlannerStateStore | undefined
}

function getStateStore(): PlannerStateStore {
  if (!globalThis.__plannerChatState) {
    globalThis.__plannerChatState = new Map<string, VisitorState>()
  }
  return globalThis.__plannerChatState
}

function jsonError(message: string, status = 400, extras: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, message, ...extras }, { status })
}

function getRequesterIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = req.headers.get('x-real-ip')?.trim()
  return forwarded || realIp || 'unknown-ip'
}

function normalizeRateWindow(state: VisitorState, now: number, windowMs = 60 * 60 * 1000) {
  state.requests = state.requests.filter((timestamp) => now - timestamp <= windowMs)
}

function enforceRateLimits(
  state: VisitorState,
  now: number,
  maxPerHour: number,
  minIntervalMs: number
): string | null {
  normalizeRateWindow(state, now)

  if (state.lastRequestAt && now - state.lastRequestAt < minIntervalMs) {
    return 'You are sending messages too quickly. Please wait a moment.'
  }

  if (state.requests.length >= maxPerHour) {
    return 'You have hit the hourly message limit. Please try again shortly.'
  }

  state.lastRequestAt = now
  state.requests.push(now)
  return null
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

function buildPreferenceInstruction(preferences?: z.infer<typeof preferenceSchema>): string {
  const geographyMap = {
    'rural-norcal': 'Prioritize rural Northern California operating realities by default.',
    'bay-area': 'Prioritize Bay Area policy, delivery constraints, and interagency realities by default.',
    mixed: 'Blend Northern California rural and Bay Area context as needed.',
  } as const

  const responseStyleMap = {
    'quick-take': 'Keep responses concise and highly actionable unless user asks for more depth.',
    'deep-dive': 'Provide deeper analysis, alternatives, and step-by-step implementation detail.',
    'board-memo': 'Format responses in a board-memo style with crisp headings and decision language.',
  } as const

  const geography = preferences?.geographyFocus
    ? geographyMap[preferences.geographyFocus]
    : 'Use mixed NorCal + Bay Area context when relevant.'
  const style = preferences?.responseStyle
    ? responseStyleMap[preferences.responseStyle]
    : 'Use balanced depth: concise first, then detail.'

  return `User preference guidance:\n- ${geography}\n- ${style}`
}

export async function POST(req: NextRequest) {
  try {
    const parsed = requestSchema.safeParse(await req.json())
    if (!parsed.success) {
      return jsonError('Invalid chat payload.', 400)
    }

    const { visitorId, messages, preferences } = parsed.data
    const inputChars = messages.reduce((sum, message) => sum + message.content.length, 0)

    if (inputChars > MAX_TOTAL_INPUT_CHARS) {
      return jsonError('Your message history is too long. Please start a new thread.', 413)
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
        firstSeenAt: now,
        lastRequestAt: 0,
        requests: [],
      } satisfies VisitorState)

    stateStore.set(requesterKey, state)

    if (!user) {
      const elapsed = now - state.firstSeenAt
      if (elapsed > GUEST_GRACE_MS) {
        return jsonError('Signup required to continue this chat.', 401, {
          requiresSignup: true,
          guestExpiresAt: state.firstSeenAt + GUEST_GRACE_MS,
        })
      }

      const rateError = enforceRateLimits(state, now, GUEST_MAX_REQUESTS_PER_HOUR, GUEST_MIN_INTERVAL_MS)
      if (rateError) {
        return jsonError(rateError, 429)
      }
    } else {
      const rateError = enforceRateLimits(state, now, MEMBER_MAX_REQUESTS_PER_HOUR, MEMBER_MIN_INTERVAL_MS)
      if (rateError) {
        return jsonError(rateError, 429)
      }
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return jsonError('Chat API is not configured yet.', 503)
    }

    const preferenceInstruction = buildPreferenceInstruction(preferences)

    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        max_output_tokens: MAX_OUTPUT_TOKENS,
        input: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'system',
            content: preferenceInstruction,
          },
          ...messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        ],
      }),
    })

    if (!openAiResponse.ok) {
      const details = await openAiResponse.text()
      console.error('Planner chat upstream error', {
        status: openAiResponse.status,
        details,
      })
      return jsonError('The planning assistant is temporarily unavailable. Please retry in a minute.', 502)
    }

    const payload = (await openAiResponse.json()) as unknown
    const reply = extractOutputText(payload)

    if (!reply) {
      return jsonError('No response generated. Please try again.', 502)
    }

    return NextResponse.json({
      ok: true,
      reply,
      model: CHAT_MODEL,
      guestExpiresAt: !user ? state.firstSeenAt + GUEST_GRACE_MS : null,
    })
  } catch (error) {
    console.error('Planner chat route error', error)
    return jsonError('Unexpected server error.', 500)
  }
}
