import { NextRequest } from "next/server";
import { jsonError, jsonOk, requireAdmin, getErrorMessage } from "@/lib/admin/http";
import { fetchYouTubeVideoSnapshot } from "@/lib/youtube/fetchYouTubeVideo";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  const url = request.nextUrl.searchParams.get("url") || "";
  try {
    const data = await fetchYouTubeVideoSnapshot(url);
    return jsonOk(data);
  } catch (error) {
    return jsonError(getErrorMessage(error, "動画情報の取得に失敗しました"));
  }
}
