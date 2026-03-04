# Buyer Journey Smoke Test — 2026-03-03

Owner: Bartholomew
Scope: checkout event -> entitlement write -> portal visibility -> manual fallback script

## Test context
- Target user: `test.website.customer@natfordplanning.test`
- Product lane: `drone-ops`
- Local route validation run against `http://127.0.0.1:4010/api/commerce/webhook` with signed test event

## Results
1. **Checkout event -> ledger**: PASS
   - Event inserted in `commerce_fulfillment_ledger`
   - Event type: `checkout.session.completed`
   - Tier recorded: `drone-professional`

2. **Entitlement write**: PASS
   - `customer_product_access` updated to:
     - email: `test.website.customer@natfordplanning.test`
     - product: `drone-ops`
     - tier: `drone-professional`
     - status: `active`
     - source: `stripe_webhook`

3. **Portal visibility (RLS/user session path)**: PASS
   - Signed-in test customer can read their own `customer_product_access` row

4. **Manual fallback script validation**: PASS
   - `scripts/provision-product-access.mjs` updated entitlement to `drone-enterprise`
   - User-visible row reflected updated tier

## Critical production finding (resolved)
- Initial probe showed missing secret (`500`), then resolved by configuring webhook secret.
- Current production behavior:
  - unsigned probe returns `400` (expected bad signature)
  - signed test event returns `200 {"ok":true}`
  - ledger + entitlement rows now update in production

## Remediation executed
1. Added `STRIPE_WEBHOOK_SECRET` to Vercel production env for `nat-ford-website`.
2. Redeployed production.
3. Re-ran webhook probes:
   - bad-signature probe -> `400`
   - signed event -> `200`, with verified `commerce_fulfillment_ledger` and `customer_product_access` writes.

## Operational fallback (already available)
Use manual provisioning script for same-day customer delivery until webhook secret is set:

```bash
node scripts/provision-product-access.mjs \
  --email buyer@example.com \
  --product drone-ops \
  --tier drone-professional \
  --role customer \
  --status active
```
