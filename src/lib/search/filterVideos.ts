import { Videos } from "@/types";

export type SearchType = "groups" | "songs";

export function filterVideos(videos: Videos[], searchType: SearchType, selectedId?: string | null): Videos[] {
  if (!selectedId) {
    return videos;
  }

  if (searchType === "groups") {
    return videos.filter((video) => video.video_groups.some((item) => item.groups.id === selectedId));
  }

  return videos.filter((video) => video.video_songs.some((item) => item.songs.id === selectedId));
}

export function isVideoMissingTags(video: {
  video_groups?: unknown[] | null;
  video_songs?: unknown[] | null;
}): boolean {
  return !video.video_groups?.length || !video.video_songs?.length;
}
