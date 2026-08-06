---
title: Session stores
description: Choose in-memory sessions or attach SQLite persistence to AgentRuntime.
---

`AgentSession` uses an in-memory store and is the right default for short-lived
application conversations. Use `AgentRuntime` when a session must survive a
process restart.

## Open a SQLite store

```sh
cargo add tea-session-sqlite
```

```rust
let store = Arc::new(SqliteSessionStore::open("tea-sessions.sqlite3")?);

let builder = AgentRuntimeBuilder::new()
    .session_store(store.clone())
    .session_catalog(store);
```

Continue configuring the builder with your provider, actor, workspace, and
profiles. The same SQLite value implements both durable record storage and the
session catalog used for listing and naming sessions.

For tests, use `InMemorySessionStore` or `SqliteSessionStore::in_memory()`.

## Recovery contract

- Records are append-only and replayed in session sequence order.
- Pending approvals and committed messages survive restart.
- A tool interrupted after side effects begin is marked uncertain and is not
  replayed automatically.
- Forking creates a new append-only branch; it never rewrites the parent.

Protect the database as application data: it can contain prompts, model output,
tool arguments, and command output even though credentials are excluded.
