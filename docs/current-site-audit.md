# The site being replaced — measured

Everything here was measured against
[oncourts.kerala.gov.in](https://oncourts.kerala.gov.in/) on **2026-09-21**, not
recalled. It is the only product knowledge this repo starts with, which is why it is
written down: so it is not re-discovered, and not re-argued.

Nothing here says what the new portal *should* be. That work has not been done. See the
"intentionally not here" list in [README.md](README.md).

---

## Stack

Next.js **Pages Router**, `nextExport: true`, `autoExport: true`. Served behind a host
that sets `x-powered-by: Next.js` and `cache-control: private`.

## The central problem

The server's entire response is **2,856 bytes**. Its whole body is:

```html
<div class="fixed inset-0 z-50 flex ..."><div class="animate-spin ..."></div>
<div class="mt-4 text-[#0F766E] text-sm font-medium">Loading, please wait...</div></div>
```

There is no content in the HTML. Every cause list, notice, case record and form appears
only after JavaScript boots. Consequences, in order of who they hurt:

1. A reader on a slow or intermittent connection sees a spinner, then nothing.
2. A screen reader gets a loading message where the page should be.
3. Search engines index nothing, so "Kollam cause list" cannot find the cause list.
4. A text browser or a low-end device gets no service at all.

Then, because copy also arrives at runtime from the eGov/DIGIT localization service
(`/localization/messages/v1/_search`), the words are a **second** round trip. The
JavaScript bundle contains keys, not text: `CAUSE_LIST_TITLE`, `ADVOCATE_LITIGANT_LOGIN`,
`CERTIFIED_TRUE_COPIES`, `TAKING_COURT_TO_PEOPLE`.

## Weight

Homepage, gzipped, as served:

| Asset | Size |
|---|---|
| `_app` chunk | 63 KB |
| framework | 45 KB |
| **legacy polyfills** | **40 KB** |
| main | 39 KB |
| CSS | 21 KB |
| two shared chunks | 15 KB |
| the page's own chunk | **0.6 KB** |
| **total** | **~225 KB** |

Almost none of it is the page. The homepage's own code is 665 bytes; the rest is
framework and a polyfill bundle for browsers that are no longer a meaningful share.

## Colour

No design tokens at all. The stylesheet declares only Tailwind's `--tw-*` internals.
Colours are literals, and they disagree with each other:

| Hex | Note |
|---|---|
| `#0f766e` | most frequent; Tailwind `teal-700`; also the spinner, inline in the HTML shell |
| `#007e7e` | the Pucar design system's actual `--primary` |
| `#00a7a7` | a third teal |
| `#00703c` | GOV.UK green |
| `#64748b`, `#334155`, `#cbd5e1`, `#e2e8f0` | raw Tailwind slate |
| `#2563eb`, `#dc2626`, `#16a34a` | raw Tailwind blue / red / green |

Three teals in one stylesheet is the clearest single argument for a token layer.

## Type

Four families: **Roboto**, **Raleway**, **Libre Baskerville**, **Noto Sans**. Loaded
twice over: self-hosted through `next/font` *and* requested again from Google Fonts with
a blocking `<link>` in `<head>`.

## Language

Kerala. No language toggle observed. The localization service implies multilingual
intent, but `<html lang>` is set from a `useEffect`, so the served HTML is always
`lang="en"`.

## What is good and should be kept

The security headers are genuinely well set, and the replacement should match them:

```
content-security-policy: object-src 'self'; media-src 'self'; frame-ancestors 'none';
  base-uri 'self'; frame-src 'self' https://www.youtube.com ...; worker-src 'self' blob:
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-frame-options: DENY
x-content-type-options: nosniff
```

`cache-control: private` on the HTML is the one to revisit: it prevents CDN caching of
pages that are identical for every reader.

---

## Route inventory

35 entries, read from the live build manifest
(`/_next/static/<buildId>/_buildManifest.js`). This is **what exists**, not what should.
No judgement about keep, merge or retire has been made.

### Citizen-facing

| Route | |
|---|---|
| `/` `/landing` `/home` | three entry points |
| `/search` | |
| `/casedetails` `/casedetails/single_case` `/casedetails/multiple_case` | |
| `/live-causelist` `/display-board` | |
| `/certified-true-copies` `/certified-true-copies/apply` `/certified-true-copies/view-status-application` | |
| `/notices` `/notice-board` `/announcements` `/whats-new` | four notice-shaped routes |
| `/rti` | |
| `/help-resources` `/support/faqs` `/video-tutorials` | |
| `/media-gallery` | |
| `/policies-conditions` | |

### Institutional

| Route | |
|---|---|
| `/about` `/about/judges` `/about/people` | |
| `/dashboard` | |

### Infrastructure

`/_app`, `/_error`, `/robots.txt`, and API proxies: `/api/ctc/*`,
`/api/egov-mdms-service/*`, `/api/openapi/*`, `/api/scheduler/*`,
`/egov-mdms-service/v1/_search/*`, `/localization/messages/v1/_search/*`.

### Two things the inventory shows on its face

- **Three homepage-shaped routes** (`/`, `/landing`, `/home`) and **four
  notice-shaped routes** (`/notices`, `/notice-board`, `/announcements`, `/whats-new`).
  Whether those are real distinctions or accumulated duplication is unknown, and is a
  question for the IA work, not an assumption to build on.
- **The API surface is eGov/DIGIT.** Any replacement still has to talk to
  `egov-mdms-service`, the scheduler, and the CTC service. That is an integration
  constraint on the new portal, whatever its front end looks like.
