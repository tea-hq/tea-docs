---
title: Tools and policy
description: The portable tool contract, the effect vocabulary, ordered policy composition, and durable approvals and grants.
---

> **Track:** `next` pre-release.

`tea-tools` is the portable tool runtime; `tea-policy` is the pure policy engine.
The two are deliberately separated: policy consumes tool metadata without
executor dependencies.

## Tool contract layers

- `ToolSpec` — identity, semantic version, model-facing description and object
  schemas, effects, prompt/UI hints, timeout, concurrency, idempotency, and
  retry safety.
- `ToolInvocation` — complete but untrusted object arguments.
- `ValidatedToolInvocation` — constructible only after registry schema validation
  and pure resource resolution.
- `ToolExecutor` — object-safe lazy stream port receiving only validated
  invocations and shared cancellation.
- `ToolResult` — model-visible text/images, bounded machine output, safe details,
  and optional tool-specific usage.
- `ToolRegistry` — deterministic registration, conflict detection, validation,
  resolution, execution delegation, and output-contract enforcement.

Input and output schemas use JSON Schema Draft 2020-12 (bounded size and depth).
Schema compilation rejects external `$ref` retrieval and never reads local files
or makes network requests. Execution order is:

```text
untrusted invocation -> input schema validation -> pure resource resolution
  -> validated invocation -> executor stream -> output schema validation
  -> terminal result/failure
```

Invalid arguments never reach an executor. Missing terminal events and invalid
output are normalized to typed contract failures.

## Effects and scheduling

Known effects are `fs.read`, `fs.write`, `fs.delete`, `process.spawn`,
`network.request`, `credential.read`, `clipboard.read`, `user.interaction`, and
`external.mutation`. Unknown effects are preserved but fail closed as
policy-required, serial, and not automatically retryable. Scheduler
classification uses declared effects and execution semantics only — never tool
names. Non-idempotent tools cannot declare automatic retry; an interrupted
uncertain operation is not automatically replayable.

## Policy composition

`PolicyInput` can only be built from a `ValidatedToolInvocation`. It snapshots
actor, profile, session/run/workspace, canonical tool name and version,
schema-validated arguments, declared effects, resolved resources, execution
surface, bounded environment metadata, caller-supplied evaluation time, and
candidate grants. Policy never reads the clock — the caller supplies `now`,
making expiry deterministic.

Rules execute in fixed authority order:

```text
Platform -> Organization -> Product -> Workspace
```

Decision restriction is monotonic: `Allow < Redirect < Ask < Deny < HardDeny`. A
lower layer can narrow but cannot broaden a previous decision. `HardDeny`
terminates immediately. Empty or fully abstaining engines fail closed.
`UnknownEffectPolicy` hard-denies namespaced effects the runtime does not
understand. Rule traces contain only bounded rule IDs, layers, and decisions —
not raw arguments. A `git status` command can be allowed while a destructive
command asks for approval, even when both share one executor.

## Grants and approval

A `PolicyGrant` is serializable and constrained by actor, profile, exact tool
and version, effect subset, resource scheme/prefix/access, scope (once, run,
session-resource, or expiring persistent-resource), issuance, expiration, and
optional revocation. A grant can satisfy `Ask` only — it never overrides `Deny`
or `HardDeny`. Approval presentation recursively redacts secret-key variants,
credential resources, and URL query values; original arguments are unchanged.

Policy is not a sandbox. A native executor has the process's operating-system
permissions; strong isolation requires a separate execution target. See
[Security](/safety/security/) and [Approvals](/safety/approvals/).
