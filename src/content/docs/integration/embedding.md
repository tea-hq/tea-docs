---
title: Embed Tea
description: Keep an agent session in your application and choose when to move to the lower-level runtime.
---

Start with [`AgentSession`](/tea-docs/sdk/quick-start/). Keep the session alive for as
long as the conversation should retain context:

```rust
let agent = AgentSession::builder(Arc::new(provider), model)
    .system_prompt("Answer with short, actionable steps.")
    .build()
    .await?;

let first = agent.prompt("Review this API shape.").await?;
let second = agent.prompt("Now suggest a smaller version.").await?;
```

Each `prompt` waits for the completed response and returns aggregated visible
text. The session is in memory; dropping it ends that conversation.

## Set host identities

Applications with multiple users or workspaces should supply stable identities:

```rust
let agent = AgentSession::builder(Arc::new(provider), model)
    .actor("user:42".parse()?)
    .workspace("workspace:docs".parse()?)
    .build()
    .await?;
```

These identities flow into policy and session context. Do not put secrets or
display names in them.

## Choose the API level

| Use | When |
| --- | --- |
| `AgentSession` | One in-memory conversation, plain-text prompts, final aggregated responses. |
| `AgentRuntime` | Streamed events, durable stores, approvals, multiple profiles, steering, follow-ups, or custom runtime ports. |

Tea uses the Tokio runtime already owned by your application. It never creates
a nested runtime or calls `block_on`.

Next, add [tools and policy](/tea-docs/integration/tools-policy/) or a
[durable session store](/tea-docs/integration/session-stores/).
