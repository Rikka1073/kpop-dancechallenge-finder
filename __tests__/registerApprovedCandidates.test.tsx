import { describe, expect, test, vi } from "vitest";
import { applyCandidateReview, createPendingCandidate } from "@/lib/extraction/candidateDraft";
import {
  registerApprovedCandidate,
  resolveApprovedTags,
} from "@/lib/extraction/registerApprovedCandidates";

const pending = createPendingCandidate({
  youtubeId: "abcdefghijk",
  url: "https://www.youtube.com/shorts/abcdefghijk",
  title: "IVE ELEVEN Dance Challenge",
  channelTitle: "IVE",
  publishedAt: "2026-10-01T00:00:00Z",
  viewCount: 1200,
  suggestedGroups: ["IVE"],
  suggestedSong: "ELEVEN",
  officialGuess: true,
  officialGuessReason: "タイトルがチャレンジに見える。確定ではない。",
});

const catalog = {
  groups: [{ id: "group-ive", group_name: "IVE", youtube_channel_id: "UCxxxxxxxxxxxxxxxxxxxxxx" }],
  songs: [{ id: "song-eleven", song_name: "ELEVEN" }],
};

const snapshot = {
  youtubeId: "abcdefghijk",
  title: "IVE ELEVEN Dance Challenge",
  thumbnailUrl: "https://example.com/thumb.jpg",
  viewCount: 1200,
  channelId: "UCxxxxxxxxxxxxxxxxxxxxxx",
  channelTitle: "IVE",
};

describe("resolveApprovedTags", () => {
  test("公式チャンネルのグループを付け、曲名が一致すれば曲も付ける", () => {
    expect(resolveApprovedTags(snapshot, pending, catalog)).toEqual({
      groupIds: ["group-ive"],
      songIds: ["song-eleven"],
    });
  });

  test("曲が無ければグループだけ。公開検索には出ない", () => {
    expect(resolveApprovedTags(snapshot, { ...pending, suggestedSong: null }, catalog)).toEqual({
      groupIds: ["group-ive"],
      songIds: [],
    });
  });

  test("確認済み公式チャンネルでなければ拒否する", () => {
    expect(() =>
      resolveApprovedTags({ channelId: "UCunknownchannelxxxxxxxxx" }, pending, catalog)
    ).toThrow("確認済みの公式チャンネルの動画ではありません");
  });
});

describe("registerApprovedCandidate", () => {
  test("未登録なら display=false で入れる", async () => {
    const insertVideo = vi.fn(async () => ({ id: "video-1" }));
    const result = await registerApprovedCandidate(applyCandidateReview(pending, "approved"), {
      fetchSnapshot: async () => snapshot,
      groups: catalog.groups,
      songs: catalog.songs,
      findExisting: async () => null,
      insertVideo,
    });

    expect(result).toEqual({ youtubeId: "abcdefghijk", skipped: false });
    expect(insertVideo).toHaveBeenCalledWith(
      {
        id: "abcdefghijk",
        title: "IVE ELEVEN Dance Challenge",
        thumbnailUrl: "https://example.com/thumb.jpg",
        viewCount: 1200,
      },
      ["group-ive"],
      ["song-eleven"]
    );
  });

  test("すでに DB にある youtubeId はタグを上書きしない", async () => {
    const insertVideo = vi.fn();
    const result = await registerApprovedCandidate(applyCandidateReview(pending, "approved"), {
      fetchSnapshot: async () => snapshot,
      groups: catalog.groups,
      songs: catalog.songs,
      findExisting: async () => ({ id: "video-existing" }),
      insertVideo,
    });

    expect(result).toEqual({ youtubeId: "abcdefghijk", skipped: true });
    expect(insertVideo).not.toHaveBeenCalled();
  });
});
