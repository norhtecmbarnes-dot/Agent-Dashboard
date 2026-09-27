# Building Your Own AI: From Chatbots to a Private Proposal Studio

*A complete presentation for non-technical audiences — why cloud AI can't keep your data private, how local AI works, and what it means for winning government contracts.*

**How to turn this into slides:** paste the whole document into **Gemini** (or **NotebookLM** with your materials added) and ask: *"Turn this into a 20-slide presentation. One idea per slide, short bullets, big title, and speaker notes."* Everything below is written so the tool can do that with no further editing. The **Live Demo** section (Part 2) is for you on stage, not for slides.

---

## PART 1 — THE DECK (paste into NotebookLM / Gemini)

### Slide 1 — Title
**Building Your Own AI: From Chatbots to a Private Proposal Studio**

*How to use AI that keeps your data yours — and how it helps you win government contracts.*

---

### Slide 2 — Agenda
- Three ways to talk to an AI: **API, CLI, MCP**
- Foundation models vs. open source — the big fork in the road
- The tools you can use today: NotebookLM, Gemini, Ollama
- Why your AI needs your documents: **RAG**
- Privacy — the part nobody tells you
- How local AI actually works: GGUF, llama.cpp, MLX
- A live demo: reading a government solicitation on your own machine
- Proposal Genie in action: the SAM.gov browser agent finds and ranks opportunities — no keys, no logins
- The workflow that wins — and the warning that matters most

---

### Slide 3 — First, the vocabulary: API, CLI, MCP
Three ways to talk to an AI — this is the whole map:

- **API** — Application Programming Interface. How one *program* talks to an AI over the internet. You send a request, you get an answer. Used by apps, websites, and chatbots. Needs a key, usually costs money, and your data travels to the provider's servers.
- **CLI** — Command Line Interface. How *you* talk to an AI from a terminal window: `ollama run llama3`. Type, get an answer. If the model is on your machine, no key, no internet, no cost, no data leaving.
- **MCP** — Model Context Protocol. A newer, universal *plug* that lets an AI connect to your own tools — files, folders, databases, browsers. One standard plug, many tools.

**The one-line takeaway:** API = renting someone else's AI. CLI = running your own. MCP = giving an AI safe, controlled access to your stuff.

---

### Slide 4 — Foundation models vs. open source
**Foundation models** are the giants: GPT (OpenAI), Claude (Anthropic), Gemini (Google), Grok (xAI).

- Trained by big companies on enormous amounts of data at costs in the tens of millions of dollars.
- You reach them only through an API. You never own them. Every conversation goes through their servers.

**Open source** models are the same technology with the recipe published: Llama (Meta), Mistral, Qwen, Gemma (Google), GLM, DeepSeek, Phi (Microsoft).

- Anyone can download and run them on their own hardware.
- The gap is closing fast — today's open models rival the giants on many everyday tasks, especially when you give them a good prompt and your own documents.

**The fork in the road:** convenience and power on one side; ownership and privacy on the other. You don't have to pick once — you can have both.

---

### Slide 5 — Your options, at a glance
**Cloud (rent):**
- OpenAI GPT · Anthropic Claude · Google Gemini · xAI Grok
- Best raw capability, zero setup, always up to date. Cost: subscription or per-use fees — and your data leaves your machine.

**Open source (own):**
- Llama · Mistral · Qwen · Gemma · GLM · DeepSeek · Phi
- Free to download, run anywhere, license terms vary, private by construction.

**Where open source runs:**
- **Ollama** — the friendly launcher (one command installs a model)
- **llama.cpp** — the engine that makes it run on ordinary computers
- **MLX** — Apple's engine for Macs
- **LM Studio** — a point-and-click version for Windows/Mac

---

### Slide 6 — Meet the tools you can use today (no code needed)
**NotebookLM (Google)** — upload your documents, then chat with them. It searches your files and answers with citations. A full RAG system in a box, free. Try it with your own proposals — you'll feel the difference immediately.

**Gemini (Google)** — a general assistant with a free tier. Great for drafting, summarizing, and — with the right prompt — turning a document like this one into slides.

**Ollama** — the on-ramp to local AI. One command downloads a model to your machine; one command runs it; it even gives you a local API. No account, no credit card, no cloud.

**The honest note:** NotebookLM and Gemini are wonderful — but your documents live in Google's cloud. Same story as every cloud AI. That's exactly why this talk ends with running your own.

---

### Slide 7 — RAG: why your AI needs your documents
An LLM knows only what it was trained on — and its training has a cutoff date. It has never seen:

- Your company, your capabilities, your past performance
- The solicitation you're bidding on
- Your customer, their mission, their hot buttons

**RAG — Retrieval-Augmented Generation** — fixes this. When you ask a question, the system first **searches your own documents** (retrieve), then **writes the answer grounded in them** (generate), with citations.

**Why it matters for proposals:** the AI answers from *your* evidence — the RFP, your capability data, your past proposals — instead of inventing generic content. Compliance becomes checkable. That is the difference between an AI that helps you and an AI that hallucinates.

---

### Slide 8 — What about training a model?
Three stages:

- **Pre-training** — the giant stage. Billions of words, months of compute, tens of millions of dollars. Only the big labs do this.
- **Fine-tuning** — teaching a model your style or your domain with your own examples. Cheaper, but still needs real hardware and real skill.
- **The honest truth:** for a small business, you almost never need to train. **Prompt + RAG gets you 90% of the value** — your master prompt gives the AI its personality and rules; your documents give it the knowledge. Training is for organizations with unique data at scale, not for bidding on contracts.

---

### Slide 9 — Meet Ollama and llama.cpp
**llama.cpp** is the quiet revolution: a piece of software that runs LLMs on *ordinary computers* — laptops, desktops, CPUs and GPUs — no datacenter required. It's why local AI is possible at all.

**Ollama** wraps llama.cpp in a friendly command line — "Homebrew for AI models":

```
ollama pull llama3.2:3b     # download a model (a few GB)
ollama run llama3.2         # chat with it, right now, offline
```

It manages your models, runs them, and exposes a local API at `localhost:11434` that your own applications can use. No account. No subscription. No upload.

---

### Slide 10 — Privacy: the part nobody tells you
Every time you use a cloud AI, **your conversation goes to their servers**. Their terms typically say they may use your data to improve their models. Translate that into the real world:

- Your proprietary proposal
- Your pricing
- Your customer intelligence
- Your competitive insight

…can end up in a future training set. Even when a company promises "we don't train on your data," that is a *promise* — and terms of service change with a click.

**The only way to be certain your data stays yours is to run the model yourself, on your own hardware.** Local-first is not a preference; it is the only guarantee.

**The catch is hardware.** A useful model needs roughly 8–16 GB of memory — a modern laptop with 16–32 GB runs a 7–13 billion parameter model at usable speed. You don't need a datacenter. You need a real computer.

---

### Slide 11 — The two names that make local AI practical: GGUF and MLX
- **GGUF** is the file format for open models — think of it as the "MP3 of AI." It packages a model so it's portable and **quantized** (compressed), so it fits and runs on your hardware. llama.cpp and Ollama use GGUF.
- **MLX** is Apple's engine for Macs. Apple Silicon's unified memory means a Mac can run surprisingly large models — bigger than its RAM spec suggests.

**The takeaway:** GGUF (the format) + llama.cpp / MLX (the engines) are why "run your own AI" went from a fantasy to a weekend project.

---

### Slide 12 — Why this matters: an LLM is only as smart as what you give it
A model without your context is a brilliant stranger — smart, but ignorant of you.

- It doesn't know your company, your win themes, or your customer.
- Its default answer to any question is generic.

**The fix is RAG, again:** build a private knowledge base — your proposals, your capability statements, your customer notes — and let the AI search it before it answers. Now the stranger becomes a specialist who has read your entire company file.

This is the exact architecture behind the demo coming up.

---

### Slide 13 — My book: *Building Your AI Dashboard*
Everything in this talk is the condensed version of a full book:

> **Building Your AI Dashboard** — a complete, beginner-friendly walkthrough of building your own private AI system, chapter by chapter.

Topics include: choosing and running open models, prompting techniques, RAG and document workflows, privacy, and building your own proposal studio. Written for non-technical readers — no programming background required.

---

### Slide 14 — Live demo: Ollama reads a government document
*(You, on stage — see Part 2 below for the exact commands.)*

- A solicitation or RFP is just a document. Watch an open model — running locally, offline — read it.
- The model summarizes the requirement, pulls out the compliance rules, and answers questions about it — all on the laptop in front of you, no internet connection, no data leaving the room.
- This is the same technology the giants sell — running on hardware you own.

---

### Slide 15 — Proposal Genie in action: the SAM.gov browser agent

- The daily scan opens a **real browser session on your machine** and searches SAM.gov — the government's official contracting board — using the same search the website itself performs for any visitor.
- **No API key. No login.** SAM.gov rotates its keys every 90 days, which breaks key-based systems three or four times a year — the browser agent doesn't care. A key is optional, a speed upgrade only.
- The AI then **reads every match against your company's profile** and ranks them high to low: a score (0–100), a one-line plain-English summary, a pursue / watch / skip call, and a link straight to the notice.
- It **learns over time**: mark what's worth pursuing and what isn't, and the next ranking scores smarter.
- **The takeaway:** the machine watches the board every day, so the human only looks at what matters.

---

### Slide 16 — The Proposal Genie master prompt
A generic model becomes a specialist because of its **master prompt** — a carefully written set of instructions that define who the AI is and how it must behave. This is the actual prompt behind Proposal Genie:

> *"You are Proposal Genie — a senior capture manager, proposal writer, and government contracting strategist with 20+ years of winning federal, state, and local contracts. You work for one company and your job is to help them win."*

Its rules include:
- **LOCAL-FIRST and PRIVATE** — the user's documents and knowledge never leave their machine
- **RESEARCH BEFORE YOU WRITE** — never produce content from memory alone
- **GROUND EVERY CLAIM IN EVIDENCE** — no inflated claims; flag gaps instead
- **COMPLIANCE IS NON-NEGOTIABLE** — every "shall" tracked; format, page limits, required forms
- **LEARN FROM EVERY OUTCOME** — wins and losses become lessons for the next bid

**The point:** the prompt is the personality. Your prompt is what makes a general tool behave like a specialist on your team.

---

### Slide 17 — Feeding the company brain
The AI is only as good as what you give it. Company information comes from:

- Your **website**
- **Previous proposals** — especially the ones that won
- **Brochures and capability statements**
- **Presentations** you've given
- Past performance records, debriefs, and customer notes

The most valuable layer is the **"invisible proposal"** — what you know about the customer that is *not* in the solicitation: their mission, their priorities, their hot buttons, how they buy. That knowledge is the difference between a compliant proposal and a winning one — and it belongs to you, not to a cloud.

---

### Slide 18 — The winning workflow: prompt + company + solicitation
Set up three things, and the AI becomes your capture team:

1. **The master prompt** — who the AI is and how it behaves (the soul)
2. **The company knowledge base** — capabilities, past performance, customer intel (the brain)
3. **The solicitation** — the RFP itself (the job)

Feed it a solicitation and the AI can assist with:
- **Organizing the response** — structure that mirrors the evaluation criteria
- **Building a compliance matrix** — every "shall" and "must" tracked: addressed, partial, missing
- **Deliverables checklist** — every form, attachment, and deadline, nothing forgotten
- **Assigning tasks** — who does what, in what order
- **Red-teaming** — playing the evaluator: challenging your win themes, poking holes in your approach before the government does

---

### Slide 19 — The most important slide: never let the AI write the whole response
The AI is your **partner, not your replacement**.

**The AI handles what machines are good at:** structure, compliance, consistency, completeness, formatting, speed.

**The human brings what only you have:** accuracy, customer knowledge, win themes, judgment, and the accountability for what you submit.

- Every claim the AI writes must be verified — it must be true, and it must be yours.
- Every word must serve your win themes — the reasons *you*, specifically, should win this work.
- An AI-written proposal is a generic proposal, and evaluators can tell.

**It is not about getting a proposal done. It is about winning.**

---

### Slide 20 — Closing
- Cloud AI is powerful — and your data goes with it.
- Open source + local AI is the only way to be certain your data stays yours.
- The hardware question is solved: a laptop is enough.
- Your documents are the difference: **RAG turns a stranger into a specialist.**
- A master prompt + your company knowledge + the solicitation = a capture team on your desk.
- And the rule that wins contracts: **the human writes the truth; the AI enforces compliance, completeness, and quality.**

*Thank you — questions?*

---

## PART 2 — DEMO SCRIPT (your "Ollama reads a document" live demo)

**Setup (do this before the talk, on the demo machine):**

```bash
# 1. Install Ollama from https://ollama.com (Windows / Mac / Linux)
# 2. Pull a model that runs on your laptop (3B = fast, 8B = smarter):
ollama pull llama3.2:3b
# (or llama3.1:8b if the machine has 16GB+ RAM)

# 3. Put a real document on the desktop — e.g. an RFP or solicitation
#    converted to text: a .txt export works best.
```

**On stage (3–4 minutes):**

1. **Show it's local and offline:** turn off Wi-Fi. "Watch what happens — no internet, no cloud."
2. **Chat with it live:** `ollama run llama3.2:3b` then ask:
   - *"What is this document?"*
   - *"Summarize the requirement in two sentences."*
   - *"List every compliance rule — every 'shall' and 'must'."*
3. **Read from a file** (paste the document text into the prompt):
   ```bash
   ollama run llama3.2:3b "Summarize this solicitation and list the deadlines" < rfp.txt
   ```
4. **Bridge to the app:** "This is the same engine inside Proposal Genie — but there, the prompt is a senior capture manager, the knowledge base is your company, and it does compliance matrices, deliverables checklists, and red-teaming instead of just chat."

**Fallback if the network blocks model download mid-talk:** pull the model *before* the audience arrives, and if the demo machine is weak, use the smallest model (`llama3.2:1b`) — slower and simpler answers, but the offline point still lands.

---

## PART 3 — WHERE EVERYTHING LIVES IN THE PROJECT

| Topic | Where to find it |
|---|---|
| The book | `book/Building_Your_AI_Dashboard.pdf` (also in `docs/`) |
| The master prompt (soul) | `soul.md` — *"You are Proposal Genie — a senior capture manager…"* |
| The Proposal Genie workflow | `docs/PROPOSAL-STUDIO-BOOK.md`, `docs/WIN-WITH-THEIR-WORDS.md` |
| Government contracting 101 | `docs/GOVERNMENT-CONTRACTING-101.md` |
| The app itself | run `npm run dev` in `PersonalAI-Dashboard/` — SAM.gov matches, bid workflow, capability assessment, proposal studio |

---

*Companion to the "Building Your AI Dashboard" book. Written for the non-technical reader — every term above is explained in plain English within its slide.*
