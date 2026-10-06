import { CandidateDraftFile, createPendingCandidate } from "./candidateDraft";
import { guessOfficial } from "./guessOfficial";
import { searchYouTubeCandidates } from "./searchYouTubeCandidates";

export const DEFAULT_QUERY_TEMPLATES = ["{group} dance challenge shorts", "{group} 댄스 챌린지"];

export type ExtractionTargets = {
  groups: string[];
  queries?: string[];
  linearIssue: string;
  extractedAt?: string;
  maxResultsPerQuery?: number;
};

function expandQueries(groups: string[], templates: string[]): { group: string; query: string }[] {
  return groups.flatMap((group) => templates.map((template) => ({ group, query: template.replaceAll("{group}", group) })));
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
  const searches = expandQueries(groups, templates);
  const seen = new Set<string>();
  const candidates: CandidateDraftFile["candidates"] = [];

  for (const { group, query } of searches) {
    const hits = await searchYouTubeCandidates({
      query,
      apiKey,
      maxResults: targets.maxResultsPerQuery,
      fetchImpl: options?.fetchImpl,
    });

    for (const hit of hits) {
      if (seen.has(hit.youtubeId)) {
        continue;
      }
      seen.add(hit.youtubeId);

      const suggestedGroups = [group];
      const guess = guessOfficial({
        title: hit.title,
        channelTitle: hit.channelTitle,
        suggestedGroups,
      });

      candidates.push(
        createPendingCandidate({
          youtubeId: hit.youtubeId,
          url: hit.url,
          title: hit.title,
          channelTitle: hit.channelTitle,
          publishedAt: hit.publishedAt,
          viewCount: hit.viewCount,
          suggestedGroups,
          suggestedSong: null,
          officialGuess: guess.officialGuess,
          officialGuessReason: guess.officialGuessReason,
        })
      );
    }
  }

  return {
    extractedAt: targets.extractedAt || new Date().toISOString(),
    linearIssue: targets.linearIssue,
    queryNotes: searches.map((item) => item.query).join(" / "),
    candidates,
  };
}
