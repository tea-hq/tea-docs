---
title: JSONL/RPC 协议
description: tea --rpc 的 stdin/stdout 自动化接口——成帧、请求、输出、重连与恢复。
---

`tea --rpc` 通过 stdin/stdout 暴露进程本地自动化接口。它独立于规范智能体协议版本，尽管事件载荷
含未更改的规范信封。

## 成帧与所有权

- 每帧为一个紧凑 JSON 值后接字节 `LF`。
- 接受 `LF` 前紧随单个 `CR`。
- 输入输出帧上限为 1 MiB。
- RPC stdout 仅含帧；诊断走 stderr。
- 写入队列有有界槽位与 500 ms 入队/写入/刷新时限。
- EOF、信号、断连、超大/未成帧输入或慢输出终止受管工作并等待关闭。

服务器先发出：

```json
{"rpcVersion":"1.0","type":"ready","sessionId":"...","workspaceId":"..."}
```

## 请求

每个请求有 `rpcVersion: "1.0"`、可选有界字符串 `id`、snake_case `type` 与对象 `payload`：

```json
{"rpcVersion":"1.0","id":"p1","type":"prompt","payload":{"text":"inspect the changes"}}
{"rpcVersion":"1.0","id":"q1","type":"query_snapshot","payload":{"afterSequence":"12","limit":32}}
```

支持的变更：`new_session`、`open_session`、`name_session`、`prompt`、`steer`、`follow_up`、
`abort`、`resolve_approval`、`set_model`、`compact` 与 `fork`。

支持的查询：`list_sessions`、`query_state`、`query_snapshot`、`query_stats`、`query_tree`、
`list_models` 与 `list_mcp_servers`。快照限制钳制为 64 条，默认 32。

审批决策序列化为规范的 `allow_once`、`allow_session` 或 `deny` 值。

## 输出

关联响应保留请求 `id`。长时间运行的提示与审批命令先收到 `command_accepted`；完成稍后以异步
`command_finished` 帧到达。运行时观察以 `event` 帧发出，含未更改的规范事件信封。

命令完成可能在每个观察事件之前到达写入器；客户端从快照记录推导持久真相，而非事件时序。

一条完整的畸形 LF 帧收到一次安全 `parse_error`，之后处理下一帧。稳定错误码包括 `invalid_request`、
`unsupported_version`、`not_found`、`busy`、`policy_denied`、`persistence`、`provider`、
`cancelled` 与 `internal`。

## 重连与恢复

会话重绑、重连或检测到序列缺口后，从最近持久化 `afterSequence` 游标发起 `query_snapshot`，并
持续分页直到返回尾部。不要从文本增量或 `command_finished` 推断持久转录状态。

RPC 连接拥有其活动工作。断连取消该工作，但已提交的会话记录与挂起审批可从使用相同状态目录的新
进程恢复。见 [会话与恢复](/tea-docs/zh/sessions/sessions/)。

MCP 列表与重连响应仅暴露服务器 ID、生命周期状态、稳定健康码、描述符摘要、重启计数与冻结别名，
绝不包含服务器描述、可执行/argv、环境值、stderr 或结果文本。
