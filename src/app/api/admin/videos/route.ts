import { NextRequest } from "next/server";
import { jsonError, jsonOk, requireAdmin, getErrorMessage } from "@/lib/admin/http";
import {
  deleteVideo,
  getAdminVideoById,
  getAdminVideos,
  replaceVideoTags,
  setVideoDisplay,
  updateVideoStats,
  upsertVideoWithTags,
} from "@/lib/supabase/registerSupabaseFunction";
import { fetchYouTubeVideoSnapshot } from "@/lib/youtube/fetchYouTubeVideo";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const videos = await getAdminVideos();
    return jsonOk(videos);
  } catch (error) {
    return jsonError(getErrorMessage(error, "動画一覧の取得に失敗しました"), 500);
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  const body = (await request.json().catch(() => null)) as {
    youtubeUrl?: string;
    groupIds?: string[];
    songIds?: string[];
  } | null;

  try {
    const snapshot = await fetchYouTubeVideoSnapshot(body?.youtubeUrl || "");
    const video = await upsertVideoWithTags(
      {
        id: snapshot.youtubeId,
        title: snapshot.title,
        thumbnailUrl: snapshot.thumbnailUrl,
        viewCount: snapshot.viewCount,
      },
      body?.groupIds || [],
      body?.songIds || []
    );
    return jsonOk(video);
  } catch (error) {
    return jsonError(getErrorMessage(error, "動画の登録に失敗しました"));
  }
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    display?: boolean;
    groupIds?: string[];
    songIds?: string[];
    refreshStats?: boolean;
  } | null;

  if (!body?.id) {
    return jsonError("動画IDが必要です");
  }

  try {
    if (body.refreshStats) {
      const current = await getAdminVideoById(body.id);
      const snapshot = await fetchYouTubeVideoSnapshot(current.youtube_id);
      const updated = await updateVideoStats(body.id, {
        title: snapshot.title,
        thumbnailUrl: snapshot.thumbnailUrl,
        viewCount: snapshot.viewCount,
      });
      return jsonOk(updated);
    }

    if (typeof body.display === "boolean") {
      const updated = await setVideoDisplay(body.id, body.display);
      return jsonOk(updated);
    }

    if (body.groupIds || body.songIds) {
      const current = await getAdminVideoById(body.id);
      const groupIds = body.groupIds ?? current.video_groups?.map((item) => item.groups?.id).filter(Boolean) ?? [];
      const songIds = body.songIds ?? current.video_songs?.map((item) => item.songs?.id).filter(Boolean) ?? [];
      await replaceVideoTags(body.id, groupIds as string[], songIds as string[]);
      const updated = await getAdminVideoById(body.id);
      return jsonOk(updated);
    }

    return jsonError("更新内容が指定されていません");
  } catch (error) {
    return jsonError(getErrorMessage(error, "動画の更新に失敗しました"));
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) {
    return jsonError("動画IDが必要です");
  }

  try {
    await deleteVideo(body.id);
    return jsonOk({ id: body.id });
  } catch (error) {
    return jsonError(getErrorMessage(error, "動画の削除に失敗しました"));
  }
}
