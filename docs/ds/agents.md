<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Pucar Design System

This repo is the source of truth for Pucar's design tokens and UI components. It exists so
that both humans and AI coding agents build UI that matches Pucar's actual design system,
instead of inventing new colors, spacing, or components per-project.

**Stack:** Next.js (App Router) + TypeScript · Tailwind CSS v4 · shadcn/ui (Radix primitives).
Tokens are CSS custom properties in `src/app/globals.css`, mapped via `@theme inline`.

---

## Precedence

When sources disagree, resolve in this order:

1. **The live Figma component master** — Abhiram's "Pucar Design System" file
   (cover: *Pucar · ON Court — Design system · Rajini 2.0*). This is the design contract.
2. **This file**, then the code it points at.
3. **Site prose** in `src/app/(docs)/`.

A component master beating prose is normal. When it happens, change the code and record the
discrepancy in `CHANGELOG.md` — do not silently leave the two disagreeing.

---

## Commands

```bash
npm install
npm run dev            # docs site on http://localhost:3000
npm run lint           # eslint + token and coverage rules — the gate that must pass
npm run build          # production build; catches type and prerender errors
npm run sync:tokens    # regenerate the token inventory below from globals.css
```

`npm run lint` also runs `check:tokens` (rules 1, 4 and 5 — including named palette colours
and raw-unit arbitrary spacing/radius), `check:contrast` (rule 9, plus rule 1 applied to
`globals.css` itself) and `check:ds` (every component reachable from the docs and backed by
a real file). GitHub Actions runs the same gate on every pull request. Run it before claiming
any work is finished.

A green gate is not the same as a good design. It proves the mechanical rules hold; it says
nothing about whether a hover is perceptible or a component matches its master.

---

## Where things live

| Path | What it owns |
| --- | --- |
| `src/app/globals.css` | Every design token, light and dark. The only place raw color values belong. |
| `src/components/ui/` | Design system components — registry primitives plus Pucar-specific ones. |
| `src/components/docs/` | Docs chrome and page primitives (`Section`, `PageHeader`, `Callout`, `DoDont`, `TokenSwatch`). |
| `src/components/docs/component-registry.tsx` | The documented content for each component page. |
| `src/lib/docs-nav.ts` | Sidebar IA — and the list that generates component routes. |
| `src/app/(docs)/` | Foundations, principles, and block pages. |
| `src/hooks/use-mobile.ts` | `useIsMobile()` — the viewport check to use instead of `window.innerWidth`. |
| `scripts/` | `sync-tokens` generates the inventory; `check-*` enforce the rules in `lint`. |

---

## Non-negotiable rules

**1. Never hardcode a color, spacing, or radius.** Use the utility that maps to a token.

```tsx
// wrong — enforced by `npm run lint`
<div className="bg-[#007e7e] rounded-[7px]" />
// right
<div className="bg-primary rounded-lg" />
```

**2. Never hand-write a shadcn component.** Install it for real so it stays upstream-correct
and upgradeable: `npx shadcn@latest add <component>`.

**3. Reuse before creating.** Check `src/components/ui/` first — there are 67 components
already installed. Compose them before adding a primitive.

**4. Every color works in both modes.** Add the token to `:root` *and* `.dark` in
`globals.css`. A token defined in only one mode fails `npm run lint`.

**5. Never reach for a raw grey.** Go through a semantic token, not the ladder underneath it.

```tsx
// wrong
<p className="text-neutral-11" />
// right
<p className="text-muted-foreground" />
```

**6. Exactly three treatments per status** — solid (`success`), muted (`success-muted`), and
ink (`success-ink`). Never invent a fourth, and never fake one with alpha (`bg-destructive/10`).
Use the opaque `-muted` token instead.

**6a. A status tint needs its own solid as a stroke when it sits on another tint.** The
`-muted` fills are pale by design, so a status tile on any non-white surface has almost no
edge — a `success-muted` media tile on a `surface-sunken` row measures **1.01:1**, which is
no boundary at all. Give the tile `border border-success` (the solid, an existing treatment
— not a fourth): 2.72:1 against its own fill and 2.76:1 against the row. Applies to every
status media tile, chip, and callout that does not sit directly on the white page.

**7. Follow the Laws, not just the tokens.** Sentence case everywhere; one rationed teal
action per view; depth via fill, not borders; status never conveyed by color alone; 40px
default control height; 24px container padding; 40×40px minimum touch target. Full text:
`src/app/(docs)/foundations/laws/page.tsx` and `src/app/(docs)/principles/page.tsx`.

**7a. Stay on the spacing ladder.** 4px grid, 8px rhythm. Allowed Tailwind steps only:
`0.5 · 1 · 1.5 · 2 · 2.5 · 3 · 4 · 6 · 8 · 12 · 16` (2–64px). Micro steps
(`0.5` / `1.5` / `2.5`) live **inside controls only**. Off-ladder utilities
(`p-5`, `p-7`, `gap-5`, `gap-10`, `mb-10`…) and raw-unit arbitraries
(`p-[13px]`) are defects. Code ships **no custom spacing tokens** — Tailwind’s
default scale is the source of truth. Defaults: control height `h-10` (40px);
card padding `p-6` (24px), `p-4` for sm; section gaps `gap-8`+. Radius is a
separate knob (`--radius: 0.625rem` → controls `rounded-lg`, containers
`rounded-xl`). Full text: `/foundations/spacing` and `/foundations/radius`.

**8. Responsive and accessible are requirements, not polish.** Product UI follows
[`RESPONSIVE.md`](./RESPONSIVE.md) and [`ACCESSIBILITY.md`](./ACCESSIBILITY.md)
(floor: WCAG 2.1 AA + WAI-ARIA 1.2). The docs site itself need not be responsive; the
components must be.

**9. Every colour pair is measured, never asserted.** `check:contrast` computes 54 pairs in
both modes — text at 4.5:1, chart series and field borders at 3:1. Adding a token that
carries text or meaning means adding its pair to `scripts/check-contrast.mjs`.

Structural neutrals are deliberately *not* held to 3:1. Radix builds ramp steps 2–8 below
that on purpose and WCAG 1.4.11 exempts a decorative boundary, so `border` sits at
neutral-8. Any control whose edge is the only thing identifying it uses `input` (neutral-9,
3.42:1 on the white page) instead — that one *is* enforced.

**10. Use the token the role names.** `accent` is the hover fill, `accent-strong` is the
pressed, engaged and selected fill, `track` is the recessed well, `muted` is a resting
surface and never an interaction state. Reaching one step lighter than the named token is
how the entire system ended up with invisible hovers.

**Grouped content:** when a panel must read as its own unit (FAQ, form section, case
facts), compose `Card`. The page is white and `card` shares that white on purpose:
a panel reads by its hairline edge and raised shadow, not by a fill difference —
separation is a whisper stroke, never a block of colour (owner ruling 2026-08-25).
Dark stays flat (`card` = `background` = neutral-1); the border still defines the
panel there. `muted` / `surface-raised` sit on neutral-2 — do not use them alone as
a panel without an edge. Nested wells inside a card use `surface-sunken`, with a
hairline when the well holds interactive content. Never an unbordered muted box.
Key-value rows use `DescriptionList` inside `Card`. Form chrome uses `bg-card`.

To document a rule violation deliberately — an anti-example in the docs, say — put
`ds-tokens-ignore` in a comment on that line or the one above it.

---

## Recipes

### Add a component

1. `npx shadcn@latest add <slug>` → lands in `src/components/ui/<slug>.tsx`.
2. Add a `ComponentDoc` entry to `componentRegistry` in
   `src/components/docs/component-registry.tsx`, keyed by slug. The shape is
   `src/lib/component-doc-types.ts`; the `available()` helper covers a minimal entry.
3. Add `{ title, href: "/components/<slug>" }` to the right section of `src/lib/docs-nav.ts`.
4. `npm run lint && npm run build`.

Write a real `whenToUse` rather than leaning on the `available()` boilerplate. `npm run lint`
reports how many components still carry it, and a component with no reviewed guidance is a
component the system has not actually decided on.

Steps 2 and 3 are both required, and they fail differently. `docs-nav.ts` is what *creates*
the route — `generateStaticParams` and the 404 guard in
`src/app/(docs)/components/[slug]/page.tsx` both read `getAllComponentSlugs()`, which reads
`docsNav`. A registry entry with no nav entry produces no page at all; a nav entry with no
registry entry produces an empty one.

### Add or change a token

1. Define the value in **both** `:root` and `.dark` in `src/app/globals.css`. Prefer aliasing
   an existing primitive over pasting a new hex.
2. Expose it in `@theme inline` as `--color-<name>: var(--<name>)`.
3. `npm run sync:tokens` to refresh the inventory below.
4. If it is a new *family*, add a row to the semantics table — the generator only owns names.
5. Add the pair to `scripts/check-contrast.mjs` if it carries text or meaning, then run
 `npm run check:contrast`. Do not eyeball a new pair and do not assert a ratio in prose.
6. Prefer `color-mix` over a flattened hex when the value is "some token at N%". Figma
 stores those flattened because it drops paint opacity on a bound variable; that is a Figma
 constraint, not a spec. The exception is `scrim`, where the pre-`color-mix` fallback would
 turn a 50% backdrop opaque.

### Adapt an upstream component

Registry primitives stay upgradeable, so prefer theming via tokens over editing markup. Keep
their responsive utilities and ARIA wiring intact — never strip `sm:` / `md:` classes, `role`,
`aria-*`, or focus traps to simplify a desktop mock. When Rajini 2.0 genuinely defines a
different contract, adapt the component and record what diverged in `CHANGELOG.md`.

### Add a foundations page

Create `src/app/(docs)/foundations/<name>/page.tsx`, build it from `src/components/docs/`
primitives, and add a Foundations entry to `docsNav`.

---

## Tokens

### What each family means

The generator below owns the token *names*. This table owns their *meaning* — read it first.

| Family | Use |
| --- | --- |
| `background` / `foreground` | Page background (light: white; dark: `neutral-1`) / default text |
| `surface` / `surface-raised` / `surface-sunken` | Structural base (= page, white in light) / elevated stage (neutral-2) / recessed well — nested wells inside panels and control wells (tabs, segmented), never the page |
| `track` | Tiny countable marks only — progress, slider, skeleton. Control-sized wells (tabs list, segmented control) use `surface-sunken` + `hairline` instead: separation is a whisper stroke, not a block of colour |
| `prefilled` | Machine-prefilled, human-unverified field fill |
| `primary` / `primary-foreground` | Highest-emphasis actions (teal brand color) |
| `brand-accent` | Bright teal for non-text marks (chart lines, active underlines) — never for text |
| `brand-muted` / `brand-muted-foreground` | Brand-tinted chips that carry text |
| `brand-canvas` / `-deep` / `-foreground` / `-muted-foreground` | The deep-teal plate behind full-height sign-in and marketing panels. `-deep` is the gradient's far stop. Identical in both modes on purpose — a fixed institutional surface, not a themed one. Never a chip, a button, or a page background. |
| `paper` / `-foreground` / `-muted` / `-muted-foreground` / `-border` | The legal-document facsimile — the court-document preview and the e-signed PDF. Fixed cool-grey, identical in both modes and deliberately outside the neutral ramp: a printed complaint is a convention the reader recognises, and it does not go warm or dark because the product's palette did. Never for app chrome. |
| `secondary` / `muted` / `accent` (+ `-foreground`) | Supporting actions / de-emphasized surfaces / transient hover fills |
| `accent-strong` | One step past accent — pressed toggles, engaged triggers |
| `destructive` (+ `-foreground`) | Irreversible or dangerous actions, solid treatment |
| `success` / `warning` / `info` (+ `-foreground`) | Status solids — the action IS the status |
| `*-muted` (+ `-foreground`) | Status tint pairs — chips, callouts, rows. Use instead of alpha. |
| `*-ink` | Status text and icons on a neutral background — never a fill |
| `*-hover` / `*-muted-hover` | Opaque hover composites. Use these rather than an alpha overlay. |
| `border` / `input` / `hairline` | Default borders / form field borders / the faintest divider |
| `ring` / `focus-ring` / `focus-ring-destructive` | Focus ring color and its translucent halos |
| `scrim` | Modal and drawer backdrops |
| `disabled-fill` | Disabled control fill |
| `halo` | Emphasis glow — e.g. Timeline's current state |
| `card` / `popover` | Panel fills — share the page white in light; a panel reads by its hairline edge and raised shadow, not by fill |
| `sidebar-*` | Sidebar-scoped aliases; keep them in step with their base tokens |
| `chart-1` … `chart-5` | Categorical data viz — means "different series" only, never status |
| `shadow-raised` / `shadow-overlay` / `shadow-modal` | Lifted boxes / popovers, menus, tooltips / dialogs, sheets |
| `text-display` … `text-caption` | Type size tokens. Figma's 11 named styles are these 8 sizes plus weight and mono variants — see `/foundations/typography`. Never an arbitrary size for a heading. |
| `radius-*` | Corner radius from one `--radius` knob (10px). Controls use `rounded-lg`, containers `rounded-xl`, insets `rounded-md`/`sm`, chips `rounded-full`. |
| *(spacing)* | **Not a CSS token family.** Use Tailwind’s default scale on the ladder above — never invent `--spacing-*` variables. |

**Brand:** primary is teal — `#007e7e` light, `#0eb39e` dark.

**Typeface:** product UI ships a zero-download system stack — `"Helvetica Neue", Helvetica,
Arial, system-ui`. Figma substitutes Inter only because Helvetica Neue is absent from that
rendering environment; that substitution never applies to shipped code.

### Full inventory

<!-- BEGIN:generated-tokens -->
<!-- Generated by `npm run sync:tokens` from src/app/globals.css. Do not edit by hand. -->

**Color** (85) — use as `bg-*`, `text-*`, `border-*`, `ring-*`, `fill-*`, `stroke-*`.

`accent` · `accent-foreground` · `accent-strong` · `background` · `border` · `brand-accent` · `brand-canvas` · `brand-canvas-deep` · `brand-canvas-foreground` · `brand-canvas-muted-foreground` · `brand-muted` · `brand-muted-foreground` · `brand-muted-hover` · `card` · `card-foreground` · `chart-1` · `chart-2` · `chart-3` · `chart-4` · `chart-5` · `destructive` · `destructive-foreground` · `destructive-hover` · `destructive-ink` · `destructive-muted` · `destructive-muted-foreground` · `destructive-muted-hover` · `disabled-fill` · `focus-ring` · `focus-ring-destructive` · `foreground` · `hairline` · `halo` · `info` · `info-foreground` · `info-hover` · `info-ink` · `info-muted` · `info-muted-foreground` · `info-muted-hover` · `input` · `muted` · `muted-foreground` · `paper` · `paper-border` · `paper-foreground` · `paper-muted` · `paper-muted-foreground` · `popover` · `popover-foreground` · `prefilled` · `primary` · `primary-foreground` · `primary-hover` · `ring` · `scrim` · `secondary` · `secondary-foreground` · `secondary-hover` · `sidebar` · `sidebar-accent` · `sidebar-accent-foreground` · `sidebar-border` · `sidebar-foreground` · `sidebar-primary` · `sidebar-primary-foreground` · `sidebar-ring` · `success` · `success-foreground` · `success-hover` · `success-ink` · `success-muted` · `success-muted-foreground` · `success-muted-hover` · `surface` · `surface-raised` · `surface-sunken` · `track` · `warning` · `warning-foreground` · `warning-hover` · `warning-ink` · `warning-muted` · `warning-muted-foreground` · `warning-muted-hover`

**Radius** (10) — use as `rounded-*`.

`2xl` · `3xl` · `4xl` · `full` · `lg` · `md` · `none` · `sm` · `xl` · `xs`

**Elevation** (3) — use as `shadow-*`.

`modal` · `overlay` · `raised`

**Type scale** (8) — use as `text-*`.

`body` · `body-compact` · `caption` · `display` · `display-s` · `title` · `title-l` · `title-s`

**Font** (3) — use as `font-*`.

`heading` · `mono` · `sans`

<!-- END:generated-tokens -->

---

## Definition of done

Before reporting UI work as complete:

- [ ] `npm run lint` passes — including the token and contrast checks
- [ ] `npm run build` passes
- [ ] New or changed colors exist in both `:root` and `.dark`
- [ ] New components are in `componentRegistry` *and* `docsNav`, with real usage guidance
- [ ] `npm run sync:tokens` leaves no diff — the token inventory is current
- [ ] `npm run check:contrast` measures the pair — not "looks fine"
- [ ] Touch targets ≥ 40×40px, focus rings intact
- [ ] Interaction states use `accent` / `accent-strong`, not a resting surface token
- [ ] Usable at ~375px wide and at 200% text zoom
- [ ] Any divergence from the Figma master is recorded in `CHANGELOG.md`

---

## Related

- [`README.md`](./README.md) — what the system is and who it is for
- [`RESPONSIVE.md`](./RESPONSIVE.md) — composing responsive product screens
- [`ACCESSIBILITY.md`](./ACCESSIBILITY.md) — the full WCAG 2.1 AA checklist
- [`CHANGELOG.md`](./CHANGELOG.md) — reconciliation history against Rajini 2.0
