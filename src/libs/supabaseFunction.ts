import { VideoData, VideoGroupData, VideoSongData } from "@/types";
import { supabase } from "./supabase";

// 全ての動画を取得（初期表示用）
export const getAllVideos = async () => {
  const { data, error } = await supabase
    .from("videos")
    .select(`*, video_groups!inner(groups(id, group_name)), video_songs!inner(songs(id, song_name))`);

  if (error) {
    console.log("Error fetching videos:", error);
  } else if (data) {
    console.log("Videos fetched successfully:", data);
    return data || [];
  }
};

// 登録済みの動画を取得
export const getAllRegisteredVideos = async () => {
  const { data, error } = await supabase
    .from("videos")
    .select(`*, video_groups(groups(id, group_name)), video_songs(songs(id, song_name))`)
    .or("video_groups.is.null,video_songs.is.null");

  if (error) {
    console.log("Error fetching videos:", error);
  } else if (data) {
    console.log("Videos fetched successfully:", data);
    return data || [];
  }
};

// 曲の情報を取得
export const fetchSongs = async () => {
  const { data, error } = await supabase.from("songs").select("*");
  if (error) {
    console.log("Error fetching songs:", error);
  } else if (data) {
    console.log("Videos fetched successfully:", data);
    return data;
  }
};

// グループの情報を取得
export const fetchGroups = async () => {
  const { data, error } = await supabase.from("groups").select("*").not("display_order", "is", null);
  if (error) {
    console.log("Error fetching Groups:", error);
  } else if (data) {
    console.log("Videos fetched successfully:", data);
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
      .in("id", videoIdlist);

    if (error) {
      console.log("Error fetching videos:", error);
    } else if (data) {
      console.log("Videos fetched successfully:", data);
      return data;
    }
  }
};

// 動画の登録
export const registerVideo = async (videoData: VideoData) => {
  const { id, title, thumbnailUrl, viewCount } = videoData;
  const { data, error } = await supabase
    .from("videos")
    .insert({
      youtube_id: id,
      title: title,
      thumbnail_url: thumbnailUrl,
      view_count: viewCount,
    })
    .select("*");

  if (error) {
    console.log("Error fetching videos:", error);
  } else if (data) {
    console.log("Videos fetched successfully:", data);
    return data || [];
  }
};

// 動画のグループ詳細を登録
export const registerVideoGroup = async (detailsGroupDate: VideoGroupData) => {
  const { videoId } = detailsGroupDate;
  console.log("Video ID:", videoId);
  const groupDataId = await fetchGroups();
  const firstGroupId = groupDataId?.find((group) => group.group_name === detailsGroupDate.firstGroupId);
  const secondGroupId = groupDataId?.find((group) => group.group_name === detailsGroupDate.secondGroupId);
  console.log("First Group ID:", firstGroupId.id);
  console.log("Second Group ID:", secondGroupId.id);
  const insertData = [
    {
      video_id: videoId,
      group_id: firstGroupId.id,
    },
    {
      video_id: videoId,
      group_id: secondGroupId.id,
    },
  ];

  console.log("Insert Data:", insertData);

  const { data, error } = await supabase.from("video_groups").insert(insertData).select("*");

  if (error) {
    console.log("Error registering video details:", error);
  } else if (data) {
    console.log("Video details registered successfully:", data);
    return data || [];
  }
};

// 動画の曲詳細を登録
export const registerVideoSong = async (detailsSongDate: VideoSongData) => {
  const { videoId } = detailsSongDate;
  console.log("Video ID:", videoId);
  const songDataId = await fetchSongs();
  const songId = songDataId?.find((song) => song.song_name === detailsSongDate.songId);
  console.log("Song ID:", songId.id);
  const { data, error } = await supabase
    .from("video_songs")
    .insert([
      {
        video_id: videoId,
        song_id: songId.id,
      },
    ])
    .select("*");

  if (error) {
    console.log("Error registering video details:", error);
  } else if (data) {
    console.log("Video details registered successfully:", data);
    return data || [];
  }
};
