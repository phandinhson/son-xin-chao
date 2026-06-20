import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

// Các route chỉ admin mới được vào
const ADMIN_ONLY_ROUTES = [
  "/admin/analytics",
  "/admin/portfolio",
  "/admin/pricing",
  "/admin/addons",
  "/admin/ai-tools",
  "/admin/speed-cache",
  "/admin/settings",
  "/admin/gioi-thieu",
  "/admin/users",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin";
  const token = request.cookies.get("admin_session")?.value;

  // Chưa có token → về trang login (trừ khi đang ở login page)
  if (!token) {
    if (isLoginPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Verify JWT
  const payload = await verifyAdminToken(token);

  if (!payload) {
    // Token hết hạn hoặc không hợp lệ → logout + về login
    if (isLoginPage) return NextResponse.next();
    const res = NextResponse.redirect(new URL("/admin", request.url));
    res.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
    return res;
  }

  // Đã login + vào trang login → redirect về dashboard
  if (isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Kiểm tra quyền: role "user" không được vào admin-only routes
  if (payload.role === "user") {
    const blocked = ADMIN_ONLY_ROUTES.some((r) => pathname.startsWith(r));
    if (blocked) {
      return NextResponse.redirect(new URL("/admin/posts", request.url));
    }
  }

  // Truyền thông tin user qua header cho server components (nếu cần)
  const res = NextResponse.next();
  res.headers.set("x-admin-role", payload.role);
  res.headers.set("x-admin-name", encodeURIComponent(payload.name));
  res.headers.set("x-admin-email", payload.email);
  res.headers.set("x-admin-id", payload.userId);
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
