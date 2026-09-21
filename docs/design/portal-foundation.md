# The portal layer

What this repo adds on top of the design system, and why each thing is not just a DS
token.

The DS was tuned for dense, authenticated case screens: tables, forms, filing flows. A
public portal is mostly prose, notices and lookup. That is a real difference, and it is
the only thing the local layer is allowed to encode.

## The mechanism

`src/app/app.css` is the only stylesheet the app imports:

```css
@import "./globals.css";      /* the DS, synced, byte-identical */
@import "./portal-tokens.css"; /* this repo, --portal-* only */
```

Order matters and the split matters. Keeping them in separate files is what lets the
first stay verifiably untouched while the second grows. Importing `globals.css` directly
from the layout would work today and quietly invite someone to add one variable to it.

`portal-tokens.css` may contain **custom-property declarations and nothing else**. No
`@theme`, no `@apply`, no ordinary CSS properties. A second stylesheet cannot register
Tailwind theme tokens anyway (only the entry holding `@import "tailwindcss"` emits
utilities), so an `@theme` block there would be silently dead, which is worse than
illegal.

Consume them as `var(--portal-x)` or in an arbitrary value:
`max-w-[var(--portal-measure)]`. The DS token gates deliberately permit `var()` inside
arbitrary values, so that stays legal.

`npm run check:portal-tokens` enforces all of it: no collision with any of the 296
DS-owned names, the `--portal-*` namespace, nothing but custom properties.

## What is in the layer today

| Token | Why the DS does not have it |
|---|---|
| `--portal-measure` | ~68 characters. The DS type scale is tuned for dense case tables; prose needs a line length a reader can track. |
| `--portal-prose-leading` | Looser than the DS's UI body leading, for long-form notices and FAQs. |
| `--portal-content-max` | The page column. Distinct from the measure: a cause-list table may be wider than prose. |

That is deliberately short. Every addition is a claim that the DS is missing something,
and most of the time the honest answer is that a DS semantic token already exists.

## The one sanctioned redefinition

Malayalam. There is no dependable Malayalam system font across Windows, Android and
macOS, so the DS's zero-download stack has nothing to fall back to for half this
portal's readers. DS `ACCESSIBILITY.md` §13 delegates non-Latin script coverage to the
consuming app, so this is the DS's own instruction, not an exception to it.

`next/font` loads Noto Sans Malayalam at weights 400 and 600 in the root layout. 600 is
not optional: the DS title roles are `font-semibold`, and a family without a real 600
gets synthesised or snapped to bold. `check-typography` enforces that weight.

The override is scoped to `[lang^="ml"]` and carries a `portal-tokens-allow` marker, so
English pages keep the DS stack byte for byte.

**This does not license a second exception.** Anything else goes to
[ds-requests.md](ds-requests.md) first.

## What the layer will need next, and does not have yet

Named here so they are not invented ad hoc. None of these is built:

- **GIGW page chrome** — accessibility statement, screen-reader access page, text-size
  and contrast controls, "last updated" stamps, the state emblem lockup, the mandated
  policy pages. See [../compliance/gigw.md](../compliance/gigw.md).
- **A prose component.** `--portal-measure` is a token; something has to apply it
  consistently to notices, FAQs and policy text.
- **The cause-list table treatment.** The DS has `Table`; a cause list is a specific,
  repeated composition of it. The Dristi app solved the equivalent with a shared
  `table-plate` helper rather than per-screen copies, which is the pattern to follow.

## The upstream direction

Anything here that turns out to be product-general should be promoted into the DS rather
than living in two places. The `--portal-*` namespace exists partly so that the
promotion shortlist is one grep.
