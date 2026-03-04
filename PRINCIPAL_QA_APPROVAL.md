# PRINCIPAL_QA_APPROVAL.md

- Date: 2026-03-04
- Reviewer: Elena Marquez (Principal Planner)
- Status: PASS

## Scope reviewed
- Homepage copy cleanup for client-facing polish:
  - Removed "United States · Planning + Software" pill.
  - Removed "Delivery Signal Panel" and "Live Working Style" labels.
  - Removed "New · AI Expert Chat" pill.
- Terminology cleanup:
  - Replaced "SaaS" with "Software" across public-facing site copy and product/contact labels.
- Theme behavior:
  - Updated theme initialization and toggle logic to default to system light/dark preference unless user sets a manual override.
- Verification:
  - Local production build completed successfully (`npm run build`).

## Known assumptions
- Vercel auto-deploy from `main` remains active for `nat-ford-website`.
- Existing theme toggle should still support manual user override after defaulting to system preference.
- Requested copy removals are limited to the specified labels and similar "New ·" treatment.

## Blockers
- None.

## Explicit recommendation
- APPROVE SHIP: commit to `main` and deploy immediately, then perform a production smoke check on homepage hero labels, grant-lab badge text, and system dark-mode default behavior.

---

## Follow-up Principal Review (2026-03-04, same release window)
- status: PASS
- scope reviewed: Uncommitted wording-only changes across 12 marketing files (`contact`, `home`, `process`, `products`, `projects` + two project detail pages, four service detail pages, and services index CTA label).
- known assumptions: Review focused on client-facing clarity/internal-language risk in the current diff; unchanged baseline UX/layout accepted.
- blockers: None.
- explicit recommendation: APPROVE SHIP. Changes improve planner-facing clarity by replacing internal-feeling terms (lane/layer/archive/detail) with plain language (project, tools, options, service overview, project experience) without introducing harmful regressions.
