# Environment Variables Setup

Create a `.env.local` file in the project root with:

```env
# Supabase (Nat Ford website project)
NEXT_PUBLIC_SUPABASE_URL=https://vguhqcookoekpvumnvqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Nat Ford Planning & Analysis
```

## Notes

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe for browser use.
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only**. Never expose it client-side.
- Production/Preview/Development env vars are configured in Vercel for `natford/nfpa-website`.
