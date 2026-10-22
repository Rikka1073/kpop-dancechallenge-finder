import { absoluteUrl, videoJsonLd } from "@/lib/seo/site";
import { describe, expect, test } from "vitest";

describe("seo helpers", () => {
  test("absoluteUrl は公開ドメインを付ける", () => {
    expect(absoluteUrl()).toBe("https://seekpop.jp");
    expect(absoluteUrl("/search")).toBe("https://seekpop.jp/search");
  });

  test("VideoObject JSON-LD を組む", () => {
    expect(
      videoJsonLd({
        id: "video-1",
        title: "公式ダンスチャレンジ",
        thumbnail_url: "https://example.com/thumb.jpg",
        youtube_id: "yt-abc",
        view_count: 1200,
      }),
    ).toMatchObject({
      "@type": "VideoObject",
      name: "公式ダンスチャレンジ",
      url: "https://seekpop.jp/videos/video-1",
      embedUrl: "https://www.youtube.com/embed/yt-abc",
    });
  });
});
