# Product Access Delivery Runbook (Post-Purchase)

Date: 2026-03-03
Owner: Bartholomew

## Goal
Deliver account access immediately when a customer buys OpenPlan, DroneOps, or other product tiers.

## System Components
1. `commerce_fulfillment_ledger`: Stripe event ledger
2. `customer_product_access`: product/tier entitlement state by customer email
3. `customer_onboarding_events`: post-purchase onboarding and welcome-email delivery state
4. Portal view (`/portal`): displays purchased product access tied to signed-in user email
5. Webhook sync (`/api/commerce/webhook`): updates entitlement table + user metadata + onboarding trigger
6. Webhook health monitor (`scripts/check-commerce-webhook-health.mjs` + `/api/admin/commerce/webhook-health`)

## Auto Provisioning Flow
1. Stripe sends signed webhook event.
2. Event lands in ledger table.
3. Matching customer email + product/tier writes to `customer_product_access`.
4. If a Supabase auth user exists with that email, `app_metadata.product_access` is synced.
5. Customer signs in at `/portal` and sees active product access.

## Manual Fallback (if webhook misses or delayed)
From repo root (`nat-ford-website`):

```bash
node scripts/provision-product-access.mjs \
  --email buyer@example.com \
  --product drone-ops \
  --tier drone-professional \
  --role customer \
  --status active
```

## Recommended Product IDs / Tier IDs
- OpenPlan: `openplan` / `openplan-starter|openplan-professional|openplan-agency`
- DroneOps: `drone-ops` / `drone-starter|drone-professional|drone-enterprise`
- Marketing software: `ads-automation` / `ads-essentials|ads-growth|ads-scale`
- AI-Assisted Planning Workflows: `planner-ai-workflow-guide-v2` / `planner-ai-workflow-guide-starter|planner-ai-workflow-guide-practitioner|planner-ai-workflow-guide-team`

## Immediate Delivery Promise
For paid customers, the account access lane must be activated same-day via webhook or manual fallback.

## Webhook Failure Monitor
Use this command to alert when no successful webhook deliveries occurred in the monitoring window:

```bash
node scripts/check-commerce-webhook-health.mjs --windowMinutes=120
```

- Exit code `0` = healthy
- Exit code `2` = alert condition (no successful deliveries in window)

## Post-Purchase Welcome Trigger
- On `checkout.session.completed`, webhook automation now records onboarding state in `customer_onboarding_events`.
- If `RESEND_API_KEY` and `ONBOARDING_FROM_EMAIL` are configured, a welcome/provisioning email is sent automatically.
- If email provider config is missing, event status is still queued with actionable metadata.

## Safety Notes
- Never expose service-role keys client-side.
- All role/entitlement writes happen in backend routes or local operator scripts.
- Keep manual fallback (`provision-product-access.mjs`) as the recovery path if webhook or email automation degrades.
