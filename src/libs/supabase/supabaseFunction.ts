import { supabase } from "./supabase";

// 全ての動画を取得（初期表示用）
export const getAllVideos = async () => {
  const { data, error } = await supabase
    .from("videos")
    .select(`*, video_groups!inner(groups(id, group_name)), video_songs!inner(songs(id, song_name))`)
    .not("display", "is", false);

  if (error) {
    console.log("Error fetching videos:", error);
  } else if (data) {
    console.log("Videos fetched successfully:", data);
    return data || [];
  }
};

// 曲の情報を取得
export const fetchSongs = async () => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .not("display", "is", false)
    .order("song_name", { ascending: true });

  if (error) {
    console.log("Error fetching songs:", error);
  } else if (data) {
    console.log("Songs fetched successfully:", data);
    return data;
  }
};

// グループの情報を取得
export const fetchGroups = async () => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    // .not("display", "is", false)
    // .not("display_order", "is", null)
    .order("group_name", { ascending: true });
  if (error) {
    console.log("Error fetching Groups:", error);
  } else if (data) {
    console.log("Groups fetched successfully:", data);
    return data;
  }
};

// 特定のグループまたは曲に関連する動画を取得
export const getMatchedGroupId = async (id: string, buttonName: string) => {
  console.log("Fetching videos for group or song ID:", id);
  if (buttonName === "songs") {
    const { data, error } = await supabase
      .from("videos")
      .select(
        `
      *, 
      video_groups!inner(groups(id, group_name)), 
      video_songs!inner(songs(id, song_name))
    `
      )
      .eq("video_songs.song_id", id);

    if (error) {
      console.log("Error fetching matched:", error);
    } else if (data) {
      console.log("Matched fetched successfully:", data);
      return data;
    }
  } else if (buttonName === "groups") {
    console.log("groups:", id);
    const { data: videoIds, error: videoError } = await supabase
      .from("video_groups")
      .select("video_id")
      .eq("group_id", id);

    if (videoError) {
      console.log("Error fetching video IDs:", videoError);
    }

    if (!videoIds) {
      console.log("No videos found for group ID:", videoIds);
      return [];
    }

    console.log("Video IDs fetched successfully:", videoIds);

    const videoIdlist = videoIds.map((item) => item.video_id);
    console.log("Video ID list:", videoIdlist);

    const { data, error } = await supabase
      .from("videos")
      .select(
        `
      *, 
      video_groups(groups(id, group_name)), 
      video_songs(songs(id, song_name))
    `
      )
      .in("id", videoIdlist)
      .not("display", "is", false);

    if (error) {
      console.log("Error fetching videos:", error);
    } else if (data) {
      console.log("Videos fetched successfully:", data);
      return data;
    }
  }
};
