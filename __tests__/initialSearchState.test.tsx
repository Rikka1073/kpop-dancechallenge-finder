import { getInitialSearchState, searchPath } from "@/lib/search/initialSearchState";
import { Videos } from "@/types";
import { describe, expect, test } from "vitest";

const videos: Videos[] = [
  {
    id: "v1",
    youtube_id: "yt1",
    title: "Video 1",
    thumbnail_url: "https://example.com/1.jpg",
    view_count: 10,
    video_groups: [{ groups: { id: "g1", group_name: "IVE" } }],
    video_songs: [{ songs: { id: "s1", song_name: "ATTITUDE" } }],
  },
  {
    id: "v2",
    youtube_id: "yt2",
    title: "Video 2",
    thumbnail_url: "https://example.com/2.jpg",
    view_count: 20,
    video_groups: [{ groups: { id: "g2", group_name: "aespa" } }],
    video_songs: [{ songs: { id: "s2", song_name: "Whiplash" } }],
  },
];

const groups = [
  { id: "g1", group_name: "IVE" },
  { id: "g2", group_name: "aespa" },
];

const songs = [
  { id: "s1", song_name: "ATTITUDE" },
  { id: "s2", song_name: "Whiplash" },
];

describe("getInitialSearchState", () => {
  test("クエリが無ければ全件とグループ検索", () => {
    expect(getInitialSearchState({ videos, groups, songs })).toEqual({
      selectedButton: "groups",
      selectedItems: [],
      filteredData: videos,
    });
  });

  test("グループクエリで絞り込む", () => {
    const state = getInitialSearchState({
      videos,
      groups,
      songs,
      queryType: "group",
      queryId: "g1",
    });
    expect(state.selectedButton).toBe("groups");
    expect(state.selectedItems).toEqual([{ id: "g1", name: "IVE" }]);
    expect(state.filteredData.map((video) => video.id)).toEqual(["v1"]);
  });

  test("楽曲タブだけなら全件のまま", () => {
    const state = getInitialSearchState({
      videos,
      groups,
      songs,
      queryType: "song",
    });
    expect(state.selectedButton).toBe("songs");
    expect(state.selectedItems).toEqual([]);
    expect(state.filteredData).toEqual(videos);
  });

  test("searchPath がクエリを組む", () => {
    expect(searchPath()).toBe("/search");
    expect(searchPath("groups")).toBe("/search?type=group");
    expect(searchPath("groups", "g1")).toBe("/search?type=group&id=g1");
    expect(searchPath("songs")).toBe("/search?type=song");
    expect(searchPath("songs", "s2")).toBe("/search?type=song&id=s2");
  });

  test("楽曲クエリで絞り込む", () => {
    const state = getInitialSearchState({
      videos,
      groups,
      songs,
      queryType: "song",
      queryId: "s2",
    });
    expect(state.selectedButton).toBe("songs");
    expect(state.selectedItems).toEqual([{ id: "s2", name: "Whiplash" }]);
    expect(state.filteredData.map((video) => video.id)).toEqual(["v2"]);
  });
});
