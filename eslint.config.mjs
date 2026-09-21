import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "vendor/**",
    // Pinned verbatim copies of the design system's own docs pages. They are evidence,
    // not source: they are never imported, never built, and must stay byte-identical to
    // the DS. Linting them would invite edits that check:ds-docs then rejects.
    "docs/ds/**",
  ]),
]);

export default eslintConfig;
