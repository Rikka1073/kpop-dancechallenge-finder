import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { loadLocalEnv } from "@/lib/extraction/loadLocalEnv";

const original = { ...process.env };

afterEach(() => {
  for (const key of Object.keys(process.env)) {
    if (!(key in original)) {
      delete process.env[key];
    }
  }
  Object.assign(process.env, original);
});

describe("loadLocalEnv", () => {
  test(".env と .env.local を読み、既にある値は上書きしない", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "seekpop-env-"));
    await writeFile(path.join(root, ".env"), "YOUTUBE_API_KEY=from-env\nSHARED=env\n", "utf8");
    await writeFile(path.join(root, ".env.local"), "SHARED=local\nADMIN_PASSWORD=secret\n", "utf8");
    process.env.ADMIN_PASSWORD = "already-set";
    delete process.env.YOUTUBE_API_KEY;
    delete process.env.SHARED;

    loadLocalEnv(root);

    expect(process.env.YOUTUBE_API_KEY).toBe("from-env");
    expect(process.env.SHARED).toBe("local");
    expect(process.env.ADMIN_PASSWORD).toBe("already-set");
  });
});
