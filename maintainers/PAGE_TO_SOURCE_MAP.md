# Page-to-Source Map

This map identifies local authoritative material that maintainers review before
writing public pages. Its pointers are review aids, not site-build inputs,
deploy-time dependencies, or automatic exports. Public pages contain reviewed
summaries, not copied internal planning or audit material.

| Future public page | Local material to review | Required public boundary |
| --- | --- | --- |
| Overview and architecture | `README.md`, `docs/ARCHITECTURE.md`, `ROADMAP.md` | Label the page `next`; describe only implemented layers and explicit deferrals. |
| Source installation and CLI modes | `crates/tea-cli/README.md`, `docs/cli/README.md`, `docs/cli/commands.md`, `ROADMAP.md` | Do not imply a downloadable release until one is publicly announced. |
| Configuration and model access | `docs/cli/configuration.md`, `crates/tea-coding/README.md`, `crates/tea-model/README.md` | Use placeholders; never present sensitive values or environment captures. |
| Workspace trust and approvals | `docs/cli/security.md`, `crates/tea-policy/README.md`, `crates/tea-coding-tools/README.md` | Explain boundaries and user choices without internal operational detail. |
| Sessions, recovery, and branches | `docs/cli/sessions.md`, `crates/tea-session/README.md`, `crates/tea-session-sqlite/README.md` | Preserve durable-recovery limits and avoid promising unsupported recovery. |
| MCP configuration and lifecycle | `docs/mcp/README.md`, `docs/mcp/configuration.md`, `docs/mcp/lifecycle.md`, `docs/mcp/security.md`, `crates/tea-mcp/README.md` | State that configured servers are untrusted and avoid raw internal threat material. |
| Embedding and profiles | `crates/tea/README.md`, `crates/tea-profile/README.md`, `docs/ARCHITECTURE.md` | Keep adapters and product-specific types outside stable-core claims. |
| Models, tools, and policy | `crates/tea-model/README.md`, `crates/tea-tools/README.md`, `crates/tea-policy/README.md` | Describe ports and contracts without binding the core to a provider or host. |
| Session stores and protocol/RPC | `crates/tea-protocol/README.md`, `docs/cli/rpc.md`, `docs/migrations/1.0-compatibility-policy.md`, `docs/1.0-compatibility-matrix.md` | Identify protocol/version scope and distinguish transport from durable state. |
| Security and compatibility | `docs/security/1.0-runtime-threat-model.md`, `docs/security/1.0-redaction-audit.md`, `docs/1.0-api-stability.md`, `docs/RELEASING.md` | Publish only a public-safe summary; never copy detailed threats, audits, or release-process internals. |
| Simplified Chinese counterparts | The same material as the English page plus the approved English source page | Preserve facts, version labels, commands, limitations, and safety notices. |

If a required source is unavailable, unclear, or internally inconsistent, omit
the corresponding public claim until maintainers resolve it. Do not replace
review with inference.
