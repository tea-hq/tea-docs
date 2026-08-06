---
title: Sessions and recovery
description: Durable SQLite sessions, branch/fork semantics, what survives restart, and backup guidance.
---

Durable sessions are stored in SQLite and reconstructed from canonical
append-only records. The TUI transcript, branch tree, statistics, and RPC views
are projections; none is a second source of truth.

## Selecting a session

```bash
tea --new
tea --continue
tea --session 0195a0b1-5e52-74b2-8c25-0aa7aa000031
tea --no-session --print 'one temporary task'
```

Sessions are scoped to the canonical workspace identity. `--continue` selects
the most recently updated durable session in that workspace. `/resume` and
`/session` provide the same operations interactively.

## What survives restart

Reopening restores:

- canonical transcript and last durable sequence;
- active branch and append-only branch graph;
- selected model and profile;
- compaction records and summaries;
- pending redacted approval request and its policy context;
- durable run interruption and checkpoint state.

Steering and follow-up display queues are intentionally ephemeral. Provider text
deltas and progress observations that were never committed are not reconstructed
as durable facts.

## Approval recovery

An approval decision is committed before tool execution resumes. Closing the
process while an approval is pending leaves the same request available after
reopen. A tool interrupted after side effects begin is recorded as uncertain and
is never replayed automatically.

Allow-for-session is not a workspace bypass. The grant is bounded by actor,
profile, session, tool and version, effects, access mode, and the persisted
resource locator constraint. See [Approvals](/tea-docs/safety/approvals/).

## Compaction and branches

`/compact` appends a summary through the configured summarizer while preserving
recent tool-call/result pairing. `/fork <message-id>` creates and activates a
new append-only branch; it never rewrites the parent. `/tree` renders canonical
branch records.

## Backup and inspection

The default database is `<state-dir>/sessions.sqlite3`. Stop the CLI before an
out-of-band backup so the SQLite database and side files form a consistent set.
Session data can contain source snippets, prompts, model output, tool
arguments, and command output even though credential values are excluded.
Protect backups as sensitive project data.
