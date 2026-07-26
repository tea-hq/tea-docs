---
title: 配置
description: tea CLI 的设置优先级、应用路径与设置文件格式。
---

> **轨道：** `next` 预发布。

## 优先级

设置按以下顺序确定性解析，从高到低：

1. CLI 标志
2. `TEA_*` 环境变量
3. 已信任工作区 `.tea/settings.json`
4. 全局 `settings.json`
5. 内置默认值

嵌套的 `tui` 与 `resources` 对象按字段合并。`activeTools` 替换而非扩展列表。未知字段与不支持的
schema 版本会失败关闭。项目配置绝不能选择宿主拥有的会话数据库路径。

## 应用路径

以下默认值相对于进程主目录：

| 用途 | 默认 | 覆盖 |
| --- | --- | --- |
| 全局配置 | `~/.config/tea` | `--config-dir`、`TEA_CONFIG_DIR` |
| 持久化状态 | `~/.local/state/tea` | `--state-dir`、`TEA_STATE_DIR` |
| 全局资源 | `~/.local/share/tea` | `--data-dir`、`TEA_DATA_DIR` |

全局设置文件为 `<config-dir>/settings.json`。持久化会话使用 `<state-dir>/sessions.sqlite3`，
项目信任使用 `<state-dir>/project-trust.json`，超长 shell 输出保留在
`<state-dir>/bash-output/` 下。测试与自动化应同时传入三个目录标志，以免读取真实用户主目录。

## 设置格式

设置文件是 `schemaVersion: 1` 的稀疏 JSON 覆盖层：

```json
{
  "schemaVersion": 1,
  "provider": "openai",
  "model": "gpt-5.4",
  "thinking": "medium",
  "activeTools": ["read", "write", "edit", "bash"],
  "maxRetries": 2,
  "compactionEnabled": false,
  "projectTrust": "ask",
  "tui": {
    "viewport": "fullscreen",
    "collapseThinking": false,
    "submitKey": "enter",
    "newlineKey": "shift+enter",
    "abortKey": "escape"
  },
  "resources": {
    "contextFiles": true,
    "skillPaths": [],
    "promptTemplates": true
  }
}
```

支持的 `projectTrust` 值为 `ask`、`ignore` 与 `reject`。TUI 还接受 `viewport: "inline"`；
fullscreen 为默认且测试最充分。

## 项目信任与资源

`AGENTS.md`、`CLAUDE.md` 或 `.tea/` 的存在将工作区标记为拥有项目本地资源。信任前，CLI 不加载
项目设置、技能或提示模板。

| 标志 | 行为 |
| --- | --- |
| `--trust default` | 使用已保存决策；否则无头使用失败关闭 |
| `--trust once` | 仅本次调用加载项目资源 |
| `--trust persist` | 为规范工作区身份保存信任 |
| `--trust reject` | 拒绝项目本地资源 |
| `--trust ignore` | 不带项目本地资源继续 |

信任允许加载文本，但不代表文本安全。见 [工作区信任](/zh/safety/trust/) 与
[安全](/zh/safety/security/)。
