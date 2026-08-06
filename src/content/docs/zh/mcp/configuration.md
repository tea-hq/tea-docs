---
title: MCP 服务器
description: 在 Tea CLI 中配置本地 stdio MCP 服务器，并显式启用其工具。
---

> MCP 服务器是不可信可执行代码。启动它并不等于沙箱化，批准一次工具调用也不会限制它拥有的
> 其他操作系统权限。

在全局 `~/.tea/settings.json` 或受信任工作区的 `.tea/settings.json` 中添加服务器。Tea 当前
仅支持本地 stdio。

## 最小配置

```json
{
  "schemaVersion": 1,
  "activeTools": ["mcp.files.read_file"],
  "mcpServers": [{
    "id": "files",
    "transport": {
      "type": "stdio",
      "executable": "/opt/mcp/files-server",
      "arguments": ["--root", "/work/project"]
    },
    "tools": [{
      "remoteName": "read_file",
      "alias": "mcp.files.read_file",
      "declaration": {
        "effects": ["fs.read"],
        "resources": [{"argument": "path", "scheme": "file", "access": "read"}],
        "idempotency": "idempotent",
        "retrySafety": "never",
        "concurrency": "serial",
        "timeoutMillis": 10000
      }
    }]
  }]
}
```

可执行文件必须是绝对路径，并且不经过 Shell 启动；参数会按原样传入。服务器需要指定环境变量时，
添加 `inheritedEnvironment: ["TOKEN_NAME"]`；配置中只写名称，不写值。

## 为什么必须声明

远程注解不能作为可信策略。只有宿主声明 effect、参数派生资源、幂等性、重试安全、并发和超时后，
Tea 才会启用远程工具。本地 Alias 还必须出现在 `activeTools` 中。

## 检查与重连

在 TUI 中运行 `/mcp` 查看安全的服务器健康状态与冻结 Alias。仅在临时断连后使用
`/mcp reconnect files`。只有发现结果仍与启动时冻结的目录一致，重连才会成功；进行中的调用不会被
重放。

当服务器的文件系统、网络、CPU 或外部服务权限过大时，请使用受限账户、容器或虚拟机。见
[安全边界](/tea-docs/zh/safety/security/)。
