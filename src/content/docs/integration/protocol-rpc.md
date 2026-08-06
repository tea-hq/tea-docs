---
title: Protocol and RPC
description: Choose the in-process command/event API or the tea JSONL/RPC process boundary.
---

## In-process integration

Use `AgentRuntime` when the host needs streamed events or commands beyond
`AgentSession::prompt`:

```rust
let mut events = runtime.subscribe(session_id)?;
let mut send = Box::pin(runtime.send(command));

let outcome = loop {
    tokio::select! {
        result = &mut send => break result?,
        Some(event) = events.recv() => handle(event),
    }
};
```

Commands and events use provider-neutral `tea-protocol` values. `outcome`
contains the command result. A bounded event
subscription applies backpressure, so the host must keep consuming it while a
command runs.

## Process integration

Use the CLI boundary when the integrating application should not link the Rust
runtime directly:

```sh
tea --rpc --continue --trust ignore
```

Write one compact JSON request per line:

```json
{"rpcVersion":"1.0","id":"p1","type":"prompt","payload":{"text":"Summarize the changes."}}
```

RPC stdout contains frames only; diagnostics use stderr. Prompt commands first
return `command_accepted`, then observations and a terminal `command_finished`.
After reconnecting, use `query_snapshot` for durable truth rather than rebuilding
state from event timing.

| Boundary | Choose it for |
| --- | --- |
| `AgentSession` | One simple in-process conversation. |
| `AgentRuntime` | Full in-process commands, events, stores, and approvals. |
| `tea --rpc` | Language-neutral local process integration. |

See the complete [JSONL/RPC request reference](/tea-docs/automation/rpc/).
