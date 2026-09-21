---
name: build-route
description: Add or change a page in the ON Courts portal. Use whenever creating a route, editing a page's content or metadata, or adding user-facing copy. Covers the server-rendering floor, bilingual copy, metadata, and which gates must pass.
---

# Building a route

A route is not done when it renders in your browser. It is done when it renders in the
**server's** HTML, in both languages, with its own metadata, and the gates pass.

This repeats for every page, which is why it is written down. The rules behind it are in
[`AGENTS.md`](../../../AGENTS.md).

## 1. Before you write anything

```bash
npm run check:ds-fresh
```

If this fails, stop. Anything built now is built against a different design system from
everyone else, and `check:ui-sync` will still pass because it only compares you to
whatever happens to be on disk.

## 2. Copy first, component second

Add every user-facing string to **both** `src/messages/en.json` and
`src/messages/ml.json`. Same keys, both files, no exceptions: `check:i18n` fails on a
key present in one language and missing from the other, and on a Malayalam value that is
still the English string.

No em dashes in copy. Commas, colons, semicolons, parentheses, or split the sentence.
En dashes in number ranges are fine.

If you cannot produce the Malayalam yet, that is a real blocker on the page, not a
formality to skip. Say so rather than shipping English into `ml.json`.

## 3. The page

Place it at `src/app/[locale]/<route>/page.tsx`. A server component — no `"use client"`
unless there is a genuine interaction, and then only on the smallest piece that needs it.

Every page needs:

- `generateMetadata` exporting **title, description, and `alternates.canonical`**.
  `check:meta` fails without all three.
- one `<main id="main">` wrapping the content.
- content rendered directly, never behind a client fetch. If the data comes from
  eGov/DIGIT, fetch it in the server component so it lands in the HTML.

Use DS type roles (`text-body`, `text-title-*` with `font-semibold`), not raw Tailwind
sizes. Use `var(--portal-measure)` for prose width.

## 4. Components

Reach for a DS primitive first: look in `src/components/ui/`, and at
[`docs/ds/agents.md`](../../../docs/ds/agents.md) for what exists.

```bash
npm run sync:ui -- <name>     # pull one in
```

Never hand-write a primitive the DS has, and never edit a synced one. A genuine gap goes
in [`docs/design/ds-requests.md`](../../../docs/design/ds-requests.md) and blocks only
the part of the page that needs it.

Composition specific to this portal goes in `src/components/portal/`. No coloured
single-edge accent borders.

## 5. Gates

```bash
npm run lint         # seconds. tokens, portal-tokens, typography, ui-sync, meta, i18n
npm run check:ship   # builds, then checks server rendering and JS weight
```

If `check:ssr` says a page's `<main>` has no real content, the page is client-rendered.
Fix the page, do not adjust the gate.

If `check:budget` fails, look for an unnecessary `"use client"` or a library imported at
module scope before raising the ceiling in `scripts/budget.json`.

## 6. Then look at it

At 320px and at 200% zoom, in both languages. Tab through it. No gate can judge a
layout, a reading order, or whether the Malayalam line breaks sensibly.

Tick anything the page closes in
[`docs/compliance/gigw.md`](../../../docs/compliance/gigw.md).
