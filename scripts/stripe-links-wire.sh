#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${1:-}"

if [[ -z "$ENV_FILE" ]]; then
  echo "Usage: $0 <path-to-stripe-links.env>"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE"
  exit 1
fi

REQUIRED_KEYS=(
  STRIPE_LINK_OPENPLAN_STARTER
  STRIPE_LINK_OPENPLAN_PROFESSIONAL
  STRIPE_LINK_OPENPLAN_AGENCY
  STRIPE_LINK_ADS_ESSENTIALS
  STRIPE_LINK_ADS_GROWTH
  STRIPE_LINK_ADS_SCALE
  STRIPE_LINK_DRONE_STARTER
  STRIPE_LINK_DRONE_PROFESSIONAL
  STRIPE_LINK_DRONE_ENTERPRISE
  STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_29
  STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_39
  STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_49
)

read_value() {
  local key="$1"
  local raw
  raw="$(grep -E "^${key}=" "$ENV_FILE" | tail -n 1 | cut -d '=' -f2- || true)"
  # Strip wrapping single/double quotes if present
  raw="${raw%\"}"
  raw="${raw#\"}"
  raw="${raw%\'}"
  raw="${raw#\'}"
  printf '%s' "$raw"
}

fallback_key() {
  local key="$1"
  case "$key" in
    STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_29) printf '%s' "STRIPE_LINK_VIBE_CODING_PLANNERS_29" ;;
    STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_39) printf '%s' "STRIPE_LINK_VIBE_CODING_PLANNERS_39" ;;
    STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_49) printf '%s' "STRIPE_LINK_VIBE_CODING_PLANNERS_49" ;;
    *) printf '%s' "" ;;
  esac
}

read_required_value() {
  local key="$1"
  local fallback
  local value

  fallback="$(fallback_key "$key")"
  value="$(read_value "$key")"

  if [[ -z "$value" && -n "$fallback" ]]; then
    value="$(read_value "$fallback")"
  fi

  printf '%s' "$value"
}

missing=()
for key in "${REQUIRED_KEYS[@]}"; do
  value="$(read_required_value "$key")"
  if [[ -z "$value" ]]; then
    fallback="$(fallback_key "$key")"
    if [[ -n "$fallback" ]]; then
      missing+=("$key (or $fallback)")
    else
      missing+=("$key")
    fi
  fi

done

if (( ${#missing[@]} > 0 )); then
  echo "Missing required Stripe link values in $ENV_FILE:"
  printf ' - %s\n' "${missing[@]}"
  exit 1
fi

push_key() {
  local key="$1"
  local value="$2"
  local env="$3"
  (
    cd "$ROOT_DIR"
    npx vercel env add "$key" "$env" \
      --value "$value" \
      --yes \
      --force \
      --non-interactive >/dev/null
  )
}

echo "Wiring 12 canonical STRIPE_LINK_* variables into Vercel (production, preview, development)..."
for key in "${REQUIRED_KEYS[@]}"; do
  value="$(read_required_value "$key")"
  push_key "$key" "$value" production
  push_key "$key" "$value" preview
  push_key "$key" "$value" development
  echo "✓ $key"
done

echo "Done. All Stripe link env vars are wired."
