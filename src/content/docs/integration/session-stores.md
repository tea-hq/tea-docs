---
title: Session stores
description: Append-only session records, the in-memory reference store, the SQLite durable store, branches, recovery, and the archive interchange format.
---

> **Track:** `next` pre-release.

`tea-session` owns append-only session records, deterministic replay,
materialized state, branches, approval/grant journals, and storage contracts. It
is Tokio-free and contains no model provider, tool executor, filesystem, process,
network, database, or wall-clock implementation.

## Source of truth and replay

Canonical Protocol 1.0 `RecordEnvelope` values are authoritative. The
`SessionReducer` requires one `SessionCreated` record at sequence zero,
contiguous session-local sequences, globally unique IDs, matching tool
declarations and ordering, and valid checkpoint, interruption, cancellation,
compaction, and branch references. `MaterializedSessionState` is a rebuildable
projection exposing the active transcript and configuration, pending approvals,
tool recovery state, run terminals, checkpoints, compaction provenance, branch
summaries, and active branch. Reducer failures never partially mutate state.

## Branches and recovery

A branch-aware session places its root `branchId` on `SessionCreated`. Forks
clone the source projection at a durable record in source ancestry and become
active only after `ActiveBranchChanged`; they never rewrite source records or the
parent leaf. Fork points with pending approvals or incomplete tool calls are
rejected to avoid duplicating uncertain external effects. Existing Protocol 1.0
logs without a root branch remain replayable as legacy unbranched sessions.

A tool interrupted before a terminal result remains explicitly uncertain with its
execution target and idempotency recorded. Non-idempotent work is never replayed.
Provider streams become interrupted-run state rather than invented completed
messages.

## Append transactions

`SessionStore` is object-safe and returns project-owned boxed futures without
exposing Tokio. `InMemorySessionStore` is the semantic reference implementation.
An `AppendTransaction` is all-or-nothing: canonical appends use an expected
session sequence; typed approval/grant journals use an independent fact-count
revision; a grant issued by `AllowSession` is committed with the matching
resolution; revocation appends an immutable revoked grant rather than updating
authorization in place. Active non-revoked grants can be queried by actor across
sessions but remain policy candidates only — they cannot override a deny.

## SQLite durable store

`tea-session-sqlite` implements the `SessionStore` contract over a versioned,
append-only SQLite event log and reuses the shared append engine, so its
observable behavior is identical to the in-memory reference store. One row per
canonical record plus side tables for approval artifacts and grant-journal facts.
A unique index on `(session_id, sequence)` enforces expected-sequence conflicts;
a unique index on grant ids prevents cross-session duplicate issuance. The store
uses a single connection guarded by a mutex; appends run in `IMMEDIATE`
transactions. A stale expected sequence receives a `SequenceConflict`. After a
process restart, the durable log is the source of truth.

## Archive interchange

`SessionArchive` is a versioned JSON interchange/diagnostic format, not a
concurrent store. Decoding rejects duplicate keys and oversized collections,
preserves protocol-compatibility errors, and preflights complete canonical replay
and typed journals before one create transaction. Import never merges or renumbers
records. Deletion, retention, list/search indexes, compaction policy, and
automatic execution recovery are intentionally deferred.

See [Sessions and recovery](/sessions/sessions/) for the CLI user view and
[Protocol and RPC boundary](/integration/protocol-rpc/) for migration windows.
