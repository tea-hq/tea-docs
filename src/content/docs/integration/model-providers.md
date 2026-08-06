---
title: Model providers
description: Connect Tea to an OpenAI-compatible or Anthropic model endpoint.
---

Tea's agent API accepts any implementation of `ModelProvider`. The concrete
adapter is a separate dependency selected by your application.

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

This adapter supports OpenAI and gateways that implement the selected
OpenAI-compatible API mode. Keep `api_key`, `model`, and `base_url` in your
application's configuration layer rather than coupling the rest of the product
to provider-specific environment names.

## Anthropic

```sh
cargo add tea-provider-anthropic
```

The Anthropic adapter can receive application-owned values through its
map-backed resolver:

```rust
let values = std::collections::BTreeMap::from([
    ("TEA_ANTHROPIC_API_KEY".to_owned(), "YOUR_API_KEY".to_owned()),
    ("TEA_ANTHROPIC_MODEL".to_owned(), "claude-3-5-sonnet-latest".to_owned()),
]);
let provider = AnthropicProviderBuilder::new()
    .with_resolver(Arc::new(MapCredentialResolver::new(values)))
    .build()?;
```

Applications with their own configuration service can inject a custom
`CredentialResolver` instead. The map values above are only example strings;
replace the API key with a secret from the application's configuration layer.

## Pass the provider to Tea

Both adapters expose the same provider-neutral model catalog:

```rust
let model = provider.models()[0].model_ref().clone();
let agent = AgentSession::builder(Arc::new(provider), model).build().await?;
```

Provider HTTP values, SDK errors, and continuation payloads do not enter Tea's
stable core messages. Add a new protocol by implementing `ModelProvider` in a
separate adapter crate.
