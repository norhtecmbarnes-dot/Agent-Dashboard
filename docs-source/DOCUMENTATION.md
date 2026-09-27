# AI Dashboard - Complete Documentation

**Version:** 2.0.0  
**Last Updated:** March 2, 2026  
**License:** CC BY-SA 4.0

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Features](#features)
3. [Architecture](#architecture)
4. [API Reference](#api-reference)
5. [Configuration](#configuration)
6. [Integrations](#integrations)
7. [Security](#security)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Development](#development)

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- 8GB+ RAM (for local models)
- Ollama (for local AI)

### Installation

```bash
# Clone the repository
git clone https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard.git
cd PersonalAI-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### First Run

1. The system will automatically create `data/` directory
2. SQLite database initialized at `data/assistant.db`
3. Default models available from Ollama
4. No API keys required for core functionality

### Environment Variables

Create `.env` file:

```env
# AI Models (optional - uses local Ollama by default)
OLLAMA_API_URL=http://localhost:11434/api
GLM_API_KEY=your_glm_key
OPENROUTER_API_KEY=your_openrouter_key
DEEPSEEK_API_KEY=your_deepseek_key

# Authentication (required for admin access)
ENABLE_AUTH=true
DEFAULT_ADMIN_PASSWORD=your-secure-password-here
DEFAULT_USER_PASSWORD=your-user-password-here

# Integrations (optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
SAM_API_KEY=your_sam_gov_key

# ONLYOFFICE (optional)
NEXT_PUBLIC_ONLYOFFICE_URL=http://localhost:8080
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3000
ONLYOFFICE_JWT_SECRET=your_jwt_secret

# Database
DATABASE_PATH=./data/assistant.db
```

---

## Features

### Core Features

| Feature | Status | Description |
|---------|--------|-------------|
| Chat | ✅ Complete | Conversational AI with multiple models |
| Writing Assistant | ✅ Complete | 7 actions: expand, outline, continue, rewrite, simplify, elaborate, structure |
| Document Generation | ✅ Complete | Create .docx, .xlsx, .pptx files |
| Memory System | ✅ Complete | Persistent context via MEMORY.md |
| Vector Lake | ✅ Complete | Smart semantic caching |
| Task Scheduler | ✅ Complete | Automated intelligence reports, security scans |

### Integration Features

| Feature | Status | Description |
|---------|--------|-------------|
| Telegram Bot | ✅ Complete | Chat with AI via Telegram |
| ONLYOFFICE | ✅ Complete | Generate and edit Office documents |
| SAM.gov | ✅ Complete | Government contracting opportunities |
| OCR | ✅ Complete | Extract text from images |

### AI Models

| Model | Size | Type | Status |
|-------|------|------|--------|
| qwen3-coder-next | 52GB | Code Specialist | ✅ Recommended |
| glm-4.7-flash | 19GB | Fast Chat | ✅ Recommended |
| qwen3.5:27b | 17GB | General Purpose | ✅ Working |
| qwen2.5:14b | 9GB | Lightweight | ✅ Working |
| llama4:scout | 67GB | Large Model | ✅ Working |
| glm-5:cloud | - | Cloud API | ✅ Working |

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI Dashboard                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Frontend   │  │    API       │  │   Services   │          │
│  │   Next.js    │  │   Routes     │  │   Layer      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                  │
│         └─────────────────┼──────────────────┘                  │
│                           │                                      │
│  ┌────────────────────────┼────────────────────────────────────┐│
│  │                        │                                    ││
│  │  ┌─────────────────────┼─────────────────────────────────┐ ││
│  │  │                     │                                  │ ││
│  │  │  ┌─────────┐  ┌─────┴─────┐  ┌─────────┐  ┌─────────┐ │ ││
│  │  │  │ Ollama  │  │  Model   │  │  Vector │  │   AI    │ │ ││
│  │  │  │ Models  │  │  Router  │  │  Lake   │  │ Agents  │ │ ││
│  │  │  └─────────┘  └───────────┘  └─────────┘  └─────────┘ │ ││
│  │  │                                                          ││
│  │  │                    Core Services                         ││
│  │  └──────────────────────────────────────────────────────────┘│
│  │                                                              │
│  │  ┌────────────────────────────────────────────────────────┐ │
│  │  │                      Storage                            │ │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │ │
│  │  │  │ SQLite  │  │ File    │  │ Vector  │  │ Memory  │   │ │
│  │  │  │   DB    │  │ Storage │  │ Store   │  │ Context │   │ │
│  │  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │ │
│  │  └────────────────────────────────────────────────────────┘ │
│  │                                                            │
│  └──────────────────────────────────────────────────────────────┘
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input → API Route → Validation → Service Layer → AI Model → Response
                                    ↓
                              Vector Lake (Cache)
                                    ↓
                              SQLite (Persist)
```

### File Structure

```
PersonalAI-Dashboard/
├── data/                          # Runtime data
│   ├── assistant.db               # SQLite database
│   ├── book_progress.json         # Book writing state
│   ├── metrics.json               # System metrics
│   ├── self-reflection-reports.json
│   ├── vector_store.json          # Vector embeddings
│   ├── MEMORY.md                  # AI memory context
│   └── SOUL.md                    # AI personality
│
├── docs/                          # Documentation
│   ├── API-REFERENCE.md
│   ├── ARCHITECTURE.md
│   ├── TELEGRAM-SETUP.md
│   ├── ONLYOFFICE-IMPLEMENTATION.md
│   └── ...
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API routes
│   │   │   ├── chat/              # Chat endpoints
│   │   │   ├── documents/         # Document generation
│   │   │   ├── telegram/           # Telegram bot
│   │   │   ├── writing/            # Writing assistant
│   │   │   └── ...
│   │   ├── office/                # ONLYOFFICE pages
│   │   └── page.tsx               # Main page
│   │
│   ├── lib/
│   │   ├── agent/                 # AI agents
│   │   ├── config/                # Configuration
│   │   ├── database/              # SQLite operations
│   │   ├── integrations/          # External services
│   │   ├── models/                # AI model SDK
│   │   ├── services/              # Business logic
│   │   ├── storage/               # Storage systems
│   │   └── utils/                 # Utilities
│   │
│   └── components/                # React components
│
├── public/                         # Static files
├── package.json
├── next.config.js
└── tsconfig.json
```

---

## API Reference

### Chat API

#### POST /api/chat

Non-streaming chat completion.

```typescript
// Request
{
  "message": "Hello, what can you do?",
  "model": "glm-4.7-flash",
  "conversationHistory": []
}

// Response
{
  "message": "I can help with...",
  "done": true,
  "vectorLakeUsed": false
}
```

#### POST /api/chat/stream

Streaming chat completion (Server-Sent Events).

```typescript
// Request
{
  "message": "Tell me a story",
  "model": "glm-4.7-flash",
  "conversationHistory": [],
  "searchMode": false
}

// Response (SSE)
data: {"chunk": "Once", "done": false}
data: {"chunk": " upon", "done": false}
data: {"chunk": " a", "done": false}
data: {"done": true}
```

### Writing Assistant API

#### POST /api/writing

```typescript
// Request
{
  "action": "expand",
  "text": "The AI helps productivity.",
  "model": "glm-4.7-flash"
}

// Available actions:
// - expand: Make text longer (2-3x)
// - outline: Create hierarchical outline
// - continue: Continue writing
// - rewrite: Rewrite in different style
// - simplify: Simplify for general audience
// - elaborate: Add examples and evidence
// - structure: Organize with headers
```

### Document Generation API

#### POST /api/documents/generate

```typescript
// Request - Word Document
{
  "title": "My Document",
  "type": "word",
  "content": ["Paragraph 1", "Paragraph 2"]
}

// Request - Excel Spreadsheet
{
  "title": "Budget",
  "type": "cell",
  "headers": ["Item", "Cost", "Date"],
  "rows": [["Coffee", "$5", "2024-01-01"]]
}

// Request - PowerPoint Presentation
{
  "title": "Pitch Deck",
  "type": "slide",
  "slides": [
    { "title": "Introduction", "bulletPoints": ["Point 1", "Point 2"] }
  ]
}

// Response: Binary file download
```

### ONLYOFFICE API

#### GET /api/onlyoffice/documents?action=list

List all documents.

#### POST /api/onlyoffice/documents

Create or generate documents.

```typescript
// Create empty document
{
  "action": "create",
  "data": { "title": "New Document", "type": "word" }
}

// Generate from AI
{
  "action": "generate",
  "data": { "prompt": "Write a business letter", "type": "word" }
}
```

#### GET /api/onlyoffice/download?id=xxx

Download document as Office file.

### Telegram API

#### GET /api/telegram/config

Get bot configuration.

#### POST /api/telegram/config

Save bot configuration.

```typescript
{
  "action": "save",
  "config": {
    "botToken": "123456789:ABC...",
    "enabled": true
  }
}
```

#### POST /api/telegram/polling

Start/stop polling.

```typescript
{ "action": "start" }  // Start polling
{ "action": "stop" }   // Stop polling
```

### Models API

#### GET /api/models

List available AI models.

```typescript
// Response
{
  "ollama": {
    "available": true,
    "models": [
      { "name": "glm-4.7-flash", "size": 19019270852 },
      { "name": "qwen3.5:27b", "size": 17420432705 }
    ]
  },
  "external": [
    { "id": "openrouter", "name": "OpenRouter (GPT-4o Mini)" },
    { "id": "deepseek/deepseek-chat", "name": "DeepSeek Chat" }
  ]
}
```

---

## Configuration

### Memory System (MEMORY.md)

Located at `data/MEMORY.md`. This file provides context to the AI.

```markdown
# MEMORY.md

> Last updated: 2024-01-15

## User Profile

Name: Michael
Role: Project Manager
Preferences: Concise responses, technical details

## Projects

### Project Alpha
- Status: Active
- Goal: Build AI assistant
- Documents: proposals/, specs/

## Knowledge

### Key Concepts
- Vector Lake: Semantic caching system
- Tool Efficiency: Tracks AI tool usage
```

### Task Scheduler

Automated tasks run on schedules:

| Task | Schedule | Description |
|------|----------|-------------|
| Intelligence Report | Every 24h | Scan news, SAM.gov |
| Security Scan | Every 12h | Check vulnerabilities |
| Self-Reflection | Every 6h | Analyze system |
| Research | Every 24h | Research improvements |

### Vector Lake Configuration

Smart semantic caching with 30-day expiry:

```typescript
// Automatic caching
// Searches similar queries (threshold: 0.75)
// Returns cached results when found
// Falls back to web search on miss
```

---

## Integrations

### Telegram Bot Setup

See [docs/TELEGRAM-SETUP.md](./docs/TELEGRAM-SETUP.md) for complete setup guide.

Quick setup:
1. Create bot via @BotFather
2. Go to `/telegram` page
3. Enter bot token
4. Enable and save
5. Click "Start Polling"

### ONLYOFFICE Integration

See [docs/ONLYOFFICE-IMPLEMENTATION.md](./docs/ONLYOFFICE-IMPLEMENTATION.md).

Two modes:
- **Local:** Generate documents without Docker
- **Editor:** In-browser editing with Docker

### SAM.gov Integration

For government contracting opportunities.

```typescript
// Search opportunities
fetch('/api/sam?keyword=cybersecurity')

// Get opportunities
const opportunities = await response.json();
```

---

## Security

### Authentication

Set environment variables:

```env
ENABLE_AUTH=true
DEFAULT_ADMIN_PASSWORD=your-secure-password
DEFAULT_USER_PASSWORD=your-user-password
```

**Important:** No default passwords are provided. You MUST set these.

### Data Privacy

- All data stored locally in SQLite
- No external services required for core functionality
- Optional cloud AI through API keys
- Full audit trail in logs

### Rate Limiting

Rate limiting middleware available at `src/lib/middleware/rate-limit.ts`.

```typescript
// Apply to routes
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit';

export const POST = withRateLimit(handler, rateLimitConfigs.normal);
```

### Best Practices

1. **Never commit `.env` file**
2. **Use strong passwords** (12+ characters)
3. **Enable rate limiting on public endpoints**
4. **Use HTTPS in production**
5. **Rotate API keys periodically**

---

## Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose (with ONLYOFFICE)

```yaml
version: '3'
services:
  ai-dashboard:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - OLLAMA_API_URL=http://ollama:11434/api
      
  onlyoffice:
    image: onlyoffice/documentserver
    ports:
      - "8080:80"
      
  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
```

---

## Troubleshooting

### Common Issues

#### AI models not loading

```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Pull model if missing
ollama pull glm-4.7-flash
```

#### localStorage errors in server console

This is fixed. Data now persists to file system:
- `data/assistant.db` - SQLite database
- `data/metrics.json` - System metrics
- `data/vector_store.json` - Embeddings

#### Telegram bot not responding

1. Check polling status: `GET /api/telegram/polling`
2. Verify token saved: `GET /api/telegram/config`
3. Start polling: `POST /api/telegram/polling {"action":"start"}`

#### Build fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Logs

Check console output for `[ServiceName]` prefixed logs:

```
[Auth] Default users initialized
[BookWriter] Saved progress to file
[Metrics] Loaded 1523 events from file
[Telegram] Starting polling...
```

### Health Check

```bash
curl http://localhost:3000/api/heartbeat
```

```json
{
  "status": "healthy",
  "totalTasks": 154,
  "tasks": {
    "reflection": { "success": true },
    "security": { "success": true }
  }
}
```

---

## Development

### Project Structure

```
src/
├── app/                    # App Router pages and API routes
│   ├── api/               # Backend API endpoints
│   ├── office/            # ONLYOFFICE pages
│   └── page.tsx           # Home page
│
├── lib/
│   ├── agent/             # AI agents (research, security)
│   ├── config/            # Configuration files
│   ├── database/          # SQLite operations
│   ├── integrations/      # External services
│   ├── models/            # AI model SDK
│   ├── services/          # Business logic
│   ├── storage/           # Storage systems
│   └── utils/             # Utilities
│
└── components/            # React components
```

### Adding a New Feature

1. Create service in `src/lib/services/`
2. Create API route in `src/app/api/`
3. Create page in `src/app/`
4. Add to navigation in `src/app/page.tsx`

### Adding a New AI Model

Edit `src/lib/models/sdk.server.ts`:

```typescript
// Add to EXTERNAL_MODELS array
{
  id: 'new-model',
  name: 'New Model Name',
  provider: 'provider-name',
  description: 'Model description'
}
```

### Running Tests

```bash
npm run lint
npm run build
```

---

## Support

### Documentation

- [API Reference](./docs/API-REFERENCE.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Telegram Setup](./docs/TELEGRAM-SETUP.md)
- [ONLYOFFICE](./docs/ONLYOFFICE-IMPLEMENTATION.md)
- [Security](./docs/SECURITY-ASSESSMENT.md)

### Issues

Report issues at: https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard/issues

---

## Changelog

### Version 2.0.0 (March 2026)

**Critical Security Fixes:**
- Removed hardcoded default passwords
- Migrated localStorage to file-based storage
- Fixed Telegram configuration persistence

**New Features:**
- Enhanced document generation
- Improved Vector Lake caching
- Better error logging

**Fixes:**
- Non-streaming chat now returns proper responses
- Self-reflection persists to file
- Metrics service uses file storage

See [CHANGELOG.md](./CHANGELOG.md) for full history.

---

## License

**Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**

Free for personal and commercial use with attribution.

---

**Built with ❤️ for organizations that need AI but can't use cloud services.**