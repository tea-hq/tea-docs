---
title: Model providers
description: The provider-neutral model port — ModelSpec, ModelRequest, the streaming grammar, and how to implement a ModelProvider adapter.
---

> **Track:** `next` pre-release.

`tea-model` is the provider-neutral model layer. It contains no live provider
adapter, HTTP client, credentials, retry loop, agent loop, or persistence
implementation. The public API intentionally contains no OpenAI, Anthropic,
Vercel AI SDK, HTTP, SSE, or WebSocket types.

## Responsibilities

- validated `ModelSpec` values and capability declarations;
- immutable provider-neutral `ModelRequest` turn snapshots;
- model-visible tool names, descriptions, and bounded object JSON Schemas;
- provider-neutral reasoning effort and budget;
- project-owned cooperative `ModelCancellation`;
- normalized model events, failures, stop reasons, usage, and exact cost;
- object-safe `ModelProvider` and `ModelStream` ports;
- deterministic stream grammar validation.

## Stream grammar

A fully consumed conforming stream:

1. emits exactly one `Started` event first;
2. emits zero or more text, thinking, and tool-call events;
3. emits exactly one terminal `Completed` or `Failed` event;
4. emits nothing after termination.

Tool calls use a response-local bounded index and an opaque provider call ID. A
tool index cannot be reused in one response. Argument deltas are incomplete
strings and are never executable; only `ToolCallCompleted` carries parsed, bounded
JSON object arguments. Successful termination is rejected while any tool call
remains incomplete. Cancellation and provider/runtime errors use typed terminal
`Failed` events; raw HTTP bodies, credentials, and SDK errors are not stored in
`ModelFailure`.

## Cancellation and ownership

`ModelCancellation` is the project-owned cooperative scope shared with the tool
runtime; it wraps Tokio-util internally without exposing `CancellationToken`.
Providers receive cancellation separately from the immutable request. Streams are
lazy and own their resources; implementations must not create nested runtimes or
detached tasks. Dropping a stream abandons it; explicit cancellation is
cooperative.

## Implementing an adapter

A future provider adapter must:

- translate canonical messages and tool schemas;
- validate requests against advertised model capabilities;
- normalize streaming output and failures;
- preserve provider continuation signatures only behind bounded, namespaced
  metadata;
- normalize usage, exact cost, and stop reasons;
- report setup and streaming failures as terminal events rather than panics;
- pass the `tea-testkit` conformance utilities using mocked transports before any
  live API test.

Implement `tea_model::ModelProvider` in a separate adapter crate. The kernel is
responsible for agent-level retries and must not inspect raw HTTP payloads.

## Reference providers

The `ScriptedModelProvider` in `tea-testkit` is the hermetic reference provider
for embeddings and products. The OpenAI-compatible adapter maps the Chat
Completions SSE surface without making the facade depend on OpenAI types or
credentials; its live smoke is opt-in and never a normal CI gate.
