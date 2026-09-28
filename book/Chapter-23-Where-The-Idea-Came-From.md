# Chapter 23: Where the Idea Came From — and Why You Can Swap Any Model

*Read this after Chapter 22. You know how to use coding agents and skills. This chapter answers two questions people always ask about your setup: "where did this idea come from?" and "do I have to run it the way you run it?"*

Your Agent Dashboard is a personal agent with a browser, its own Linux computer, and a phone in your pocket. That idea didn't start with you or me. It came from **[OpenMuse](https://github.com/CopilotKit/OpenMuse)** — an open-source project by the CopilotKit team. When you explain your dashboard to someone, say that plainly. It's honest, it's generous to the people who earned it, and it makes your system easier to explain.

## What You'll Learn in This Chapter

- Where the agent-with-a-computer idea comes from, and why credit matters in open source
- What OpenMuse gives you out of the box — and what Agent Dashboard adds on top
- Why your dashboard works with **any** model, not just one
- Why this project defaults to **llama.cpp** for raw performance, and when to pick something else
- How to swap model backends in one line of configuration

## The Idea Is OpenMuse's

OpenMuse (MIT licensed, from the CopilotKit team) built the three ideas this whole book leans on:

1. **The agent computer.** A private Docker Linux box the agent can run commands in — nonroot, no network, no host files, no credentials. Your machine stays out of reach; the agent still gets real hands.
2. **Receipts.** Every command the agent runs saves its output and exit code so you can audit exactly what happened. Trust comes from evidence, not vibes.
3. **Durable work.** Tasks keep running when you close the tab, pause for your approval, and pick back up where they left off.

Agent Dashboard wraps OpenMuse and adds the parts it doesn't ship: the Telegram bridge, the Android client setup, the local-first model guides, and this book. The runtime underneath — the API on port 8787, the browser worker, the computer image, the chat UI — is OpenMuse, MIT licensed, free to inspect and change.

> If you build on this project the way this project builds on OpenMuse, do the same thing: say where the idea came from. That's how open source compounds.

## One More Idea Worth Borrowing: Any Model You Want

OpenMuse's architecture made a choice easy that most AI products make hard: **the agent doesn't care which model thinks for it.** The API speaks one language — an OpenAI-compatible endpoint — so any model server that speaks that dialect works, and OpenMuse also talks to Anthropic and Google models natively.

That's a big deal. It means your dashboard is a *shape*, not a subscription. Today's default in this project is llama.cpp because, on the machines this book targets, it gives the best performance for gpt-oss-120b: lower overhead, tighter control over context and offload, and no extra service running alongside it. Tomorrow, if a better open model lands, you change one line.

Here's the whole decision, in one table:

| Backend | Why pick it | Config |
|---|---|---|
| **llama.cpp** (default) | Best raw performance; you control everything | `OPENAI_BASE_URL=http://127.0.0.1:8080/v1` |
| **Ollama** | Easiest setup; model management built in | `OPENAI_BASE_URL=http://127.0.0.1:11434/v1` |
| **LM Studio / vLLM / any OpenAI-compatible server** | Whatever you already run | Point `OPENAI_BASE_URL` at its `/v1` |
| **Anthropic or Google** | Frontier quality, no local hardware | Set `MODEL=anthropic/...` or `MODEL=google/...` + API key |
| **A cloud OpenAI-compatible API** | No GPU at all | Point `OPENAI_BASE_URL` at the provider |

The rule that never changes: keep the `openai/` prefix on the model name when you're using any OpenAI-compatible server, local or remote. That prefix picks the client, not the company. `openai/gpt-oss:120b` pointed at llama.cpp is still your model, on your machine.

## Try It Yourself

**Swap the backend.** If you run Ollama today, start `llama-server` with the same GGUF weights and change one line in `.env`. Restart the API, run the smoke test from `docs/Model-Setup.md`, and send the same chat message to both. Compare speed and answer quality yourself — that's the whole argument for an open architecture.

**Read the source of the thing you run.** Open `OpenMuse/apps/server/src/computer-tools.ts` and read the ten tools your agent actually has. Two minutes of reading beats a week of guessing, and it's the fastest way to learn how the receipts work.

**Say thanks the open-source way.** Star the OpenMuse repo. If you find and fix a bug in your copy, open a pull request — Chapter 22's Freebuff workflow makes this a ten-minute job.

## Personalize

The right model is the one that fits your machine and your work. A laptop with 16 GB of RAM is happy with `gpt-oss:20b` on llama.cpp. A workstation with 64 GB+ runs the 120b. If your tasks are mostly browser research and short summaries, a smaller model may serve you better than a bigger one — measure, don't assume. And if you ever need frontier quality for a one-off job, point `MODEL` at Anthropic or Google for that day and switch back. Your receipts and your files don't care which brain did the thinking.

## Common Pitfalls

- **Assuming Ollama is required.** It isn't. Any OpenAI-compatible `/v1` endpoint works. Ollama is the easy option, not the only one.
- **Forgetting the Responses API caveat.** OpenMuse expects `/v1/responses`. Ollama ≥ 0.13.3 and current llama.cpp builds have it; older builds don't. The smoke test catches this in ten seconds.
- **Dropping the `openai/` prefix** when pointing at a local server. The agent will fail to call tools, and you'll waste an evening on a one-character fix.
- **Starving slow local models.** A 120b model on a CPU-heavy box can take minutes per run. OpenMuse defaults to a 20-minute timeout (`MODEL_TIMEOUT_MS`) — raise it if your hardware needs more, instead of blaming the agent.

## Summary

Your dashboard stands on OpenMuse — the agent computer, the receipts, the durable work, the browser. Credit it, star it, and when you improve your copy, consider a pull request upstream. And because OpenMuse speaks an open protocol, your dashboard runs whatever model you choose. This project defaults to llama.cpp because it's the fastest way to serve gpt-oss locally — but the default is a preference, not a cage. One line of config and the same agent, the same computer, and the same receipts run on something else entirely.

You now hold real enterprise-grade AI power in your hands — and you know exactly whose shoulders it stands on.

---

*In the next chapter we'll look at keeping this stack alive: backups, updates, and what to do when the models underneath it keep getting better.*