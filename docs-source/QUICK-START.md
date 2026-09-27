# AI Dashboard - Quick Start Guide

**Get up and running in 5 minutes.**

---

## Prerequisites

- Node.js 18+
- npm or yarn
- 8GB+ RAM (for local AI models)
- Ollama (for local AI)

## Step 1: Install Ollama

```bash
# macOS/Linux
curl https://ollama.ai/install.sh | sh

# Or download from https://ollama.ai

# Pull recommended model
ollama pull glm-4.7-flash
```

## Step 2: Clone and Install

```bash
git clone https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard.git
cd PersonalAI-Dashboard
npm install
```

## Step 3: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Step 4: Initial Setup

1. On first load, enter your name
2. Choose your preferred AI model
3. Start chatting!

---

## What You Can Do

### 💬 Chat with AI

Just type a message and press Enter. The AI will respond using your selected model.

### ✍️ Writing Assistant

Navigate to `/writing` to use AI writing tools:
- **Expand:** Make text longer (2-3x)
- **Outline:** Create hierarchical outline
- **Continue:** Continue writing
- **Rewrite:** Rewrite in different style
- **Simplify:** Simplify complex text
- **Elaborate:** Add examples and detail
- **Structure:** Organize with headers

### 📄 Documents

Navigate to `/office` to generate Office documents:
- Word (.docx)
- Excel (.xlsx)
- PowerPoint (.pptx)

### 🤖 Telegram Bot

1. Create bot via @BotFather
2. Go to `/telegram`
3. Enter your bot token
4. Enable and start polling
5. Chat with your bot!

### 📋 SAM.gov

Navigate to `/sam` to search government contracting opportunities.

### ⏰ Task Scheduler

Navigate to `/tasks` to schedule automated tasks.

---

## Environment Variables (Optional)

Create `.env` file for optional features:

```env
# AI Models (optional - uses local Ollama by default)
OLLAMA_API_URL=http://localhost:11434/api
GLM_API_KEY=your_glm_api_key
OPENROUTER_API_KEY=your_openrouter_key
DEEPSEEK_API_KEY=your_deepseek_key

# Authentication (required for admin access)
ENABLE_AUTH=true
DEFAULT_ADMIN_PASSWORD=your-secure-password
DEFAULT_USER_PASSWORD=your-user-password

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your_bot_token

# SAM.gov (optional)
SAM_API_KEY=your_sam_api_key
```

---

## Available Models

The system automatically detects models from Ollama:

```bash
# List models
ollama list

# Pull additional models
ollama pull qwen3.5:27b
ollama pull llama4:scout
```

### Recommended Models

| Model | Size | Best For |
|-------|------|----------|
| glm-4.7-flash | 19GB | Fast chat |
| qwen3-coder-next | 52GB | Code specialist |
| qwen3.5:27b | 17GB | General purpose |

---

## Project Structure

```
PersonalAI-Dashboard/
├── src/
│   ├── app/           # Pages and API routes
│   ├── lib/           # Core libraries
│   └── components/    # React components
├── data/              # Runtime data (created automatically)
│   ├── assistant.db   # SQLite database
│   ├── metrics.json   # System metrics
│   └── MEMORY.md      # AI memory
├── docs/              # Documentation
└── package.json
```

---

## Common Tasks

### Generate a Word Document

```bash
curl -X POST http://localhost:3000/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{"title":"Report","type":"word","content":["Para 1","Para 2"]}' \
  -o report.docx
```

### Generate with AI

Navigate to `/office`, click "AI Generate", describe what you want.

### Custom Memory

Edit `data/MEMORY.md` to add context about your projects and preferences. The AI will use this context in all conversations.

### Schedule a Task

```typescript
// Via API
fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create',
    task: {
      name: 'Daily Report',
      taskType: 'custom',
      prompt: 'Generate summary of...',
      schedule: 'daily'
    }
  })
})
```

---

## Troubleshooting

### "Ollama not found"

```bash
# Start Ollama
ollama serve

# Or run in background (Linux/macOS)
ollama serve &
```

### "Model not found"

```bash
# Pull missing model
ollama pull glm-4.7-flash
```

### "Port 3000 in use"

```bash
# Kill process on port
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 npm run dev
```

### "Memory error loading"

This is normal - first run creates memory file.

### "localStorage errors"

Fixed in v2.0.0 - all storage now uses file system.

---

## Next Steps

1. **Read [DOCUMENTATION.md](./docs/DOCUMENTATION.md)** for full system guide
2. **Read [API-REFERENCE.md](./docs/API-REFERENCE.md)** for API details
3. **Set up [Telegram](./docs/TELEGRAM-SETUP.md)** for mobile access
4. **Configure [ONLYOFFICE](./docs/ONLYOFFICE-IMPLEMENTATION.md)** for document editing

---

## Support

- **Issues:** https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard/issues
- **Docs:** [DOCUMENTATION.md](./docs/DOCUMENTATION.md)

---

**You're ready to go! Start chatting with your AI assistant.**