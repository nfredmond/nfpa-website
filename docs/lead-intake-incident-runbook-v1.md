# Lead Intake Incident Runbook v1

_Last updated: 2026-02-25 (PT)_
_Owner lane: Website ops + lead/intake reliability_

## Scope
This runbook covers incidents affecting the lead pipeline:
1. `/contact` form submission
2. `/api/leads` intake API
3. `public.leads` write in Supabase
4. `/lead-inbox` internal visibility

## Severity Levels
- **SEV-1 (outage):** New leads cannot be submitted or are silently dropped.
- **SEV-2 (degraded):** Submissions succeed intermittently, inbox visibility delayed, or elevated 4xx/5xx.
- **SEV-3 (minor):** Non-blocking UX defects with successful DB writes.

## Fast Triage (First 10 Minutes)
1. **Reproduce submission path**
   - Submit a synthetic lead via `/api/leads`.
   - Expect: `200` with `{ "ok": true }`.
2. **Verify DB write**
   - Query `public.leads` for the synthetic email.
   - Expect: row exists with `status='new'`.
3. **Verify inbox visibility**
   - Log in to `/lead-inbox` and confirm row appears.
4. **Classify severity**
   - If step 1 fails globally -> SEV-1.
   - If step 1 passes but step 2/3 fails -> SEV-2.

## Standard Diagnostic Commands

### A) One-command smoke check
```bash
SITE_URL=https://natfordplanning.com \
SUPABASE_URL=https://<project-ref>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service_role_key> \
LEAD_INBOX_PASSWORD=<inbox_password_optional> \
./scripts/lead-intake-smoke-check.sh
```

### B) Check route-level logs (local/dev)
```bash
# While running next dev/start
# inspect /api/leads status patterns (200/429/500)
```

### C) Verify auth-gated inbox endpoints
- `/api/lead-inbox/export` should return `401` without auth cookie.
- `/api/lead-inbox/auth` invalid password should redirect `303` to `/lead-inbox?error=1`.

## Decision Tree
### If `/api/leads` returns 503
Likely missing env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Action:** restore Vercel env vars and redeploy/restart.

### If `/api/leads` returns 500
Likely Supabase insert failure (schema/RLS/permission/network).

**Action:**
1. Confirm `public.leads` table exists and migrations are current.
2. Verify service role key validity.
3. Check Supabase project health/latency.

### If DB write succeeds but inbox misses row
Likely auth/session issue or inbox query failure.

**Action:**
1. Verify `LEAD_INBOX_PASSWORD` is set.
2. Re-auth via `/api/lead-inbox/auth`.
3. Confirm `/lead-inbox` query returns recent row.

## Immediate Mitigations
- Keep direct fallback visible to users: `nathaniel@natfordplanning.com`.
- Run smoke check script after deploys and env changes.
- Preserve API rate limiting + duplicate dampening to reduce noisy incident volume.

## Recovery Validation (Exit Criteria)
Incident can be closed when all are true:
1. Synthetic submit returns `200 {ok:true}`.
2. Row appears in `public.leads`.
3. Row appears in `/lead-inbox`.
4. No ongoing 5xx spike in intake API logs.

## Post-Incident Template
- **Start time (PT):**
- **Detection channel:**
- **Severity:**
- **Impact window:**
- **Root cause:**
- **Mitigation applied:**
- **Validation evidence:**
- **Follow-up actions + owners:**
