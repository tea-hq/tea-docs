---
title: CLI 配置参考
description: Tea 支持的参数、设置字段、路径、环境变量与项目资源。
---

运行 `tea --help` 查看当前机器所安装版本的准确参数语法。

## 调用格式

```text
tea [--print | --json | --rpc] [OPTIONS] [PROMPT]...
```

| 模式 | 输出 |
| --- | --- |
| 默认 TTY | 交互式 TUI |
| `--print` | 只输出最终助手文本 |
| `--json` | Header 后逐行输出规范事件 Envelope |
| `--rpc` | 通过 stdin/stdout 双向传输 JSONL/RPC |

模式参数互斥。未指定模式时，管道输入会选择 Print 模式。

## 常用参数

| 参数 | 作用 |
| --- | --- |
| `--cwd <DIR>` | 选择工作区 |
| `--provider <ID>` | 选择内置或已配置的 Provider |
| `--model <ID>` | 选择模型 |
| `--api-key <SECRET>` | 仅为本次调用覆盖 Provider 密钥 |
| `--profile <ID>` | 选择已注册的产品 Profile |
| `--tools <A,B>` | 替换活动工具，可重复 |
| `--context-file <PATH>` | 添加工作区相对上下文文件，可重复 |
| `--trust <MODE>` | 设置项目资源信任行为 |
| `-v`、`--verbose` | 增加 stderr 诊断信息 |

会话参数互斥：

| 参数 | 作用 |
| --- | --- |
| `--new` | 创建持久化会话 |
| `--continue` | 打开工作区最近更新的会话 |
| `--session <UUID>` | 打开指定持久化会话 |
| `--no-session` | 本次调用使用内存 SQLite |

应用路径参数为 `--config-dir`、`--state-dir`、`--data-dir` 和 `--session-db`。应用目录必须是
绝对路径；相对会话数据库路径会解析到 State 目录下。

## 配置优先级

从高到低：

1. CLI 参数
2. 环境变量
3. 受信任工作区的 `.tea/settings.json`
4. 全局 `~/.tea/settings.json`
5. 内置默认值

设置文件是包含 `schemaVersion: 1` 的严格 JSON。未知字段会被拒绝。嵌套对象按字段合并，
`activeTools` 替换整个列表。

## 设置字段

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `provider` | `openai` | Provider ID |
| `model` | `gpt-5.4` | 模型 ID |
| `thinking` | `medium` | `off`、`low`、`medium`、`high` |
| `activeTools` | `read`、`write`、`edit`、`bash` | 唯一列表，最多 64 个 |
| `sessionDatabase` | 平台路径 | 项目设置不可配置 |
| `maxRetries` | `3` | 最大 7 |
| `retryBaseDelayMs` | `2000` | 首次模型重试前延迟 |
| `retryMaxDelayMs` | `60000` | 含 Provider Hint 的最大重试延迟 |
| `compactionEnabled` | `false` | 启用自动压缩 |
| `projectTrust` | `ask` | `ask`、`ignore` 或 `reject` |
| `tui` | 对象 | 显示与快捷键覆盖 |
| `resources` | 对象 | 上下文文件、Skill 路径与 Prompt 模板 |
| `mcpServers` | 空 | 显式本地 stdio MCP Server |
| `webSearch`、`webFetch` | 客户端后端禁用 | 显式 Web 工具路由与限制 |

### TUI 字段

| 字段 | 默认值 |
| --- | --- |
| `viewport` | `inline` |
| `collapseThinking` | `false` |
| `reducedMotion` | `false` |
| `submitKey` / `steeringKey` | `enter` |
| `newlineKey` | `shift+enter` |
| `followUpKey` | `alt+enter` |
| `abortKey` | `escape` |
| `modelKey` | `ctrl+o` |
| `toggleThinkingKey` / `toggleToolsKey` | `ctrl+t` / `ctrl+g` |
| `copyKey` / `retrieveQueuedKey` | `ctrl+y` / `ctrl+r` |
| `clearKey` / `exitKey` | `ctrl+l` / `ctrl+d` |

同一交互上下文中的歧义绑定会被拒绝。

### 资源字段

| 字段 | 默认值 | 作用 |
| --- | --- | --- |
| `contextFiles` | `true` | 加载发现的指令文件 |
| `skillPaths` | 空 | 添加工作区相对 Skill 根目录 |
| `promptTemplates` | `true` | 加载 Prompt 模板 |

## 应用文件

| 文件 | 默认位置 |
| --- | --- |
| 全局设置 | `~/.tea/settings.json` |
| Provider 定义 | `~/.tea/providers.json` |
| 会话 | `~/.local/state/tea/sessions.sqlite3` |
| 信任决策 | `~/.local/state/tea/project-trust.json` |
| 全局 Skill | `~/.local/share/tea/skills/` |
| 全局 Prompt | `~/.local/share/tea/prompts/` |

可以使用 `TEA_CONFIG_DIR`、`TEA_STATE_DIR`、`TEA_DATA_DIR` 或对应 CLI 参数覆盖三个根目录。

## 环境变量

| 范围 | 变量 |
| --- | --- |
| 选择 | `TEA_PROVIDER`、`TEA_MODEL` |
| OpenAI-compatible | `TEA_OPENAI_API_KEY`、`TEA_OPENAI_MODEL`、`TEA_OPENAI_BASE_URL`、`TEA_OPENAI_API_MODE` |
| Anthropic | `TEA_ANTHROPIC_API_KEY`、`TEA_ANTHROPIC_MODEL`、`TEA_ANTHROPIC_BASE_URL`、`TEA_ANTHROPIC_API_VERSION` |
| Shell 工具 | `TEA_SHELL`、`TEA_SHELL_FLAG` |
| 显示 | `NO_COLOR`、`TERM=dumb` |

适配器还提供超时、Reasoning、Header 与 Hosted Tool 变量；自定义端点有多个长期配置时，优先使用
[`providers.json`](/tea-docs/zh/configuration/credentials/)。

## 项目资源

包含 `AGENTS.md`、`CLAUDE.md` 或 `.tea/` 的工作区拥有项目资源。Tea 会在加载
`.tea/settings.json`、`.tea/providers.json`、Skill 或 Prompt 模板前询问。`--trust ignore` 不加载
这些资源；`--trust once` 只加载一次；`--trust persist` 保存信任决策。见
[工作区信任](/tea-docs/zh/safety/trust/)。

MCP 还要求额外的安全声明，见 [MCP 配置](/tea-docs/zh/mcp/configuration/)。
