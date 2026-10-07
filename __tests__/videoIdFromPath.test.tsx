import { videoIdFromPath } from "@/lib/video/videoIdFromPath";

describe("videoIdFromPath", () => {
  test("パスの末尾を動画IDにする", () => {
    expect(videoIdFromPath("/videos/abc-123", "_")).toBe("abc-123");
  });

  test("プレースホルダのときは param を使う", () => {
    expect(videoIdFromPath("/videos/_", "real-id")).toBe("real-id");
  });

  test("どちらもプレースホルダなら空文字", () => {
    expect(videoIdFromPath("/videos/_", "_")).toBe("");
  });
});
