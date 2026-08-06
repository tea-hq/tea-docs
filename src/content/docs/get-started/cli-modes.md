---
title: CLI modes and commands
description: Interactive, print, JSON event, and JSONL/RPC modes of the tea CLI, plus slash commands and exit codes.
---

Run `tea --help` for the authoritative flag list. Mode flags are mutually
exclusive; an interactive terminal selects the TUI by default, while piped stdin
selects print mode.

## Shared invocation

```text
tea [--print | --json | --rpc] [OPTIONS] [PROMPT]...
```

Common selectors include `--cwd`, `--provider`, `--model`, `--profile`,
repeatable/comma-separated `--tools`, repeatable `--context-file`, session
selection, application path overrides, `--session-db`, `--trust`, and `-v`.

Session selection is one of:

| Flag | Effect |
| --- | --- |
| `--new` | Create a durable session |
| `--continue` | Open the most recently updated session for the workspace |
| `--session <UUID>` | Open an exact durable session |
| `--no-session` | Use an in-memory SQLite store for this invocation |

Prompt arguments, workspace-confined `@file` values, and piped UTF-8 input are
joined under one bounded limit.

## Modes

### Interactive

```bash
tea --new --model gpt-5.4 --trust once
tea --continue --trust ignore 'inspect the current changes'
```

The TUI streams text, thinking, tool activity, approvals, queues, usage, and
session state. Enter submits while idle and steers an active run; Alt+Enter
queues a follow-up.

### Print

```bash
tea --print --trust ignore 'summarize this repository'
printf '%s' 'explain the tests' | tea --print --trust ignore
```

Stdout contains only the final assistant text and one LF. Diagnostics use
stderr. Thinking, tools, ANSI escapes, and startup banners never enter stdout.

### JSON event stream

```bash
tea --json --trust ignore 'inspect and explain'
```

The first LF-delimited value is a versioned stream header; later values are
unchanged canonical event envelopes. Each line is independently parseable.

### JSONL/RPC

```bash
tea --rpc --continue --trust ignore
```

RPC accepts prompts only through request frames. See
[JSONL/RPC protocol](/tea-docs/automation/rpc/) for framing, request types, bounds, and
reconnect behavior.

## Slash commands

| Command | Effect |
| --- | --- |
| `/new` | Create and select a new durable session |
| `/resume [session-id]` | Open a session or the session selector |
| `/session` | Open the session selector |
| `/name [text]` | Set or clear the selected session name |
| `/model [model-id]` | Select a model or open the model selector |
| `/reasoning [level]` | Select reasoning effort or open its selector |
| `/compact` | Compact through the configured summarizer |
| `/tree` | Open the append-only branch tree |
| `/fork <message-id>` | Fork and activate a branch from a durable message |
| `/image <path>` | Attach an explicit workspace image |
| `/image remove <index>` | Remove one composer attachment |
| `/image clear` | Remove all composer attachments |
| `/copy` | Copy the latest assistant response |
| `/mcp` | Show safe MCP health and frozen local aliases |
| `/mcp reconnect <server-id>` | Reconnect one server only when discovery matches its frozen catalog |
| `/help` | Show command help |
| `/quit` | Restore the terminal and exit |

MCP reconnect never changes a live registry and never replays an in-flight call.
See [Using the TUI](/tea-docs/cli/tui/) for the timeline, composer, approval, selector,
and keyboard workflow.

## Exit codes

| Code | Category |
| ---: | --- |
| `2` | Usage |
| `3` | Trust or configuration |
| `4` | Provider |
| `5` | Policy or approval |
| `6` | Cancellation or broken output |
| `70` | Internal or persistence failure |
