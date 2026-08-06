---
title: JSONL/RPC protocol
description: The tea --rpc stdin/stdout automation interface — framing, requests, output, reconnect, and recovery.
---

`tea --rpc` exposes a process-local automation interface over stdin/stdout. It
is independent of the canonical agent protocol version even though event
payloads contain unchanged canonical envelopes.

## Framing and ownership

- Each frame is one compact JSON value followed by byte `LF`.
- A single `CR` immediately before `LF` is accepted.
- Input and output frames are capped at 1 MiB.
- RPC stdout contains frames only; diagnostics use stderr.
- The writer queue has bounded slots and a 500 ms enqueue/write/flush deadline.
- EOF, signal, disconnect, oversized/unframed input, or slow output terminates
  owned work and awaits shutdown.

The server first emits:

```json
{"rpcVersion":"1.0","type":"ready","sessionId":"...","workspaceId":"..."}
```

## Requests

Every request has `rpcVersion: "1.0"`, optional bounded string `id`, a
snake_case `type`, and an object `payload`:

```json
{"rpcVersion":"1.0","id":"p1","type":"prompt","payload":{"text":"inspect the changes"}}
{"rpcVersion":"1.0","id":"q1","type":"query_snapshot","payload":{"afterSequence":"12","limit":32}}
```

Supported mutations: `new_session`, `open_session`, `name_session`, `prompt`,
`steer`, `follow_up`, `abort`, `resolve_approval`, `set_model`, `compact`, and
`fork`.

Supported queries: `list_sessions`, `query_state`, `query_snapshot`,
`query_stats`, `query_tree`, `list_models`, and `list_mcp_servers`. Snapshot
limits are clamped to 64 records and default to 32.

Approval decisions serialize as the canonical `allow_once`, `allow_session`, or
`deny` values.

## Output

Correlated responses preserve the request `id`. Long-running prompt and approval
commands first receive `command_accepted`; completion later arrives as an
asynchronous `command_finished` frame. Runtime observations are emitted as
`event` frames containing an unchanged canonical event envelope.

A fast command completion can reach the writer before every observational event;
clients derive durable truth from snapshot records, not event timing.

A complete malformed LF frame receives one safe `parse_error`, after which the
next frame is processed. Stable error codes include `invalid_request`,
`unsupported_version`, `not_found`, `busy`, `policy_denied`, `persistence`,
`provider`, `cancelled`, and `internal`.

## Reconnect and recovery

After a session rebind, reconnect, or a detected sequence gap, issue
`query_snapshot` from the last durable `afterSequence` cursor and continue paging
until the returned tail is reached. Do not infer durable transcript state from
text deltas or `command_finished`.

An RPC connection owns its active work. Disconnect cancels that work, but
already committed session records and pending approvals remain recoverable from
a new process using the same state directory. See
[Sessions and recovery](/sessions/sessions/).

MCP list and reconnect responses expose only server ID, lifecycle state, stable
health code, descriptor digest, restart count, and frozen aliases. They never
include server descriptions, executable/argv, environment values, stderr, or
result text.
