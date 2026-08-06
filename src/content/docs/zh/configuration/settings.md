---
title: 配置
description: 配置 Tea CLI、TUI、工具与应用路径。
---

多数用户可以先使用命令行参数，只在需要长期保留选择时添加设置文件。

## 优先级

Tea 按以下顺序解析配置，越靠前优先级越高：

1. CLI 参数
2. `TEA_*` 环境变量
3. 受信任工作区的 `.tea/settings.json`
4. 全局 `settings.json`
5. 内置默认值

嵌套对象按字段合并，`activeTools` 会替换整个列表。未知字段和不支持的 Schema 版本会被拒绝。
工作区配置不能选择由宿主控制的会话数据库路径。

## 全局设置

默认全局文件是 `~/.tea/settings.json`。设置是稀疏覆盖，只需保留希望修改的字段：

```json
{
  "schemaVersion": 1,
  "provider": "openai",
  "model": "gpt-4o-mini",
  "activeTools": ["read", "write", "edit", "bash"],
  "tui": {
    "viewport": "inline",
    "collapseThinking": true
  }
}
```

默认工具为 `read`、`write`、`edit` 和 `bash`。`viewport` 可取 `inline` 或 `fullscreen`，默认值为
`inline`。

## 应用路径

| 用途 | 默认值 | 覆盖方式 |
| --- | --- | --- |
| 全局配置 | `~/.tea` | `--config-dir`、`TEA_CONFIG_DIR` |
| 持久化状态 | `~/.local/state/tea` | `--state-dir`、`TEA_STATE_DIR` |
| 全局资源 | `~/.local/share/tea` | `--data-dir`、`TEA_DATA_DIR` |

会话位于 `<state-dir>/sessions.sqlite3`，信任决策位于 `<state-dir>/project-trust.json`。测试和自动化
应显式传入三个目录参数，避免读取真实用户配置。

所有字段见 [CLI 配置参考](/tea-docs/zh/configuration/cli-config-reference/)，自定义端点见
[凭据与模型](/tea-docs/zh/configuration/credentials/)。
