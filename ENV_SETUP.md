# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xezwjmclbpvklojbcmaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlendqbWNsYnB2a2xvamJjbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzY2ODAsImV4cCI6MjA1OTcxMjY4MH0.5aVrcOOO3oDtKdjX2UbrXfUiQLfnNThNn2bRGOnLdUM

# Mapbox (get your token from https://mapbox.com)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Nat Ford Planning & Analysis
```

## Getting a Mapbox Token

1. Go to https://mapbox.com
2. Sign up or log in
3. Go to Account > Tokens
4. Create a new token with the following scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
5. Copy the token and paste it into your `.env.local` file

