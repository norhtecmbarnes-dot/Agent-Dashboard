# Building Your Local AI Dashboard: A Complete Guide

**Your Personal AI Assistant — 100% Local, Private, and Token-Efficient**

---

## About This Book

This guide teaches you how to build, configure, and use your own local AI research assistant. Combined with the [PersonalAI Dashboard codebase](https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard), this book provides everything you need to create a powerful, private AI system.

**This is a reference configuration** — the combination of this book and the code allows anyone to build their own local AI solution tailored to their needs.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Quick Start](#2-quick-start)
3. [The Home Dashboard](#3-the-home-dashboard)
4. [Writing Studio](#4-writing-studio)
5. [Visual Builder](#5-visual-builder)
6. [Visual Outliner](#6-visual-outliner)
7. [Brand Workspace](#7-brand-workspace)
8. [LLM Leaderboard](#8-llm-leaderboard)
9. [Task Scheduler](#9-task-scheduler)
10. [Calendar & Briefings](#10-calendar--briefings)
11. [Notes System](#11-notes-system)
12. [Telegram Integration](#12-telegram-integration)
13. [The Model Message Bus](#13-the-model-message-bus)
14. [Configuration & Customization](#14-configuration--customization)
15. [Security & Privacy](#15-security--privacy)

---

## 1. Introduction

### Why Build Your Own AI?

Cloud AI services are expensive and send your data to third parties. This project gives you:

- **Privacy First** — Your data never leaves your machine
- **No Subscriptions** — Use free local models forever
- **Full Control** — Customize everything for your workflow
- **Transparency** — See exactly how your AI works

### What You'll Build

A complete AI research assistant with:

- Chat interface with multiple AI models
- Writing studio with grammar checking
- Visual UI builder
- Document generation (Word, PowerPoint, Excel, PDF)
- Task automation and scheduling
- Brand voice knowledge bases
- Telegram remote control
- And much more...

### System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| RAM | 8 GB | 16 GB+ |
| Storage | 10 GB | 20 GB+ |
| Node.js | v18+ | v20+ |
| For Local AI | Any computer | 16GB+ RAM for larger models |

**Free Cloud Option:** Sign up at [Ollama](https://ollama.com) for free cloud models — no GPU required!

---

## 2. Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard.git
cd PersonalAI-Dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

### First Launch

1. Open http://localhost:3000 in your browser
2. The dashboard will prompt you to configure your first AI model
3. Choose from local (Ollama) or cloud models
4. Start chatting with your AI assistant

### Docker Alternative

```bash
# One-command startup
docker compose up
```

---

## 3. The Home Dashboard

![AI Research Assistant](../screenshots/Home%20--%20Chat%20Windows.png)

The Home Dashboard is your command center — a ChatGPT replacement that runs locally.

### Key Features

- **Multiple Model Support** — Switch between local and cloud models instantly
- **Web Search** — Enable search mode for real-time information
- **Brand Voice Integration** — Chat with your knowledge bases
- **Conversation History** — All chats saved and searchable

### How to Use

1. **Select a Model** — Use the dropdown to choose your AI brain:
   - `llama3.2:latest` — Fast, efficient for simple tasks
   - `qwen3.5:9b` — Good balance of speed and quality
   - `glm-4.7-flash:latest` — Excellent for writing
   - `glm-5:cloud` — Complex reasoning (requires key)

2. **Enable Web Search** — Toggle "Search Mode" for real-time information

3. **Choose Brand Context** — Select a knowledge base to give your AI context

4. **Start Chatting** — Type your message and press Enter

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Ctrl + /` | Toggle search mode |

### Model Selection Tips

| Task | Recommended Model | Why |
|------|-------------------|-----|
| Quick questions | `llama3.2:latest` | Fast, low token use |
| Writing/editing | `glm-4.7-flash:latest` | Great English quality |
| Research | `qwen3.5:9b` + Search Mode | Good comprehension |
| Complex reasoning | `glm-5:cloud` | Best reasoning capability |

---

## 4. Writing Studio

![Writing Studio](../screenshots/writing%20Studio.png)

A full-featured writing environment with AI assistance, grammar checking, and document generation.

### Key Features

- **Rich Text Editor** — Full formatting support
- **AI Writing Actions** — Expand, rewrite, simplify, humanize
- **Grammar Checking** — Integrated Linguix (1M free chars/month)
- **Version History** — Auto-saved every 5 minutes
- **Export** — HTML, PDF, and DOCX formats

### AI Writing Tools

| Tool | What It Does |
|------|--------------|
| **Expand** | Turns bullet points into full paragraphs |
| **Outline** | Creates document structure from content |
| **Rewrite** | Polishes and improves text |
| **Simplify** | Makes complex text easier to understand |
| **Humanize** | Makes AI text sound more natural |
| **Grammar** | Checks and fixes grammar |
| **Linguix** | Professional grammar/spell check (1M free chars/month) |

### How to Use

1. **Start Writing** — Type or paste your content
2. **Select Text** — Highlight the text you want to improve
3. **Click an Action** — Choose from the toolbar
4. **Review Changes** — AI suggestions appear inline
5. **Accept/Reject** — Click to accept or reject each change

### Grammar Checking with Linguix

1. Go to **Settings → API Keys**
2. Find **Linguix** (under Writing)
3. Get your free key at [linguix.com/api](https://linguix.com/api/)
4. Enter and save your key
5. Select text and click **📝 Linguix** in Writing Studio

### Tips

- Use **Expand** on outlines to quickly draft documents
- Use **Humanize** to make AI text pass detection
- Save versions frequently with the 🕐 button
- Use the chapter navigation for long documents

---

## 5. Visual Builder

![Visual Builder](../screenshots/Visual%20Builder.png)

Create user interfaces and database forms with natural language — no coding required.

### Key Features

- **Natural Language Generation** — Describe what you want, AI builds it
- **Component Library** — Pre-built UI elements
- **Database Integration** — Forms automatically connect to your data
- **Live Preview** — See changes instantly

### How to Use

1. **Describe Your UI** — Type what you want to build:
   ```
   "Create a customer list with search, filter, 
   and export buttons. Show name, email, and status."
   ```

2. **AI Generates Code** — The builder creates the component
3. **Preview** — See your UI instantly
4. **Customize** — Adjust colors, sizes, and behavior
5. **Deploy** — One-click to production

### Example Prompts

| What You Say | What It Creates |
|--------------|-----------------|
| "User login form" | Email + password + submit button |
| "Product catalog grid" | Searchable product cards |
| "Dashboard with charts" | Analytics overview page |
| "Settings panel" | Form with save/cancel |

### Tips

- Be specific about layout and features
- Use the component library for common elements
- Test database forms with sample data
- Export as React components for customization

---

## 6. Visual Outliner

![Outliner](../screenshots/outliner.png)

Organize complex documents with a visual outline editor — perfect for books, research papers, and long-form content.

### Key Features

- **Drag & Drop** — Re arrange sections easily
- **Expand/Collapse** — Focus on one section at a time
- **AI Expansion** — Turn outline into full content
- **Export** — Markdown, Word, or HTML

### How to Use

1. **Create Your Outline** — Add sections and subsections
2. **Expand a Section** — Click "Expand" to have AI write content
3. **Edit** — Refine the generated text
4. **Reorder** — Drag sections to reorganize
5. **Send to Writing Studio** — Continue editing with full tools

### Workflow Example

1. Start with: "Chapter 1: Introduction"
2. Add: "1.1 Background", "1.2 Problem Statement", "1.3 Goals"
3. Click "Expand" on each section
4. AI generates content based on your outline
5. Edit and refine in Writing Studio

### Tips

- Keep outline items brief (2-5 words)
- Use the hierarchy (chapters → sections → subsections)
- Expand one section at a time for best results
- Review AI content before moving to Writing Studio

---

## 7. Brand Workspace

![Brand Workspace](../screenshots/Brand%20Workspace.png)

NotebookLM-style knowledge management for your AI — create brand voices, knowledge bases, and context libraries.

### Key Features

- **Multiple Brands** — Create different voices for different projects
- **Document Import** — Web URLs, PDFs, text files
- **AI Chat** — Converse with your knowledge base
- **Context Injection** — Brands enhance your AI chats

### How to Use

1. **Create a Brand** — Click "New Brand"
2. **Add Sources** — Import documents or URLs:
   - Website URLs (crawls automatically)
   - PDF documents
   - Text files
   - Manual text input

3. **Chat with Brand** — The Brand Workspace chat uses your sources as context

4. **Use in Main Chat** — Select your brand from the dropdown in Home

### Use Cases

| Brand | Purpose |
|-------|---------|
| Company Voice | Product descriptions, marketing |
| Technical Docs | API reference, code help |
| Research Papers | Literature review assistance |
| Personal Knowledge | Your notes and experiences |

### Tips

- Keep brands focused (one topic per brand)
- Import fresh content regularly
- Use URLs for always-current information
- Combine multiple sources for rich context

---

## 8. LLM Leaderboard

![LLM Leaderboard](../screenshots/llm%20leaderboard.png)

Compare AI models and find free token sources — optimize your AI spending.

### Key Features

- **Model Comparisons** — See strengths and weaknesses
- **Free Token Sources** — Find free alternatives to paid APIs
- **Cost Calculator** — Estimate your usage costs
- **Local vs Cloud** — Side-by-side comparison

### How to Use

1. **Browse Models** — See all available models
2. **Compare Features** — Check quality, speed, cost
3. **Get Free Tokens** — Links to free API sources:
   - Google Gemini (free tier)
   - Groq (free tier)
   - Ollama Cloud (free tier)

4. **Set Your Preferences** — Configure which model for which task

### Model Recommendations

| Budget | Strategy |
|--------|----------|
| $0/month | Use local models + free cloud tiers |
| $5/month | Paid cloud for complex tasks only |
| $20/month | Premium models for all tasks |

---

## 9. Task Scheduler

![Task Scheduler](../screenshots/Task%20Scehduler.png)

Automate tasks with cron-based scheduling — AI-powered automation that runs while you sleep.

### Key Features

- **Cron Scheduling** — Flexible time-based triggers
- **AI Task Types** — Research, reports, summarization
- **Telegram Notifications** — Get alerts when tasks complete
- **History & Logs** — Track all executions

### How to Use

1. **Create a Task** — Click "New Task"
2. **Choose Task Type**:
   - `intelligence_report` — Generate research report
   - `security_scan` — Check for vulnerabilities
   - `daily_briefing` — Morning summary
   - `telegram_briefing` — Send to Telegram

3. **Set Schedule** — Use cron format:
   - `0 9 * * *` — Every day at 9 AM
   - `0 9 * * 1` — Every Monday at 9 AM
   - `*/30 * * * *` — Every 30 minutes

4. **Configure Parameters** — Set topics, sources, recipients

5. **Enable** — Toggle the task on

### Example Tasks

| Task | Schedule | Purpose |
|------|----------|---------|
| Daily Briefing | 9 AM daily | Morning news summary |
| Weekly Research | Monday 9 AM | Industry trend report |
| Security Scan | Daily 2 AM | Vulnerability check |
| Telegram Alert | Hourly | Time-sensitive updates |

### Tips

- Start with simple schedules (`0 9 * * *` for daily)
- Use descriptive task names
- Check logs if tasks fail
- Set up Telegram for mobile alerts

---

## 10. Calendar & Briefings

![Calendar](../screenshots/calandar%20page.png)

Event management with AI-generated insights — your calendar gets smarter.

### Key Features

- **Event Management** — Create, edit, delete events
- **AI Briefings** — Get context for upcoming meetings
- **Daily Summaries** — Morning overview of your day
- **Telegram Integration** — Calendar alerts to your phone

### How to Use

1. **Add Events** — Click day or drag to create
2. **Set Details** — Title, time, description, recurrence
3. **View Briefing** — Click "Generate Briefing" for AI insights
4. **Connect to Telegram** — Get mobile notifications

### AI Briefing Features

When you click "Generate Briefing," AI:

- Summarizes the event topic
- Pulls relevant context from your knowledge bases
- Suggests preparation materials
- Creates an agenda

### Tips

- Add URLs to events for AI context
- Use tags for categorization
- Enable Telegram for mobile alerts
- Check the daily briefing each morning

---

## 11. Notes System

![Notes](../screenshots/notes.png)

Intelligent note-taking with AI-powered search and organization.

### Key Features

- **Rich Text Notes** — Format with markdown
- **Auto-Organization** — AI categorizes and tags
- **Semantic Search** — Find notes by meaning, not keywords
- **Cross-Reference** — Link related notes

### How to Use

1. **Create Note** — Click "New Note"
2. **Write** — Use markdown formatting
3. **Auto-Tag** — AI suggests tags based on content
4. **Search** — Type natural language queries:
   - "Show me notes about project planning"
   - "Find meeting notes from last week"

### Tips

- Use descriptive titles
- Let AI auto-tag new notes
- Link notes with `[[note-name]]` syntax
- Review AI-suggested categories

---

## 12. Telegram Integration

![Telegram Integration](../screenshots/Telegram.png)

Control your AI dashboard remotely via Telegram — chat with your AI from anywhere.

### Key Features

- **Remote Chat** — Send messages from Telegram
- **Task Notifications** — Get alerts on your phone
- **Daily Briefings** — Morning summaries delivered to Telegram
- **Security Alerts** — Instant notifications about issues

### Setup

1. **Create a Telegram Bot**:
   - Open Telegram, search `@BotFather`
   - Send `/newbot` and follow instructions
   - Copy your bot token

2. **Configure in Dashboard**:
   - Go to **Settings → API Keys**
   - Find **Telegram**
   - Enter your bot token

3. **Register Your Chat**:
   - Message your bot on Telegram
   - The dashboard captures your chat ID
   - You're now connected!

4. **Enable Notifications**:
   - Go to **Telegram** page
   - Toggle notification types:
     - Daily Briefings
     - Task Completion
     - Security Alerts
     - Intelligence Reports

### Commands

| Command | What It Does |
|---------|--------------|
| `/start` | Initialize the bot |
| `/status` | Check system status |
| `/search <query>` | Web search |
| `/help` | Show available commands |

### Use Cases

- Morning briefings on your phone
- Get notified when long tasks complete
- Security alerts anywhere
- Check system status remotely

---

## 13. The Model Message Bus

This is the unique architecture that makes your local AI system smart and efficient.

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    MODEL MESSAGE BUS                         │
│  Tier 1: Local Small (llama3.2:latest)   ← Triage & simple  │
│  Tier 2: Local Large (qwen3.5:9b)                            │
│  Tier 3: Cloud Fast (groq/llama-3.1-8b)                      │
│  Tier 4: Cloud Smart (gpt-4o, claude-3.5, glm-5)            │
└─────────────────────────────────────────────────────────────┘
```

### Tier Explanation

| Tier | Model | Use Case | Cost |
|------|-------|----------|------|
| 1 | llama3.2:latest | Quick answers, triage | Free (local) |
| 2 | qwen3.5:9b | Writing, chat | Free (local) |
| 3 | groq/llama-3.1-8b | Fast cloud | Free tier |
| 4 | gpt-4o, claude-3.5 | Complex reasoning | Paid |

### Self-Assessment

Your local model evaluates each request:

1. **Can I handle this?** — Simple questions → Tier 1
2. **Need more brain?** — Complex tasks → escalate to Tier 2/3
3. **Need expert?** — Very complex → escalate to Tier 4

### Benefits

- **Cost Optimization** — Use cheapest model that works
- **Privacy** — Sensitive data stays local
- **Quality** — Escalate when needed for better results
- **Speed** — Fast local models for simple tasks

### Configuration

Edit `src/lib/models/model-router.ts` to customize:

```typescript
const preferredModels = {
  chat: 'llama3.2:latest',      // Fast local
  writing: 'glm-4.7-flash:latest', // Quality writing
  reasoning: 'glm-5:cloud',      // Complex tasks
};
```

---

## 14. Configuration & Customization

### Environment Variables

Create `.env.local`:

```env
# Local Models (Ollama)
OLLAMA_BASE_URL=http://localhost:11434

# Optional: Cloud Keys
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token

# Web Search
BRAVE_SEARCH_API_KEY=your-brave-key
```

### Adding API Keys

1. Go to **Settings → API Keys**
2. Enter your key for each service:
   - Google Gemini (free tier available)
   - OpenAI
   - Anthropic Claude
   - Brave Search
   - Linguix Grammar
   - SAM.gov (government data)

### Custom Prompts

Edit `src/lib/prompts/` to customize AI behavior:

- `system-prompts.ts` — Main AI personality
- `writing-prompts.ts` — Writing assistant behavior
- `research-prompts.ts` — Research agent behavior

### Adding New Models

Edit `src/lib/models/model-router.ts`:

```typescript
export const availableModels = [
  { id: 'llama3.2:latest', name: 'Llama 3.2', tier: 1 },
  { id: 'qwen3.5:9b', name: 'Qwen 3.5 9B', tier: 2 },
  // Add your model here
];
```

---

## 15. Security & Privacy

### Your Data Stays Local

- **All AI Processing** — Runs on your machine when using local models
- **Database** — SQLite stored locally (no cloud database)
- **Vector Store** — Your knowledge base never leaves your machine
- **API Keys** — Stored encrypted locally

### Security Features

- **Input Validation** — All user input sanitized
- **SQL Injection Protection** — Parameterized queries
- **XSS Prevention** — Content sanitized before display
- **Prompt Injection Protection** — AI prompts filtered

### What Gets Sent to Cloud

Only if you configure cloud models:

- **Text of your current message** — Sent to cloud AI
- **Brand context** — If you enable it
- **Never sent** — Your database, files, history

### Best Practices

1. **Use local models for sensitive data**
2. **Keep API keys in `.env.local`**
3. **Review security scan results** — Check the Security page
4. **Add `.env.local` to `.gitignore`** — Never commit secrets

### Self-Reflection Security

The system periodically scans itself for:

- Exposed API keys
- SQL injection vulnerabilities
- XSS risks
- Outdated dependencies

---

## Appendix: Quick Reference

### Keyboard Shortcuts

| Page | Shortcut | Action |
|------|----------|--------|
| Home | `Ctrl + /` | Toggle search mode |
| Home | `Ctrl + S` | Save conversation |
| Writing | `Ctrl + B` | Bold |
| Writing | `Ctrl + I` | Italic |
| Writing | `Ctrl + K` | Insert link |
| Writing | `Ctrl + Z` | Undo |

### Common Tasks

| Task | Where | How |
|------|-------|-----|
| Change AI model | Home → Dropdown | Select model |
| Add API key | Settings → API Keys | Enter key |
| Create brand | Brand Workspace → New | Add documents |
| Schedule task | Tasks → New Task | Set cron |
| Export document | Writing Studio → Export | Choose format |
| Check grammar | Writing Studio → Select text → Linguix | Review changes |

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Server won't start | `npm install` then try again |
| AI not responding | Check model is downloaded: `ollama pull llama3.2` |
| API key not working | Verify key in Settings → API Keys |
| Port 3000 busy | Kill process: `npx kill-port 3000` |
| Database error | Delete `data/assistant.db` and restart |

### Getting Help

- **GitHub Issues**: [Report bugs](https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard/issues)
- **Documentation**: See `/docs` folder
- **Telegram**: Join our community (link in README)

---

## This is a Reference Configuration

The combination of this book and the [PersonalAI Dashboard codebase](https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard) provides everything you need to:

1. **Understand local AI architecture**
2. **Deploy your own AI assistant**
3. **Customize for your specific needs**
4. **Extend with your own features**

Feel free to:
- Fork the repository
- Modify the code
- Add your own features
- Share your improvements

This is **open source software** — build on it, improve it, make it yours.

---

## License

- **Code**: MIT License — use freely for any purpose
- **Book**: CC BY-SA 4.0 — share and adapt with attribution

---

**Made with ❤️ by Michael C. Barnes (@norhtecmbarnes)**

*Building real enterprise-grade AI power — one chapter at a time.*