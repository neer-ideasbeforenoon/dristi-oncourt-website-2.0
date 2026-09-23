#!/usr/bin/env node
/**
 * check:i18n — the two languages stay in step, and copy stays out of components.
 *
 * Source-only: no build, no network, runs in `npm run lint`.
 *
 * Three rules:
 *   1. en.json and ml.json declare exactly the same keys. A key that exists in one
 *      language is a page that is half-translated, and half-translated is how a portal
 *      silently serves English to a Malayalam reader.
 *   2. Every key a component asks for exists. A typo'd key renders as `undefined`, which
 *      no type checker catches because the catalogue is JSON.
 *   3. No hardcoded user-facing sentence in a component.
 *
 * Escape hatch for rule 3: `i18n-allow` in a comment on the line or the line above.
 * Proper nouns, code and single words are already ignored.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const MESSAGES = join(ROOT, "src/messages");
const UI_PRIMITIVES = join(SRC, "components", "ui") + sep;
const ALLOW = "i18n-allow";

const catalogues = Object.fromEntries(
  readdirSync(MESSAGES)
    .filter((f) => f.endsWith(".json"))
    .map((f) => [f.replace(/\.json$/, ""), JSON.parse(readFileSync(join(MESSAGES, f), "utf8"))])
);

const locales = Object.keys(catalogues);
const problems = [];

/* Rule 1 — key parity across every catalogue. */
const base = locales[0];
const baseKeys = new Set(Object.keys(catalogues[base]));
for (const locale of locales.slice(1)) {
  const keys = new Set(Object.keys(catalogues[locale]));
  for (const k of baseKeys) {
    if (!keys.has(k)) problems.push(`src/messages/${locale}.json  missing key "${k}" (present in ${base})`);
  }
  for (const k of keys) {
    if (!baseKeys.has(k)) problems.push(`src/messages/${base}.json  missing key "${k}" (present in ${locale})`);
  }
}

/* Also catch a key that exists but was never translated away from English. */
for (const locale of locales.slice(1)) {
  for (const k of baseKeys) {
    const a = catalogues[base][k];
    const b = catalogues[locale][k];
    if (typeof a === "string" && a === b && /[a-zA-Z]{4}/.test(a)) {
      problems.push(`src/messages/${locale}.json  "${k}" is still the ${base} string — untranslated`);
    }
  }
}

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return entry.endsWith(".tsx") && !full.startsWith(UI_PRIMITIVES) ? [full] : [];
  });
}

/* Rules 2 and 3. */
const JSX_TEXT = />([^<>{}\n]{12,})</g;
const USED_KEY = /\bt\[\s*["']([^"']+)["']\s*\]/g;
const SENTENCE = /[A-Za-z][a-z]+(?:\s+[A-Za-z][a-z]+){2,}/;

for (const file of sourceFiles(SRC)) {
  const rel = relative(ROOT, file);
  const source = readFileSync(file, "utf8");
  const lines = source.split("\n");

  for (const [, key] of source.matchAll(USED_KEY)) {
    if (!baseKeys.has(key)) {
      problems.push(`${rel}  uses key "${key}", which is not in src/messages/${base}.json`);
    }
  }

  lines.forEach((line, index) => {
    if (line.includes(ALLOW) || lines[index - 1]?.includes(ALLOW)) return;
    for (const match of line.matchAll(JSX_TEXT)) {
      const text = match[1].trim();
      if (!SENTENCE.test(text)) continue;
      problems.push(
        `${rel}:${index + 1}  hardcoded copy — "${text.slice(0, 50)}" belongs in src/messages/`
      );
    }
  });
}

/* The error boundary is a client component. It must not import the catalogues,
   or both languages ship in every page's JavaScript. It reads this slim file
   instead, and these values have to stay identical to en.json. */
const recoveryPath = join(ROOT, "src/lib/i18n/recovery.json");
const recovery = JSON.parse(readFileSync(recoveryPath, "utf8"));
for (const [key, value] of Object.entries(recovery)) {
  if (catalogues[base][key] !== value) {
    problems.push(
      `src/lib/i18n/recovery.json  "${key}" does not match src/messages/${base}.json`
    );
  }
}

if (problems.length) {
  console.error("i18n check failed:\n");
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    `\nCopy lives in src/messages/, one key per string, every key in every language.\nFor a reviewed exception put ${ALLOW} in a comment.`
  );
  process.exit(1);
}

console.log(
  `i18n check passed (${baseKeys.size} keys x ${locales.length} locales: ${locales.join(", ")}).`
);
