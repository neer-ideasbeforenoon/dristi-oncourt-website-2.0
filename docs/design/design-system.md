# How this repo uses the design system

This portal composes the [Pucar design system](https://github.com/pucardotorg/dristi-design-system).
It does not maintain a second set of primitives or tokens. The enforceable version of
this is [`../../AGENTS.md`](../../AGENTS.md) §1; this page explains the machinery behind it.

## Three things arrive from the DS, and all three are committed

| What | Lands at | Kept honest by |
|---|---|---|
| Tokens | `src/app/globals.css` | `check:ui-sync` (byte comparison) |
| Primitives | `src/components/ui/*.tsx` | `check:ui-sync` (byte comparison) |
| The rules | `docs/ds/*` | `check:ds-docs` (SHA-256 per file) |

They are **committed files**, not a build-time dependency. The repo builds with no
design-system clone present. `vendor/pucar-design-system` is only the source they are
copied from, and it is gitignored.

## The pin

`ds.lock.json` names one commit. `npm install` runs `scripts/ensure-ds.mjs`, which clones
the DS into `vendor/` and checks out that exact commit.

Every other DS gate is *relative*: `check:ui-sync` compares this repo against whatever
happens to be in `vendor/`, so the wrong version passes green. `check:ds-fresh` is the
only gate that answers "is this the version the repo says we build against". Run it
before the first DS-dependent work in a task.

```bash
npm run check:ds-fresh             # am I on the pin?
npm run check:ds-fresh -- --upstream   # is there a newer DS? informational, never a failure
```

Being deliberately behind is the point of a pin.

## Upgrading

```bash
npm run ds:bump -- --dry-run   # what would change
npm run ds:bump                # moves the pin, re-syncs primitives, tokens and docs/ds/
```

It prints the adopted commit range, which primitives are affected, and whether the token
file or the rule documents moved. Read the DS changelog for that range before committing:
a token whose *meaning* changed shows up in no file diff.

Commit `ds.lock.json` **together with** everything the bump re-synced. The pin without
the files leaves the repo claiming a version it is not on.

## What this repo owns

| | |
|---|---|
| `src/app/portal-tokens.css` | `--portal-*` additions only. See [portal-foundation.md](portal-foundation.md). |
| `src/app/oncourts-typography.css` | Portal type. Georgia, Inter, and the `type-*` roles. See [portal-foundation.md](portal-foundation.md). |
| `src/app/app.css` | three imports, in order. Nothing else. |
| `src/components/portal/` | portal-specific composition built from DS primitives |
| `src/components/chrome/` | header, footer, language switcher |
| `src/messages/` | all user-facing copy |

## When the DS cannot do what you need

Try supported variants and composition first. Then read the primitive's real source in
`src/components/ui/` — not its documentation — because the prop you want often exists.

If it genuinely is not there, it is a **request**:
[`ds-requests.md`](ds-requests.md). It blocks the dependent part of the task and nothing
else; carry on with the rest.

Do not work around it locally. A hand-written primitive, an invented token, or a
per-page override is how the app and the portal stop looking like the same institution.
The design system has an established path for the opposite direction too: something that
grows here and turns out to be product-general gets promoted upstream, the way
SegmentedControl and the canvas tokens were promoted out of Dristi.
