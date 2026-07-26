# Upstream Reading Instructions

## Purpose

This checklist keeps public documentation accurate without giving the site build
or published repository a dependency on the authoritative product workspace.
Perform it locally before authoring or approving a technical page.

## Review order

1. Read the current `ROADMAP.md` for product status, explicit deferrals, and the
   scope of the documentation change.
2. Read `docs/ARCHITECTURE.md` for stable layer boundaries and dependency
   direction.
3. Read the relevant crate README files for the public API or integration
   surface being described.
4. For CLI, workspace, or automation topics, read the applicable guides under
   `docs/cli/` and `docs/mcp/`.
5. For compatibility, persistence, or release assertions, read the applicable
   material under `docs/1.0-*`, `docs/migrations/`, and `docs/RELEASING.md`.
6. For a user-visible safety statement, read the applicable public-safe guidance
   under `docs/security/` and the relevant product guide. Do not copy raw audits
   or detailed threat models into this repository.

Use [the page-to-source map](PAGE_TO_SOURCE_MAP.md) to select the exact reading
set. Read only the material needed for the proposed claim, then record the
public-safe conclusion in the page under review rather than copying internal
analysis.

## Resolving discrepancies

Product status comes from the roadmap. Behavioral contract claims come from the
relevant crate and architecture documentation. Security claims must retain the
most restrictive reviewed boundary. A release claim requires an explicit public
release record.

When sources disagree or a claim is unclear, do not infer a public answer.
Remove or defer the claim, identify the discrepancy in the review discussion,
and ask the product maintainers to reconcile the authoritative material first.

## Publication check

Before approval, verify that the proposed page:

- labels a released version or the `next` track;
- has an equivalent English or Simplified Chinese counterpart when the page is
  translated;
- contains no local paths, source-history details, secrets, or internal-only
  material; and
- can be understood and built from this repository alone.
