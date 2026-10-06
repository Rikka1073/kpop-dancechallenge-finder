import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { createSessionToken, verifyAdminPassword, verifySessionToken } from "@/lib/admin/session";

describe("admin session", () => {
  const originalPassword = process.env.ADMIN_PASSWORD;
  const originalSecret = process.env.ADMIN_SESSION_SECRET;

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "test-password";
    process.env.ADMIN_SESSION_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalPassword;
    process.env.ADMIN_SESSION_SECRET = originalSecret;
  });

  test("正しいパスワードを受け付ける", () => {
    expect(verifyAdminPassword("test-password")).toBe(true);
    expect(verifyAdminPassword("wrong")).toBe(false);
  });

  test("セッショントークンを発行して検証できる", async () => {
    const token = await createSessionToken();
    expect(await verifySessionToken(token)).toBe(true);
    expect(await verifySessionToken("invalid.token")).toBe(false);
  });
});
