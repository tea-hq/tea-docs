---
title: 源码安装
description: 从源码构建 tea CLI 并运行首个会话。预发布 next 轨道；尚未公告公开发布。
---

> **轨道：** `next` 预发布。目前尚未公告任何公开的 crate、二进制或源码发布。下方命令描述的是
> 公开源码发布后预期的构建流程，并不表示当前已有可下载产物。

## 前置条件

- 与项目支持版本匹配的 Rust 工具链。
- 受支持的 Tier 1 开发平台。
- 用于实时模型访问的 OpenAI 兼容端点与凭据（见 [凭据](/zh/configuration/credentials/)）。

## 构建 CLI

公开源码发布后，从源码构建 `tea` CLI：

```bash
cargo build --locked -p tea-cli --release
./target/release/tea --version
```

可为选定的 Tier 1 目标生成维护者二进制包。crate 发布在发布就绪评审前保持禁用。

## 首次运行

配置 OpenAI 兼容端点，且不将密钥写入设置文件：

```bash
export TEA_OPENAI_API_KEY='YOUR_KEY'
export TEA_OPENAI_MODEL='gpt-5.4'
# 网关或代理可选：
export TEA_OPENAI_BASE_URL='https://api.openai.com/v1'

tea --cwd /path/to/repository --new --trust once
```

默认工具集为 `read`、`write`、`edit` 与 `bash`。策略允许时，读取可不提示即运行。变更类工具会在
持久化、已脱敏的审批请求处暂停。仅在核对工具、效应、资源与目标后，才选择 **allow once**、
有界的会话授权或 **deny**。

## 脚本的无头模式

```bash
tea --print --trust ignore 'summarize the repository'
tea --json --trust ignore 'inspect the current changes'
tea --rpc --continue --trust ignore
```

完整模式参考见 [CLI 模式](/zh/get-started/cli-modes/)；在不可信工作区使用 `tea` 前请阅读
[安全与运维边界](/zh/safety/security/)。
