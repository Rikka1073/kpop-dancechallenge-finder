import { afterEach, describe, expect, test, vi } from "vitest";
import { fetchYouTubeChannelSnapshot } from "@/lib/youtube/fetchYouTubeChannel";

const originalKey = process.env.YOUTUBE_API_KEY;

afterEach(() => {
  process.env.YOUTUBE_API_KEY = originalKey;
  vi.restoreAllMocks();
});

describe("fetchYouTubeChannelSnapshot", () => {
  test("ハンドルからchannelIdを取る。公式とは書かない", async () => {
    process.env.YOUTUBE_API_KEY = "test-key";
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      expect(url.searchParams.get("forHandle")).toBe("@IVEstarship");
      expect(url.searchParams.get("id")).toBeNull();
      return new Response(
        JSON.stringify({
          items: [{ id: "UCxxxxxxxxxxxxxxxxxxxxxx", snippet: { title: "IVE" } }],
        })
      );
    });

    const snapshot = await fetchYouTubeChannelSnapshot("@IVEstarship", fetchImpl);
    expect(snapshot).toEqual({ channelId: "UCxxxxxxxxxxxxxxxxxxxxxx", title: "IVE" });
  });

  test("見つからないときは保存できない", async () => {
    process.env.YOUTUBE_API_KEY = "test-key";
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ items: [] })));
    await expect(fetchYouTubeChannelSnapshot("@nobody", fetchImpl)).rejects.toThrow(
      "指定されたチャンネルが見つかりませんでした"
    );
  });
});
