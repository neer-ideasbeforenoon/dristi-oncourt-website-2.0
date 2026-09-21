#!/usr/bin/env node
/**
 * sync:ds-docs — mirror the pinned design system's rule documents into docs/ds/.
 *
 * Why this exists: vendor/pucar-design-system is gitignored, so on a fresh clone —
 * before npm install, on GitHub's web view, in any tool without the network — the DS
 * rules an agent is told to obey are simply not there. It reads nothing and invents.
 * Committing a pinned copy closes that hole.
 *
 * Every file is a byte copy plus a recorded hash. See ds-docs-manifest.mjs for why
 * nothing here is transformed.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";

import { REPO_ROOT, dsResolveHint, readDsLock, resolveDsRoot } from "./resolve-ds.mjs";
import { DS_DOCS } from "./ds-docs-manifest.mjs";

const ds = resolveDsRoot();
if (!ds) {
  console.error(dsResolveHint());
  process.exit(1);
}

const lock = readDsLock();
if (!lock) {
  console.error("No usable ds.lock.json — refusing to stamp a snapshot with no version.");
  process.exit(1);
}

const OUT = join(REPO_ROOT, "docs/ds");
mkdirSync(OUT, { recursive: true });

const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const files = [];

for (const { from, to } of DS_DOCS) {
  const src = join(ds, from);
  if (!existsSync(src)) {
    console.error(`Missing in DS: ${from}`);
    process.exitCode = 1;
    continue;
  }
  const dest = join(OUT, to);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  files.push({ from, to, sha256: sha(dest) });
  console.log(`synced  docs/ds/${to}`);
}

if (process.exitCode) {
  console.error("\nds-docs sync finished with errors — manifest not written.");
  process.exit(process.exitCode);
}

writeFileSync(
  join(OUT, "manifest.json"),
  `${JSON.stringify(
    {
      _comment:
        "Written by `npm run sync:ds-docs`. Every file listed is a byte copy of the design system at dsCommit. Never hand-edit anything in docs/ds/ — `npm run check:ds-docs` compares these hashes and will reject it.",
      dsRemote: lock.remote,
      dsCommit: lock.commit,
      files,
    },
    null,
    2
  )}\n`
);

console.log(`\ndocs/ds/manifest.json -> ${lock.commit.slice(0, 12)} (${files.length} files)`);
