#!/usr/bin/env node
/**
 * Enforce the portal type roles in product composition.
 *
 * Product screens use the classes in src/app/oncourts-typography.css (Georgia
 * headings, Inter for interface text). Synced DS primitives are excluded: their
 * control chrome still uses the pinned scale internally.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { APP_ROOT } from "./resolve-ds.mjs";

const SRC = join(APP_ROOT, "src");
const UI_PRIMITIVES = join(SRC, "components", "ui") + sep;
const TYPE_CSS = join(SRC, "app", "oncourts-typography.css");
const FONTS = join(SRC, "app", "fonts.ts");
const ALLOW = "ds-typography-allow";
const RAW_TYPE_SIZE = /\btext-(?:xs|sm|base|lg|xl|[2-9]xl|\[[^\]]+\])(?![\w-])/g;
const DS_TYPE_ROLE =
  /\btext-(?:display(?:-s)?|title(?:-l|-s)?|body(?:-compact)?|caption)(?![\w-])/g;
const ROLES = [
  "display",
  "feature",
  "services",
  "section",
  "card",
  "lead",
  "body",
  "support",
  "eyebrow",
  "nav",
  "action",
  "caption",
];
const NOTO_WEIGHTS = ["400", "500", "700", "800"];
const INTER_WEIGHTS = ["400", "700", "800"];

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return entry.endsWith(".tsx") && !full.startsWith(UI_PRIMITIVES) ? [full] : [];
  });
}

const findings = [];

for (const file of sourceFiles(SRC)) {
  const source = readFileSync(file, "utf8");
  const lines = source.split("\n");

  lines.forEach((line, index) => {
    if (line.includes(ALLOW) || lines[index - 1]?.includes(ALLOW)) return;

    for (const match of line.matchAll(RAW_TYPE_SIZE)) {
      findings.push({
        file: relative(APP_ROOT, file),
        line: index + 1,
        rule: "use a portal type role in product composition",
        match: match[0],
      });
    }

    for (const match of line.matchAll(DS_TYPE_ROLE)) {
      findings.push({
        file: relative(APP_ROOT, file),
        line: index + 1,
        rule: "product screens use portal type roles, not the DS type scale",
        match: match[0],
      });
    }
  });
}

if (!existsSync(TYPE_CSS)) {
  findings.push({
    file: relative(APP_ROOT, TYPE_CSS),
    line: 1,
    rule: "portal type stylesheet is missing",
    match: "oncourts-typography.css",
  });
} else {
  const css = readFileSync(TYPE_CSS, "utf8");
  for (const role of ROLES) {
    if (!css.includes(`.type-${role}`)) {
      findings.push({
        file: relative(APP_ROOT, TYPE_CSS),
        line: 1,
        rule: "portal type role is missing",
        match: `.type-${role}`,
      });
    }
  }
  if (!css.includes("Georgia")) {
    findings.push({
      file: relative(APP_ROOT, TYPE_CSS),
      line: 1,
      rule: "headings must use Georgia",
      match: "missing Georgia",
    });
  }
}

if (!existsSync(FONTS)) {
  findings.push({
    file: relative(APP_ROOT, FONTS),
    line: 1,
    rule: "portal font loader is missing",
    match: "fonts.ts",
  });
} else {
  const fonts = readFileSync(FONTS, "utf8");
  const interAt = fonts.indexOf("Inter({");
  const notoAt = fonts.indexOf("Noto_Sans_Malayalam({");
  const inter = interAt === -1 ? "" : fonts.slice(interAt, notoAt === -1 ? undefined : notoAt);
  const noto = notoAt === -1 ? "" : fonts.slice(notoAt);
  for (const weight of NOTO_WEIGHTS) {
    if (!noto.includes(`"${weight}"`)) {
      findings.push({
        file: relative(APP_ROOT, FONTS),
        line: 1,
        rule: "Malayalam font loading must include the portal role weights",
        match: `missing weight ${weight}`,
      });
    }
  }
  for (const weight of INTER_WEIGHTS) {
    if (!inter.includes(`"${weight}"`)) {
      findings.push({
        file: relative(APP_ROOT, FONTS),
        line: 1,
        rule: "Inter must include the interface weights",
        match: `missing weight ${weight}`,
      });
    }
  }
}

if (findings.length) {
  console.error("Typography check failed:\n");
  for (const finding of findings) {
    console.error(
      `${finding.file}:${finding.line}  ${finding.rule}: ${finding.match}`
    );
  }
  console.error(
    "\nUse type-body for citizen copy and type-display, type-section, and the other " +
      `roles in src/app/oncourts-typography.css for headings. Keep ${ALLOW} for reviewed exceptions only.`
  );
  process.exit(1);
}

console.log("Typography check passed (portal type roles used outside synced primitives).");
