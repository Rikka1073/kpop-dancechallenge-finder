import { beforeEach, describe, expect, test, vi } from "vitest";

const getAllVideos = vi.fn();

vi.mock("@/lib/supabase/supabaseFunction", () => ({
  getAllVideos: (...args: unknown[]) => getAllVideos(...args),
}));

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  beforeEach(() => {
    getAllVideos.mockReset();
  });

  test("公開動画の URL が入る", async () => {
    getAllVideos.mockResolvedValue([{ id: "video-1" }, { id: "video-2" }]);

    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://seekpop.jp");
    expect(urls).toContain("https://seekpop.jp/search");
    expect(urls).toContain("https://seekpop.jp/terms");
    expect(urls).toContain("https://seekpop.jp/videos/video-1");
    expect(urls).toContain("https://seekpop.jp/videos/video-2");
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
  });

  test("取得に失敗しても静的ページは出す", async () => {
    getAllVideos.mockRejectedValue(new Error("network"));

    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toEqual(["https://seekpop.jp", "https://seekpop.jp/search", "https://seekpop.jp/terms"]);
  });
});
