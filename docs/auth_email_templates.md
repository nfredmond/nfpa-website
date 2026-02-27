# Auth Email Copy Templates (Supabase)

Use these in Supabase Dashboard → Authentication → Email Templates.

## 1) Confirm Signup Email

**Subject:** Confirm your Nat Ford customer account

**Body (HTML/text hybrid):**

Hi,

Welcome to Nat Ford Planning & Analysis.

Please confirm your email to activate your customer portal access:

{{ .ConfirmationURL }}

If you did not request this account, you can ignore this message.

— Nat Ford Team

## 2) Password Recovery Email

**Subject:** Reset your Nat Ford account password

**Body:**

Hi,

We received a request to reset your password.

Use this secure link to set a new password:

{{ .ConfirmationURL }}

If you did not request this reset, no action is needed.

— Nat Ford Team

## 3) Magic Link (optional)

**Subject:** Your Nat Ford sign-in link

**Body:**

Hi,

Use this secure sign-in link:

{{ .ConfirmationURL }}

If you didn’t request this, you can ignore this email.

— Nat Ford Team

## Implementation Notes

- Keep links as `{{ .ConfirmationURL }}` so Supabase appends token context.
- Ensure allowed redirect URLs include `/login` and `/auth/update-password`.
- Keep tone plain, professional, and low-friction for municipal/public-sector users.
