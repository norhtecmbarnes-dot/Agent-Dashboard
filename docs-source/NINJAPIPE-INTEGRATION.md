# Optional: NinjaPipe CRM Integration

> **Status:** Optional feature — not included in the default build.
> **Owner:** Michael Barnes / BD
> **Company:** Zenith Space Technologies LLC (dba Digantara U.S.)

## Overview

The PersonalAI Dashboard can connect to [NinjaPipe CRM](https://ninjapipe.com) to pull live pipeline data into the intelligence reports, daily briefings, and Proposal Genie context.

This integration is **optional and not committed to the GitHub repository**. It's documented here as an available enhancement for users who have a NinjaPipe workspace.

## What It Connects

| Dashboard Feature | CRM Data Source | Value |
|---|---|---|
| **Daily Briefing** | Deal pipeline, weighted values | Live pipeline snapshot every morning |
| **Intelligence Reports** | Deal changes, contact activities | Know which deals moved |
| **Proposal Genie** | Deal details, intel gaps, AOP notes | Context for writing proposals |
| **Brand Workspace** | Accounts/contacts | Link CRM accounts to brand profiles |
| **Vector Lake** | Deals, contacts, activities | Searchable CRM knowledge |
| **Calendar** | Decision dates, deadlines | FLOKI Oct decision, Honeywell Sep 5 |

## Setup

### 1. Get Your API Key

1. Log in to your NinjaPipe workspace
2. Go to **Settings → API Keys**
3. Create a new key with read/write permissions
4. Copy the key (format: `np_` + 32 characters)

### 2. Configure Environment

Add to your `.env.local`:

```bash
NINJAPIPE_API_KEY=np_your_key_here
```

### 3. Copy the Integration Files

The integration files are excluded from git. To enable:

```bash
# The files should already be in place if you're reading this.
# If not, they live at:
#   src/lib/integrations/ninjapipe.ts
#   src/app/api/ninjapipe/route.ts
```

### 4. Restart the Dashboard

```bash
npm run dev
```

### 5. Verify Connection

Open: `http://localhost:3000/api/ninjapipe`

You should see:
```json
{
  "status": "connected",
  "dealCount": 20,
  "pipeline": {
    "totalFaceValue": 40000000,
    "totalWeightedValue": 4856500,
    "totalCommitUsd": 500,
    "gapToTarget": 143500
  }
}
```

## API Endpoints

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/ninjapipe` | Health check + pipeline summary |
| `GET` | `/api/ninjapipe?deals=true` | List all deals |
| `GET` | `/api/ninjapipe?briefing=true` | Daily briefing data |
| `GET` | `/api/ninjapipe?id=xxx` | Deal context for Proposal Genie |
| `GET` | `/api/ninjapipe?contacts=true` | List all contacts |
| `POST` | `/api/ninjapipe` | Index deals into Vector Lake |

## AOP Alignment

The integration maps CRM deals to the AOP framework:

### Stage Weights (Configurable)

| Stage | Default Win % | Meaning |
|---|---|---|
| Engaged | 15% | Early capture |
| Proposed | 30% | RFP/quote submitted |
| Negotiating | 60% | Downselect / BAFO |
| Awarded | 85% | Won notice, unsigned |
| Contracted | 100% | Signed → Commit |
| Lost | 0% | Lost |
| On Hold | 10% | Paused |

### Formulas

```
zenith_face_value = deal.value × (zenith_share_pct / 100)
win_probability = override if set, else stage_weights[stage]
weighted_value = zenith_face_value × win_probability
commit_usd = zenith_face_value if commit_eligible else 0
gap_to_target = 5,000,000 - Σ(weighted_fy27)
```

## How the Dashboard Uses It

### Daily Briefing Integration

The briefing page can pull:
- **Pipeline snapshot** — total face, weighted, and commit values
- **Recent deal changes** — deals updated in the last 7 days
- **Upcoming decisions** — deals with decision dates in the next 30 days
- **Alerts** — no commits, large gap to target, double-count warnings

### Proposal Genie Integration

When writing a proposal, the AI can query:
- **Deal context** — full deal details, AOP notes, intel gaps
- **Related deals** — same stream, prime, or double-count group
- **Contact info** — military rank, title, phone, mobile
- **Competitive intel** — competing_not_teamed flag, prime relationships

### Vector Lake Indexing

Run `POST /api/ninjapipe` to index all CRM deals into the Vector Lake for semantic search. This makes CRM data queryable through the chat interface.

## AOP Fields

The integration supports these custom CRM fields for AOP alignment:

| Field | Type | Description |
|---|---|---|
| `deal_stage` | enum | engaged/proposed/negotiating/awarded/contracted/lost |
| `aop_stream` | enum | Software, GBS Telescope, Space based Systems, Payloads, Processing Capability, Data services |
| `strategy_path` | enum | STTR_SBIR_transition, APFIT_production, Prime_sub, Data_JCO, etc. |
| `zenith_share_pct` | number | % of deal value attributed to Zenith |
| `commit_eligible` | boolean | True only if contracted/obligated |
| `commit_usd` | money | Amount obligated to Zenith |
| `aop_fy_bias` | enum | FY27/FY28/FY29/FY30 |
| `decision_date` | date | Expected decision date |
| `intel_gaps` | text | What we don't know yet |
| `aop_notes` | text | AOP alignment notes |
| `double_count_group` | text | Prevents double-counting (e.g., FLOKI_ANDROMEDA) |
| `prime_name` | text | Prime contractor name |
| `our_role` | enum | Prime, Sub_compete, Sub_teamed, Partner, Data_provider |

## Workspace AOP Settings

The integration uses these workspace-level settings:

```json
{
  "aop_fy_calendar": "USG_OCT_SEP",
  "aop_primary_currency": "USD",
  "aop_fy27_target_usd": 5000000,
  "stage_weights": {
    "engaged": 0.15,
    "proposed": 0.30,
    "negotiating": 0.60,
    "awarded": 0.85,
    "contracted": 1.0,
    "lost": 0.0,
    "on_hold": 0.1
  }
}
```

## Files

| File | Purpose |
|---|---|
| `src/lib/integrations/ninjapipe.ts` | API client, rate limiting, pipeline analytics |
| `src/app/api/ninjapipe/route.ts` | REST API endpoints |
| `.env.local` | API key storage (not committed) |

## Security Notes

- API key stored in `.env.local` (gitignored)
- All requests over HTTPS (required by NinjaPipe)
- Rate limited to 100 requests/minute
- No data sent to third parties — reads only
- CRM data stays within your workspace

## Troubleshooting

| Issue | Solution |
|---|---|
| "Not configured" error | Add `NINJAPIPE_API_KEY` to `.env.local` |
| 401 Unauthorized | Check API key is valid and not expired |
| 429 Rate Limited | Wait 60 seconds, integration auto-retries |
| Empty deals list | Check API key has correct workspace scope |
| Wrong deal values | Ensure CRM fields are populated (see AOP Fields above) |

## Future Enhancements

- [ ] Write-back: Update deal stages from the dashboard
- [ ] Real-time webhooks for deal changes
- [ ] Calendar sync for decision dates
- [ ] Contact enrichment from LinkedIn
- [ ] Pipeline charts and visualizations
- [ ] Automated weekly pipeline report generation
