import { bindings, defineConfig } from "cf/config";

/** 公開サイト。Origin の Git 連携は使わない。手元の `npm run deploy` だけ。 */
export default defineConfig({
  worker: {
    name: "kpop-dancechallenge-finder",
    compatibilityDate: "2026-10-07",
    compatibilityFlags: ["nodejs_compat", "global_fetch_strictly_public"],
    entrypoint: "./.open-next/worker.js",
    assets: {
      notFoundHandling: "none",
    },
    env: {
      ASSETS: bindings.assets(),
      WORKER_SELF_REFERENCE: bindings.worker({ worker: "kpop-dancechallenge-finder" }),
    },
    domains: ["seekpop.jp", "www.seekpop.jp"],
    workersDev: true,
  },
});
