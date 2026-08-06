---
title: Workspace trust
description: How tea decides whether to load project-local settings, skills, and prompt templates, and what trust does and does not do.
---

The presence of `AGENTS.md`, `CLAUDE.md`, or `.tea/` marks a workspace as having
project-local resources. Before trust, the CLI does not load project settings,
skills, or prompt templates. Trust permits loading text; it does not validate
the text's intent or make it safe.

## Trust flags

| Flag | Behavior |
| --- | --- |
| `--trust default` | Use a saved decision; otherwise headless use fails closed |
| `--trust once` | Load project resources for this invocation only |
| `--trust persist` | Save trust for the canonical workspace identity |
| `--trust reject` | Reject project-local resources |
| `--trust ignore` | Continue without project-local resources |

Use `--trust ignore` to work without project-local settings and declarative
resources. Explicit prompt/context and ordinary source files can still contain
prompt injection.

## Resource discovery

- Global skills are discovered below `<data-dir>/skills/**/SKILL.md`; trusted
  project skills are below `.tea/skills/**/SKILL.md`.
- Global prompt templates are non-recursive Markdown files in
  `<data-dir>/prompts`; trusted project templates are in `.tea/prompts`.
- Explicit `--context-file` paths are workspace-confined.

## Before you trust a workspace

Repository text is model input. `AGENTS.md`, `CLAUDE.md`, source files,
documentation, `.tea/settings.json`, prompt templates, and `SKILL.md` content
may attempt to override instructions or induce unsafe tool use.

Before `--trust once` or `--trust persist`:

1. Inspect `AGENTS.md`, `CLAUDE.md`, and `.tea/` outside the agent.
2. Reject unexpected skill paths or prompt templates.
3. Check each approval's exact tool, effects, resource, access, and target.
4. Deny broad shell commands or commands that read ambient credentials.
5. Review Git changes and test output before keeping a mutation.

See [Approvals](/tea-docs/safety/approvals/) and
[Security](/tea-docs/safety/security/).
