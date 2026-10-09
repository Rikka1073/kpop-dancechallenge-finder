import { OfficialChannelGroup, requireOfficialChannelId } from "../youtube/officialGroup";
import { CandidateDraftFile, createPendingCandidate } from "./candidateDraft";
import { searchYouTubeCandidates } from "./searchYouTubeCandidates";

export const DEFAULT_QUERY_TEMPLATES = ["{group} dance challenge shorts", "{group} 댄스 챌린지"];

export type ExtractionTargets = {
  groups: string[];
  officialGroups: OfficialChannelGroup[];
  queries?: string[];
  linearIssue: string;
  extractedAt?: string;
  maxResultsPerQuery?: number;
};

function expandQueries(
  groups: string[],
  officialGroups: OfficialChannelGroup[],
  templates: string[]
): { group: string; channelId: string; query: string }[] {
  return groups.flatMap((groupName) => {
    const official = requireOfficialChannelId(officialGroups, groupName);
    return templates.map((template) => ({
      group: official.groupName,
      channelId: official.channelId,
      query: template.replaceAll("{group}", official.groupName),
    }));
  });
}

export async function extractCandidateDrafts(
  targets: ExtractionTargets,
  options?: {
    apiKey?: string;
    fetchImpl?: typeof fetch;
  }
): Promise<CandidateDraftFile> {
  const groups = [...new Set(targets.groups.map((group) => group.trim()).filter(Boolean))];
  if (groups.length === 0) {
    throw new Error("抽出対象のグループが空です。Linear 課題で人が OK するまで取りません。");
  }

  const apiKey = options?.apiKey || process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY が設定されていません");
  }

  const templates = targets.queries?.length ? targets.queries : DEFAULT_QUERY_TEMPLATES;
  const searches = expandQueries(groups, targets.officialGroups, templates);
  const seen = new Set<string>();
  const candidates: CandidateDraftFile["candidates"] = [];

  for (const { group, channelId, query } of searches) {
    const hits = await searchYouTubeCandidates({
      query,
      channelId,
      apiKey,
      maxResults: targets.maxResultsPerQuery,
      fetchImpl: options?.fetchImpl,
    });

    for (const hit of hits) {
      if (seen.has(hit.youtubeId)) {
        continue;
      }
      seen.add(hit.youtubeId);

      candidates.push(
        createPendingCandidate({
          youtubeId: hit.youtubeId,
          url: hit.url,
          title: hit.title,
          channelTitle: hit.channelTitle,
          publishedAt: hit.publishedAt,
          viewCount: hit.viewCount,
          suggestedGroups: [group],
          suggestedSong: null,
          officialGuess: true,
          officialGuessReason: "確認済み公式チャンネルの動画。ダンスチャレンジかどうかは人が判定する。",
        })
      );
    }
  }

  return {
    extractedAt: targets.extractedAt || new Date().toISOString(),
    linearIssue: targets.linearIssue,
    queryNotes: searches.map((item) => `${item.query} (${item.channelId})`).join(" / "),
    candidates,
  };
}
