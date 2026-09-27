# Customization Guide

This document explains how to customize the AI Dashboard for your specific needs.

## Table of Contents

1. [Web Search](#web-search)
2. [AI Models](#ai-models)
3. [API Keys](#api-keys)
4. [Authentication](#authentication)
5. [Scheduled Tasks](#scheduled-tasks)
6. [Telegram Bot](#telegram-bot)
7. [ONLYOFFICE](#onlyoffice)
8. [Adding New Features](#adding-new-features)

---

## Web Search

### Current Implementation

The web search uses a priority-based fallback system:

```
1. DuckDuckGo Instant Answers (Free) - Facts, definitions, known topics
2. Tavily API (API key) - Full web search
3. Brave Search API (API key) - Full web search
```

### Limitations

**DuckDuckGo** is an **Instant Answer API**, not a full web search:
- ✅ Works for: "artificial intelligence", "what is Python", "Barack Obama"
- ❌ Doesn't work for: "latest news", "today's weather", "current events"

For full web search capabilities, you need a search API:

### Option 1: Tavily (Recommended)

1. Get API key at https://tavily.com
2. Add to `.env`:
   ```env
   TAVILY_API_KEY=tvly-xxxxx
   ```

### Option 2: Brave Search

1. Get API key at https://brave.com/search/api
2. Add to `.env`:
   ```env
   BRAVE_API_KEY=xxxxx
   ```

### Option 3: Custom Search Provider

Edit `src/lib/websearch.ts` to add your own:

```typescript
// Add your custom search provider
if (process.env.MY_SEARCH_API_KEY) {
  try {
    const response = await fetch('https://your-api.com/search', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.MY_SEARCH_API_KEY}` },
      body: JSON.stringify({ query, limit: 5 }),
    });
    // Parse and return results...
  } catch (error) {
    console.error('Custom search error:', error);
  }
}
```

---

## AI Models

### Current Models

The system supports multiple AI model providers:

| Provider | Models | Required |
|----------|--------|----------|
| Ollama | glm-4.7-flash, qwen3-coder-next, etc. | Local installation |
| GLM | glm-4, glm-5:cloud | GLM_API_KEY |
| OpenRouter | GPT-4o-mini, Claude, etc. | OPENROUTER_API_KEY |
| DeepSeek | deepseek-chat | DEEPSEEK_API_KEY |

### Adding a New Model

1. **Edit model registry:** `src/lib/models/model-router.ts`

```typescript
export const AVAILABLE_MODELS = {
  // Add your model
  'your-model': {
    id: 'your-model',
    name: 'Your Model Name',
    provider: 'your-provider',
    contextWindow: 128000,
    capabilities: ['chat', 'code', 'analysis'],
    recommendedFor: ['general', 'coding'],
  },
};
```

2. **Add provider support:** `src/lib/models/sdk.server.ts`

```typescript
async function callYourProvider(model: string, messages: OllamaMessage[]): Promise<ChatCompletionResponse> {
  const response = await fetch('https://your-api.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.YOUR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages }),
  });
  // Parse response...
}
```

---

## API Keys

### Storage

API keys are stored in SQLite database at `data/assistant.db`:

```sql
-- Table: user_preferences
-- Keys are persisted across restarts
```

### Managing via API

```bash
# Save API key
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -d '{"action":"setApiKey","provider":"openrouter","key":"sk-xxx"}'

# Get all keys (masked)
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -d '{"action":"getApiKeys"}'

# Remove key
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -d '{"action":"removeApiKey","provider":"openrouter"}'
```

### Environment Variables (Production)

For production, use environment variables instead:

```env
# AI Model APIs
GLM_API_KEY=your_glm_key
OPENROUTER_API_KEY=your_openrouter_key
DEEPSEEK_API_KEY=your_deepseek_key

# Search APIs
TAVILY_API_KEY=your_tavily_key
BRAVE_API_KEY=your_brave_key

# Integrations
TELEGRAM_BOT_TOKEN=your_bot_token
SAM_API_KEY=your_sam_key
```

---

## Authentication

### Enable Authentication

```env
ENABLE_AUTH=true
DEFAULT_ADMIN_PASSWORD=your-secure-password
DEFAULT_USER_PASSWORD=your-user-password
```

### Password Requirements

- Minimum 12 characters recommended
- No default passwords provided
- Must be set before login works

### Adding Custom Authentication

Edit `src/lib/middleware/auth.ts`:

```typescript
// Add custom authentication provider
async function validateWithOAuth(token: string): Promise<User | null> {
  // Your OAuth implementation
}
```

---

## Scheduled Tasks

### Default Tasks

| Task | Schedule | Description |
|------|----------|-------------|
| Intelligence | Daily | Generate news report |
| Security | Every 12h | Scan for vulnerabilities |
| Research | Daily (disabled) | Research improvements |
| Reflection | Every 6h | Self-improvement analysis |

### Custom Tasks

Create a custom task:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "task": {
      "name": "My Custom Task",
      "taskType": "custom",
      "prompt": "Summarize today's meetings",
      "schedule": "daily"
    }
  }'
```

### Task Types

```typescript
type TaskType = 
  | 'intelligence'   // News and reports
  | 'security'       // Security scanning
  | 'research'       // AI research
  | 'reflection'     // Self-improvement
  | 'sam_check'      // SAM.gov opportunities
  | 'brand_task'     // Brand-specific tasks
  | 'web_check'      // Website monitoring
  | 'custom'         // User-defined
```

---

## Telegram Bot

### Setup

See [TELEGRAM-SETUP.md](./TELEGRAM-SETUP.md) for detailed instructions.

Quick setup:
1. Create bot via @BotFather
2. Go to `/telegram`
3. Enter token and save
4. Click "Start Polling"

### Custom Commands

Edit `src/app/api/telegram/route.ts`:

```typescript
if (text.startsWith('/mystudy')) {
  const topic = text.replace('/mystudy ', '').trim();
  const materials = await generateStudyMaterials(topic);
  await telegramService.sendMessage(chatId, materials, 'Markdown');
  return NextResponse.json({ ok: true });
}
```

---

## ONLYOFFICE

### Modes

1. **Local Mode** (Default): Generate documents without Docker
2. **Editor Mode**: Full editing with ONLYOFFICE Document Server

### Enable Editor Mode

1. Install Docker
2. Run ONLYOFFICE:
   ```bash
   docker run -i -t -d -p 8080:80 onlyoffice/documentserver
   ```
3. Set environment:
   ```env
   NEXT_PUBLIC_ONLYOFFICE_URL=http://localhost:8080
   NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3000
   ONLYOFFICE_JWT_SECRET=your-jwt-secret
   ```

### Custom Document Templates

Edit `src/lib/services/document-generator.ts`:

```typescript
// Add custom template
const templates = {
  'meeting-notes': {
    title: 'Meeting Notes',
    generate: async (params) => {
      // Your template logic
    }
  }
};
```

---

## Adding New Features

### Create a New Page

```typescript
// src/app/myfeature/page.tsx
export default function MyFeaturePage() {
  return (
    <div>
      <h1>My Feature</h1>
      {/* Your content */}
    </div>
  );
}
```

### Create an API Route

```typescript
// src/app/api/myfeature/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ feature: 'data' });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Process request
  return NextResponse.json({ success: true });
}
```

### Add Navigation

Edit `src/app/page.tsx` to add your feature to the main navigation.

### Create a Service

```typescript
// src/lib/services/my-service.ts
class MyService {
  private static instance: MyService;

  static getInstance(): MyService {
    if (!MyService.instance) {
      MyService.instance = new MyService();
    }
    return MyService.instance;
  }

  async doSomething() {
    // Your logic
  }
}

export const myService = MyService.getInstance();
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `data/MEMORY.md` | AI memory context |
| `data/SOUL.md` | AI personality |
| `data/assistant.db` | SQLite database |

## Database

### Tables

- `documents` - Document storage
- `tasks` - User tasks
- `scheduled_tasks` - Automated tasks
- `notes` - Notes
- `calendar_events` - Events
- `sam_searches` - SAM.gov queries
- `sam_opportunities` - Contract opportunities
- `user_preferences` - User settings (includes API keys, Telegram config)
- `app_config` - Application settings

### Direct Access

```bash
sqlite3 data/assistant.db

# List all tables
.tables

# View user preferences
SELECT * FROM user_preferences;

# View scheduled tasks
SELECT * FROM scheduled_tasks;
```

---

## Support

- Documentation: [DOCUMENTATION.md](./DOCUMENTATION.md)
- API Reference: [API-REFERENCE.md](./API-REFERENCE.md)
- Quick Start: [QUICK-START.md](./QUICK-START.md)