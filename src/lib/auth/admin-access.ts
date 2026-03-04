const DEFAULT_ADMIN_ALLOWLIST = [
  'nathaniel@natfordplanning.com',
  'bartholomew@natfordplanning.com',
]

function normalizeEmail(input: string) {
  return input.trim().toLowerCase()
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

export function getAdminAllowlistSummary() {
  return getAdminAllowlist().join(', ')
}
