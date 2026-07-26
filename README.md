# tea-rs

[English](./README.md) · [简体中文](./README.zh-CN.md)

A headless, product-agnostic agent runtime implemented in Rust. tea-rs owns a
canonical agent protocol, a provider-neutral model port, portable tool
contracts, a pure policy and durable approval model, append-only branching
sessions, and a resumable Tokio-native kernel. It is intended to be embedded by
desktop applications, CLIs, services, IDE integrations, and future product
lines.

> **Track:** This project is on the `next` pre-release track. No public crate,
> binary, or source release is announced yet. Do not infer that an installation
> artifact is currently available.

## Documentation

The documentation site lives in this repository and builds with Astro Starlight
(bilingual English at `/` and Simplified Chinese under `/zh/`):

```sh
pnpm install
pnpm run dev        # local dev server
pnpm run build      # production build (also runs the link validator)
pnpm run check      # Astro type and diagnostics check
```

- [Overview](./src/content/docs/overview.md)
- [Get started](./src/content/docs/get-started/install.md)
- [CLI modes](./src/content/docs/get-started/cli-modes.md)
- [Configuration](./src/content/docs/configuration/settings.md)
- [Credentials and model access](./src/content/docs/configuration/credentials.md)
- [Workspace trust](./src/content/docs/safety/trust.md)
- [Approvals and grants](./src/content/docs/safety/approvals.md)
- [Security and operational boundaries](./src/content/docs/safety/security.md)
- [Sessions and recovery](./src/content/docs/sessions/sessions.md)
- [MCP configuration and lifecycle](./src/content/docs/mcp/configuration.md)
- [JSONL/RPC protocol](./src/content/docs/automation/rpc.md)

## Maintainer contract

This repository holds **reviewed public documentation only**. It is not a source
mirror, a source export target, or a substitute for the authoritative product
workspace. See:

- [`AGENTS.md`](./AGENTS.md) — repository operating contract and public-content
  boundary.
- [`maintainers/UPSTREAM_READING.md`](./maintainers/UPSTREAM_READING.md) —
  mandatory local review order before authoring a technical page.
- [`maintainers/PUBLIC_STATUS.md`](./maintainers/PUBLIC_STATUS.md) — current
  public release or `next` track.
- [`maintainers/PAGE_TO_SOURCE_MAP.md`](./maintainers/PAGE_TO_SOURCE_MAP.md) —
  category-level pointers to authoritative material (review aids, not build
  inputs).

## Status and deployment

No public crate or binary release is announced. Installation, download, and
compatibility pages are labeled `next` and must not imply availability. GitHub
Pages deployment is intentionally **disabled**; a least-privilege workflow will
be added in a later review after public-page validation is complete.

## License

Licensed under the Apache License, Version 2.0.
