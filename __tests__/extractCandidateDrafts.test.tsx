import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { extractCandidateDrafts, monthsAgoIso, parsePublishedAfter } from "@/lib/extraction/extractCandidateDrafts";
import { writeCandidateDraftFile } from "@/lib/extraction/writeCandidateDrafts";

const originalFetch = global.fetch;

const IVE_CHANNEL = "UCxxxxxxxxxxxxxxxxxxxxxx";
const officialGroups = [{ id: "group-ive", group_name: "IVE", youtube_channel_id: IVE_CHANNEL }];

function youtubeJsonResponse(pathname: string, fetchImpl: ReturnType<typeof vi.fn>) {
  return fetchImpl.mock.calls.map(([input]) => new URL(String(input))).filter((url) => url.pathname.endsWith(pathname));
}

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("extractCandidateDrafts", () => {
  test("グループが空なら YouTube を呼ばない", async () => {
    const fetchImpl = vi.fn();
    await expect(
      extractCandidateDrafts(
        { groups: [], officialGroups, linearIssue: "MAS-19" },
        { apiKey: "test-key", fetchImpl }
      )
    ).rejects.toThrow("抽出対象のグループが空です");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test("公式チャンネル未保存のグループは取らない", async () => {
    const fetchImpl = vi.fn();
    await expect(
      extractCandidateDrafts(
        {
          groups: ["IVE"],
          officialGroups: [{ id: "group-ive", group_name: "IVE", youtube_channel_id: null }],
          linearIssue: "MAS-19",
        },
        { apiKey: "test-key", fetchImpl }
      )
    ).rejects.toThrow("IVE の確認済み公式チャンネルがありません");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test("検索は確認済み公式チャンネルに限定する", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/search")) {
        return new Response(
          JSON.stringify({
            items: [
              {
                id: { videoId: "abcdefghijk" },
                snippet: {
                  title: "IVE dance challenge",
                  channelId: IVE_CHANNEL,
                  channelTitle: "IVE",
                  publishedAt: "2026-10-01T00:00:00Z",
                },
              },
            ],
          })
        );
      }

      return new Response(
        JSON.stringify({
          items: [
            {
              id: "abcdefghijk",
              snippet: {
                title: "IVE dance challenge",
                channelId: IVE_CHANNEL,
                channelTitle: "IVE",
                publishedAt: "2026-10-01T00:00:00Z",
              },
              statistics: { viewCount: "123" },
              contentDetails: { duration: "PT20S" },
            },
          ],
        })
      );
    });

    const file = await extractCandidateDrafts(
      {
        groups: ["IVE"],
        officialGroups,
        linearIssue: "MAS-19",
        extractedAt: "2026-10-06T00:00:00.000Z",
        queries: ["{group} dance challenge shorts"],
      },
      { apiKey: "test-key", fetchImpl }
    );

    const searchUrls = youtubeJsonResponse("/search", fetchImpl);
    expect(searchUrls).toHaveLength(1);
    expect(searchUrls[0].searchParams.get("channelId")).toBe(IVE_CHANNEL);
    expect(searchUrls[0].searchParams.get("publishedAfter")).toBe("2026-09-06T00:00:00.000Z");
    expect(searchUrls[0].searchParams.get("order")).toBe("date");
    expect(file.queryNotes).toContain("since 2026-09-06T00:00:00.000Z");

    expect(file.linearIssue).toBe("MAS-19");
    expect(file.candidates).toHaveLength(1);
    expect(file.candidates[0]).toMatchObject({
      youtubeId: "abcdefghijk",
      url: "https://www.youtube.com/shorts/abcdefghijk",
      status: "pending",
      official: null,
      suggestedGroups: ["IVE"],
      suggestedSong: null,
      officialGuess: true,
    });
    expect(file.candidates[0].officialGuessReason).toContain("確認済み公式チャンネル");
  });

  test("公式チャンネル以外の動画は捨てる", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/search")) {
        return new Response(
          JSON.stringify({
            items: [{ id: { videoId: "fanvideo0001" }, snippet: { title: "cover", channelId: "UCfan", channelTitle: "fan" } }],
          })
        );
      }

      return new Response(
        JSON.stringify({
          items: [
            {
              id: "fanvideo0001",
              snippet: {
                title: "cover",
                channelId: "UCyyyyyyyyyyyyyyyyyyyyyy",
                channelTitle: "fan",
                publishedAt: "2026-10-01T00:00:00Z",
              },
              statistics: { viewCount: "9" },
              contentDetails: { duration: "PT15S" },
            },
          ],
        })
      );
    });

    const file = await extractCandidateDrafts(
      {
        groups: ["IVE"],
        officialGroups,
        linearIssue: "MAS-19",
        queries: ["{group} dance challenge shorts"],
      },
      { apiKey: "test-key", fetchImpl }
    );

    expect(file.candidates).toHaveLength(0);
  });

  test("同じ動画はクエリが重なっても1件にする", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/search")) {
        return new Response(
          JSON.stringify({
            items: [
              {
                id: { videoId: "abcdefghijk" },
                snippet: { title: "x", channelId: IVE_CHANNEL, channelTitle: "IVE", publishedAt: "2026-10-01T00:00:00Z" },
              },
            ],
          })
        );
      }

      return new Response(
        JSON.stringify({
          items: [
            {
              id: "abcdefghijk",
              snippet: { title: "x", channelId: IVE_CHANNEL, channelTitle: "IVE", publishedAt: "2026-10-01T00:00:00Z" },
              statistics: { viewCount: "1" },
              contentDetails: { duration: "PT15S" },
            },
          ],
        })
      );
    });

    const file = await extractCandidateDrafts(
      {
        groups: ["IVE"],
        officialGroups,
        linearIssue: "MAS-19",
        queries: ["{group} a", "{group} b"],
      },
      { apiKey: "test-key", fetchImpl }
    );

    expect(file.candidates).toHaveLength(1);
  });

  test("60秒を超える動画は捨てる", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/search")) {
        return new Response(
          JSON.stringify({
            items: [
              {
                id: { videoId: "longvideo001" },
                snippet: {
                  title: "MV",
                  channelId: IVE_CHANNEL,
                  channelTitle: "IVE",
                  publishedAt: "2026-10-01T00:00:00Z",
                },
              },
            ],
          })
        );
      }

      return new Response(
        JSON.stringify({
          items: [
            {
              id: "longvideo001",
              snippet: {
                title: "MV",
                channelId: IVE_CHANNEL,
                channelTitle: "IVE",
                publishedAt: "2026-10-01T00:00:00Z",
              },
              statistics: { viewCount: "9" },
              contentDetails: { duration: "PT2M18S" },
            },
          ],
        })
      );
    });

    const file = await extractCandidateDrafts(
      {
        groups: ["IVE"],
        officialGroups,
        linearIssue: "MAS-53",
        queries: ["{group} dance challenge shorts"],
      },
      { apiKey: "test-key", fetchImpl }
    );

    expect(file.candidates).toHaveLength(0);
  });

  test("直近1ヶ月より古い動画は捨てる", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/search")) {
        return new Response(
          JSON.stringify({
            items: [
              {
                id: { videoId: "oldvideo0001" },
                snippet: {
                  title: "old",
                  channelId: IVE_CHANNEL,
                  channelTitle: "IVE",
                  publishedAt: "2026-08-01T00:00:00Z",
                },
              },
            ],
          })
        );
      }

      return new Response(
        JSON.stringify({
          items: [
            {
              id: "oldvideo0001",
              snippet: {
                title: "old",
                channelId: IVE_CHANNEL,
                channelTitle: "IVE",
                publishedAt: "2026-08-01T00:00:00Z",
              },
              statistics: { viewCount: "9" },
              contentDetails: { duration: "PT15S" },
            },
          ],
        })
      );
    });

    const file = await extractCandidateDrafts(
      {
        groups: ["IVE"],
        officialGroups,
        linearIssue: "MAS-51",
        extractedAt: "2026-10-23T00:00:00.000Z",
        queries: ["{group} dance challenge shorts"],
      },
      { apiKey: "test-key", fetchImpl }
    );

    expect(file.candidates).toHaveLength(0);
  });
});

describe("monthsAgoIso", () => {
  test("抽出日から1ヶ月前の ISO にする", () => {
    expect(monthsAgoIso("2026-10-23T00:00:00.000Z")).toBe("2026-09-23T00:00:00.000Z");
  });

  test("日付だけならその日の 0時 UTC にする", () => {
    expect(parsePublishedAfter("2026-09-01")).toBe("2026-09-01T00:00:00.000Z");
  });
});

describe("writeCandidateDraftFile", () => {
  test("git 管理外の data/raw 配下に書く", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "seekpop-drafts-"));
    const fetchImpl = async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/search")) {
        return new Response(
          JSON.stringify({
            items: [
              {
                id: { videoId: "abcdefghijk" },
                snippet: {
                  title: "IVE dance challenge",
                  channelId: IVE_CHANNEL,
                  channelTitle: "IVE",
                  publishedAt: "2026-10-01T00:00:00Z",
                },
              },
            ],
          })
        );
      }
      return new Response(
        JSON.stringify({
          items: [
            {
              id: "abcdefghijk",
              snippet: {
                title: "IVE dance challenge",
                channelId: IVE_CHANNEL,
                channelTitle: "IVE",
                publishedAt: "2026-10-01T00:00:00Z",
              },
              statistics: { viewCount: "1" },
              contentDetails: { duration: "PT20S" },
            },
          ],
        })
      );
    };

    const written = await extractCandidateDrafts(
      {
        groups: ["IVE"],
        officialGroups,
        linearIssue: "MAS-19",
        extractedAt: "2026-10-06T00:00:00.000Z",
        queries: ["{group} dance challenge shorts"],
      },
      { apiKey: "test-key", fetchImpl }
    );

    const draftPath = await writeCandidateDraftFile(written, "2026-10-06", root);
    expect(draftPath).toBe(path.join(root, "2026-10-06", "candidate-drafts.json"));
    const saved = JSON.parse(await readFile(draftPath, "utf8"));
    expect(saved.candidates[0].official).toBeNull();
    expect(saved.candidates[0].status).toBe("pending");
  });
});
