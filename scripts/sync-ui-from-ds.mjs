#!/usr/bin/env node
/**
 * Copy UI primitives / tokens from the local pucar-design-system into this repo.
 *
 * Usage:
 *   npm run sync:ui -- button input
 *   npm run sync:ui -- --tokens
 *   npm run sync:ui -- --tokens-only
 *
 * Synced files are committed. vendor/ is only the source they are copied from, so the
 * repo still builds with no clone present.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import { APP_ROOT, dsResolveHint, resolveDsRoot } from "./resolve-ds.mjs";

const args = process.argv.slice(2);
const wantTokens = args.includes("--tokens") || args.includes("--tokens-only");
const tokensOnly = args.includes("--tokens-only");
const names = args.filter((a) => !a.startsWith("--"));

const ds = resolveDsRoot();
if (!ds) {
  console.error(dsResolveHint());
  process.exit(1);
}

const dsUi = join(ds, "src/components/ui");
const appUi = join(APP_ROOT, "src/components/ui");
mkdirSync(appUi, { recursive: true });

/**
 * Bare npm specifiers a synced primitive needs. The DS declares these in its own
 * package.json; this repo has to declare them too, and the failure mode when it does
 * not is a module-not-found at first render rather than anything a token gate catches.
 */
function reportMissingDeps(slug, text) {
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(join(APP_ROOT, "package.json"), "utf8"));
  } catch {
    return;
  }
  const declared = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ]);
  const bare = [...text.matchAll(/from\s+["']([^."'][^"']*)["']/g)]
    .map((m) => m[1])
    .filter((s) => !s.startsWith("@/"))
    .map((s) => (s.startsWith("@") ? s.split("/").slice(0, 2).join("/") : s.split("/")[0]))
    .filter((s) => !["react", "react-dom", "next"].includes(s));
  const missing = [...new Set(bare)].filter((d) => !declared.has(d));
  if (missing.length) {
    console.warn(
      `  note: ${slug} needs npm ${missing.join(", ")} — add to package.json before using it`
    );
  }
}

function copyOne(slug) {
  const src = join(dsUi, `${slug}.tsx`);
  if (!existsSync(src)) {
    console.error(`Missing in DS: src/components/ui/${slug}.tsx`);
    process.exitCode = 1;
    return;
  }
  copyFileSync(src, join(appUi, `${slug}.tsx`));
  console.log(`synced  ${slug}.tsx`);

  const text = readFileSync(src, "utf8");
  const deps = [...text.matchAll(/from\s+["']@\/components\/ui\/([^"']+)["']/g)].map((m) =>
    m[1].replace(/\.tsx$/, "")
  );
  const missing = [...new Set(deps)].filter(
    (d) => d !== slug && !existsSync(join(appUi, `${d}.tsx`))
  );
  if (missing.length) {
    console.warn(`  note: ${slug} imports ${missing.join(", ")} — sync those too if you use them`);
  }
  reportMissingDeps(slug, text);
}

if (wantTokens || tokensOnly) {
  copyFileSync(join(ds, "src/app/globals.css"), join(APP_ROOT, "src/app/globals.css"));
  console.log("synced  globals.css (tokens)");

  const utils = join(ds, "src/lib/utils.ts");
  if (existsSync(utils)) {
    mkdirSync(join(APP_ROOT, "src/lib"), { recursive: true });
    copyFileSync(utils, join(APP_ROOT, "src/lib/utils.ts"));
    console.log("synced  lib/utils.ts");
  }
}

if (!tokensOnly) {
  const toSync =
    names.length > 0
      ? names
      : readdirSync(appUi)
          .filter((f) => f.endsWith(".tsx"))
          .map((f) => basename(f, ".tsx"));

  if (toSync.length === 0) {
    console.error("No components to sync. Pass names, e.g. `npm run sync:ui -- button input`.");
    process.exit(1);
  }

  for (const slug of toSync) copyOne(slug);
}

if (process.exitCode) {
  console.error("\nSync finished with errors.");
  process.exit(process.exitCode);
}
console.log(`DS root: ${ds}`);
