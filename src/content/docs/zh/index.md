---
title: Tea
description: 一个无头、与产品无关的 Rust 智能体运行时，用于嵌入 CLI、桌面应用、服务和 IDE 集成。
hero:
  tagline: 使用与提供商无关的 SDK 构建应用，或直接在 Tea TUI 中工作。
  actions:
    - text: 安装 Tea
      link: /tea-docs/zh/get-started/install/
      variant: primary
    - text: SDK 快速开始
      link: /tea-docs/zh/sdk/quick-start/
---

Tea 是一个用 Rust 实现的无头、与产品无关的 Agent 运行时。它可以嵌入桌面应用、CLI、服务和 IDE
集成，也可以直接通过 Tea 的终端界面使用。Tea 拥有规范的 Agent 协议、与 Provider 无关的模型端口、可移植的工具契约、
纯粹的策略与持久化审批模型、仅追加的分支会话，以及可恢复的 Tokio 原生内核。

## 选择使用路径

### CLI 与 TUI

在终端中交互式使用 `tea` 编码智能体，也可以通过 print 模式运行一次性任务、消费规范 JSON
事件，或使用 JSONL/RPC 集成。四种模式共享同一个编码服务、策略引擎和会话模型。

[安装 Tea](/tea-docs/zh/get-started/install/)，然后了解 [TUI 工作流](/tea-docs/zh/cli/tui/)。

### SDK

通过 `AgentSession` 将智能体嵌入 Rust 应用；当宿主需要规范命令、流式事件、持久化存储、审批、
多个 Profile 或自定义适配器时，使用 `AgentRuntime`。

[从最小 SDK 示例开始](/tea-docs/zh/sdk/quick-start/)。

## 从哪里开始

- [安装与首次运行](/tea-docs/zh/get-started/install/) —— 安装并启动 `tea` CLI/TUI。
- [使用 TUI](/tea-docs/zh/cli/tui/) —— Prompt、工具、审批与会话。
- [SDK 快速开始](/tea-docs/zh/sdk/quick-start/) —— 在新的 Rust 应用中接入最小 Agent。
- [概览](/tea-docs/zh/overview/) —— 架构、依赖方向与设计来源。
- [安全边界](/tea-docs/zh/safety/security/) —— 信任工作区或启用工具前请先阅读。
