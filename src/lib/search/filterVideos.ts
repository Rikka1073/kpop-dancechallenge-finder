import { Videos } from "@/types";

export function filterVideos(
  videos: Videos[],
  { groupIds = [], songIds = [] }: { groupIds?: string[]; songIds?: string[] } = {}
): Videos[] {
  return videos.filter((video) => {
    const matchesGroup = groupIds.length === 0 || video.video_groups.some((item) => groupIds.includes(item.groups.id));
    const matchesSong = songIds.length === 0 || video.video_songs.some((item) => songIds.includes(item.songs.id));
    return matchesGroup && matchesSong;
  });
}

export function isVideoMissingTags(video: {
  video_groups?: unknown[] | null;
  video_songs?: unknown[] | null;
}): boolean {
  return !video.video_groups?.length || !video.video_songs?.length;
}
