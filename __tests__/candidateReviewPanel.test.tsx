import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import CandidateReviewPanel from "@/components/admin/CandidateReviewPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { applyCandidateReview, createPendingCandidate } from "@/lib/extraction/candidateDraft";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

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
  officialGuessReason: "公式チャンネルに見える。確定ではない。",
});

const other = createPendingCandidate({
  youtubeId: "lmnopqrstuv",
  url: "https://www.youtube.com/watch?v=lmnopqrstuv",
  title: "random cover practice",
  channelTitle: "fan channel",
  publishedAt: "2026-10-02T00:00:00Z",
  viewCount: 80,
  suggestedGroups: ["NewJeans"],
  suggestedSong: null,
  officialGuess: false,
  officialGuessReason: "手がかりが少ない。確定ではない。",
});

const draft = {
  extractedAt: "2026-10-06T00:00:00.000Z",
  linearIssue: "MAS-19",
  queryNotes: "週次テスト",
  candidates: [pending, other],
};

const bundle = {
  dates: ["2026-10-06"],
  date: "2026-10-06",
  path: "data/raw/2026-10-06/candidate-drafts.json",
  draft,
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("CandidateReviewPanel", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo, init?: RequestInit) => {
        const url = String(input);
        if (url.includes("/api/admin/candidates") && init?.method === "PUT") {
          const body = JSON.parse(String(init.body)) as { draft: typeof draft };
          return {
            ok: true,
            json: async () => ({
              ok: true,
              data: { ...bundle, draft: body.draft },
            }),
          } as Response;
        }
        if (url.includes("/api/admin/candidates")) {
          return { ok: true, json: async () => ({ ok: true, data: bundle }) } as Response;
        }
        return { ok: false, json: async () => ({ ok: false, error: "unknown" }) } as Response;
      })
    );
  });

  test("タイトル・チャンネル・グループ・公式推測・YouTubeリンクを一覧する", async () => {
    render(<CandidateReviewPanel />);

    const first = await screen.findByTestId("candidate-abcdefghijk");
    expect(within(first).getByRole("heading", { name: "IVE ELEVEN Dance Challenge" })).toBeInTheDocument();
    expect(within(first).getByText("IVE", { selector: "p" })).toBeInTheDocument();
    expect(within(first).getByText("公式の可能性（推測）")).toBeInTheDocument();
    expect(within(first).getByText("公式チャンネルに見える。確定ではない。")).toBeInTheDocument();
    expect(within(first).getByRole("link", { name: "YouTube" })).toHaveAttribute(
      "href",
      "https://www.youtube.com/shorts/abcdefghijk"
    );

    const second = screen.getByTestId("candidate-lmnopqrstuv");
    expect(within(second).getByText("公式ではなさそう（推測）")).toBeInTheDocument();
    expect(within(second).getByText("NewJeans")).toBeInTheDocument();
    expect(screen.getByTestId("candidate-counts")).toHaveTextContent("未判定 2");
    expect(screen.getByText("data/raw/2026-10-06/candidate-drafts.json")).toBeInTheDocument();
  });

  test("承認と却下は同じ JSON へ書き戻す。DB には入れない", async () => {
    render(<CandidateReviewPanel />);
    await screen.findByTestId("candidate-abcdefghijk");

    fireEvent.click(within(screen.getByTestId("candidate-abcdefghijk")).getByRole("button", { name: "承認" }));
    expect(await screen.findByText("承認を JSON に書き戻しました。DBには入れていません。")).toBeInTheDocument();
    expect(screen.queryByTestId("candidate-abcdefghijk")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("判定で絞る"), { target: { value: "all" } });
    expect(
      within(screen.getByTestId("candidate-abcdefghijk")).getByText("承認", { selector: ".badge" })
    ).toBeInTheDocument();

    fireEvent.click(within(screen.getByTestId("candidate-lmnopqrstuv")).getByRole("button", { name: "却下" }));
    await screen.findByText("却下を JSON に書き戻しました。DBには入れていません。");

    const puts = vi.mocked(fetch).mock.calls.filter(([, init]) => init?.method === "PUT");
    expect(puts).toHaveLength(2);
    const latest = JSON.parse(String(puts[1][1]?.body));
    expect(latest.date).toBe("2026-10-06");
    expect(latest.draft.candidates[0]).toEqual(applyCandidateReview(pending, "approved"));
    expect(latest.draft.candidates[1]).toEqual(applyCandidateReview(other, "rejected"));
  });

  test("ファイル選択やダウンロードは出さない", async () => {
    render(<CandidateReviewPanel />);
    await screen.findByTestId("candidate-abcdefghijk");
    expect(screen.queryByLabelText("candidate-drafts.json を選ぶ")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "判定済みJSONをダウンロード" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("候補JSONを貼り付け")).not.toBeInTheDocument();
  });
});

describe("AdminDashboard 候補一覧タブ", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo) => {
        const url = String(input);
        if (url.includes("/api/admin/candidates")) {
          return { ok: true, json: async () => ({ ok: true, data: bundle }) } as Response;
        }
        if (url.includes("/api/admin/videos")) {
          return { ok: true, json: async () => ({ ok: true, data: [] }) } as Response;
        }
        return {
          ok: true,
          json: async () => ({ ok: true, data: { groups: [], songs: [] } }),
        } as Response;
      })
    );
  });

  test("管理画面から候補一覧タブを開ける", async () => {
    render(<AdminDashboard />);
    fireEvent.click(screen.getByRole("button", { name: "候補一覧" }));
    expect(await screen.findByRole("heading", { name: "候補一覧" })).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalled());
  });
});
