import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import CandidateReviewPanel from "@/components/admin/CandidateReviewPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { createPendingCandidate } from "@/lib/extraction/candidateDraft";

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

const draftJson = JSON.stringify(
  {
    extractedAt: "2026-10-06T00:00:00.000Z",
    linearIssue: "MAS-19",
    queryNotes: "週次テスト",
    candidates: [pending, other],
  },
  null,
  2
);

const loadDraft = () => {
  fireEvent.change(screen.getByLabelText("候補JSONを貼り付け"), { target: { value: draftJson } });
  fireEvent.click(screen.getByRole("button", { name: "貼り付けを読み込む" }));
};

function readBlobText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("blob read failed"));
    reader.readAsText(blob);
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("CandidateReviewPanel", () => {
  test("壊れた JSON は一覧に出さずエラーにする", () => {
    render(<CandidateReviewPanel />);
    fireEvent.change(screen.getByLabelText("候補JSONを貼り付け"), { target: { value: "{" } });
    fireEvent.click(screen.getByRole("button", { name: "貼り付けを読み込む" }));
    expect(screen.getByText("JSON として読めません")).toBeInTheDocument();
    expect(screen.queryByText("IVE ELEVEN Dance Challenge")).not.toBeInTheDocument();
  });

  test("タイトル・チャンネル・グループ・公式推測・YouTubeリンクを一覧する", () => {
    render(<CandidateReviewPanel />);
    loadDraft();

    const first = screen.getByTestId("candidate-abcdefghijk");
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
  });

  test("承認と却下は画面上のドラフトだけ。JSONダウンロードに書く", async () => {
    const createObjectURL = vi.fn(() => "blob:candidate-draft");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

    render(<CandidateReviewPanel />);
    loadDraft();

    fireEvent.click(within(screen.getByTestId("candidate-abcdefghijk")).getByRole("button", { name: "承認" }));
    expect(screen.getByText("承認をドラフトに書きました。DBには入れていません。")).toBeInTheDocument();
    expect(screen.queryByTestId("candidate-abcdefghijk")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("判定で絞る"), { target: { value: "all" } });
    expect(
      within(screen.getByTestId("candidate-abcdefghijk")).getByText("承認", { selector: ".badge" })
    ).toBeInTheDocument();

    fireEvent.click(within(screen.getByTestId("candidate-lmnopqrstuv")).getByRole("button", { name: "却下" }));
    fireEvent.click(screen.getByRole("button", { name: "判定済みJSONをダウンロード" }));

    expect(click).toHaveBeenCalled();
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    const reviewed = JSON.parse(await readBlobText(blob));
    expect(reviewed.candidates[0].status).toBe("approved");
    expect(reviewed.candidates[0].official).toBe(true);
    expect(reviewed.candidates[1].status).toBe("rejected");
    expect(reviewed.candidates[1].official).toBeNull();
  });

  test("JSONファイルからも同じ一覧を開ける", async () => {
    render(<CandidateReviewPanel />);
    const file = new File([draftJson], "candidate-drafts.json", { type: "application/json" });
    const input = screen.getByLabelText("candidate-drafts.json を選ぶ") as HTMLInputElement;
    Object.defineProperty(input, "files", { configurable: true, value: [file] });
    fireEvent.change(input);

    expect(await screen.findByText("IVE ELEVEN Dance Challenge")).toBeInTheDocument();
    expect(
      screen.getByText("2件の候補を読み込みました（candidate-drafts.json）。", { exact: false })
    ).toBeInTheDocument();
  });
});

describe("AdminDashboard 候補一覧タブ", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo) => {
        const url = String(input);
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
    expect(screen.getByRole("heading", { name: "候補JSONを読み込む" })).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalled());
  });
});
