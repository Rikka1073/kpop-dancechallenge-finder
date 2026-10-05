import { supabase } from "./supabase";

const VIDEO_RELATIONS = `*, video_groups!inner(groups(id, group_name)), video_songs!inner(songs(id, song_name))`;

function logSupabaseError(context: string, error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const supabaseError = error as { message?: string; details?: string; hint?: string; code?: string };
    console.log(context, {
      message: supabaseError.message,
      details: supabaseError.details,
      hint: supabaseError.hint,
      code: supabaseError.code,
    });
    return;
  }

  console.log(context, {
    message: error instanceof Error ? error.message : String(error),
    details: error instanceof Error ? error.stack : "",
    hint: "",
    code: "",
  });
}

export const getAllVideos = async () => {
  try {
    const { data, error } = await supabase
      .from("videos")
      .select(VIDEO_RELATIONS)
      .not("display", "is", false)
      .order("view_count", { ascending: false });

    if (error) {
      logSupabaseError("Error fetching videos:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    logSupabaseError("Error fetching videos:", err);
    return [];
  }
};

export const getVideoById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("videos")
      .select(`*, video_groups(groups(id, group_name)), video_songs(songs(id, song_name))`)
      .eq("id", id)
      .not("display", "is", false)
      .maybeSingle();

    if (error) {
      logSupabaseError("Error fetching video:", error);
      return undefined;
    }
    return data || undefined;
  } catch (err) {
    logSupabaseError("Error fetching video:", err);
    return undefined;
  }
};

export const fetchSongs = async () => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .not("display", "is", false)
    .order("song_name", { ascending: true });

  if (error) {
    logSupabaseError("Error fetching songs:", error);
    return [];
  }
  return data || [];
};

export const fetchGroups = async () => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .not("display", "is", false)
    .not("display_order", "is", null)
    .order("display_order", { ascending: true })
    .order("group_name", { ascending: true });

  if (error) {
    logSupabaseError("Error fetching Groups:", error);
    return [];
  }
  return data || [];
};
