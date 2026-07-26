---
title: 凭据与模型访问
description: tea CLI 如何在不持久化密钥的前提下解析提供商凭据与模型配置。
---

> **轨道：** `next` 预发布。

实时模型适配器仅从注入的环境读取凭据。已解析的设置、事件、会话记录、归档与 SQLite 行设计为不
含密钥。绝不要将 `TEA_OPENAI_API_KEY` 放入全局或项目设置。

## 提供商环境

| 变量 | 含义 |
| --- | --- |
| `TEA_PROVIDER` | 提供商选择器；当前为 `openai` |
| `TEA_MODEL` | 产品级模型覆盖 |
| `TEA_OPENAI_API_KEY` | 必需密钥 |
| `TEA_OPENAI_MODEL` | OpenAI 兼容模型选择器 |
| `TEA_OPENAI_BASE_URL` | 可选 API 基址 |
| `TEA_OPENAI_API_KEY_HEADER` | 可选凭据头名 |
| `TEA_OPENAI_API_KEY_PREFIX` | 可选凭据前缀 |
| `TEA_OPENAI_ORG_ID` | 可选 OpenAI 组织头 |
| `TEA_OPENAI_PROJECT_ID` | 可选 OpenAI 项目头 |
| `TEA_OPENAI_REASONING_EFFORT` | `low`、`medium` 或 `high` |
| `TEA_OPENAI_VISION` | `1`/`true` 声明图像输入 |
| `TEA_OPENAI_REQUEST_TIMEOUT_MS` | 正数请求超时（毫秒） |

## 密钥处理

- 提供商凭据从 `TEA_*` 环境值解析，不写入已解析设置、事件、会话、SQLite、归档、夹具或常规错误。
- 不要将密钥放入提示、源文件、设置文件、shell 参数或工具输出——那些是合法的会话内容。
- print stdout 与 JSON/RPC stdout 有严格的所有权契约，但 stderr、终端回滚、shell 溢出文件、
  会话数据库与备份可能含项目数据。请施加适当的文件权限与保留策略。

## 模型端口

模型层与提供商无关：`ModelRequest` 携带模型、系统提示、消息、工具定义、推理选项、输出限制与
请求元数据。提供商适配器翻译规范消息与工具模式、归一化停止原因与流式增量、在需要时保留续传
签名、并提取用量与成本。

`ModelProvider::stream` 接收不可变请求与独立的、项目拥有的取消作用域，返回惰性的对象安全流，
不暴露提供商 SDK 值。内核负责智能体级重试，且不得检视原始 HTTP 载荷。

公开核心 API 中不出现具体提供商 SDK 类型；提供商特定载荷不进入稳定核心字段。
