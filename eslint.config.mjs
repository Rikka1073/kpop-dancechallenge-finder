import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Remaining fetch-on-mount is admin-only.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    ".cloudflare/**",
    ".open-next/**",
    ".wrangler/**",
    "src/.cf-build-stash/**",
    "data/raw/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
