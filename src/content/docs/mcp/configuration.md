---
title: MCP configuration and lifecycle
description: Explicitly configured local stdio MCP servers, the strict settings schema, frozen catalogs, and reconnect behavior.
---

> **Track:** `next` pre-release.

> An MCP server is untrusted executable code. Global or project trust allows
> discovery and startup, and a tool approval allows one declared invocation.
> Neither action sandboxes the server or prevents startup-side effects. Read
> [Security](/safety/security/) before enabling a server.

The Coding CLI exposes explicitly configured Model Context Protocol (MCP) tools
through the ordinary tool registry. The kernel sees a normal tool spec and
executor; policy, approvals, durable records, cancellation, and recovery
remain the same as for native tools.

## Supported surface

Only one transport is supported: explicitly configured local stdio. The CLI
starts an exact absolute executable with an exact argument vector and no shell.
It clears the child environment, restores only listed variable names, and owns
its pipes and shutdown.

The adapter does not discover editor configuration, package manifests, `PATH`
commands, well-known URLs, browser extensions, or network catalogs. MCP
resources, prompts, sampling, elicitation, roots, logging, task extensions,
HTTP transports, OAuth/auth helpers, and a WASI extension host are not part of
this slice.

## Discovery and precedence

MCP is opt-in. The CLI reads servers only from resolved settings:

1. global `<config-dir>/settings.json`;
2. trusted project `.tea/settings.json`.

`TEA_*` environment values do not synthesize MCP server entries. An untrusted or
ignored project never contributes `mcpServers`. When both global and trusted
project settings define a server ID, the trusted project definition replaces the
global definition for that ID.

## One server

```json
{
  "schemaVersion": 1,
  "activeTools": ["read", "mcp.filesystem.read_file"],
  "mcpServers": [
    {
      "id": "filesystem",
      "transport": {
        "type": "stdio",
        "executable": "/opt/mcp/filesystem-server",
        "arguments": ["--root", "/work/repository"]
      },
      "inheritedEnvironment": ["FILESYSTEM_SERVER_TOKEN"],
      "tools": [
        {
          "remoteName": "read_file",
          "alias": "mcp.filesystem.read_file",
          "declaration": {
            "effects": ["fs.read"],
            "resources": [
              {"argument": "path", "scheme": "file", "access": "read"}
            ],
            "idempotency": "idempotent",
            "retrySafety": "never",
            "concurrency": "serial",
            "timeoutMillis": 10000
          }
        }
      ],
      "limits": {
        "maxFrameBytes": 1048576,
        "maxResultBytes": 262144,
        "maxInFlightRequests": 1
      },
      "lifecycle": {
        "startupTimeoutMillis": 5000,
        "handshakeTimeoutMillis": 10000,
        "cancellationTimeoutMillis": 2000,
        "gracefulShutdownTimeoutMillis": 2000
      },
      "reconnect": {
        "maxAttempts": 2,
        "initialBackoffMillis": 100,
        "maxBackoffMillis": 1000
      }
    }
  ]
}
```

`type` must be `stdio`. `executable` is an absolute path and `arguments` are
exact UTF-8 argv values; no shell performs interpolation. Omit `reconnect` to
disable reconnect. Limits and lifecycle objects are sparse overrides.

## Tool declarations and aliases

A remote tool is disabled unless its `tools` entry has a complete `declaration`.
The declaration is authoritative for effects, argument-derived resources,
idempotency, retry safety, concurrency, and timeout — remote annotations cannot
reduce any of those constraints. The local alias must appear in `activeTools` to
enter the frozen catalog.

## Lifecycle and reconnect

The catalog is frozen at startup. `/mcp` shows safe health; `/mcp reconnect
<server-id>` reconnects one server only when discovery exactly matches the frozen
catalog. A stale catalog, changed descriptor, or executable identity change
requires closing and rebuilding the CLI service. A reconnect never replays an
in-flight call. Never retry a call automatically after disconnect, timeout,
cancellation, process death, or shutdown — the external effect may already have
happened.
