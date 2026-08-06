---
title: MCP integration
description: Attach explicitly configured local stdio MCP tools to an embedded runtime.
---

```sh
cargo add tea-mcp
```

The embedder creates validated `McpServerConfig` and `McpServerLaunch` values,
starts an `McpManager`, then registers its frozen tool bindings with
`AgentRuntimeBuilder`:

```rust
for binding in manager.catalog().bindings() {
    let executor = manager.tool_executor(binding.spec().name())?;
    builder = builder.tool(
        binding.spec().clone(),
        Arc::new(binding.clone()),
        Arc::new(executor),
    )?;
}
```

Each enabled remote tool needs a host-owned declaration for effects, affected
resources, idempotency, retry safety, concurrency, and timeout. Remote MCP
annotations cannot weaken that declaration. Tools without a complete declaration
remain disabled.

## Supported transport

Tea currently supports explicitly configured local stdio servers. The executable
must be an absolute path; arguments are passed without a shell; only named
environment variables are inherited. Tool discovery is frozen at startup.

An MCP server is untrusted executable code. Process lifecycle management is not
isolation, and approval of one tool call does not constrain the server's other
filesystem, network, CPU, or account permissions. Use an external containment
boundary when those permissions are unacceptable.

For the ready-made CLI path, see [MCP configuration](/mcp/configuration/).
