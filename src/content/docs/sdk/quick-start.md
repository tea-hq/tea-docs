---
title: SDK Quick Start
description: Add Tea to a new Rust application and send one message to a model.
---

Requires Rust 1.97.1 or newer.

## Create an application

```sh
cargo new tea-quick-start
cd tea-quick-start
cargo add tea-rs tea-provider-openai
cargo add tokio@1 --features macros,rt
```

`tea-rs` is the published package name; Rust code imports it as `tea`.
`tea-provider-openai` is the selected protocol adapter and can connect to OpenAI
or another OpenAI-compatible endpoint.

## Add the agent

Replace `src/main.rs` with:

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

## Run it

```sh
cargo run
```

Replace `YOUR_API_KEY` in the code before running. In production, provide that
value through your application's secret or configuration layer instead of
committing it to source. Tea's agent loop, messages, tools, policy, and sessions
remain provider-independent.

This example uses an in-memory session and no tools. Next, add
[workspace tools and policy](/tea-docs/integration/tools-policy/) or choose another
[model provider](/tea-docs/integration/model-providers/).
