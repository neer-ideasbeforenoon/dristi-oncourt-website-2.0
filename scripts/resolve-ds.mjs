#!/usr/bin/env node
/**
 * Resolve the local pucar-design-system root for the sync/check scripts.
 *
 * Canonical location (auto-cloned by npm install): vendor/pucar-design-system
 * Optional override: PUCAR_DS_ROOT
 *
 * Ported from dristi-app. ONE deliberate difference, and it is load-bearing:
 * dristi-app sits at `apps/dristi-app`, so it computes
 *
 *     const APP_ROOT  = <scripts>/..
 *     const REPO_ROOT = join(APP_ROOT, "../..")
 *
 * That second hop exists only to climb out of the workspace. This repo is flat — the
 * app IS the repo — so copying that line verbatim resolves REPO_ROOT to the parent of
 * your home directory, clones the design system into `~/vendor/`, and then never finds
 * ds.lock.json. Nothing fails loudly; the pin simply stops being enforced.
 *
 * So: one anchor, asserted. Do not re-add a second "../" hop.
 */
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

if (
  !existsSync(join(REPO_ROOT, "package.json")) ||
  !existsSync(join(REPO_ROOT, "ds.lock.json"))
) {
  throw new Error(
    `resolve-ds.mjs: expected the repo root at ${REPO_ROOT}, but package.json and/or\n` +
      `ds.lock.json are not there. This file must live at <repo>/scripts/resolve-ds.mjs.\n` +
      `Refusing to continue rather than resolve paths outside the repository.`
  );
}

/**
 * Alias, not decoration. check-typography, check-ui-sync and sync-ui-from-ds are ported
 * from dristi-app and all do `join(APP_ROOT, "src")`. In a flat repo that is the same
 * directory as REPO_ROOT, so exporting both keeps those files diffable against their
 * originals.
 */
const APP_ROOT = REPO_ROOT;

/** GitHub path that must appear in origin (or in `.pucar-ds-id`). */
export const EXPECTED_DS_REMOTE = "pucardotorg/dristi-design-system";

const MARKER_FILE = ".pucar-ds-id";

/** In-repo install path — populated automatically by `npm install` / ensure-ds. */
export const VENDOR_DS_PATH = resolve(REPO_ROOT, "vendor/pucar-design-system");

/**
 * No sibling fallback. dristi-app accepts `../pucar-design-system` for historical
 * reasons; this repo is new, so there is no legacy checkout to honour, and a sibling
 * path resolves outside the repo where .gitignore and the pin do not reach.
 */
const CANDIDATES = [process.env.PUCAR_DS_ROOT, VENDOR_DS_PATH].filter(Boolean);

export function looksLikeDsTree(root) {
  return (
    existsSync(join(root, "AGENTS.md")) &&
    existsSync(join(root, "src/components/ui"))
  );
}

/**
 * True only for the authoritative Pucar DS — not divergent forks that share the name.
 */
export function isAuthoritativeDs(root) {
  const markerPath = join(root, MARKER_FILE);
  if (existsSync(markerPath)) {
    const id = readFileSync(markerPath, "utf8").trim();
    if (id.includes(EXPECTED_DS_REMOTE)) return true;
  }

  try {
    const url = execFileSync("git", ["-C", root, "remote", "get-url", "origin"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (url.includes(EXPECTED_DS_REMOTE)) return true;
    console.error(
      `Rejected DS at ${root}: origin is "${url}" — expected ${EXPECTED_DS_REMOTE}`
    );
    return false;
  } catch {
    console.error(
      `Rejected DS at ${root}: no matching git origin and no ${MARKER_FILE} for ${EXPECTED_DS_REMOTE}`
    );
    return false;
  }
}

/** The pin file: the one DS version every branch builds against. */
export const DS_LOCK_PATH = resolve(REPO_ROOT, "ds.lock.json");

/**
 * Read the pinned DS commit.
 *
 * The pin is what makes "are we all on the same design system" a fact recorded in the
 * repo instead of a question about when each person last installed.
 *
 * @returns {{remote: string, commit: string, bumpedOn?: string} | null}
 */
export function readDsLock() {
  if (!existsSync(DS_LOCK_PATH)) return null;
  let lock;
  try {
    lock = JSON.parse(readFileSync(DS_LOCK_PATH, "utf8"));
  } catch {
    console.error("ds.lock.json is not valid JSON — fix it or restore it from git.");
    return null;
  }
  if (!lock?.commit || !/^[0-9a-f]{40}$/.test(lock.commit)) {
    console.error("ds.lock.json has no valid 40-character `commit`.");
    return null;
  }
  if (!String(lock.remote ?? "").includes(EXPECTED_DS_REMOTE)) {
    console.error(
      `ds.lock.json points at "${lock.remote}" — expected ${EXPECTED_DS_REMOTE}. Refusing it.`
    );
    return null;
  }
  return lock;
}

/** True when the DS in use came from the PUCAR_DS_ROOT escape hatch rather than the pin. */
export function isLocalDsOverride(root) {
  const override = process.env.PUCAR_DS_ROOT;
  return Boolean(override && resolve(override) === resolve(root));
}

export function dsResolveHint() {
  return [
    `Could not resolve authoritative pucar-design-system (${EXPECTED_DS_REMOTE}).`,
    "From this repo root run:  npm install   (fetches DS into vendor/pucar-design-system)",
    "Or:  npm run setup:ds",
    `Expected path: ${VENDOR_DS_PATH}`,
  ].join("\n");
}

/**
 * @returns {string | null} Absolute path to the verified DS root, or null.
 */
export function resolveDsRoot() {
  const seen = new Set();
  for (const candidate of CANDIDATES) {
    const root = resolve(candidate);
    if (seen.has(root)) continue;
    seen.add(root);
    if (!looksLikeDsTree(root)) continue;
    if (!isAuthoritativeDs(root)) continue;
    return root;
  }
  return null;
}

export { APP_ROOT, REPO_ROOT };
