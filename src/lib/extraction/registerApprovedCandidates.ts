import { GroupRecord, SongRecord, VideoData } from "@/types";
import { assertOfficialGroupByChannelId, OfficialChannelGroup } from "@/lib/youtube/officialGroup";
import { fetchYouTubeVideoSnapshot, YouTubeVideoSnapshot } from "@/lib/youtube/fetchYouTubeVideo";
import {
  findVideoByYoutubeId,
  getAdminGroups,
  getAdminSongs,
  insertApprovedVideo,
} from "@/lib/supabase/registerSupabaseFunction";
import { CandidateDraft, CandidateDraftFile, newlyApprovedCandidates } from "./candidateDraft";

export type ApprovedTagCatalog = {
  groups: (OfficialChannelGroup & { id: string })[];
  songs: Pick<SongRecord, "id" | "song_name">[];
};

export function resolveApprovedTags(
  snapshot: Pick<YouTubeVideoSnapshot, "channelId">,
  candidate: Pick<CandidateDraft, "suggestedGroups" | "suggestedSong">,
  catalog: ApprovedTagCatalog
): { groupIds: string[]; songIds: string[] } {
  const official = assertOfficialGroupByChannelId(catalog.groups, snapshot.channelId);
  const groupIds = new Set<string>([official.id]);

  for (const name of candidate.suggestedGroups) {
    const match = catalog.groups.find(
      (group) => group.group_name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (match) {
      groupIds.add(match.id);
    }
  }

  const songName = candidate.suggestedSong?.trim().toLowerCase();
  const songIds = songName
    ? catalog.songs
        .filter((song) => song.song_name.trim().toLowerCase() === songName)
        .map((song) => song.id)
    : [];

  return { groupIds: [...groupIds], songIds };
}

export async function registerApprovedCandidate(
  candidate: CandidateDraft,
  deps?: {
    fetchSnapshot?: (input: string) => Promise<YouTubeVideoSnapshot>;
    groups?: ApprovedTagCatalog["groups"];
    songs?: ApprovedTagCatalog["songs"];
    findExisting?: (youtubeId: string) => Promise<{ id?: string } | null>;
    insertVideo?: (videoData: VideoData, groupIds: string[], songIds: string[]) => Promise<unknown>;
  }
): Promise<{ youtubeId: string; skipped: boolean }> {
  const existing = await (deps?.findExisting ?? findVideoByYoutubeId)(candidate.youtubeId);
  if (existing?.id) {
    return { youtubeId: candidate.youtubeId, skipped: true };
  }

  const snapshot = await (deps?.fetchSnapshot ?? fetchYouTubeVideoSnapshot)(candidate.url);
  const groups = deps?.groups ?? ((await getAdminGroups()) as GroupRecord[]);
  const songs = deps?.songs ?? (await getAdminSongs());
  const { groupIds, songIds } = resolveApprovedTags(snapshot, candidate, { groups, songs });

  await (deps?.insertVideo ?? insertApprovedVideo)(
    {
      id: snapshot.youtubeId,
      title: snapshot.title,
      thumbnailUrl: snapshot.thumbnailUrl,
      viewCount: snapshot.viewCount,
    },
    groupIds,
    songIds
  );

  return { youtubeId: candidate.youtubeId, skipped: false };
}

export async function registerNewlyApprovedCandidates(
  previous: CandidateDraftFile | null,
  next: CandidateDraftFile
) {
  const candidates = newlyApprovedCandidates(previous, next);
  const results = [];
  for (const candidate of candidates) {
    results.push(await registerApprovedCandidate(candidate));
  }
  return results;
}
