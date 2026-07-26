---
title: MCP 集成
description: tea-mcp 适配器边界——有界 stdio 配置、冻结工具发现，以及从嵌入者视角的宿主拥有策略声明。
---

> **轨道：** `next` 预发布。

> MCP 服务器是不可信可执行代码。生命周期控制不是隔离。启用服务器前请阅读
> [安全](/zh/safety/security/) 与 MCP 用户指南（[MCP 配置](/zh/mcp/configuration/)）。

`tea-mcp` 是向外的 Model Context Protocol 适配器。它定义有界、脱敏的服务器配置与健康契约、
自有的 stdio 客户端传输，以及确定性冻结工具发现。

## 依赖边界

本 crate 可将 MCP 协议值适配为 `tea-tools` 契约，但不得依赖 `tea-kernel`、`tea-policy`、
`tea-session`、`tea-coding` 或 `tea-cli`；这些向内契约 crate 都不暴露 MCP SDK 或传输类型。

## 配置与所有权

配置含精确绝对可执行文件、精确参数向量、仅环境变量名、默认禁用的宿主工具声明，以及确定性生命
周期边界。调试输出脱敏可执行文件与参数值。stdio 客户端无 shell 或环境地启动该可执行文件，有界
化 JSONL 帧与 stderr，校验请求/响应关联，并拥有进程树关闭。这并不沙箱化服务器。

## 冻结发现

发现在一个绝对时限内遍历有界 `tools/list` 页，仅将宿主声明工具映射为不可变、别名排序的目录。
远程描述符 JSON 与权威宿主策略 JSON 被规范化并以 SHA-256 哈希；摘要限定 `ToolSource` 与
`ToolVersion`。输入/输出模式通过离线校验器编译；远程标注保持为不可信诊断。每个绑定在调用前解析
显式 `mcp-server://<server-id>/<remote-name>` 执行资源。

## 宿主拥有声明

除非 `tools` 条目有完整 `declaration`，远程工具被禁用。该声明对效应、参数派生资源、幂等性、
重试安全、并发与超时是权威的——远程标注不能放宽任一约束。MCP 调用穿越正常注册表、策略、审批、
持久化、取消与恢复路径，故内核看到的是正常 `ToolSpec` 与 `ToolExecutor`。

## 1.0 不支持

- Streamable HTTP 及所有其他网络 MCP 传输。
- MCP 资源、提示、采样、elicitation、roots、日志与任务扩展。
- OAuth/auth 助手、SDK 拥有的子进程助手与通用插件框架。
- 容器执行与 WASI/WASM 扩展宿主。

当服务器的文件系统、网络、CPU 或外部服务权限不可接受时，使用受限账户、容器、虚拟机或其他
运维管理的隔离层。断连、超时、取消、进程死亡或关闭后绝不自动重试。
