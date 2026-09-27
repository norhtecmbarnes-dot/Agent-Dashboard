# Freebuff — Your Free AI Coding Agent

> This guide accompanies **Chapter 22: Freebuff** in the book (`book/Chapter-22-Freebuff.md`).

Freebuff is a **free** AI coding agent that works in chat like an IDE copilot: you describe a task, it reads your repo, plans, edits files, and runs commands — then shows you the result.

**It's one option among several.** The same skills-and-PR workflows work with other coding agents:

| Agent | Cost | Notes |
|---|---|---|
| **Freebuff** | Free | Chat-first, GitHub-native, skills via `npx skills` |
| **opencode** | Free (open source) | Terminal-native agent; can drive local models (e.g. your Ollama gpt-oss) |
| **Claude Code** | Paid subscription | Frontier-model quality; terminal-based |
| **GitHub Copilot agent mode** | Paid subscription | Integrated in VS Code / github.com |
| **Your own dashboard** | Free (local) | OpenMuse agent on its Docker computer — good for repo tasks that don't need a dedicated coding agent |

The workflow below (install skills → fork → patch → PR) is agent-agnostic; this guide just uses Freebuff as the worked example.

## What Freebuff is

- A **chat-first coding agent** — no IDE required; you talk to it the way you talk to your dashboard
- **Free** — no subscription; it works against your GitHub account
- **Repo-aware** — sessions run `git`/`gh` from the project root, so it can branch, commit, push (when asked), and open PRs

## Installing GitHub applications & skills

Skills are reusable agent capabilities published on GitHub. Freebuff discovers and installs them with the `skills` CLI.

### Discover skills

```bash
npx skills find <query>
```

Example: `npx skills find "code review"` lists review-related skills with their owner/repo.

### Install a skill

```bash
npx skills add <owner/repo> --skill <name> --yes
```

Skills install into `.agents/skills/` in your project. Load them by name in a session and the agent picks them up — a review skill, a release skill, a docs skill, whatever you installed.

### Confirm what got installed

After installing, check:

```bash
ls .agents/skills/
```

Each skill is a folder with its instructions. **Read them once** — you should always know what you just gave the agent permission to do.

## Forking a repo and opening a PR

Freebuff sessions run `git`/`gh` from the project root, so contribution flows work like they do for you:

1. Ask Freebuff to **fork** the repo you want to contribute to
2. Have it clone the fork, create a branch, and make the change
3. Ask it to open a **PR against the upstream repo**
4. Review the PR on GitHub like any other

The agent never pushes without being asked — keep it that way.

## Worked example — patch OpenMuse

```bash
# 1. Fork OpenMuse
#    (in Freebuff) "Fork CopilotKit/OpenMuse and clone my fork"

# 2. Install its contribution skill
npx skills find "openmuse"
npx skills add CopilotKit/OpenMuse --skill contributing --yes

# 3. Load the skill and ship a patch
#    (in Freebuff) "Using the contributing skill: fix the typo in
#     docs/Model-Setup.md, commit on a branch, and open a PR"
```

You'll get a PR URL you can review and merge — or comment on for another round.

## Safety notes

- **Confirm what gets installed.** `npx skills add` is permission for instructions to enter your agent's context. Install from repos you trust; skim the skill folder after install.
- **The bot never pushes without being asked.** Review the diff before you approve a push or a PR.
- **Secrets stay local.** Freebuff works with your GitHub credentials via `gh`/`git`; never paste tokens into chat.

## How this fits Agent Dashboard

Freebuff is the **coding agent** for repos; Agent Dashboard is the **personal agent** for everything else (browser, terminal, phone). They share a philosophy: open tools, your machine, your rules. Use Freebuff when the task is "change this codebase," use your dashboard when the task is "go find out and report back."