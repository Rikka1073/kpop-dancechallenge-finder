import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "out");
const outputRoot = path.join(root, ".cloudflare/output/v0");
const workerDir = path.join(outputRoot, "workers/default");

if (!existsSync(path.join(dist, "index.html"))) {
  throw new Error("out/index.html がありません。先に `node scripts/cf-build.mjs` してください。");
}

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(path.join(workerDir, "assets"), { recursive: true });
cpSync(dist, path.join(workerDir, "assets"), { recursive: true });

writeFileSync(path.join(outputRoot, "config.json"), `${JSON.stringify({ buildContext: { isPreview: false } })}\n`);

writeFileSync(
  path.join(workerDir, "worker.config.json"),
  `${JSON.stringify({
    name: "kpop-dancechallenge-finder",
    compatibilityDate: "2026-10-07",
    assets: { notFoundHandling: "404-page" },
    domains: ["seekpop.jp", "www.seekpop.jp"],
    workersDev: true,
  })}\n`,
);
