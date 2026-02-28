# Facebook Data Deletion Callback Setup

## Endpoint URLs
- Callback URL (Meta Basic Settings):
  - `https://www.natfordplanning.com/api/facebook/data-deletion`
- Human-readable status URL pattern:
  - `https://www.natfordplanning.com/facebook/data-deletion?code=<confirmation_code>`

## What the callback does
- Verifies `signed_request` HMAC signature using `FACEBOOK_APP_SECRET`.
- Extracts the app-scoped `user_id` from payload.
- Acknowledges deletion request and returns:

```json
{
  "url": "https://www.natfordplanning.com/facebook/data-deletion?code=<code>",
  "confirmation_code": "<code>"
}
```

## Required environment variable
Set in Vercel (Production/Preview/Development as needed):
- `FACEBOOK_APP_SECRET=<your_meta_app_secret>`

## Meta app dashboard fields
In App Settings → Basic:
- Privacy Policy URL: `https://www.natfordplanning.com/privacy`
- Terms of Service URL: `https://www.natfordplanning.com/terms`
- User Data Deletion Request URL: `https://www.natfordplanning.com/api/facebook/data-deletion`

## Testing flow
1. Login to app via Facebook Login.
2. Remove app from Facebook profile app settings.
3. Trigger deletion request from Removed Apps flow.
4. Confirm callback receives POST and returns `url` + `confirmation_code`.
