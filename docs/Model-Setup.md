# Model Setup — llama.cpp (default) + Ollama + any other backend

Agent Dashboard drives the agent with **gpt-oss**, OpenAI's open-weight model. This guide covers sizing, serving with **llama.cpp (the default — best performance)** or Ollama (easiest), and how to point the agent at *any* OpenAI-compatible server you already run.

> **Model-agnostic by design.** The agent talks to one protocol: an OpenAI-compatible endpoint. Any server that speaks it works — llama.cpp, Ollama, LM Studio, vLLM, a cloud provider — and Anthropic or Google models work natively. This project *defaults* to llama.cpp because it gives the best raw performance for gpt-oss locally: lower overhead and tighter control over context and GPU/CPU offload. llama.cpp needs one tiny helper — the Responses shim in `llamacpp-shim/` — to match the API shape OpenMuse sends; Ollama needs none. The default is a preference, not a cage — see the "Any backend" table below.

## Sizing: which variant fits your machine?

> **Key fact about gpt-oss-120b: it is a Mixture-of-Experts (MoE) model.** Only a fraction
> of its 117B parameters are active per token, which is why it can feel fast and *why a
> small amount of VRAM (as little as ~16 GB for the experts with partial offload) can
> hold the hot part of the model*. **But the full weights are still ~61 GiB on disk and
> must live somewhere** — MoE saves you VRAM, not RAM. Plan for **~64 GB+ of system RAM**
> (you get partial GPU/CPU expert offload) or an ~80 GB-class GPU. If your RAM is
> tight, the same MoE trick makes `gpt-oss:20b` remarkably small (~13 GB).

| Variant | Weights on disk | RAM/VRAM needed | Runs well on |
|---|---|---|---|
| `gpt-oss:120b` | ~61 GiB (native MXFP4) | ~64 GB+ RAM with partial GPU offload, or ~80 GB-class GPU. MoE: only ~5B active params/token, so the *active* set fits in a small amount of VRAM | Workstations with lots of RAM, multi-GPU rigs, big Macs |
| `gpt-oss:20b` | ~13 GB | 16 GB RAM or ~18 GB VRAM (MXFP4 is compact) | Laptops, single-GPU desktops |

Check first:

```bash
nvidia-smi          # GPU VRAM
# and total system RAM (Task Manager on Windows, free -h on Linux, About This Mac)
```

## Storage: this whole project is hungry

Plan for **~80–100 GB free** on the project drive (`E:/ai`) before you start:

| Item | Size |
|---|---|
| `gpt-oss:120b` weights (llama.cpp GGUF) | ~61–65 GB |
| `gpt-oss:20b` weights (fallback) | ~13 GB |
| OpenMuse repo + node_modules (pnpm) | ~3–5 GB |
| Playwright Chromium (browser worker) | ~1–2 GB |
| openmuse-computer Docker image | ~0.5–1 GB |
| Model context cache, `.openmuse` data dir, browser profiles | grows over time |

Ollama stores weights on its own drive (check `OLLAMA_MODELS`); llama.cpp uses Hugging Face's cache (`HF_HOME`); Docker images live on the Docker Desktop disk. All can be relocated if space is tight.

## Option A — llama.cpp (default, best performance)

Start the model server:

```bash
# GGUF: https://huggingface.co/ggml-org/gpt-oss-120b-GGUF (or unsloth/gpt-oss-120b-GGUF)
llama-server -hf ggml-org/gpt-oss-120b-GGUF \
  --jinja --port 8080 --host 127.0.0.1
# OpenAI-compatible API at http://127.0.0.1:8080/v1
```

Guide: `github.com/ggml-org/llama.cpp/discussions/15396`

Then start the **Responses shim** (required — see the caveat below):

```bash
node llamacpp-shim/shim.mjs        # listens on :8391, forwards to :8080
```

Point OpenMuse at the shim, not llama-server directly:

```env
MODEL=openai/gpt-oss:120b
OPENAI_BASE_URL=http://127.0.0.1:8391/v1
OPENAI_API_KEY=local
```

> Start order on every platform: llama-server → shim → OpenMuse API → browser worker → web UI.

### Why the shim is required

OpenMuse does not just speak "chat completions" — it speaks the OpenAI **Responses API** (`/v1/responses`). llama-server has that route, but it and OpenMuse disagree on one field: the **content-part type**. OpenMuse's client (TanStack AI) sends `{"type":"text"}`, while llama.cpp's `--jinja` template expects `{"type":"input_text"}`. Send the OpenMuse shape straight to llama-server and you get `400 Bad Request`:

```bash
# 400 — the type OpenMuse sends, straight at llama-server
curl http://127.0.0.1:8080/v1/responses -H "Content-Type: application/json" \
  -d '{"model":"gpt-oss:120b","input":[{"role":"user","content":[{"type":"text","text":"hi"}]}]}'

# 200 — same request through the shim
curl http://127.0.0.1:8391/v1/responses -H "Content-Type: application/json" \
  -d '{"model":"gpt-oss:120b","input":[{"role":"user","content":[{"type":"text","text":"hi"}]}]}'
```

`llamacpp-shim/shim.mjs` is a ~80-line, dependency-free Node proxy that rewrites the content-part type on the way through. No config beyond the default port. Ollama does not need it.

## Option B — Ollama (easiest)

Ollama ≥ **0.13.3** serves the OpenAI-compatible **Responses API** at `/v1/responses`, which is exactly what OpenMuse expects.

```bash
# install from https://ollama.com, then:
ollama pull gpt-oss:120b
# or: ollama pull gpt-oss:20b
```

Point OpenMuse at it:

```env
MODEL=openai/gpt-oss:120b
OPENAI_BASE_URL=http://127.0.0.1:11434/v1
OPENAI_API_KEY=ollama-local    # Ollama ignores it; the SDK wants something
```

## Option C — any other backend (LM Studio, vLLM, cloud, Anthropic, Google)

The rule: **one endpoint + one model string.**

| Backend | `MODEL=` | `OPENAI_BASE_URL=` | Notes |
|---|---|---|---|
| LM Studio | `openai/<loaded-model>` | its local `/v1` | Enable the server in LM Studio first |
| vLLM | `openai/<served-model>` | `http://host:8000/v1` | Great for multi-GPU serving |
| llama.cpp | `openai/<model>` | `http://127.0.0.1:8391/v1` | Via the bundled shim; see Option A |
| Cloud OpenAI-compatible | `openai/<model>` | provider's URL + API key | Keys stay in server `.env` only |
| Anthropic | `anthropic/claude-sonnet-4.5` | — (not needed) | Set `ANTHROPIC_API_KEY` |
| Google Gemini | `google/gemini-2.5-pro` | — (not needed) | Set `GOOGLE_API_KEY` |

Two rules that never change:

1. **Keep the `openai/` prefix** whenever you use any OpenAI-compatible server, local or remote — the prefix picks the client, not the company.
2. **Run the smoke test** before wiring anything else:

```bash
curl http://127.0.0.1:<port>/v1/responses -H "Content-Type: application/json" \
  -d '{"model":"<model-name>","input":"ping"}'
```

Expected: JSON back with the model's reply. A 404 means that build lacks `/v1/responses` — update it, or use Ollama, or add a chat↔responses proxy. (For llama.cpp the repo already ships one: `llamacpp-shim/`.) A **400** with a message about content parts is the other llama.cpp case — use the shim.

**Always run the curl smoke test against whichever backend you choose before proceeding.**

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `ollama pull` / GGUF download stalls at X GiB | Slow disk/network | Re-run; it resumes |
| OOM / model unloads constantly | Not enough RAM/VRAM | Drop to `gpt-oss:20b`, or reduce context length |
| Very slow first reply | Cold load from disk | Normal — the model loads once, then stays resident |
| 404 on `/v1/responses` | Backend too old | Upgrade llama.cpp, or use Ollama ≥ 0.13.3 |
| `400 Bad Request` from llama-server on chat | Content-part type mismatch (`text` vs `input_text`) | Point OpenMuse at the shim (`:8391`), not llama-server directly (`:8080`) |
| Agent replies but tool calls never run | Wrong `MODEL=` prefix | Keep the `openai/` prefix so the SDK uses the OpenAI-compatible client |
| Agent gives up mid-run on slow hardware | Run timeout too short | Raise `MODEL_TIMEOUT_MS` in `.env` (default 20 min) |

## Verify

```bash
curl http://localhost:8787/api/health   # API up
# then chat from the web UI — replies should stream from your local model
```