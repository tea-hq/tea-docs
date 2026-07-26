# Documentation Maintainer Contract

## Scope

This repository contains reviewed public documentation for tea-rs. It is not a
source mirror, a source export target, or a substitute for the authoritative
product workspace.

Keep future public pages English-first at `/` with equivalent Simplified Chinese
pages at `/zh/`. Treat translations as the same factual change: version labels,
safety boundaries, commands, and support claims must remain equivalent.

## Required upstream review

Before writing or approving a technical page, read the local authoritative
material described in [the upstream-reading instructions](maintainers/UPSTREAM_READING.md)
and identify the relevant entries in [the page-to-source map](maintainers/PAGE_TO_SOURCE_MAP.md).
The public site must build without that local workspace; source pointers are
review aids only, never build inputs or automatic exports.

Use [the public-status record](maintainers/PUBLIC_STATUS.md) to determine the
current public release or `next` track. Every technical page must state which
one applies. Do not add installation, download, compatibility, or support claims
that the reviewed material does not establish.

## Public-content boundary

Add only reviewed public content. Do not copy source history, local checkout
paths, repository connection details, commit identifiers, secrets, raw internal
plans, decision records, audits, or detailed threat models. Sanitize commands,
logs, screenshots, links, configuration examples, and error output before they
enter this repository.

Public examples must be safe to run, deterministic where practical, and use
placeholders for sensitive values. Explain user-visible security behavior without
revealing internal-only operational detail.

## Review and deployment

Resolve a discrepancy by returning to the authoritative material; do not guess
or silently preserve a stale public statement. If the required source material
does not justify a public claim, omit the claim and request a reviewed product
decision.

Public pages and the maintainer context require ordinary review. Site deployment
is enabled only through a least-privilege workflow in this repository after its
dedicated review; these files do not authorize a deployment or a package release.
