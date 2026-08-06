---
title: 工具与策略
description: 为 Agent 添加工作区工具，并理解默认授权边界。
---

## 添加只读工作区工具

```sh
cargo add tea-coding-tools
```

在[快速开始](/zh/sdk/quick-start/)中构建会话之前增加：

```rust
let workspace = WorkspaceRoot::new(".")?;
let agent = AgentSession::builder(Arc::new(provider), model)
    .tools(read_only_workspace_tools(&workspace)?)
    .build()
    .await?;
```

该预设添加受工作区约束的 `read`、`grep`、`find` 和 `ls`。路径通过显式 `WorkspaceRoot` 解析，
工具不会获得不受约束的环境文件系统根目录。

`AgentSession` 内置 Basic Policy，允许已声明的纯文件系统读取。其他 effect 必须由宿主注册显式
策略规则，否则会失败关闭。

## 添加应用工具

一个工具注册由契约、资源解析器与执行器组成：

```rust
let agent = AgentSession::builder(Arc::new(provider), model)
    .tool(spec, Arc::new(resolver), Arc::new(executor))
    .policy_rule(rule_id, Arc::new(rule))
    .build()
    .await?;
```

请准确声明 effect 与受影响资源。参数会先经过 Schema 校验和资源解析，策略随后运行；无效输入不会
到达执行器。Grant 可以满足 `Ask`，但绝不会覆盖拒绝。

策略只负责授权操作，不是进程沙箱。请在独立容器、虚拟机、受限账户或远程 Worker 中运行不可信工具。
