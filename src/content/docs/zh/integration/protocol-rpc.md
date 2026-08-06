---
title: 协议与 RPC
description: 选择进程内命令/事件 API，或 tea 的 JSONL/RPC 进程边界。
---

## 进程内集成

宿主需要流式事件，或 `AgentSession::prompt` 之外的命令时，使用 `AgentRuntime`：

```rust
let mut events = runtime.subscribe(session_id)?;
let mut send = Box::pin(runtime.send(command));

let outcome = loop {
    tokio::select! {
        result = &mut send => break result?,
        Some(event) = events.recv() => handle(event),
    }
};
```

命令与事件使用 `tea-protocol` 中与 Provider 无关的值，`outcome` 是命令结果。有界事件订阅会施加背压，因此命令运行时，
宿主必须持续消费事件。

## 进程集成

集成应用不希望直接链接 Rust 运行时时，使用 CLI 边界：

```sh
tea --rpc --continue --trust ignore
```

每行写入一个紧凑 JSON 请求：

```json
{"rpcVersion":"1.0","id":"p1","type":"prompt","payload":{"text":"Summarize the changes."}}
```

RPC stdout 只包含 Frame，诊断写入 stderr。Prompt 命令先返回 `command_accepted`，随后输出观察事件与
终态 `command_finished`。重连后应使用 `query_snapshot` 获取持久化真相，不要依赖事件时序重建状态。

| 边界 | 适用场景 |
| --- | --- |
| `AgentSession` | 一个简单的进程内对话。 |
| `AgentRuntime` | 完整的进程内命令、事件、存储与审批。 |
| `tea --rpc` | 与语言无关的本地进程集成。 |

完整请求格式见 [JSONL/RPC 请求参考](/tea-docs/zh/automation/rpc/)。
