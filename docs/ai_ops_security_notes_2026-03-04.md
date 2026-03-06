# AI Ops Security Notes — 2026-03-04

## Scope
Security hardening applied to AI chat surfaces:
- `planner-chat` API route
- `grant-lab` API route
- Planner + Grant Lab BYOK (bring-your-own-key) client UI flows

## 1) Abuse-control ban check policy (fail-closed)

### Default behavior
Ban lookup is now **fail-closed by default**. If abuse-control ban lookup cannot run or errors:
- API returns `503` with a safe retry message
- upstream OpenAI call is **not attempted**

### Temporary non-production override
For temporary debugging in non-production only:
- set `AI_BAN_CHECK_FAIL_OPEN=true`
- this allows request flow to continue when ban lookup is unavailable/failing

Production remains fail-closed.

## 2) BYOK storage hardening

### Default key handling
User OpenAI keys are now **session-only by default**:
- key is held in component state and `sessionStorage`
- no localStorage key write unless explicitly opted in

### Explicit persistence opt-in
A new **"Remember on this device"** toggle is required before any key is written to localStorage.

### UX warning
Both BYOK UIs now show a warning:
- API key is sensitive
- only enable remember mode on trusted/private devices

### Clear-key behavior
Clear-key action is preserved and now clears both:
- localStorage key
- sessionStorage key

## 3) Key redaction in server logs
A shared sanitizer (`src/lib/security/redact-secrets.ts`) is used in AI chat routes to prevent raw key/token leakage in logs.

Applied to:
- upstream error payload logging
- caught error objects in route logging paths

This redacts common token/key patterns and sensitive object fields (`apiKey`, `authorization`, `token`, etc.).
