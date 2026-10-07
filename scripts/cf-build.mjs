import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import path from "node:path";

const stashRoot = path.join("src", ".cf-build-stash");
const moves = [
  ["src/app/admin", path.join(stashRoot, "admin")],
  ["src/app/api", path.join(stashRoot, "api")],
  ["src/middleware.ts", path.join(stashRoot, "middleware.ts")],
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
      mkdirSync(path.dirname(stashed), { recursive: true });
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
  rmSync(".next", { recursive: true, force: true });
  const result = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env: { ...process.env, CF_STATIC: "1" },
  });
  code = result.status ?? 1;
} finally {
  restore();
}

process.exit(code);
