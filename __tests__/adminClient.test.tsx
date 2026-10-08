import { afterEach, describe, expect, test } from "vitest";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalService = process.env.SUPABASE_SERVICE_ROLE_KEY;

afterEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
  process.env.SUPABASE_SERVICE_ROLE_KEY = originalService;
});

describe("createAdminSupabaseClient", () => {
  test("service role が無いと書き込み用クライアントを作らない", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(() => createAdminSupabaseClient()).toThrow("SUPABASE_SERVICE_ROLE_KEY");
  });
});
