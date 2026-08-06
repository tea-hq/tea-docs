---
title: Approvals and grants
description: How tea evaluates tool invocations, presents approvals, and bounds grants.
---

Policy evaluates a validated invocation — not merely a tool name — against
actor, profile, workspace, tool spec, validated arguments, declared effects,
resolved resources, prior grants, execution environment, and time. Evaluation
is synchronous and performs no side effect or clock read.

## Decisions

```text
Allow
Deny(reason)
Ask(approval request)
Redirect(execution target, such as a sandbox)
```

Composition precedence is `Platform -> Organization -> Product -> Workspace ->
User grant`. A lower layer may narrow permissions but cannot broaden a prior
result. The restriction order is `Allow < Redirect < Ask < Deny < HardDeny`; a
hard deny terminates evaluation immediately. Empty or fully abstaining policy
sets fail closed.

## Approval choices

An approval request is durable and redacted. Choices are:

- **allow once** — authorize this single invocation;
- **allow for session** — issue a grant bounded to matching resources in the
  current session;
- **deny** — reject this invocation.

Choose an option only after checking the exact tool, effects, resource, access
mode, and target. Approval means "authorize this operation under the recorded
policy context" — it does not mean the operation is safe.

## Grants

A matching active grant may satisfy only `Ask`; it never overrides a deny.
Grants are bounded by actor, profile, exact tool and version, effect subset,
resource scheme/prefix/access, scope, issuance, expiry, and revocation.
Allow-for-session is not a workspace bypass.

## Recovery

An approval decision is committed before tool execution resumes. Closing the
process while an approval is pending leaves the same request available after
reopen. A tool interrupted after side effects begin is recorded as uncertain and
is never replayed automatically. See [Sessions and recovery](/tea-docs/sessions/sessions/).
