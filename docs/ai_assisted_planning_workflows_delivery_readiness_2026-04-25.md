# AI-Assisted Planning Workflows Delivery Readiness

Date: 2026-04-25
Owner: Bartholomew
Scope: local no-secret readiness artifact for the AI-Assisted Planning Workflows launch.

## What is ready locally

- Public website tier IDs remain canonical:
  - `planner-ai-workflow-guide-starter`
  - `planner-ai-workflow-guide-practitioner`
  - `planner-ai-workflow-guide-team`
- Legacy checkout tier aliases remain accepted:
  - `vibe-coding-planners-starter`
  - `vibe-coding-planners-practitioner`
  - `vibe-coding-planners-team`
- Stripe Payment Link env resolution still prefers canonical keys and falls back to legacy aliases:
  - `STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_29` -> `STRIPE_LINK_VIBE_CODING_PLANNERS_29`
  - `STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_39` -> `STRIPE_LINK_VIBE_CODING_PLANNERS_39`
  - `STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_49` -> `STRIPE_LINK_VIBE_CODING_PLANNERS_49`
- Checkout handoff uses `client_reference_id=<productId>:<canonicalTierId>`.
- Webhook fulfillment canonicalizes legacy tier aliases before writing entitlement state.
- Portal display uses `offerCatalog` product names and `customer_product_access` rows.

## Local no-secret smoke

Run from repo root:

```bash
npm run test:commerce-delivery
```

This validates the website/product handoff contract without reading `.env.local`, Stripe secrets, Supabase service-role keys, product distribution files, or live purchase state.

It checks:

- AI-Assisted Planning Workflows product ID, tier IDs, prices, and one-time purchase labeling.
- Legacy checkout aliases resolve to the canonical tier IDs.
- Canonical Stripe env keys retain their legacy fallback aliases.
- Checkout `client_reference_id` values infer the same product/tier pair the webhook writes to `customer_product_access`.
- Prelaunch OpenPlan client reference inference remains compatible.

## Live no-purchase dry-run

Run from repo root:

```bash
npm run smoke:ai-planning-workflows-launch
```

This reads the public production readiness and checkout endpoints, but it does not follow Stripe redirects, create a checkout session, complete a purchase, write Supabase rows, send onboarding email, or read secrets.

It checks:

- production reports the three AI-Assisted Planning Workflows tiers as configured,
- configured env keys are either the canonical `STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_*` names or the accepted legacy `STRIPE_LINK_VIBE_CODING_PLANNERS_*` fallbacks,
- canonical checkout routes redirect to an allowed Stripe host,
- legacy checkout aliases still redirect to the same canonical product/tier handoff,
- redirect URLs carry `client_reference_id=planner-ai-workflow-guide-v2:<canonical-tier-id>`.

To save a no-secret operator proof:

```bash
node scripts/ai-planning-workflows-launch-dry-run.mjs \
  --proof-file docs/ai_assisted_planning_workflows_launch_dry_run_proof_2026-04-25.md
```

The human-only fulfillment smoke checklist and sanitized proof template are in `docs/ai_assisted_planning_workflows_fulfillment_smoke_checklist_2026-04-25.md`. After the authorized human smoke, use the local no-secret proof helper to generate and validate sanitized evidence:

```bash
npm run proof:ai-planning-workflows-fulfillment -- \
  --proof-file /tmp/ai-assisted-planning-workflows-fulfillment-proof.md
npm run proof:ai-planning-workflows-fulfillment -- \
  --validate /tmp/ai-assisted-planning-workflows-fulfillment-proof.md \
  --require-complete
```

## Customer delivery contract

For a completed checkout, fulfillment must write:

| Product ID | Tier ID | Status | Source |
|---|---|---|---|
| `planner-ai-workflow-guide-v2` | `planner-ai-workflow-guide-starter` | `active` | `stripe_webhook` |
| `planner-ai-workflow-guide-v2` | `planner-ai-workflow-guide-practitioner` | `active` | `stripe_webhook` |
| `planner-ai-workflow-guide-v2` | `planner-ai-workflow-guide-team` | `active` | `stripe_webhook` |

Manual fallback must use the same product and canonical tier IDs:

```bash
node scripts/provision-product-access.mjs \
  --email buyer@example.com \
  --product planner-ai-workflow-guide-v2 \
  --tier planner-ai-workflow-guide-practitioner \
  --role customer \
  --status active
```

## Still blocking launch

The local contract smoke and live dry-run do not prove live customer delivery. Launch is still blocked until an authorized real fulfillment smoke confirms:

- `checkout.session.completed` reaches `/api/commerce/webhook`,
- `commerce_fulfillment_ledger` and `customer_product_access` receive the expected product/tier rows,
- onboarding records `sent`, `pending_email_config`, or `email_failed`, with same-day manual delivery ready for non-sent states,
- the buyer can sign in and see active access in `/portal`.
