import { describe, expect, test } from "vitest";
import { intersectVideoIds, videoIdsMatchingAll } from "@/lib/search/matchVideoIds";

describe("videoIdsMatchingAll", () => {
  const rows = [
    { video_id: "v1", tag_id: "g1" },
    { video_id: "v2", tag_id: "g2" },
    { video_id: "v3", tag_id: "g1" },
    { video_id: "v3", tag_id: "g2" },
  ];

  test("1件ならそのタグの動画", () => {
    expect(videoIdsMatchingAll(rows, ["g1"]).sort()).toEqual(["v1", "v3"]);
  });

  test("複数ならすべてのタグを持つ動画だけ", () => {
    expect(videoIdsMatchingAll(rows, ["g1", "g2"])).toEqual(["v3"]);
  });
});

describe("intersectVideoIds", () => {
  test("片方が null ならもう片方", () => {
    expect(intersectVideoIds(null, ["v1"])).toEqual(["v1"]);
    expect(intersectVideoIds(["v1"], null)).toEqual(["v1"]);
  });

  test("両方あるなら積集合", () => {
    expect(intersectVideoIds(["v1", "v2"], ["v2", "v3"])).toEqual(["v2"]);
  });
});
