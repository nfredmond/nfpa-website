# Stripe Checkout Go-Live Runbook (natfordplanning.com)

## 1) Exact env key list + tier mapping (12 total)

| Tier ID | Product | Canonical Env Key | Legacy fallback alias |
|---|---|---|---|
| `openplan-starter` | OpenPlan Software | `STRIPE_LINK_OPENPLAN_STARTER` | `none` |
| `openplan-professional` | OpenPlan Software | `STRIPE_LINK_OPENPLAN_PROFESSIONAL` | `none` |
| `openplan-agency` | OpenPlan Software | `STRIPE_LINK_OPENPLAN_AGENCY` | `none` |
| `ads-essentials` | Marketing & Planning Analytics Software | `STRIPE_LINK_ADS_ESSENTIALS` | `none` |
| `ads-growth` | Marketing & Planning Analytics Software | `STRIPE_LINK_ADS_GROWTH` | `none` |
| `ads-scale` | Marketing & Planning Analytics Software | `STRIPE_LINK_ADS_SCALE` | `none` |
| `drone-starter` | DroneOps Intelligence | `STRIPE_LINK_DRONE_STARTER` | `none` |
| `drone-professional` | DroneOps Intelligence | `STRIPE_LINK_DRONE_PROFESSIONAL` | `none` |
| `drone-enterprise` | DroneOps Intelligence | `STRIPE_LINK_DRONE_ENTERPRISE` | `none` |
| `planner-ai-workflow-guide-starter` | AI-Assisted Planning Workflows | `STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_29` | `STRIPE_LINK_VIBE_CODING_PLANNERS_29` |
| `planner-ai-workflow-guide-practitioner` | AI-Assisted Planning Workflows | `STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_39` | `STRIPE_LINK_VIBE_CODING_PLANNERS_39` |
| `planner-ai-workflow-guide-team` | AI-Assisted Planning Workflows | `STRIPE_LINK_AI_ASSISTED_PLANNING_WORKFLOWS_49` | `STRIPE_LINK_VIBE_CODING_PLANNERS_49` |

The website reads the canonical key first. For the AI-Assisted Planning Workflows tiers only, it falls back to the legacy `STRIPE_LINK_VIBE_CODING_PLANNERS_*` aliases when the canonical key is blank or unset.

Legacy checkout route tier IDs remain accepted for compatibility: `vibe-coding-planners-starter`, `vibe-coding-planners-practitioner`, and `vibe-coding-planners-team`.

---

## 2) One-command env wiring (copy/paste)

### A. Prepare private env file (do not commit)
```bash
cp scripts/stripe-links.env.example /tmp/stripe-links.env
# then paste real Stripe links into /tmp/stripe-links.env
```

### B. Wire all 12 canonical vars to Vercel production+preview+development
```bash
./scripts/stripe-links-wire.sh /tmp/stripe-links.env
```

The wiring script writes canonical env names. During migration, the private env file may provide the legacy AI-Assisted Planning Workflows alias instead of the canonical name; the script will use that value while writing the canonical key.

---

## 3) Post-wire smoke validation

### Run
```bash
./scripts/stripe-checkout-smoke.sh
```

To also check the legacy tier route aliases:

```bash
CHECK_LEGACY_TIER_ALIASES=1 ./scripts/stripe-checkout-smoke.sh
```

### Expected pass output
- 12 lines beginning with `PASS` (one per tier)
- each line shows a `location=` URL that contains `stripe.com`
- summary shows:

```text
Summary: PASS=12 FAIL=0 TOTAL=12
```

If any tier fails, the script exits non-zero and prints the failing tier + redirect location.
