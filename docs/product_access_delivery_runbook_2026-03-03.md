# Product Access Delivery Runbook (Post-Purchase)

Date: 2026-03-03
Owner: Bartholomew

## Goal
Deliver account access immediately when a customer buys OpenPlan, DroneOps, or other product tiers.

## System Components
1. `commerce_fulfillment_ledger` (existing): Stripe event ledger
2. `customer_product_access` (new): product/tier entitlement state by customer email
3. Portal view (`/portal`): displays purchased product access tied to signed-in user email
4. Webhook sync (`/api/commerce/webhook`): updates entitlement table + user metadata

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

## Immediate Delivery Promise
For paid customers, the account access lane must be activated same-day via webhook or manual fallback.

## Safety Notes
- Never expose service-role keys client-side.
- All role/entitlement writes happen in backend routes or local operator scripts.
