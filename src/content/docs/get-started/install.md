---
title: Install Tea
description: Install the Tea CLI and TUI on macOS or Windows, then start your first session.
---

The `tea` command includes both the interactive TUI and the headless CLI modes.

## macOS

Install from the Tea Homebrew tap:

```sh
brew install tea-hq/tap/tea
```

Upgrade later with `brew upgrade tea-hq/tap/tea`.

## Windows

Run the installer from PowerShell:

```powershell
irm https://tea-hq.github.io/install.ps1 | iex
```

Open a new terminal after installation, then verify the command:

```powershell
tea --version
```

## First run

Choose a provider, model, and transient API key. This example uses an
OpenAI-compatible endpoint; Tea's agent runtime remains provider-independent.

```sh
export TEA_API_KEY='YOUR_KEY'
tea --provider openai --model gpt-4o-mini --api-key "$TEA_API_KEY" --new
```

On Windows PowerShell:

```powershell
$env:TEA_API_KEY = 'YOUR_KEY'
tea --provider openai --model gpt-4o-mini --api-key $env:TEA_API_KEY --new
```

The TUI opens in the current directory. If the workspace contains project-local
instructions or `.tea` configuration, Tea asks before loading them. The default
tools are `read`, `write`, `edit`, and `bash`; mutating operations can pause for
approval.

Continue with [Using the TUI](/tea-docs/cli/tui/) or configure another endpoint in
[Credentials and models](/tea-docs/configuration/credentials/).
