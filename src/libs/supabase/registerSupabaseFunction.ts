import { VideoData, VideoGroupData, VideoSongData } from "@/types";
import { supabase } from "./supabase";
import { fetchGroups, fetchSongs } from "./supabaseFunction";

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
    return data || [];
  }
};

// 動画のグループ詳細を登録
export const registerVideoGroup = async (detailsGroupDate: VideoGroupData) => {
  const { videoId } = detailsGroupDate;
  const groupDataId = await fetchGroups();
  const firstGroupId = groupDataId?.find((group) => group.group_name === detailsGroupDate.firstGroupId);
  const secondGroupId = groupDataId?.find((group) => group.group_name === detailsGroupDate.secondGroupId);
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

  const { data, error } = await supabase.from("video_groups").insert(insertData).select("*");

  if (error) {
    console.log("Error registering video details:", error);
  } else if (data) {
    return data || [];
  }
};

// 動画の曲詳細を登録
export const registerVideoSong = async (detailsSongDate: VideoSongData) => {
  const { videoId } = detailsSongDate;
  const songDataId = await fetchSongs();
  const songId = songDataId?.find((song) => song.song_name === detailsSongDate.songId);
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
    return data || [];
  }
};
