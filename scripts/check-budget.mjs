#!/usr/bin/env node
/**
 * check:budget — fail when a route's first-load JavaScript crosses its ceiling.
 *
 * Needs a build: it reads `.next/diagnostics/route-bundle-stats.json`, which Next 16
 * writes on every `next build`. Run it through `npm run check:ship`, not `npm run lint`.
 *
 * Bytes here are UNCOMPRESSED, because that is what Next reports. Uncompressed is also
 * the more honest number for the audience this portal actually has: gzip shrinks the
 * transfer, but the parse and execute cost on a cheap Android phone tracks the
 * uncompressed size.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATS = join(ROOT, ".next/diagnostics/route-bundle-stats.json");
const BUDGET = join(ROOT, "scripts/budget.json");

if (!existsSync(STATS)) {
  console.error(
    "No .next/diagnostics/route-bundle-stats.json — this gate reads a real build.\nRun:  npm run build   (or npm run check:ship, which does both)"
  );
  process.exit(1);
}

const budget = JSON.parse(readFileSync(BUDGET, "utf8"));
const ceilingFor = (route) =>
  budget.routes?.[route] ?? budget.defaultFirstLoadUncompressedBytes;

const stats = JSON.parse(readFileSync(STATS, "utf8"));
const kb = (n) => `${Math.round(n / 1024)} KB`;

const over = [];
for (const entry of stats) {
  const bytes = entry.firstLoadUncompressedJsBytes ?? 0;
  const ceiling = ceilingFor(entry.route);
  if (bytes > ceiling) over.push({ route: entry.route, bytes, ceiling });
}

const worst = [...stats]
  .sort((a, b) => (b.firstLoadUncompressedJsBytes ?? 0) - (a.firstLoadUncompressedJsBytes ?? 0))
  .slice(0, 3);

if (over.length) {
  console.error("Budget check failed — these routes ship too much JavaScript:\n");
  for (const o of over) {
    console.error(`  ${o.route}\n    ${kb(o.bytes)} first load, ceiling ${kb(o.ceiling)}`);
  }
  console.error(
    [
      "",
      "Before raising the ceiling in scripts/budget.json, check the cheaper fixes:",
      "  - is a component 'use client' that did not need to be?",
      "  - is a heavy library imported at module scope instead of behind next/dynamic?",
      "  - is this route doing work that belongs on the server?",
      "A ceiling raised without an answer to those is how a portal becomes the one it replaced.",
    ].join("\n")
  );
  process.exit(1);
}

console.log(`Budget check passed (${stats.length} routes). Heaviest:`);
for (const w of worst) {
  console.log(`  ${kb(w.firstLoadUncompressedJsBytes ?? 0)}  ${w.route}`);
}
