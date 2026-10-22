import { afterEach, describe, expect, test, vi } from "vitest";
import { isLocalAdminEnabled } from "@/lib/admin/localOnly";

describe("isLocalAdminEnabled", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("development だけ管理画面を開く", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(isLocalAdminEnabled()).toBe(true);

    vi.stubEnv("NODE_ENV", "production");
    expect(isLocalAdminEnabled()).toBe(false);
  });
});
