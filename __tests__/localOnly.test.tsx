import { afterEach, describe, expect, test } from "vitest";
import { isLocalAdminEnabled } from "@/lib/admin/localOnly";

describe("isLocalAdminEnabled", () => {
  const original = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = original;
  });

  test("development だけ管理画面を開く", () => {
    process.env.NODE_ENV = "development";
    expect(isLocalAdminEnabled()).toBe(true);

    process.env.NODE_ENV = "production";
    expect(isLocalAdminEnabled()).toBe(false);
  });
});
