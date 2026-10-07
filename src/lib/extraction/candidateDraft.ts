export const CANDIDATE_STATUSES = ["pending", "approved", "rejected"] as const;
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];

export type CandidateDraft = {
  youtubeId: string;
  url: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  suggestedGroups: string[];
  suggestedSong: string | null;
  officialGuess: boolean;
  officialGuessReason: string;
  status: CandidateStatus;
  official: true | null;
};

export type CandidateDraftFile = {
  extractedAt: string;
  linearIssue: string;
  queryNotes: string;
  candidates: CandidateDraft[];
};

export type CandidateDraftBundle = {
  dates: string[];
  date: string;
  path: string;
  draft: CandidateDraftFile;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} が空です`);
  }
  return value;
}

function isCandidateStatus(value: unknown): value is CandidateStatus {
  return CANDIDATE_STATUSES.includes(value as CandidateStatus);
}

export function assertCandidateDraft(value: unknown): CandidateDraft {
  if (!isRecord(value)) {
    throw new Error("候補の形式が不正です");
  }

  const suggestedGroups = Array.isArray(value.suggestedGroups)
    ? value.suggestedGroups.filter((group): group is string => typeof group === "string" && Boolean(group.trim()))
    : [];

  if (suggestedGroups.length === 0) {
    throw new Error("suggestedGroups が空です");
  }

  if (typeof value.officialGuess !== "boolean") {
    throw new Error("officialGuess は boolean です");
  }

  if (value.official !== null && value.official !== true) {
    throw new Error("official は null か true です");
  }

  if (!isCandidateStatus(value.status)) {
    throw new Error("status は pending / approved / rejected です");
  }

  if (value.official === true && value.status !== "approved") {
    throw new Error("official は人が承認するまで true にできない");
  }

  const suggestedSong =
    value.suggestedSong === null || value.suggestedSong === undefined
      ? null
      : readString(value.suggestedSong, "suggestedSong");

  return {
    youtubeId: readString(value.youtubeId, "youtubeId"),
    url: readString(value.url, "url"),
    title: readString(value.title, "title"),
    channelTitle: readString(value.channelTitle, "channelTitle"),
    publishedAt: readString(value.publishedAt, "publishedAt"),
    viewCount: typeof value.viewCount === "number" && Number.isFinite(value.viewCount) ? value.viewCount : 0,
    suggestedGroups,
    suggestedSong,
    officialGuess: value.officialGuess,
    officialGuessReason: readString(value.officialGuessReason, "officialGuessReason"),
    status: value.status,
    official: value.official === true ? true : null,
  };
}

export function assertCandidateDraftFile(value: unknown): CandidateDraftFile {
  if (!isRecord(value) || !Array.isArray(value.candidates)) {
    throw new Error("候補ドラフトの形式が不正です");
  }

  return {
    extractedAt: readString(value.extractedAt, "extractedAt"),
    linearIssue: readString(value.linearIssue, "linearIssue"),
    queryNotes: typeof value.queryNotes === "string" ? value.queryNotes : "",
    candidates: value.candidates.map(assertCandidateDraft),
  };
}

export function createPendingCandidate(input: Omit<CandidateDraft, "status" | "official">): CandidateDraft {
  return {
    ...input,
    status: "pending",
    official: null,
  };
}

export function applyCandidateReview(candidate: CandidateDraft, decision: "approved" | "rejected"): CandidateDraft {
  return {
    ...candidate,
    status: decision,
    official: decision === "approved" ? true : null,
  };
}

export function applyCandidateReviews(
  file: CandidateDraftFile,
  decisions: Record<string, "approved" | "rejected">
): CandidateDraftFile {
  return {
    ...file,
    candidates: file.candidates.map((candidate) => {
      const decision = decisions[candidate.youtubeId];
      return decision ? applyCandidateReview(candidate, decision) : candidate;
    }),
  };
}

export function listReviewUrls(file: CandidateDraftFile): string[] {
  return file.candidates.filter((candidate) => candidate.status === "pending").map((candidate) => candidate.url);
}
