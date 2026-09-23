# Docs map

Orientation for this repo. These docs describe the portal and how it is built. The
design system's own rules are mirrored verbatim in [`ds/`](ds/README.md) and are not
restated anywhere else.

## Sections

| Section | What it holds | Start here |
|---|---|---|
| **Decisions** | Settled choices, with the reasoning, so they are not re-litigated | [decisions.md](decisions.md) |
| **Information architecture** | The shared layout, homepage order, and destinations. Same for every state | [ia.md](ia.md) |
| **Current site** | Measured facts about oncourts.kerala.gov.in, plus its route inventory | [current-site-audit.md](current-site-audit.md) |
| **Design system** | How this repo consumes the DS, and what the local layer owns | [design/design-system.md](design/design-system.md) |
| **Portal foundation** | What this repo adds on top of the DS, and why | [design/portal-foundation.md](design/portal-foundation.md) |
| **DS requests** | Gaps found while building, queued upstream. A queue, not a licence | [design/ds-requests.md](design/ds-requests.md) |
| **Compliance** | GIGW 3.0 checkpoint status | [compliance/gigw.md](compliance/gigw.md) |
| **DS rules (mirrored)** | Byte-verbatim copy of the pinned DS's own documents | [ds/README.md](ds/README.md) |

## Intentionally not here

These are absent **on purpose**. Do not fill them in with plausible guesses; an invented
document that reads as settled is worse than a missing one.

- **Content model and editorial ownership.** Unknown: who writes a notice, who approves
  it, how often cause lists change, where translated copy comes from. Audiences and the
  information architecture are settled in [ia.md](ia.md); this is what that document
  deliberately leaves open.
- **The design-system code.** Tokens and components live in
  [pucardotorg/dristi-design-system](https://github.com/pucardotorg/dristi-design-system).
  This repo consumes them. A token described here would be a third copy that drifts.

When one of these becomes knowable, write it down and delete its line from this list.
