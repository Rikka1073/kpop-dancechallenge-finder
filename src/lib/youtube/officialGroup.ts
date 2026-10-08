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
