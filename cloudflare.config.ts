import { defineConfig } from "cf/config";

/** 公開サイト。Origin の Git 連携は使わない。手元の `npm run deploy` だけ。 */
export default defineConfig({
  worker: {
    name: "kpop-dancechallenge-finder",
    compatibilityDate: "2026-10-07",
    assets: {
      notFoundHandling: "404-page",
    },
    domains: ["seekpop.jp", "www.seekpop.jp"],
    workersDev: true,
  },
});
