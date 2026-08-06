---
title: CLI configuration reference
description: Flags, settings fields, paths, environment variables, and project resources supported by Tea.
---

Run `tea --help` for the exact flag syntax installed on your machine.

## Invocation

```text
tea [--print | --json | --rpc] [OPTIONS] [PROMPT]...
```

| Mode | Output |
| --- | --- |
| default TTY | Interactive TUI |
| `--print` | Final assistant text only |
| `--json` | Header followed by canonical event envelopes, one JSON value per line |
| `--rpc` | Bidirectional JSONL/RPC over stdin and stdout |

Mode flags are mutually exclusive. Piped input selects print mode when no mode
is specified.

## Common flags

| Flag | Purpose |
| --- | --- |
| `--cwd <DIR>` | Select the workspace |
| `--provider <ID>` | Select a built-in or configured Provider |
| `--model <ID>` | Select a model |
| `--api-key <SECRET>` | Override the Provider key for this invocation |
| `--profile <ID>` | Select a registered product Profile |
| `--tools <A,B>` | Replace active tools; repeatable |
| `--context-file <PATH>` | Add a workspace-relative context file; repeatable |
| `--trust <MODE>` | Set project-resource trust behavior |
| `-v`, `--verbose` | Increase stderr diagnostics |

Session flags are mutually exclusive:

| Flag | Purpose |
| --- | --- |
| `--new` | Create a durable session |
| `--continue` | Open the most recently updated workspace session |
| `--session <UUID>` | Open an exact durable session |
| `--no-session` | Use an in-memory SQLite database for this invocation |

Application path overrides are `--config-dir`, `--state-dir`, `--data-dir`, and
`--session-db`. Application paths must be absolute; a relative session database
is resolved below the state directory.

## Configuration precedence

From highest to lowest:

1. CLI flags
2. environment values
3. trusted workspace `.tea/settings.json`
4. global `~/.tea/settings.json`
5. built-in defaults

Settings files are strict JSON with `schemaVersion: 1`. Unknown fields are
rejected. Nested objects merge by field; `activeTools` replaces the list.

## Settings fields

| Field | Default | Notes |
| --- | --- | --- |
| `provider` | `openai` | Provider ID |
| `model` | `gpt-5.4` | Model ID |
| `thinking` | `medium` | `off`, `low`, `medium`, `high` |
| `activeTools` | `read`, `write`, `edit`, `bash` | Unique list, up to 64 tools |
| `sessionDatabase` | platform path | Not accepted from project settings |
| `maxRetries` | `3` | Maximum 7 |
| `retryBaseDelayMs` | `2000` | Delay before the first model retry |
| `retryMaxDelayMs` | `60000` | Maximum retry delay, including Provider hints |
| `compactionEnabled` | `false` | Enable automatic compaction |
| `projectTrust` | `ask` | `ask`, `ignore`, or `reject` |
| `tui` | object | Display and keybinding overrides |
| `resources` | object | Context files, skill paths, and prompt templates |
| `mcpServers` | empty | Explicit local stdio MCP servers |
| `webSearch`, `webFetch` | disabled client backends | Explicit web-tool routing and limits |

### TUI fields

| Field | Default |
| --- | --- |
| `viewport` | `inline` |
| `collapseThinking` | `false` |
| `reducedMotion` | `false` |
| `submitKey` / `steeringKey` | `enter` |
| `newlineKey` | `shift+enter` |
| `followUpKey` | `alt+enter` |
| `abortKey` | `escape` |
| `modelKey` | `ctrl+o` |
| `toggleThinkingKey` / `toggleToolsKey` | `ctrl+t` / `ctrl+g` |
| `copyKey` / `retrieveQueuedKey` | `ctrl+y` / `ctrl+r` |
| `clearKey` / `exitKey` | `ctrl+l` / `ctrl+d` |

Ambiguous bindings in the same interaction context are rejected.

### Resource fields

| Field | Default | Purpose |
| --- | --- | --- |
| `contextFiles` | `true` | Load discovered instruction files |
| `skillPaths` | empty | Add workspace-relative skill roots |
| `promptTemplates` | `true` | Load prompt templates |

## Application files

| File | Default location |
| --- | --- |
| Global settings | `~/.tea/settings.json` |
| Provider definitions | `~/.tea/providers.json` |
| Sessions | `~/.local/state/tea/sessions.sqlite3` |
| Trust decisions | `~/.local/state/tea/project-trust.json` |
| Global skills | `~/.local/share/tea/skills/` |
| Global prompts | `~/.local/share/tea/prompts/` |

Override the three roots with `TEA_CONFIG_DIR`, `TEA_STATE_DIR`, and
`TEA_DATA_DIR` or their matching CLI flags.

## Environment values

| Area | Variables |
| --- | --- |
| Selection | `TEA_PROVIDER`, `TEA_MODEL` |
| OpenAI-compatible | `TEA_OPENAI_API_KEY`, `TEA_OPENAI_MODEL`, `TEA_OPENAI_BASE_URL`, `TEA_OPENAI_API_MODE` |
| Anthropic | `TEA_ANTHROPIC_API_KEY`, `TEA_ANTHROPIC_MODEL`, `TEA_ANTHROPIC_BASE_URL`, `TEA_ANTHROPIC_API_VERSION` |
| Shell tool | `TEA_SHELL`, `TEA_SHELL_FLAG` |
| Display | `NO_COLOR`, `TERM=dumb` |

Additional adapter timeout, reasoning, header, and hosted-tool variables are
available; prefer [`providers.json`](/configuration/credentials/) when a custom
endpoint needs several persistent values.

## Project resources

A workspace containing `AGENTS.md`, `CLAUDE.md`, or `.tea/` has project-local
resources. Tea asks before loading `.tea/settings.json`, `.tea/providers.json`,
skills, or prompt templates. `--trust ignore` runs without those resources;
`--trust once` loads them for one invocation; `--trust persist` saves the trust
decision. See [Workspace trust](/safety/trust/).

MCP has additional required safety declarations. See
[MCP configuration](/mcp/configuration/).
