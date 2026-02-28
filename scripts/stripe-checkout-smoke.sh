#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://www.natfordplanning.com}"

TIERS=(
  openplan-starter
  openplan-professional
  openplan-agency
  ads-essentials
  ads-growth
  ads-scale
  drone-starter
  drone-professional
  drone-enterprise
  vibe-coding-planners-starter
  vibe-coding-planners-practitioner
  vibe-coding-planners-team
)

pass_count=0
fail_count=0

for tier in "${TIERS[@]}"; do
  headers="$(curl -sS -D - -o /dev/null "${BASE_URL}/api/commerce/checkout?tier=${tier}")"
  status="$(printf '%s\n' "$headers" | head -n 1 | awk '{print $2}')"
  location="$(printf '%s\n' "$headers" | awk 'tolower($1)=="location:" {sub(/\r$/, "", $2); print $2; exit}')"

  if [[ "$status" =~ ^30[278]$ ]] && [[ "$location" == *"stripe.com"* ]]; then
    printf 'PASS %-32s -> %s\n' "$tier" "$location"
    ((pass_count+=1))
  else
    printf 'FAIL %-32s status=%s location=%s\n' "$tier" "${status:-n/a}" "${location:-n/a}"
    ((fail_count+=1))
  fi
done

echo "---"
printf 'Summary: PASS=%d FAIL=%d TOTAL=%d\n' "$pass_count" "$fail_count" "${#TIERS[@]}"

if (( fail_count > 0 )); then
  exit 1
fi
