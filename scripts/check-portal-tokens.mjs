#!/usr/bin/env node
/**
 * check:portal-tokens — the local token layer may ADD, never REDEFINE.
 *
 * Why this exists as its own gate: check-tokens.mjs cannot do this job and cannot be
 * configured to. Its four rules are all utility-class shaped (`bg-[#fff]`,
 * `text-neutral-5`, `p-[13px]`), so they match nothing inside a CSS declaration block.
 * A line reading `:root { --primary: #00703c; }` passes check:tokens completely clean
 * while silently repainting every button in the portal. That is the exact drift this
 * repo exists to prevent, so it gets a gate of its own.
 *
 * The rules, in order of how badly they bite:
 *   1. No name declared here may collide with a design-system name.
 *   2. Every name declared here must be in the --portal-* namespace.
 *   3. Nothing but custom-property declarations. No @theme, @apply, @import, no
 *      ordinary CSS properties. (A second stylesheet cannot register Tailwind theme
 *      tokens anyway — only the entry holding `@import "tailwindcss"` emits utilities —
 *      so an @theme block here would be silently dead, which is worse than illegal.)
 *
 * Escape hatch, matching the DS's own convention (`ds-tokens-ignore`): put
 * `portal-tokens-allow` in a comment on the line above a declaration to permit a
 * reviewed exception. Use it for something like extending the font stack for Malayalam,
 * which DS ACCESSIBILITY.md section 13 delegates to the consuming app. Do not use it to
 * restyle the brand.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DS_TOKENS = join(ROOT, "src/app/globals.css");
const PORTAL_TOKENS = join(ROOT, "src/app/portal-tokens.css");
const ALLOW = "portal-tokens-allow";

/** Namespace every locally-authored token must sit in. */
const PORTAL_NAME = /^--portal-[a-z0-9-]+$/;

if (!existsSync(PORTAL_TOKENS)) {
  console.log("No src/app/portal-tokens.css — portal token check skipped.");
  process.exit(0);
}
if (!existsSync(DS_TOKENS)) {
  console.error(
    "src/app/globals.css is missing, so design-system token names cannot be read.\n" +
      "Run:  npm install  then  npm run sync:ui -- --tokens-only"
  );
  process.exit(1);
}

/** Every `--name:` declared anywhere in a stylesheet, comments stripped. */
function declaredNames(css) {
  const names = new Set();
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, name] of withoutComments.matchAll(/(--[\w-]+)\s*:/g)) names.add(name);
  return names;
}

const dsNames = declaredNames(readFileSync(DS_TOKENS, "utf8"));
const source = readFileSync(PORTAL_TOKENS, "utf8");
const lines = source.split("\n");
const problems = [];

/* Rule 3a — no at-rules. */
for (const [index, line] of lines.entries()) {
  const at = line.match(/^\s*(@(?:theme|apply|import|tailwind|plugin|config|utility|variant)\b)/);
  if (at) {
    problems.push({
      line: index + 1,
      rule: "at-rules are not allowed in portal-tokens.css",
      match: at[1],
      note:
        at[1] === "@theme"
          ? "a second stylesheet cannot register theme tokens — it would emit nothing"
          : "this file is plain custom properties; put anything else in a component",
    });
  }
}

/* Rules 1, 2 and 3b — declaration by declaration. */
const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
const lineOf = (index) => withoutComments.slice(0, index).split("\n").length;

for (const match of withoutComments.matchAll(/([a-zA-Z-][\w-]*)\s*:\s*[^;{}]+;/g)) {
  const name = match[1];
  const line = lineOf(match.index);
  /*
   * Look back a few lines, not one. A scoped exception is written as a comment, then a
   * selector, then the declaration — so the marker is three lines above the thing it
   * permits, not one.
   */
  const allowed = [1, 2, 3, 4].some((back) => lines[line - back]?.includes(ALLOW));

  if (!name.startsWith("--")) {
    problems.push({
      line,
      rule: "only custom-property declarations belong in portal-tokens.css",
      match: `${name}:`,
      note: "ordinary CSS properties belong in a component, not the token layer",
    });
    continue;
  }
  if (allowed) continue;

  if (dsNames.has(name)) {
    problems.push({
      line,
      rule: "redefines a design-system token",
      match: name,
      note:
        `${name} is owned by the DS (src/app/globals.css). Redefining it here forks the ` +
        "brand between this portal and the Dristi app. Raise it in docs/design/ds-requests.md.",
    });
    continue;
  }
  if (!PORTAL_NAME.test(name)) {
    problems.push({
      line,
      rule: "outside the --portal-* namespace",
      match: name,
      note: "local tokens are named --portal-<thing> so a later promotion to the DS is greppable",
    });
  }
}

if (problems.length) {
  console.error("Portal token check failed:\n");
  for (const p of problems) {
    console.error(`src/app/portal-tokens.css:${p.line}  ${p.rule} — ${p.match}`);
    console.error(`    ${p.note}`);
  }
  console.error(
    `\nThe local layer adds; it never redefines. For a reviewed exception put ` +
      `${ALLOW} in a comment above the line.`
  );
  process.exit(1);
}

console.log(
  `Portal token check passed (${dsNames.size} DS names protected).`
);
