# Telegram — control your agent from your phone

Agent Dashboard ships a Telegram bridge: you message your bot, it forwards to the OpenMuse agent, and the agent's reply lands back in your chat. Approvals (task reviews, computer commands) arrive as inline buttons.

```
Phone (Telegram) ──► Telegram bridge ──► OpenMuse API (:8787) ──► gpt-oss-120b
        ▲                                                            │
        └────────────────── reply streamed back ────────────────────┘
```

## 1. Create the bot

1. Open Telegram, search **@BotFather**
2. Send `/newbot`, follow the prompts
3. Copy the **API token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## 2. Get your chat ID

Message **@userinfobot** from your account — it replies with your user ID. That's `TELEGRAM_CHAT_ID`.

## 3. Configure the bridge

```bash
cd telegram-bridge
npm install
cp .env.example .env
```

`.env`:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=your-user-id
OPENMUSE_API_URL=http://127.0.0.1:8787
```

The bridge only responds to your chat ID — anyone else who finds the bot is ignored.

## 4. Run it

Make sure the OpenMuse API is up (`pnpm dev` in `OpenMuse/`, port 8787), then:

```bash
node index.js
```

Send any message to your bot — the agent replies.

## Commands

| Command | What it does |
|---|---|
| `/start` | Welcome + status |
| `/help` | List commands |
| `/status` | Agent/API health |
| `/tasks` | Active and finished work summary |
| `/new` | Start a fresh conversation thread |
| `/approvals` | Review pending email/calendar actions |
| any text | Chat with the agent |

## How it works

- **grammy** long-polls Telegram (no public URL, no webhook, works behind NAT/firewall)
- Your text is forwarded to OpenMuse the same way the web and native clients talk to it:
  1. `POST /api/session` opens a session token
  2. `GET /api/main-thread` gives the stable conversation thread
  3. `POST /api/copilotkit/agent/default/run` dispatches your message to the CopilotKit runtime
  4. the reply is read back from the persisted CopilotKit Intelligence thread
     (`GET /api/copilotkit/threads/:id/messages`) and sent to Telegram
- `/new` starts a fresh thread; without it your Telegram messages continue on the main thread
- When the agent has prepared an action (e.g. a computer command or email send), `/approvals`
  lists it with ✅ / ❌ inline buttons that decide the review through the API

> The bridge uses the same endpoints as the official client, so it works with whatever model
> OpenMuse is configured for (local Ollama, a hosted provider, or an AG-UI endpoint).

> Reference: `telegram-bridge/reference/TELEGRAM-SETUP.md` — the Telegram architecture doc from the original PersonalAI Dashboard (polling vs webhook trade-offs, rate limits, security notes).

## Troubleshooting

| Symptom | Fix |
|---|---|
| Bot silent | Is `node index.js` running? Is the API on :8787 healthy? |
| `401` from Telegram | Token wrong or truncated — re-copy from BotFather |
| Bridge replies but agent errors | Check the API terminal for the actual error; verify `.env` model settings |
| Replies stop after a while | Telegram rate limits; the bridge throttles, just wait a beat |

## Security notes

- **Never commit the bot token.** Keep it in `.env` (gitignored)
- The bridge filters by `TELEGRAM_CHAT_ID` — do not leave it empty
- Your messages flow: phone → Telegram servers → your bridge → your local API. The agent's replies reverse that path. Nothing goes to any third-party AI service