# Stripe Checkout Go-Live Runbook (natfordplanning.com)

## 1) Exact env key list + tier mapping (12 total)

| Tier ID | Product | Env Key |
|---|---|---|
| `openplan-starter` | OpenPlan SaaS | `STRIPE_LINK_OPENPLAN_STARTER` |
| `openplan-professional` | OpenPlan SaaS | `STRIPE_LINK_OPENPLAN_PROFESSIONAL` |
| `openplan-agency` | OpenPlan SaaS | `STRIPE_LINK_OPENPLAN_AGENCY` |
| `ads-essentials` | Marketing & Planning Analytics Software | `STRIPE_LINK_ADS_ESSENTIALS` |
| `ads-growth` | Marketing & Planning Analytics Software | `STRIPE_LINK_ADS_GROWTH` |
| `ads-scale` | Marketing & Planning Analytics Software | `STRIPE_LINK_ADS_SCALE` |
| `drone-starter` | DroneOps Intelligence | `STRIPE_LINK_DRONE_STARTER` |
| `drone-professional` | DroneOps Intelligence | `STRIPE_LINK_DRONE_PROFESSIONAL` |
| `drone-enterprise` | DroneOps Intelligence | `STRIPE_LINK_DRONE_ENTERPRISE` |
| `vibe-coding-planners-starter` | Vibe Coding for Planners | `STRIPE_LINK_VIBE_CODING_PLANNERS_29` |
| `vibe-coding-planners-practitioner` | Vibe Coding for Planners | `STRIPE_LINK_VIBE_CODING_PLANNERS_39` |
| `vibe-coding-planners-team` | Vibe Coding for Planners | `STRIPE_LINK_VIBE_CODING_PLANNERS_49` |

---

## 2) One-command env wiring (copy/paste)

### A. Prepare private env file (do not commit)
```bash
cp scripts/stripe-links.env.example /tmp/stripe-links.env
# then paste real Stripe links into /tmp/stripe-links.env
```

### B. Wire all 12 vars to Vercel production+preview+development
```bash
./scripts/stripe-links-wire.sh /tmp/stripe-links.env
```

---

## 3) Post-wire smoke validation

### Run
```bash
./scripts/stripe-checkout-smoke.sh
```

### Expected pass output
- 12 lines beginning with `PASS` (one per tier)
- each line shows a `location=` URL that contains `stripe.com`
- summary shows:

```text
Summary: PASS=12 FAIL=0 TOTAL=12
```

If any tier fails, the script exits non-zero and prints the failing tier + redirect location.
