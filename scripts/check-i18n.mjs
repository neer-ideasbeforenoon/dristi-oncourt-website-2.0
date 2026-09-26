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

function loadCatalogues(dir) {
  return Object.fromEntries(
    readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => [f.replace(/\.json$/, ""), JSON.parse(readFileSync(join(dir, f), "utf8"))])
  );
}

const catalogues = loadCatalogues(MESSAGES);
const locales = Object.keys(catalogues);
const base = locales[0];
const problems = [];

/*
 * Sub-catalogues: a directory under src/messages/ holding one file per locale, for
 * client components that must not import the full catalogue (it ships to the browser).
 * They obey the same rules as the main catalogue.
 */
const subCatalogues = readdirSync(MESSAGES)
  .filter((entry) => statSync(join(MESSAGES, entry)).isDirectory())
  .map((entry) => ({ prefix: `src/messages/${entry}/`, files: loadCatalogues(join(MESSAGES, entry)) }));

/** Every key a component may legitimately ask for. */
const knownKeys = new Set(Object.keys(catalogues[base]));

function checkCatalogueSet(prefix, set) {
  for (const locale of locales) {
    if (!set[locale]) problems.push(`${prefix}${locale}.json  missing — every catalogue needs every locale`);
  }
  const baseCatalogue = set[base] ?? {};
  const baseKeys = new Set(Object.keys(baseCatalogue));

  /* Rule 1 — key parity across every catalogue. */
  for (const locale of locales.slice(1)) {
    if (!set[locale]) continue;
    const keys = new Set(Object.keys(set[locale]));
    for (const k of baseKeys) {
      if (!keys.has(k)) problems.push(`${prefix}${locale}.json  missing key "${k}" (present in ${base})`);
    }
    for (const k of keys) {
      if (!baseKeys.has(k)) problems.push(`${prefix}${base}.json  missing key "${k}" (present in ${locale})`);
    }

    /* Also catch a key that exists but was never translated away from English. */
    for (const k of baseKeys) {
      const a = baseCatalogue[k];
      const b = set[locale][k];
      if (typeof a === "string" && a === b && /[a-zA-Z]{4}/.test(a)) {
        problems.push(`${prefix}${locale}.json  "${k}" is still the ${base} string — untranslated`);
      }
    }
  }
  return baseKeys;
}

checkCatalogueSet("src/messages/", catalogues);
for (const { prefix, files } of subCatalogues) {
  for (const k of checkCatalogueSet(prefix, files)) knownKeys.add(k);
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
    if (!knownKeys.has(key)) {
      problems.push(`${rel}  uses key "${key}", which is not in any src/messages/ catalogue`);
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

if (problems.length) {
  console.error("i18n check failed:\n");
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    `\nCopy lives in src/messages/, one key per string, every key in every language.\nFor a reviewed exception put ${ALLOW} in a comment.`
  );
  process.exit(1);
}

console.log(
  `i18n check passed (${knownKeys.size} keys x ${locales.length} locales: ${locales.join(", ")}; ${subCatalogues.length} sub-catalogue${subCatalogues.length === 1 ? "" : "s"}).`
);
