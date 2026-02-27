# Nat Ford Website — Next Round Plan (Post-Ship)

Date: 2026-02-24
Owner: Nathaniel + Bartholomew

## 1) Audit Findings (completed)

### High-priority fixes completed
- Added missing service routes to eliminate 404s:
  - `/services/gis`
  - `/services/aerial`
  - `/services/grants`
  - `/services/ai`
- Added missing project archive routes referenced by planning page:
  - `/projects/del-norte-atp`
  - `/projects/tehama-vmt`
- Fixed broken organization logo URL in structured data:
  - `src/data/organization.json`
- Added placeholder auth pages to prevent `/portal` redirect dead-end 404:
  - `/login`
  - `/signup`

### Current known issue (non-blocking)
- `npm run lint` fails due ESLint circular config issue (tooling/config-level, not page runtime).

## 2) Design & UX Improvements (next sprint)

### Sprint A — Conversion polish (1-2 sessions)
- Add one persistent top CTA style across all pages.
- Standardize section-end CTA patterns (service/product pages).
- Improve contact page with brief qualification fields:
  - budget range
  - desired start date
  - project geography

### Sprint B — Credibility layer
- Expand 2-3 project archive pages into full case-study format:
  - challenge
  - method
  - outputs
  - implementation/funding relevance
- Add an "Attribution Standard" component reused on experience pages.

### Sprint C — Performance & QA
- Run Lighthouse + Web Vitals pass (mobile first).
- Generate modern image variants (AVIF/WebP pipeline) if encoder available.
- Add link checker into CI (prevent future broken internal links).

## 3) Database / Supabase Readiness

## Current state
- Website currently functions as marketing-first site.
- Contact flow is mailto-based (no database persistence yet).
- Supabase helper files exist, but env vars are not configured for this project.

## Recommended point to connect Supabase
Connect Supabase **after** we lock:
1. lead data schema,
2. privacy language + retention policy,
3. who handles inbound pipeline operationally.

### Trigger to connect now (go/no-go)
Go when all are true:
- We want web form submissions stored/queried in dashboard.
- We want follow-up pipeline metrics (response SLA, conversion rates).
- We have a clear owner for lead triage and retention policy.

## 4) Supabase Connection Plan (when greenlit)

1. Create project: `natford-website-prod` in Nat Ford org (West US region).
2. Add env vars in Vercel (`nat-ford-website`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
3. Create `leads` table + RLS policies.
4. Replace mailto submit with server action/API route writing to Supabase.
5. Add anti-spam protections (honeypot + rate limit + optional Turnstile).
6. Add admin view (protected) or lightweight exports for follow-up.

## 5) Decision Recommendation

- Keep current production as-is for immediate momentum.
- Start Supabase connection in the **next sprint** once lead intake operations are finalized.
- If you want immediate lead analytics this week, we can wire Supabase in one focused build block.
