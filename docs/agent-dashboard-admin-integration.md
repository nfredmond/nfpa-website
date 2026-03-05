# Agent Dashboard Admin Integration (Scaffold)

This site now includes an **Agent Ops** tab inside `/admin`.

## What it does

- Uses existing admin auth gate (`allowlist + Google provider + MFA AAL2`)
- Shows remote dashboard snapshot (gateway/agents/tokens)
- Proxies sensitive gateway actions server-side via:
  - `POST /api/admin/agent-dashboard/action`
- Optional status probe endpoint:
  - `GET /api/admin/agent-dashboard/status`

## Required env vars (nat-ford-website deployment)

- `AGENT_DASHBOARD_REMOTE_BASE_URL`
  - Example: `https://agent-dashboard-admin.natfordplanning.com`
- `AGENT_DASHBOARD_REMOTE_READ_TOKEN`
  - Used for remote status probes
- `AGENT_DASHBOARD_REMOTE_ACTION_TOKEN`
  - Used for privileged action proxy calls
- `AGENT_DASHBOARD_REMOTE_TIMEOUT_MS` (optional)

## Security posture

- Tokens remain server-side only (never emitted to browser JS)
- Actions are only reachable by authenticated admin users
- Remote dashboard service should still be behind reverse-proxy auth/TLS

## Current scope vs future

Current:
- Admin gated snapshot + action proxy + link-out to full dashboard

Future:
- Full embedded remote panel with signed short-lived session handoff
- Richer action confirmation UX and live action telemetry stream
