---
title: 嵌入 Tea
description: 在应用中持有 Agent 会话，并判断何时切换到更底层的运行时。
---

从 [`AgentSession`](/tea-docs/zh/sdk/quick-start/) 开始。只要对话需要保留上下文，就持续持有同一个会话：

```rust
let agent = AgentSession::builder(Arc::new(provider), model)
    .system_prompt("Answer with short, actionable steps.")
    .build()
    .await?;

let first = agent.prompt("Review this API shape.").await?;
let second = agent.prompt("Now suggest a smaller version.").await?;
```

每次 `prompt` 都会等待响应完成，并返回聚合后的可见文本。会话位于内存中；丢弃它就会结束这段对话。

## 设置宿主身份

多用户或多工作区应用应提供稳定身份：

```rust
let agent = AgentSession::builder(Arc::new(provider), model)
    .actor("user:42".parse()?)
    .workspace("workspace:docs".parse()?)
    .build()
    .await?;
```

这些身份会进入策略与会话上下文。不要在其中放入密钥或展示名称。

## 选择 API 层级

| 使用 | 适用场景 |
| --- | --- |
| `AgentSession` | 单个内存对话、纯文本 Prompt、聚合后的最终响应。 |
| `AgentRuntime` | 流式事件、持久化存储、审批、多 Profile、Steering、Follow-up 或自定义运行时端口。 |

Tea 使用应用已经拥有的 Tokio 运行时，不会创建嵌套运行时或调用 `block_on`。

接下来可以添加[工具与策略](/tea-docs/zh/integration/tools-policy/)或[持久化会话存储](/tea-docs/zh/integration/session-stores/)。
