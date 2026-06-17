import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  const isLoginPage = request.nextUrl.pathname === "/admin";

  // Nếu đã login và vào trang login → redirect về dashboard
  if (session && session === process.env.ADMIN_SECRET && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Nếu chưa login và vào trang admin (không phải login page) → redirect về login
  if (!isLoginPage && (!session || session !== process.env.ADMIN_SECRET)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
