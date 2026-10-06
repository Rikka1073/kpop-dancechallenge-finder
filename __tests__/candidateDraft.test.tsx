import { describe, expect, test } from "vitest";
import {
  applyCandidateReview,
  applyCandidateReviews,
  assertCandidateDraft,
  createPendingCandidate,
  listReviewUrls,
  parseCandidateDraftFileJson,
} from "@/lib/extraction/candidateDraft";
import { guessOfficial } from "@/lib/extraction/guessOfficial";

const pending = createPendingCandidate({
  youtubeId: "abcdefghijk",
  url: "https://www.youtube.com/shorts/abcdefghijk",
  title: "IVE ELEVEN Dance Challenge",
  channelTitle: "IVE",
  publishedAt: "2026-10-01T00:00:00Z",
  viewCount: 12,
  suggestedGroups: ["IVE"],
  suggestedSong: "ELEVEN",
  officialGuess: true,
  officialGuessReason: "公式チャンネルに見える。確定ではない。",
});

describe("candidateDraft", () => {
  test("pending の候補は official が null", () => {
    expect(pending.status).toBe("pending");
    expect(pending.official).toBeNull();
  });

  test("承認前に official true は拒否する", () => {
    expect(() =>
      assertCandidateDraft({
        ...pending,
        official: true,
      })
    ).toThrow("official は人が承認するまで true にできない");
  });

  test("承認した候補だけ official を true にする", () => {
    const approved = applyCandidateReview(pending, "approved");
    expect(approved.status).toBe("approved");
    expect(approved.official).toBe(true);

    const rejected = applyCandidateReview(pending, "rejected");
    expect(rejected.status).toBe("rejected");
    expect(rejected.official).toBeNull();
  });

  test("人が開く URL は pending だけ", () => {
    const file = {
      extractedAt: "2026-10-06T00:00:00.000Z",
      linearIssue: "MAS-19",
      queryNotes: "test",
      candidates: [pending, applyCandidateReview(pending, "approved")],
    };

    expect(listReviewUrls(file)).toEqual([pending.url]);
  });

  test("youtubeId ごとの判定をドラフトにだけ書く。DB には触らない", () => {
    const file = {
      extractedAt: "2026-10-06T00:00:00.000Z",
      linearIssue: "MAS-19",
      queryNotes: "test",
      candidates: [pending],
    };

    const reviewed = applyCandidateReviews(file, { abcdefghijk: "approved" });
    expect(reviewed.candidates[0].official).toBe(true);
    expect(file.candidates[0].official).toBeNull();
  });

  test("貼り付け用の JSON 文字列を検証する", () => {
    const json = JSON.stringify({
      extractedAt: "2026-10-06T00:00:00.000Z",
      linearIssue: "MAS-19",
      queryNotes: "test",
      candidates: [pending],
    });

    expect(parseCandidateDraftFileJson(json).candidates).toHaveLength(1);
    expect(() => parseCandidateDraftFileJson("{")).toThrow("JSON として読めません");
    expect(() => parseCandidateDraftFileJson("{}")).toThrow("候補ドラフトの形式が不正です");
  });
});

describe("guessOfficial", () => {
  test("グループ名とチャレンジが揃うと推測 true。確定ではない", () => {
    const guess = guessOfficial({
      title: "ELEVEN dance challenge",
      channelTitle: "IVE",
      suggestedGroups: ["IVE"],
    });
    expect(guess.officialGuess).toBe(true);
    expect(guess.officialGuessReason).toContain("確定ではない");
  });

  test("手がかりが無いときは false", () => {
    const guess = guessOfficial({
      title: "cover practice",
      channelTitle: "random channel",
      suggestedGroups: ["IVE"],
    });
    expect(guess.officialGuess).toBe(false);
  });
});
