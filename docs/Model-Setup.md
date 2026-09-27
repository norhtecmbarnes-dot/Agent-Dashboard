# Model Setup — Ollama + llama.cpp with gpt-oss-120b

Agent Dashboard drives the agent with **gpt-oss**, OpenAI's open-weight model. This guide covers sizing, serving with Ollama (recommended) or llama.cpp, and the one smoke test that must pass before anything else works.

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
| `gpt-oss:120b` weights (Ollama) | ~61–65 GB |
| `gpt-oss:20b` weights (fallback) | ~13 GB |
| OpenMuse repo + node_modules (pnpm) | ~3–5 GB |
| Playwright Chromium (browser worker) | ~1–2 GB |
| openmuse-computer Docker image | ~0.5–1 GB |
| Model context cache, `.openmuse` data dir, browser profiles | grows over time |

Ollama stores weights on its own drive (check `OLLAMA_MODELS`); Docker images live on the Docker Desktop disk. Both can be relocated if space is tight.

## Option A — Ollama (recommended)

Ollama ≥ **0.13.3** serves the OpenAI-compatible **Responses API** at `/v1/responses`, which is exactly what OpenMuse expects.

```bash
# install from https://ollama.com, then:
ollama pull gpt-oss:120b
# or: ollama pull gpt-oss:20b
```

### Smoke test (do this before wiring anything else)

```bash
curl http://127.0.0.1:11434/v1/responses -H "Content-Type: application/json" \
  -d '{"model":"gpt-oss:120b","input":"ping"}'
```

Expected: a JSON object containing the model's reply. If you get an error about the model or the route:

- Model not found → the pull didn't finish; check `ollama list`
- 404 on `/v1/responses` → your Ollama is older than 0.13.3; upgrade
- Empty/slow → the model may still be loading from disk; wait and retry

### Point OpenMuse at it

```env
MODEL=openai/gpt-oss:120b
OPENAI_BASE_URL=http://127.0.0.1:11434/v1
OPENAI_API_KEY=ollama-local    # Ollama ignores it; the SDK wants something
```

## Option B — llama.cpp

Guide: `github.com/ggml-org/llama.cpp/discussions/15396`

```bash
# GGUF: https://huggingface.co/ggml-org/gpt-oss-120b-GGUF (or unsloth/gpt-oss-120b-GGUF)
llama-server -hf ggml-org/gpt-oss-120b-GGUF \
  --jinja --port 8080 --host 127.0.0.1
# OpenAI-compatible API at http://127.0.0.1:8080/v1
```

Point OpenMuse at it:

```env
MODEL=openai/gpt-oss:120b
OPENAI_BASE_URL=http://127.0.0.1:8080/v1
OPENAI_API_KEY=local
```

### The `/v1/responses` caveat

OpenMuse expects an OpenAI-compatible **Responses API**, not just chat completions. Ollama supports `/v1/responses` (non-stateful) since 0.13.3. If your `llama-server` build lacks the route:

1. Prefer **Option A** (Ollama), or
2. Update llama.cpp to the latest build, or
3. Put a tiny chat↔responses proxy in front of llama-server

**Always run the curl smoke test against whichever backend you choose before proceeding.**

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `ollama pull` stalls at X GiB | Slow disk/network | Re-run the pull; it resumes |
| OOM / model unloads constantly | Not enough RAM/VRAM | Drop to `gpt-oss:20b`, or reduce context length |
| Very slow first reply | Cold load from disk | Normal — the model loads once, then stays resident |
| 404 on `/v1/responses` | Ollama < 0.13.3 | Upgrade Ollama |
| Agent replies but tool calls never run | Wrong `MODEL=` prefix | Keep the `openai/` prefix so the SDK uses the OpenAI-compatible client |

## Verify

```bash
curl http://localhost:8787/api/health   # API up
# then chat from the web UI — replies should stream from your local model
```