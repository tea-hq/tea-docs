---
title: Tea
description: 一个无头、与产品无关的 Rust 智能体运行时，用于嵌入 CLI、桌面应用、服务和 IDE 集成。
hero:
  tagline: 一个可嵌入的无头 Rust 智能体运行时。
  actions:
    - text: 快速开始
      link: /zh/get-started/install/
      variant: primary
    - text: 概览
      link: /zh/overview/
---

> **轨道：** 本站处于 `next` 预发布轨道。目前尚未公告任何公开的 crate 或二进制发布。

Tea 是一个用 Rust 实现的无头、与产品无关的智能体运行时。本站记录 tea-rs——Tea 的 Rust 实现，
旨在嵌入桌面应用、CLI、服务、IDE
集成及未来的产品线。该项目拥有规范的智能体协议、与提供商无关的模型端口、可移植的工具契约、
纯粹的策略与持久化审批模型、仅追加的分支会话，以及可恢复的 Tokio 原生内核。

## 你可以用它做什么

- 以显式的、持久化的状态转换运行模型–工具循环。
- 通过一套规范事件协议流式输出文本、思考、工具活动、用量与成本。
- 通过有序策略与持久化、有界的审批评估每一次敏感的工具调用。
- 将可恢复、可压缩、可分支的会话持久化到 SQLite。
- 以交互、脚本或严格的 JSONL/RPC 接口驱动同一运行时。

## 从哪里开始

- [概览](/zh/overview/) —— 分层、依赖方向与内核循环。
- [快速开始](/zh/get-started/install/) —— 构建 `tea` CLI 与首次运行。
- [CLI 模式](/zh/get-started/cli-modes/) —— 交互、print、JSON 事件与 RPC。
- [安全与运维边界](/zh/safety/security/) —— 信任工作区前请先阅读。

## 状态

Tea 处于预发布 `next` 开发阶段。源码分发、crate 发布与二进制发布尚未公开。本站页面描述
`next` 轨道，区分已实现行为与推迟工作，且不会将私有提交声称为公开源码。
