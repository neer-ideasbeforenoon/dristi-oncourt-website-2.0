#!/usr/bin/env node
/**
 * check:meta — every public page declares its own title, description and canonical.
 *
 * Source-only: no build, no network, runs in `npm run lint`.
 *
 * This is not SEO housekeeping. GIGW 3.0 asks government pages to be findable and
 * unambiguously identified, and the portal being replaced ships one `<title>` for the
 * whole site because every page is the same client-rendered shell. A litigant searching
 * for "Kollam cause list" should land on the cause list.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP = join(ROOT, "src/app");
const ALLOW = "meta-allow";

function pageFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return pageFiles(full);
    return entry === "page.tsx" ? [full] : [];
  });
}

const problems = [];

for (const file of pageFiles(APP)) {
  const rel = relative(ROOT, file);
  const source = readFileSync(file, "utf8");
  if (source.includes(ALLOW)) continue;

  const hasStatic = /export\s+const\s+metadata\b/.test(source);
  const hasDynamic = /export\s+(?:async\s+)?function\s+generateMetadata\b/.test(source);

  if (!hasStatic && !hasDynamic) {
    problems.push(
      `${rel}\n    no metadata — export a \`metadata\` object or a \`generateMetadata\` function`
    );
    continue;
  }

  if (!/\btitle\s*:/.test(source)) {
    problems.push(`${rel}\n    metadata has no title`);
  }
  if (!/\bdescription\s*:/.test(source)) {
    problems.push(`${rel}\n    metadata has no description`);
  }
  if (!/\bcanonical\s*:/.test(source)) {
    problems.push(
      `${rel}\n    metadata has no alternates.canonical — a bilingual portal serves the same page at two URLs`
    );
  }
}

/* `<html lang>` must come from the server. */
const layouts = (function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return entry === "layout.tsx" ? [full] : [];
  });
})(APP);

const rootLayouts = layouts.filter((f) => readFileSync(f, "utf8").includes("<html"));
if (rootLayouts.length === 0) {
  problems.push("src/app/**/layout.tsx\n    no layout renders <html> — cannot verify lang is set server-side");
}
for (const file of rootLayouts) {
  const source = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);
  if (!/<html[^>]*\blang=\{/.test(source)) {
    problems.push(
      `${rel}\n    <html> has no dynamic lang={...} — a bilingual portal cannot hardcode one language`
    );
  }
  if (/useEffect[\s\S]*documentElement\.lang/.test(source)) {
    problems.push(
      `${rel}\n    lang is being set in an effect — the served HTML would carry the wrong language`
    );
  }
}

if (problems.length) {
  console.error("Meta check failed:\n");
  for (const p of problems) console.error(`  ${p}`);
  console.error(`\nFor a reviewed exception put ${ALLOW} in a comment in the file.`);
  process.exit(1);
}

console.log(`Meta check passed (${pageFiles(APP).length} pages, ${rootLayouts.length} root layout).`);
