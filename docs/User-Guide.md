# User Guide — the Agent Dashboard UI

Agent Dashboard's web UI (OpenMuse) is a single workspace with panels for chat, files, a terminal, and a browser. This guide walks through each and shows how they work together.

Open the UI at **http://localhost:8081** (API on :8787).

## Chat

The main panel. Every message goes to the agent loop, which is driven by your model (gpt-oss-120b via Ollama).

- Replies **stream** token by token
- The agent can use **tools** during a reply — browsing the web, running a terminal command on its computer — and shows what it's doing as it goes
- When the agent wants permission for something sensitive, an **approval** appears in the UI: accept or reject before it proceeds

What to try first:

- *"Check out Hacker News for cool stuff"* — exercises the browser worker
- *"Create a file with a Python hello-world and run it"* — exercises the computer

## Files

The agent's workspace files, straight from its `/workspace` volume on the Docker computer. Files the agent writes in the terminal appear here, and files here are visible to the agent. Think of it as the shared desk between you and the agent.

## Terminal (Computer)

One-click start for the agent's **Linux computer** (see `docs/Linux-Computer.md`). When running:

- A real terminal in the browser, running in an isolated container
- Commands are capped at 30 seconds and produce **receipts** (output + exit code you can audit)
- No networking inside — internet tasks go through the browser instead

## Browser

Backed by the **browser worker** — a persistent Playwright Chromium the agent drives.

- Good for: research ("summarize copilotkit.ai"), checking sites, gathering info the model can't know
- The agent can navigate, read, and extract; results come back into the chat
- Requires `BROWSER_WORKER_URL` + `WORKER_TOKEN` in `.env` and `pnpm dev:browser` running

## Approvals

Whenever the agent needs to do something with side effects (run a command, take a browser action), it asks first. Approve or reject from:

- The **web UI**
- **Telegram** — as inline buttons on your phone (`docs/Telegram.md`)
- The **Android app** (`docs/Android-App.md`)

## A typical session

1. Ask the agent to research something → it uses the browser, reports back
2. Ask it to turn the research into a script → it writes the file (Files panel updates)
3. Ask it to run the script → approval → it runs it on its computer → receipt shows the output
4. You're on your couch → the same flow from Telegram

## Keyboard and workflow tips

- Chat is the single entry point — describe outcomes, not steps; the agent plans
- Check **receipts** after terminal sessions to audit what ran
- Files persist across restarts (named volume); the computer itself is disposable

## When something misbehaves

| Symptom | Where to look |
|---|---|
| Chat doesn't stream | API health `http://localhost:8787/api/health`; `.env` model settings; `docs/Model-Setup.md` |
| Browser tool errors | Browser worker running (`pnpm dev:browser`)? `WORKER_TOKEN` matching in both `.env`? |
| Terminal won't start | Docker Desktop running? `COMPUTER_ENABLED=true`? `docs/Linux-Computer.md` |
| Phone not connecting | `docs/Telegram.md` / `docs/Android-App.md` troubleshooting tables |