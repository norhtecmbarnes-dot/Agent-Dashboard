# AI Dashboard Features Documentation

## Table of Contents
- [Web Search](#web-search)
- [Tool Calling](#tool-calling)
- [Persistent Memory](#persistent-memory)
- [Reinforcement Learning](#reinforcement-learning)
- [Security Scanner](#security-scanner)

---

## Web Search

### Overview
Real-time web search using Ollama's official API with automatic fallback to browser-based search.

### Setup
1. Get API key from https://ollama.com/settings/keys
2. Add to `.env.local`:
```bash
OLLAMA_API_KEY=your-api-key
```

### Commands
| Command | Description |
|---------|-------------|
| `/search <query>` | Search the web (Ollama Cloud → Browser fallback) |
| `/web <query>` | Direct Ollama web search |

### API Endpoints
- Primary: `https://api.ollama.com/v1/web_search`
- Fallback: `https://ollama.com/api/web_search`

### Files
- `src/lib/browser/web-search-tool.ts` - Core implementation
- `docs/WEB-SEARCH.md` - Detailed documentation

---

## Tool Calling

### Overview
AI models can autonomously call tools during conversations. Supports GLM-5, GPT-4o, Claude, Gemini, Groq, Mistral, and Ollama.

### Available Tools

#### web_search
```typescript
{
  name: 'web_search',
  description: 'Search the web for real-time information',
  parameters: {
    query: string,          // Search query
    max_results: number,    // 1-10 (default: 5)
    freshness: 'day' | 'week' | 'month' | 'year'
  }
}
```

#### save_memory
```typescript
{
  name: 'save_memory',
  description: 'Save important information to persistent memory',
  parameters: {
    content: string,        // Information to save
    key: string,            // Short identifier
    category: 'user' | 'project' | 'brand' | 'decision' | 'knowledge' | 'security' | 'preference',
    importance: number      // 1-10 (default: 5)
  }
}
```

#### search_memory
```typescript
{
  name: 'search_memory',
  description: 'Search persistent memory for past information',
  parameters: {
    query: string,
    category: string        // Optional filter
  }
}
```

### How It Works
1. User sends message
2. AI receives tools in API request
3. AI decides if tool is needed
4. AI returns `tool_call` 
5. Server executes tool
6. Result returned to AI
7. AI incorporates into response

### Files
- `src/lib/models/sdk.server.ts` - Tool passing for all providers

---

## Persistent Memory

### Architecture
Three-layer memory system for context across sessions.

| Layer | Storage | Speed | Purpose |
|-------|---------|-------|---------|
| Scratchpad | JSON | ~1ms | Session-level, temporary |
| Persistent | SQLite + Vectors | ~50ms | Long-term, searchable |
| Archive | Markdown | ~100ms | Compressed, long-term |

### Categories
- `user` - User preferences and profile
- `project` - Project details and context
- `brand` - Brand guidelines and voice
- `decision` - Important decisions made
- `knowledge` - Facts and information
- `security` - Security-related memories
- `preference` - User preferences

### Memory Injection
Every chat message automatically:
1. Loads scratchpad memories
2. Searches persistent memories for relevance
3. Injects context into system prompt

### Files
- `src/lib/memory/scratchpad.ts` - Layer 1
- `src/lib/memory/persistent-store.ts` - Layer 2
- `src/lib/memory/memory-injector.ts` - Context injection
- `src/lib/memory/memory-archiver.ts` - Background archiving
- `data/memory/scratchpad.json` - Runtime data
- `data/memory/vectors.json` - Persistent storage

---

## Reinforcement Learning

### Overview
Lightweight OpenClaw-RL style training from normal conversations. The AI improves through feedback without manual labeling.

### Commands
| Command | Description |
|---------|-------------|
| `/feedback good <id>` | Mark response as good |
| `/feedback bad <id>` | Mark response as bad |
| `/feedback correction <id> <text>` | Provide better response |
| `/rl status` | View training stats |
| `/rl train` | Run training session now |

### How It Works

#### 1. Conversation Logging
Every conversation is logged with:
- User message
- AI response
- Model used
- Response time
- Tools called

#### 2. Auto-Scoring
Responses are automatically scored 0.0-1.0 using:
- Heuristic patterns (fast)
- LLM judge (complex cases)

#### 3. Hindsight Feedback
When user provides correction:
1. Extract "lesson learned"
2. Create training pair
3. Save to persistent memory

#### 4. Background Training
Every 30 minutes:
- Analyze recent conversations
- Identify low-score patterns
- Extract improvement rules
- Update memory

### Training Data Storage
```
data/rl-training/
├── conversations.json  # Recent conversations
├── training-pairs.json # Corrected examples
└── stats.json          # Training statistics
```

### Files
- `src/lib/agent/rl-trainer.ts` - Core RL logic
- `src/lib/agent/self-improvement.ts` - Integration
- `src/lib/services/task-scheduler.ts` - Background job

---

## Browser Automation (Agent-Browser)

### Overview
Control web browsers programmatically using the agent-browser CLI. Navigate, click, type, fill forms, and extract data.

### Prerequisites
```bash
npm install -g agent-browser
agent-browser install
```

### Commands (via AI Tool Calling)

| Action | Parameters | Description |
|--------|------------|-------------|
| `open` | `{url: string}` | Navigate to URL |
| `snapshot` | - | Get interactive elements with refs |
| `click` | `{ref: "@e1"}` | Click element by ref |
| `fill` | `{ref: "@e1", value: "text"}` | Fill input field |
| `type` | `{ref: "@e1", value: "text"}` | Type without clearing |
| `press` | `{key: "Enter"}` | Press key |
| `wait` | `{selector: "2000"}` | Wait for element or time |
| `get` | `{ref: "@e1"}` | Get element text |
| `close` | - | Close browser |

### Example Workflow

```
User: "Go to example.com, fill the search box with 'AI news', click search, and tell me the results"

AI:
1. Calls browser_automate: {"action": "open", "url": "https://example.com"}
2. Calls browser_automate: {"action": "snapshot"}
   → Returns: @e1: textbox "Search", @e2: button "Go"
3. Calls browser_automate: {"action": "fill", "ref": "@e1", "value": "AI news"}
4. Calls browser_automate: {"action": "click", "ref": "@e2"}
5. Calls browser_automate: {"action": "snapshot"}
6. Extracts results and summarizes for user
```

### Slash Commands

| Command | Description |
|---------|-------------|
| `/browse open <url>` | Open URL in browser |
| `/browse snapshot` | Get page elements |
| `/browse click @e1` | Click element |
| `/browse fill @e1 "text"` | Fill input |

### Files
- `src/lib/browser/agent-browser-service.ts` - Core service
- `src/lib/browser/search.ts` - Playwright search (fallback)
- `src/lib/browser/web-search-tool.ts` - Ollama web search

---

## De-AI-ify Writing Tool

### Overview
Remove AI-generated patterns and restore human voice. Based on analysis of 1,000+ AI vs human content pieces.

### Commands
| Command | Description |
|---------|-------------|
| `/de-ai-ify <text>` | Transform AI text to human voice |
| `/de-ai-ify <text> --preserve-formal` | Keep some formal language |
| `/de-ai-ify <text> --academic` | Preserve academic conventions |
| `/de-ai-ify <text> --analyze` | Just analyze, don't transform |
| `/de-ai-ify <text> --threshold 7` | Set target score (default: 8) |
| `/analyze <text>` | Quick AI detection analysis |

### What Gets Removed (47 patterns)

#### Overused Transitions (14)
- "Moreover," "Furthermore," "Additionally," "Nevertheless"
- "In conclusion," "To summarize"
- Excessive "However" usage

#### AI Cliches (18)
- "In today's fast-paced world"
- "Let's dive deep" / "Harness the power"
- "Unlock your potential" / "Game-changer"
- "Paradigm shift" / "Cutting-edge"

#### Hedging Language (8)
- "It's important to note"
- "It's worth mentioning"
- "One might argue"
- "Arguably" / "Potentially"

#### Corporate Buzzwords (12)
- utilize → use
- facilitate → help
- optimize → improve
- leverage → use
- synergize → work together

#### Robotic Patterns (9)
- Rhetorical questions with immediate answers
- Obsessive parallel structures
- Announcement of emphasis: "Importantly," "Crucially"

### Scoring System (0-10)
- **0-3:** Obviously AI-generated
- **4-5:** AI-heavy, needs work
- **6-7:** Mixed human/AI
- **8-9:** Human-like voice
- **10:** Indistinguishable from human

### Example

**Before (score: 3.8):**
> "In today's rapidly evolving digital landscape, it's crucial to understand that leveraging AI effectively isn't just about utilizing cutting-edge technology—it's about harnessing its transformative potential. Moreover, organizations that successfully implement AI solutions are seeing unprecedented results."

**After (score: 8.4):**
> "AI works best when you use it for specific tasks. Salesforce cut support tickets by 30% with Einstein AI. HubSpot's content assistant writes first drafts in 2 minutes. The pattern? They picked ONE job for AI and nailed it."

### Integration with Book Writer

The `/de-ai-ify` filter is **automatically applied** to all book chapters when `deaiifyEnabled: true` (default).

**Configure mode:**
- `strict` - Removes all AI patterns
- `preserve-formal` - Keeps formal language for business docs (default for books)
- `academic` - Preserves academic conventions

### Files
- `src/lib/writing/de-ai-ify.ts` - Core transformation logic
- `src/lib/agent/book-writer.ts` - Integrated for all chapters

---

## Security Scanner

### Overview
Snyk Agent-Scan style AI security scanner. Detects 15+ AI-specific vulnerabilities.

### Commands
| Command | Description |
|---------|-------------|
| `/security scan` | Full security audit |
| `/security quick` | Quick scan (stops at 3 critical) |
| `/security status` | Current security posture |

### Detection Categories

#### Critical (25 points each)
| Code | Issue |
|------|-------|
| E001 | Prompt Injection |
| E002 | Tool Shadowing |
| E003 | Tool Poisoning |
| E006 | Malware Payload |
| TF001 | Toxic Flow |

#### High (15 points each)
| Code | Issue |
|------|-------|
| E004 | Indirect Prompt Injection |
| E005 | Unrestricted Tool Access |
| TF002 | Credential Extraction |

#### Medium (5 points each)
| Code | Issue |
|------|-------|
| W007 | Hardcoded Secrets |
| W008 | Insecure Credential Handling |
| W009 | Excessive Permissions |
| W010 | Missing Input Validation |
| I011 | Untrusted Content |

#### Low (1 point each)
| Code | Issue |
|------|-------|
| I012 | Rug Pull Risk |
| I013 | Missing Rate Limiting |
| I014 | Insufficient Logging |

### Auto-Discovery Scans
```
src/lib/agent/      # Agent definitions
src/lib/tools/      # Tool definitions
src/lib/skills/     # Skills
src/lib/config/     # System prompts
src/lib/browser/    # Browser tools
src/lib/integrations/ # External integrations
src/app/api/        # API routes
data/memory/        # Persistent memory
data/rl-training/   # Training data
```

### Risk Score
- 0-20: Low (✓)
- 21-50: Medium (⚠️)
- 51-75: High (⚠️)
- 76-100: Critical (🔴)

### Output Example
```
## Security Scan Complete

**Risk Score:** 23/100 (Low) ✓
**Files Scanned:** 142
**Duration:** 2.34s

### Summary
- **Critical:** 0
- **High:** 2
- **Medium:** 3
- **Low:** 8

### High Issues (2)
1. **E003: Tool Poisoning Risk** - src/lib/tools/shell.ts:45
   Tool executes shell commands without whitelist
   **Remediation:** Add command whitelist validation.

2. **TF002: Credential Extraction** - src/lib/config/api.ts:12
   API keys logged in debug mode
   **Remediation:** Remove debug logging for sensitive data.
```

### Files
- `src/lib/security/ai-security-scanner.ts` - Scanner core
- `src/lib/agent/security-agent.ts` - Integration
- `data/security/scans.json` - Scan history

---

## Configuration

### Environment Variables
```bash
# Web Search
OLLAMA_API_KEY=your-key          # For Ollama Cloud search

# Model APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
GROQ_API_KEY=gsk_...
MISTRAL_API_KEY=...
OPENROUTER_API_KEY=sk-or-...
DEEPSEEK_API_KEY=...
GLM_API_KEY=...

# Optional
OLLAMA_API_URL=http://localhost:11434/api
```

### Task Scheduler
Background jobs defined in `src/lib/services/task-scheduler.ts`:

| Task | Interval | Description |
|------|----------|-------------|
| RL Training | 30 min | Learn from conversations |
| Security Scan | 12 hours | Vulnerability detection |
| Memory Archive | 24 hours | Compact old memories |
| Self-Reflection | 6 hours | Performance analysis |

---

## Testing

### Test Web Search
```
/search current Bitcoin price
/web latest React version
```

### Test Tool Calling
```
What's the weather in Tokyo?
Search for recent AI developments and save key findings to memory.
Remember that my project uses TypeScript.
```

### Test RL Training
```
/rl status
Give some feedback on a response...
/feedback good turn_1234567890_abc123
/rl train
```

### Test Security
```
/security scan
/security quick
/security status
```

---

## Architecture

```
User Message
     │
     ▼
┌─────────────────────┐
│   Chat API Route    │
└─────────────────────┘
     │
     ├── Memory Injection
     │   ├── Scratchpad (fast)
     │   └── Persistent (search)
     │
     ├── Tool Definitions
     │   ├── web_search
     │   ├── save_memory
     │   └── search_memory
     │
     ▼
┌─────────────────────┐
│   Model SDK         │
│   (GLM/GPT/Claude)  │
└─────────────────────┘
     │
     ├── Returns tool_call?
     │   │
     │   ▼
     │   Execute Tool
     │   │
     │   ▼
     │   Return to Model
     │
     ▼
Response + Conversation Log
     │
     ├── RL Trainer (scores response)
     │
     └── Memory Store (if save_memory)
```

---

## Director Dashboard (MiniMax H3)

### Overview

A film-director-style interface for generating AI video with synchronized audio from text prompts. Uses MiniMax H3 video model via ComfyUI, with an AI "Auteur" persona that writes scripts and designs shots.

### Features

| Feature | Description |
|---------|-------------|
| **Auteur AI** | Ollama-powered director persona that writes scripts, designs shots, and manages the creative pipeline |
| **Prototype/Final modes** | 4-step fast preview (turbo LoRA) vs. 30-step quality render |
| **Shot chaining** | Feed each shot's last frame into the next for seamless long-form video |
| **Character refs (ref2va)** | Up to 3 reference photos per shot for face/identity consistency. Use `<Picture 1>`–`<Picture 3>` tags in prompts |
| **Avatar Studio** | Three talking-head modes: Local (Qwen-Image + Wan InfiniteTalk), HeyGen (cloud), Duix Clone (offline) |
| **Duix Clone** | Fully offline digital human cloning from a training video. Fish-speech TTS + face2face lip-sync via Docker |
| **Shot Config drawer** | Full control over resolution, duration, steps, CFG, sampler, sigma shift, model filenames, LoRA |

### Routes

| Route | Purpose |
|-------|---------|
| `/minimax-h3` | Director Dashboard main page |
| `/book-writer` | Standalone book writer dashboard |

### API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/comfyui/*` | ComfyUI integration (queue, status, history, upload) |
| `/api/vocallab/*` | VocalLab TTS for avatar voices |
| `/api/duix/status` | Check Duix Docker stack availability |
| `/api/duix/clone` | Upload training video, extract audio, preprocess |
| `/api/duix/tts` | Synthesize cloned speech via fish-speech |
| `/api/duix/video` | Submit and poll Duix face2face lip-sync jobs |

### Files

| File | Role |
|------|------|
| `src/lib/comfyui/minimax-graph.ts` | ComfyUI workflow graph builder (text-to-video + ref2va) |
| `src/lib/director/auteur.ts` | Auteur AI persona and prompt engineering |
| `src/components/minimax-h3/AvatarPanel.tsx` | Avatar Studio with 3 modes |
| `src/components/minimax-h3/ClonePanel.tsx` | Duix Clone UI |
| `src/components/minimax-h3/CharacterRefSlots.tsx` | Character reference photo slots |
| `src/lib/duix/client.ts` | Duix HTTP client (TTS + video endpoints) |

### Documentation

- `docs/DIRECTOR-FOR-DUMMIES.md` — Full beginner-friendly guide (13 sections)
- `docs/BOOK-WRITING.md` — Complete writing pipeline documentation

---

## Book Writing System

### Overview

An AI-powered writing pipeline with three layers: autonomous book writer, interactive Writing Studio, and a de-AI-ification filter.

### Components

| Component | Description |
|-----------|-------------|
| **Book Writer Service** | Server-side singleton that writes a 20-chapter book one chapter at a time. SQLite-backed. Uses `glm-4-flash` with de-AI-ify post-processing. |
| **Book Writer Plugin** | Client-side book writer for Writing Studio's Book Panel. localStorage-backed. 21 chapters focused on on-premise deployment. |
| **Writing Studio** | Full interactive writing editor at `/writing-studio` with AI actions, streaming, outline generator, research chat, brand voice, templates, version history, Mermaid diagrams, and DOCX/PDF export. |
| **De-AI-ify Filter** | 47-pattern deterministic filter that removes AI clichés, transitions, hedging, buzzwords, and robotic patterns. Scores text 0-10 on human-likeness. |
| **Editor Review** | Tracked-changes system with AI-generated reasons for each edit. Accept/reject UI. |

### Files

| File | Role |
|------|------|
| `src/lib/agent/book-writer.ts` | Server-side book writer (SQLite) |
| `src/plugins/book-writer/index.ts` | Client-side book writer plugin (localStorage) |
| `src/lib/writing/de-ai-ify.ts` | De-AI-ification filter (47 patterns) |
| `src/app/writing-studio/page.tsx` | Writing Studio interactive editor |
| `src/app/api/writing/route.ts` | 25+ writing actions (non-streaming) |
| `src/app/api/writing/stream/route.ts` | SSE streaming writing actions |
| `src/app/api/writing/export/route.ts` | DOCX/PDF export |
| `src/app/api/book-writer/route.ts` | Autonomous book writer control |
| `src/app/api/editor-review/route.ts` | Tracked changes review |

### Documentation

- `docs/BOOK-WRITING.md` — Complete documentation of the writing pipeline

---

## Changelog

### 2026-03-03
- Added Ollama web search integration
- Implemented tool calling for all model providers
- Created RL training system from conversations
- Built AI security scanner (15+ vulnerabilities)
- Added `/feedback`, `/rl`, `/security` commands
- Created comprehensive documentation

### 2026-08-09
- Added character reference slots (ref2va) with up to 3 photos and Refs ON/OFF toggle
- Added Duix.Avatar clone integration as 3rd avatar mode (offline, Docker-based)
- Added ffmpeg-static dependency for audio extraction
- Created BOOK-WRITING.md documentation for the full writing pipeline
- Updated DIRECTOR-FOR-DUMMIES.md with character refs, Duix Clone, and 3-mode avatar table