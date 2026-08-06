---
title: 凭据与模型
description: 选择内置 Provider，或配置 OpenAI-compatible 端点而不持久化密钥。
---

## 单次选择

从临时 Shell 变量传入 API key，不要将它写入设置文件：

```sh
export TEA_API_KEY='YOUR_KEY'
tea --provider openai --model gpt-4o-mini --api-key "$TEA_API_KEY"
```

内置 Provider ID 为 `openai` 和 `anthropic`。`--api-key` 传入的密钥只用于本次调用，并在诊断中脱敏。

## 自定义端点

在 `~/.tea/providers.json` 中添加：

```json
{
  "providers": {
    "gateway": {
      "base_url": "https://gateway.example.com/v1",
      "api_key": "$TEA_API_KEY",
      "api_mode": "chat-completions",
      "models": [{ "id": "team-model" }]
    }
  }
}
```

然后运行：

```sh
tea --provider gateway --model team-model
```

`api_key` 可以引用 `$NAME` 或 `${NAME}`。受信任工作区可以提供 `.tea/providers.json`；项目条目按字段
覆盖全局 Provider，非空的项目模型列表会替换全局列表。

## 内置环境变量契约

| Provider | 必需 | 常用可选值 |
| --- | --- | --- |
| OpenAI-compatible | `TEA_OPENAI_API_KEY` | `TEA_OPENAI_MODEL`、`TEA_OPENAI_BASE_URL`、`TEA_OPENAI_API_MODE` |
| Anthropic | `TEA_ANTHROPIC_API_KEY` | `TEA_ANTHROPIC_MODEL`、`TEA_ANTHROPIC_BASE_URL`、`TEA_ANTHROPIC_API_VERSION` |

这些适配器专用变量是便捷默认值。应用与脚本可以通过 `--provider`、`--model`、`--api-key` 和
`providers.json` 保持与 Provider 无关的配置边界。

不要将凭据放入 `settings.json`、Prompt、源文件或工具输出。会话数据库与终端历史仍可能包含其他
项目数据，也需要妥善保护。
