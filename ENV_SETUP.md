# Environment Variables Setup

Create a `.env.local` file in the project root with:

```env
# Supabase (Nat Ford website project)
NEXT_PUBLIC_SUPABASE_URL=https://vguhqcookoekpvumnvqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>

# Internal Lead Inbox
LEAD_INBOX_PASSWORD=<STRONG_PASSWORD>

# Optional Cloudflare Turnstile (recommended for production spam hardening)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<YOUR_TURNSTILE_SITE_KEY>
TURNSTILE_SECRET_KEY=<YOUR_TURNSTILE_SECRET_KEY>

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Nat Ford Planning & Analysis

# Optional (if using custom app URLs in auth templates)
# SUPABASE_AUTH_REDIRECT_URL=https://www.natfordplanning.com/login

# Optional Meta/Facebook callback verification
FACEBOOK_APP_SECRET=<META_APP_SECRET>

# AI planner chatbot (homepage)
OPENAI_API_KEY=<OPENAI_API_KEY>
# Model is fixed in code to provider-native: gpt-5.3-codex
# (OpenClaw alias equivalent: openai-codex/gpt-5.3-codex)

# Stripe checkout links used by /api/commerce/checkout routing
STRIPE_LINK_VIBE_CODING_PLANNERS_29=<https://buy.stripe.com/...>
STRIPE_LINK_VIBE_CODING_PLANNERS_39=<https://buy.stripe.com/...>
STRIPE_LINK_VIBE_CODING_PLANNERS_49=<https://buy.stripe.com/...>

# Stripe Price IDs for launch tracking / operations docs
STRIPE_PRICE_VIBE_CODING_PLANNERS_29=<price_...>
STRIPE_PRICE_VIBE_CODING_PLANNERS_39=<price_...>
STRIPE_PRICE_VIBE_CODING_PLANNERS_49=<price_...>
```

## Notes

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe for browser use.
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only**. Never expose it client-side.
- Configure Supabase Auth redirect URLs to include:
  - `https://<your-domain>/login`
  - `https://<your-domain>/auth/update-password`
  - local dev: `http://localhost:3000/login` and `http://localhost:3000/auth/update-password`
- `STRIPE_LINK_VIBE_CODING_PLANNERS_*` values are required for live checkout redirects from `/api/commerce/checkout`.
- `STRIPE_PRICE_VIBE_CODING_PLANNERS_*` values are documented for launch ops and reconciliation (not read by app runtime yet).
- Optional prelaunch OpenPlan discount controls:
  - `OPENPLAN_PRELAUNCH_PROMO_CODE` (default: `OPENPLAN15`)
  - `OPENPLAN_PRELAUNCH_END` (default: `2026-04-01T00:00:00-07:00`)
- `FACEBOOK_APP_SECRET` enables signature verification for Meta Data Deletion callback endpoint (`/api/facebook/data-deletion`).
- Homepage AI planner chatbot and Grant Lab both use `OPENAI_API_KEY` and are pinned to `gpt-5.3-codex` (OpenClaw alias equivalent: `openai-codex/gpt-5.3-codex`).
- Anonymous users get a 10-minute planning-chat window before signup/login is required; authenticated users keep higher throughput limits.
- AI usage controls now use Supabase persistence (`public.ai_usage_events`) and require `SUPABASE_SERVICE_ROLE_KEY` in runtime env.
- Production/Preview/Development env vars should be set in the active Vercel project serving `www.natfordplanning.com` (`nat-ford-planning/nfpa-website`).
