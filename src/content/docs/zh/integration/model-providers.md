---
title: 模型提供商
description: 与提供商无关的模型端口——ModelSpec、ModelRequest、流式语法，以及如何实现 ModelProvider 适配器。
---

> **轨道：** `next` 预发布。

`tea-model` 是与提供商无关的模型层。它不含实时提供商适配器、HTTP 客户端、凭据、重试循环、
智能体循环或持久化实现。公开 API 中刻意不含 OpenAI、Anthropic、Vercel AI SDK、HTTP、SSE 或
WebSocket 类型。

## 职责

- 已校验的 `ModelSpec` 值与能力声明；
- 不可变的、与提供商无关的 `ModelRequest` 轮次快照；
- 模型可见的工具名、描述与有界对象 JSON Schema；
- 与提供商无关的推理强度与预算；
- 项目拥有的协作式 `ModelCancellation`；
- 归一化的模型事件、失败、停止原因、用量与精确成本；
- 对象安全的 `ModelProvider` 与 `ModelStream` 端口；
- 确定性流式语法校验。

## 流式语法

完全消费的合规流：

1. 首先发出恰好一个 `Started` 事件；
2. 发出零或多个文本、思考与工具调用事件；
3. 发出恰好一个终态 `Completed` 或 `Failed` 事件；
4. 终止后不再发出任何事件。

工具调用使用响应本地有界索引与不透明提供商调用 ID。一个工具索引在一次响应中不可复用。参数增量
是不完整字符串，绝不执行；仅 `ToolCallCompleted` 携带已解析的有界 JSON 对象参数。当任一工具调用
未完成时，成功终止被拒绝。取消与提供商/运行时错误使用类型化终态 `Failed` 事件；原始 HTTP 体、
凭据与 SDK 错误不存入 `ModelFailure`。

## 取消与所有权

`ModelCancellation` 是与工具运行时共享的项目拥有协作作用域；它在内部封装 Tokio-util，但不暴露
`CancellationToken`。提供商与不可变请求分开接收取消。流是惰性的并拥有其资源；实现不得创建嵌套
运行时或分离任务。丢弃流即放弃之；显式取消是协作式的。

## 实现适配器

未来的提供商适配器必须：

- 翻译规范消息与工具模式；
- 依据已公告模型能力校验请求；
- 归一化流式输出与失败；
- 仅在有界、命名空间元数据后保留提供商续传签名；
- 归一化用量、精确成本与停止原因；
- 以终态事件而非 panic 报告设置与流式失败；
- 在任何实时 API 测试前使用 mock 传输通过 `tea-testkit` 一致性工具。

在独立适配器 crate 中实现 `tea_model::ModelProvider`。内核负责智能体级重试，且不得检视原始
HTTP 载荷。

## 参考提供商

`tea-testkit` 中的 `ScriptedModelProvider` 是用于嵌入与产品的密封参考提供商。OpenAI 兼容适配器
映射 Chat Completions SSE 面，但不使门面依赖 OpenAI 类型或凭据；其实时冒烟为可选，绝非正常 CI
门。
