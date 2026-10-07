import { NextRequest } from "next/server";
import { jsonError, jsonOk, requireAdmin, getErrorMessage } from "@/lib/admin/http";
import { isLocalAdminEnabled, LOCAL_ADMIN_ONLY_MESSAGE } from "@/lib/admin/localOnly";
import { assertCandidateDraftFile } from "@/lib/extraction/candidateDraft";
import { loadCandidateDraftBundle, saveCandidateDraftFile } from "@/lib/extraction/localCandidateDrafts";

export async function GET(request: NextRequest) {
  if (!isLocalAdminEnabled()) {
    return jsonError(LOCAL_ADMIN_ONLY_MESSAGE, 404);
  }

  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const date = request.nextUrl.searchParams.get("date") || undefined;
    return jsonOk(await loadCandidateDraftBundle(date));
  } catch (error) {
    return jsonError(getErrorMessage(error, "候補ドラフトの取得に失敗しました"), 404);
  }
}

export async function PUT(request: NextRequest) {
  if (!isLocalAdminEnabled()) {
    return jsonError(LOCAL_ADMIN_ONLY_MESSAGE, 404);
  }

  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json().catch(() => null)) as { date?: string; draft?: unknown } | null;
    const date = body?.date?.trim();
    if (!date) {
      return jsonError("日付がありません");
    }

    const draft = assertCandidateDraftFile(body?.draft);
    return jsonOk(await saveCandidateDraftFile(date, draft));
  } catch (error) {
    return jsonError(getErrorMessage(error, "候補ドラフトの保存に失敗しました"));
  }
}
