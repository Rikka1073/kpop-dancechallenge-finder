import { VideoData } from "@/types";
import { createAdminSupabaseClient } from "./adminClient";
import { isVideoMissingTags } from "@/lib/search/filterVideos";
import { SupabaseClient } from "@supabase/supabase-js";

const VIDEO_RELATIONS = `*, video_groups(groups(id, group_name)), video_songs(songs(id, song_name))`;

type AdminClient = SupabaseClient;

const getClient = (client?: AdminClient) => client ?? createAdminSupabaseClient();

function isMissingOrMultipleRowsError(error: { code?: string; message?: string } | null): boolean {
  return error?.code === "PGRST116" || Boolean(error?.message?.includes("JSON object requested"));
}

function throwGroupWriteError(error: { code?: string; message?: string } | null, fallback: string): never {
  if (error?.code === "23505") {
    throw new Error("このチャンネルは別のグループに保存済みです");
  }
  if (isMissingOrMultipleRowsError(error)) {
    throw new Error("グループを1件として保存できませんでした。同じ条件の行が0件か複数件です。");
  }
  throw new Error(error?.message || fallback);
}

function firstRow<T>(data: T[] | T | null | undefined): T | null {
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }
  return data ?? null;
}

export type RegisteredVideoRecord = {
  id: string;
  youtube_id: string;
  title: string;
  thumbnail_url: string;
  view_count: number;
  display?: boolean | null;
  video_groups: { groups: { id: string; group_name: string } | null }[] | null;
  video_songs: { songs: { id: string; song_name: string } | null }[] | null;
};

export async function upsertVideoWithTags(
  videoData: VideoData,
  groupIds: string[],
  songIds: string[],
  client?: AdminClient
) {
  const db = getClient(client);
  const uniqueGroupIds = [...new Set(groupIds.filter(Boolean))];
  const uniqueSongIds = [...new Set(songIds.filter(Boolean))];

  if (uniqueGroupIds.length === 0 || uniqueSongIds.length === 0) {
    throw new Error("グループと楽曲をそれぞれ1件以上選択してください");
  }

  const { data: existingRows, error: existingError } = await db
    .from("videos")
    .select("id")
    .eq("youtube_id", videoData.id)
    .order("id")
    .limit(1);

  if (existingError) {
    throw new Error(existingError.message);
  }

  let videoId = existingRows?.[0]?.id as string | undefined;

  if (videoId) {
    const { error: updateError } = await db
      .from("videos")
      .update({
        title: videoData.title,
        thumbnail_url: videoData.thumbnailUrl,
        view_count: videoData.viewCount,
        display: true,
      })
      .eq("id", videoId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  } else {
    const { data: inserted, error: insertError } = await db
      .from("videos")
      .insert({
        youtube_id: videoData.id,
        title: videoData.title,
        thumbnail_url: videoData.thumbnailUrl,
        view_count: videoData.viewCount,
        display: true,
      })
      .select("id");

    const insertedRow = firstRow(inserted);
    if (insertError || !insertedRow) {
      throw new Error(insertError?.message || "動画の登録に失敗しました");
    }
    videoId = insertedRow.id as string;
  }

  if (!videoId) {
    throw new Error("動画IDの取得に失敗しました");
  }

  await replaceVideoTags(videoId, uniqueGroupIds, uniqueSongIds, db);
  return getAdminVideoById(videoId, db);
}

export async function replaceVideoTags(videoId: string, groupIds: string[], songIds: string[], client?: AdminClient) {
  const db = getClient(client);

  const { error: deleteGroupsError } = await db.from("video_groups").delete().eq("video_id", videoId);
  if (deleteGroupsError) {
    throw new Error(deleteGroupsError.message);
  }

  const { error: deleteSongsError } = await db.from("video_songs").delete().eq("video_id", videoId);
  if (deleteSongsError) {
    throw new Error(deleteSongsError.message);
  }

  if (groupIds.length > 0) {
    const { error } = await db
      .from("video_groups")
      .insert(groupIds.map((groupId) => ({ video_id: videoId, group_id: groupId })));
    if (error) {
      throw new Error(error.message);
    }
  }

  if (songIds.length > 0) {
    const { error } = await db
      .from("video_songs")
      .insert(songIds.map((songId) => ({ video_id: videoId, song_id: songId })));
    if (error) {
      throw new Error(error.message);
    }
  }
}

export async function getAdminVideos(client?: AdminClient): Promise<RegisteredVideoRecord[]> {
  const db = getClient(client);
  const { data, error } = await db.from("videos").select(VIDEO_RELATIONS).order("view_count", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as RegisteredVideoRecord[];
}

export async function getAdminVideoById(id: string, client?: AdminClient): Promise<RegisteredVideoRecord> {
  const db = getClient(client);
  const { data, error } = await db.from("videos").select(VIDEO_RELATIONS).eq("id", id);

  const video = firstRow(data);
  if (error || !video) {
    throw new Error(error?.message || "動画が見つかりませんでした");
  }

  return video as RegisteredVideoRecord;
}

export async function getUntaggedVideos(client?: AdminClient) {
  const videos = await getAdminVideos(client);
  return videos.filter(isVideoMissingTags);
}

export async function setVideoDisplay(videoId: string, display: boolean, client?: AdminClient) {
  const db = getClient(client);
  const { error } = await db.from("videos").update({ display }).eq("id", videoId);
  if (error) {
    throw new Error(error.message);
  }
  return getAdminVideoById(videoId, db);
}

export async function updateVideoStats(
  videoId: string,
  stats: { title: string; thumbnailUrl: string; viewCount: number },
  client?: AdminClient
) {
  const db = getClient(client);
  const { error } = await db
    .from("videos")
    .update({
      title: stats.title,
      thumbnail_url: stats.thumbnailUrl,
      view_count: stats.viewCount,
    })
    .eq("id", videoId);

  if (error) {
    throw new Error(error.message);
  }

  return getAdminVideoById(videoId, db);
}

export async function deleteVideo(videoId: string, client?: AdminClient) {
  const db = getClient(client);
  await db.from("video_groups").delete().eq("video_id", videoId);
  await db.from("video_songs").delete().eq("video_id", videoId);
  const { error } = await db.from("videos").delete().eq("id", videoId);
  if (error) {
    throw new Error(error.message);
  }
}

export async function getAdminGroups(client?: AdminClient) {
  const db = getClient(client);
  const { data, error } = await db
    .from("groups")
    .select("*")
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("group_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
}

export async function getAdminSongs(client?: AdminClient) {
  const db = getClient(client);
  const { data, error } = await db.from("songs").select("*").order("song_name", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
}

export async function createGroup(
  groupName: string,
  displayOrder: number | null,
  officialChannel?: { channelId: string; title: string } | null,
  client?: AdminClient
) {
  const db = getClient(client);
  const { data, error } = await db
    .from("groups")
    .insert({
      group_name: groupName,
      display: true,
      display_order: displayOrder,
      ...(officialChannel
        ? {
            youtube_channel_id: officialChannel.channelId,
            youtube_channel_title: officialChannel.title,
          }
        : {}),
    })
    .select("*");

  const group = firstRow(data);
  if (error || !group) {
    throwGroupWriteError(error, "グループの追加に失敗しました");
  }
  return group;
}

export async function createSong(songName: string, client?: AdminClient) {
  const db = getClient(client);
  const { data, error } = await db
    .from("songs")
    .insert({
      song_name: songName,
      display: true,
    })
    .select("*");

  const song = firstRow(data);
  if (error || !song) {
    throw new Error(error?.message || "楽曲の追加に失敗しました");
  }
  return song;
}

export async function updateGroup(
  id: string,
  values: {
    group_name?: string;
    display?: boolean;
    display_order?: number | null;
    youtube_channel_id?: string | null;
    youtube_channel_title?: string | null;
  },
  client?: AdminClient
) {
  const db = getClient(client);
  const { data, error } = await db.from("groups").update(values).eq("id", id).select("*");
  const group = firstRow(data);
  if (error || !group) {
    throwGroupWriteError(error, "グループの更新に失敗しました");
  }
  return group;
}

export async function findGroupByYoutubeChannelId(channelId: string, client?: AdminClient) {
  const id = channelId.trim();
  if (!id) {
    return null;
  }

  const db = getClient(client);
  const { data, error } = await db.from("groups").select("*").eq("youtube_channel_id", id).order("id").limit(1);
  if (error) {
    if (isMissingOrMultipleRowsError(error)) {
      return firstRow(data);
    }
    throw new Error(error.message);
  }
  return firstRow(data);
}

export async function updateSong(id: string, values: { song_name?: string; display?: boolean }, client?: AdminClient) {
  const db = getClient(client);
  const { data, error } = await db.from("songs").update(values).eq("id", id).select("*");
  const song = firstRow(data);
  if (error || !song) {
    throw new Error(error?.message || "楽曲の更新に失敗しました");
  }
  return song;
}
