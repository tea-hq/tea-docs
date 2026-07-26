---
title: MCP integration
description: The tea-mcp adapter boundary — bounded stdio configuration, frozen tool discovery, and host-owned policy declarations from an embedder's perspective.
---

> **Track:** `next` pre-release.

> An MCP server is untrusted executable code. Lifecycle control is not isolation.
> Read [Security](/safety/security/) and the MCP user guide
> ([MCP configuration](/mcp/configuration/)) before enabling a server.

`tea-mcp` is the outward Model Context Protocol adapter. It defines bounded,
redacting server configuration and health contracts, an owned stdio client
transport, and deterministic frozen tool discovery.

## Dependency boundary

This crate may adapt MCP protocol values into `tea-tools` contracts only. It must
not depend on `tea-kernel`, `tea-policy`, `tea-session`, `tea-coding`, or
`tea-cli`; none of those inward contract crates expose MCP SDK or transport
types.

## Configuration and ownership

Configuration contains an exact absolute executable, an exact argument vector,
environment variable names only, disabled-by-default host tool declarations, and
deterministic lifecycle bounds. Debug output redacts executable and argument
values. The stdio client starts the executable without a shell or ambient
environment, bounds JSONL frames and stderr, validates request/response
correlation, and owns process-tree shutdown. This does not sandbox the server.

## Frozen discovery

Discovery walks bounded `tools/list` pages under one absolute deadline and maps
only host-declared tools into an immutable, alias-sorted catalog. Remote
descriptor JSON and authoritative host policy JSON are canonicalized and hashed
with SHA-256; the digest scopes `ToolSource` and `ToolVersion`. Input/output
schemas compile through the offline validator; remote annotations stay untrusted
diagnostics. Every binding resolves an explicit `mcp-server://<server-id>/<remote-name>`
execute resource before any invocation.

## Host-owned declarations

A remote tool is disabled unless its `tools` entry has a complete `declaration`
that is authoritative for effects, argument-derived resources, idempotency, retry
safety, concurrency, and timeout — remote annotations cannot reduce any of those
constraints. MCP invocations cross the normal registry, policy, approval,
durability, cancellation, and recovery paths, so the kernel sees a normal
`ToolSpec` and `ToolExecutor`.

## Unsupported in 1.0

- Streamable HTTP and every other network MCP transport.
- MCP resources, prompts, sampling, elicitation, roots, logging, and task
  extensions.
- OAuth/auth helpers, SDK-owned child-process helpers, and a generic plugin
  framework.
- Container enforcement and a WASI/WASM extension host.

Use a restricted account, container, VM, or other operator-managed containment
layer when a server's filesystem, network, CPU, or external-service authority is
unacceptable. Never retry a call automatically after disconnect, timeout,
cancellation, process death, or shutdown.
