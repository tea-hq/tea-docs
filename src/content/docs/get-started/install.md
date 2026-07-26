---
title: Source installation
description: Build the tea CLI from source and run your first session. Pre-release next track; no public release is announced.
---

> **Track:** `next` pre-release. No public crate, binary, or source release is
> announced yet. The commands below describe the intended build flow for when a
> public source release is published; they do not imply that a downloadable
> artifact is currently available.

## Requirements

- A Rust toolchain matching the project's supported version.
- A supported Tier 1 development platform.
- An OpenAI-compatible endpoint and credential for live model access (see
  [Credentials](/configuration/credentials/)).

## Build the CLI

When a public source release is published, build the `tea` CLI from source:

```bash
cargo build --locked -p tea-cli --release
./target/release/tea --version
```

Maintainer binary bundles can be produced for selected Tier 1 targets. Crate
publication remains disabled until release-readiness review.

## First run

Configure an OpenAI-compatible endpoint without writing the secret to a settings
file:

```bash
export TEA_OPENAI_API_KEY='YOUR_KEY'
export TEA_OPENAI_MODEL='gpt-5.4'
# Optional for a gateway or proxy:
export TEA_OPENAI_BASE_URL='https://api.openai.com/v1'

tea --cwd /path/to/repository --new --trust once
```

The default tool set is `read`, `write`, `edit`, and `bash`. Read access may run
without a prompt when policy permits it. Mutating tools pause at a durable,
redacted approval request. Choose **allow once**, the bounded session grant, or
**deny** only after checking the tool, effects, resource, and target.

## Headless modes for scripts

```bash
tea --print --trust ignore 'summarize the repository'
tea --json --trust ignore 'inspect the current changes'
tea --rpc --continue --trust ignore
```

See [CLI modes](/get-started/cli-modes/) for the full mode reference and
[Security and operational boundaries](/safety/security/) before using `tea`
on an untrusted workspace.
