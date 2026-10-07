import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { createPendingCandidate } from "@/lib/extraction/candidateDraft";
import {
  assertDraftDate,
  loadCandidateDraftBundle,
  saveCandidateDraftFile,
} from "@/lib/extraction/localCandidateDrafts";
import { writeCandidateDraftFile } from "@/lib/extraction/writeCandidateDrafts";

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

const draft = {
  extractedAt: "2026-10-06T00:00:00.000Z",
  linearIssue: "MAS-19",
  queryNotes: "test",
  candidates: [pending],
};

describe("localCandidateDrafts", () => {
  test("日付は YYYY-MM-DD だけ", () => {
    expect(assertDraftDate("2026-10-06")).toBe("2026-10-06");
    expect(() => assertDraftDate("../secret")).toThrow("日付は YYYY-MM-DD です");
  });

  test("最新の candidate-drafts.json を開き、判定を同じファイルへ書き戻す", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "seekpop-drafts-"));
    await writeCandidateDraftFile(draft, "2026-10-01", root);
    await writeCandidateDraftFile(draft, "2026-10-06", root);

    const loaded = await loadCandidateDraftBundle(undefined, root);
    expect(loaded.date).toBe("2026-10-06");
    expect(loaded.dates).toEqual(["2026-10-06", "2026-10-01"]);
    expect(loaded.draft.candidates[0].status).toBe("pending");

    const reviewed = {
      ...loaded.draft,
      candidates: [{ ...loaded.draft.candidates[0], status: "approved" as const, official: true as const }],
    };
    const saved = await saveCandidateDraftFile("2026-10-06", reviewed, root);
    expect(saved.draft.candidates[0].status).toBe("approved");
    expect(saved.draft.candidates[0].official).toBe(true);

    const older = await loadCandidateDraftBundle("2026-10-01", root);
    expect(older.draft.candidates[0].status).toBe("pending");
  });

  test("JSON が無いときは抽出コマンドを案内する", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "seekpop-empty-"));
    await expect(loadCandidateDraftBundle(undefined, root)).rejects.toThrow("extract:candidates");
  });

  test("壊れた JSON は開かない", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "seekpop-bad-"));
    const dir = path.join(root, "2026-10-06");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "candidate-drafts.json"), "{", "utf8");
    await expect(loadCandidateDraftBundle("2026-10-06", root)).rejects.toThrow("JSON として読めません");
  });
});
