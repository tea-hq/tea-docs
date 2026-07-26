---
title: Protocol and RPC boundary
description: The canonical protocol 1.0 contracts, version domains, support windows, and the local JSONL/RPC transport boundary.
---

> **Track:** `next` pre-release.

`tea-protocol` is the canonical, provider-neutral protocol layer. It is limited
to pure domain values and JSON serialization contracts; it does not execute
models or tools, persist sessions, evaluate policy, manage async tasks, or
depend on Tokio. Protocol versions are independent from crate SemVer.

## Protocol surface

The crate owns four distinct contracts:

- `CommandEnvelope` and `AgentCommand` — requested actions a host accepts or
  rejects;
- `EventEnvelope` and `AgentEvent` — observable lifecycle and streaming output;
- `RecordEnvelope` and `SessionRecord` — required append-only facts for replay
  and recovery;
- `ProtocolErrorEnvelope` and `ProtocolError` — stable machine-readable failures
  with safe diagnostics.

Shared types include UUIDv7 strong IDs, decimal-string `SessionSequence` for
authoritative session-local ordering, RFC 3339 UTC millisecond timestamps, user /
assistant / tool-result messages, text / thinking / image / tool-call content
blocks, exact decimal cost, JavaScript-safe token usage, and bounded
reverse-domain metadata. Canonical JSON uses `camelCase` fields, a `type`
discriminator, and `snake_case` discriminator values.

## Compatibility rules

Within protocol major 1:

- unknown optional object fields on known types are ignored;
- bounded namespaced metadata is preserved at extension points;
- unknown commands are rejected as `unsupported_command`;
- unknown durable records stop replay as `unsupported_record`;
- unknown observable events are skippable only when their envelope declares
  `compatibility: "skippable_observation"`;
- unknown enum values are rejected unless a type documents preservation;
- duplicate JSON keys are rejected recursively at envelope and metadata
  boundaries.

## Events versus records

Text deltas and tool progress can be transient observations. Final messages,
approval transitions, tool execution boundaries, interruption state, branch
changes, compaction provenance, and turn checkpoints are durable records. Every
Protocol 1.0 durable record kind is required for replay and cannot be skipped.
`SessionSequence` — not UUID or timestamp ordering — drives replay.

## Version domains and support windows

`tea-rs` tracks independent crate, protocol, SQLite schema, and session archive
versions. A compatible change in one domain does not imply compatibility in
another.

- **Protocol:** writers emit `1.0`; readers accept known envelopes from protocol
  major 1. An additive minor must retain all existing fields and discriminators
  and add a new fixture set; a new required durable state, a changed field
  meaning, or protocol major 2 requires a new migration decision and is never
  silently accepted.
- **SQLite:** schema v2 is current. Opening a v1 database upgrades it
  transactionally by adding the session catalog and recording v2; authoritative
  record envelopes are not rewritten. Migrations are monotonic and forward-only;
  unknown future schema versions are rejected.
- **Session archive:** format v1 is a separate JSON interchange format, fails
  closed for unknown formats or record types, and requires an explicit import
  path per supported predecessor.

Compatibility fixtures are immutable inputs; new behavior receives a new
versioned fixture directory rather than rewriting an earlier version.

## Hosts, storage, and the RPC boundary

The supported 1.0 surface is fixed by the compatibility matrix:

- In-process `AgentRuntime` — canonical commands, bounded subscriptions,
  profiles, native tools, approvals, snapshots, and resume with a compatible
  store.
- CLI JSONL/RPC — local stdin/stdout framing, prompt control, approval
  resolution, snapshots, reconnect, and durable session resume. Process-local
  transport only; clients use snapshots rather than event timing as durable truth.
- In-memory and SQLite session stores — default embedding semantics and durable
  replay respectively.
- MCP — explicitly configured local stdio only.

`tea --rpc` is independent of the canonical protocol version even though event
payloads contain unchanged canonical envelopes. See
[JSONL/RPC protocol](/automation/rpc/) for framing, request types, output, and
reconnect behavior.
