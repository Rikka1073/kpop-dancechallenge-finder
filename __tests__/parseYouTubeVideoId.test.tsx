import { describe, expect, test } from "vitest";
import { parseYouTubeVideoId } from "@/lib/youtube/parseYouTubeVideoId";

describe("parseYouTubeVideoId", () => {
  test("Shorts URLからIDを取り出す", () => {
    expect(parseYouTubeVideoId("https://www.youtube.com/shorts/abcdefghijk")).toBe("abcdefghijk");
  });

  test("watch URLからIDを取り出す", () => {
    expect(parseYouTubeVideoId("https://youtube.com/watch?v=abcdefghijk")).toBe("abcdefghijk");
  });

  test("youtu.be URLからIDを取り出す", () => {
    expect(parseYouTubeVideoId("https://youtu.be/abcdefghijk")).toBe("abcdefghijk");
  });

  test("IDそのものを受け付ける", () => {
    expect(parseYouTubeVideoId("abcdefghijk")).toBe("abcdefghijk");
  });

  test("不正な入力はnull", () => {
    expect(parseYouTubeVideoId("https://example.com/video")).toBeNull();
    expect(parseYouTubeVideoId("")).toBeNull();
  });
});
