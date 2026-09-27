# The Local-First Proposal Studio

**Winning Government Contracts with Your Own Private AI**

*Corporate Vault · Procurements · Opportunity Scout · Proposal Genie*

---

## About This Book

This book is a companion to the **PersonalAI Dashboard** codebase at [github.com/norhtecmbarnes-dot/PersonalAI-Dashboard](https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard). It documents one of the most powerful ways to use that platform: turning a private, local-first AI workspace into a complete **government-contracting studio**.

The studio has five parts, and this book walks through each one:

- **The Corporate Vault** — a secure knowledge base that learns your company: past proposals, product data sheets, and hard-won lessons, all in one place.
- **Procurements** — where you load solicitation documents (RFP, SBIR, BAA, OTA, and more) and the system extracts names, due dates, and format rules automatically.
- **The Opportunity Scout** — an agent that hunts SAM.gov, DIU, SSC Front Door, AFWERX, and SBIR.gov for work that fits your company's capabilities.
- **Research Agents** — market intelligence and customer org charts built from the public domain.
- **Proposal Genie** — the strategist: a senior capture manager who turns everything into winning proposal markdown, then into finished Word and PowerPoint deliverables.

**This is a reference configuration.** You can copy it, study it, and reshape it into a studio for any industry — not just government contracting. The book assumes you can run the PersonalAI Dashboard (see `docs/QUICK-START.md` for setup). Everything else is explained from the ground up.

## License

This book is released under the **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)** license. Source code examples are released under the **MIT License**.

You are free to **copy, adapt, remix, and improve** everything in this book and in the project. That is the point. If you build a proposal studio for your own industry — construction, healthcare, software, anything — share it back so the next person can learn from you.

**Attribution:** Michael C. Barnes — *The Local-First Proposal Studio* (CC BY-SA 4.0).

## How to Use This Book

Each chapter follows the same shape, so you always know where you are:

1. A friendly opening and a **"What You'll Learn"** list.
2. Plain-English explanations — every technical term is **bolded** and defined the first time it appears.
3. Step-by-step instructions against the **actual screens and buttons** in the app.
4. **"Try It Yourself"** boxes with exact prompts you can paste into the app right now.
5. **"How to Personalize This"** — because code is just the starting point; prompts are where you make it yours.
6. **"Common Pitfalls"** — the mistakes everyone makes, so you don't have to.
7. A short **Chapter Summary** and **Next Steps**.

---

## Table of Contents

1. [Introduction: Why Build Your Own Proposal Studio](#1-introduction-why-build-your-own-proposal-studio)
2. [The Corporate Vault: Your Company's Brain](#2-the-corporate-vault-your-companys-brain)
3. [Procurements & Solicitations](#3-procurements--solicitations)
4. [The Capture Document: Win Themes, Competition & Strategy](#4-the-capture-document-win-themes-competition--strategy)
5. [Market Research & the Customer Org Chart](#5-market-research--the-customer-org-chart)
6. [The Opportunity Scout: Hunting New Work](#6-the-opportunity-scout-hunting-new-work)
7. [Proposal Genie: From Capture to First Draft](#7-proposal-genie-from-capture-to-first-draft)
8. [Finished Deliverables: Word Documents & Presentations](#8-finished-deliverables-word-documents--presentations)
9. [Notes, Prompts & Making the Studio Yours](#9-notes-prompts--making-the-studio-yours)

---

## 1. Introduction: Why Build Your Own Proposal Studio

### The Problem With Winning Contracts

Every year, small businesses lose federal, state, and local contract opportunities for reasons that have nothing to do with whether they could do the work. They lose because they missed the solicitation. They lose because they didn't find out about the opportunity until it was too late. They lose because the proposal was generic — written for any customer, which means it convinced none.

You probably know the feeling. You hear about a perfect opportunity from a friend, three weeks after the due date. Or you spend a weekend writing a proposal, and it reads like you wrote it in a weekend.

This book is about building the tool that fixes all of that — a **proposal studio** that runs entirely on your own computer, powered by free, local AI models, and shaped by decades of capture-management thinking.

### What You'll Learn

• What a **local-first** system is and why it matters for contracting
• How the **Corporate Vault** becomes your company's institutional memory
• How **Procurements** turn solicitation documents into working data
• How the **Opportunity Scout** hunts new work while you sleep
• How **Proposal Genie** writes proposals the way a senior capture manager would
• How to turn a proposal into a finished **Word document** and **PowerPoint** deck

### What "Local-First" Really Means

A **local-first** system is software that runs on your own hardware, with your data stored on your own machine. No cloud account. No third party holding your solicitation documents, your pricing, or your past proposals.

For contracting, this isn't a nice-to-have — it's the point. Your solicitations are the rules of the game. Your past proposals are your competitive history. Your pricing is your business. None of that should be parked on someone else's server by default. Cloud is a choice you make, not a default the software makes for you.

### The Soul of the Studio

Every conversation in this studio is guided by a **soul** — a persona document that defines who the assistant is. In this project, the soul is **Proposal Genie**: a senior capture manager, proposal writer, and government-contracting strategist with twenty-plus years of winning bids. The soul is not decoration. It is injected into every chat as the assistant's core identity, which means the AI behaves like a professional who:

• **Researches before writing** — no strategic content from memory alone
• **Grounds every claim in evidence** — no "extensive experience" without proof
• **Treats compliance as non-negotiable** — every shall and must is tracked
• **Closes the loop** — drafts get checked against the compliance matrix
• **Learns from every outcome** — wins and losses become future lessons

### What You'll Build

Here is the whole studio, at a glance:

| Piece | What it does | Where to find it |
|-------|--------------|------------------|
| Corporate Vault | Company knowledge base, NotebookLM-style | `/brand-workspace` |
| Procurements | Solicitation tracking with type labels | Corporate Vault → Procurements |
| Capture Document | Win themes, competition, strategy | Auto-created per procurement |
| Opportunity Scout | Hunts SAM.gov, DIU, AFWERX, SBIR.gov | Scout view |
| Market Research | Budgets, customers, competition report | Procurement → Generate |
| Org Chart | Buying org structure + key contacts | Procurement → Generate |
| Proposal Genie | Proposal markdown pipeline | Proposal studio |
| Word / PowerPoint | Finished deliverables | Generate Word / Presentations |

### Try It Yourself

Open the app, go to the **Memory** tab, and read the soul. Then ask the chat:

> "Summarize your role in this studio, and tell me the three most important rules you follow when writing a proposal."

You'll hear Proposal Genie's voice — confident, direct, evidence-driven. That voice is the baseline for everything else in this book.

### Common Pitfalls

• **Treating the soul as optional.** The soul shapes every response. If the assistant starts sounding generic, check whether the soul is still loaded.
• **Skipping local models.** The studio works with cloud models too, but the privacy promise comes from running locally. Keep your solicitation data on your own machine.

### Chapter Summary

You now understand what you're building: a private, local-first proposal studio with a vault for company knowledge, procurements for tracking work, agents for finding and researching opportunities, and Proposal Genie for writing. The rest of this book builds it layer by layer.

**Next steps:** Move on to Chapter 2 and start loading your company into the vault.

---

## 2. The Corporate Vault: Your Company's Brain

### Why Your Company Needs a Brain

Every proposal you write is built on what your company already knows: the project you delivered for a similar agency, the capability you've refined over a decade, the past performance number that wins or loses evaluations. That knowledge lives in documents — scattered across hard drives, email archives, and the memory of the person who's been there longest.

The **Corporate Vault** is a secure area that collects that company information into one knowledge base. Think of it as a **NotebookLM-style** workspace: you load source material once, and then you can ask questions across all of it. NotebookLM-style means the AI answers from your documents, with sources, rather than from general knowledge.

### What You'll Learn

• How the vault is organized and why it's called "corporate"
• How to load past proposals, product data sheets, and conversations
• How **Ask the Vault** chat works
• How the vault feeds every other part of the studio

### The Three Kinds of Vault Knowledge

The vault is designed around three inputs that matter for proposals:

• **Previous proposals** — your past wins and losses, the most honest record of your capabilities
• **Product data sheets** — what you actually make or do, in concrete terms
• **Past conversations** — decisions, estimates, and lessons that never made it into a document

Company profile fields (industry, description, tags) give the AI context about who you are before it reads a single document.

### Loading Documents

1. Open **Corporate Vault** from the home screen.
2. Pick your company from the list on the left, or create one.
3. Open the **Vault Documents** tab.
4. Upload your files: `.txt`, `.md`, `.html`, `.pdf`, `.json`, and `.docx` are supported.

Each document is stored in the database and **compacted** — the AI creates a compressed version that keeps the substance while staying within the model's context window. A **context window** is how much text a model can consider at once; think of it as the model's working desk. Compaction makes the desk big enough for all your documents.

### Ask the Vault

The vault has its own chat, framed as **Ask the Vault**. Unlike a general chat, it answers with source counts — the AI shows you how many vault documents it used for each answer, so you can see the evidence trail.

### Try It Yourself

Load one past proposal into the vault, then ask:

> "What are our three strongest past performance claims, with the exact numbers to back them up?"

Then ask the same question in a fresh chat outside the vault. Compare the answers. The vaulted answer should be specific and sourced; the unvaulted one will be generic. That difference is the value of the vault.

### How to Personalize This

The vault is the single biggest leverage point in the studio. The more you load, the sharper every downstream step becomes. Consider a folder structure in your own file system: one folder for past proposals, one for data sheets, one for marketing material — and load them all.

### Common Pitfalls

• **Loading everything raw.** A 500-page past proposal is useful, but the compacted version is what the AI works with. Let the system compact; don't upload duplicates.
• **Storing client-identifying data you don't need.** The vault is private, but good hygiene still matters: load the knowledge, not the entire email thread.

### Chapter Summary

The Corporate Vault is your company's institutional memory — past proposals, product data sheets, and conversations, all in one searchable, private place. It feeds the entire studio. Next, we turn knowledge into action with procurements.

**Next steps:** Create a company profile and load your first three documents.

---

## 3. Procurements & Solicitations

### From Knowledge to Pipeline

The vault knows your company. Now it needs to know the work. In this studio, each new opportunity is a **Procurement** — a tracked project where you load the requirement documents, such as solicitations, and the system does the administrative heavy lifting for you.

A **solicitation** is the official document an agency publishes when it wants to buy something: the rules, the requirements, the deadline, the format. The single most common way proposals lose is by missing a rule buried in the solicitation. The studio treats that as its job, not yours.

### What You'll Learn

• How to create a procurement and label its **solicitation type**
• How the system auto-names the opportunity and pulls the due date
• How the **format guide** becomes markdown you can check against
• How the due date lands on the **calendar**

### The Solicitation Types

When you create a procurement, you label it with the type of solicitation it is. These labels matter because different types have different rules, and Proposal Genie needs to know which game it's playing:

| Type | What it usually is |
|------|--------------------|
| **SBIR** | Small Business Innovation Research — phased R&D funding |
| **STTR** | Small Business Technology Transfer — requires a research partner |
| **BAA** | Broad Agency Announcement — open-ended research interests |
| **OTA** | Other Transaction Authority — flexible prototype agreements |
| **OT** | Other Transaction — non-procurement contract flexibility |
| **CSO** | Commercial Solutions Opening — commercial innovation |
| **RFI** | Request for Information — market research, not a bid |
| **RFP** | Request for Proposal — the classic sealed-bid competition |

Each procurement shows a colored badge with its type, so your pipeline is scannable at a glance.

### Creating a Procurement

1. In the Corporate Vault, select your company.
2. Open the **Procurements** tab — the list for that company.
3. Click **+ New Procurement** and name it, or leave it to the system.
4. Choose the **solicitation type** (RFP is the default).
5. Upload the solicitation document to **Requirement Documents (Solicitations)**.

### What Happens Automatically

This is where the studio starts earning its keep. When a requirement document is uploaded, the system extracts, in one pass:

• **The opportunity name** — the program or opportunity name becomes the procurement's name, so your list reads like an agency's program list, not "Untitled Project."
• **The due date → Calendar** — a calendar event is created: *"{Opportunity} — Proposal Due"*, with the agency and solicitation number. It's created once — re-uploading documents won't create duplicates.
• **The format guide → markdown** — a **Format Guide** document is generated (font, font size, page count, page limits, total volumes, submission info) and saved to the procurement. It carries a warning to verify against the source, because the source document is the law.
• **The capture document** — the home for win themes, competition, and strategy is created if it doesn't exist yet.

### Try It Yourself

Upload a real (or sample) solicitation to a new procurement, then check three places:

1. The **Procurements list** — is the opportunity named properly?
2. The **Calendar** — is the due date there, with the solicitation number?
3. The **documents list** — is there a Format Guide in markdown?

If any extraction looks wrong, open the source document and correct the record — the system learns from what you keep.

### How to Personalize This

If your world is state contracts instead of federal, the solicitation-type list is yours to edit. The studio is a reference configuration — the type labels, the extraction prompts, and the calendar event naming are all prompts and configuration you can reshape for your own market.

### Common Pitfalls

• **Forgetting to label the type.** The type badge drives Proposal Genie's framing. An RFP and an OTA are different games.
• **Re-uploading to force re-extraction.** The system guards against reprocessing so the calendar doesn't get spammed. If you need a re-run, edit the records instead.

### Chapter Summary

Procurements turn solicitation documents into structured pipeline data: named opportunities, labeled types, calendar deadlines, and format guides. The capture document — the strategic heart of each pursuit — is next.

**Next steps:** Create a procurement, upload a solicitation, and confirm the calendar event appeared.

---

## 4. The Capture Document: Win Themes, Competition & Strategy

### The Capture Mindset

Before any proposal is written, capture managers do the real work: they figure out *why* you should win, *who* you're competing against, and *what* the strategy is. That thinking lives in a **capture document** — the strategic brief for one specific opportunity.

In this studio, every procurement gets a capture document automatically. It's the bridge between raw solicitation and finished proposal.

### What You'll Learn

• What a **capture document** holds and why it matters
• How vault conversations turn into strategy automatically
• How **win themes**, **competitive data**, and **strategy notes** get extracted

### What's Inside a Capture Document

The capture document organizes the pursuit around the questions that actually decide outcomes:

• **Win themes** — the two or three discriminators that make your offer hard to beat
• **Competition** — who else is likely to bid, and their strengths and weaknesses
• **Strategy** — how you'll position, price, and sequence the pursuit
• **Key requirements** — the technical must-haves extracted from the solicitation
• **Agency and NAICS** — who's buying and under what classification

### Strategy From Conversation

The capture document doesn't require a form to fill out. It grows out of conversation.

When you discuss strategy in a procurement's chat — competitors, incumbents, pricing, go/no-go decisions — the system watches for strategy-related signals. When it finds enough context, it extracts **win themes**, **competitive data**, and a **strategy paragraph**, and merges them into the procurement's knowledge. The capture document and Proposal Genie both read from that same knowledge.

Routine chat stays fast. Extraction only triggers on strategy-bearing messages, so asking "what's in the format guide?" doesn't fire a three-step analysis.

### Why This Matters

Proposal evaluators score against the agency's needs, not your features. The win themes you develop in capture are what Proposal Genie weaves through the entire document. If the capture is thin, the proposal will be generic — no matter how good the writing model is.

### Try It Yourself

Open a procurement's chat and have a working session:

> "We're bidding against two incumbents on this one. Our differentiator is our zero-data-loss track record across seven VA EHR deployments. The customer cares most about transition risk. Let's build the win theme around a proven transition playbook."

Then ask:

> "Summarize the win themes, competitive landscape, and strategy we just discussed."

The studio should reflect back the strategy — and store it for Proposal Genie to use later.

### How to Personalize This

Capture is where your judgment matters most. The extraction triggers and prompts can be tuned to your market's vocabulary — for construction, themes are schedule and safety; for software, they're security and integration. Teach the studio your industry's language and it will capture what matters.

### Common Pitfalls

• **Skipping capture and going straight to writing.** The proposal will read like a features list, not a strategy.
• **Letting the AI invent competitive intelligence.** The capture system grounds in what you tell it. If you don't know the incumbent, the honest answer is "unknown — research needed," not a guess.

### Chapter Summary

Capture turns your thinking into structured strategy: win themes, competition, and positioning. It grows naturally from conversation and feeds everything Proposal Genie writes. Next, we go outside the company — into the public domain.

**Next steps:** Hold one capture conversation per procurement before writing anything.

---

## 5. Market Research & the Customer Org Chart

### The Public Domain Is Your Intelligence Service

The solicitation tells you the rules. The public domain tells you the game: the agency's budget, the customers who've bought similar things, the competition, the news that changes the landscape. None of it is secret — it's just scattered across the web.

The studio has two research agents that collect it for you, grounded strictly in what they find.

### What You'll Learn

• How the **market research agent** builds a budget/customer/competition report
• How the **org chart builder** maps the buying organization and finds key individuals
• How research lands in **separate markdown files** you can review
• How key people become **contacts** in your directory

### The Market Research Agent

From the procurement's **Generate** panel, click **🔎 Market Research**. The agent takes the context already extracted from the solicitation (agency, program name, solicitation number) plus your company name, and runs four targeted web searches:

• **Budget & funding** for the program
• **Interested customers & recent awards**
• **Competition**
• **News & context**

Each search goes through the search chain — local models, then web search providers — and the findings are compiled into a markdown report with clearly labeled sections and numbered sources. Empty sections say so honestly: "No public information found yet." The report is saved to a **separate markdown file** at `data/research/<projectId>-research.md`, and as a generated output you can search inside the app.

### The Org Chart Builder

The **🏛️ Customer Org Chart** button does two jobs:

1. **Extracts points of contact** from the solicitation documents — names, titles, org units, emails, phones.
2. **Searches the web** for the buying organization's structure: leadership, program managers, contracting office, procurement organization.

The result is a markdown org chart of the buying organization, and — here's the multiplier — every identified individual is **added to your contacts database**, deduplicated and tagged as a key individual for that program. Your customer directory builds itself while you research.

### Try It Yourself

For a real procurement, run **Market Research**, then open the report:

> "Summarize this report into the three most useful facts for our proposal, and flag anything that looks like a gap in our knowledge."

Then run **Customer Org Chart** and check your **Contacts** page. The people from the solicitation and the web should be there, tagged with the program.

### How to Personalize This

The search queries are templates. If you bid in a niche — maritime logistics, clinical trials, water infrastructure — reshape the query templates to your domain's vocabulary and sources. The report structure is markdown; you can reformat it to match your team's brief format.

### Common Pitfalls

• **Believing the report is exhaustive.** It's a best-effort collection of public findings, not a full intelligence file. Use it to target deeper research.
• **Skipping verification of contacts.** The system extracts what it can, but titles change and people move. Verify before you reach out.

### Chapter Summary

Two agents turn the public domain into usable intelligence: a market research report with sources, and an org chart that doubles as a contact-building machine. Both are grounded in what's actually found — no fabrication. Next, the scout that brings new opportunities to you.

**Next steps:** Run both agents on your most active procurement.

---

## 6. The Opportunity Scout: Hunting New Work

### The Best Opportunity Is the One You See First

The hardest part of winning contracts isn't writing proposals — it's knowing the opportunity exists in time to act. SAM.gov publishes thousands of opportunities. Agency portals like DIU, SSC Front Door, and AFWERX publish their own. Nobody reads all of them. The **Opportunity Scout** does.

### What You'll Learn

• How the scout builds a **company profile** from your vault
• How it searches **SAM.gov and customer-published sites**
• How it **scores** every opportunity against your capabilities
• How it **learns** from your wins and losses

### The Company Profile

The scout starts by building a profile of your company from the vault: products, capabilities, NAICS codes, keywords, target agencies, and past performance. **NAICS codes** are the six-digit industry classification numbers agencies use to categorize contracts — they're the scout's native language.

You can rebuild the profile anytime with **Rebuild from company data**; the scout extracts it from your brand info, vault documents, and past proposals.

### The Hunt

Open the **Scout** view, toggle which sources to search, and click **🎯 Run Scout Search**. The scout searches:

• **SAM.gov** — via the official API when you've added a key, otherwise by scraping the public search UI with a browser agent
• **DIU** (Defense Innovation Unit) — when your profile targets DoD
• **SSC Front Door / SpaceWERX** — when you target Space Force
• **AFWERX** — when you target the Air Force
• **SBIR.gov / DoD SBIR** — across the R&D agencies

"Depending on the customer" is built in: the scout only visits the portals that publish for the agencies in your profile.

### Scoring

Every result gets a **fit score** out of 100, based on how well it matches your profile: learned keywords, NAICS matches, target-agency matches, and product terms. Results are sorted best-first, with the reasons for each score shown. Results from different sources carry colored badges so you can see where each lead came from.

### Teaching the Scout

After a proposal is written, won, or lost, tell the scout the outcome in the **Teach the Scout** panel. It extracts the keywords, NAICS codes, and agency that mattered, and **weights future searches toward what actually worked**. Wins boost keywords hardest; losses still teach. The scout gets smarter with every pursuit — that's the self-learning loop.

### Try It Yourself

Build the profile, then run a scout search with all five sources toggled:

> "Which of these opportunities fit us best, and what specifically makes them a fit?"

Then pick one real outcome — a win, a loss, or a bid — and log it in **Teach the Scout**. Run the search again and watch the ordering shift toward the lesson.

### How to Personalize This

The scout's edge is the profile. Keep it sharp: load past proposals, keep NAICS codes current, and teach every outcome. You can also curate the source list — if you only pursue DoD, untoggle the sources you never want.

### Common Pitfalls

• **Expecting the browser scrape to be perfect.** Site layouts change. The scout falls back to search-engine results when a scrape fails — results still come, they may just be thinner.
• **Never teaching outcomes.** An untrained scout is a keyword matcher. A trained scout is a market analyst.

### Chapter Summary

The Opportunity Scout watches the sources, scores what it finds against your real capabilities, and learns from what you win and lose. It turns opportunity-hunting from a manual chore into an agent that works for you. Next: the writing itself.

**Next steps:** Build the profile, run a search, and log one outcome.

---

## 7. Proposal Genie: From Capture to First Draft

### The Strategist Takes Over

Everything so far — vault, procurements, capture, research, scout — feeds one destination: the proposal. This is where **Proposal Genie** takes the stage: a senior capture manager, proposal writer, and contracting strategist who works for your company and wants you to win.

### What You'll Learn

• How the proposal pipeline is organized into five functions
• How win themes and competition become proposal sections
• How the **compliance matrix** keeps the shalls straight
• How the soul's voice shapes every word

### The Pipeline

The studio breaks proposal-writing into five functions, each a step you can run, review, and rerun:

1. **Cover Page** — generate the title page markdown from the procurement
2. **Win Themes** — integrate your capture themes into the proposal structure
3. **Competition** — analyze the competitive landscape into a section
4. **Write Sections** — draft the proposal body from the requirements
5. **Assemble** — combine everything into one complete proposal document with executive summary and table of contents

Each function grounds in the same evidence: the soul, the brand, the project, the vault documents, the capture document, and the compliance matrix. Nothing is written from memory alone.

### The Compliance Matrix

The **compliance matrix** is the proposal's spine: every requirement from the solicitation, tracked as addressed, partial, or missing. Proposal Genie treats compliance as non-negotiable — the model is told, in the soul, that a brilliant proposal missing one *shall* is eliminated. The assembled proposal ends with a compliance reference section listing the top requirements and their status.

### The Voice

The soul makes the difference between a generic document and one with a point of view. Proposal Genie's rules are explicit:

• Write to the customer, not the RFP — the agency's mission is the audience
• Be specific, not generic — if a sentence could appear in any company's proposal, it doesn't belong
• Flag gaps honestly — `[GAP: ...]` markers, not inflated claims

### Try It Yourself

Run the pipeline end to end on one procurement:

> "Run the full pipeline: cover page, win themes, competition, write sections, and assemble."

Then read the assembled markdown and ask:

> "Audit this draft against the compliance matrix. Which requirements are addressed, which are partial, and which are missing?"

The audit — not the draft — is where the win is decided.

### How to Personalize This

The soul is the single most personalizable file in the project. Edit it in the **Memory** tab: change the industry expertise, the voice, the rules. If you bid construction, give the soul twenty years of construction capture experience. The entire pipeline follows.

### Common Pitfalls

• **Skipping the capture document.** Proposal Genie is only as strategic as what you fed it in Chapter 4.
• **Accepting the first draft.** The pipeline is designed for iteration — run it, audit it, refine the capture, run it again.

### Chapter Summary

Proposal Genie turns capture into a structured, compliance-aware first draft with a consistent strategic voice. The markdown is the working document. In the next chapter, it becomes a finished deliverable.

**Next steps:** Run the pipeline on one procurement and audit the result against the matrix.

---

## 8. Finished Deliverables: Word Documents & Presentations

### The Proposal Leaves the Screen

Markdown is a great working format. Agencies want something else: a formatted document with your logo, a proprietary notice on every page, and the right font. This chapter covers how the studio turns proposal markdown into **finished Word documents** and **PowerPoint presentations** — with the production template built in.

### What You'll Learn

• How **markdown becomes Word** with headings, bullets, and standard tables
• How the production template handles **logo, proprietary notice, and page numbers**
• How to switch between **Times New Roman 12 pt** and **10 pt**
• How to generate **Quad Charts, Gantt schedules, and staffing reports** as slides

### The Word Template

The Word generator renders your proposal markdown into a `.docx` file with a production layout:

• **Cover page** — company logo, company name, proposal title, subtitle, and an RFP metadata table (agency, solicitation number, due date)
• **Header on every content page** — company name and logo
• **Footer on every page** — your proprietary warning plus "Page X of Y"
• **Body font** — Times New Roman, **12 pt by default**, switchable to **10 pt**
• **Tables** — markdown pipe tables become full-width Word tables with a shaded header row
• **Page breaks** between major sections

### The Proprietary Notice

The proprietary warning is a text field in the studio, pre-filled with a standard notice. Edit it to match your legal language — it appears in the footer of every page and on the cover. That's the difference between a draft and a deliverable you can send.

### Try It Yourself

Generate a proposal (Chapter 7), then click **Generate Word (.docx)**:

> "Set the body font to Times Roman 10 pt and export again. Compare the two files — the 10 pt version should be noticeably denser, which matters when the solicitation limits page count."

Page limits are the whole reason the font choice exists. When the RFP says "no more than 50 pages," 12 pt text and 10 pt text are two different proposals.

### Presentations

The **Presentations** panel generates `.pptx` files. Click **✨ Auto-generate from proposal** and the studio extracts the data from your proposal markdown:

• **Quad Chart** — the classic four-quadrant slide: Technical, Management, Past Performance, Price/Other
• **Schedule (Gantt)** — a timeline of proposal tasks as colored bars
• **Staffing Report** — labor categories, roles, levels, and LOE
• **Capture Deck** — a briefing deck from the proposal sections

The extracted data lands in editable text boxes before export, so you can adjust it before generating. Manual entry is still there if you prefer.

### How to Personalize This

The template fields — logo, company name, proprietary notice, agency, solicitation number, due date — are plain inputs. The real customization is the format guide from Chapter 3: if the solicitation specifies a font, margins, or page limits, set the studio's font option to match and hold the line.

### Common Pitfalls

• **Exporting before the format guide is verified.** The generated guide carries a verify warning for a reason — the solicitation is the law.
• **Ignoring the page-count lever.** If you're over the limit, 10 pt and tightened language are your two honest levers. Never shrink compliance.

### Chapter Summary

The studio closes the loop from strategy to deliverable: Word documents with your branding and proprietary protections, and presentation decks generated straight from the proposal. The last chapter ties everything together.

**Next steps:** Export your first Word document and one Quad Chart.

---

## 9. Notes, Prompts & Making the Studio Yours

### The Studio Is a Starting Point

You've built the whole pipeline: vault, procurements, capture, research, scout, proposal, deliverables. This final chapter is about the force multiplier — the small system inside the studio that makes everything repeatable — and about making the whole thing yours.

### What You'll Learn

• How the **Prompts library** stores your reusable instructions
• How **variables** make prompts flexible without rewriting them
• How notes and prompts are stored in the database
• How to shape the studio for your own market

### The Prompts Library

The **Notes** page has a **⚡ Prompts** view: a library of reusable prompts stored in the database. Each prompt has a title, category, tags, and content. You can:

• **Create** prompts for anything you do repeatedly — a compliance audit, a win-theme brainstorm, a past-performance extractor
• **Edit and delete** them as your approach evolves
• **Filter by category and search** when the library grows
• **Use** them — and track which ones actually get used

### Variables: One Prompt, Many Uses

The killer feature is **variables**. Write a prompt once with `{{variable}}` placeholders — for example, `{{agency}}`, `{{solicitation_type}}`, `{{page_limit}}` — and define a default for each. When you run it, **Apply Variables & Copy** fills them and puts the finished prompt on your clipboard, ready to paste into the studio.

One audit prompt becomes an audit prompt for every procurement. That's the compounding effect: every repeatable task you codify once saves you the thinking next time.

### Try It Yourself

Create a prompt called **Solicitation Kickoff Brief** with variables:

> "Create a kickoff brief for {{opportunity_name}}. Agency: {{agency}}. Type: {{solicitation_type}}. Due: {{due_date}}. Include win themes, key requirements, and the three questions we must answer before writing."

Set defaults, save it, then **Apply Variables & Copy** for your next procurement. Paste it into the procurement chat and watch it become a structured brief.

### How to Personalize This — The Studio for Your Market

Everything in this book is a reference configuration. Here's your checklist for making it yours:

• **Rewrite the soul** in the Memory tab for your industry — the voice and rules follow everywhere
• **Edit the solicitation types** to match your market's procurement vocabulary
• **Teach the scout** every outcome so it learns your competitive landscape
• **Build your prompt library** around the briefs and audits you repeat
• **Tune the research templates** to your domain's sources and language

### Common Pitfalls

• **Prompt drift.** Prompts are living documents. Review your library quarterly — delete what you no longer use, tighten what you do.
• **The everything-custom trap.** Personalize what changes your outcomes: soul, types, prompts, research templates. Don't rebuild plumbing that already works.

### Chapter Summary

You now have a private, local-first proposal studio: a vault that remembers your company, procurements that track the work, agents that research and scout, Proposal Genie that writes with strategy and compliance, and a deliverable pipeline that produces branded Word and PowerPoint files. And it's all yours to reshape.

**You now hold real enterprise-grade AI power in your hands — and the best part? You can make this studio completely yours with simple prompts.**

---

*The Local-First Proposal Studio* is released under **Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)**. Code examples are MIT-licensed. Fork it, remix it, and share what you build.
