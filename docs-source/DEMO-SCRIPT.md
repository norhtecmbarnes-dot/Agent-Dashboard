# Demonstration Video Script - AI Dashboard

**Duration**: 5-7 minutes
**Audience**: Developers, AI enthusiasts, productivity-focused users

---

## Opening (30 seconds)

*[Show main chat interface with dark gradient background]*

**Narrator**: "Welcome to AI Dashboard - your personal AI-powered research assistant and productivity suite. Built with Next.js and designed to work 'out of the box' with Ollama, it runs entirely on your local machine."

**Key Point**: "No cloud required. Your data stays private."

---

## Section 1: Chat Interface (1 minute)

*[Show chat with AI]*

**Narrator**: "Start by chatting with the AI. It remembers your context across sessions using MEMORY.md - a persistent memory file that stores your preferences, projects, and knowledge."

*[Demonstrate]*:
- Ask about projects stored in memory
- Ask AI to recall previous conversations
- Show model selector dropdown

**Highlight**: "Support for 8+ AI models including GLM-4.7-flash for fast responses and cloud models for complex reasoning."

---

## Section 2: Document Management (1.5 minutes)

*[Navigate to Documents page]*

**Narrator**: "Import documents in multiple formats - PDF, Word, text files. The AI reads, summarizes, and makes them searchable."

*[Demonstrate]*:
- Upload a PDF document
- Ask questions about the document in chat
- Show document preview

**Highlight**: "Chat directly with your documents using natural language."

---

## Section 3: ONLYOFFICE Integration (1.5 minutes)

*[Navigate to Office page]*

**Narrator**: "Create professional documents with AI assistance. Word documents, Excel spreadsheets, PowerPoint presentations - all generated locally."

*[Demonstrate]*:
- Create a Word document
- Use AI to generate content
- Download and open in Microsoft Office
- Show ONLYOFFICE editor for in-browser editing

**Key Point**: "Connected to ONLYOFFICE Document Server running locally on port 8080 for collaborative editing."

---

## Section 4: Task Automation (1 minute)

*[Navigate to System page]*

**Narrator**: "The heartbeat system runs automated tasks continuously:"

*[Show]*:
- Research task scanning for AI developments
- Security scan checking for vulnerabilities  
- Self-reflection analyzing system health
- Intelligence reports on space/defense industry

**Highlight**: "Runs automatically so you don't have to remember."

---

## Section 5: Specialized Tools (1 minute)

*[Quick demonstration of multiple tools]*

**Narrator**: "Specialized AI tools for every task:"

- **Writing Assistant**: Expand, outline, simplify text
- **Canvas**: Generate dashboards from descriptions
- **Office AI**: Spreadsheet formulas, presentation outlines
- **Office Editor**: Full editor integration
- **Memory Management**: View and edit persistent memory

---

## Section 6: SAM.gov Integration (30 seconds)

*[Navigate to SAM page]*

**Narrator**: "For government contractors, automatically scan SAM.gov for opportunities matching your keywords. Tracks deadlines, award amounts, and agency contacts."

---

## Closing (30 seconds)

*[Return to main chat]*

**Narrator**: "AI Dashboard - your private, powerful AI assistant. Works offline, respects your privacy, and helps you work smarter."

*[Show GitHub link and documentation]*

**Call to Action**: "Visit the GitHub repo to get started. Works with Ollama, OpenAI, Anthropic, and more."

---

## Demo Checklist

### Setup Before Recording
1. Start Ollama with GLM-4.7-flash model
2. Start ONLYOFFICE Document Server on port 8080
3. Clear demo data for clean interface
4. Prepare sample documents to import
5. Set up sample SAM.gov search queries
6. Have memory content ready to show

### Key Demos to Show
1. **Chat with Memory**: Show AI remembering user preferences
2. **Document Import**: Import a PDF and ask questions
3. **Office Generation**: Create and download a real .docx file
4. **Task Execution**: Show running a research task
5. **Canvas**: Generate a dashboard from description
6. **Writing Assistant**: Expand a paragraph
7. **ONLYOFFICE Editor**: Open document in browser

### Technical Points to Mention
- Built with Next.js 16, TypeScript, Tailwind CSS
- SQLite database via @sqlite.org/sqlite-wasm (Node.js) and sql.js (Edge Runtime)
- Multi-model support (Ollama, GLM, OpenRouter)
- Memory stored in MEMORY.md file
- Heartbeat automation system
- Document generation with docx, xlsx, pptxgenjs

### Questions to Anticipate
- **Q: Does it require internet?**
  - A: Only if using cloud models. Works fully offline with Ollama.

- **Q: Where is my data stored?**
  - A: Locally in SQLite database and MEMORY.md file.

- **Q: Can I use my own AI model?**
  - A: Yes, supports any OpenAI-compatible API or Ollama model.

- **Q: Is it free?**
  - A: Yes, open source. Local models are free, cloud models need API keys.