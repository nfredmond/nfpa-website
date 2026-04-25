# AI-Assisted Planning Workflows Fulfillment Smoke Checklist

Date: 2026-04-25
Owner: Bartholomew
Scope: concise operator checklist and proof template for an authorized test-mode or live-mode fulfillment smoke for AI-Assisted Planning Workflows.

## Guardrails

- Human operator only: agents must not complete checkout, follow Stripe redirects, write env vars, mutate Supabase/customer rows, email customers, or edit generated product artifacts.
- Do not commit PII, card details, Stripe links, secret keys, raw customer emails, Supabase exports, or dashboard screenshots to this repo.
- Use a purpose-created smoke buyer and the lowest-risk tier unless the release owner chooses a different tier.
- Store any sensitive proof in the approved external evidence location, then record only sanitized references here.

## Canonical Fulfillment Contract

| Product ID | Tier ID | Expected access status | Expected source |
|---|---|---|---|
| `planner-ai-workflow-guide-v2` | `planner-ai-workflow-guide-starter` | `active` | `stripe_webhook` |
| `planner-ai-workflow-guide-v2` | `planner-ai-workflow-guide-practitioner` | `active` | `stripe_webhook` |
| `planner-ai-workflow-guide-v2` | `planner-ai-workflow-guide-team` | `active` | `stripe_webhook` |

## Agent-Safe Preflight

Run from repo root:

```bash
npm run smoke:ai-planning-workflows-launch
```

Expected result: `PASS`.

Optional no-secret proof capture:

```bash
node scripts/ai-planning-workflows-launch-dry-run.mjs \
  --proof-file /tmp/ai-assisted-planning-workflows-launch-dry-run-proof.md
```

This preflight only reads public website endpoints, verifies readiness plus checkout handoff metadata, and does not follow Stripe redirects or create purchases.

## Human-Only Fulfillment Smoke

Before checkout:

- [ ] Target mode selected: `test` or `live`.
- [ ] Tier selected: `starter`, `practitioner`, or `team`.
- [ ] Smoke buyer identity approved and documented outside this repo.
- [ ] Refund, cancellation, and access cleanup owner assigned outside this repo if live mode is used.
- [ ] No agent is driving the browser past the website checkout handoff.

Checkout and fulfillment:

- [ ] Human operator opens the chosen website checkout path and completes the authorized Stripe checkout in the selected mode.
- [ ] Stripe Dashboard shows a successful `checkout.session.completed` event for the smoke buyer.
- [ ] Stripe webhook delivery to `/api/commerce/webhook` succeeds.
- [ ] `client_reference_id` equals `planner-ai-workflow-guide-v2:<canonical-tier-id>`.
- [ ] `commerce_fulfillment_ledger` has the matching Stripe event recorded without duplicate-processing errors.
- [ ] `customer_product_access` has one active row for `planner-ai-workflow-guide-v2` and the selected canonical tier.
- [ ] `customer_onboarding_events` is recorded with status `sent`, `pending_email_config`, or `email_failed` per the delivery runbook.
- [ ] If onboarding status is `pending_email_config` or `email_failed`, same-day manual delivery owner and evidence are recorded outside this repo.
- [ ] Smoke buyer can sign in to `/portal` and see active access for AI-Assisted Planning Workflows.

## Sanitized Proof Template

Fill this section only after the human-only smoke is complete. Keep raw PII and screenshots out of git.

| Field | Sanitized value |
|---|---|
| Smoke completed at UTC | `TBD` |
| Target mode | `test` or `live` |
| Tier ID | `planner-ai-workflow-guide-...` |
| Checkout route tier used | `TBD` |
| Stripe event ID suffix only | `TBD` |
| Stripe session ID suffix only | `TBD` |
| Webhook delivery status | `TBD` |
| Ledger row present | `yes/no` |
| Access row active | `yes/no` |
| Portal access visible | `yes/no` |
| Onboarding/email state | `sent/pending_email_config/email_failed/manual-delivery-ready/not-tested` |
| Operator | `TBD` |
| External evidence reference | `TBD` |

## Pass Criteria

The smoke passes only when checkout completion, webhook delivery, ledger write, active access row, and portal visibility all match the canonical product/tier contract above.

If any required proof point fails, do not manually alter customer rows as part of this checklist. Preserve evidence, open an incident, and use the product access delivery runbook only under the assigned human owner.

## Remaining Launch Blocker

Launch remains blocked until an authorized human operator completes this checklist in the selected test or live mode and stores sanitized proof of the successful fulfillment path.
