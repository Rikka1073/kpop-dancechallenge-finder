import { describe, expect, test } from "vitest";
import { assertOfficialGroupByChannelId, findOfficialGroupByChannelId } from "@/lib/youtube/officialGroup";

const ive = {
  id: "group-ive",
  group_name: "IVE",
  youtube_channel_id: "UCxxxxxxxxxxxxxxxxxxxxxx",
};

const unconfirmed = {
  id: "group-new",
  group_name: "NewJeans",
  youtube_channel_id: null,
};

describe("officialGroup", () => {
  test("確認済みチャンネルIDだけを公式グループとみなす", () => {
    expect(findOfficialGroupByChannelId([ive, unconfirmed], "UCxxxxxxxxxxxxxxxxxxxxxx")).toEqual(ive);
  });

  test("未設定のグループは公式動画の判定に使わない", () => {
    expect(findOfficialGroupByChannelId([unconfirmed], "UCxxxxxxxxxxxxxxxxxxxxxx")).toBeNull();
    expect(findOfficialGroupByChannelId([ive], "UCyyyyyyyyyyyyyyyyyyyyyy")).toBeNull();
    expect(findOfficialGroupByChannelId([ive], "")).toBeNull();
  });

  test("一致しなければ登録できない", () => {
    expect(() => assertOfficialGroupByChannelId([unconfirmed], "UCxxxxxxxxxxxxxxxxxxxxxx")).toThrow(
      "確認済みの公式チャンネルの動画ではありません"
    );
  });
});
