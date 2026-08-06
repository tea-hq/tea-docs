---
title: 安装 Tea
description: 在 macOS 或 Windows 上安装 Tea CLI 与 TUI，并启动第一个会话。
---

`tea` 命令同时包含交互式 TUI 和无头 CLI 模式。

## macOS

通过 Tea 的 Homebrew Tap 安装：

```sh
brew install tea-hq/tap/tea
```

后续使用 `brew upgrade tea-hq/tap/tea` 升级。

## Windows

在 PowerShell 中运行安装脚本：

```powershell
irm https://tea-hq.github.io/install.ps1 | iex
```

安装后打开一个新终端，确认命令可用：

```powershell
tea --version
```

## 首次运行

选择 Provider、模型与仅用于当前终端的 API key。下面使用 OpenAI-compatible 端点；Tea 的
Agent 运行时本身不依赖该协议。

```sh
export TEA_API_KEY='YOUR_KEY'
tea --provider openai --model gpt-4o-mini --api-key "$TEA_API_KEY" --new
```

Windows PowerShell：

```powershell
$env:TEA_API_KEY = 'YOUR_KEY'
tea --provider openai --model gpt-4o-mini --api-key $env:TEA_API_KEY --new
```

TUI 会在当前目录打开。若工作区包含项目级指令或 `.tea` 配置，Tea 会在加载前询问。默认工具为
`read`、`write`、`edit` 和 `bash`；变更操作可能暂停并请求审批。

接下来阅读[使用 TUI](/tea-docs/zh/cli/tui/)，或在[凭据与模型](/tea-docs/zh/configuration/credentials/)中配置其他端点。
