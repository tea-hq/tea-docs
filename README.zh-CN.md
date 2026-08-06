# Tea

[English](./README.md) · [简体中文](./README.zh-CN.md)

一个用 Rust 实现的无头、与产品无关的智能体运行时。Tea 拥有规范的智能体协议、与提供商无关
的模型端口、可移植的工具契约、纯粹的策略与持久化审批模型、仅追加的分支会话，以及可恢复的
Tokio 原生内核。它旨在嵌入桌面应用、CLI、服务、IDE 集成及未来的产品线。

本仓库包含 Tea 的公开文档。

## 文档

本文档在本仓库中维护，并使用 Astro Starlight 构建（英文在 `/`，简体中文在 `/zh/`）：

- **CLI 与 TUI：** 安装、终端工作流、模式与命令、配置、凭据、信任、审批、会话、MCP、
  自动化和安全边界。
- **SDK：** 快速开始、嵌入、Provider、工具与策略、会话存储、MCP，以及协议/RPC 集成。

```sh
pnpm install
pnpm run dev        # 本地开发服务器
pnpm run build      # 生产构建（同时运行链接校验器）
pnpm run check      # Astro 类型与诊断检查
pnpm run parity     # 校验每个英文页都有 /zh/ 对应页
pnpm run safe-content  # 扫描内容中的私有标识符或真实密钥
pnpm run docs-check # check + build + parity + safe-content 一键执行
```

`docs-check` GitHub Actions 工作流在 push 与针对 `main` 的 pull request 上运行同一链，
仅具只读权限，不执行部署。

在终端中使用 Tea 时，从[使用 TUI](./src/content/docs/zh/cli/tui.md)入手；将 Tea 嵌入应用时，
从 [SDK 快速开始](./src/content/docs/zh/sdk/quick-start.md)入手。
[概览](./src/content/docs/zh/overview.md)解释两条路径共享的运行时与设计来源。

## 部署

`deploy-pages` 工作流会在 `docs-check` 通过后，从受保护的 `main` 分支发布文档。文档发布地址为
`https://tea-hq.github.io/`。

## 许可证

基于 Apache License, Version 2.0 授权。
