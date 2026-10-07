import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import path from "node:path";

const stashRoot = path.join("src", ".pages-build-stash");
const moves = [
  ["src/app/admin", path.join(stashRoot, "admin")],
  ["src/app/api/admin", path.join(stashRoot, "api-admin")],
];

function restore() {
  for (const [original, stashed] of moves) {
    if (existsSync(stashed) && !existsSync(original)) {
      renameSync(stashed, original);
    }
  }
  if (existsSync(stashRoot)) {
    rmSync(stashRoot, { recursive: true, force: true });
  }
}

function hide() {
  restore();
  mkdirSync(stashRoot, { recursive: true });
  for (const [original, stashed] of moves) {
    if (existsSync(original)) {
      renameSync(original, stashed);
    }
  }
}

restore();
hide();

process.on("SIGINT", () => {
  restore();
  process.exit(1);
});
process.on("SIGTERM", () => {
  restore();
  process.exit(1);
});

let code = 1;
try {
  const result = spawnSync("npx", ["@cloudflare/next-on-pages"], {
    stdio: "inherit",
  });
  code = result.status ?? 1;
} finally {
  restore();
}

process.exit(code);
