#!/usr/bin/env node
/**
 * check:ds-docs — prove the committed copy of the DS rules is still the pinned one.
 *
 * Three outcomes, never two. A snapshot that cannot be verified must not be reported
 * as green; that is how a stale copy of the rules ends up quietly governing the work.
 *
 *   PASS        every file matches its recorded hash, and the manifest's commit is the
 *               pinned commit. With a vendor clone on the pin, also byte-identical to
 *               the real DS.
 *   FAIL        a file was hand-edited, is missing, is untracked by the manifest, or
 *               the manifest is stale against ds.lock.json. Detected with no clone and
 *               no network.
 *   UNVERIFIED  no vendor clone (or it is off the pin), so the manifest itself could
 *               not be confirmed against the design system. Loud. `--strict` — which CI
 *               uses — turns this into a failure.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

import { REPO_ROOT, readDsLock, resolveDsRoot, isLocalDsOverride } from "./resolve-ds.mjs";
import { DS_DOCS } from "./ds-docs-manifest.mjs";

const strict = process.argv.includes("--strict");
const OUT = join(REPO_ROOT, "docs/ds");
const MANIFEST = join(OUT, "manifest.json");

const fail = (...lines) => {
  for (const l of lines) console.error(l);
  process.exit(1);
};

if (!existsSync(MANIFEST)) {
  fail(
    "docs/ds/manifest.json is missing — the pinned copy of the DS rules has never been written.",
    "Run:  npm run sync:ds-docs"
  );
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
} catch {
  fail("docs/ds/manifest.json is not valid JSON. Restore it from git, or re-run npm run sync:ds-docs.");
}

const lock = readDsLock();
if (!lock) fail("No usable ds.lock.json — cannot say which DS version docs/ds/ should mirror.");

/* 1. Stale snapshot. Needs no clone: pure file comparison. */
if (manifest.dsCommit !== lock.commit) {
  fail(
    "docs/ds/ mirrors a different design system from the one this repo is pinned to.",
    "",
    `  pinned    ${lock.commit.slice(0, 12)}`,
    `  docs/ds/  ${String(manifest.dsCommit).slice(0, 12)}`,
    "",
    "The committed rules are stale, so anyone reading them is following the wrong DS.",
    "Fix:  npm run sync:ds-docs   (then commit docs/ds/ with the pin)"
  );
}

/* 2. Hand-edits and drift from the recorded hashes. Also needs no clone. */
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const problems = [];
const expected = new Set(["manifest.json", "README.md"]);

for (const entry of manifest.files ?? []) {
  expected.add(entry.to);
  const path = join(OUT, entry.to);
  if (!existsSync(path)) {
    problems.push(`docs/ds/${entry.to}  missing`);
    continue;
  }
  if (sha(path) !== entry.sha256) {
    problems.push(`docs/ds/${entry.to}  hand-edited (hash differs from the manifest)`);
  }
}

const listed = new Set((manifest.files ?? []).map((f) => f.to));
for (const { to } of DS_DOCS) {
  if (!listed.has(to)) problems.push(`docs/ds/${to}  in the manifest list but never synced`);
}
if (existsSync(OUT)) {
  for (const name of readdirSync(OUT)) {
    if (!expected.has(name)) {
      problems.push(`docs/ds/${name}  untracked — nothing in the manifest claims this file`);
    }
  }
}

if (problems.length) {
  fail(
    "docs/ds/ has been modified. It is a verbatim copy, not a place to edit.",
    "",
    ...problems.map((p) => `  ${p}`),
    "",
    "Fix:  git checkout docs/ds/   (or npm run sync:ds-docs if the DS really changed)"
  );
}

/* 3. Confirm the manifest itself against the real DS, when that is possible at all. */
const ds = resolveDsRoot();
let verifiable = Boolean(ds);
let reason = "no design-system clone (run npm install)";

if (ds && isLocalDsOverride(ds)) {
  verifiable = false;
  reason = `using PUCAR_DS_ROOT (${ds}), not the pinned clone`;
} else if (ds) {
  try {
    const head = execFileSync("git", ["-C", ds, "rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (head !== lock.commit) {
      verifiable = false;
      reason = `the clone is at ${head.slice(0, 12)}, not the pin ${lock.commit.slice(0, 12)}`;
    }
  } catch {
    verifiable = false;
    reason = "the clone is not a git checkout";
  }
}

if (verifiable) {
  const mismatched = [];
  for (const entry of manifest.files ?? []) {
    const src = join(ds, entry.from);
    if (!existsSync(src)) {
      mismatched.push(`${entry.from}  no longer exists in the DS`);
      continue;
    }
    if (sha(src) !== entry.sha256) mismatched.push(`${entry.from}  differs from docs/ds/${entry.to}`);
  }
  if (mismatched.length) {
    fail(
      "docs/ds/ does not match the design system at the pinned commit.",
      "",
      ...mismatched.map((m) => `  ${m}`),
      "",
      "Fix:  npm run sync:ds-docs"
    );
  }
  console.log(
    `ds-docs check passed — ${manifest.files.length} files byte-identical to ${lock.commit.slice(0, 12)}.`
  );
  process.exit(0);
}

console.error(
  [
    `UNVERIFIED — docs/ds/ is internally consistent and stamped ${lock.commit.slice(0, 12)},`,
    `but it could not be confirmed against the design system: ${reason}.`,
    "",
    "This is not a pass. The committed rules may mirror a commit that no longer says",
    "what they say. Run `npm install` and re-run before trusting them.",
  ].join("\n")
);
process.exit(strict ? 1 : 0);
