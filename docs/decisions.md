# Decisions

Settled choices and the reasoning behind them, so they are not re-argued every few
weeks. A decision that changes gets rewritten here with the date, not deleted.

---

## D1 — Brand: inherit `--primary` from the pinned DS  ·  settled 2026-09-21

**The portal defines no teal.** It consumes `--primary` from the design system, exactly
as the Dristi app does.

Resolved values, for reference only, not for pasting into code:

| | token | value |
|---|---|---|
| light | `--primary` → `--brand-solid` | `#007e7e` |
| dark | `--primary` → `--brand-solid` → `--brand-10` | `#0eb39e` |

Recording the *source* rather than the hex is deliberate. The DS README's own example of
a banned hardcode is `bg-[#007e7e]`, and a decision doc that leads with a hex invites
exactly that.

**Retired, do not carry over:** `#0f766e`, `#00a7a7` and `#00703c`, all of which appear
in the current site's stylesheet alongside each other.

## D2 — Deploy target: not yet decided  ·  open

The current portal runs on Kerala government infrastructure. The sibling marketing site
runs on Netlify. Which applies here changes caching, the CDN story and who can ship.

Until this is answered the repo assumes only a Node host capable of server rendering,
which is the one thing every candidate must do. **No static export**, see D3.

Answer this before the first production deploy, not before the first page.

## D3 — Rendering: server-first, no static export  ·  settled 2026-09-21

Server components by default; content never waits on a client fetch.

The site being replaced is a Next.js Pages Router app with `nextExport: true`. Its
server response is 2,856 bytes, body content: a spinner and "Loading, please wait...".
Every string arrives afterwards from the eGov/DIGIT localization service. A public court
portal that renders nothing without JavaScript fails its readers and is hard to reconcile
with GIGW.

Enforced by `scripts/check-ssr.mjs`.

## D4 — Locale in the URL, `lang` set on the server  ·  settled 2026-09-21

`/en/...` and `/ml/...`, with `src/middleware.ts` redirecting anything unprefixed.
`<html lang>` comes from the route in the layout.

URL-based because a shared link and a crawler should both carry the language. Server-set
because the current site assigns `lang` in a `useEffect`, so every page it serves is
`lang="en"` regardless of what the reader picked.

## D5 — One repo, separate from `pucar-dristi`  ·  settled 2026-09-21

Different audience (public, unauthenticated), different compliance surface (GIGW),
different release cadence, and it should not inherit the app's `design`-branch ritual.

The cost is a duplicated copy of the DS wiring scripts. Accepted. They were ported, not
copied: the monorepo path arithmetic in `resolve-ds.mjs` resolves **outside the repo** in
a flat layout, which would have silently disabled the pin and cloned the DS into the home
directory. See the comment at the top of `scripts/resolve-ds.mjs`.

## D6 — No `.agents/` tree, no roles, no rails generator  ·  settled 2026-09-21

`AGENTS.md` plus a one-line `CLAUDE.md` pointer. One skill.

`pucar-dristi` generates per-tool adapters from `.agents/rails.json` because it has a
coordinator, parallel builders and review handoffs. This repo has one builder. That
machinery would be config to maintain for a workflow that does not exist.

**Revisit when** a second person or a parallel agent starts building screens. The port is
about half a day: copy `scripts/lib/agent-rails.mjs`, `sync-rails.mjs`, `check-rails.mjs`
and the `agent-rails.yml` workflow.

## D7 — The DS font fix (T4) splits in two  ·  settled 2026-09-21

`docs/ds/ds-diagnosis`-era finding T4 has two halves, and they belong in different repos.

- **The missing 600 weight** modifies an existing DS token, so it is an upstream change.
  Queued in [design/ds-requests.md](design/ds-requests.md). This repo does not work
  around it.
- **Malayalam coverage** is delegated to the consuming app by DS `ACCESSIBILITY.md` §13,
  so it ships here now: `next/font` in the root layout, plus the one sanctioned
  `--font-sans` exception in `portal-tokens.css`, scoped to `[lang^="ml"]`.

Splitting them is what unblocked Malayalam without waiting on a DS release.

The "do not change the face locally" half is superseded by D9. Malayalam coverage still
ships in this repo, now inside the portal type stacks.

## D9 — Portal type is Georgia and Inter  ·  settled 2026-09-26

The public site uses its own type, in `src/app/oncourts-typography.css`. Headings are
Georgia at weight 500. Interface text is Inter. Twelve `type-*` roles replace the DS
type utilities in product screens. The fluid roles interpolate from 375px to 1280px.

This does not move the pin. `globals.css` and the primitives stay byte-identical, so
colour and components still match the Dristi app. The app does not read this file.

Homepage v3 added a thirteenth role, `type-figure`, for dashboard numbers (Inter Bold,
fluid 32–38px, tabular figures). No handoff role covered them, and Georgia's old-style
numerals read poorly as data. Added 2026-09-26.

Malayalam is a fallback inside both stacks. Noto Sans Malayalam covers glyphs Georgia
and Inter do not have, at weights 400, 500, 700, and 800. Heading line height is 1.35
when `lang` starts with `ml`, because the handoff's 1.04 to 1.14 clips Indic type.

## D8 — `docs/ds/` is a verbatim mirror, never a summary  ·  settled 2026-09-21

`vendor/pucar-design-system` is gitignored, so on a fresh clone the rules an agent is
told to obey are not on disk, and an agent that cannot read the rules invents.

Files are byte copies with SHA-256s in `manifest.json`. `laws.page.tsx` and
`principles.page.tsx` keep their `.tsx` extension because that is what they are upstream.
**There is no `tokens.md`:** the DS README says the tokens are described in exactly two
places "deliberately, so a third copy cannot drift", and `agents.md` already carries the
inventory.

`check:ds-docs` has three outcomes, never two: PASS, FAIL, and UNVERIFIED when no clone
is present. UNVERIFIED is never reported as green; `--strict` (used in CI) makes it fail.
