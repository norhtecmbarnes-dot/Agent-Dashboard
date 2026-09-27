# Document Generation Guide

## Overview

The AI Dashboard can generate professional documents (Word, Excel, PowerPoint) using AI-powered content generation or by converting raw content.

## Features

### Three Document Types

| Type | Extension | Description |
|------|-----------|-------------|
| Word | .docx | Professional documents with sections and formatting |
| Excel | .xlsx | Spreadsheets with headers, rows, and calculations |
| PowerPoint | .pptx | Presentations with slides and bullet points |

### Two Generation Modes

1. **AI Generate** - Describe what you want, AI creates the content
2. **Convert Content** - Paste raw information, AI transforms it into the selected format

## API Endpoint

### POST /api/documents/generate/ai

Generate a document using AI.

**Request:**

```json
{
  "type": "word | cell | slide",
  "title": "Document Title",
  "prompt": "Describe what you want to create...",
  "rawContent": "Optional: paste raw content to transform"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | Document type: "word", "cell", or "slide" |
| title | string | Yes | Title for the document |
| prompt | string | No* | AI prompt describing the document |
| rawContent | string | No* | Raw text to transform into document |

*Either `prompt` or `rawContent` is required.

**Response:**

Returns the document file as a download.

**Example - Generate PowerPoint from AI:**

```bash
curl -X POST http://localhost:3000/api/documents/generate/ai \
  -H "Content-Type: application/json" \
  -d '{"type":"slide","title":"Q3 Sales Report","prompt":"Create a 5 slide presentation about Q3 sales performance"}' \
  -o presentation.pptx
```

**Example - Generate Word Document:**

```bash
curl -X POST http://localhost:3000/api/documents/generate/ai \
  -H "Content-Type: application/json" \
  -d '{"type":"word","title":"Meeting Notes","prompt":"Write meeting notes for a project kickoff"}' \
  -o document.docx
```

**Example - Convert Raw Content to Spreadsheet:**

```bash
curl -X POST http://localhost:3000/api/documents/generate/ai \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cell",
    "title": "Data Report",
    "rawContent": "Name, Age, City\nJohn, 30, NYC\nJane, 25, LA\nBob, 35, Chicago",
    "prompt": "Format this as a proper spreadsheet"
  }' \
  -o spreadsheet.xlsx
```

## Document-Specific Prompts

### Word Documents

Use prompts like:
- "Write a project status report with timeline, milestones, and risks"
- "Create a meeting agenda with discussion points and action items"
- "Generate a business proposal for a new product line"
- "Write meeting minutes with attendees, decisions, and follow-ups"
- "Create a technical specification document"

**Example Output Structure:**
```
## Section Title

Paragraphs of content...

## Another Section

More content...
```

### PowerPoint Presentations

Use prompts like:
- "Create a 5-slide pitch deck for a startup"
- "Generate a project progress presentation"
- "Make a quarterly review presentation with key metrics"
- "Create a training presentation on machine learning"

**Example Output Structure (JSON):**
```json
[
  {
    "title": "Slide Title",
    "bulletPoints": ["Point 1", "Point 2", "Point 3"]
  }
]
```

The AI is prompted to return structured JSON for presentations.

### Excel Spreadsheets

Use prompts like:
- "Create a project budget tracker with categories and monthly columns"
- "Generate a sales report by region with data"
- "Create a Kanban board tracker"
- "Make a time tracking sheet for employees"

**Example Output Structure (JSON):**
```json
{
  "headers": ["Column 1", "Column 2", "Column 3"],
  "rows": [
    ["Data 1", "Data 2", "Data 3"],
    ["Data 4", "Data 5", "Data 6"]
  ]
}
```

## Frontend Integration

### Using the Office Page

Navigate to `/office` to use the document generator UI.

**Features:**
- Select document type (Word, Excel, PowerPoint)
- Choose generation mode (AI or Convert)
- Enter title and prompt/content
- Download generated document

**Example Code:**

```typescript
// Generate a Word document
const response = await fetch('/api/documents/generate/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'word',
    title: 'My Document',
    prompt: 'Write a report about...'
  })
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'My Document.docx';
a.click();
```

## Specialized AI Prompts

Each document type has specialized system prompts:

### Word Documents
- Creates well-structured documents with headings
- Uses proper paragraph formatting
- Maintains professional business language
- Supports markdown-style sections (`## Heading`)

### PowerPoint Presentations
- Creates slides with clear titles
- Limits bullet points (3-6 per slide)
- Uses professional formatting
- Returns JSON for structured parsing

### Excel Spreadsheets
- Creates proper column headers
- Formats data appropriately
- Supports multiple data types
- Returns JSON `{headers, rows}`

## Error Handling

The API returns errors for:
- Missing required parameters
- Invalid document type
- AI generation failure

**Example Error Response:**
```json
{
  "error": "Failed to generate document",
  "details": "AI generated insufficient content"
}
```

## File Sizes

Typical file sizes:
- Word Document: 8-15 KB
- PowerPoint: 40-60 KB
- Excel: 15-25 KB

## Rate Limits

No hard rate limits, but AI generation takes 2-10 seconds depending on complexity.

## Examples

### Generate a Project Proposal

```bash
curl -X POST http://localhost:3000/api/documents/generate/ai \
  -H "Content-Type: application/json" \
  -d '{
    "type": "word",
    "title": "Project Proposal - Website Redesign",
    "prompt": "Write a project proposal for a website redesign project. Include executive summary, objectives, timeline, budget estimate, and next steps."
  }' \
  -o proposal.docx
```

### Create a Sales Presentation

```bash
curl -X POST http://localhost:3000/api/documents/generate/ai \
  -H "Content-Type: application/json" \
  -d '{
    "type": "slide",
    "title": "Q3 Sales Report",
    "prompt": "Create a 6-slide presentation about Q3 sales. Include overview, key metrics, top performers, challenges, and next quarter goals."
  }' \
  -o sales_report.pptx
```

### Convert Notes to Spreadsheet

```bash
curl -X POST http://localhost:3000/api/documents/generate/ai \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cell",
    "title": "Meeting Attendees",
    "rawContent": "John Smith - Engineering - john@example.com\nJane Doe - Marketing - jane@example.com\nBob Johnson - Sales - bob@example.com",
    "prompt": "Convert this list into a proper contact spreadsheet with Name, Department, Email columns"
  }' \
  -o contacts.xlsx
```

## Technical Details

### Libraries Used

- **docx** - Word document generation
- **xlsx** (xlsx) - Excel spreadsheet generation  
- **pptxgenjs** - PowerPoint presentation generation

### AI Model

Uses `glm-4.7-flash` via the chat completion API.

### Content Parsing

- **Word:** Parses markdown-style headings (`## `) and paragraphs
- **PowerPoint:** Parses JSON arrays or numbered/bulleted lists
- **Excel:** Parses JSON `{headers, rows}` or CSV-like text

## Future Enhancements

- [ ] Template library for common document types
- [ ] Document merging functionality
- [ ] Batch document processing
- [ ] Custom styling options
- [ ] PDF generation support