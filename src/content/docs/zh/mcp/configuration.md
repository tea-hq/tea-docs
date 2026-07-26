---
title: MCP 配置与生命周期
description: 显式配置的本地 stdio MCP 服务器、严格设置 schema、冻结目录与重连行为。
---

> **轨道：** `next` 预发布。

> MCP 服务器是不可信可执行代码。全局或项目信任允许发现与启动，工具审批允许一次声明的调用。
> 两者都不沙箱化服务器或阻止启动副作用。启用服务器前请阅读 [安全](/zh/safety/security/)。

编码 CLI 通过普通工具注册表暴露显式配置的 Model Context Protocol (MCP) 工具。内核看到的是正常
的工具规格与执行器；策略、审批、持久化记录、取消与恢复与原生工具相同。

## 支持面

仅支持一种传输：显式配置的本地 stdio。CLI 以精确绝对可执行文件与精确参数向量启动，无 shell。
它清空子进程环境、仅恢复列出的变量名，并拥有管道与关闭。

适配器不发现编辑器配置、包清单、`PATH` 命令、已知 URL、浏览器扩展或网络目录。MCP 资源、提示、
采样、elicitation、roots、日志、任务扩展、HTTP 传输、OAuth/auth 助手与 WASI 扩展宿主不在本
切片内。

## 发现与优先级

MCP 是可选的。CLI 仅从已解析设置读取服务器：

1. 全局 `<config-dir>/settings.json`；
2. 已信任项目 `.tea/settings.json`。

`TEA_*` 环境值不合成 MCP 服务器条目。不可信或被忽略的项目绝不贡献 `mcpServers`。当全局与已信任
项目设置都定义了某服务器 ID 时，已信任项目定义替换该 ID 的全局定义。

## 单个服务器

```json
{
  "schemaVersion": 1,
  "activeTools": ["read", "mcp.filesystem.read_file"],
  "mcpServers": [
    {
      "id": "filesystem",
      "transport": {
        "type": "stdio",
        "executable": "/opt/mcp/filesystem-server",
        "arguments": ["--root", "/work/repository"]
      },
      "inheritedEnvironment": ["FILESYSTEM_SERVER_TOKEN"],
      "tools": [
        {
          "remoteName": "read_file",
          "alias": "mcp.filesystem.read_file",
          "declaration": {
            "effects": ["fs.read"],
            "resources": [
              {"argument": "path", "scheme": "file", "access": "read"}
            ],
            "idempotency": "idempotent",
            "retrySafety": "never",
            "concurrency": "serial",
            "timeoutMillis": 10000
          }
        }
      ],
      "limits": {
        "maxFrameBytes": 1048576,
        "maxResultBytes": 262144,
        "maxInFlightRequests": 1
      },
      "lifecycle": {
        "startupTimeoutMillis": 5000,
        "handshakeTimeoutMillis": 10000,
        "cancellationTimeoutMillis": 2000,
        "gracefulShutdownTimeoutMillis": 2000
      },
      "reconnect": {
        "maxAttempts": 2,
        "initialBackoffMillis": 100,
        "maxBackoffMillis": 1000
      }
    }
  ]
}
```

`type` 必须为 `stdio`。`executable` 为绝对路径，`arguments` 为精确 UTF-8 argv 值；无 shell 做
插值。省略 `reconnect` 以禁用重连。limits 与 lifecycle 为稀疏覆盖。

## 工具声明与别名

除非 `tools` 条目有完整 `declaration`，远程工具被禁用。声明对效应、参数派生资源、幂等性、重试
安全、并发与超时是权威的——远程标注不能放宽任一约束。本地别名必须出现在 `activeTools` 中才能
进入冻结目录。

## 生命周期与重连

目录在启动时冻结。`/mcp` 显示安全健康；`/mcp reconnect <server-id>` 仅当发现精确匹配冻结目录
时重连单个服务器。陈旧目录、变更描述符或可执行身份变化需要关闭并重建 CLI 服务。重连绝不回放进行
中的调用。断连、超时、取消、进程死亡或关闭后绝不自动重试——外部副作用可能已发生。
