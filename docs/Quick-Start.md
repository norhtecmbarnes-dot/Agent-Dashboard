# Quick Start

Get Agent Dashboard running end to end: model → API → web UI → (optional) phone.

## Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node | 24 LTS | `node -v` |
| pnpm | 11.19.0 | `pnpm -v` |
| Ollama | ≥ 0.13.3 | `ollama -v` |
| Docker | any recent | `docker -v` (optional, for the Linux computer) |
| RAM/VRAM | ~64 GB+ for 120b, or use 20b | `nvidia-smi` / system info |
| Free disk | ~80–100 GB for the full stack | see `docs/Model-Setup.md` storage table |

> **Note on gpt-oss-120b:** it's a **Mixture-of-Experts (MoE)** model — only ~5B params
> are active per token, so the *hot* part fits in a small amount of VRAM. The full
> weights are still **~61 GiB** and need **~64 GB+ system RAM** to run. This whole
> project (model + repos + Docker + browser) wants **~80–100 GB of free disk**.

## 1. Clone

```bash
git clone https://github.com/<your-user>/Agent-Dashboard.git
cd Agent-Dashboard
git clone https://github.com/CopilotKit/OpenMuse.git OpenMuse
```

## 2. Model backend

```bash
ollama pull gpt-oss:120b     # ~61 GiB — see docs/Model-Setup.md for sizing
# smaller machines:
# ollama pull gpt-oss:20b
```

Smoke test the Responses API:

```bash
curl http://127.0.0.1:11434/v1/responses -H "Content-Type: application/json" \
  -d '{"model":"gpt-oss:120b","input":"ping"}'
```

You should get JSON back with the model's reply. If not, stop here and read `docs/Model-Setup.md`.

## 3. Agent runtime

```bash
cd OpenMuse
pnpm install --frozen-lockfile
cp .env.example .env
```

Edit `.env`:

```env
AGENT_BACKEND=model
MODEL=openai/gpt-oss:120b
OPENAI_BASE_URL=http://127.0.0.1:11434/v1
OPENAI_API_KEY=ollama-local
CPK_INTELLIGENCE_API_KEY=<from npx copilotkit@latest login>
```

Get the free CopilotKit Intelligence key (required even for local models):

```bash
npx copilotkit@latest login
npx copilotkit@latest project select
```

Run:

```bash
pnpm dev        # API on :8787
pnpm dev:web    # web UI on :8081 (second terminal)
```

Open **http://localhost:8081** and send a chat message — it should stream back from gpt-oss-120b.

## 4. Extras (optional)

- **Linux computer:** `docker build -t openmuse-computer:local apps/computer`, set `COMPUTER_ENABLED=true`, restart the API. See `docs/Linux-Computer.md`.
- **Browser worker:** `pnpm --dir apps/worker exec playwright install chromium`, set `BROWSER_WORKER_URL=http://127.0.0.1:8790` + `WORKER_TOKEN=<random>`, run `pnpm dev:browser`. See the User Guide.
- **Telegram:** see `docs/Telegram.md`.
- **Android:** see `docs/Android-App.md`.

## Verification checklist

- [ ] `curl http://localhost:8787/api/health` → healthy
- [ ] Chat in the web UI streams from gpt-oss-120b
- [ ] `docker ps` shows `openmuse-computer` (if enabled)
- [ ] Telegram message from phone gets a reply (if bridge is running)