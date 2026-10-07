import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { extractCandidateDrafts } from "@/lib/extraction/extractCandidateDrafts";
import { writeCandidateDraftFile } from "@/lib/extraction/writeCandidateDrafts";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("extractCandidateDrafts", () => {
  test("グループが空なら YouTube を呼ばない", async () => {
    const fetchImpl = vi.fn();
    await expect(
      extractCandidateDrafts({ groups: [], linearIssue: "MAS-19" }, { apiKey: "test-key", fetchImpl })
    ).rejects.toThrow("抽出対象のグループが空です");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test("検索結果を pending / official null のドラフトにする", async () => {
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
        linearIssue: "MAS-19",
        extractedAt: "2026-10-06T00:00:00.000Z",
        queries: ["{group} dance challenge shorts"],
      },
      { apiKey: "test-key", fetchImpl }
    );

    expect(file.linearIssue).toBe("MAS-19");
    expect(file.candidates).toHaveLength(1);
    expect(file.candidates[0]).toMatchObject({
      youtubeId: "abcdefghijk",
      url: "https://www.youtube.com/shorts/abcdefghijk",
      status: "pending",
      official: null,
      suggestedGroups: ["IVE"],
      suggestedSong: null,
    });
    expect(file.candidates[0].officialGuess).toBe(true);
  });

  test("同じ動画はクエリが重なっても1件にする", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/search")) {
        return new Response(
          JSON.stringify({
            items: [{ id: { videoId: "abcdefghijk" }, snippet: { title: "x", channelTitle: "IVE", publishedAt: "2026-10-01T00:00:00Z" } }],
          })
        );
      }

      return new Response(
        JSON.stringify({
          items: [
            {
              id: "abcdefghijk",
              snippet: { title: "x", channelTitle: "IVE", publishedAt: "2026-10-01T00:00:00Z" },
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
        linearIssue: "MAS-19",
        queries: ["{group} a", "{group} b"],
      },
      { apiKey: "test-key", fetchImpl }
    );

    expect(file.candidates).toHaveLength(1);
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
                snippet: { title: "IVE dance challenge", channelTitle: "IVE", publishedAt: "2026-10-01T00:00:00Z" },
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
              snippet: { title: "IVE dance challenge", channelTitle: "IVE", publishedAt: "2026-10-01T00:00:00Z" },
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
