---
title: CLI 模式与命令
description: tea CLI 的交互、print、JSON 事件与 JSONL/RPC 模式，以及斜杠命令与退出码。
---

运行 `tea --help` 获取权威参数列表。模式标志互斥；交互式终端默认选择 TUI，而管道 stdin 选择
print 模式。

## 通用调用

```text
tea [--print | --json | --rpc] [OPTIONS] [PROMPT]...
```

常用选择器包括 `--cwd`、`--provider`、`--model`、`--profile`、可重复/逗号分隔的 `--tools`、
可重复的 `--context-file`、会话选择、应用路径覆盖、`--session-db`、`--trust` 与 `-v`。

会话选择之一：

| 标志 | 效果 |
| --- | --- |
| `--new` | 创建持久化会话 |
| `--continue` | 打开该工作区最近更新的会话 |
| `--session <UUID>` | 打开指定的持久化会话 |
| `--no-session` | 本次调用使用内存 SQLite 存储 |

提示参数、工作区限定的 `@file` 值与管道 UTF-8 输入在一个有界限制下拼接。

## 模式

### 交互

```bash
tea --new --model gpt-5.4 --trust once
tea --continue --trust ignore 'inspect the current changes'
```

TUI 流式输出文本、思考、工具活动、审批、队列、用量与会话状态。空闲时 Enter 提交，运行中 Enter
转向；Alt+Enter 排队后续消息。

### Print

```bash
tea --print --trust ignore 'summarize this repository'
printf '%s' 'explain the tests' | tea --print --trust ignore
```

stdout 仅含最终助手文本与一个 LF。诊断走 stderr。思考、工具、ANSI 转义与启动横幅绝不进入 stdout。

### JSON 事件流

```bash
tea --json --trust ignore 'inspect and explain'
```

首个 LF 分隔值是带版本的流头；后续值为未更改的规范事件信封。每行可独立解析。

### JSONL/RPC

```bash
tea --rpc --continue --trust ignore
```

RPC 仅通过请求帧接收提示。成帧、请求类型、边界与重连行为见
[JSONL/RPC 协议](/tea-docs/zh/automation/rpc/)。

## 斜杠命令

| 命令 | 效果 |
| --- | --- |
| `/new` | 创建并选择新的持久化会话 |
| `/resume [session-id]` | 打开会话或会话选择器 |
| `/session` | 打开会话选择器 |
| `/name [text]` | 设置或清除所选会话名 |
| `/model [model-id]` | 选择模型或打开模型选择器 |
| `/reasoning [level]` | 选择推理强度或打开对应选择器 |
| `/compact` | 通过已配置摘要器压缩 |
| `/tree` | 打开仅追加的分支树 |
| `/fork <message-id>` | 从持久化消息分支并激活 |
| `/image <path>` | 附加明确指定的工作区图片 |
| `/image remove <index>` | 删除一项编辑器附件 |
| `/image clear` | 删除全部编辑器附件 |
| `/copy` | 复制最近的助手响应 |
| `/mcp` | 显示安全的 MCP 健康与冻结的本地别名 |
| `/mcp reconnect <server-id>` | 仅当发现匹配冻结目录时重连单个服务器 |
| `/help` | 显示命令帮助 |
| `/quit` | 恢复终端并退出 |

MCP 重连绝不改变实时注册表，也绝不回放进行中的调用。
时间线、编辑器、审批、选择器和按键工作流见[使用 TUI](/tea-docs/zh/cli/tui/)。

## 退出码

| 码 | 类别 |
| ---: | --- |
| `2` | 用法 |
| `3` | 信任或配置 |
| `4` | 提供商 |
| `5` | 策略或审批 |
| `6` | 取消或输出损坏 |
| `70` | 内部或持久化失败 |
