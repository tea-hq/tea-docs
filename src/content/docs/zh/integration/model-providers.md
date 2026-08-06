---
title: 模型提供商
description: 将 Tea 连接到 OpenAI-compatible 或 Anthropic 模型端点。
---

Tea 的 Agent API 接受任意 `ModelProvider` 实现。具体适配器是由应用选择的独立依赖。

## OpenAI-compatible

```sh
cargo add tea-provider-openai
```

```rust
let config = OpenAiConfig::new(
    "gpt-4o-mini".parse()?,
    "https://api.openai.com/v1",
    ApiKey::new("YOUR_API_KEY")?,
)?;
let provider = OpenAiProviderBuilder::new()
    .with_config(Arc::new(config))
    .build()?;
```

该适配器支持 OpenAI，以及实现所选 OpenAI-compatible API 模式的网关。建议在应用配置层维护
`api_key`、`model` 与 `base_url`，不要让产品其他部分依赖 Provider 专用环境变量名。

## Anthropic

```sh
cargo add tea-provider-anthropic
```

Anthropic 适配器可以通过映射解析器接收应用管理的配置值：

```rust
let values = std::collections::BTreeMap::from([
    ("TEA_ANTHROPIC_API_KEY".to_owned(), "YOUR_API_KEY".to_owned()),
    ("TEA_ANTHROPIC_MODEL".to_owned(), "claude-3-5-sonnet-latest".to_owned()),
]);
let provider = AnthropicProviderBuilder::new()
    .with_resolver(Arc::new(MapCredentialResolver::new(values)))
    .build()?;
```

已有配置服务的应用可以注入自定义 `CredentialResolver`。上面的值只是示例字符串，API Key 应由应用的
配置层提供。

## 传给 Tea

两个适配器都暴露相同的、与 Provider 无关的模型目录：

```rust
let model = provider.models()[0].model_ref().clone();
let agent = AgentSession::builder(Arc::new(provider), model).build().await?;
```

Provider HTTP 值、SDK 错误与续传载荷不会进入 Tea 的稳定核心消息。要支持新协议，请在独立适配器
crate 中实现 `ModelProvider`。
