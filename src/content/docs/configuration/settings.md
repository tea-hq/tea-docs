---
title: Configuration
description: Settings precedence, application paths, and the settings file format for the tea CLI.
---

> **Track:** `next` pre-release.

## Precedence

Settings are resolved deterministically in this order, from highest to lowest:

1. CLI flags
2. `TEA_*` environment values
3. trusted workspace `.tea/settings.json`
4. global `settings.json`
5. built-in defaults

Nested `tui` and `resources` objects merge by field. `activeTools` replaces the
list instead of extending it. Unknown fields and unsupported schema versions fail
closed. Project configuration can never choose the host-owned session database
path.

## Application paths

The defaults below are relative to the process home directory:

| Purpose | Default | Override |
| --- | --- | --- |
| Global config | `~/.config/tea` | `--config-dir`, `TEA_CONFIG_DIR` |
| Durable state | `~/.local/state/tea` | `--state-dir`, `TEA_STATE_DIR` |
| Global resources | `~/.local/share/tea` | `--data-dir`, `TEA_DATA_DIR` |

The global settings file is `<config-dir>/settings.json`. Durable sessions use
`<state-dir>/sessions.sqlite3`, project trust uses
`<state-dir>/project-trust.json`, and oversized shell output is retained below
`<state-dir>/bash-output/`. Tests and automation should pass all three directory
flags so they never read a real user home.

## Settings format

Settings files are sparse JSON overlays with `schemaVersion: 1`:

```json
{
  "schemaVersion": 1,
  "provider": "openai",
  "model": "gpt-5.4",
  "thinking": "medium",
  "activeTools": ["read", "write", "edit", "bash"],
  "maxRetries": 2,
  "compactionEnabled": false,
  "projectTrust": "ask",
  "tui": {
    "viewport": "fullscreen",
    "collapseThinking": false,
    "submitKey": "enter",
    "newlineKey": "shift+enter",
    "abortKey": "escape"
  },
  "resources": {
    "contextFiles": true,
    "skillPaths": [],
    "promptTemplates": true
  }
}
```

Supported `projectTrust` values are `ask`, `ignore`, and `reject`. The TUI also
accepts `viewport: "inline"`; fullscreen is the default and best-tested mode.

## Project trust and resources

The presence of `AGENTS.md`, `CLAUDE.md`, or `.tea/` marks a workspace as having
project-local resources. Before trust, the CLI does not load project settings,
skills, or prompt templates.

| Flag | Behavior |
| --- | --- |
| `--trust default` | Use a saved decision; otherwise headless use fails closed |
| `--trust once` | Load project resources for this invocation only |
| `--trust persist` | Save trust for the canonical workspace identity |
| `--trust reject` | Reject project-local resources |
| `--trust ignore` | Continue without project-local resources |

Trust permits loading text; it does not make the text safe. See
[Workspace trust](/safety/trust/) and [Security](/safety/security/).
