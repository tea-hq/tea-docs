---
title: Tools and policy
description: Add workspace tools to an agent and understand the default authorization boundary.
---

## Add read-only workspace tools

```sh
cargo add tea-coding-tools
```

Extend the [Quick Start](/sdk/quick-start/) before building the session:

```rust
let workspace = WorkspaceRoot::new(".")?;
let agent = AgentSession::builder(Arc::new(provider), model)
    .tools(read_only_workspace_tools(&workspace)?)
    .build()
    .await?;
```

The preset adds workspace-confined `read`, `grep`, `find`, and `ls`. Paths are
resolved through the explicit `WorkspaceRoot`; the tools do not receive an
unrestricted ambient filesystem root.

`AgentSession` includes a basic policy that allows declared pure filesystem
reads. Every other effect fails closed unless the host registers an explicit
policy rule.

## Add an application tool

A tool registration consists of its contract, resource resolver, and executor:

```rust
let agent = AgentSession::builder(Arc::new(provider), model)
    .tool(spec, Arc::new(resolver), Arc::new(executor))
    .policy_rule(rule_id, Arc::new(rule))
    .build()
    .await?;
```

Declare effects and affected resources precisely. Arguments are schema-checked
and resources are resolved before policy runs; invalid input never reaches the
executor. A grant may satisfy an `Ask` decision, but it never overrides a deny.

Policy authorizes an operation; it is not a process sandbox. Run untrusted tools
in a separate container, VM, restricted account, or remote worker.
