---
title: MCP servers
description: Configure a local stdio MCP server and explicitly enable its tools in the Tea CLI.
---

> An MCP server is untrusted executable code. Starting it is not sandboxing it,
> and approving one tool call does not limit the server's other OS permissions.

Add servers to global `~/.tea/settings.json` or a trusted workspace
`.tea/settings.json`. Tea currently supports local stdio only.

## Minimal configuration

```json
{
  "schemaVersion": 1,
  "activeTools": ["mcp.files.read_file"],
  "mcpServers": [{
    "id": "files",
    "transport": {
      "type": "stdio",
      "executable": "/opt/mcp/files-server",
      "arguments": ["--root", "/work/project"]
    },
    "tools": [{
      "remoteName": "read_file",
      "alias": "mcp.files.read_file",
      "declaration": {
        "effects": ["fs.read"],
        "resources": [{"argument": "path", "scheme": "file", "access": "read"}],
        "idempotency": "idempotent",
        "retrySafety": "never",
        "concurrency": "serial",
        "timeoutMillis": 10000
      }
    }]
  }]
}
```

The executable must be absolute and is started without a shell. Arguments are
passed exactly as written. Add `inheritedEnvironment: ["TOKEN_NAME"]` when the
server needs selected variables; the configuration contains names, not values.

## Why the declaration is required

Remote annotations are not trusted as policy. Tea enables a remote tool only
when the host declares its effects, argument-derived resources, idempotency,
retry safety, concurrency, and timeout. The local alias must also appear in
`activeTools`.

## Inspect and reconnect

Run `/mcp` in the TUI to inspect safe server health and frozen aliases. Use
`/mcp reconnect files` only after a transient disconnect. Reconnect succeeds
only when discovery still matches the frozen startup catalog and never replays
an in-flight call.

Use a restricted account, container, or VM when the server's filesystem,
network, CPU, or external-service authority is too broad. See
[Security boundaries](/tea-docs/safety/security/).
