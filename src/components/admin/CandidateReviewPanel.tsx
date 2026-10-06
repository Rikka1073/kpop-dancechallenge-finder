"use client";

import { useMemo, useState } from "react";
import { Check, Download, Search, X, Youtube } from "lucide-react";
import {
  applyCandidateReview,
  parseCandidateDraftFileJson,
  type CandidateDraft,
  type CandidateDraftFile,
  type CandidateStatus,
} from "@/lib/extraction/candidateDraft";
import formatViewCount from "@/lib/formatViewCount";

type StatusFilter = CandidateStatus | "all";

const STATUS_LABEL: Record<CandidateStatus, string> = {
  pending: "未判定",
  approved: "承認",
  rejected: "却下",
};

function readFileAsText(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("ファイルを読めません"));
    reader.readAsText(file);
  });
}

const CandidateReviewPanel = () => {
  const [draft, setDraft] = useState<CandidateDraftFile | null>(null);
  const [paste, setPaste] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

  const counts = useMemo(() => {
    const candidates = draft?.candidates ?? [];
    return {
      all: candidates.length,
      pending: candidates.filter((candidate) => candidate.status === "pending").length,
      approved: candidates.filter((candidate) => candidate.status === "approved").length,
      rejected: candidates.filter((candidate) => candidate.status === "rejected").length,
    };
  }, [draft]);

  const visible = useMemo(() => {
    if (!draft) return [];
    const keyword = query.trim().toLowerCase();
    return draft.candidates.filter((candidate) => {
      if (statusFilter !== "all" && candidate.status !== statusFilter) return false;
      if (!keyword) return true;
      return (
        candidate.title.toLowerCase().includes(keyword) ||
        candidate.channelTitle.toLowerCase().includes(keyword) ||
        candidate.suggestedGroups.some((group) => group.toLowerCase().includes(keyword)) ||
        (candidate.suggestedSong || "").toLowerCase().includes(keyword)
      );
    });
  }, [draft, query, statusFilter]);

  const loadFromText = (text: string, source: string) => {
    try {
      const parsed = parseCandidateDraftFileJson(text);
      setDraft(parsed);
      setStatusFilter("pending");
      setError("");
      setMessage(
        `${parsed.candidates.length}件の候補を読み込みました（${source}）。判定は画面上のドラフトだけです。DBには入れません。`
      );
    } catch (err) {
      setDraft(null);
      setMessage("");
      setError(err instanceof Error ? err.message : "読み込みに失敗しました");
    }
  };

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      loadFromText(await readFileAsText(file), file.name);
    } catch (err) {
      setDraft(null);
      setMessage("");
      setError(err instanceof Error ? err.message : "ファイルを読めません");
    }
  };

  const review = (youtubeId: string, decision: "approved" | "rejected") => {
    setDraft((current) => {
      if (!current) return current;
      return {
        ...current,
        candidates: current.candidates.map((candidate) =>
          candidate.youtubeId === youtubeId ? applyCandidateReview(candidate, decision) : candidate
        ),
      };
    });
    setError("");
    setMessage(
      decision === "approved"
        ? "承認をドラフトに書きました。DBには入れていません。"
        : "却下をドラフトに書きました。DBには入れていません。"
    );
  };

  const downloadReviewed = () => {
    if (!draft) return;
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "candidate-drafts.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("判定済みJSONをダウンロードしました。公開サイトとDBには反映していません。");
  };

  return (
    <div>
      <div className="mb-6 rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-xl font-bold">候補JSONを読み込む</h2>
        <p className="mb-4 text-sm text-gray-600">
          この JSON は同じリポジトリの抽出コマンド（
          <code>npm run extract:candidates</code>
          ）が手元の <code>data/raw/</code> に書きます。別システムはありません。Cloudflare Pages
          からそのファイルは読めないので、ここで開いて判定します。承認しても DB には入れません。
        </p>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
          <label className="btn rounded-2xl bg-purple-50 text-purple-700">
            JSONファイルを選ぶ
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              aria-label="candidate-drafts.json を選ぶ"
              onChange={onFile}
            />
          </label>
          <button type="button" className="btn rounded-2xl" onClick={() => loadFromText(paste, "貼り付け")}>
            貼り付けを読み込む
          </button>
        </div>
        <textarea
          value={paste}
          onChange={(event) => setPaste(event.target.value)}
          placeholder='{"extractedAt":"...","linearIssue":"MAS-19","queryNotes":"","candidates":[...]}'
          className="textarea h-36 w-full font-mono text-sm"
          aria-label="候補JSONを貼り付け"
        />
      </div>

      {message && <p className="mb-4 rounded-xl bg-green-50 p-3 text-green-700">{message}</p>}
      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-red-600">{error}</p>}

      {draft && (
        <div className="mb-4 rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-gray-500">Linear {draft.linearIssue}</p>
              <p className="font-bold">抽出 {draft.extractedAt}</p>
              {draft.queryNotes && <p className="mt-1 text-sm text-gray-600">{draft.queryNotes}</p>}
              <p className="mt-2 text-sm" data-testid="candidate-counts">
                未判定 {counts.pending} / 承認 {counts.approved} / 却下 {counts.rejected} / 全{counts.all}件
              </p>
            </div>
            <button type="button" className="btn rounded-2xl bg-purple-50 text-purple-700" onClick={downloadReviewed}>
              <Download className="h-4 w-4" />
              判定済みJSONをダウンロード
            </button>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative md:flex-1">
              <Search className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="タイトル・チャンネル・グループで絞る"
                className="input w-full pl-10"
                aria-label="候補を検索"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="select md:w-48"
              aria-label="判定で絞る"
            >
              <option value="pending">未判定</option>
              <option value="all">すべて</option>
              <option value="approved">承認</option>
              <option value="rejected">却下</option>
            </select>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {visible.map((candidate) => (
          <CandidateCard key={candidate.youtubeId} candidate={candidate} onReview={review} />
        ))}
        {draft && visible.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-gray-500">該当する候補はありません</p>
        )}
      </div>
    </div>
  );
};

const CandidateCard = ({
  candidate,
  onReview,
}: {
  candidate: CandidateDraft;
  onReview: (youtubeId: string, decision: "approved" | "rejected") => void;
}) => {
  const published = candidate.publishedAt.slice(0, 10);

  return (
    <article className="rounded-3xl bg-white p-4 shadow-md" data-testid={`candidate-${candidate.youtubeId}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={`badge ${statusBadgeClass(candidate.status)}`}>{STATUS_LABEL[candidate.status]}</span>
        <span
          className={`badge border-none ${
            candidate.officialGuess ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          {candidate.officialGuess ? "公式の可能性（推測）" : "公式ではなさそう（推測）"}
        </span>
        <span className="text-sm text-gray-500">
          {published} · {formatViewCount(candidate.viewCount)} views
        </span>
      </div>
      <h3 className="mb-1 font-bold">{candidate.title}</h3>
      <p className="mb-3 text-sm text-gray-600">{candidate.channelTitle}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {candidate.suggestedGroups.map((group) => (
          <span key={group} className="badge border-none bg-fuchsia-100 text-purple-600">
            {group}
          </span>
        ))}
        {candidate.suggestedSong && (
          <span className="badge border-none bg-red-100 text-red-600">#{candidate.suggestedSong}</span>
        )}
      </div>
      <p className="mb-4 text-sm text-gray-500">{candidate.officialGuessReason}</p>
      <div className="flex flex-wrap gap-2">
        <a href={candidate.url} target="_blank" rel="noreferrer" className="btn btn-sm rounded-xl">
          <Youtube className="h-4 w-4" />
          YouTube
        </a>
        <button
          type="button"
          className="btn btn-sm rounded-xl bg-green-50 text-green-700"
          onClick={() => onReview(candidate.youtubeId, "approved")}
        >
          <Check className="h-4 w-4" />
          承認
        </button>
        <button
          type="button"
          className="btn btn-sm rounded-xl bg-red-50 text-red-600"
          onClick={() => onReview(candidate.youtubeId, "rejected")}
        >
          <X className="h-4 w-4" />
          却下
        </button>
      </div>
    </article>
  );
};

const statusBadgeClass = (status: CandidateStatus) => {
  if (status === "approved") return "badge-success";
  if (status === "rejected") return "badge-error";
  return "badge-warning";
};

export default CandidateReviewPanel;
