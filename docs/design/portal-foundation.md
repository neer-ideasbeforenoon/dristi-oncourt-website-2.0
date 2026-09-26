# The portal layer

What this repo adds on top of the design system, and why each thing is not just a DS
token.

The DS was tuned for dense, authenticated case screens: tables, forms, filing flows. A
public portal is mostly prose, notices and lookup. Reading measure and the portal type
system are the local layer. Colour and components stay on the pin.

## The mechanism

`src/app/app.css` is the only stylesheet the app imports:

```css
@import "./globals.css";             /* the DS, synced, byte-identical */
@import "./portal-tokens.css";       /* this repo, --portal-* only */
@import "./oncourts-typography.css"; /* portal type, imported last */
```

Order matters and the split matters. Keeping them in separate files is what lets the
first stay verifiably untouched while the local files grow. Importing `globals.css` directly
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

## Portal type

Decision D9. Product screens use `src/app/oncourts-typography.css`, not the DS type
utilities.

| | |
|---|---|
| Headings | Georgia, then Times New Roman, Times, Noto Sans Malayalam, serif. Weight 500. |
| Interface text | Inter, then Noto Sans Malayalam, then the DS Helvetica stack. |
| Roles | `type-display`, `type-feature`, `type-services`, `type-section`, `type-card`, `type-lead`, `type-body`, `type-support`, `type-eyebrow`, `type-nav`, `type-action`, `type-caption`. |

Fluid roles run from a 375px viewport to 1280px. The handoff specified the two sizes
and not the slope.

`next/font` loads Inter at 400, 700, and 800, and Noto Sans Malayalam at 400, 500, 700,
and 800. Georgia is a system face. Malayalam glyphs fall through to Noto in both stacks.
Heading line height is 1.35 when `lang` starts with `ml`. `check-typography` enforces
the roles and those weights.

Colour, spacing, and primitives stay on the pin. This file does not license a second
kind of fork. Anything else still goes to [ds-requests.md](ds-requests.md) first.

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
