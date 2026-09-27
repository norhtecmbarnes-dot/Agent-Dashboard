# Chapter 22: Freebuff — Your Free AI Coding Agent

*Read this after Chapter 21 (the talk). Your dashboard answers questions, researches, and runs its own little computer. But there is one job it was never built for: sitting inside a codebase and changing it. For that you want a coding agent — and the good news is the best one on that side of the fence is free. This chapter is about Freebuff: what it is, how to feed it skills, how to make it fork a repo and open a pull request while you watch, and how to do all of that without giving away more access than you meant to.*

You've built a private AI dashboard. You've connected it to open models, taught it your documents, and given it a terminal of its own. Now someone hands you a repository and says: *fix this bug*. Your dashboard could probably do it — but it wasn't designed for that. Coding agents are a different species, and it's worth understanding why before you meet the one we'll use.

## What You'll Learn in This Chapter

- What a coding agent is — and how it differs from a chatbot or a copilot autocomplete
- What Freebuff is, and why "free" here means *free*, not *trial*
- How to discover and install reusable agent skills from GitHub with `npx skills`
- How to have the agent fork a repository, patch it, and open a pull request
- A worked example: forking OpenMuse, installing its contribution skill, and shipping a patch
- The safety habits that keep an agent with write access to your repos from becoming a liability

## The Three Brains, Revisited

Chapter 21 gave you the one-line map: **API = renting someone else's AI. CLI = running your own. MCP = giving an AI safe access to your stuff.** Here's a second axis that matters just as much: *what the AI is for*.

A **chatbot** answers questions. A **copilot** suggests the next few lines while you type. A **coding agent** is something else again: you give it an outcome — *make the tests pass*, *add a settings page*, *upgrade this dependency* — and it plans, edits files, runs commands, reads the errors, and tries again. It holds the keyboard, not just the pen.

That's a lot of power, and it's exactly why coding agents live or die by their boundaries. The best ones work in small, reviewable steps and ask before they push anything anywhere. Hold that thought; we'll come back to it.

## What Freebuff Is

**Freebuff** is a free AI coding agent that works in chat like an IDE copilot — except the chat is the whole IDE. You describe a task in plain English, and the agent works directly against your repository: it reads the code, proposes changes, writes the files, and runs the commands to prove the changes work. Sessions run `git` and `gh` from the project root, which means the full contribution workflow — branch, commit, push, pull request — is available to the agent, on your say-so.

The pitch is in the name. There is no subscription, no per-seat pricing, no trial clock. You connect your GitHub account and work. If you've been paying monthly for an autocomplete that occasionally writes your tests, this chapter will feel like finding money in a coat pocket.

**Freebuff is one option, not the only one.** The same workflows in this chapter work with other coding agents. Open-source and free options include **opencode** (a terminal-native coding agent) and the agent built into your own dashboard. Paid options — **Claude Code**, GitHub Copilot's agent mode, and similar — trade a subscription for frontier-model quality. The skills-and-PR workflow below is agent-agnostic: what changes between tools is mostly the interface and the model, not the loop of *plan → edit → run → PR*. Pick the tool that fits your budget and privacy posture; everything you learn here transfers.

And it fits the philosophy of everything else in this book: **your repos, your machine, your rules.** Freebuff doesn't hold your code hostage in a cloud workspace. It works where your code already lives.

## Teaching the Agent New Tricks: Skills

Here's the feature that separates an agent you *use* from an agent you *train*: **skills**.

A skill is a packaged set of instructions — a miniature operating manual — that an agent can load into its context. "How this repo does code review." "How releases are cut in this project." "The house style for commit messages." Instead of re-explaining your conventions to a fresh chat every time, you install the skill once and load it by name.

Skills live on GitHub, and you manage them with the `skills` CLI.

### Discovering skills

```bash
npx skills find <query>
```

Search the way you'd search a package registry. `npx skills find "code review"` comes back with a list of skills, each with its owner/repo — the same way you'd read an npm package's author before installing it. *Read before you install.* A skill is instructions that will enter your agent's context; know whose instructions they are.

### Installing a skill

```bash
npx skills add <owner/repo> --skill <name> --yes
```

The skill lands in `.agents/skills/` inside your project — a folder you can open and read like any other code. Each skill is a directory with its instructions in it. This is worth saying twice because it's the whole safety model in one sentence: **skills are files on your disk, not magic.** After every install, `ls .agents/skills/` and skim what arrived.

### Loading a skill

In a session, ask for the skill by name: *"Using the contributing skill, …"* The agent loads those instructions and follows them. One repo can hold several skills; a developer with a dozen projects can give each project its own house rules.

This is the GitHub-applications idea in miniature: capability, published as repositories, versioned and forkable like everything else on GitHub. When someone improves the skill, you pull the improvement. When you improve it, you publish yours.

## Forking Repos and Opening Pull Requests

Because Freebuff sessions run `git`/`gh` from the project root, the classic open-source contribution loop is something you can simply *ask for*:

1. **Fork** — "Fork `CopilotKit/OpenMuse`" — the agent forks it under your account
2. **Branch and patch** — the agent clones, creates a branch, makes the change
3. **Pull request** — "Open a PR against upstream" — the agent opens it with a description
4. **You review** — the PR appears on GitHub like any other; comment, request changes, or merge

Notice what the agent does *not* do by default: it does not push to the upstream repo, it does not merge, and it does not do any of it without being asked. You are the release manager. The agent is the very fast junior developer who never gets tired of the fifth revision.

## Worked Example: Fork OpenMuse, Install Its Skill, Ship a Patch

Let's do it for real. OpenMuse — the runtime inside your Agent Dashboard — is a real GitHub repository with real contribution conventions. We'll fix a doc typo, which sounds trivial and is actually the perfect first contribution: small enough to review in ten seconds, real enough that the whole machinery runs end to end.

**Step 1 — Fork and clone.** In Freebuff:

> "Fork CopilotKit/OpenMuse and clone my fork."

**Step 2 — Install the project's skill.** Many projects publish their contribution guide as a skill. Search first:

```bash
npx skills find "openmuse"
```

Then install:

```bash
npx skills add CopilotKit/OpenMuse --skill contributing --yes
```

Check what arrived:

```bash
ls .agents/skills/
```

Read the skill. It will say things like *run the linter before committing* and *keep PRs small* — the conventions the maintainers actually care about. Installing it means the agent follows them without you remembering to.

**Step 3 — Ship the patch.** In Freebuff:

> "Using the contributing skill: fix the typo in docs/Model-Setup.md, commit on a branch named `docs/typo-fix`, and open a PR."

The agent loads the skill, makes the edit, commits with the house style, pushes to your fork, and opens the PR against upstream. You get a URL. Open it, read the diff — one line, one fix — and merge if you're proud of it.

**Step 4 — Reflect.** Look at what just happened. You found a project, taught your agent its customs in one command, and contributed a fix through the standard open-source pipeline, in less time than it takes to read the contributing guide yourself. That's the compounding return on skills: each installed skill makes every future session in that repo smarter.

## Safety Notes: An Agent With Write Access

Everything in this chapter hands the agent *write* access — to files, to commits, to pull requests. That's the point, and it's also the risk. Three habits keep it safe.

**Confirm what gets installed.** `npx skills add` is an invitation for instructions to enter your agent's context. Install from owners you trust; read the skill folder after install; delete anything that doesn't earn its place. The `--yes` flag skips the confirmation prompt — use it when you've already decided, not instead of deciding.

**The bot never pushes without being asked.** Keep it that way. Review the diff before you approve a push or a PR — the same way you review receipts on your dashboard's terminal commands. If an agent ever pushes something you didn't ask for, that's not a quirk to tolerate; that's the end of the experiment until you understand what happened.

**Secrets stay local.** Freebuff talks to GitHub with *your* credentials through `git`/`gh`. That means tokens, keys, and `.env` files in your repos are within the agent's reach the moment you ask it to do something risky. Keep secrets out of repos in the first place — and never paste a token into chat, in any tool, ever.

## How This Fits Your Dashboard

By now you have a small fleet, and it's worth knowing which ship to send:

- **Agent Dashboard (OpenMuse)** — the personal agent: research, browser, terminal, phone. Send it when the task is *go find out and report back.*
- **Freebuff** — the coding agent: repos, branches, PRs, skills. Send it when the task is *change this codebase.*
- **The book's earlier chapters** — the foundation: local models, your documents, your privacy.

They share one architecture of trust: open tools running where you can watch them, doing what you asked, showing receipts. The more of your work runs on that architecture, the less of it depends on someone else's subscription box staying open.

---

*In the next chapter we'll look at where all of this is heading — and how to keep your dashboard useful as the models underneath it keep getting better.*