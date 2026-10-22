import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Existing fetch-on-mount effects. Rewrite in MAS-28 / MAS-29 / MAS-32.
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
