# Linux Computer — the agent's own sandboxed machine

Agent Dashboard's most powerful feature is also its most contained one: the agent gets **its own Linux computer** — a Docker container it can run shell commands in — while your actual machine stays out of reach.

## What it is

OpenMuse ships a container image (`apps/computer`) built for exactly this: a minimal Linux environment with a shell, a `/workspace` directory, and nothing else. When enabled, the web UI shows **Computer → Terminal** panels, and the agent can start the computer, run commands, and read the output.

## Build and enable

```bash
cd OpenMuse
docker build -t openmuse-computer:local apps/computer
```

In `.env`:

```env
COMPUTER_ENABLED=true
```

Restart `pnpm dev`, then in the web UI: **Computer → Terminal → Start computer**.

The API process must be able to reach the Docker CLI/engine — **Docker Desktop on Windows** works fine (make sure it's running).

## Verify

```bash
docker ps                                       # openmuse-computer container appears when started
docker run --rm openmuse-computer:local whoami  # prints a nonroot user
```

Then from the UI terminal: write a file in the terminal, switch to **Files** — it's there. Files persist across restarts via the `/workspace` volume.

## Security boundaries (by design, not optional)

| Boundary | Meaning |
|---|---|
| **Nonroot container** | Commands run as an unprivileged user |
| **No host mounts** | The container cannot see your drives, folders, or files |
| **No credentials** | Nothing from your environment (tokens, keys, SSH) is passed in |
| **Networking disabled** | The terminal has no internet. Web access happens through the **browser worker** only |
| **30-second command limit** | Long-running commands are cut off |
| **Receipts** | Every command's output and exit code is saved so you can audit what the agent did |

What this means in practice: the agent can *compute* for you (write scripts, process files in its workspace, install packages in-container if the image allows) but it cannot *touch your machine* or *sneak onto the network* from the terminal.

## Common questions

**Can I mount my project folder into it?** No — that's deliberately unsupported. Copy files in via the Files panel.

**Can the terminal reach the internet?** No. Ask the agent to use its browser instead; that's what the browser worker is for.

**Where do files live?** In a named Docker volume mounted at `/workspace`. They survive container restarts; `docker volume` commands manage them.

**Is 30 seconds enough?** For most commands, yes. For long builds, the pattern is: run in background inside the container, poll for output — within the same limits.

## Receipts

Every terminal command produces a receipt: the command, its output, and the exit code. Check them in the UI after a session to review exactly what ran — this is your audit trail for anything the agent did on its computer.

## Credits

The sandboxed computer design in this doc — nonroot container, no mounts, no network, command receipts — is OpenMuse's design (`apps/computer` in the [OpenMuse](https://github.com/CopilotKit/OpenMuse) repo, MIT). This guide just explains how to build and use it.