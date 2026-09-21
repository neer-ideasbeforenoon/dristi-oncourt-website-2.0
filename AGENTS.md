# ON Courts web — the rulebook

The public court portal for Kerala. It **composes** the Pucar design system; it does not
maintain a second set of primitives or tokens.

This file is the whole rulebook. `CLAUDE.md` points here. There is no `.agents/` tree
and no generated per-tool adapters: one builder, one file. If a second person or a
parallel agent starts building screens, port the rails machinery from `pucar-dristi`
then, not before.

---

## 1. The design system is not optional, and it is not here to be edited

The DS reaches this repo as **committed files**, synced from a **pinned commit**.

| Path | What it is | May I edit it? |
|---|---|---|
| `src/app/globals.css` | DS tokens, byte-identical to the pin | **No.** `check:ui-sync` fails on one changed character. |
| `src/components/ui/*.tsx` | DS primitives, byte-identical | **No.** Re-sync instead. |
| `src/lib/utils.ts` | DS helper | **No.** |
| `docs/ds/*` | Verbatim copy of the DS rule documents | **No.** `check:ds-docs` hashes every file. |
| `src/app/portal-tokens.css` | This repo's own tokens | Yes, additively. See §3. |
| `src/components/portal/`, `src/components/chrome/` | This repo's composition | Yes. |

```bash
npm run sync:ui -- button input     # pull primitives
npm run sync:ui -- --tokens-only    # pull tokens + lib/utils.ts
npm run check:ds-fresh              # am I on the pinned DS? run before DS-dependent work
```

**Never hand-write a primitive that the DS already has.** Check `docs/ds/agents.md` and
the DS's own `src/components/ui/` first. If a supported variant or composition genuinely
cannot meet the need, that is a **request**, recorded in
[`docs/design/ds-requests.md`](docs/design/ds-requests.md). It blocks the dependent part
of the task and nothing else. Work around it locally and you have forked the design
system, which is the single failure this repo is built to prevent.

`npx shadcn@latest add` is **not** the sanctioned path. The `@pucar` registry in
`components.json` points at the live docs site, which is whatever was last deployed, not
the pin. Use it to look at something; never to install into `src/components/ui/`.

The pin moves only through `npm run ds:bump`, which re-syncs everything and prints what
changed. Committing `ds.lock.json` without the files it re-synced leaves the repo
claiming a version it is not on.

## 2. Server-render everything a reader needs

The portal this replaces answers every request with 2,856 bytes whose entire body is a
spinner and the words "Loading, please wait...". Its cause lists, notices and case
records do not exist for a text browser, a crawler, or anyone on a slow phone.

So:

- Server components by default. `"use client"` needs a genuine interaction to justify it.
- Content never depends on a client-side fetch to appear. If data comes from the
  eGov/DIGIT services, fetch it in a **server** component so it lands in the HTML.
- Never add `output: "export"` to `next.config.ts`.
- Every page has one `<main id="main">` holding its content.

`npm run check:ssr` reads the built HTML and fails if a page's `<main>` is empty.

## 3. The local token layer adds; it never redefines

`src/app/portal-tokens.css` may declare `--portal-*` custom properties and nothing else.
No `@theme`, no `@apply`, no ordinary CSS properties. A second stylesheet cannot register
Tailwind theme tokens anyway, so an `@theme` block there would be silently dead.

`src/app/app.css` imports `globals.css` then `portal-tokens.css`, in that order, and is
the only stylesheet the app imports. Do not add a third line to it.

The portal **defines no brand colour**. `--primary` resolves to `#007e7e` in light and
`#0eb39e` in dark, from the pinned DS, exactly as the Dristi app gets it. Writing that
hex into a component is a token-gate failure; the DS README uses `bg-[#007e7e]` as its
own example of what not to do.

One redefinition is sanctioned, and only one: extending `--font-sans` for Malayalam,
scoped to `[lang^="ml"]`, because DS `ACCESSIBILITY.md` §13 delegates non-Latin script
coverage to the consuming app. It carries a `portal-tokens-allow` marker. Do not add a
second exception without a DS request first.

## 4. Two languages, always in step

Copy lives in `src/messages/en.json` and `src/messages/ml.json`, one key per string,
**every key in every language**. No user-facing sentence is hardcoded in a component.

`<html lang>` is set in the layout, on the server, from the URL locale. Never in an
effect: the portal being replaced does exactly that, which is why every page it serves
is `lang="en"` whatever the reader chose.

Malayalam is not a later phase. This is a Kerala portal and GIGW treats multilingual
delivery as a requirement.

## 5. Accessibility is the DS's standard plus GIGW

Read [`docs/ds/accessibility.md`](docs/ds/accessibility.md) once per task. It is WCAG 2.1
AA, WAI-ARIA 1.2, 40x40px touch targets, visible focus, 200% zoom, Indic scripts.

On top of it, this is an Indian government website, so GIGW 3.0 applies: 88 checkpoints
plus the mandated policy pages. Status lives in
[`docs/compliance/gigw.md`](docs/compliance/gigw.md).

## 6. Two client-stated rules, inherited from pucar.org

These came from the client and have been broken before:

1. **No single-edge coloured accent borders.** No `border-left`/`-top`/`-right`/`-bottom`
   used as a decorative coloured stripe on a card, callout, blockquote, list item or
   active nav state. Use a soft filled background, a uniform hairline on all sides, a
   shadow, or a filled badge instead. Uniform all-round borders are fine.
2. **No em dashes in user-facing copy.** Use commas, colons, semicolons, parentheses, or
   split the sentence. En dashes in number ranges (`26–30`) are fine. This applies to
   `src/messages/*.json` and any visible string, not to code comments or these docs.

## 7. Before you say it is done

```bash
npm run lint         # source-only, seconds: tokens, portal-tokens, typography, ui-sync, meta, i18n
npm run check:ship   # builds, then: ssr, budget
npm run verify       # everything, including the DS pin and docs/ds freshness
```

`lint` deliberately contains nothing that needs a build, so a small edit is never
blocked by an unrelated compile. Look at the rendered page too: no gate can judge a
layout.

---

**Precedence when these conflict:** the pinned DS's own `AGENTS.md` and `ACCESSIBILITY.md`
(mirrored in `docs/ds/`) outrank this file on anything about tokens, primitives or
accessibility. This file outranks habit.
