# AI Dashboard - Project Overview for AI Assistant Integration

## Executive Summary

AI Dashboard is a self-improving AI productivity assistant built with Next.js 16, TypeScript, and SQLite. It integrates multiple AI models (Ollama, GLM, OpenRouter, DeepSeek) to provide chat, document management, task automation, and office productivity features. The system follows principles from SOUL.md including proactive organization, radical efficiency, and continuous self-improvement.

## Core Architecture

### Technology Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: SQLite (@sqlite.org/sqlite-wasm) with persistent storage in `data/assistant.db`
- **AI Models**: Multi-model support via `src/lib/models/sdk.server.ts`
  - Primary: Ollama with local models (GLM-4.7-flash, Qwen, etc.)
  - Cloud: GLM API, OpenRouter, DeepSeek
- **Document Generation**: `docx`, `xlsx`, `pptxgenjs` for real Office files
- **Office Integration**: ONLYOFFICE Document Server (Docker)

### Key Directories
```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # Backend API endpoints
│   │   ├── chat/          # Chat endpoint with memory integration
│   │   ├── writing/       # Writing assistant (expand, outline, etc.)
│   │   ├── canvas/        # AI-generated UI components
│   │   ├── onlyoffice/    # Document management and editing
│   │   ├── memory-file/   # MEMORY.md persistent memory
│   │   ├── tasks/         # Task scheduler management
│   │   ├── security/      # Security scanning
│   │   └── ...
│   ├── office/           # Office-related pages
│   ├── memory/           # Memory management UI
│   ├── canvas/           # Canvas/A2UI page
│   └── page.tsx          # Main chat interface
├── lib/
│   ├── agent/            # AI agents (research, security, self-improvement)
│   ├── database/         # SQLite database operations
│   ├── integrations/     # External service integrations (SAM.gov, Telegram, OnlyOffice)
│   ├── services/         # Business logic services
│   ├── models/           # AI model SDKs
│   ├── storage/          # Document and vector storage
│   └── utils/            # Utility functions
├── components/           # React components
└── public/               # Static assets
```

## Key Features

### 1. Chat System (`src/app/api/chat/route.ts`)
- Multi-model AI chat with conversation history
- MEMORY.md context injection for persistent memory
- Vector lake for semantic search
- Tool commands: `/search`, `/memory`, `/sam`, `/brand`

### 2. Writing Assistant (`src/app/api/writing/route.ts`)
- Actions: expand, outline, continue, rewrite, simplify, elaborate, structure
- Style selection for rewrite
- Model selection (local fast vs cloud capable)

### 3. Office Integration (`src/app/office/`)
- Document generation: Word (.docx), Excel (.xlsx), PowerPoint (.pptx)
- ONLYOFFICE Document Server integration for in-browser editing
- Preview and download functionality
- AI-powered content generation from prompts

### 4. Memory System (`src/app/memory/`)
- MEMORY.md structured persistent memory
- User profile, projects, brands, knowledge entries
- Conversation context tracking
- System prompt generation from memory

### 5. Task Scheduler (`src/lib/services/task-scheduler.ts`)
- Automated tasks: research, security scanning, self-reflection, intelligence gathering
- Heartbeat system for periodic execution
- Task result logging and history

### 6. Canvas/A2UI (`src/app/canvas/`)
- AI-generated interactive UI components
- Templates: dashboards, forms, tables, charts, timelines
- Natural language to HTML/Chart.js generation

### 7. SAM.gov Integration (`src/lib/integrations/sam-gov.ts`)
- Government contracting opportunity search
- Keyword monitoring and alerts
- API key rotation management

## Current Issues to Address

### ONLYOFFICE Integration Problems (Priority: HIGH)
1. **Editor not loading**: `@onlyoffice/document-editor-react` component has TypeScript errors
   - `onLoad` prop doesn't exist on DocumentEditorProps
   - Need proper event handlers
   
2. **Docker networking**: localhost:3000 not reachable from inside container
   - Solution: Use `host.docker.internal:3000` for Mac/Windows
   - Fallback: Environment variable for base URL
   
3. **Document keys unstable**: Using `Date.now()` causes cache/security errors
   - Solution: Use document updatedAt timestamp as stable key
   
4. **JWT missing**: OnlyOffice Docker enables JWT by default since v7.5+
   - Need JWT generation for document config

### Other Known Issues
1. **Canvas API slow**: LLM generation takes 10-30 seconds for complex dashboards
2. **Telegram config persistence**: May not persist across restarts
3. **Research tasks**: Generate demo data instead of real web searches

## Environment Variables

```bash
# .env.example
# AI Models
GLM_API_KEY=your_glm_key
OPENROUTER_API_KEY=your_openrouter_key
DEEPSEEK_API_KEY=your_deepseek_key

# ONLYOFFICE
NEXT_PUBLIC_ONLYOFFICE_URL=http://localhost:8080
NEXT_PUBLIC_DASHBOARD_URL=http://host.docker.internal:3000
ONLYOFFICE_JWT_SECRET=your_jwt_secret_optional

# SAM.gov
SAM_API_KEY=your_sam_key

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token

# Database
DATABASE_PATH=./data/assistant.db
```

## Database Schema (SQLite)

```sql
-- Documents
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  tags TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- Scheduled Tasks
CREATE TABLE scheduled_tasks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  schedule TEXT NOT NULL,
  enabled INTEGER,
  last_run INTEGER,
  last_result TEXT,
  config TEXT
);

-- Chat History
CREATE TABLE chat_history (
  id TEXT PRIMARY KEY,
  title TEXT,
  messages TEXT,
  created_at INTEGER
);

-- Brands/Contacts/Events/Notes tables also exist
```

## SOUL.md Principles

The system follows these core principles defined in SOUL.md:

1. **Proactive Organization**: Automatically categorize, tag, and file information
2. **Radical Efficiency**: Minimize clicks, maximize automation
3. **Continuous Self-Improvement**: Weekly reflection, suggestion implementation
4. **Proactive Task Management**: Generate tasks from conversations automatically

## Self-Improvement Protocol

The system includes a self-improvement agent that:
1. Runs every 6 hours via heartbeat
2. Analyzes system health and efficiency
3. Generates improvement suggestions
4. Logs to `/api/ai-log` for weekly review

## Security Considerations

- **No authentication**: Currently no user auth system
- **No rate limiting**: APIs are open
- **CORS not configured**: Needs strict CORS policy
- **Input validation**: Incomplete on some endpoints

## Docker Commands

```bash
# ONLYOFFICE Document Server
docker run -i -t -d -p 8080:80 \
  -e JWT_ENABLED=true \
  -e JWT_SECRET=your-secret-key \
  --restart=always \
  --name onlyoffice \
  onlyoffice/documentserver

# Start existing
docker start onlyoffice

# Check status
docker ps | grep onlyoffice
curl http://localhost:8080/healthcheck
```

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | Chat with AI |
| `/api/writing` | POST | Writing assistance |
| `/api/canvas` | POST | Generate UI components |
| `/api/onlyoffice/documents` | GET/POST | Document CRUD |
| `/api/onlyoffice/download` | GET | Download Office files |
| `/api/onlyoffice/callback` | POST | OnlyOffice save callback |
| `/api/memory-file` | GET/POST | MEMORY.md management |
| `/api/tasks` | GET/POST | Task management |
| `/api/heartbeat` | GET | System status |
| `/api/security` | GET/POST | Security scans |

## Next Steps Priorities

1. **Fix OnlyOffice Editor component** - TypeScript errors with event handlers
2. **Add JWT support** - Generate tokens for document config
3. **Implement stable document keys** - Use updatedAt timestamp
4. **Add authentication** - Basic user/session management
5. **Add rate limiting** - Protect API endpoints
6. **Improve Canvas performance** - Caching for generated UIs
7. **Fix Telegram persistence** - Database storage for config

## Testing Commands

```bash
# Start development server
npm run dev

# Run type check
npx tsc --noEmit

# Test ONLYOFFICE connection
curl http://localhost:8080/healthcheck

# Test document creation
curl -X POST http://localhost:3000/api/onlyoffice/documents \
  -H "Content-Type: application/json" \
  -d '{"action":"create","data":{"title":"Test","type":"word"}}'

# Test document download
curl http://localhost:3000/api/onlyoffice/download?id=<DOC_ID> -o test.docx
```

## File References for Common Tasks

- **Add new AI model**: `src/lib/models/sdk.server.ts`
- **Add new task type**: `src/lib/services/task-scheduler.ts`
- **Modify memory structure**: `src/lib/services/memory-file.ts` + `MEMORY.md`
- **Add new office tool**: `src/app/api/office-ai/route.ts`
- **Modify system prompts**: `src/lib/config/system-prompt.ts`
- **Add new page**: Create in `src/app/`, add route if needed

## Integration Points for AI Assistant

When making improvements, the AI assistant should:

1. **Follow existing patterns**: Check similar files for code style
2. **Use TypeScript strictly**: No `any` types, proper interfaces
3. **Maintain database schema**: Use `sqlDatabase` methods from `src/lib/database/sqlite.ts`
4. **Log for self-improvement**: Send events to `/api/ai-log`
5. **Test endpoints**: Verify with curl before frontend changes
6. **Update docs**: Modify `PROJECT_STATUS.md` for significant changes
7. **Check model routing**: Use `src/lib/models/model-router.ts` for model selection

## Current State Summary

- **Working**: Chat, Writing, Office document generation/download, Memory, Tasks, Canvas
- **Broken**: ONLYOFFICE editor component has TypeScript errors
- **Needs work**: Telegram persistence, Authentication, Performance optimization
- **Running services**: Next.js dev server (3000), ONLYOFFICE (8080), Ollama (11434)