# Telegram Bot Setup Guide

## Overview

The AI Dashboard includes a Telegram bot integration that allows you to interact with your AI assistant through Telegram.

## Setup Instructions

### Step 1: Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send the message `/newbot`
3. Follow the instructions to name your bot
4. Copy the **API Token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Configure in AI Dashboard

1. Navigate to **http://localhost:3000/telegram**
2. Enter your bot token
3. Enable the bot
4. Click **Save Configuration**
5. The system will validate your token with Telegram

### Step 3: Choose Connection Mode

#### Option A: Polling (Recommended for Development)

Polling works without a public URL. The bot actively checks for new messages.

**Pros:**
- No public URL needed
- Works behind NAT/firewall
- Easier to set up

**Cons:**
- Slightly higher latency
- Uses more bandwidth for polling

**Setup:**
1. Save your bot token
2. Click **Start Polling**
3. Chat with your bot on Telegram!

#### Option B: Webhook (Recommended for Production)

Webhooks require a public URL. Telegram pushes messages to your server.

**Pros:**
- Lower latency
- More efficient
- Better for production

**Cons:**
- Requires public URL
- Needs SSL certificate
- More complex setup

**Setup:**
1. Set up a tunnel using ngrok, Cloudflare, or similar:
   ```bash
   # Using ngrok
   ngrok http 3000
   ```
2. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
3. Click **Set Webhook**
4. Chat with your bot on Telegram!

## Available Commands

| Command | Description |
|---------|-------------|
| `/start` | Start the bot and see welcome message |
| `/help` | Show available commands |
| `/search <query>` | Search the web |
| `/status` | Check system status |
| Any message | Chat with AI |

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Telegram Bot Flow                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  User sends message ──► Telegram Servers ──► Your Bot         │
│                                                      │       │
│                              ┌───────────────────────┘       │
│                              ▼                               │
│                     /api/telegram (webhook)                  │
│                     /api/telegram/polling (polling)           │
│                              │                               │
│                              ▼                               │
│                     TelegramService                           │
│                              │                               │
│                              ▼                               │
│                     ┌────────────────┐                       │
│                     │ Process Message │                       │
│                     └────────┬───────┘                       │
│                              │                               │
│            ┌─────────────────┼─────────────────┐              │
│            ▼                 ▼                 ▼              │
│      /start, /help   /search <query>    Regular message       │
│            │                 │                 │              │
│            ▼                 ▼                 ▼              │
│     Welcome msg     Web Search API     AI Model              │
│                                         (Chat Completion)     │
│                              │                               │
│                              ▼                               │
│                     Send response to user                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/telegram` | POST | Webhook endpoint for Telegram updates |
| `/api/telegram` | GET | Get available endpoints |
| `/api/telegram/config` | GET | Get current bot configuration |
| `/api/telegram/config` | POST | Save bot configuration |
| `/api/telegram/polling` | GET | Check polling status |
| `/api/telegram/polling` | POST | Start/stop polling |

## Configuration Storage

Bot configuration is stored in SQLite:

```sql
-- Table: documents
-- Category: user_preference
-- Content: JSON with telegram config

{
  "telegram": {
    "botToken": "your-bot-token",
    "enabled": true,
    "webhookUrl": "https://your-domain.com/api/telegram",
    "username": "your_bot_username"
  }
}
```

## Troubleshooting

### Bot Not Responding

1. **Check polling status**: Visit `/api/telegram/polling`
2. **Verify token is saved**: Visit `/api/telegram/config`
3. **Check server logs**: Look for `[Telegram]` in console output
4. **Restart server**: Sometimes polling needs a restart

### Invalid Token Error

1. Make sure you copied the full token
2. Token format: `numbers:alphanumeric`
3. Check for extra spaces or newlines
4. Create a new token from @BotFather if needed

### Webhook Issues

1. Ensure your URL is publicly accessible
2. Must use HTTPS (not HTTP)
3. Telegram must be able to reach your server
4. Check webhook info: `/api/telegram?action=webhookInfo`

### Rate Limits

Telegram has rate limits:
- ~30 messages/second to same chat
- ~20 messages/minute to same group
- Consider adding delays for bulk operations

## Security Considerations

1. **Protect your bot token**: Never commit it to source control
2. **Use allowedUsers**: Restrict who can use your bot
3. **Validate incoming updates**: Already handled by the service
4. **Rate limit responses**: Prevent spam

## Code Example: Custom Commands

To add custom commands, edit `/api/telegram/route.ts`:

```typescript
if (text.startsWith('/mystudy')) {
  const topic = text.replace('/mystudy ', '').trim();
  const studyMaterials = await generateStudyMaterials(topic);
  await telegramService.sendMessage(chatId, studyMaterials, 'Markdown');
  return NextResponse.json({ ok: true });
}
```

## Environment Variables (Optional)

You can also set the bot token via environment variable:

```env
TELEGRAM_BOT_TOKEN=your-bot-token-here
```

Then modify the code to check env first:

```typescript
const config = await loadTelegramConfig();
if (!config?.botToken && process.env.TELEGRAM_BOT_TOKEN) {
  return {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    enabled: true,
    chatWithAI: true,
    allowedUsers: [],
  };
}
```