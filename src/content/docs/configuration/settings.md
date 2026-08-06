---
title: Configuration
description: Configure the Tea CLI, TUI, tools, and application paths.
---

Most users can start with flags and add a settings file only for choices they
want to keep.

## Precedence

Tea resolves configuration from highest to lowest priority:

1. CLI flags
2. `TEA_*` environment values
3. trusted workspace `.tea/settings.json`
4. global `settings.json`
5. built-in defaults

Nested objects merge by field. `activeTools` replaces the list. Unknown fields
and unsupported schema versions are rejected. A workspace file cannot select
the host-owned session database path.

## Global settings

The default global file is `~/.tea/settings.json`. Settings are sparse, so keep
only values you intend to override:

```json
{
  "schemaVersion": 1,
  "provider": "openai",
  "model": "gpt-4o-mini",
  "activeTools": ["read", "write", "edit", "bash"],
  "tui": {
    "viewport": "inline",
    "collapseThinking": true
  }
}
```

The default tools are `read`, `write`, `edit`, and `bash`. `viewport` accepts
`inline` or `fullscreen`; `inline` is the default.

## Application paths

| Purpose | Default | Override |
| --- | --- | --- |
| Global config | `~/.tea` | `--config-dir`, `TEA_CONFIG_DIR` |
| Durable state | `~/.local/state/tea` | `--state-dir`, `TEA_STATE_DIR` |
| Global resources | `~/.local/share/tea` | `--data-dir`, `TEA_DATA_DIR` |

Sessions use `<state-dir>/sessions.sqlite3`; trust decisions use
`<state-dir>/project-trust.json`. Tests and automation should pass all three
directory flags to avoid reading a real user profile.

See the [CLI configuration reference](/tea-docs/configuration/cli-config-reference/)
for all fields and [Credentials and models](/tea-docs/configuration/credentials/) for
custom endpoints.
