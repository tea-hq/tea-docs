---
title: Security and operational boundaries
description: tea is not a sandbox. Native execution, prompt injection, credentials, tool boundaries, and MCP server trust.
---

> **Track:** `next` pre-release.

## Native execution is not sandboxed

`read`, `write`, `edit`, and `bash` run as the current OS user. Workspace path
confinement and policy approvals reduce accidental scope, but they do not
isolate the process from the host, network, environment, kernel, credentials,
or other user-readable files reachable through a shell command.

Approval is authorization, not a guarantee of safety. Prefer a disposable
container, virtual machine, or restricted OS account for untrusted repositories.

## Prompt injection

Repository text is model input. `AGENTS.md`, `CLAUDE.md`, source files,
documentation, `.tea/settings.json`, prompt templates, and `SKILL.md` content
may attempt to override instructions or induce unsafe tool use. Project trust
only controls whether local configuration/resources are loaded; it does not
validate their intent. See [Workspace trust](/safety/trust/).

## Credentials and data

Provider credentials are resolved from `TEA_*` environment values and are not
written to resolved settings, events, sessions, SQLite, archives, fixtures, or
normal errors. See [Credentials](/configuration/credentials/).

## Tool boundaries

- File paths are workspace-relative and revalidated across symlinks and atomic
  replacement, but portable filesystem APIs cannot eliminate every TOCTOU race.
- Shell cancellation owns and terminates the spawned process group where the
  platform supports it; hard process termination can bypass cleanup.
- Oversized shell output spills to a private state directory and returns a safe
  reference.
- A cancellation after a mutation starts is uncertain. Inspect the workspace
  before retrying.
- Resource, prompt, editor, subprocess, event, and RPC buffers have explicit
  bounds.

## MCP servers are not sandboxed

An MCP stdio server is untrusted executable code. Global configuration or
project trust authorizes discovery and startup, and a tool approval authorizes
one host-declared call. Neither decision limits the server's host filesystem,
network, CPU, process, or external-service authority. See
[MCP configuration](/mcp/configuration/).

## Terminal and automation

The TUI restores enabled terminal modes in reverse order on normal exit, panic,
foreground-child handoff, and handled SIGINT. `SIGKILL`, host crash, terminal
disconnect, and some platform console events cannot run application cleanup.

Print, JSON, and RPC consumers must treat assistant text and tool output as
untrusted data. Never evaluate a JSON field or final answer as shell code.
