import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

describe("公開データ層", () => {
  test("公開 supabase は server-only で、クライアントから読まない", () => {
    expect(readFileSync("src/lib/supabase/supabase.ts", "utf8")).toMatch(/import ["']server-only["']/);
    expect(readFileSync("src/lib/supabase/supabaseFunction.ts", "utf8")).toMatch(/import ["']server-only["']/);
    expect(readFileSync("src/app/search/SearchClient.tsx", "utf8")).not.toMatch("supabase");
    expect(readFileSync("src/app/videos/[id]/VideoDetail.tsx", "utf8")).not.toMatch("supabase");
    expect(readFileSync("src/components/admin/AdminDashboard.tsx", "utf8")).not.toMatch(
      "@/lib/supabase/registerSupabaseFunction"
    );
  });

  test("eslint は Next 16 で、webpack の node fallback は無い", () => {
    expect(readFileSync("package.json", "utf8")).toMatch(/"eslint-config-next": "\^16/);
    expect(readFileSync("next.config.mjs", "utf8")).not.toMatch("fallback");
  });

  test("CSS は Geist 変数を使い Arial を置かない", () => {
    expect(readFileSync("src/app/layout.tsx", "utf8")).toMatch('next/font/google');
    expect(readFileSync("src/app/globals.css", "utf8")).toMatch("var(--font-sans)");
    expect(readFileSync("src/app/globals.css", "utf8")).not.toMatch("Arial");
  });
});
