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

This artifact does not prove live customer delivery. Launch is still blocked until the live Stripe/customer-delivery path is wired and a real fulfillment smoke confirms:

- production Stripe Payment Links point to the correct one-time products,
- `checkout.session.completed` reaches `/api/commerce/webhook`,
- `commerce_fulfillment_ledger` and `customer_product_access` receive the expected product/tier rows,
- onboarding email or same-day manual delivery is operational,
- the buyer can sign in and see active access in `/portal`.
