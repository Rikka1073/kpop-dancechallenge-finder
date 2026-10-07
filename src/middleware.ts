import { NextRequest, NextResponse } from "next/server";
import { isLocalAdminEnabled, LOCAL_ADMIN_ONLY_MESSAGE } from "@/lib/admin/localOnly";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isLocalAdminEnabled()) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ ok: false, error: LOCAL_ADMIN_ONLY_MESSAGE }, { status: 404 });
    }
    return new NextResponse(LOCAL_ADMIN_ONLY_MESSAGE, {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const isPublicAdminPath = pathname === "/admin/login" || pathname === "/api/admin/login";

  if (isPublicAdminPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isValid = await verifySessionToken(token);

  if (isValid) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "ログインが必要です" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
