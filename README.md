# Tea

[English](./README.md) · [简体中文](./README.zh-CN.md)

A headless, product-agnostic agent runtime implemented in Rust. Tea owns a
canonical agent protocol, a provider-neutral model port, portable tool
contracts, a pure policy and durable approval model, append-only branching
sessions, and a resumable Tokio-native kernel. It is intended to be embedded by
desktop applications, CLIs, services, IDE integrations, and future product
lines.

This repository contains the public documentation for Tea.

## Documentation

The documentation is maintained in this repository and built with Astro Starlight
(bilingual English at `/` and Simplified Chinese under `/zh/`):

- **CLI & TUI:** installation, terminal workflow, modes and commands,
  configuration, credentials, trust, approvals, sessions, MCP, automation, and
  security boundaries.
- **SDK:** Quick Start, embedding, providers, tools and policy, session stores,
  MCP, and protocol/RPC integration.

```sh
pnpm install
pnpm run dev        # local dev server
pnpm run build      # production build (also runs the link validator)
pnpm run check      # Astro type and diagnostics check
pnpm run parity     # verify every English page has a /zh/ counterpart
pnpm run safe-content  # scan content for private identifiers or real secrets
pnpm run docs-check # check + build + parity + safe-content in one command
```

The `docs-check` GitHub Actions workflow runs the same chain on push and pull
requests to `main` with read-only access and no deployment.

Start with [Using the TUI](./src/content/docs/cli/tui.md) when working in the
terminal, or [SDK Quick Start](./src/content/docs/sdk/quick-start.md) when
embedding Tea. The [overview](./src/content/docs/overview.md) explains the
shared runtime and design lineage.

## Deployment

The `deploy-pages` workflow publishes the documentation from the protected
`main` branch after `docs-check` passes. The published documentation is
available at `https://tea-hq.github.io/`.

## License

Licensed under the Apache License, Version 2.0.
