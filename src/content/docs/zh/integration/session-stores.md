---
title: 会话存储
description: 选择内存会话，或为 AgentRuntime 接入 SQLite 持久化。
---

`AgentSession` 使用内存存储，适合短生命周期的应用内对话。会话需要在进程重启后恢复时，请使用
`AgentRuntime`。

## 打开 SQLite 存储

```sh
cargo add tea-session-sqlite
```

```rust
let store = Arc::new(SqliteSessionStore::open("tea-sessions.sqlite3")?);

let builder = AgentRuntimeBuilder::new()
    .session_store(store.clone())
    .session_catalog(store);
```

然后继续为 Builder 配置 Provider、Actor、Workspace 与 Profile。同一个 SQLite 值同时实现持久化
记录存储，以及用于列出和命名会话的 Session Catalog。

测试中可以使用 `InMemorySessionStore` 或 `SqliteSessionStore::in_memory()`。

## 恢复契约

- 记录仅追加，并按会话序列回放。
- 待审批请求与已提交消息会在重启后保留。
- 工具在副作用开始后被中断时会标记为不确定，不会自动回放。
- Fork 创建新的仅追加分支，绝不改写父分支。

请将数据库作为应用数据保护：即使凭据被排除，其中仍可能包含 Prompt、模型输出、工具参数和命令输出。
