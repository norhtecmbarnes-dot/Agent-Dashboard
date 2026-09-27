# API Key Storage Fix

**Date:** March 2, 2026  
**Issue:** API keys and Telegram token not persisting across restarts

## Problem

Multiple storage systems used `localStorage` which doesn't work server-side:

1. `src/lib/config/app-config.ts` - Stored API keys in localStorage
2. `src/lib/config/user-preferences.ts` - Stored Telegram config in localStorage  
3. `src/app/api/user/route.ts` - Received API keys but didn't save them

## Solution

Migrated all persistent configuration to SQLite database storage.

### Files Changed

| File | Change |
|------|--------|
| `src/app/api/user/route.ts` | Added API key storage methods |
| `src/lib/config/app-config.ts` | Migrated to SQLite storage |

### New API Endpoints

```typescript
// Save API key
POST /api/user
{
  "action": "setApiKey",
  "provider": "openrouter",
  "key": "sk-xxx..."
}

// Get all API keys (masked)
POST /api/user
{
  "action": "getApiKeys"
}

// Remove API key
POST /api/user
{
  "action": "removeApiKey",
  "provider": "openrouter"
}
```

### Storage Location

All configuration is now stored in SQLite:

```
data/assistant.db
├── documents (table)
│   └── category='user_preference' → User settings, Telegram config
│   └── category='app_config' → App settings, API keys
├── user_preferences (table)
└── app_config (table)
```

## Testing

```bash
# Save API key
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -d '{"action":"setApiKey","provider":"openrouter","key":"sk-test-12345"}'

# Response
{"success":true,"message":"openrouter API key saved"}

# Get API keys
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -d '{"action":"getApiKeys"}'

# Response
{"success":true,"apiKeys":{"openrouter":{"enabled":true,"masked":"sk-t...2345"}}}
```

## Environment Variables vs Database

| Method | Pros | Cons |
|--------|------|------|
| Environment Variables | Secure, no DB | Requires restart to change |
| Database (New) | Dynamic, no restart | Must handle carefully |

### Best Practice

1. **Development:** Use database storage for easy testing
2. **Production:** Use environment variables for security

```env
# Recommended for production
OPENROUTER_API_KEY=your_key
DEEPSEEK_API_KEY=your_key
GLM_API_KEY=your_key
```

## Telegram Bot Setup

After fix, Telegram tokens are now properly persisted:

1. Go to `/telegram`
2. Enter bot token from @BotFather
3. Click "Save Configuration"
4. Token now persists in SQLite
5. Click "Start Polling" to activate

## Related Documentation

- [DOCUMENTATION.md](./DOCUMENTATION.md) - Full documentation
- [TELEGRAM-SETUP.md](./TELEGRAM-SETUP.md) - Telegram setup guide