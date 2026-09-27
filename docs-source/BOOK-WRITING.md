# Book Writing & Writing Studio Guide

The PersonalAI Dashboard has a full AI-powered writing pipeline. This document covers every layer: the autonomous book writer, the interactive Writing Studio, the de-AI-ification filter, the editor-review tracked-changes system, and the API endpoints that tie them together.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Book Writer Service (Autonomous)](#2-book-writer-service-autonomous)
3. [Book Writer Plugin (Client-Side)](#3-book-writer-plugin-client-side)
4. [Writing Studio (Interactive Editor)](#4-writing-studio-interactive-editor)
5. [De-AI-ification Filter](#5-de-ai-ification-filter)
6. [Editor Review (Tracked Changes)](#6-editor-review-tracked-changes)
7. [Writing API Endpoints](#7-writing-api-endpoints)
8. [Export Pipeline](#8-export-pipeline)
9. [Configuration](#9-configuration)
10. [File Map](#10-file-map)

---

## 1. Architecture Overview

The writing system has three independent layers that can be used separately or together:

```
┌─────────────────────────────────────────────────────────┐
│                    WRITING STUDIO                        │
│  (Interactive rich-text editor at /writing-studio)       │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │
│  │ Editor   │  │ Book     │  │ Research Chat        │   │
│  │ (Manu-   │  │ Panel    │  │ (web-search-backed)  │   │
│  │ scriptEd)│  │ (chapters)│ │                      │   │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘   │
│       │             │                    │               │
│       ▼             ▼                    ▼               │
│  ┌─────────────────────────────────────────────────┐    │
│  │          AI Actions Toolbar                       │    │
│  │  Expand · Outline · Rewrite · Simplify ·          │    │
│  │  Humanize · Grammar · Diagram · Table · Linguix    │    │
│  └────────────────────┬────────────────────────────┘    │
│                       │                                  │
├───────────────────────┼──────────────────────────────────┤
│                       ▼                                  │
│           /api/writing/stream  (SSE streaming)           │
│           /api/writing        (non-streaming)            │
│           /api/book-writer    (autonomous)                │
│           /api/editor-review  (tracked changes)          │
├─────────────────────────────────────────────────────────┤
│                       ▼                                  │
│              chatCompletion / streamChatCompletion       │
│              (Ollama · OpenRouter · GLM · DeepSeek)     │
├─────────────────────────────────────────────────────────┤
│                       ▼                                  │
│              De-AI-ification Filter (de-ai-ify.ts)      │
│              47 patterns across 5 categories            │
│              Scoring: 0-10 human-likeness score          │
└─────────────────────────────────────────────────────────┘
```

| Layer | Purpose | Storage | Runtime |
|-------|---------|---------|---------|
| **Book Writer Service** | Autonomous chapter-by-chapter book generation | SQLite (`book_writer_progress` table) | Server-side only |
| **Book Writer Plugin** | Client-side book state for Writing Studio | `localStorage` | Browser only |
| **Writing Studio** | Interactive document editor with AI actions | `localStorage` + brand workspace | Client + streaming API |
| **De-AI-ify** | Post-processing filter that removes AI patterns | Stateless | Either side |
| **Editor Review** | Tracked-changes review with accept/reject | Per-request | Server-side |

---

## 2. Book Writer Service (Autonomous)

**File:** `src/lib/agent/book-writer.ts`
**API Route:** `src/app/api/book-writer/route.ts`
**UI:** `src/app/book-writer/page.tsx`

The Book Writer Service is a singleton that writes a book one chapter at a time. It is designed to run autonomously — the heartbeat agent (see `/bookwriter` command) can trigger it every 2 hours to scan repo changes and write/update chapters.

### Book Metadata

| Field | Value |
|-------|-------|
| Title | "Building Your Own Director's Dashboard: Creating Your Own Free Custom Video Generation Tools From Scratch" |
| Subtitle | Creating Your Own Free Custom Video Generation Tools From Scratch |
| Series | Part of the "Building Your Own AI Dashboard" series |
| Subtitle | "From Zero to Enterprise-Grade AI — On Your Own Server" |
| Author | Michael C. Barnes |
| License | CC BY-SA 4.0 (text) + MIT (code) |
| Dedication | To Randolph (Randy) Hill, Founder & CTO of GovBotics |
| Model | `glm-4-flash` (server) / `glm-4.7-flash` (node variant) |

### Chapter Outline (20 chapters)

| # | Title | Word Target |
|---|-------|-------------|
| 1 | Introduction - Your Journey Starts Here | 3,000–4,500 |
| 2 | What is an API? (The Foundation) | 3,000–4,000 |
| 3 | What is a Container? (Docker Explained Simply) | 2,500–3,500 |
| 4 | Setting Up Your Computer - Step by Step | 2,500–3,500 |
| 5 | What is Programming? (Learning to Give Instructions) | 5,000–6,000 |
| 6 | What is a Database? (Storing Information) | 3,000–4,000 |
| 7 | Understanding the Project Structure | 2,500–3,500 |
| 8 | Prompt Templates - How to Talk to AI Tools | 3,000–4,500 |
| 9 | Getting Your First Chat Working | 2,500–3,500 |
| 10 | Adding Document Upload Features | 2,500–3,500 |
| 11 | Creating Your Brand Voice System | 2,500–3,500 |
| 12 | Building Intelligence Reports | 2,500–3,500 |
| 13 | Adding Self-Reflection - Your AI Checks Itself | 2,500–3,500 |
| 14 | Security Scanning and Problem Detection | 2,500–3,500 |
| 15 | Connecting to Outside Services | 2,500–3,500 |
| 16 | Docker and Containers - Running Services Safely | 2,500–3,500 |
| 17 | Using OpenCode and AI Development Tools | 2,500–3,500 |
| 18 | Customizing the Prompts for YOUR Needs | 2,500–3,500 |
| 19 | Troubleshooting - When Things Go Wrong | 2,500–3,500 |
| 20 | Appendix: Complete Prompt Library | 2,500–3,500 |

Chapters 1-8 have hand-crafted detailed prompts with analogies, required sections, and specific word counts. Chapters 9-20 use a generic prompt builder with topic-specific guidance.

### Writing Pipeline

```
writeChapter(n)
  ├─ Set chapter status → "writing"
  ├─ Generate content via chatCompletion (system prompt + chapter prompt)
  │   ├─ System prompt: getGlobalBookInstructions() — writing rules, style, structure
  │   └─ User prompt: chapter-specific prompt (analogies, sections, word count)
  ├─ If deaiifyEnabled:
  │   ├─ deaiify(content, mode) → revised text + human score
  │   └─ Log: original score → revised score, change counts
  ├─ Set chapter content, status → "completed", humanScore
  ├─ Update totalWords across all chapters
  ├─ Advance currentChapter or mark book "completed"
  └─ Save to SQLite
```

### Global Book Instructions

The system prompt enforces:
- Target audience: complete beginners, no prior coding knowledge
- Human writing style: contractions, direct language, varied sentence length
- No AI clichés ("harness the power", "game-changer", "In today's fast-paced world")
- No formal transitions ("Moreover", "Furthermore", "Additionally")
- Every technical term defined on first use (bold + analogy + why it matters)
- Mandatory chapter structure: opening → "What You'll Learn" → explanations → step-by-step → "Try It Yourself" (3+ boxes) → "Personalize" → "Common Pitfalls" → Summary
- Every chapter ends with: "You now hold real enterprise-grade AI power in your hands..."

### De-AI-ification Modes

The book writer defaults to `preserve-formal` mode. Three modes are available:

| Mode | Behavior |
|------|----------|
| `strict` | All 47 patterns applied. Removes all formal transitions. |
| `preserve-formal` | Keeps some formal transitions, removes obvious hedging only. **Default.** |
| `academic` | Preserves academic transitions (Moreover, Furthermore, etc.). |

### Storage

Progress is stored in SQLite via `sqlDatabase.getSetting('book_progress')` / `setSetting(...)`. The SQLite schema includes a `book_writer_progress` table (see `src/lib/database/sqlite.ts:925`).

### Node.js Variant

`src/lib/agent/book-writer-node.ts` is a file-system-based variant that stores progress in `data/book_progress.json` instead of SQLite. It also reads `data/PROJECT_OVERVIEW_BOOK_PROMPT.md` as the project context file. This variant uses `glm-4.7-flash` and includes `sanitizePrompt` on all user-facing text. The SQLite version (`book-writer.ts`) is the active one used by the API route.

---

## 3. Book Writer Plugin (Client-Side)

**File:** `src/plugins/book-writer/index.ts`

A separate singleton that runs in the browser and stores progress in `localStorage`. This is the version used by Writing Studio's Book Panel.

### Key Differences from Server Service

| Aspect | Server Service | Client Plugin |
|--------|----------------|---------------|
| Storage | SQLite | localStorage |
| Model | `glm-4-flash` | `ollama/qwen3.5:9b` (default) |
| De-AI-ify | Yes (integrated) | No |
| Chapters | 20 (beginner guide) | 21 (on-premise focus) |
| Content generation | Direct `chatCompletion` | `/api/chat` endpoint |
| Regenerate | Not supported | Supported (`regenerateChapter`) |
| Manual edit | Not supported | Supported (`updateChapterContent`) |

### Plugin Chapter Outline (21 chapters)

The plugin version has a different outline focused on on-premise/enterprise deployment:

1. Introduction - Why Build Your Own AI
2. The Stack That Costs Nothing
3. Understanding the Architecture
4. Setting Up Your Development Environment
5. Building the Chat Interface
6. Connecting to AI Models
7. Adding Memory with Vector Storage
8. The Power of Tools
9. Working with Documents
10. Brand Voice - NotebookLM Style
11. Tool Efficiency - Making AI Work Better
12. Adding External Integrations
13. Storing Data Persistence with SQLite
14. Deploying Your Assistant
15. Extending and Customizing
16. On-Premise Deployment for Organizations
17. Troubleshooting Common Issues
18. What's Next - The Future of AI Assistants
19. Appendix A: OpenCode - Building This Book
20. Appendix B: Comparison with OpenClaw
21. Appendix C: Quick Reference

### Plugin API

```typescript
bookWriterPlugin.initializeBook(): BookProgress
bookWriterPlugin.getProgress(): BookProgress | null
bookWriterPlugin.writeChapter(chapterNumber, model?): Promise<BookChapter | null>
bookWriterPlugin.writeNextChapter(model?): Promise<BookChapter | null>
bookWriterPlugin.regenerateChapter(chapterNumber, model?): Promise<BookChapter | null>
bookWriterPlugin.updateChapterContent(chapterNumber, content): BookChapter | null
bookWriterPlugin.updateChapterStatus(chapterNumber, status): BookChapter | null
bookWriterPlugin.getFullBook(): string  // Markdown export
bookWriterPlugin.shouldContinueWriting(): boolean
bookWriterPlugin.getNextChapterNumber(): number
```

---

## 4. Writing Studio (Interactive Editor)

**File:** `src/app/writing-studio/page.tsx`
**Route:** `/writing-studio` (also `/writing` redirects here)

Writing Studio is a full-featured writing environment with a rich-text editor, AI actions, book panel, research chat, outline generator, templates, version history, and chapter navigation.

### Features

| Feature | Description |
|---------|-------------|
| **ManuscriptEditor** | Rich-text contenteditable editor with title, font settings, dark/light theme |
| **AI Actions Toolbar** | 9 one-click AI transformations on selected text |
| **Book Panel** | Side panel showing book chapters; click to load chapter content into editor |
| **Outline Generator** | Generate hierarchical outlines from a topic (essay, blog, article, report, general) |
| **Research Chat** | Web-search-enabled chat panel for research while writing |
| **Brand Voice** | Select a brand workspace to apply brand voice to AI-generated content |
| **Templates** | Pre-built document templates (blog, proposal, etc.) |
| **Version History** | Auto-saves versions every 5 minutes, keeps last 20 |
| **Chapter Navigation** | Extracts H1/H2/H3 headings from content for quick navigation |
| **Mermaid Diagrams** | Generate Mermaid.js diagrams from selected text, rendered inline |
| **Tables** | Generate markdown tables from selected text, converted to HTML |
| **Linguix Grammar** | External grammar check via Linguix API |
| **Model Selector** | Uses global model context for AI actions |

### AI Actions

| Action | Icon | What It Does |
|--------|------|-------------|
| Expand | 📄 | Make text 2-3x longer with more detail and examples |
| Outline | 📋 | Create hierarchical markdown outline from content/topic |
| Rewrite | 🔄 | Rewrite in a specified style |
| Simplify | 💡 | Simplify complex text for general audience |
| Humanize | ✨ | Add perplexity and burstiness to sound more human |
| Grammar | ✓ | Fix grammar, spelling, and logical flow |
| Linguix | 📝 | External grammar check via Linguix API |
| Diagram | 📊 | Generate Mermaid.js flowchart from selected text |
| Table | 📱 | Generate markdown table from selected text |

### Streaming Pipeline

AI actions use Server-Sent Events (SSE) streaming via `/api/writing/stream`:

```
Client selects text → clicks AI action
  → POST /api/writing/stream { action, text, brandId, model }
  → Server builds prompt, calls streamChatCompletion
  → SSE chunks: data: { "content": "..." }\n\n
  → Client accumulates chunks, shows real-time text in editor
  → On done: convert markdown → HTML, replace selection
  → Sync content back to React state
```

For Ollama models, true streaming is used (chunk-by-chunk). For external APIs (OpenRouter, GLM, DeepSeek) that return complete responses, the server simulates streaming by sending the content in 20-character chunks.

### Persistence

| What | Where | When |
|------|-------|------|
| Document content + title | `localStorage('writing_studio_doc')` | On every content/title change |
| Settings (font, size, save dir) | `localStorage('writing_studio_settings')` | On settings change |
| Version history (last 20) | `localStorage('writing_studio_versions')` | Every 5 minutes |
| Book progress | `localStorage('book_progress')` (plugin) | On chapter write |

Content is also saved on `visibilitychange` (tab hidden) and `beforeunload` (page close).

---

## 5. De-AI-ification Filter

**File:** `src/lib/writing/de-ai-ify.ts`

A deterministic text transformation that removes AI-generated patterns and restores natural human voice. Based on analysis of 1,000+ AI vs human content pieces.

### 47 Detection Patterns (5 categories)

| Category | Count | Examples |
|----------|-------|---------|
| Overused transitions | 11 | "Moreover," "Furthermore," "In conclusion," "In today's landscape" |
| AI clichés | 18 | "harness the power," "unlock potential," "game-changer," "cutting-edge" |
| Hedging language | 13 | "It's important to note," "One might argue," "Importantly," |
| Corporate buzzwords | 22 | "utilize"→"use", "leverage"→"use", "facilitate"→"help", "optimize"→"improve" |
| Vague quantifiers | 9 | "various"→remove, "numerous"→"many", "plethora of"→"many", "arguably"→remove |

### Scoring System (0-10)

The `calculateHumanScore()` function evaluates text on 8 dimensions:

| Factor | Penalty/Bonus | Threshold |
|--------|---------------|-----------|
| AI patterns per 1000 words | -1 to -3 | >5, >10, >20 patterns |
| Sentence length variance (CV) | -0.5 to -1.5 | CV < 0.3, < 0.2 (too uniform = AI) |
| Average sentence length | -0.5 to -1 | > 25, > 30 words |
| Hedging phrase count | -0.5 to -1.5 | > 1, > 3 occurrences |
| Passive voice indicators | -0.5 to -1 | > 2, > 5 matches |
| Contraction ratio | -0.5 to +0.5 | < 0.5 (too few), > 2 (natural) |
| Specific numbers/data | +0.5 | > 3 occurrences |
| First person usage | +0.3 | > 3 occurrences |

Score labels:

| Score | Label |
|-------|-------|
| 9-10 | Human-like |
| 8-9 | Natural voice |
| 7-8 | Good, minor refinements needed |
| 6-7 | Mixed - could be human or AI |
| 4-6 | AI-heavy - needs work |
| 2-4 | Obviously AI-generated |
| 0-2 | Robotic |

### Transformation Pipeline

```
deaiify(text, mode, options)
  ├─ Calculate original score
  ├─ Select patterns based on mode (strict/preserve-formal/academic)
  ├─ Apply regex replacements (transitions, clichés, hedging, buzzwords, vague quantifiers)
  ├─ fixRoboticPatterns():
  │   ├─ Replace 3rd+ "However" with "But"
  │   ├─ Fix excessive "While X, Y" openings
  │   ├─ Fix rhetorical question → answer patterns
  │   └─ Fix "Here are the top N ways" prefacing
  ├─ addNaturalVoice():
  │   ├─ Add contractions ("it is"→"it's", 30+ patterns)
  │   ├─ Convert passive → active voice (10 patterns)
  │   └─ Shorten sentences > 40 words at natural break points
  ├─ Clean up whitespace, capitalize sentence starts
  ├─ Calculate revised score
  ├─ identifyFlagsForReview() — flags remaining issues for manual review
  └─ Return DeAiResult { originalText, revisedText, originalScore, revisedScore, changes, flagsForReview }
```

### ChangeLog Output

```typescript
interface ChangeLog {
  transitionsRemoved: number;
  clichesRemoved: number;
  hedgingRemoved: number;
  buzzwordsReplaced: number;
  roboticPatternsFixed: number;
  examplesAdded: number;
  sentencesShortened: number;
  contractionsAdded: number;
  activeVoiceUsed: number;
}
```

### Flags for Review

After transformation, the filter flags remaining issues:
- Still uses "various" — suggests specific examples
- Still uses "numerous" — suggests specific count
- Unqualified claims ("significantly improved") — add data
- Vague references ("many companies") — use specific names
- Abrupt transitions between sentences with no word overlap

### Usage

```typescript
import { deaiify, analyzeText, formatDeAiResult, DeAiMode } from '@/lib/writing/de-ai-ify';

// Full transformation
const result = deaiify(text, 'preserve-formal');
console.log(result.revisedText);
console.log(result.revisedScore);  // 0-10
console.log(result.changes.transitionsRemoved);

// Quick analysis (no transformation)
const analysis = analyzeText(text);
console.log(analysis.score, analysis.issues, analysis.suggestions);

// Format for display
const formatted = formatDeAiResult(result);  // Markdown report
```

---

## 6. Editor Review (Tracked Changes)

**File:** `src/app/api/editor-review/route.ts`

A server-side endpoint that produces tracked-changes review of text, with AI-generated reasons for each change. Integrates with the book writer — if no text is provided, it can pull the next unwritten chapter from the book writer service.

### ReviewChange Structure

```typescript
interface ReviewChange {
  id: string;
  type: 'insert' | 'delete' | 'format';
  status: 'pending' | 'accepted' | 'rejected';
  author: 'ai' | 'user';
  authorColor: string;  // Purple for AI, blue for user, etc.
  position: number;
  positionEnd: number;
  originalText: string;
  newText: string;
  timestamp: number;
  reason: string;  // AI-generated 1-sentence explanation
}
```

### Pipeline

```
POST /api/editor-review { text, action, brandVoice, documentType }
  ├─ If no text: pull next chapter from bookWriterService
  ├─ Generate revised version via chatCompletion
  ├─ Diff original vs revised
  ├─ For each change: ask AI to explain in one sentence (max 15 words)
  ├─ Return changes array with positions, texts, and reasons
  └─ Client renders accept/reject UI
```

### Reviewer Colors

| Role | Color |
|------|-------|
| AI | `#9333ea` (purple) |
| User | `#3b82f6` (blue) |
| Reviewer 1 | `#10b981` (green) |
| Reviewer 2 | `#f59e0b` (amber) |
| Reviewer 3 | `#ef4444` (red) |

---

## 7. Writing API Endpoints

### `/api/writing` (non-streaming)

**File:** `src/app/api/writing/route.ts`

Handles 25+ writing actions. Returns complete JSON response.

#### Actions

| Category | Actions |
|----------|---------|
| **Core writing** | expand, outline, continue, rewrite, simplify, elaborate, structure |
| **Quality** | grammar, humanize, review, track_changes |
| **Business** | proposal, sbir, capture_plan, deadline_finder, evaluation_factors, compliance_matrix, proposal_outline, past_performance, risk_identification |
| **Content** | blog_post, social_media, ad_copy, product_description, email_template |
| **Visual** | diagram (Mermaid.js) |
| **Advanced** | delegate (uses model bus for hierarchical model selection) |

#### Request Format

```json
{
  "action": "expand",
  "text": "Text to transform",
  "style": "professional",
  "model": "ollama/llama3.2:latest",
  "stream": false,
  "brandId": "optional-brand-uuid",
  "projectId": "optional-project-uuid"
}
```

#### Special Actions

- **track_changes**: Returns JSON array of changes with original/edited/reason. Client applies accepted changes to produce improved text.
- **review**: Returns 3-10 specific suggestions with location, issue, suggestion, and reason.
- **delegate**: Uses the model bus to escalate writing tasks to better models when needed (cloud-smart tier preferred).
- **diagram**: Returns Mermaid.js code block for rendering as SVG.

#### Context Injection

All actions can receive:
1. **Memory context** — from `memoryFileService.getSystemPrompt()` (max 800 chars)
2. **Brand context** — from `brandWorkspace.buildContextForChat(brandId, projectId)` (max 2000 chars)

These are prepended to the system message.

---

### `/api/writing/stream` (SSE streaming)

**File:** `src/app/api/writing/stream/route.ts`

Same writing actions but with Server-Sent Events streaming. Used by Writing Studio for real-time text generation.

#### Supported Actions

expand, outline, continue, rewrite, simplify, elaborate, structure, humanize, grammar

(Defaults to expand for unknown actions.)

#### SSE Format

```
data: {"content":"chunk of text"}\n\n
data: {"content":"more text"}\n\n
data: [DONE]\n\n
```

#### Streaming Behavior

- **Ollama**: True token-by-token streaming via `streamChatCompletion`
- **External APIs** (OpenRouter, GLM, DeepSeek): Complete response is chunked into 20-char segments and sent as SSE for simulated streaming

---

### `/api/book-writer`

**File:** `src/app/api/book-writer/route.ts`

| Method | Action | Description |
|--------|--------|-------------|
| GET | — | Get progress, canContinue, nextChapter |
| POST | `init` | Initialize new book, reset progress |
| POST | `writeNext` | Write the next pending chapter |
| POST | `writeChapter` | Write a specific chapter by number |
| POST | `fullBook` | Get complete book as Markdown string |

---

### `/api/editor-review`

**File:** `src/app/api/editor-review/route.ts`

POST with `{ text, action, brandVoice, documentType }` → returns tracked changes array. If no text provided, uses book writer to get next chapter.

---

### `/api/writing/export`

**File:** `src/app/api/writing/export/route.ts`

POST with `{ content, title, format }`:

| Format | Output |
|--------|--------|
| `docx` | Word document via `docx` library, with H1/H2/H3 heading levels |
| `pdf` | Text-based PDF (simple, not pdfkit) |

---

## 8. Export Pipeline

### Markdown Export (Book Writer)

Both the server service and client plugin have `getFullBook()` which assembles all chapters into a single Markdown string:

```markdown
# Book Title

## Subtitle

*By Author*

---

**Dedication:** ...

**Credits:** ...

---

Description text.

*GovBotics note*

---

## Chapter 1: Title

Chapter content...

---

## Chapter 2: Title

...
```

The `/book-writer` UI page has an "Export Document (Markdown)" button that triggers a client-side Blob download.

### DOCX Export

The `/api/writing/export` endpoint uses the `docx` npm library to create properly formatted Word documents with:
- Title (centered, HeadingLevel.TITLE)
- H1 → HeadingLevel.HEADING_1
- H2 → HeadingLevel.HEADING_2
- H3 → HeadingLevel.HEADING_3
- Body text → 12pt TextRun

---

## 9. Configuration

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama API URL for model calls |

### Model Selection

| Context | Default Model |
|---------|---------------|
| Writing Studio AI actions | Global model context (user-selected) |
| Writing Studio fallback | `ollama/llama3.2:latest` |
| Book Writer (server) | `glm-4-flash` |
| Book Writer (node) | `glm-4.7-flash` |
| Book Writer Plugin | `ollama/qwen3.5:9b` |
| Editor Review reason generation | `llama3.2:latest` |

### De-AI-ify Configuration

```typescript
// In BookProgress:
deaiifyEnabled: true;          // Default: on
deaiifyMode: 'preserve-formal'; // strict | preserve-formal | academic

// Can be changed at runtime:
bookWriterService.setDeAiMode(true, 'strict');
```

### Plugin Registration

The book writer is registered as a plugin in `src/config/plugins.ts`:

```typescript
'book-writer': {
  id: 'book-writer',
  route: '/book-writer',
  // ...
}
```

### SQLite Schema

```sql
CREATE TABLE IF NOT EXISTS book_writer_progress (
  -- Uses the generic settings key-value store
  -- Key: 'book_progress'
  -- Value: JSON string of BookProgress
);
```

---

## 10. File Map

### Core Writing System

| File | Role |
|------|------|
| `src/lib/agent/book-writer.ts` | Server-side autonomous book writer (SQLite-backed) |
| `src/lib/agent/book-writer-node.ts` | Node.js variant (file-system-backed, unused by API) |
| `src/plugins/book-writer/index.ts` | Client-side book writer plugin (localStorage) |
| `src/lib/writing/de-ai-ify.ts` | De-AI-ification filter (47 patterns, scoring, transformation) |

### API Routes

| File | Endpoint |
|------|----------|
| `src/app/api/writing/route.ts` | `/api/writing` — 25+ non-streaming writing actions |
| `src/app/api/writing/stream/route.ts` | `/api/writing/stream` — SSE streaming writing actions |
| `src/app/api/writing/export/route.ts` | `/api/writing/export` — DOCX/PDF export |
| `src/app/api/book-writer/route.ts` | `/api/book-writer` — Autonomous book writer control |
| `src/app/api/editor-review/route.ts` | `/api/editor-review` — Tracked changes review |

### UI Pages

| File | Route |
|------|-------|
| `src/app/writing-studio/page.tsx` | `/writing-studio` — Main interactive editor |
| `src/app/writing/page.tsx` | `/writing` — Redirects to `/writing-studio` |
| `src/app/book-writer/page.tsx` | `/book-writer` — Standalone book writer dashboard |

### Components

| File | Role |
|------|------|
| `src/components/ManuscriptEditor.tsx` | Rich-text contenteditable editor component |

### Configuration

| File | Role |
|------|------|
| `src/config/plugins.ts` | Plugin registration (includes book-writer) |
| `src/lib/database/sqlite.ts` | SQLite schema (includes book_writer_progress) |

### Supporting Services

| File | Role |
|------|------|
| `src/lib/models/sdk.server.ts` | `chatCompletion` and `streamChatCompletion` — model abstraction |
| `src/lib/services/memory-file.ts` | Memory file service for context injection |
| `src/lib/services/brand-workspace.ts` | Brand voice workspace for brand context |
| `src/lib/services/model-bus.ts` | Model bus for hierarchical delegation |
| `src/lib/services/self-improvement.ts` | References book_writer in feature tracking |
| `src/lib/services/code-health.ts` | Tracks book-writer route usage |
| `src/lib/utils/validation.ts` | `sanitizePrompt` for input sanitization |

---

## Quick Start

### Write a book autonomously

1. Open `/book-writer` in the dashboard
2. Click "Start New Document" — initializes 20-chapter outline
3. Click "Add New Section" — writes the next pending chapter
4. Click any section in the list to view its content
5. Click "Export Document (Markdown)" to download the full book

### Use Writing Studio interactively

1. Open `/writing-studio`
2. Type or paste content into the editor
3. Select text and click an AI action (Expand, Simplify, Humanize, etc.)
4. Watch the AI write in real-time via SSE streaming
5. Toggle the Book Panel (📚) to load book chapters into the editor
6. Toggle the Outline Generator (📝) to create outlines from topics
7. Toggle the Research Chat (💬) for web-search-backed research

### Run the book writer via API

```bash
# Initialize
curl -X POST http://localhost:3000/api/book-writer \
  -H "Content-Type: application/json" \
  -d '{"action":"init"}'

# Write next chapter
curl -X POST http://localhost:3000/api/book-writer \
  -H "Content-Type: application/json" \
  -d '{"action":"writeNext"}'

# Get full book
curl -X POST http://localhost:3000/api/book-writer \
  -H "Content-Type: application/json" \
  -d '{"action":"fullBook"}'

# Check progress
curl http://localhost:3000/api/book-writer
```

### Apply de-AI-ification to any text

```typescript
import { deaiify } from '@/lib/writing/de-ai-ify';

const result = deaiify(aiGeneratedText, 'preserve-formal');
console.log(`Score: ${result.originalScore.toFixed(1)} → ${result.revisedScore.toFixed(1)}`);
console.log(`Changes:`, result.changes);
console.log(result.revisedText);
```