import { GroupRecord, Record, SongRecord, Videos } from "@/types";

export type SearchButton = "groups" | "songs";

export type InitialSearchState = {
  selectedButton: SearchButton;
  selectedItems: Record[];
  filteredData: Videos[];
};

export function parseSearchPage(value?: string | null): number {
  const page = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function searchPath(type?: SearchButton | null, id?: string | null, page?: number | null): string {
  const params = new URLSearchParams();
  if (type === "songs") {
    params.set("type", "song");
  } else if (type === "groups") {
    params.set("type", "group");
  }
  if (id && (type === "songs" || type === "groups")) {
    params.set("id", id);
  }
  if (page && page > 1) {
    params.set("page", String(page));
  }
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
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
      filteredData: videos,
    };
  }

  if (queryType === "group") {
    const group = queryId ? groups.find((item) => item.id === queryId) : undefined;
    return {
      selectedButton: "groups",
      selectedItems: group && queryId ? [{ id: queryId, name: group.group_name }] : [],
      filteredData: videos,
    };
  }

  return {
    selectedButton: "groups",
    selectedItems: [],
    filteredData: videos,
  };
}
