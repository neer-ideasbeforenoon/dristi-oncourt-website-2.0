# Design-system requests

Gaps found while building this portal, queued against
[pucardotorg/dristi-design-system](https://github.com/pucardotorg/dristi-design-system).

**This file is a queue, not a licence.** Nothing here may be worked around locally: an
invented token, a hand-written primitive or a per-page override is a defect under
[`../../AGENTS.md`](../../AGENTS.md) §1, whatever the deadline. A request that blocks a
feature blocks that feature, and nothing else in the task.

Each entry says what is missing, why the portal hit it, and what would close it.

| # | Request | Raised by | Status |
|---|---|---|---|
| 1 | `--font-sans` has no real 600 weight | this repo's type scale | open |

---

## 1 — `--font-sans` has no real 600 weight

**What is missing.** The DS stack is
`"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif`. Helvetica Neue ships
400/500/700 on macOS and has no 600 face, so CSS weight matching sends every
`font-semibold` to **Bold**. On Windows the whole stack falls to Arial, which has only
400/700, so 500 renders as 400 as well. The Figma master is a real 600.

**Why this portal hit it.** Every DS title role is gate-enforced `font-semibold`. On a
prose-heavy public site that is most of the page, so the substitution is more visible
here than in a dense app screen.

**What would close it.** Either a stack with a genuine 600 on each platform:

```
system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif
```

which stays zero-download and keeps a per-platform Indic fallback. Or self-host Inter
variable (~100 KB, cached) for exact Figma parity.

**Why it is not fixed locally.** It modifies an existing DS token. Overriding
`--font-sans` in `portal-tokens.css` would fork the typeface between this portal and the
Dristi app, which is the failure the pin exists to prevent.

**Note on the Malayalam half.** The related Malayalam coverage question is *not* part of
this request. DS `ACCESSIBILITY.md` §13 delegates non-Latin scripts to the consuming app,
so it ships here already. See [decisions.md](../decisions.md) D7.
