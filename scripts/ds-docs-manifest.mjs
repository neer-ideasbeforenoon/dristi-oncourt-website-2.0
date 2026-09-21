/**
 * The one list of which design-system rule documents this repo mirrors.
 *
 * Shared by sync-ds-docs.mjs (which writes them) and check-ds-docs.mjs (which proves
 * they are still byte-identical), so the two can never disagree about the set.
 *
 * Every entry is a straight file copy. Nothing in docs/ds/ is ever the output of a
 * transform: the laws and principles live in the DS as React pages, and any attempt to
 * render them down to prose would produce something that looks authoritative, drifts
 * silently, and passes a freshness check while saying the wrong thing. So the .tsx is
 * copied as .tsx. An agent reads the JSX props perfectly well; a human can too.
 */
export const DS_DOCS = [
  { from: "AGENTS.md", to: "agents.md" },
  { from: "ACCESSIBILITY.md", to: "accessibility.md" },
  { from: "RESPONSIVE.md", to: "responsive.md" },
  { from: "src/app/(docs)/foundations/laws/page.tsx", to: "laws.page.tsx" },
  { from: "src/app/(docs)/principles/page.tsx", to: "principles.page.tsx" },
];

/**
 * Deliberately NOT mirrored: a tokens.md.
 *
 * The DS README says the token families are described in exactly two places —
 * its AGENTS.md and its Foundations pages — "deliberately, so a third copy cannot
 * drift." agents.md above already carries the generated token inventory, so a separate
 * tokens.md would be that banned third copy, and a lossy one.
 */
