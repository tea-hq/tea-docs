---
title: Embedding and profiles
description: Wire tea-rs into a product through AgentRuntimeBuilder, AgentProfile, and the in-process command/event API.
---

> **Track:** `next` pre-release.

`tea` is the ergonomic embedding facade. It owns replaceable inward-facing ports
— model provider, tool registry, policy engine, session store, clock, ID source,
event sink, context providers, and prompt compiler — and exposes an in-process
command sender, bounded event subscription, session snapshots, and health
inspection. It contains no product prompt, live provider, UI, filesystem,
process, network, or database adapter.

## Runtime builder

`AgentRuntimeBuilder` wires the model, tools, policy rules, session store,
context providers, clock, ID source, and prompt compiler, then registers one or
more `AgentProfile` values. At `build`, the runtime precomputes one immutable
`ProfileBinding` per profile: a filtered `ToolRegistry` of the profile's active
tools, a `PolicyEngine` composed from the profile's resolved rules plus the
platform `UnknownEffectPolicy`, an ordered context-provider list, and converted
`RunLimits` and `PromptBudget`.

A profile is a declarative, versioned, serializable description. The runtime
resolves its tool and policy-rule references against builder-owned registrations;
an unresolved reference fails construction. The kernel remains product-agnostic:
the runtime constructs a fresh `AgentKernel` borrowing runtime-owned ports for
the duration of one async invocation.

## Commands and events

`AgentRuntime::send` accepts a canonical `CommandEnvelope` and dispatches
`CreateSession`, `Prompt`, `Steer`, `FollowUp`, `Abort`, `ResolveApproval`,
`SetModel`, `SetProfile`, `CompactSession`, and `ForkSession`.
`subscribe(session_id)` returns a bounded receiver of `EventEnvelope` values; a
full channel applies backpressure to the run, and a dropped receiver is removed.

`attach_session` validates stored profile/model compatibility. `snapshot`,
`session_state`, `session_stats`, and `health` expose immutable host queries
without creating a second authoritative transcript.

The runtime never creates a Tokio runtime, calls `block_on`, sleeps in tests, or
uses wall-clock entropy. Use the embedder's active runtime.

## Examples

The provider-free embedding path uses only the scripted provider and the
in-memory session store — no credential or network:

```bash
cargo run --example in_process -p tea
```

The `two_profiles` example composes coding and desktop profiles over the same
runtime, including native-tool declarations and approval behavior:

```bash
cargo run --example two_profiles -p tea
```

## Boundary

The facade never provides a concrete provider, UI, filesystem, process, network,
or database adapter. Adapter and product-specific types stay outside stable-core
APIs. The supported adapter, host, storage, and MCP surface is fixed by the
compatibility matrix; see [Protocol and RPC boundary](/integration/protocol-rpc/).
