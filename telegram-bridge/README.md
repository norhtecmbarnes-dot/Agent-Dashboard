# Telegram bridge

Messages you send to a Telegram bot reach your OpenMuse agent, and the agent's
reply comes back to your phone. Approvals (email sends, calendar changes) arrive
as inline buttons.

```
Phone (Telegram) ──► telegram-bridge ──► OpenMuse API (:8787) ──► gpt-oss-120b
        ▲                                                              │
        └──────────────────── reply polled back ──────────────────────┘
```

## Files

| File | Purpose |
|---|---|
| `index.js` | Bot wiring: commands, message handling, approval buttons |
| `src/openmuse.js` | OpenMuse HTTP client (session, run + reply, snapshots, approvals) |
| `src/config.js` | Environment loading and validation |
| `src/format.js` | Telegram chunking and task summaries |
| `test/bridge.test.js` | Unit tests for the client and formatters (mock fetch) |
| `reference/TELEGRAM-SETUP.md` | Architecture notes from the original PersonalAI Dashboard |

## Tests

```bash
npm test
```

## How it talks to OpenMuse

OpenMuse does not expose a plain chat endpoint. The bridge reproduces what the
web/native client does:

1. `POST /api/session` → session token.
2. `GET /api/main-thread` → the stable conversation thread id.
3. `POST /api/copilotkit/agent/default/run` with the user message, dispatches a run
   to the CopilotKit runtime (which forwards to the configured model).
4. The reply is read back from the persisted CopilotKit Intelligence thread via
   `GET /api/copilotkit/threads/:id/messages`, polled until the assistant
   message appears.

This is the same path the mobile and web clients use, so it works with any model
OpenMuse is configured for (local Ollama, a hosted provider, or AG-UI).

## Commands

| Command | What it does |
|---|---|
| `/start` | Welcome and connection status |
| `/help` | List commands |
| `/status` | API/model/browser/worker health |
| `/tasks` | Active and finished work summary |
| `/new` | Start a fresh conversation thread |
| `/approvals` | Review pending email/calendar actions |
| any text | Chat with your agent |
