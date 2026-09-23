# Layout and information architecture

Locked 2026-09-23, from the stakeholder brief on Kerala, Punjab, and Gujarat.

This is the shared structure of every state site. Punjab and Gujarat do not get a
different page order, a different navigation, or a different homepage. They get
different words, a different programme name, a different language pair, a different
helpline, and a different sign-in address, written into the same slots.

The look stays the one this portal already has: the pinned design system, no new
brand colour, no decorative animation. Animation in the manner of pucar.org is out
of scope until the services below are easy to find.

---

## Who it is for

The site is for the general public. They come to use a service.

| Someone | What they must be able to do easily |
|---|---|
| A member of the public | See today's cause list, search a case, look at the dashboard |
| An advocate | Log in, and from there open their cases |
| A litigant | Check case details, see the cause list, call the helpline |
| A researcher or anyone in civil society | View the data the platform publishes |

People who want to understand the programme are the ones the site is sent to. They
can read the about page. That account does not stand between a visitor and the
service they came for.

A first visit needs one sentence on what the programme is: ON Courts, or SARAS 2.0
in Gujarat. The longer account stays on About.

---

## The page chrome

Every page, in this order. Same on a phone and on a desktop; on a narrow screen the
rows wrap, they do not drop the cause list, case search, or log in into a menu that
is the only way to reach them.

1. **Skip link**, first in the tab order, pointing at `<main id="main">`.
2. **Utility bar.** Language switcher. Helpline, when the state pack has a number.
   Text size and contrast belong in this bar; they are not built yet (see
   [compliance/gigw.md](compliance/gigw.md)).
3. **Identity.** Programme name, then one sentence on what it is. Both come from
   the state pack. The name links home.
4. **Service navigation**, in this order:
   1. Cause list
   2. Case search
   3. Log in
   4. Dashboard
   5. Notices
   6. Certified copies
   7. Help

   The current item is a soft filled background, never a coloured stripe on one
   edge. Log in is a navigation item on every page. On the homepage it is also the
   single teal action, placed under the cause list (one primary per view).
5. **`<main id="main">`.** One per page. The page's own content.
6. **Footer.** About, RTI, Policies. Helpline again, when the state has a number.
   Last-updated stamp, once a page has a real date. No invented date.

The state emblem sits in the identity row when the artwork exists. The slot is part
of the chrome; the asset is not.

---

## The homepage

People are here to use a service. The first screen is that service. Sections that
already exist stay on the page, below the services, so nothing is removed.

**First screen, in this order:**

1. Today's cause list. This is the page heading and the primary region. The day's
   cases are listed here, not behind a link the visitor has to discover. The full
   cause list page is the same service, with the live list and the display board.
2. Log in. The one teal action. Advocates use it to open their cases.
3. Case search.
4. The one-sentence explanation sits in the identity row, above this, so it is on
   the first screen without becoming the page.
5. Helpline, in the utility bar, and repeated beside the services when the state
   pack has a number. Hidden when it does not. No made-up number.

**Below the first screen, kept, in this order:**

6. Dashboard, for researchers and civil society.
7. Performance highlights. The figures are state content. The region is the layout.
8. Video.
9. About, in brief, with a link to the full about page. The long version is not
   the first thing on the page.
10. Questions, with a link to Help.

---

## Destinations

One navigation item per service. Steps and views are part of that service, not
extra items in the header. The order below is the header order. About, RTI, and
Policies are in the footer.

| Header / footer | URL | What the page is |
|---|---|---|
| Cause list | `/cause-list` | Today's list, the default view |
| | `/cause-list/live` | Live cause list. A view of the same service |
| | `/cause-list/display` | Display board. A view of the same service |
| Case search | `/search` | Find a case. The case record is the result of this search, not its own navigation item |
| Log in | state pack `loginUrl`, or `/login` until that address exists | Leaves for the state's court application. This site does not host the advocate's cases |
| Dashboard | `/dashboard` | Public figures from the platform |
| Notices | `/notices` | Court notices and announcements |
| Certified copies | `/certified-copies` | Apply, then track. Two steps, one service |
| | `/certified-copies/apply` | The application step |
| | `/certified-copies/status` | The tracking step |
| Help | `/help` | Help resources, questions, video tutorials |
| About | `/about` | The long account. Judges and people are part of it |
| | `/about/judges` | Judges |
| | `/about/people` | People of the court |
| RTI | `/rti` | Right to Information |
| Policies | `/policies` | The GIGW policy set, linked from the footer |

`/`, `/landing`, and `/home` on the current site are one homepage: `/`.

The four notice-shaped routes on the current site (`/notices`, `/notice-board`,
`/announcements`, `/whats-new`) are one destination, `/notices`. If an editor later
shows that those four are genuinely different publications, they become sections of
that page. They do not become four header items.

The header order is the array in [`src/lib/navigation.ts`](../src/lib/navigation.ts).
Changing the order is a change to this document.

---

## What a state pack fills

The layout reads these and nothing else from the state. Kerala is the only pack
in the repo today (`src/lib/site.ts`).

| Slot | Kerala today | Changes per state |
|---|---|---|
| Programme name | ON Courts | Gujarat: SARAS 2.0. Punjab: not yet named |
| One sentence | In `site.tagline` | Yes |
| Languages | English, Malayalam | Yes. The switcher lists whatever the pack lists |
| Helpline | Empty | Required for a Punjab or Gujarat launch |
| Sign-in address | Empty, so Log in stays on `/login` | Yes, an address in the court application |
| Courts in the cause list | Not connected | Yes |
| About, notices, figures, video | Not written yet | Yes |
| Emblem | Slot reserved | Yes |

Copy stays in `src/messages/`, one key per string, every language the pack serves.
A component does not contain a state name, a programme name, or a phone number.

---

## Still open

These are not decided here. Do not fill them in with a plausible guess.

- Punjab's programme name.
- The language pair for Punjab, and for Gujarat.
- Whether each state is its own hostname. The layout does not care; the pack does.
- Which court is the default when a state has more than one. The cause list region
  is "today". A court chooser appears when the pack lists more than one court.
- The helpline numbers, the sign-in addresses, and the emblem artwork.
- Whether notice-board, announcements, and what's new are editorially distinct
  sections. The header already treats them as one destination.
- Who writes a notice, who approves it, and where the translated copy comes from.
  That is the content model, and it is still unknown.
- Text size and contrast controls. The utility bar is where they go.
