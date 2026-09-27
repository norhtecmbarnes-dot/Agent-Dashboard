# AI Dashboard User Interface Guide

## Overview

The AI Dashboard is a comprehensive platform for building AI-powered applications with multiple specialized interfaces. This guide documents each interface and its capabilities.

---

## Navigation

The top navigation bar provides access to all major sections:

- **Home** - Main chat interface with AI experts
- **Calendar** - Schedule management
- **Tasks** - Task management system
- **Notes** - Note-taking with AI
- **Writing Studio** - Document creation and editing
- **Outliner** - Create structured outlines
- **Office** - Document and presentation generation
- **Builder** - AI workflow builder
- **Brands** - Brand workspace management
- **Leaderboard** - Model comparison
- **Telegram** - Telegram bot integration
- **Settings** - Application configuration

---

## Home Page (`/`)

The main chat interface featuring:

### Expert Dropdown
Select from multiple AI experts, each with specialized knowledge:
- **General** - General purpose AI assistant
- **Programmer** - Software development expert
- **Researcher** - Research and analysis
- **Writer** - Content creation specialist
- **Analyst** - Data and market analysis

### Daily Briefing Panel
Located below the expert selector:
- Current date and day of week
- Security status indicator
- Quick self-reflection recommendations

### Chat Interface
- Text input for messages
- Model selector dropdown
- Send button
- Command menu access (`/` shortcuts)

### Commands
Type `/` to access commands:
- `/expert [name]` - Switch to specific expert
- `/briefing` - Show daily briefing
- `/memory [query]` - Search memory
- `/ram` - System memory usage
- `/clear` - Clear chat
- `/bus status` - Message bus status
- `/delegate [task]` - Delegate to message bus

---

## Writing Studio (`/writing-studio`)

A multi-page document editor with AI assistance.

### Toolbar
- **Bold/Italic/Underline** - Text formatting
- **H1/H2/H3** - Headings
- **Table/Copy/Paste** - Content insertion
- **Line** - Horizontal divider

### AI Actions
Select text and choose an action:
- **Expand** - Elaborate on selected text
- **Outline** - Generate outline from content
- **Rewrite** - Rephrase content
- **Simplify** - Make content clearer
- **Humanize** - More natural tone
- **Grammar** - Check and fix grammar
- **Diagram** - Generate Mermaid diagram
- **Table** - Generate table from data

### Brand Voice Selector
Attach brand voice guidelines to writing:
- Select from available brands
- AI adapts style to brand
- Persisted in localStorage

### Features
- **Chapter extraction** - Auto-detect document structure
- **Zoom control** - Adjust editor scale
- **Export** - PDF, DOCX, HTML formats
- **Streaming output** - Real-time AI response display

---

## Outliner (`/outline-creator`)

Generate structured outlines from topics.

### Options
- **Type**: Proposal, Blog, Academic, Business, General
- **Detail Level**: Basic, Standard, Detailed, Comprehensive

### Flow
1. Enter topic or paste content
2. Select type and detail level
3. Click "Generate & Send to Editor"
4. Content loads directly into Writing Studio

---

## Office (`/office`)

Generate Word documents, Excel spreadsheets, and PowerPoint presentations.

### Modes
- **AI Mode** - Describe what you want, AI generates
- **Raw Mode** - Paste content to format

### Document Types
- **Word Document** (.docx) - Professional documents
- **Excel Spreadsheet** (.xlsx) - Data tables
- **PowerPoint** (.pptx) - Presentations

### AI Sub-page (`/office/ai`)

Spreadsheet tools:
- **Analyze** - Data insights
- **Formula** - Generate formulas
- **Clean** - Data standardization
- **Chart** - Visualization suggestions
- **Predict** - Forecasting
- **Generate** - Sample data creation

Presentation tools:
- **Bullets** - Convert to bullet points
- **Speaker Notes** - Generate notes
- **Outline** - Create presentation structure
- **Improve** - Enhance content
- **Summary** - Key takeaways
- **Diagram** - Generate Mermaid diagrams
- **Table** - Generate tables

---

## Brand Workspace (`/brand-workspace`)

NotebookLM-style knowledge management with tabs:

### Tabs

#### Brands Tab
- Create and manage brand profiles
- Voice and style guidelines
- Industry and description

#### Projects Tab
- Projects under each brand
- Project-specific documents
- Progress tracking

#### Documents Tab
- Upload files (PDF, DOCX, TXT, etc.)
- Add from URLs
- Knowledge extraction
- Chat with documents

#### Chat Tab
- Chat with AI about brand
- Query documents
- Generate content

#### Memory Tab
- **Auto Mode** (default) - AI manages memory
- **Manual Mode** - Edit Soul and Memory directly
- View/Edit AI Soul (personality)
- View/Edit Memory Context (user info, projects, knowledge)

---

## Settings (`/settings`)

### Ollama Configuration
- Server URL
- API key
- Available models

### Default Expert
- Select default AI expert
- Custom system prompt

### Theme
- Light/Dark mode

---

## Command Menu

Access via `/` in chat interfaces:

| Command | Description |
|---------|-------------|
| `/expert [name]` | Switch AI expert |
| `/briefing` | Show daily briefing |
| `/memory [query]` | Search persistent memory |
| `/ram` | System memory usage |
| `/clear` | Clear current chat |
| `/bus status` | Message bus status |
| `/bus history` | Message bus history |
| `/bus reset` | Reset message bus |
| `/delegate [task]` | Delegate to message bus |
| `/reflect` | Run self-reflection analysis |

---

## Model Message Bus

Hierarchical AI communication system:

1. **Local triage** - Small models handle routine tasks
2. **Escalation** - Complex tasks go to cloud models
3. **Delegation** - `/delegate` command routes tasks

Features:
- Local-first processing
- Context preservation
- Token efficiency

---

## Brand Voice System

### Creating a Brand
1. Go to Brand Workspace
2. Click "+ New"
3. Enter name, industry, description
4. Define voice profile (tone, style, key messages)

### Using Brand Voice
- Select brand in Writing Studio
- AI adapts content to brand style
- Documents inherit brand guidelines

### Document Upload
- Supports: PDF, DOCX, TXT, Markdown, HTML
- Knowledge extraction auto-runs
- Chat with documents for insights

---

## Memory & Self-Reflection

### Memory
Automatically built through conversations. Stored in SQLite database.

**Access**: Brand Workspace → Memory tab

Components:
- User profile
- Projects
- Knowledge sections
- Current context

### Self-Reflection
Run via `/reflect` command.

Analyzes:
- Current capabilities
- Identified gaps
- Inefficiencies
- Improvement suggestions
- Model recommendations

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Open command menu |
| Enter | Send message |
| Shift+Enter | New line |
| Escape | Close modals |

---

## Data Storage

- **SQLite** - Local database for all data
- **localStorage** - UI preferences
- **File system** - Uploaded documents

All data stays local. No cloud sync.

---

## Troubleshooting

### Model not responding
- Check Ollama is running
- Verify model name in settings
- Check network connection

### Slow responses
- Try smaller models
- Check system resources (`/ram`)
- Disable web search

### Brand voice not working
- Verify brand is selected
- Check brand has documents uploaded
- Try regenerating knowledge extraction
