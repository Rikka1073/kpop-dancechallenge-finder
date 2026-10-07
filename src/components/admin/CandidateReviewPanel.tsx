"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Search, X, Youtube } from "lucide-react";
import { adminRequest } from "@/lib/admin/client";
import {
  applyCandidateReview,
  type CandidateDraft,
  type CandidateDraftBundle,
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

const CandidateReviewPanel = () => {
  const [bundle, setBundle] = useState<CandidateDraftBundle | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const draft = bundle?.draft ?? null;

  const load = useCallback(async (date?: string) => {
    setLoading(true);
    try {
      const path = date ? `/api/admin/candidates?date=${encodeURIComponent(date)}` : "/api/admin/candidates";
      const next = await adminRequest<CandidateDraftBundle>(path);
      setBundle(next);
      setStatusFilter("pending");
      setError("");
      setMessage(
        `${next.draft.candidates.length}件を ${next.path} から開きました。判定はこのファイルへ書き戻します。DBには入れません。`
      );
    } catch (err) {
      setBundle(null);
      setMessage("");
      setError(err instanceof Error ? err.message : "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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

  const review = async (youtubeId: string, decision: "approved" | "rejected") => {
    if (!bundle || saving) return;

    const nextDraft: CandidateDraftFile = {
      ...bundle.draft,
      candidates: bundle.draft.candidates.map((candidate) =>
        candidate.youtubeId === youtubeId ? applyCandidateReview(candidate, decision) : candidate
      ),
    };
    const nextBundle = { ...bundle, draft: nextDraft };
    setBundle(nextBundle);
    setSaving(true);
    setError("");

    try {
      const saved = await adminRequest<CandidateDraftBundle>("/api/admin/candidates", {
        method: "PUT",
        body: JSON.stringify({ date: bundle.date, draft: nextDraft }),
      });
      setBundle(saved);
      setMessage(
        decision === "approved"
          ? "承認を JSON に書き戻しました。DBには入れていません。"
          : "却下を JSON に書き戻しました。DBには入れていません。"
      );
    } catch (err) {
      setBundle(bundle);
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-xl font-bold">候補一覧</h2>
        <p className="mb-4 text-sm text-gray-600">
          同じリポジトリの <code>npm run extract:candidates</code> が手元の <code>data/raw/</code> に書いた JSON
          を開きます。承認・却下はそのファイルへ保存します。ダウンロードや貼り付けはしません。
        </p>
        {bundle && bundle.dates.length > 0 && (
          <label className="flex flex-col gap-2 text-sm text-gray-600 md:flex-row md:items-center">
            抽出日
            <select
              value={bundle.date}
              onChange={(event) => void load(event.target.value)}
              className="select md:w-56"
              aria-label="抽出日"
              disabled={loading || saving}
            >
              {bundle.dates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {loading && (
        <div className="mb-4 flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
      {message && <p className="mb-4 rounded-xl bg-green-50 p-3 text-green-700">{message}</p>}
      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-red-600">{error}</p>}

      {draft && bundle && (
        <div className="mb-4 rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Linear {draft.linearIssue}</p>
            <p className="font-bold">抽出 {draft.extractedAt}</p>
            <p className="mt-1 font-mono text-sm text-gray-600">{bundle.path}</p>
            {draft.queryNotes && <p className="mt-1 text-sm text-gray-600">{draft.queryNotes}</p>}
            <p className="mt-2 text-sm" data-testid="candidate-counts">
              未判定 {counts.pending} / 承認 {counts.approved} / 却下 {counts.rejected} / 全{counts.all}件
            </p>
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
          <CandidateCard key={candidate.youtubeId} candidate={candidate} saving={saving} onReview={review} />
        ))}
        {draft && visible.length === 0 && !loading && (
          <p className="rounded-2xl bg-white p-6 text-center text-gray-500">該当する候補はありません</p>
        )}
      </div>
    </div>
  );
};

const CandidateCard = ({
  candidate,
  saving,
  onReview,
}: {
  candidate: CandidateDraft;
  saving: boolean;
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
          disabled={saving}
          onClick={() => onReview(candidate.youtubeId, "approved")}
        >
          <Check className="h-4 w-4" />
          承認
        </button>
        <button
          type="button"
          className="btn btn-sm rounded-xl bg-red-50 text-red-600"
          disabled={saving}
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
