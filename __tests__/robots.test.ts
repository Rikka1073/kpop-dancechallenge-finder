import robots from "@/app/robots";
import { describe, expect, test } from "vitest";

describe("robots", () => {
  test("sitemap を指し admin を disallow する", () => {
    const result = robots();
    expect(result.sitemap).toBe("https://seekpop.jp/sitemap.xml");
    expect(result.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    });
  });
});
