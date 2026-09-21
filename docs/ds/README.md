# Design system rules — pinned copy

Every other file in this directory is a **byte-for-byte copy** of the Pucar design
system at the commit recorded in [`manifest.json`](manifest.json), which is the commit
pinned in [`../../ds.lock.json`](../../ds.lock.json).

## Why it exists

`vendor/pucar-design-system` is gitignored. On a fresh clone, before `npm install`, in
GitHub's web view, or in any tool without network access, the rules an agent is told to
obey simply are not on disk. An agent that cannot read the rules does not pause; it
invents. This directory closes that gap.

## Rules

**Never edit anything here.** `npm run check:ds-docs` hashes every file against the
manifest and rejects a single changed character. If a rule is wrong, it is wrong
upstream: raise it in [`../design/ds-requests.md`](../design/ds-requests.md).

**This is a copy, not the source.** If it ever disagrees with
`vendor/pucar-design-system`, the vendored clone wins and this directory is stale — run
`npm run sync:ds-docs`.

**Nothing here is transformed.** `laws.page.tsx` and `principles.page.tsx` keep their
`.tsx` extension because that is what they are in the design system: React pages whose
content lives in JSX props. Rendering them down to prose would produce something that
looks authoritative, drifts silently, and still passes a freshness check. The `.tsx`
reads perfectly well.

## What is deliberately absent

There is no `tokens.md`. The design system's README says the token families are
described in exactly two places, its `AGENTS.md` and its Foundations pages,
"deliberately, so a third copy cannot drift." `agents.md` here already carries the
generated token inventory, so a separate token document would be that banned third copy.

For token *values*, read `agents.md`. For how they look, run the design system's own
docs site.

## Updating

Only ever as part of a design-system bump:

```bash
npm run ds:bump      # moves the pin, re-syncs primitives, tokens and this directory
npm run check:ds-docs
```
