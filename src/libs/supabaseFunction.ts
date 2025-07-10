import { supabase } from "./supabase";

// 全ての動画を取得（初期表示用）
export const getAllVideos = async () => {
  const { data, error } = await supabase
    .from("videos")
    .select(`*, video_groups(groups(id, group_name)), video_songs(songs(id, song_name))`);

  if (error) {
    console.log("Error fetching videos:", error);
  } else if (data) {
    // console.log("Videos fetched successfully:", data);
    return data || [];
  }
};
