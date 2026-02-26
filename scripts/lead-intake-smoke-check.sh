#!/usr/bin/env bash
set -euo pipefail

# Lead intake smoke check
# Verifies: form/API submit -> DB insert -> (optional) lead inbox visibility via auth cookie
#
# Required env:
#   SITE_URL                     e.g. https://natfordplanning.com (or http://localhost:3015)
#   SUPABASE_URL                 e.g. https://<project-ref>.supabase.co
#   SUPABASE_SERVICE_ROLE_KEY    service role key for verification query
#
# Optional env:
#   LEAD_INBOX_PASSWORD          if set, check /lead-inbox contains test email
#   KEEP_TEST_ROW=1              keep synthetic row (default deletes it)

SITE_URL="${SITE_URL:-}"
SUPABASE_URL="${SUPABASE_URL:-}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"
LEAD_INBOX_PASSWORD="${LEAD_INBOX_PASSWORD:-}"
KEEP_TEST_ROW="${KEEP_TEST_ROW:-0}"

if [[ -z "$SITE_URL" || -z "$SUPABASE_URL" || -z "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
  echo "ERROR: SITE_URL, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY are required."
  exit 2
fi

RUN_ID="$(date +%s)"
EMAIL="lead-smoke-${RUN_ID}@example.com"
DESC="Synthetic lead intake smoke check (${RUN_ID}) for reliability monitoring."

cleanup_row() {
  if [[ "$KEEP_TEST_ROW" == "1" ]]; then
    return 0
  fi

  curl -sS -X DELETE \
    "${SUPABASE_URL}/rest/v1/leads?email=eq.${EMAIL}" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H 'Accept-Profile: public' \
    -o /dev/null || true
}

trap cleanup_row EXIT

payload=$(jq -n \
  --arg email "$EMAIL" \
  --arg desc "$DESC" \
  '{
    firstName: "Smoke",
    lastName: "Check",
    email: $email,
    organization: "Nat Ford QA",
    inquiryType: "General inquiry",
    timeline: "Immediate (0-30 days)",
    description: $desc,
    sourcePath: "/contact"
  }')

submit_http=$(curl -sS -o /tmp/lead_smoke_submit.json -w "%{http_code}" \
  -H 'Content-Type: application/json' \
  -d "$payload" \
  "${SITE_URL}/api/leads")

if [[ "$submit_http" != "200" ]]; then
  echo "FAIL submit_http=${submit_http} body=$(cat /tmp/lead_smoke_submit.json)"
  exit 1
fi

if ! jq -e '.ok == true' /tmp/lead_smoke_submit.json >/dev/null 2>&1; then
  echo "FAIL submit_response body=$(cat /tmp/lead_smoke_submit.json)"
  exit 1
fi

db_json=$(curl -sS \
  "${SUPABASE_URL}/rest/v1/leads?select=id,email,created_at,status&email=eq.${EMAIL}" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H 'Accept-Profile: public')

db_count=$(echo "$db_json" | jq 'length')
if [[ "$db_count" -lt 1 ]]; then
  echo "FAIL db_insert_not_found email=${EMAIL}"
  exit 1
fi

inbox_checked="no"
inbox_visible="skipped"

if [[ -n "$LEAD_INBOX_PASSWORD" ]]; then
  inbox_checked="yes"
  cookie_jar="$(mktemp)"

  curl -sS -L -c "$cookie_jar" -b "$cookie_jar" \
    -X POST "${SITE_URL}/api/lead-inbox/auth" \
    -d "action=login&password=${LEAD_INBOX_PASSWORD}" >/dev/null

  inbox_html=$(curl -sS -L -c "$cookie_jar" -b "$cookie_jar" "${SITE_URL}/lead-inbox")
  rm -f "$cookie_jar"

  if echo "$inbox_html" | grep -q "$EMAIL"; then
    inbox_visible="yes"
  else
    inbox_visible="no"
    echo "FAIL inbox_visibility email=${EMAIL}"
    exit 1
  fi
fi

echo "PASS email=${EMAIL} submit_http=${submit_http} db_count=${db_count} inbox_checked=${inbox_checked} inbox_visible=${inbox_visible}"
