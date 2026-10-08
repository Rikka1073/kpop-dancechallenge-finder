import { describe, expect, test } from "vitest";
import { parseYouTubeChannelInput } from "@/lib/youtube/parseYouTubeChannel";

describe("parseYouTubeChannelInput", () => {
  test("@ハンドルを受け付ける", () => {
    expect(parseYouTubeChannelInput("@IVEstarship")).toEqual({ kind: "handle", handle: "@IVEstarship" });
  });

  test("チャンネルURLのハンドルを取り出す", () => {
    expect(parseYouTubeChannelInput("https://www.youtube.com/@IVEstarship")).toEqual({
      kind: "handle",
      handle: "@IVEstarship",
    });
    expect(parseYouTubeChannelInput("https://www.youtube.com/@IVEstarship/videos")).toEqual({
      kind: "handle",
      handle: "@IVEstarship",
    });
  });

  test("channel ID のURLとIDそのものを受け付ける", () => {
    expect(parseYouTubeChannelInput("UCxxxxxxxxxxxxxxxxxxxxxx")).toEqual({
      kind: "id",
      channelId: "UCxxxxxxxxxxxxxxxxxxxxxx",
    });
    expect(parseYouTubeChannelInput("https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxxx")).toEqual({
      kind: "id",
      channelId: "UCxxxxxxxxxxxxxxxxxxxxxx",
    });
  });

  test("動画URLはチャンネルとして受け付けない", () => {
    expect(parseYouTubeChannelInput("https://www.youtube.com/watch?v=abcdefghijk")).toBeNull();
    expect(parseYouTubeChannelInput("https://www.youtube.com/shorts/abcdefghijk")).toBeNull();
    expect(parseYouTubeChannelInput("https://youtu.be/abcdefghijk")).toBeNull();
  });

  test("空はnull", () => {
    expect(parseYouTubeChannelInput("")).toBeNull();
    expect(parseYouTubeChannelInput("https://example.com/@IVE")).toBeNull();
  });
});
