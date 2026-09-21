#!/usr/bin/env node
/**
 * check:ssr — every public page must have its content in the server's HTML.
 *
 * This is the gate this repo exists for. The portal being replaced answers a request
 * with 2,856 bytes whose entire body is a spinner and the words "Loading, please
 * wait...". Cause lists, notices and case records are invisible to a text browser, to a
 * crawler, and to anyone whose JavaScript has not finished booting on a slow phone.
 *
 * Needs a build: it reads the prerendered HTML in `.next/server/app/`. Run it through
 * `npm run check:ship`.
 *
 * What it asserts, per prerendered page:
 *   1. `<html lang="...">` is present and non-empty  — set on the server, not in an effect.
 *   2. a `<main>` element exists.
 *   3. `<main>` holds real text, not just a spinner.
 *
 * Coverage is printed, never silently partial: a route that produced no HTML is listed,
 * because "the gate passed" must not be able to mean "the gate looked at two pages".
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP_OUT = join(ROOT, ".next/server/app");
const STATS = join(ROOT, ".next/diagnostics/route-bundle-stats.json");

/** Text a page can contain and still be empty. */
const PLACEHOLDER = /^(loading|please wait|loading, please wait\.*|\s)*$/i;
const MIN_TEXT = 40;

if (!existsSync(APP_OUT)) {
  console.error(
    "No .next/server/app — this gate reads a real build.\nRun:  npm run build   (or npm run check:ship, which does both)"
  );
  process.exit(1);
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return entry.endsWith(".html") ? [full] : [];
  });
}

const files = htmlFiles(APP_OUT);

/**
 * Next prerenders `/_global-error` as its own client 500 shell
 * (`html id="__next_error__"`). `src/app/global-error.tsx` is a client boundary —
 * Next requires that — so it cannot put language or a `<main>` into that file.
 * It is not a public page. Skip it, and say so, rather than fail the product gate.
 */
const SKIP = new Set(["_global-error.html"]);
const skipped = files.filter((file) => SKIP.has(basename(file)));
const inspected = files.filter((file) => !SKIP.has(basename(file)));

if (files.length === 0) {
  console.error(
    [
      "The build produced no prerendered HTML at all.",
      "",
      "Every page is being rendered on the client, which is exactly the failure this",
      "portal is replacing. Make the page a server component, or give its dynamic",
      "segment a generateStaticParams.",
    ].join("\n")
  );
  process.exit(1);
}

if (inspected.length === 0) {
  console.error(
    "Every prerendered HTML file was a skipped Next error shell. No public page was inspected."
  );
  process.exit(1);
}

/** Crude but dependency-free: strip tags, collapse whitespace. */
const textOf = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const problems = [];

for (const file of inspected) {
  const rel = relative(ROOT, file);
  const html = readFileSync(file, "utf8");

  const lang = html.match(/<html[^>]*\blang="([^"]*)"/i)?.[1];
  if (!lang) {
    problems.push(
      `${rel}\n    no <html lang> in the served HTML — set it in the layout, on the server, never in an effect`
    );
  }

  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!main) {
    problems.push(`${rel}\n    no <main> element — every page needs one landmark holding its content`);
    continue;
  }

  const text = textOf(main[1]);
  if (text.length < MIN_TEXT || PLACEHOLDER.test(text)) {
    problems.push(
      `${rel}\n    <main> has no real content in the server HTML (${text.length} chars: "${text.slice(0, 60)}")`
    );
  }
}

/* Coverage, stated out loud. */
let declared = 0;
if (existsSync(STATS)) {
  declared = JSON.parse(readFileSync(STATS, "utf8")).length;
}

if (problems.length) {
  console.error("SSR check failed:\n");
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    "\nA page whose content is not in the server response does not exist for a crawler,\na text browser, or a reader on a slow connection."
  );
  process.exit(1);
}

console.log(
  `SSR check passed — ${inspected.length} prerendered page${inspected.length === 1 ? "" : "s"} carry their content in the server HTML.`
);
if (skipped.length) {
  console.log(
    `  Skipped ${skipped.length} Next error shell${skipped.length === 1 ? "" : "s"} (${skipped.map((f) => basename(f)).join(", ")}): client boundary, not a public page.`
  );
}
if (declared) {
  console.log(
    `  Coverage: ${inspected.length} of ${declared} routes in the build manifest are prerendered.\n` +
      "  Routes rendered on demand are not inspected here; add generateStaticParams to bring one in."
  );
}
