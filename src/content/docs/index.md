---
title: Tea
description: A headless, product-agnostic Rust agent runtime for embedding in CLIs, desktop apps, services, and IDE integrations.
hero:
  tagline: A headless Rust agent runtime you can embed.
  actions:
    - text: Get started
      link: /get-started/install/
      variant: primary
    - text: Overview
      link: /overview/
---

> **Track:** This site is on the `next` pre-release track. No public crate or
> binary release is announced yet.

Tea is a headless, product-agnostic agent runtime implemented in Rust. This
site documents tea-rs, the Rust implementation of Tea, intended to be embedded
by desktop applications, CLIs, services, IDE
integrations, and future product lines. The project owns a canonical agent
protocol, a provider-neutral model port, portable tool contracts, a pure policy
and durable approval model, append-only branching sessions, and a resumable
Tokio-native kernel.

## What you can do with it

- Run a model–tool loop with explicit, durable state transitions.
- Stream text, thinking, tool activity, usage, and cost through one canonical
  event protocol.
- Evaluate every sensitive tool invocation through ordered policy and durable,
  bounded approvals.
- Persist resumable, compactable, branchable sessions to SQLite.
- Drive the same runtime interactively, from scripts, or over a strict
  JSONL/RPC interface.

## Where to start

- [Overview](/overview/) — layers, dependency direction, and the kernel loop.
- [Get started](/get-started/install/) — building the `tea` CLI and your first
  run.
- [CLI modes](/get-started/cli-modes/) — interactive, print, JSON event, and
  RPC.
- [Security and operational boundaries](/safety/security/) — read this before
  trusting a workspace.

## Status

Tea is in pre-release `next` development. Source distribution, crate
publication, and binary releases are not yet public. Pages here describe the
`next` track; they distinguish implemented behavior from deferred work and
never claim a private commit as public source.
