---
title: 嵌入与配置
description: 通过 AgentRuntimeBuilder、AgentProfile 与进程内命令/事件 API 将 tea-rs 嵌入产品。
---

> **轨道：** `next` 预发布。

`tea` 是符合人体工程的嵌入门面。它拥有可替换的向内端口——模型提供商、工具注册表、策略引擎、
会话存储、时钟、ID 源、事件槽、上下文提供者与提示编译器——并暴露进程内命令发送器、有界事件
订阅、会话快照与健康检视。它不含产品提示、实时提供商、UI、文件系统、进程、网络或数据库适配器。

## 运行时构建器

`AgentRuntimeBuilder` 接入模型、工具、策略规则、会话存储、上下文提供者、时钟、ID 源与提示
编译器，然后注册一个或多个 `AgentProfile`。在 `build` 时，运行时为每个配置预计算一个不可变的
`ProfileBinding`：仅含该配置活动工具的过滤后 `ToolRegistry`、由配置已解析规则与平台
`UnknownEffectPolicy` 组合而成的 `PolicyEngine`、有序上下文提供者列表，以及转换后的
`RunLimits` 与 `PromptBudget`。

配置是声明式、带版本、可序列化的描述。运行时将其工具与策略规则引用针对构建器拥有的注册进行
解析；未解析的引用会导致构造失败。内核保持与产品无关：运行时在一次异步调用期间构造借用运行时
拥有端口的全新 `AgentKernel`。

## 命令与事件

`AgentRuntime::send` 接受规范 `CommandEnvelope`，派发 `CreateSession`、`Prompt`、`Steer`、
`FollowUp`、`Abort`、`ResolveApproval`、`SetModel`、`SetProfile`、`CompactSession` 与
`ForkSession`。`subscribe(session_id)` 返回有界的 `EventEnvelope` 接收器；满通道对运行施加
背压，丢弃的接收器被移除。

`attach_session` 校验已存储的配置/模型兼容性。`snapshot`、`session_state`、`session_stats`
与 `health` 暴露不可变宿主查询，不建立第二权威转录。

运行时绝不创建 Tokio 运行时、调用 `block_on`、在测试中睡眠或使用墙上时钟熵。请使用嵌入者的
活动运行时。

## 示例

无提供商的嵌入路径仅使用脚本化提供商与内存会话存储——无需凭据或网络：

```bash
cargo run --example in_process -p tea
```

`two_profiles` 示例在同一运行时上组合编码与桌面配置，包含原生工具声明与审批行为：

```bash
cargo run --example two_profiles -p tea
```

## 边界

门面绝不提供具体提供商、UI、文件系统、进程、网络或数据库适配器。适配器与产品特定类型保持在
stable-core API 之外。受支持的适配器、宿主、存储与 MCP 面由兼容性矩阵固定，见
[协议与 RPC 边界](/zh/integration/protocol-rpc/)。
