# Dristi ON Court — website 2.0

The public website for **24x7 ON Court**, the courts running on
[DRISTI](https://pucar.org/dristi/), an open-source court platform built by
[PUCAR](https://pucar.org/). This is the part of the system a member of the public
actually touches: the place you go to find out when your case is listed, what happened
at the last hearing, and how to get a certified copy of an order, without travelling to
the court to ask.

It is a rebuild of [oncourts.kerala.gov.in](https://oncourts.kerala.gov.in/).

## The court behind it

The first 24x7 ON Court opened in **Kollam, Kerala, on 20 November 2024**, under the
High Court of Kerala. It hears cheque dishonour cases under section 138 of the
Negotiable Instruments Act, filed from more than twenty police stations across the
district. Thrissur is next in Kerala, with courts in Punjab & Haryana and Gujarat named
after that.

A snapshot of the court's own dashboard, 21 September 2026:

| | |
|---|---|
| Cases filed | 2,316 |
| Median time to disposal | 173 days |
| Hearings held as scheduled | 98% |
| Advocates on the platform | 971 |
| Litigants | 2,087 |

The comparison that matters: a case of this kind conventionally takes around two years.

## Who the website is for, and what they come to do

This site is **not** the court software. Judges, court staff and advocates do their work
inside the authenticated DRISTI application. This is the public face in front of it, and
almost everyone arriving has one specific question.

| Someone arrives to | Service |
|---|---|
| find out when their case is listed | cause list, live cause list, display board |
| check what happened, or what happens next | case search, case status |
| get a certified copy of an order | certified true copies: apply, then track |
| read a court notice or announcement | notices, notice board, announcements |
| work out what to bring, or what a term means | help resources, FAQs, video tutorials |
| file an RTI request, or look up the court | RTI, about the court, judges |
| report on the court's performance | public dashboard |

Most of these readers are not lawyers. Many are on a mid-range Android phone, on mobile
data, in Malayalam. That is the design constraint the whole repo is built around.

## Why it is being rebuilt

Not a redesign. The current site has a structural problem, measured on 21 September 2026
and recorded in [`docs/current-site-audit.md`](docs/current-site-audit.md):

**Its server sends no content.** The whole response is 2,856 bytes, and the entire body
is a spinner and the words "Loading, please wait…". Every cause list, notice and case
record appears only after roughly 225 KB of JavaScript has downloaded and run, and then
only after the words themselves are fetched over the network a second time. So:

- a reader on a weak connection gets a spinner, then nothing
- a screen reader gets a loading message where the page should be
- searching for a cause list cannot find the cause list, because nothing is indexed
- `<html lang>` is set after the page loads, so every page is announced as English
  whatever the reader chose

Alongside that, the styling has drifted from the design system the courts app uses:
**three different teals** in one stylesheet, four font families loaded twice over, and no
design tokens at all.

This rebuild fixes the first problem by rendering on the server, and the second by
consuming the Pucar design system from a pinned commit instead of restyling by hand.

## How it is built

- **Next.js App Router, server-rendered.** Content is in the HTML of the first response.
  Static export is banned in `next.config.ts`, and `check:ssr` reads the built HTML and
  fails if a page's `<main>` is empty.
- **The [Pucar design system](https://github.com/pucardotorg/dristi-design-system),
  pinned.** The same system the DRISTI app is built from, so the public site and the
  court software look like one institution. Tokens and components arrive as committed
  files from one commit in `ds.lock.json`; gates fail if either is edited locally or
  falls behind the pin.
- **Bilingual from the first page.** English and Malayalam, both in the URL
  (`/en/…`, `/ml/…`), with `<html lang>` set on the server. Copy lives in
  `src/messages/`, and a key missing from either language fails the build.
- **GIGW 3.0** is mandatory for Indian government websites. Status is tracked from the
  start in [`docs/compliance/gigw.md`](docs/compliance/gigw.md), not retrofitted.

## Run it

```bash
npm install     # also fetches the pinned design system into vendor/ (gitignored)
npm run dev     # http://localhost:3000 → redirects to /en
```

| Command | When | Cost |
|---|---|---|
| `npm run lint` | every change | seconds, no build |
| `npm run check:ship` | before pushing | a full build |
| `npm run verify` | CI, and when in doubt | everything |
| `npm run sync:ui -- <name>` | pulling a component from the design system | |
| `npm run ds:bump` | adopting a newer design system | its own commit |

`lint` holds only source-only checks on purpose. If a one-line copy edit could fail a
build-dependent gate, people stop running gates.

## Where things are

| Path | |
|---|---|
| [`AGENTS.md`](AGENTS.md) | **the rulebook** — read before writing anything |
| [`docs/`](docs/README.md) | the docs map |
| [`docs/decisions.md`](docs/decisions.md) | what was settled, and why |
| [`docs/ds/`](docs/ds/README.md) | verbatim copy of the pinned design-system rules |
| `src/app/globals.css` | design-system tokens, synced, never hand-edited |
| `src/app/portal-tokens.css` | this repo's own tokens, `--portal-*` only |
| `src/components/ui/` | design-system components, synced, never hand-edited |
| `src/components/portal/`, `chrome/` | this repo's own composition |
| `src/messages/` | every user-facing string, in both languages |

## Status

**Foundation, with the shared layout locked.** The gates, the design-system wiring, the
bilingual routing and the compliance tracking are in place. The page chrome, the
homepage order, and the destinations are settled in [`docs/ia.md`](docs/ia.md) and are
the same for every state. The services themselves (a live cause list, search results,
dashboard figures) are not connected yet.

The content model is still unwritten on purpose: who writes a notice, who approves it,
where translated copy comes from. The inventory in
[`docs/current-site-audit.md`](docs/current-site-audit.md) records what the old site
has. [`docs/ia.md`](docs/ia.md) records what this one is.
