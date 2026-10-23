import { describe, expect, test } from "vitest";
import {
  applyCandidateReview,
  applyCandidateReviews,
  assertCandidateDraft,
  createPendingCandidate,
  decidedYoutubeIds,
  listReviewUrls,
  mergeDecidedCandidates,
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

  test("却下と承認の youtubeId を再抽出対象から外す", () => {
    const rejected = applyCandidateReview({ ...pending, youtubeId: "rejected0001" }, "rejected");
    const approved = applyCandidateReview({ ...pending, youtubeId: "approved0001" }, "approved");
    const ids = decidedYoutubeIds([
      {
        extractedAt: "2026-10-23T00:00:00.000Z",
        linearIssue: "MAS-54",
        queryNotes: "test",
        candidates: [pending, rejected, approved],
      },
    ]);

    expect(ids).toEqual(new Set(["rejected0001", "approved0001"]));
    expect(ids.has(pending.youtubeId)).toBe(false);
  });

  test("同じ日付へ書くときは却下・承認を残す", () => {
    const rejected = applyCandidateReview(pending, "rejected");
    const incomingPending = createPendingCandidate({
      ...pending,
      youtubeId: "newvideo0001",
      url: "https://www.youtube.com/shorts/newvideo0001",
    });
    const merged = mergeDecidedCandidates(
      {
        extractedAt: "2026-10-23T00:00:00.000Z",
        linearIssue: "MAS-52",
        queryNotes: "old",
        candidates: [rejected, pending],
      },
      {
        extractedAt: "2026-10-23T01:00:00.000Z",
        linearIssue: "MAS-54",
        queryNotes: "new",
        candidates: [incomingPending, createPendingCandidate(pending)],
      }
    );

    expect(merged.candidates.map((candidate) => candidate.youtubeId)).toEqual(["abcdefghijk", "newvideo0001"]);
    expect(merged.candidates[0].status).toBe("rejected");
    expect(merged.candidates[1].status).toBe("pending");
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
