import { filterVideos } from "@/lib/search/filterVideos";
import { GroupRecord, Record, SongRecord, Videos } from "@/types";

export type SearchButton = "groups" | "songs";

export type InitialSearchState = {
  selectedButton: SearchButton;
  selectedItems: Record[];
  filteredData: Videos[];
};

export function searchPath(type?: SearchButton | null, id?: string | null): string {
  if (type === "songs") {
    return id ? `/search?type=song&id=${encodeURIComponent(id)}` : "/search?type=song";
  }
  if (type === "groups" && id) {
    return `/search?type=group&id=${encodeURIComponent(id)}`;
  }
  return "/search";
}

export function getInitialSearchState({
  videos,
  groups,
  songs,
  queryType,
  queryId,
}: {
  videos: Videos[];
  groups: Pick<GroupRecord, "id" | "group_name">[];
  songs: Pick<SongRecord, "id" | "song_name">[];
  queryType?: string | null;
  queryId?: string | null;
}): InitialSearchState {
  if (queryType === "song") {
    const song = queryId ? songs.find((item) => item.id === queryId) : undefined;
    return {
      selectedButton: "songs",
      selectedItems: song && queryId ? [{ id: queryId, name: song.song_name }] : [],
      filteredData: queryId ? filterVideos(videos, "songs", queryId) : videos,
    };
  }

  if (queryType === "group") {
    const group = queryId ? groups.find((item) => item.id === queryId) : undefined;
    return {
      selectedButton: "groups",
      selectedItems: group && queryId ? [{ id: queryId, name: group.group_name }] : [],
      filteredData: queryId ? filterVideos(videos, "groups", queryId) : videos,
    };
  }

  return {
    selectedButton: "groups",
    selectedItems: [],
    filteredData: videos,
  };
}
