# API Reference

**Version:** 2.0.0  
**Base URL:** `http://localhost:3000/api`

---

## Table of Contents

- [Authentication](#authentication)
- [Chat](#chat)
- [Writing Assistant](#writing-assistant)
- [Documents](#documents)
- [ONLYOFFICE](#onlyoffice)
- [Telegram](#telegram)
- [Models](#models)
- [Tasks](#tasks)
- [Memory](#memory)
- [Health](#health)

---

## Authentication

All endpoints are open by default. Enable authentication with `ENABLE_AUTH=true`.

### POST /api/auth/login

Authenticate and get session token.

```typescript
// Request
{
  "username": "admin",
  "password": "your-password"
}

// Response
{
  "success": true,
  "token": "abc123...",
  "user": {
    "username": "admin",
    "role": "admin",
    "createdAt": 1234567890000
  }
}
```

### POST /api/auth/logout

Invalidate current session.

```typescript
// Headers
Authorization: Bearer <token>

// Response
{ "success": true }
```

---

## Chat

### POST /api/chat

Non-streaming chat completion.

```typescript
// Request
{
  "message": "What is machine learning?",
  "model": "glm-4.7-flash",
  "conversationHistory": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ],
  "useVectorLake": true,      // Optional: use semantic cache
  "userName": "Michael",       // Optional: personalize
  "assistantName": "AI"         // Optional: customize name
}

// Response
{
  "message": "Machine learning is...",
  "done": true,
  "vectorLakeUsed": true,
  "vectorLakeData": {
    "cached": true,
    "searchTerms": ["machine", "learning"]
  }
}
```

**Status Codes:**
- 200: Success
- 400: Validation error
- 500: AI model error

### POST /api/chat/stream

Streaming chat completion (SSE).

```typescript
// Request (same as /api/chat)
{
  "message": "Tell me a story",
  "model": "glm-4.7-flash",
  "searchMode": false  // Optional: include web search
}

// Response (Server-Sent Events)
data: {"chunk": "Once", "done": false}
data: {"chunk": " upon", "done": false}
data: {"chunk": " a", "done": false}
...
data: {"done": true}
```

### Special Commands

The chat API supports special commands:

```typescript
// Web Search
{ "message": "/search latest AI news" }

// Memory Search
{ "message": "/memory project details" }

// SAM.gov Opportunities
{ "message": "/sam cybersecurity contracts" }

// Math Calculation
{ "message": "/math (25 * 4) + 100" }

// Visualization
{ "message": "/visualize bar chart of expenses" }
```

---

## Writing Assistant

### POST /api/writing

AI-powered writing assistance.

```typescript
// Request
{
  "action": "expand",
  "text": "The AI assistant helps productivity.",
  "model": "glm-4.7-flash"  // Optional
}

// Actions
// - expand: Expand text 2-3x with examples and detail
// - outline: Create hierarchical outline
// - continue: Continue writing from where text ends
// - rewrite: Rewrite in different style
// - simplify: Simplify for general audience
// - elaborate: Add comprehensive elaboration
// - structure: Organize with headers and bullets

// Response
{
  "success": true,
  "action": "expand",
  "result": "The AI assistant helps productivity...",
  "model": "glm-4.7-flash"
}
```

### GET /api/writing

Get available actions.

```typescript
// Response
{
  "actions": [
    { "name": "expand", "description": "Expand text...", "parameters": ["text"] },
    { "name": "outline", "description": "Create outline...", "parameters": ["text"] },
    // ...
  ],
  "usage": "POST with { action, text, model }"
}
```

---

## Documents

### POST /api/documents/generate

Generate Office-compatible documents.

```typescript
// Word Document
{
  "title": "Report",
  "type": "word",
  "content": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]
}

// Excel Spreadsheet
{
  "title": "Budget",
  "type": "cell",
  "headers": ["Item", "Cost", "Date"],
  "rows": [
    ["Coffee", "$5", "2024-01-01"],
    ["Tea", "$3", "2024-01-02"]
  ]
}

// PowerPoint Presentation
{
  "title": "Pitch Deck",
  "type": "slide",
  "slides": [
    { "title": "Introduction", "bulletPoints": ["Point 1", "Point 2"] },
    { "title": "Problem", "bulletPoints": ["It hurts", "We solve it"] }
  ]
}

// Response: Binary file download
// Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
// Content-Disposition: attachment; filename="Report.docx"
```

---

## ONLYOFFICE

### GET /api/onlyoffice/documents?action=list

List all documents.

```typescript
// Response
{
  "success": true,
  "documents": [
    {
      "id": "uuid",
      "title": "My Document.docx",
      "fileType": "docx",
      "createdAt": 1234567890000,
      "updatedAt": 1234567890000,
      "url": "/api/onlyoffice/download?id=uuid"
    }
  ]
}
```

### GET /api/onlyoffice/documents?action=get&documentId=xxx

Get single document.

### POST /api/onlyoffice/documents

Create or generate documents.

```typescript
// Create empty document
{
  "action": "create",
  "data": {
    "title": "New Document",
    "type": "word"  // "word" | "cell" | "slide"
  }
}

// Generate from AI prompt
{
  "action": "generate",
  "data": {
    "prompt": "Write a business proposal for AI consulting services",
    "type": "word"
  }
}

// Delete document
{
  "action": "delete",
  "data": { "documentId": "uuid" }
}

// Response
{
  "success": true,
  "document": {
    "id": "uuid",
    "title": "Generated Document.docx",
    "fileType": "docx",
    "url": "/api/onlyoffice/download?id=uuid"
  }
}
```

### GET /api/onlyoffice/download?id=xxx&format=original

Download document as Office file.

```typescript
// Formats: original | pdf (PDF requires ONLYOFFICE server)

// Response: Binary file
// Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

### POST /api/onlyoffice/ai

AI proxy for ONLYOFFICE AI plugin.

```typescript
// Request (OpenAI-compatible format)
{
  "messages": [
    { "role": "user", "content": "Summarize this document" }
  ],
  "model": "glm-4.7-flash",
  "stream": false
}

// Streaming Request
{
  "messages": [...],
  "model": "glm-4.7-flash",
  "stream": true
}

// Streaming Response (SSE)
data: {"choices":[{"delta":{"content":"This"}}]}
data: {"choices":[{"delta":{"content":" document"}}]}
data: {"done": true}
```

### GET /api/onlyoffice/status

Check ONLYOFFICE Document Server status.

```typescript
// Response
{
  "installed": true,
  "version": "8.0.0",
  "jwtEnabled": true
}
```

---

## Telegram

### GET /api/telegram/config

Get current bot configuration.

```typescript
// Response
{
  "config": {
    "enabled": true,
    "botToken": "123...',
    "chatWithAI": true,
    "allowedUsers": []
  }
}
```

### POST /api/telegram/config

Save bot configuration.

```typescript
// Save configuration
{
  "action": "save",
  "config": {
    "botToken": "123456789:ABC...",
    "enabled": true,
    "webhookUrl": "https://your-domain.com/api/telegram"
  }
}

// Set webhook
{
  "action": "setWebhook",
  "config": {
    "webhookUrl": "https://your-domain.com/api/telegram"
  }
}

// Delete webhook
{
  "action": "deleteWebhook"
}

// Register commands
{
  "action": "setup"
}

// Test connection
{
  "action": "test"
}

// Response (save)
{
  "success": true,
  "bot": {
    "id": 123456789,
    "username": "your_bot",
    "first_name": "Your Bot"
  },
  "message": "Connected to bot @your_bot"
}
```

### POST /api/telegram/polling

Start or stop polling mode.

```typescript
// Start polling
{ "action": "start" }

// Stop polling
{ "action": "stop" }

// Response
{ "success": true, "status": "polling" }
```

### GET /api/telegram/polling

Check polling status.

```typescript
// Response
{
  "polling": true,
  "enabled": true
}
```

### POST /api/telegram

Webhook endpoint for receiving Telegram updates (called by Telegram servers).

```typescript
// Telegram sends updates in this format
{
  "update_id": 123,
  "message": {
    "message_id": 1,
    "from": { "id": 987654321, "first_name": "User" },
    "chat": { "id": 987654321 },
    "text": "Hello"
  }
}

// Response
{ "ok": true }
```

---

## Models

### GET /api/models

List available AI models.

```typescript
// Response
{
  "ollama": {
    "available": true,
    "models": [
      {
        "name": "glm-4.7-flash:latest",
        "model": "glm-4.7-flash:latest",
        "size": 19019270852,
        "digest": "abc123...",
        "modified_at": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "external": [
    {
      "id": "openrouter",
      "name": "OpenRouter (GPT-4o Mini)",
      "provider": "openrouter",
      "description": "OpenAI-compatible API"
    }
  ],
  "allModels": [...],
  "defaultModel": "glm-4.7-flash",
  "timestamp": 1234567890000
}
```

---

## Tasks

### GET /api/tasks

List scheduled tasks.

```typescript
// Response
{
  "tasks": [
    {
      "id": "uuid",
      "name": "Intelligence Report",
      "taskType": "intelligence",
      "schedule": "daily",
      "enabled": true,
      "lastRun": 1234567890000,
      "runCount": 42
    }
  ]
}
```

### POST /api/tasks

Create or manage tasks.

```typescript
// Create task
{
  "action": "create",
  "task": {
    "name": "Custom Task",
    "taskType": "custom",
    "prompt": "Daily summary of...",
    "schedule": "daily"
  }
}

// Run task manually
{
  "action": "run",
  "taskId": "uuid"
}

// Enable/disable task
{
  "action": "enable",
  "taskId": "uuid"
}
```

### GET /api/heartbeat

Get system health and task status.

```typescript
// Response
{
  "status": "healthy",
  "timestamp": 1234567890000,
  "model": "glm-4.7-flash",
  "schedulerRunning": true,
  "tasks": {
    "intelligence": { "lastRun": 123456789, "success": true },
    "security": { "lastRun": 123456789, "success": true }
  },
  "totalTasks": 154,
  "enabledTasks": 150
}
```

---

## Memory

### GET /api/memory-file

Get current memory context.

```typescript
// Response
{
  "success": true,
  "content": "# MEMORY.md\n\n## User Profile\n..."
}
```

### POST /api/memory-file

Update memory context.

```typescript
// Request
{
  "action": "update",
  "content": "# MEMORY.md\n\n## User Profile\nName: Michael\n..."
}

// Response
{ "success": true }
```

---

## Vector Lake

### POST /api/vector-lake

Query the vector lake (semantic cache).

```typescript
// Request
{
  "action": "query",
  "query": "What is the project timeline?",
  "threshold": 0.75  // Optional similarity threshold
}

// Response
{
  "cached": true,
  "entry": {
    "id": "uuid",
    "query": "When is the deadline?",
    "answer": "The deadline is...",
    "searchTerms": ["deadline", "timeline"]
  },
  "context": "Retrieved context..."
}
```

---

## User Preferences

### GET /api/user

Get user preferences.

```typescript
// Response
{
  "userName": "Michael",
  "assistantName": "AI Assistant",
  "hasCompletedSetup": true,
  "apiKeys": {
    "openrouter": "***..."
  }
}
```

### POST /api/user

Update user preferences.

```typescript
// Request
{
  "userName": "Michael",
  "assistantName": "Jarvis"
}

// Response
{ "success": true }
```

---

## Error Handling

All API endpoints follow standard error format:

```typescript
// Error Response
{
  "error": "Error type",
  "details": "Detailed message",
  "timestamp": 1234567890000
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request / validation error |
| 401 | Authentication required |
| 403 | Permission denied |
| 404 | Not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Rate Limiting

Rate limiting is available but not enabled by default. To enable:

```typescript
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit';

// Apply to route
export const POST = withRateLimit(handler, rateLimitConfigs.normal);
```

### Rate Limit Configs

| Config | Requests/Minute | Use Case |
|--------|-----------------|----------|
| strict | 10 | Administrative |
| normal | 60 | Standard |
| relaxed | 300 | High-volume |
| ai | 30 | AI endpoints |

---

## WebSocket Support

Currently, all real-time features use Server-Sent Events (SSE). WebSocket support planned for future release.

---

## SDK Usage

### JavaScript/TypeScript

```typescript
// Chat
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello',
    model: 'glm-4.7-flash'
  })
});
const data = await response.json();

// Streaming chat
const stream = await fetch('/api/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Tell me a story' })
});
const reader = stream.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = new TextDecoder().decode(value);
  // Parse SSE data...
}
```

---

**For more information, see [DOCUMENTATION.md](./DOCUMENTATION.md)**