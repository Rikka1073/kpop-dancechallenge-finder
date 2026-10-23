import { Videos } from "@/types";

export function filterVideos(
  videos: Videos[],
  { groupIds = [], songIds = [] }: { groupIds?: string[]; songIds?: string[] } = {}
): Videos[] {
  return videos.filter((video) => {
    const videoGroupIds = video.video_groups.map((item) => item.groups.id);
    const videoSongIds = video.video_songs.map((item) => item.songs.id);
    const matchesGroups = groupIds.every((id) => videoGroupIds.includes(id));
    const matchesSongs = songIds.every((id) => videoSongIds.includes(id));
    return matchesGroups && matchesSongs;
  });
}

export function isVideoMissingTags(video: {
  video_groups?: unknown[] | null;
  video_songs?: unknown[] | null;
}): boolean {
  return !video.video_groups?.length || !video.video_songs?.length;
}
