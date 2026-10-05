import { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SEC,
  createSessionToken,
  isAdminConfigured,
  verifyAdminPassword,
} from "@/lib/admin/session";
import { jsonError, jsonOk } from "@/lib/admin/http";

export const runtime = "edge";

export async function GET() {
  return jsonOk({ configured: isAdminConfigured() });
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return jsonError("ADMIN_PASSWORD がサーバーに設定されていません", 503);
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password?.trim() || "";
  if (!verifyAdminPassword(password)) {
    return jsonError("パスワードが正しくありません", 401);
  }

  const token = await createSessionToken();
  const response = jsonOk({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SEC,
  });
  return response;
}
