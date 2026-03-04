const DEFAULT_ADMIN_ALLOWLIST = [
  'nathaniel@natfordplanning.com',
  'bartholomew@natfordplanning.com',
]

function normalizeEmail(input: string) {
  return input.trim().toLowerCase()
}

export type AdminAccessReason = 'not_allowlisted' | 'google_required' | 'mfa_required'

export type AdminAccessResult = {
  ok: boolean
  reason: AdminAccessReason | null
  currentAal: string | null
}

export function getAdminAllowlist() {
  const configured = (process.env.ADMIN_ALLOWLIST_EMAILS ?? '')
    .split(',')
    .map((entry) => normalizeEmail(entry))
    .filter(Boolean)

  const merged = configured.length > 0 ? configured : DEFAULT_ADMIN_ALLOWLIST
  return Array.from(new Set(merged))
}

export function isAdminAllowlistedEmail(email?: string | null) {
  if (!email) return false
  return getAdminAllowlist().includes(normalizeEmail(email))
}

function hasGoogleProvider(user: {
  app_metadata?: Record<string, unknown>
  identities?: Array<{ provider?: string | null }> | null
}) {
  const metadataProviders = Array.isArray(user.app_metadata?.providers)
    ? (user.app_metadata?.providers as unknown[])
    : []

  const normalizedProviders = metadataProviders
    .map((value) => (typeof value === 'string' ? value.toLowerCase() : null))
    .filter((value): value is string => Boolean(value))

  const identityProviders = (user.identities ?? [])
    .map((identity) => identity.provider?.toLowerCase())
    .filter((value): value is string => Boolean(value))

  return [...normalizedProviders, ...identityProviders].includes('google')
}

async function getCurrentAal(supabase: any) {
  try {
    if (!supabase.auth.mfa?.getAuthenticatorAssuranceLevel) {
      return null
    }

    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    return data?.currentLevel ?? null
  } catch {
    return null
  }
}

export async function evaluateAdminAccess(params: {
  supabase: any
  user: {
    email?: string | null
    app_metadata?: Record<string, unknown>
    identities?: Array<{ provider?: string | null }> | null
  }
}): Promise<AdminAccessResult> {
  const { supabase, user } = params

  if (!isAdminAllowlistedEmail(user.email)) {
    return { ok: false, reason: 'not_allowlisted', currentAal: null }
  }

  if (!hasGoogleProvider(user)) {
    return { ok: false, reason: 'google_required', currentAal: null }
  }

  const currentAal = await getCurrentAal(supabase)
  if (currentAal !== 'aal2') {
    return { ok: false, reason: 'mfa_required', currentAal }
  }

  return { ok: true, reason: null, currentAal }
}

export function getAdminAllowlistSummary() {
  return getAdminAllowlist().join(', ')
}
