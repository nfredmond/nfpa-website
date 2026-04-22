# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server (Turbopack) at http://localhost:3000
- `npm run build` — Production build (Turbopack)
- `npm run start` — Run the production build
- `npm run lint` — ESLint (uses `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`)

There is no test runner wired up. Smoke checks live in `scripts/`:

- `scripts/lead-intake-smoke-check.sh` — exercises the public lead form end-to-end
- `scripts/stripe-checkout-smoke.sh` — Stripe checkout smoke test
- `scripts/check-commerce-webhook-health.mjs` — verifies the Stripe webhook is alive
- `scripts/provision-product-access.mjs` — manual access provisioning fallback

PDF builders (`scripts/build_*.py`) regenerate the marketing PDFs in `public/`.

Supabase CLI: migrations live in `supabase/migrations/` and are applied with `supabase db push` against the project named in `supabase/config.toml`. Apply migrations in numeric order — they assume strict sequencing.

## Architecture

### Stack

Next.js 16 App Router (Turbopack-only, both dev and build) on React 19, Tailwind CSS v4 (CSS-first config in `globals.css`, no `tailwind.config`), TypeScript strict mode, Supabase (Postgres + Auth + Storage), Stripe for checkout, Mapbox GL JS, lucide-react icons. Path alias `@/*` → `src/*`.

### Routing layout

Single route group `src/app/(marketing)/` holds nearly every user-facing page — marketing site, auth pages, client portal, admin, lead-inbox, products, grant-lab, dashboard, etc. The group exists to share the marketing layout (Header/Footer); auth-protected sections still live inside it and are gated by middleware, not by being in a separate route group. API routes are under `src/app/api/`.

### Auth + the proxy

This project uses Next.js 16's `proxy.ts` (not `middleware.ts`) at `src/proxy.ts`. It calls `updateSession` from `src/lib/supabase/middleware.ts` and currently matches `/portal/*`, `/dashboard/*`, `/login`, `/signup`. **When adding a new authenticated route, update the `matcher` in `src/proxy.ts`** — putting a page under `(marketing)` does not auto-protect it.

Supabase clients are split by execution context, and the split matters:

- `src/lib/supabase/client.ts` — browser client (`'use client'` components only)
- `src/lib/supabase/server.ts` — Server Components / Server Actions / Route Handlers
- `src/lib/supabase/admin.ts` — service-role client; server-only, never import from client code
- `src/lib/supabase/middleware.ts` — used exclusively by `proxy.ts` for cookie refresh

Admin-area access checks go through `src/lib/auth/admin-access.ts` and audit logs via `src/lib/auth/admin-audit.ts` (writes to the `admin_action_log` table).

### Theming

Light/dark is class-based (`.dark` on `<html>`), not media-query driven. The toggle is set early by `src/app/theme-script.tsx` injected in `<head>` to prevent flash. Tailwind's dark variant is rebound in `globals.css`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Colors are CSS variables (`--background`, `--foreground`, `--pine`, `--pine-deep`, `--copper`, `--sand`, `--fog`, `--line`, `--ink`) redefined under `.dark`. Reference them as `bg-[color:var(--pine)]` / `text-[color:var(--foreground)]` rather than hard-coded hex. Fonts are `Cormorant Garamond` (display) and `Source Sans 3` (body), loaded via `next/font/google` in `src/app/layout.tsx` and exposed as `--font-display` / `--font-body`.

### Components

- `src/components/layout/` — `Header`, `Footer`, `Container`, `Section`, `Grid` (the page chrome primitives)
- `src/components/ui/` — `Button`, `Card`, `Input`, `Textarea`, `ThemeToggle`
- `src/components/features/` and `src/components/auth/` — feature-scoped pieces
- `cn()` lives in `src/lib/utils.ts` (clsx + tailwind-merge). Use it for conditional classes.

### Static content

Structured site data lives in `src/data/` as JSON/TS (`projects.json`, `services.json`, `organization.json`, `funding-calendar.csv`, `funding-readiness-scorecard.ts`, `admin-project-status.json`). Edit these rather than hardcoding copy in components when the content is shared across pages or used in JSON-LD. `organization.json` is the schema.org Organization payload — its `logo` URL must point to a real public asset.

### Brand assets

Logos live in `public/logos/`. Header swaps light/dark variants via `dark:hidden` / `dark:block` on two `<Image>` tags. Footer always uses the white wordmark on the dark `#0f1720` background. Favicons at the App Router conventional paths: `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png`. The brand kit master is `new logos/` (see its README + `01_Final_Official_Logo_Suite/06_DOCUMENTS/Simple_Brand_Guide.txt` — note "Light" = for light backgrounds, "Dark" = for dark backgrounds).

### Vercel / Next 16 notes

Default to Server Components; add `'use client'` only when you need interactivity. Use `proxy.ts` (Next 16 convention), not `middleware.ts`. Prefer `next/image`, `next/font`, and platform-native integrations over custom workarounds.
