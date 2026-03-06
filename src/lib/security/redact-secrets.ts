const REDACTED = '[redacted]'

const SECRET_VALUE_PATTERNS: RegExp[] = [
  /\bsk-[A-Za-z0-9_-]{10,}\b/g, // OpenAI keys (incl. sk-proj-...)
  /\bxai-[A-Za-z0-9_-]{10,}\b/g, // xAI keys
  /\b(?:Bearer\s+)?(?:eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]+\.[A-Za-z0-9._-]+)\b/g, // JWTs
  /\b(?:gh[opus]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g, // GitHub tokens
]

const SECRET_KEY_NAME = /(api[-_ ]?key|authorization|token|secret|password|cookie|session)/i

function redactString(value: string): string {
  return SECRET_VALUE_PATTERNS.reduce((next, pattern) => next.replace(pattern, REDACTED), value)
}

function sanitizeObject(input: unknown, seen: WeakSet<object>): unknown {
  if (input === null || input === undefined) return input

  if (typeof input === 'string') {
    return redactString(input)
  }

  if (typeof input !== 'object') {
    return input
  }

  if (input instanceof Error) {
    return {
      name: input.name,
      message: redactString(input.message || ''),
      stack: input.stack ? redactString(input.stack) : undefined,
      cause: input.cause ? sanitizeObject(input.cause, seen) : undefined,
    }
  }

  if (seen.has(input)) {
    return '[circular]'
  }
  seen.add(input)

  if (Array.isArray(input)) {
    return input.map((value) => sanitizeObject(value, seen))
  }

  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (SECRET_KEY_NAME.test(key)) {
      out[key] = REDACTED
      continue
    }

    out[key] = sanitizeObject(value, seen)
  }

  return out
}

export function sanitizeForLog(input: unknown): unknown {
  return sanitizeObject(input, new WeakSet<object>())
}

export function sanitizeTextForLog(input: string): string {
  return redactString(input)
}
