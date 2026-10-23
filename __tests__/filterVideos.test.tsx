import { describe, expect, test } from "vitest";
import { filterVideos, isVideoMissingTags } from "@/lib/search/filterVideos";
import { Videos } from "@/types";

const createVideo = (id: string, groupId?: string, songId?: string): Videos => ({
  id,
  youtube_id: id,
  title: `Video ${id}`,
  thumbnail_url: "https://example.com/thumb.jpg",
  view_count: 100,
  video_groups: groupId ? [{ groups: { id: groupId, group_name: "Group" } }] : [],
  video_songs: songId ? [{ songs: { id: songId, song_name: "Song" } }] : [],
});

describe("filterVideos", () => {
  const videos = [createVideo("1", "g1", "s1"), createVideo("2", "g2", "s1"), createVideo("3", "g1", "s2")];

  test("未選択なら全件を返す", () => {
    expect(filterVideos(videos)).toHaveLength(3);
  });

  test("グループIDで絞り込む", () => {
    expect(filterVideos(videos, { groupIds: ["g1"] }).map((video) => video.id)).toEqual(["1", "3"]);
  });

  test("楽曲IDで絞り込む", () => {
    expect(filterVideos(videos, { songIds: ["s1"] }).map((video) => video.id)).toEqual(["1", "2"]);
  });

  test("同じ種類は OR", () => {
    expect(filterVideos(videos, { groupIds: ["g1", "g2"] }).map((video) => video.id)).toEqual(["1", "2", "3"]);
  });

  test("グループと楽曲は AND", () => {
    expect(filterVideos(videos, { groupIds: ["g1"], songIds: ["s1"] }).map((video) => video.id)).toEqual(["1"]);
  });
});

describe("isVideoMissingTags", () => {
  test("グループまたは楽曲が無い動画を検出する", () => {
    expect(isVideoMissingTags(createVideo("1", "g1"))).toBe(true);
    expect(isVideoMissingTags(createVideo("2", "g1", "s1"))).toBe(false);
  });
});
