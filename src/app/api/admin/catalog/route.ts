import { NextRequest } from "next/server";
import { jsonError, jsonOk, requireAdmin, getErrorMessage } from "@/lib/admin/http";
import {
  createGroup,
  createSong,
  getAdminGroups,
  getAdminSongs,
  updateGroup,
  updateSong,
} from "@/lib/supabase/registerSupabaseFunction";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const [groups, songs] = await Promise.all([getAdminGroups(), getAdminSongs()]);
    return jsonOk({ groups, songs });
  } catch (error) {
    return jsonError(getErrorMessage(error, "マスターデータの取得に失敗しました"), 500);
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  const body = (await request.json().catch(() => null)) as {
    type?: "group" | "song";
    name?: string;
    displayOrder?: number | null;
  } | null;

  const name = body?.name?.trim();
  if (!name) {
    return jsonError("名前を入力してください");
  }

  try {
    if (body?.type === "group") {
      const group = await createGroup(name, body.displayOrder ?? null);
      return jsonOk(group);
    }
    if (body?.type === "song") {
      const song = await createSong(name);
      return jsonOk(song);
    }
    return jsonError("type は group または song を指定してください");
  } catch (error) {
    return jsonError(getErrorMessage(error, "マスターデータの追加に失敗しました"));
  }
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) {
    return unauthorized;
  }

  const body = (await request.json().catch(() => null)) as {
    type?: "group" | "song";
    id?: string;
    name?: string;
    display?: boolean;
    displayOrder?: number | null;
  } | null;

  if (!body?.id || !body.type) {
    return jsonError("id と type が必要です");
  }

  try {
    if (body.type === "group") {
      const group = await updateGroup(body.id, {
        ...(body.name ? { group_name: body.name.trim() } : {}),
        ...(typeof body.display === "boolean" ? { display: body.display } : {}),
        ...(body.displayOrder !== undefined ? { display_order: body.displayOrder } : {}),
      });
      return jsonOk(group);
    }

    const song = await updateSong(body.id, {
      ...(body.name ? { song_name: body.name.trim() } : {}),
      ...(typeof body.display === "boolean" ? { display: body.display } : {}),
    });
    return jsonOk(song);
  } catch (error) {
    return jsonError(getErrorMessage(error, "マスターデータの更新に失敗しました"));
  }
}
