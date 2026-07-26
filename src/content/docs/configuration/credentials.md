---
title: Credentials and model access
description: How the tea CLI resolves provider credentials and model configuration without persisting secrets.
---

> **Track:** `next` pre-release.

The live model adapter reads credentials only from the injected environment.
Resolved settings, events, session records, archives, and SQLite rows are
designed to remain secret-free. Never put `TEA_OPENAI_API_KEY` in global or
project settings.

## Provider environment

| Variable | Meaning |
| --- | --- |
| `TEA_PROVIDER` | Provider selector; currently `openai` |
| `TEA_MODEL` | Product-level model override |
| `TEA_OPENAI_API_KEY` | Required secret |
| `TEA_OPENAI_MODEL` | OpenAI-compatible model selector |
| `TEA_OPENAI_BASE_URL` | Optional API base URL |
| `TEA_OPENAI_API_KEY_HEADER` | Optional credential header name |
| `TEA_OPENAI_API_KEY_PREFIX` | Optional credential prefix |
| `TEA_OPENAI_ORG_ID` | Optional OpenAI organization header |
| `TEA_OPENAI_PROJECT_ID` | Optional OpenAI project header |
| `TEA_OPENAI_REASONING_EFFORT` | `low`, `medium`, or `high` |
| `TEA_OPENAI_VISION` | `1`/`true` to advertise image input |
| `TEA_OPENAI_REQUEST_TIMEOUT_MS` | Positive request timeout in milliseconds |

## Secret handling

- Provider credentials are resolved from `TEA_*` environment values and are not
  written to resolved settings, events, sessions, SQLite, archives, fixtures, or
  normal errors.
- Do not place secrets in prompts, source files, settings files, shell
  arguments, or tool output — those are legitimate session content.
- Print stdout and JSON/RPC stdout have strict ownership contracts, but stderr,
  terminal scrollback, shell spill files, session databases, and backups may
  contain project data. Apply appropriate file permissions and retention.

## Model port

The model layer is provider-neutral: a `ModelRequest` carries the model, system
prompt, messages, tool definitions, reasoning options, output limit, and
request metadata. Provider adapters translate canonical messages and tool
schemas, normalize stop reasons and streaming deltas, preserve continuation
signatures when required, and extract usage and cost.

`ModelProvider::stream` receives an immutable request and a separate
project-owned cancellation scope. It returns a lazy object-safe stream and does
not expose provider SDK values. The kernel is responsible for agent-level
retries and must not inspect raw HTTP payloads.

No concrete provider SDK type appears in public core APIs; provider-specific
payloads never enter stable core fields.
