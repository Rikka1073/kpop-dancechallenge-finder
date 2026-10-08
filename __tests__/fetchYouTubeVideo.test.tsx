import { afterEach, describe, expect, test, vi } from "vitest";
import { fetchYouTubeVideoSnapshot } from "@/lib/youtube/fetchYouTubeVideo";

const originalKey = process.env.YOUTUBE_API_KEY;
const originalFetch = global.fetch;

afterEach(() => {
  process.env.YOUTUBE_API_KEY = originalKey;
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("fetchYouTubeVideoSnapshot", () => {
  test("channelIdを返す。公式判定はしない", async () => {
    process.env.YOUTUBE_API_KEY = "test-key";
    global.fetch = vi.fn(async () =>
      new Response(
        JSON.stringify({
          items: [
            {
              id: "abcdefghijk",
              snippet: {
                title: "IVE dance challenge",
                channelId: "UCxxxxxxxxxxxxxxxxxxxxxx",
                channelTitle: "IVE",
                thumbnails: { high: { url: "https://example.com/thumb.jpg" } },
              },
              statistics: { viewCount: "12" },
            },
          ],
        })
      )
    );

    const snapshot = await fetchYouTubeVideoSnapshot("abcdefghijk");
    expect(snapshot.channelId).toBe("UCxxxxxxxxxxxxxxxxxxxxxx");
    expect(snapshot.channelTitle).toBe("IVE");
    expect(snapshot.youtubeId).toBe("abcdefghijk");
  });
});
