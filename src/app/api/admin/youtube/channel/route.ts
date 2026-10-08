import { NextRequest } from "next/server";
import { jsonError, jsonOk, requireAdmin, getErrorMessage } from "@/lib/admin/http";
import { fetchYouTubeChannelSnapshot } from "@/lib/youtube/fetchYouTubeChannel";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  const url = request.nextUrl.searchParams.get("url") || "";
  try {
    const data = await fetchYouTubeChannelSnapshot(url);
    return jsonOk(data);
  } catch (error) {
    return jsonError(getErrorMessage(error, "チャンネル情報の取得に失敗しました"));
  }
}
