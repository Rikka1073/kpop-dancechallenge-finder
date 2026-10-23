import { GroupRecord, Record, SongRecord, Videos } from "@/types";

export type InitialSearchState = {
  selectedGroups: Record[];
  selectedSongs: Record[];
  filteredData: Videos[];
};

export type SearchQueryInput = {
  type?: string | string[] | null;
  id?: string | string[] | null;
  group?: string | string[] | null;
  song?: string | string[] | null;
  page?: string | string[] | null;
};

export function parseSearchPage(value?: string | string[] | null): number {
  const raw = firstParam(value) ?? "1";
  const page = Number.parseInt(raw, 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function parseIdList(value?: string | string[] | null): string[] {
  const parts = Array.isArray(value) ? value : value ? [value] : [];
  return uniqueSorted(
    parts
      .flatMap((item) => item.split(","))
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

export function parseSearchQuery(params: SearchQueryInput = {}): {
  groupIds: string[];
  songIds: string[];
  page: number;
} {
  const groupIds = parseIdList(params.group);
  const songIds = parseIdList(params.song);
  const type = firstParam(params.type);
  const id = firstParam(params.id);

  if (id && type === "group" && groupIds.length === 0) {
    return { groupIds: [id], songIds, page: parseSearchPage(params.page) };
  }
  if (id && type === "song" && songIds.length === 0) {
    return { groupIds, songIds: [id], page: parseSearchPage(params.page) };
  }

  return { groupIds, songIds, page: parseSearchPage(params.page) };
}

export function searchPath({
  groupIds = [],
  songIds = [],
  page,
}: {
  groupIds?: string[];
  songIds?: string[];
  page?: number | null;
} = {}): string {
  const params = new URLSearchParams();
  for (const id of uniqueSorted(groupIds)) {
    params.append("group", id);
  }
  for (const id of uniqueSorted(songIds)) {
    params.append("song", id);
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
  groupIds = [],
  songIds = [],
}: {
  videos: Videos[];
  groups: Pick<GroupRecord, "id" | "group_name">[];
  songs: Pick<SongRecord, "id" | "song_name">[];
  groupIds?: string[];
  songIds?: string[];
}): InitialSearchState {
  return {
    selectedGroups: selectedRecords(groupIds, groups, "group_name"),
    selectedSongs: selectedRecords(songIds, songs, "song_name"),
    filteredData: videos,
  };
}

function firstParam(value?: string | string[] | null): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value ?? undefined;
}

function uniqueSorted(ids: string[]): string[] {
  return [...new Set(ids)].sort();
}

function selectedRecords(
  ids: string[],
  items: { id: string; group_name?: string; song_name?: string }[],
  nameKey: "group_name" | "song_name"
): Record[] {
  return ids.flatMap((id) => {
    const item = items.find((entry) => entry.id === id);
    const name = item?.[nameKey];
    return item && name ? [{ id, name }] : [];
  });
}
