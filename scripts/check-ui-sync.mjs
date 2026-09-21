#!/usr/bin/env node
/**
 * Fail if any UI primitive in this repo drifts from pucar-design-system.
 * Hand-written or half-edited copies are invent-risk — re-sync from the DS.
 *
 * This gate is relative: it compares against whatever sits in vendor/, so it passes
 * green on the wrong DS version. check:ds-fresh is the gate that answers "is this the
 * pinned version"; run both.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, relative } from "node:path";

import { APP_ROOT, dsResolveHint, resolveDsRoot } from "./resolve-ds.mjs";

const ds = resolveDsRoot();
if (!ds) {
  console.error(dsResolveHint());
  process.exit(1);
}

const appUi = join(APP_ROOT, "src/components/ui");
const dsUi = join(ds, "src/components/ui");

if (!existsSync(appUi) || readdirSync(appUi).filter((f) => f.endsWith(".tsx")).length === 0) {
  console.log("No synced primitives yet — ui sync check skipped.");
  process.exit(0);
}

const files = readdirSync(appUi).filter((f) => f.endsWith(".tsx"));
let failed = false;

for (const file of files) {
  const appPath = join(appUi, file);
  const dsPath = join(dsUi, file);
  if (!existsSync(dsPath)) {
    console.error(
      `${relative(APP_ROOT, appPath)}  not in DS — remove it, or promote it into pucar-design-system first`
    );
    failed = true;
    continue;
  }
  if (readFileSync(appPath, "utf8") !== readFileSync(dsPath, "utf8")) {
    console.error(
      `${relative(APP_ROOT, appPath)}  drifts from DS — run: npm run sync:ui -- ${basename(file, ".tsx")}`
    );
    failed = true;
  }
}

const appTokens = join(APP_ROOT, "src/app/globals.css");
const dsTokens = join(ds, "src/app/globals.css");
if (existsSync(appTokens) && existsSync(dsTokens)) {
  if (readFileSync(appTokens, "utf8") !== readFileSync(dsTokens, "utf8")) {
    console.error(
      "src/app/globals.css  drifts from DS — run: npm run sync:ui -- --tokens-only\n" +
        "  Local additions belong in src/app/portal-tokens.css, never in this file."
    );
    failed = true;
  }
}

if (failed) {
  console.error("\nUI sync check failed. Copy from the DS; do not hand-edit primitives.");
  process.exit(1);
}
console.log(`UI sync check passed (${files.length} components + tokens). DS: ${ds}`);
