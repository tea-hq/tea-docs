# Tea

[English](./README.md) · [简体中文](./README.zh-CN.md)

一个用 Rust 实现的无头、与产品无关的智能体运行时。Tea 拥有规范的智能体协议、与提供商无关
的模型端口、可移植的工具契约、纯粹的策略与持久化审批模型、仅追加的分支会话，以及可恢复的
Tokio 原生内核。它旨在嵌入桌面应用、CLI、服务、IDE 集成及未来的产品线。

> **轨道：** 本项目处于 `next` 预发布轨道。目前尚未公告任何公开的 crate、二进制或源码发布。
> 请勿认为当前已有可安装产物。

## 文档

文档站点位于本仓库，使用 Astro Starlight 构建（英文在 `/`，简体中文在 `/zh/`）：

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

- [概览](./src/content/docs/zh/overview.md)
- [快速开始](./src/content/docs/zh/get-started/install.md)
- [CLI 模式](./src/content/docs/zh/get-started/cli-modes.md)
- [配置](./src/content/docs/zh/configuration/settings.md)
- [凭据与模型访问](./src/content/docs/zh/configuration/credentials.md)
- [工作区信任](./src/content/docs/zh/safety/trust.md)
- [审批与授权](./src/content/docs/zh/safety/approvals.md)
- [安全与运维边界](./src/content/docs/zh/safety/security.md)
- [会话与恢复](./src/content/docs/zh/sessions/sessions.md)
- [MCP 配置与生命周期](./src/content/docs/zh/mcp/configuration.md)
- [JSONL/RPC 协议](./src/content/docs/zh/automation/rpc.md)
- [嵌入与配置](./src/content/docs/zh/integration/embedding.md)
- [模型提供商](./src/content/docs/zh/integration/model-providers.md)
- [工具与策略](./src/content/docs/zh/integration/tools-policy.md)
- [会话存储](./src/content/docs/zh/integration/session-stores.md)
- [MCP 集成](./src/content/docs/zh/integration/mcp.md)
- [协议与 RPC 边界](./src/content/docs/zh/integration/protocol-rpc.md)

## 维护者契约

本仓库仅含**经审阅的公开文档**。它不是源码镜像、源码导出目标，也不是权威产品工作区的替代。
参见：

- [`AGENTS.md`](./AGENTS.md) —— 仓库运营契约与公开内容边界。
- [`maintainers/UPSTREAM_READING.md`](./maintainers/UPSTREAM_READING.md) ——
  编写技术页面前必读的本地审阅顺序。
- [`maintainers/PUBLIC_STATUS.md`](./maintainers/PUBLIC_STATUS.md) —— 当前
  公开发布或 `next` 轨道。
- [`maintainers/PAGE_TO_SOURCE_MAP.md`](./maintainers/PAGE_TO_SOURCE_MAP.md) ——
  到权威材料的类别级指针（审阅辅助，非构建输入）。

## 状态与部署

未公告任何公开 crate 或二进制发布。安装、下载与兼容性页面标注为 `next`，不得暗示可用性。

最小权限的 `deploy-pages` 工作流已就绪，仅在 `docs-check` 通过后部署受保护的 `main` 分支。站点
面向组织根 `https://tea-hq.github.io/`，无子路径前缀。部署保持**关闭**，直到维护者在 GitHub
Settings → Pages → Source: GitHub Actions 启用 Pages 并完成 `ROADMAP.md` 记录的专项评审。

## 许可证

基于 Apache License, Version 2.0 授权。
