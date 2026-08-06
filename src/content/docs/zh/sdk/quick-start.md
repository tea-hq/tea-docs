---
title: SDK 快速开始
description: 在新的 Rust 应用中接入 Tea，并向模型发送第一条消息。
---

需要 Rust 1.97.1 或更高版本。

## 创建应用

```sh
cargo new tea-quick-start
cd tea-quick-start
cargo add tea-rs tea-provider-openai
cargo add tokio@1 --features macros,rt
```

`tea-rs` 是发布到 crates.io 的包名；Rust 代码通过 `tea` 导入。`tea-provider-openai` 是本例选择的
协议适配器，可以连接 OpenAI 或其他 OpenAI-compatible 端点。

## 添加 Agent

将 `src/main.rs` 替换为：

```rust
use std::{error::Error, sync::Arc};

use tea::{model::ModelProvider, AgentSession};
use tea_provider_openai::{ApiKey, OpenAiConfig, OpenAiProviderBuilder};

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Box<dyn Error>> {
    let config = OpenAiConfig::new(
        "gpt-4o-mini".parse()?,
        "https://api.openai.com/v1",
        ApiKey::new("YOUR_API_KEY")?,
    )?;
    let provider = OpenAiProviderBuilder::new()
        .with_config(Arc::new(config))
        .build()?;
    let model = provider.models()[0].model_ref().clone();

    let agent = AgentSession::builder(Arc::new(provider), model)
        .system_prompt("You are a concise assistant.")
        .build()
        .await?;

    println!("{}", agent.prompt("Hello, Tea.").await?.text());
    Ok(())
}
```

## 运行

```sh
cargo run
```

运行前请替换代码中的 `YOUR_API_KEY`。生产环境应通过应用自己的密钥或配置层提供该值，不要将其提交到
源码。Tea 的 Agent 循环、消息、工具、策略与会话仍然与 Provider 无关。

本例使用内存会话且不启用工具。接下来可以添加[工作区工具与策略](/tea-docs/zh/integration/tools-policy/)，
或选择其他[模型 Provider](/tea-docs/zh/integration/model-providers/)。
