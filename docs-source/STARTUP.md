# AI Research Assistant - Quick Start Guide

## Version 5.11 - Complete Feature Set

---

## First Run Setup

On first visit, the system redirects to `/setup` to collect:

1. **Your name** - For personalized greetings
2. **Assistant name** - What to name your AI

This creates a personalized experience. The system stores these preferences and uses them in the system prompt.

---

## Starting the System

### Prerequisites
1. Node.js installed (v18+)
2. npm or yarn
3. Ollama running (optional, for local AI models)

### Installation
```bash
cd ai_dashboard
npm install
```

### Starting the Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

### Starting with Custom Port
```bash
npm run dev -- -p 3001
```

### Starting Production Build
```bash
npm run build
npm start
```

---

## Stopping the System

### Graceful Shutdown

1. **From Terminal**: Press `Ctrl + C` in the terminal running the dev server

2. **From UI**: Use the System Controls panel in the web interface:
   - Go to the dashboard
   - Click the "Shutdown" button
   - Wait for graceful shutdown

3. **From API**:
```bash
curl -X POST http://localhost:3000/api/system \
  -H "Content-Type: application/json" \
  -d '{"action":"shutdown"}'
```

### Checking System Status

```bash
curl http://localhost:3000/api/system?action=status
```

---

## Features Overview

### Core Features
| Feature | Description | Access |
|---------|-------------|--------|
| **AI Chat** | Chat with multiple AI models | Main page |
| **OCR/Image Recognition** | Extract text from images | Upload button in chat |
| **Documents** | Import & manage documents | /documents |
| **Brand Voice Chat** | Chat with brand-specific context | /brand-chat |
| **Intelligence Reports** | Space & defense news + bids | /intelligence |
| **Self-Reflection** | AI analyzes itself for improvements | /self-reflection |
| **Security Agent** | Vulnerability scanning | /security |
| **Math Tools** | Calculator for expressions | /math or /calculate |
| **Notes** | Rich note-taking with AI | /notes |
| **Calendar** | Event management with ICS export | /calendar |
| **Workspace** | Organize folders, brands, projects | /workspace |
| **Experts** | Specialized AI agents | /experts |
| **SAM.gov** | Government contracting bids | /sam |
| **Telegram** | Chat via Telegram bot | /telegram |

### AI Models Supported
- **Ollama** (local): llama3.1, llama3.2, deepseek-r1, qwen2.5-coder
- **GLM-4.7-flash** (default)
- **OpenRouter** (with API key)
- **DeepSeek** (with API key)

### Features

---

## How to Use Each Feature

### 1. Chat Interface (Main Page)
- Type messages and press Enter to send
- Press `/` for command menu
- Click 🔍 for web search mode
- Click 📷 to upload image for OCR

**Commands:**
```
/search   - Web search
/documents - Go to documents
/intelligence - Go to intelligence
/calendar  - View calendar
/sam       - Search SAM.gov
/expert    - Switch to expert agent
```

### 2. OCR / Image Recognition
1. Click the 📷 image button in chat input
2. Select an image (PNG, JPG, etc.)
3. Text is extracted and added to input
4. Send to chat with AI

### 3. Documents & Knowledge Base
1. Go to **Documents** page
2. Click "Choose File" to upload
3. Supported formats: PDF, Word, TXT, MD, CSV, JSON
4. Documents are vectorized for semantic search
5. Use Weekly Briefing for summary

### 4. Brand Voice Chat (NotebookLM-style)
This is the key feature for managing multiple companies:

**Setup:**
1. Go to **Workspace** → Brands tab
2. Create a brand (e.g., "Digitanra U.S.")
3. Click ⚙️ on the brand to configure:
   - **Voice Style**: professional, casual, technical, friendly, formal
   - **Industry**: e.g., Defense Contracting, Food & Beverage
   - **Persona**: Describe how the brand should communicate
   - **Custom Instructions**: Specific behaviors
   - **Documents**: Add price sheets, brochures, proposals

**Chat:**
1. Go to **Brand Voice** page
2. Select a brand
3. Chat with AI that uses:
   - Brand's voice and persona
   - All documents assigned to that brand
   - Custom instructions

### 5. Intelligence Report Generator
Automated daily scanning for defense/space intelligence:

**News Topics Monitored:**
- Space Domain Awareness (SDA)
- Commercial Space / NOAA Office of Commercial Space
- Joint Commercial Office

**Bid Opportunities:**
- **SAM.gov**: opportunities matching your configured company profile
- **Canada Buys**: Canadian government contracting opportunities

**Usage:**
1. Go to **Intelligence** page
2. Click "Generate New Report" or wait for daily auto-generation
3. Browse by: News | Key People | Bid Opportunities
4. Key people include LinkedIn search links

### 6. Workspace Organization
- **Folders**: Hierarchical document organization
- **Brands**: Company/contact profiles with voice settings
- **Projects**: RFPs, quotes, proposals (link to brands/folders)
- **Documents**: Upload and manage all files

### 7. Expert Agents
Specialized AI agents for:
- Legal
- Finance
- HR
- Sales
- Research
- Marketing

### 8. SAM.gov Integration
Search government contracting opportunities:
- Add API key (90-day rotation)
- Create search queries with keywords
- Filter by NAICS codes, set-asides
- Daily auto-search option

### 9. Telegram Bot
Connect your Telegram bot:
1. Go to /telegram page
2. Add bot token
3. Set webhook URL
4. Chat with AI via Telegram

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/chat` | Chat with AI models |
| `/api/ocr` | Extract text from images |
| `/api/intelligence` | Generate/view intelligence reports |
| `/api/brand-chat` | Chat with brand context |
| `/api/documents/import` | Upload & manage documents |
| `/api/documents/chat` | Chat with specific document |
| `/api/brands` | Brand CRUD operations |
| `/api/folders` | Folder CRUD operations |
| `/api/projects` | Project CRUD operations |
| `/api/sam` | SAM.gov search |
| `/api/database` | SQLite CRUD operations |
| `/api/heartbeat` | Health check + daily intelligence + self-reflection |
| `/api/self-reflection` | Run self-analysis, view reports |
| `/api/memory` | Vector memory |
| `/api/vector-lake` | Smart query cache |
| `/api/features/request` | Feature request system |

---

## System Components

### Running Services
- **Next.js Server**: http://localhost:3000
- **API Endpoints**: See table above
- **Database**: SQLite in `data/assistant.db`

### Storage
- **localStorage**: Documents, brands, settings
- **SQLite**: Contacts, tasks, events, notes
- **Vector Store**: Semantic memory embeddings

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Ollama Not Connecting
1. Ensure Ollama is running: `ollama serve`
2. Check API URL in `.env.local`
3. Use the System Controls to restart

### Database Issues
The system uses localStorage by default. For SQL database, see SQL Integration section.

---

## Environment Variables

Create `.env.local` in the root directory:

```env
# Ollama (local AI)
OLLAMA_API_URL=http://localhost:11434/api

# OpenRouter (optional)
OPENROUTER_API_KEY=your-openrouter-key

# DeepSeek (optional)
DEEPSEEK_API_KEY=your-deepseek-key

# Web Search (optional)
TAVILY_API_KEY=your-tavily-key
BRAVE_API_KEY=your-brave-key

# SAM.gov (for bid searches)
SAM_API_KEY=your-sam-gov-key

# Database (for SQL)
DATABASE_URL=your-database-connection-string
```

---

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

3. Use process manager (PM2) for production:
```bash
pm2 start npm --name "ai-assistant" -- start
pm2 stop ai-assistant
pm2 restart ai-assistant
```

---

## API Key Management

### Adding API Keys via UI
Use the Settings panel in the web interface to:
- Add SAM.gov API keys
- Configure OpenRouter/DeepSeek keys
- Enable/disable features

### Adding Keys via API
```bash
curl -X POST http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{"action":"setAPIKey","data":{"provider":"sam","key":"your-key"}}'
```

---

## Feature Request System

The system can self-improve! Use the Features page to:
1. Describe a new feature you want
2. LLM proposes implementation
3. You approve/reject changes
4. OpenCode securely implements approved features

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Open command menu |
| Enter | Send message |
| Shift+Enter | New line |
| Esc | Close menus |

---

## Example Workflows

### Defense Contracting Research
1. Use Intelligence to find relevant bids
2. Create brand profile in Workspace
3. Upload relevant RFPs to brand
4. Chat with Brand Voice to get answers

### Document Q&A
1. Upload documents to /documents
2. Assign docs to brand
3. Use Brand Voice chat to ask questions

### Daily Intelligence
1. Heartbeat auto-generates daily
2. Check /intelligence for news
3. Follow up with key people via LinkedIn
4. Apply to relevant bid opportunities

| **Self-Reflection** | AI analyzes itself for improvements | /self-reflection |

---

## Self-Improving System

### 1. Self-Reflection (Autonomous Improvement)
The AI periodically analyzes itself to become more responsive and useful:

**What it does:**
1. Analyzes current capabilities and gaps
2. Identifies inefficiencies
3. Suggests improvements
4. Recommends tools/features to add
5. Provides model usage recommendations

**How to use:**
1. Go to **Self-Reflect** page
2. Click "Run Self-Analysis"
3. Review the report

**Auto-runs every 6 hours via heartbeat.**

**Example output:**
- Overall score (0-100)
- Current capabilities list
- Identified gaps
- Suggestions ranked by priority
- New tool/feature recommendations
- Model recommendations (when to use powerful vs. cheap models)

---

### 2. Feature Request System

### How It Works
The system can add new features using OpenCode:

1. **Go to /features page**
2. **Submit a feature request:**
   - Title: "Add a weather widget"
   - Description: "Show current weather for a given zip code"
3. **Click "Implement with OpenCode"**
4. OpenCode will:
   - Explore the codebase
   - Create necessary files
   - Add API routes and UI components
   - Follow existing patterns

### Benefits
- **Cost efficient**: Base chat uses fast/cheap models
- **Powerful when needed**: OpenCode handles complex feature building
- **Secure**: Only allows modifications to source directories
- **No LLM in middle**: Direct execution, no proposal/approval cycle

### What OpenCode Can Do
- Create new API routes (`src/app/api/*`)
- Add new pages (`src/app/*`)
- Create components (`src/components/*`)
- Add library functions (`src/lib/*`)
- Update documentation (`docs/*`)

### Security
OpenCode is restricted from modifying:
- `.env` files
- `node_modules/`
- `package.json`
- Any files containing secrets

---

## Architecture Notes

### Model Usage
- **Chat/Quick tasks**: Uses Ollama, GLM, or OpenRouter (fast, cheap)
- **Feature building**: Uses OpenCode (capable model, only when adding features)

This keeps operational costs low while having powerful feature-building capability available.
