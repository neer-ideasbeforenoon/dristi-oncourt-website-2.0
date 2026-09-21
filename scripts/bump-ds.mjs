#!/usr/bin/env node
/**
 * ds:bump — move the whole repo to a newer design system, in one reviewable commit.
 *
 * This is the only sanctioned way the pinned version changes. It is deliberately a
 * command someone runs and commits, not something that happens quietly on install:
 * a DS bump changes how every page looks, and that belongs in the history where it can
 * be seen, discussed, and reverted.
 *
 *   npm run ds:bump              # move to the DS's latest main
 *   npm run ds:bump -- <commit>  # move to a specific commit
 *   npm run ds:bump -- --dry-run # show what would change, touch nothing
 *
 * Ported from dristi-app's root script, flattened: this repo has no apps/ directory, so
 * the import and the three re-sync paths all lose their `apps/dristi-app` hop. It also
 * re-syncs docs/ds/, which dristi-app does not carry.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import {
  DS_LOCK_PATH,
  EXPECTED_DS_REMOTE,
  VENDOR_DS_PATH,
  readDsLock,
  resolveDsRoot,
  dsResolveHint,
  REPO_ROOT,
} from "./resolve-ds.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const target = args.find((a) => !a.startsWith("--"));

const ds = resolveDsRoot();
if (!ds) {
  console.error(dsResolveHint());
  process.exit(1);
}
if (ds !== VENDOR_DS_PATH) {
  console.error(
    `Refusing to bump from ${ds}.\nThe pin must be set from the vendored clone, not a PUCAR_DS_ROOT override —\notherwise you pin the repo to a commit that only exists on your machine.`
  );
  process.exit(1);
}

const lock = readDsLock();
const from = lock?.commit ?? null;

function git(...a) {
  return execFileSync("git", ["-C", ds, ...a], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 120_000,
  }).trim();
}

try {
  git("fetch", "--quiet", "origin");
} catch {
  console.error(
    "Could not reach the DS remote. A bump needs the network — try again when online."
  );
  process.exit(1);
}

let to;
try {
  to = git("rev-parse", target ?? "origin/main");
} catch {
  console.error(`"${target}" is not a commit in ${ds}.`);
  process.exit(1);
}

if (from === to) {
  console.log(`Already pinned to ${to.slice(0, 12)} — nothing to bump.`);
  process.exit(0);
}

/* Show the range first. A bump nobody read is a bump nobody can review. */
const range = from ? `${from}..${to}` : null;
console.log(
  `\nDesign system bump\n  from  ${from ? from.slice(0, 12) : "(unpinned)"}\n  to    ${to.slice(0, 12)}\n`
);

if (range) {
  const logOf = (r) => {
    try {
      return git("log", "--format=  %h %s", r);
    } catch {
      return "";
    }
  };

  const forward = logOf(range);
  if (forward) {
    console.log(`Commits being adopted:\n${forward}\n`);
  } else {
    // `to` is behind `from`: a revert of an earlier bump. `log from..to` is empty for
    // that, which would otherwise print nothing and read as "no changes".
    const backward = logOf(`${to}..${from}`);
    if (backward) console.log(`DOWNGRADE — giving up these commits:\n${backward}\n`);
  }

  const touched = (() => {
    try {
      return git("diff", "--name-only", range);
    } catch {
      return "";
    }
  })()
    .split("\n")
    .filter(Boolean);

  const primitives = touched.filter((f) => f.startsWith("src/components/ui/"));
  const tokens = touched.includes("src/app/globals.css");
  const rules = touched.filter(
    (f) =>
      f === "AGENTS.md" ||
      f === "ACCESSIBILITY.md" ||
      f.startsWith("src/app/(docs)/foundations/laws/") ||
      f.startsWith("src/app/(docs)/principles/")
  );
  console.log(
    `Affects this repo: ${primitives.length} primitive${primitives.length === 1 ? "" : "s"}` +
      `${tokens ? " + the token file" : ""}${rules.length ? ` + ${rules.length} rule document${rules.length === 1 ? "" : "s"}` : ""}`
  );
  for (const f of primitives) console.log(`  ${f.replace("src/components/ui/", "")}`);
  for (const f of rules) console.log(`  rules: ${f}`);

  console.log(
    "\nRead the changelog for this range before committing — a token whose *meaning*\nchanged shows up in no file diff:\n  " +
      join(ds, "CHANGELOG.md") +
      "\n"
  );
}

if (dryRun) {
  console.log("--dry-run: nothing written.");
  process.exit(0);
}

/* 1. move the vendored clone */
git("checkout", "--quiet", "--detach", to);

/* 2. rewrite the pin */
const next = {
  _comment:
    "The one design-system version this repo builds against. Everyone gets this exact commit; npm install checks it out. Change it only via `npm run ds:bump`, never by hand on a feature branch.",
  remote: lock?.remote ?? EXPECTED_DS_REMOTE,
  commit: to,
  bumpedOn: new Date().toISOString().slice(0, 10),
};
writeFileSync(DS_LOCK_PATH, `${JSON.stringify(next, null, 2)}\n`);
console.log(`ds.lock.json -> ${to.slice(0, 12)}`);

/* 3. re-sync every primitive this repo already carries, plus tokens, plus the rule docs */
const appUi = join(REPO_ROOT, "src/components/ui");
const names = existsSync(appUi)
  ? readdirSync(appUi)
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => f.replace(/\.tsx$/, ""))
  : [];

execFileSync(
  "node",
  [join(REPO_ROOT, "scripts/sync-ui-from-ds.mjs"), "--tokens", ...names],
  { stdio: "inherit", cwd: REPO_ROOT }
);

execFileSync("node", [join(REPO_ROOT, "scripts/sync-ds-docs.mjs")], {
  stdio: "inherit",
  cwd: REPO_ROOT,
});

console.log(
  [
    "",
    "Bumped. Now, in this order:",
    "  1. npm run check:ui-sync     confirm the repo matches the new DS",
    "  2. npm run check:ds-docs     confirm docs/ds/ matches the new DS",
    "  3. look at the pages         the checks cannot judge a layout",
    "  4. commit ds.lock.json together with every synced file",
    "",
    "Committing the pin without the synced files is the one thing that makes this",
    "worse than not bumping: the repo would then claim a version it is not on.",
  ].join("\n")
);
