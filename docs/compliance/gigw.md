# GIGW 3.0 status

[GIGW](https://guidelines.india.gov.in/) — Guidelines for Indian Government Websites and
apps, maintained by NIC under MeitY — is **mandatory** for Indian government websites.
This is a public court portal for Kerala, so it applies here in full.

Nothing in this repo is compliant yet. The foundation is built; the pages are not. This
file exists so that compliance is tracked from the first page rather than retrofitted
before an audit.

## Structure of the standard

| Pillar | Checkpoints | Confidence |
|---|---|---|
| Accessibility (§5.2.1 – §5.2.50) | **50** | **verified** against guidelines.india.gov.in, 2026-09-21 |
| Quality | 25 | from the scaffold review pass; re-confirm |
| Lifecycle management | 10 | from the scaffold review pass; re-confirm |
| Cybersecurity (CERT-In) | 3 | from the scaffold review pass; re-confirm |
| **Total** | **88** | |

Each accessibility checkpoint cites a WCAG 2.1 success criterion directly (5.2.1 →
1.1.1, 5.2.14 → 1.4.3, 5.2.49 → 4.1.2, and so on).

> **Before any audit submission**, re-derive every count and clause from the **GIGW
> Manual 3.0 PDF** and *Annexure II: Matrix to check conformity*, not from this file.
> Only the accessibility figures above were confirmed first-hand.

## What the design system already gives us

[`../ds/accessibility.md`](../ds/accessibility.md) is the pinned copy of the DS's own
standard. It targets WCAG 2.1 AA, WAI-ARIA 1.2, keyboard operability, visible focus,
40x40px touch targets, 200% zoom, session-timeout warnings, visible labels, and Indic
script support.

That maps onto most of the 50 accessibility checkpoints **at the component level**. It
does not discharge them: a page can be built entirely from conformant components and
still fail on reading order, page title, language of parts, or focus order. Component
conformance is a floor.

## What this repo enforces mechanically

| Gate | Checkpoint family it touches |
|---|---|
| `check:meta` | page title, description, canonical per page |
| `check:meta` | `<html lang>` set server-side, per locale |
| `check:i18n` | multilingual parity between English and Malayalam |
| `check:ssr` | content present without JavaScript; one `<main>` landmark per page |
| `check:typography` | named type roles, Malayalam weight 600 |
| `check:portal-tokens` / `check:tokens` | contrast-tested DS tokens, no ad-hoc colour |

## Not started

Everything below needs a page, a decision, or a person, and none exists yet.

### Page chrome
- [ ] Accessibility statement page
- [ ] Screen-reader access page (the assistive-technology listing GIGW expects)
- [ ] Text-size controls
- [ ] Contrast / high-contrast control
- [x] Language switcher in the page chrome. It sits in the utility bar and keeps the
      current path. It lists English and Malayalam, the only pack so far. Punjab and
      Gujarat each bring their own pair when that pack exists.
- [ ] "Last updated" stamp on every content page. The footer slot is reserved in
      [../ia.md](../ia.md). No date is shown until a page has a real one.
- [ ] State emblem / judiciary lockup, used per the emblem rules. The identity row
      has the slot; the artwork does not exist yet.
- [x] Skip-to-content link, first in the tab order, target `#main`

### Mandated policy pages (§5.4.3)
Seven, per the review pass against the lifecycle-management page. Re-confirm the exact
list from the Manual before publishing.
- [ ] Copyright Policy
- [ ] Content Management & Approval Policy (CMAP)
- [ ] Content Archival Policy (CAP)
- [ ] Content Review Policy (CRP)
- [ ] Hyperlinking Policy
- [ ] Terms & Conditions
- [ ] Website Monitoring Plan

The current site has a single `/policies-conditions` route. Whether that covers all
seven is unknown.

### Governance (§5.4.1)
- [ ] **Web Information Manager appointed and named on the site.** This is a person, not
      a page. It cannot be closed from this repo.
- [ ] Contact / feedback mechanism
- [ ] STQC Website Quality Certification path agreed

### Carry over from the current site
The site being replaced sets genuinely good security headers. Match them, and revisit
only `cache-control: private`, which blocks CDN caching of pages identical for every
reader. Values are in [`../current-site-audit.md`](../current-site-audit.md).

## How to work on this

When a page lands, tick what it closes and link the page. Do not tick a checkpoint
because a component is conformant; tick it when the rendered page is, tested. An
automated gate is evidence, not proof: GIGW expects manual evaluation and user feedback
alongside tooling.
