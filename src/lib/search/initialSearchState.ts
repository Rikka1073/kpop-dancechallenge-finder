import { filterVideos } from "@/lib/search/filterVideos";
import { GroupRecord, Record, SongRecord, Videos } from "@/types";

export type SearchButton = "groups" | "songs";

export type InitialSearchState = {
  selectedButton: SearchButton;
  selectedItems: Record[];
  filteredData: Videos[];
};

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
  if (queryType === "song" && queryId) {
    const song = songs.find((item) => item.id === queryId);
    return {
      selectedButton: "songs",
      selectedItems: song ? [{ id: queryId, name: song.song_name }] : [],
      filteredData: filterVideos(videos, "songs", queryId),
    };
  }

  if (queryType === "group" && queryId) {
    const group = groups.find((item) => item.id === queryId);
    return {
      selectedButton: "groups",
      selectedItems: group ? [{ id: queryId, name: group.group_name }] : [],
      filteredData: filterVideos(videos, "groups", queryId),
    };
  }

  return {
    selectedButton: "groups",
    selectedItems: [],
    filteredData: videos,
  };
}
