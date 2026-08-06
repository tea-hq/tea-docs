---
title: MCP 集成
description: 将显式配置的本地 stdio MCP 工具接入嵌入式运行时。
---

```sh
cargo add tea-mcp
```

嵌入方先创建已校验的 `McpServerConfig` 与 `McpServerLaunch`，启动 `McpManager`，再把冻结后的
工具绑定注册到 `AgentRuntimeBuilder`：

```rust
for binding in manager.catalog().bindings() {
    let executor = manager.tool_executor(binding.spec().name())?;
    builder = builder.tool(
        binding.spec().clone(),
        Arc::new(binding.clone()),
        Arc::new(executor),
    )?;
}
```

每个启用的远程工具都必须有宿主声明，明确 effect、受影响资源、幂等性、重试安全、并发和超时。
远程 MCP 注解不能削弱该声明；声明不完整的工具保持禁用。

## 支持的传输

Tea 当前支持显式配置的本地 stdio Server。可执行文件必须使用绝对路径；参数不经过 Shell；只继承
列出的环境变量。工具发现结果在启动时冻结。

MCP Server 是不可信可执行代码。进程生命周期管理不是隔离，批准一次工具调用也不会限制 Server
拥有的其他文件系统、网络、CPU 或账户权限。当这些权限不可接受时，请使用外部隔离边界。

需要现成的 CLI 接入方式时，请阅读 [MCP 配置](/tea-docs/zh/mcp/configuration/)。
