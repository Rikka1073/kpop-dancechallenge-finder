import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const openNextWorker = path.join(root, ".open-next", "worker.js");
const openNextAssets = path.join(root, ".open-next", "assets");
const outputRoot = path.join(root, ".cloudflare/output/v0");
const workerDir = path.join(outputRoot, "workers/default");
const bundleDir = path.join(workerDir, "bundle");
const assetsDir = path.join(workerDir, "assets");

if (!existsSync(openNextWorker) || !existsSync(openNextAssets)) {
  throw new Error(".open-next がありません。先に `node scripts/cf-build.mjs` してください。");
}

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(bundleDir, { recursive: true });

const wrangler = spawnSync("npx", ["wrangler", "deploy", "--dry-run", "--outdir", bundleDir], {
  stdio: "inherit",
  cwd: root,
});
if (wrangler.status !== 0) {
  throw new Error("wrangler のバンドルに失敗しました。");
}

rmSync(path.join(bundleDir, "README.md"), { force: true });
rmSync(path.join(bundleDir, "worker.js.map"), { force: true });

if (!existsSync(path.join(bundleDir, "worker.js"))) {
  throw new Error("wrangler が worker.js を出しませんでした。");
}

cpSync(openNextAssets, assetsDir, { recursive: true });

writeFileSync(path.join(outputRoot, "config.json"), `${JSON.stringify({ buildContext: { isPreview: false } })}\n`);

writeFileSync(
  path.join(workerDir, "worker.config.json"),
  `${JSON.stringify({
    name: "kpop-dancechallenge-finder",
    compatibilityDate: "2026-10-07",
    compatibilityFlags: ["nodejs_compat", "global_fetch_strictly_public"],
    assets: { notFoundHandling: "none" },
    domains: ["seekpop.jp", "www.seekpop.jp"],
    workersDev: true,
    env: {
      ASSETS: { type: "assets" },
      WORKER_SELF_REFERENCE: { type: "worker", worker: "kpop-dancechallenge-finder" },
    },
    manifest: {
      type: "complete",
      mainModule: "worker.js",
      modules: {
        "worker.js": { type: "esm" },
      },
    },
  })}\n`,
);
