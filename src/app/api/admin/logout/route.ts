import { ADMIN_COOKIE_NAME } from "@/lib/admin/session";
import { jsonOk } from "@/lib/admin/http";

export const runtime = "edge";

export async function POST() {
  const response = jsonOk({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
