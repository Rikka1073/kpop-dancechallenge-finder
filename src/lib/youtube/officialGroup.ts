export type OfficialChannelGroup = {
  id: string;
  group_name: string;
  youtube_channel_id?: string | null;
};

export function findOfficialGroupByChannelId<T extends OfficialChannelGroup>(
  groups: T[],
  channelId: string | null | undefined
): T | null {
  const id = channelId?.trim();
  if (!id) {
    return null;
  }
  return groups.find((group) => group.youtube_channel_id === id) ?? null;
}

export function assertOfficialGroupByChannelId<T extends OfficialChannelGroup>(
  groups: T[],
  channelId: string | null | undefined
): T {
  const group = findOfficialGroupByChannelId(groups, channelId);
  if (!group) {
    throw new Error("確認済みの公式チャンネルの動画ではありません。先にグループへ公式チャンネルを保存してください。");
  }
  return group;
}

export function requireOfficialChannelId<T extends OfficialChannelGroup>(
  groups: T[],
  groupName: string
): { groupName: string; channelId: string } {
  const name = groupName.trim();
  if (!name) {
    throw new Error("抽出対象のグループが空です。Linear 課題で人が OK するまで取りません。");
  }

  const group = groups.find((item) => item.group_name.trim().toLowerCase() === name.toLowerCase());
  const channelId = group?.youtube_channel_id?.trim();
  if (!group || !channelId) {
    throw new Error(
      `${name} の確認済み公式チャンネルがありません。先にグループへ公式チャンネルを保存してください。`
    );
  }

  return { groupName: group.group_name, channelId };
}
