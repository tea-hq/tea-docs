---
title: Tea
description: A headless, product-agnostic Rust agent runtime for embedding in CLIs, desktop apps, services, and IDE integrations.
hero:
  tagline: Build with the provider-neutral SDK or work directly in the Tea TUI.
  actions:
    - text: Install Tea
      link: /tea-docs/get-started/install/
      variant: primary
    - text: SDK Quick Start
      link: /tea-docs/sdk/quick-start/
---

Tea is a headless, product-agnostic agent runtime implemented in Rust. It can be
embedded by desktop applications, CLIs, services, and IDE integrations, or used
directly through the Tea terminal interface. Tea owns a canonical agent
protocol, a provider-neutral model port, portable tool contracts, a pure policy
and durable approval model, append-only branching sessions, and a resumable
Tokio-native kernel.

## Choose your path

### CLI & TUI

Use the `tea` coding agent interactively in a terminal, run one-shot prompts in
print mode, consume canonical JSON events, or integrate through JSONL/RPC. All
four modes share one coding service, policy engine, and session model.

[Install Tea](/tea-docs/get-started/install/), then learn the
[TUI workflow](/tea-docs/cli/tui/).

### SDK

Embed an agent in a Rust application through `AgentSession`, or use
`AgentRuntime` when the host needs canonical commands, streamed events, durable
storage, approvals, multiple profiles, and custom adapters.

[Start with the minimal SDK example](/tea-docs/sdk/quick-start/).

## Where to start

- [Install and first run](/tea-docs/get-started/install/) — install and start the `tea`
  CLI/TUI.
- [Using the TUI](/tea-docs/cli/tui/) — prompts, tools, approvals, and sessions.
- [SDK Quick Start](/tea-docs/sdk/quick-start/) — add a minimal agent to a new Rust app.
- [Overview](/tea-docs/overview/) — architecture, dependency direction, and design
  lineage.
- [Security boundaries](/tea-docs/safety/security/) — read this before trusting a
  workspace or enabling tools.
