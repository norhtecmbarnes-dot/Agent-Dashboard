# CPU-Only Setup Guide (4GB RAM Minimum)

**PersonalAI Dashboard on minimal hardware - no GPU required**

---

## Minimum Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| RAM | 4 GB | 8 GB |
| CPU | Any modern CPU | 4+ cores |
| Storage | 10 GB | 20 GB |
| GPU | **None required** | Any |

---

## Quick Start (4GB RAM)

### Step 1: Install Ollama

```bash
# Download from https://ollama.com
# Or use command line:

# Linux/macOS
curl -fsSL https://ollama.com/install.sh | sh

# Windows: Download installer from ollama.com
```

### Step 2: Pull the CPU-Optimized Model

```bash
# BEST CHOICE for 4GB RAM - only ~1.5 GB VRAM
ollama pull qwen2.5:1.5b

# ALTERNATIVE - slightly better, needs 6GB RAM
ollama pull qwen2.5:3b

# VERY TINY - for extremely limited systems
ollama pull qwen2.5:0.5b

# DO NOT USE on 4GB: qwen2.5:7b or larger
# These need 8GB+ RAM
```

### Step 3: Set Up the Dashboard

```bash
# Clone the repo
git clone https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard.git
cd PersonalAI-Dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Step 4: Configure for CPU-Only

Edit `.env.local`:

```bash
# Ollama local CPU model
OLLAMA_API_URL=http://localhost:11434/api

# FREE cloud models - HIGHLY recommended for 4GB!
# Get your FREE key at: https://ollama.com/settings/keys
OLLAMA_API_KEY=your-free-api-key-here

# Database
DATABASE_PATH=./data/assistant.db
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 5: Start

```bash
npm run dev
```

Open **http://localhost:3000**

---

## Model Selection for 4GB RAM Systems

### Local Models (Run on Your CPU)

| Model | Disk Size | RAM Used | Speed | Quality | Works on 4GB? |
|-------|-----------|----------|-------|---------|---------------|
| `qwen2.5:0.5b` | 0.5 GB | ~1 GB | ⚡ Lightning | Basic | ✅ Yes |
| `qwen2.5:1.5b` | 1.5 GB | ~2.5 GB | ⚡ Very Fast | Good | ✅ **Recommended** |
| `qwen2.5:3b` | 3 GB | ~4.5 GB | ✓ Fast | Better | ⚠️ Needs 6GB |
| `gemma3:1b` | 1 GB | ~2 GB | ⚡ Very Fast | Good | ✅ Yes |
| `phi3:mini` | 2.2 GB | ~3 GB | ✓ Fast | Good | ⚠️ Tight fit |

### Cloud Models (FREE - No GPU/RAM Needed!)

**Get FREE API key at: https://ollama.com/settings/keys**

| Model | Parameters | Best For | Cost |
|-------|------------|----------|------|
| `kimi-k2.5` | 1.1T | **Writing** (Claude-quality) | FREE |
| `glm-5` | 756B | Complex reasoning | FREE |
| `deepseek-v3.2` | 671B | Code generation | FREE |
| `qwen3.5:397b` | 397B | General purpose | FREE |

---

## Why Cloud + Local Hybrid is Best for 4GB

```
┌─────────────────────────────────────────────────────────┐
│           RECOMMENDED HYBRID SETUP                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  LOCAL (qwen2.5:1.5b) - For Quick Tasks                 │
│  ✓ Fast on CPU                                         │
│  ✓ Works offline                                       │
│  ✓ Good for simple chat                                │
│  ✗ Limited reasoning                                   │
│                                                         │
│  CLOUD (kimi-k2.5, glm-5) - For Complex Tasks           │
│  ✓ Better than GPT-4 for some tasks                    │
│  ✓ Instant response                                    │
│  ✓ No RAM usage on your computer                       │
│  ✓ FREE forever                                        │
│  ✗ Requires internet                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Complete .env.local for 4GB RAM

```bash
# ========================================
# PERSONAL AI DASHBOARD - 4GB RAM CONFIG
# ========================================

# Local Ollama (CPU-only)
OLLAMA_API_URL=http://localhost:11434/api

# FREE Cloud Models - GET THIS!
# Sign up at: https://ollama.com/settings/keys
OLLAMA_API_KEY=your-free-key-here

# Database
DATABASE_PATH=./data/assistant.db

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Note: Other API keys are optional
# OPENROUTER_API_KEY=
# DEEPSEEK_API_KEY=
```

---

## Step-by-Step: Install and Test

### 1. Install Node.js

Download from https://nodejs.org (LTS version)

```bash
# Verify installation
node --version   # Should show v18+ or v20+
npm --version    # Should show 9+
```

### 2. Install Ollama

```bash
# Windows: Download from https://ollama.com
# Mac/Linux:
curl -fsSL https://ollama.com/install.sh | sh

# Verify
ollama --version
```

### 3. Pull a Small Model

```bash
# For 4GB RAM - BEST CHOICE
ollama pull qwen2.5:1.5b

# Test it works
ollama run qwen2.5:1.5b "Hello!"
```

### 4. Get Free Cloud API Key

1. Go to https://ollama.com
2. Sign up (free, no credit card)
3. Go to Settings → API Keys
4. Create a key
5. Copy the key

### 5. Set Up Dashboard

```bash
# Clone
git clone https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard.git
cd PersonalAI-Dashboard

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local and add your OLLAMA_API_KEY

# Run
npm run dev
```

### 6. Configure in Dashboard

1. Open http://localhost:3000
2. Complete setup wizard
3. Go to **Settings** or click the model dropdown
4. Select:
   - **Default model:** `qwen2.5:1.5b` (local)
   - **Or use cloud:** `kimi-k2.5` (better quality!)

---

## Performance Expectations

### Speed on 4GB RAM CPU

| Model | Tokens/sec | Response Time |
|-------|------------|---------------|
| `qwen2.5:0.5b` | 30-50 | Fast |
| `qwen2.5:1.5b` | 15-30 | Good |
| Cloud models | 100+ | Instant |

### Memory Usage Breakdown

| Component | RAM Used |
|-----------|----------|
| Node.js/Next.js | ~500 MB |
| Chrome/Browser | ~300 MB |
| qwen2.5:1.5b | ~2 GB |
| System reserve | ~500 MB |
| **Total** | ~3.3 GB |
| **Free** | ~700 MB |

---

## Task → Model Guide

| Your Task | Use This Model | Why |
|-----------|----------------|-----|
| "What's 2+2?" | `qwen2.5:1.5b` (local) | Simple, fast |
| "Hello" | `qwen2.5:1.5b` (local) | Quick chat |
| "Summarize this" | `qwen2.5:1.5b` (local) | OK for short texts |
| "Write an essay" | `kimi-k2.5` (cloud) | Better writing |
| "Explain quantum physics" | `glm-5` (cloud) | Complex reasoning |
| "Debug this code" | `deepseek-v3.2` (cloud) | Code expert |
| Document analysis | `kimi-k2.5` (cloud) | Large context |
| Offline usage | `qwen2.5:1.5b` (local) | Only option |

---

## Troubleshooting

### "Out of memory" or System Freezes

```bash
# Use the smallest model
ollama pull qwen2.5:0.5b
ollama run qwen2.5:0.5b

# Or stop other apps while using dashboard
```

### Slow Responses

```
Solutions:
1. Use cloud models (free and instant)
   - Add OLLAMA_API_KEY to .env.local
   - Select kimi-k2.5 or glm-5

2. Close browser tabs and other apps
   - This frees RAM for the model

3. Use a smaller model
   - qwen2.5:0.5b is fastest
```

### Model Not Found

```bash
# Make sure Ollama is running
ollama serve

# Check installed models
ollama list

# Pull the model again
ollama pull qwen2.5:1.5b
```

### Cloud Models Not Working

```bash
# Check your .env.local has the key
cat .env.local | grep OLLAMA_API_KEY

# Should show:
# OLLAMA_API_KEY=ollama_xxxxx

# Verify the key is valid at:
# https://ollama.com/settings/keys
```

---

## Recommended Workflow

### Daily Use Pattern

```
Morning:
1. Start dashboard: npm run dev
2. Open http://localhost:3000
3. Select model: kimi-k2.5 (cloud) for best quality

Quick Tasks:
- Use qwen2.5:1.5b (local) for simple questions

Complex Tasks:
- Use cloud models (kimi-k2.5, glm-5, deepseek)

Before Sleep:
- Leave overnight tasks to task scheduler
- Dashboard runs scheduled reports
```

---

## FAQ

### Q: Can I run completely offline?

A: Yes! Use `qwen2.5:1.5b` locally. You just won't have access to cloud models.

### Q: Do I need a GPU?

A: No! The whole point of this guide is CPU-only operation.

### Q: Why use cloud models?

A: They're FREE and much more capable than small local models. `kimi-k2.5` gives you Claude-quality responses at no cost.

### Q: What if I have 8GB RAM?

A: You can use `qwen2.5:3b` or even `qwen2.5:7b` for better local quality.

### Q: Which model is fastest?

A: `qwen2.5:0.5b` is lightning fast but basic. Cloud models respond instantly.

---

## Support

- **GitHub:** https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard
- **Issues:** https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard/issues
- **Book:** See `book/` folder for complete documentation

---

## Quick Reference

```bash
# Install dependencies
npm install

# Create config
cp .env.example .env.local

# Pull model (4GB RAM)
ollama pull qwen2.5:1.5b

# Start
npm run dev

# Open
http://localhost:3000

# Get free cloud key
https://ollama.com/settings/keys
```

---

**The key insight: With free cloud models from Ollama, you can run a professional AI dashboard on ANY 4GB computer!**