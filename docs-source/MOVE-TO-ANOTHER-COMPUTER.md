# Moving PersonalAI Dashboard to Another Computer

This guide will help you copy the project to a thumb drive and set it up on a new computer.

## What to Copy

### ✅ Copy These (Required)

```
PersonalAI-Dashboard/
├── src/                    # All source code
├── book/                   # Documentation
├── docs/                   # Additional docs
├── public/                 # Static files
├── data/                   # Database and memory (optional - see below)
├── .env.example            # Environment template
├── package.json            # Dependencies list
├── package-lock.json       # Exact versions
├── next.config.js          # Next.js config
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind config
├── postcss.config.js       # PostCSS config
├── README.md               # Project info
├── LICENSE                 # MIT license
└── CHANGELOG.md            # Version history
```

### ❌ DO NOT Copy These

```
node_modules/               # Too large, reinstall on new computer
.next/                      # Build cache, regenerate on new computer
.git/                       # Git history (optional - copy if you want it)
*.log                       # Log files
.env.local                  # Your private API keys (copy .env.example instead)
tsconfig.tsbuildinfo        # Build cache
```

---

## Step 1: Prepare the Project

### Option A: Quick Copy (Recommended)

Run these commands in your terminal:

```bash
# Navigate to project
cd C:\ai_dashboard

# Create a clean export folder
mkdir -p ../PersonalAI-Export

# Copy only the necessary files
# Windows (PowerShell):
Copy-Item -Path "src" -Destination "../PersonalAI-Export/src" -Recurse
Copy-Item -Path "book" -Destination "../PersonalAI-Export/book" -Recurse
Copy-Item -Path "docs" -Destination "../PersonalAI-Export/docs" -Recurse
Copy-Item -Path "public" -Destination "../PersonalAI-Export/public" -Recurse
Copy-Item -Path ".env.example" -Destination "../PersonalAI-Export/"
Copy-Item -Path "package.json" -Destination "../PersonalAI-Export/"
Copy-Item -Path "package-lock.json" -Destination "../PersonalAI-Export/"
Copy-Item -Path "next.config.js" -Destination "../PersonalAI-Export/"
Copy-Item -Path "tsconfig.json" -Destination "../PersonalAI-Export/"
Copy-Item -Path "tailwind.config.js" -Destination "../PersonalAI-Export/"
Copy-Item -Path "postcss.config.js" -Destination "../PersonalAI-Export/"
Copy-Item -Path "README.md" -Destination "../PersonalAI-Export/"
Copy-Item -Path "LICENSE" -Destination "../PersonalAI-Export/"
Copy-Item -Path "CHANGELOG.md" -Destination "../PersonalAI-Export/"

# (Optional) Copy your database to keep your data
Copy-Item -Path "data" -Destination "../PersonalAI-Export/data" -Recurse
```

### Option B: Using Git (Best for keeping history)

```bash
# Navigate to project
cd C:\ai_dashboard

# This clones everything but excludes node_modules
# On the new computer:
git clone https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard.git
```

### Option C: Manual Selection

1. Insert thumb drive
2. Create folder: `PersonalAI-Dashboard`
3. Copy these folders: `src`, `book`, `docs`, `public`
4. Copy these files: `.env.example`, `package.json`, `package-lock.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `README.md`
5. (Optional) Copy `data/` folder if you want to keep your database

---

## Step 2: Important Notes About Data

### Database (data/assistant.db)

- **If you copy it:** Your chats, documents, brands, and settings transfer to the new computer
- **If you don't copy it:** You start fresh on the new computer

### Memory (data/MEMORY.md)

- **If you copy it:** Your AI's memory transfers
- **If you don't copy it:** You start with no memory

### API Keys (.env.local)

- **NEVER copy this file** to share with others
- It contains your private API keys
- Copy `.env.example` instead

---

## Step 3: On the New Computer

### Install Prerequisites

```bash
# 1. Install Node.js (version 18 or higher)
# Download from: https://nodejs.org
# Choose "LTS" version

# 2. Verify installation
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher

# 3. Install Ollama (for local AI)
# Download from: https://ollama.com
```

### Set Up the Project

```bash
# 1. Copy from thumb drive to computer
# Example: Copy PersonalAI-Dashboard folder to Desktop

# 2. Navigate to project
cd PersonalAI-Dashboard

# 3. Install dependencies (this takes a few minutes)
npm install

# 4. Create environment file
cp .env.example .env.local

# 5. (Optional) Add your API keys
# Edit .env.local with your text editor
# Add at minimum:
# OLLAMA_API_URL=http://localhost:11434/api

# 6. (Optional) Pull a model
ollama pull qwen3.5:9b

# 7. Start the application
npm run dev
```

### What Happens on First Run

1. The application creates `data/assistant.db` (database)
2. You'll see the setup wizard on first visit
3. Enter your name and assistant name
4. The dashboard is ready at `http://localhost:3000`

---

## Step 4: If You Copied Your Database

If you copied the `data/` folder from your old computer:

1. The app will have all your chats, documents, and brands
2. Your settings will be preserved
3. **You still need to recreate `.env.local`** with your API keys

---

## Troubleshooting

### "npm install fails"

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 already in use"

```bash
# Use a different port
PORT=3001 npm run dev
```

### "Ollama not found"

```bash
# Make sure Ollama is running
ollama serve

# In another terminal, pull a model
ollama pull qwen3.5:9b
```

### "Database errors"

```bash
# Delete the database to start fresh
rm -rf data/

# Restart the app (database will be recreated)
npm run dev
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│  PERSONAL AI DASHBOARD - QUICK SETUP                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PREREQUISITES:                                         │
│  □ Node.js 18+ (node --version)                        │
│  □ Ollama installed (ollama --version)                  │
│  □ Git (optional, git --version)                        │
│                                                         │
│  INSTALLATION:                                          │
│  $ npm install                                          │
│  $ cp .env.example .env.local                          │
│  $ npm run dev                                          │
│                                                         │
│  OPTIONALLY ADD FREE CLOUD MODELS:                      │
│  1. Get key at: https://ollama.com/settings/keys       │
│  2. Add to .env.local:                                  │
│     OLLAMA_API_KEY=your-key-here                       │
│                                                         │
│  LOCAL MODELS:                                          │
│  $ ollama pull qwen3.5:2b    (small, fast)             │
│  $ ollama pull qwen3.5:9b    (better quality)          │
│                                                         │
│  ACCESS:                                                │
│  http://localhost:3000                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Folder Sizes (Approximate)

| Folder | Size | Include? |
|--------|------|----------|
| `src/` | ~2 MB | ✅ Yes |
| `book/` | ~500 KB | ✅ Yes |
| `docs/` | ~200 KB | ✅ Yes |
| `public/` | ~100 KB | ✅ Yes |
| `data/` | ~5-50 MB | ⚠️ Optional |
| `node_modules/` | ~500 MB | ❌ No |
| `.next/` | ~100 MB | ❌ No |
| `.git/` | ~50 MB | ⚠️ Optional |

**Total without node_modules:** ~3 MB  
**Total with node_modules:** ~500 MB

---

## Sharing with Others

If sharing this project:

1. **Do NOT include your `.env.local` file** - it has your API keys
2. **Do NOT include `data/` folder** - it has your personal data
3. **Include `.env.example`** - so they know what to configure
4. **Include this guide** - they'll need setup instructions

---

## Questions?

- GitHub: https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard
- Issues: https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard/issues
- Book: See `book/` folder for complete documentation