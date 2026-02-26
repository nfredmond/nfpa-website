# Lead Intake Reliability Check — 2026-02-25

## Objective
Execute end-to-end intake verification:
- Form/API submit
- Database write
- Internal inbox visibility
- Failure-path checks
- Alerting/logging coverage review

## Environment Used
- App runtime: local Next.js (`http://localhost:3015`) with live Supabase project wiring
- Supabase project ref: `vguhqcookoekpvumnvqc`
- Test data policy: synthetic `@example.com` leads inserted and then removed

## Validation Results
### 1) Submit -> API success
- POST `/api/leads` returned `200` with `{ "ok": true }`.
- Result: **PASS**

### 2) API -> DB write
- Queried `public.leads` via service-role REST API for synthetic email.
- Row present with expected fields and `status='new'`.
- Result: **PASS**

### 3) DB row -> Internal inbox visibility
- Authenticated via `/api/lead-inbox/auth`.
- Loaded `/lead-inbox`; synthetic email present in rendered output.
- Result: **PASS**

### 4) Failure/guardrail checks
- Rate-limit check: 4th submission in 1 hour for same email returned `429`.
- Duplicate dampening check: repeated payload returned `{ ok: true, duplicate: true }`.
- Unauthorized export check: `/api/lead-inbox/export` returned `401` without auth.
- Bad auth check: `/api/lead-inbox/auth` invalid password -> `303` redirect to `/lead-inbox?error=1`.
- Result: **PASS**

### 5) Alerting/logging coverage review
- Route-level request logging visible in Next server output.
- Custom error logging present only in `src/app/api/leads/route.ts` (`console.error` paths).
- No integrated proactive alerting (Slack/webhook/pager) currently wired for intake failures.
- Result: **GAP IDENTIFIED**

## Top Reliability Risks (Current)
1. **No proactive alerting for intake failures (highest risk)**
   - Failure may go unnoticed until manual inbox review.
2. **Limited structured logging across lead-inbox mutation routes**
   - Harder to diagnose status/update/export issues quickly.
3. **Single shared inbox password model**
   - Operational and access-control fragility (rotation + audit challenges).
4. **No formal synthetic monitoring schedule yet**
   - No guaranteed heartbeat on the lead funnel.

## Immediate Safeguards Implemented
1. Added automated smoke-check script:
   - `scripts/lead-intake-smoke-check.sh`
   - Verifies submit -> DB -> optional inbox visibility
   - Cleans up synthetic rows by default
2. Added incident response runbook v1:
   - `docs/lead-intake-incident-runbook-v1.md`
3. Preserved and validated anti-abuse controls:
   - Email/IP rate limiting and duplicate dampening are active

## Recommended Next Actions (24-72h)
1. Wire smoke-check failures to `#ops-alerts` (cron + notifier).
2. Add structured error logs to lead-inbox API routes (`status`, `update`, `export`, `auth`).
3. Add deploy-gate check: run smoke check post-deploy and block promotion on failure.
4. Plan migration from shared password to role-based inbox auth.
