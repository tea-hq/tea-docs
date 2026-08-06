---
title: Using the TUI
description: Work efficiently with the Tea timeline, composer, tools, approvals, sessions, and selectors.
---

Run `tea` with terminal input and output to enter the interactive TUI. The TUI
and headless CLI modes belong to the same `tea-cli` product and use the same
coding service, policy engine, canonical session state, and SQLite store.

```bash
tea --cwd /path/to/project --new
```

Read [installation and first run](/tea-docs/get-started/install/) before starting Tea in
a new workspace.

## Screen model

The upper timeline contains submitted prompts, assistant Markdown, reasoning,
tool lifecycle rows, diffs, sources, notices, queued input, and durable state
changes. The composer remains at the bottom while work streams above it.

- A submitted prompt appears immediately.
- Before visible model output, a compact activity row shows observed stage,
  elapsed time, and the latest tool progress.
- Routine tool calls stay compact; `Ctrl+G` toggles available details.
- `Page Up`/`Page Down` or `Shift+Up`/`Shift+Down` browse history without losing
  the draft. `Ctrl+End` returns to the live tail.
- Assistant Markdown is rendered as terminal structure. HTML and terminal
  control sequences are never interpreted.

## Composer and active runs

| Action | Default binding |
| --- | --- |
| Submit while idle or steer the active run | `Enter` |
| Insert a newline | `Shift+Enter` |
| Queue a follow-up while running | `Alt+Enter` |
| Abort the active run | `Escape` |
| Retrieve queued text | `Ctrl+R` |
| Select a model | `Ctrl+O` |
| Toggle reasoning visibility | `Ctrl+T` |
| Copy the latest assistant response | `Ctrl+Y` |
| Exit while idle | `Ctrl+D` |

Steering is delivered at the next safe model boundary. Follow-ups remain queued
for a later turn. Bindings can be changed in the `tui` settings object;
ambiguous bindings are rejected during configuration validation.

## Commands and selectors

Typing `/` opens a bounded completion list. Selecting an item writes it into the
composer without running it; normal submission remains explicit.

Frequently used commands include:

| Command | Purpose |
| --- | --- |
| `/new`, `/resume`, `/session` | Create, resume, or select a durable session |
| `/model`, `/reasoning` | Select the model and current-session reasoning effort |
| `/compact` | Append a compacted summary through the configured summarizer |
| `/tree`, `/fork <message-id>` | Inspect or create append-only branches |
| `/image <path>` | Attach one explicit workspace image when the model supports it |
| `/copy` | Copy the latest assistant response |
| `/mcp` | Inspect safe MCP health and frozen aliases |
| `/help`, `/quit` | Show help or restore the terminal and exit |

Trusted prompt templates appear as `/<template>` and trusted skills as
`/skill:<name>`. Project resources are loaded only after the applicable
workspace-trust decision.

## Approvals

When policy asks for authorization, the approval panel takes input priority. It
shows the persisted redacted tool, target, effects, resources, expiry, and
arguments. Inspect the request before choosing allow once, a bounded session
grant, or deny. `Escape` never silently denies an approval.

An approval authorizes the recorded operation; it does not sandbox native tools
or MCP servers. Read [Approvals and grants](/tea-docs/safety/approvals/) and
[Security boundaries](/tea-docs/safety/security/) before enabling mutating tools.

## Sessions and recovery

`/session` opens the searchable session selector, and `/tree` opens the current
branch selector. Switching keeps the current draft until submission. Pending
approvals and canonical records survive restart; ephemeral steering and
follow-up display queues do not.

Continue with [Sessions and recovery](/tea-docs/sessions/sessions/),
[CLI modes and commands](/tea-docs/get-started/cli-modes/), and
[Configuration](/tea-docs/configuration/settings/).

## Design influence

The interaction model is inspired by the OpenAI Codex TUI: semantic timeline
cells, a stable bottom composer, compact tool lifecycle rows, follow-tail
scrolling, and focused approval overlays. Tea is an independent implementation
with its own runtime, protocol, rendering components, commands, and persistence.
