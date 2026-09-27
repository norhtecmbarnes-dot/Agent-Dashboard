# Web Search Integration

## Overview

The AI Dashboard includes integrated web search using Ollama's official web search API. This gives the AI access to real-time information and reduces hallucinations.

## Setup

### 1. Get an Ollama API Key

1. Visit https://ollama.com/settings/keys
2. Create a free account if needed
3. Generate an API key
4. Add to your `.env.local`:

```bash
OLLAMA_API_KEY=your-api-key-here
```

### 2. Restart the server

```bash
npm run dev
```

## Usage

### Chat Commands

| Command | Description |
|---------|-------------|
| `/search <query>` | Search the web (Ollama Cloud, falls back to browser) |
| `/web <query>` | Direct Ollama web search |

### AI Tool Calling

The AI can autonomously search the web when it needs current information:

- **web_search** — Search for real-time information
- **save_memory** — Save important facts to persistent memory
- **search_memory** — Search past memories

Example prompts that trigger web search:
- "What's the current price of Bitcoin?"
- "What happened in the news today?"
- "What's the latest version of React?"

### Slash Commands

```bash
# Direct search
/search latest AI developments

# Memory commands
/memory my project details
/remember I prefer dark mode
```

## How It Works

### Search Flow

```
User Query → AI decides to search → web_search tool → Ollama API → Results
                                     ↓ (no API key)
                                 Browser fallback (Playwright)
```

### Tool Execution Loop

1. User sends message
2. AI receives prompt with tool definitions
3. AI decides if search is needed
4. If yes, AI calls `web_search` tool
5. Server executes search, returns results
6. AI incorporates results into response

## Configuration

### Environment Variables

```bash
# Required for Ollama Cloud search
OLLAMA_API_KEY=your-key

# Optional: Custom Ollama API URL
OLLAMA_API_URL=http://localhost:11434/api
```

### Fallback Search

If no `OLLAMA_API_KEY` is set, the system falls back to:
1. Browser-based search (Playwright)
2. SearXNG (if running locally at `http://localhost:8888`)

## Memory Integration

Web search works with persistent memory:

1. **Automatic context** — Memory is injected into every conversation
2. **AI can save memories** — Tool allows saving important info
3. **Learning from searches** — Results can be saved for future reference

Example:
```
User: "What's the latest Node.js version?"
AI: [searches web] → Node.js 22.x is the latest...
User: "Remember that for my project"
AI: [calls save_memory tool] → Saved "nodejs_latest_version: 22.x"
```

## Technical Details

### Search Tool Definition

```typescript
{
  type: 'function',
  function: {
    name: 'web_search',
    description: 'Search the web for real-time information',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        max_results: { type: 'integer', default: 5 },
        freshness: { enum: ['day', 'week', 'month', 'year'] }
      },
      required: ['query']
    }
  }
}
```

### Response Format

```typescript
interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source?: string;
  published_date?: string;
}
```

## Supported Models

Web search works with all models, but tool calling is best supported by:

| Model | Tool Calling | Notes |
|-------|-------------|-------|
| GLM-5 Cloud | ✅ Excellent | Best for Chinese + English |
| GPT-4o | ✅ Excellent | Via OpenAI API key |
| Claude 3.5 | ✅ Excellent | Via Anthropic API key |
| Qwen 2.5 | ✅ Good | Via Ollama local |
| Gemini 2.0 | ✅ Good | Via Google API key |

## Cost

- **Ollama Cloud Web Search**: Free tier available
- **Local models**: Free (no API costs)
- **Cloud models**: Pay per token via respective providers

## Troubleshooting

### "No search results found"

1. Check your `OLLAMA_API_KEY` is set
2. Verify the key is valid at ollama.com
3. Check browser console for errors

### "API key is not configured"

Add to `.env.local`:
```bash
OLLAMA_API_KEY=your-key
```

### Slow searches

- Ollama Cloud is typically < 500ms
- Browser fallback can take 5-10 seconds
- Consider setting up SearXNG for faster local search

## Related Documentation

- [Memory System](./MEMORY-SYSTEM.md)
- [API Reference](./API-REFERENCE.md)
- [Configuration](./DOCUMENTATION.md#configuration)