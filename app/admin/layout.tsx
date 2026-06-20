"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type Me = { userId: string; email: string; name: string; role: "admin" | "user"; avatar_url?: string | null };

// Nav items với trường "roles" — undefined = tất cả
const NAV_ITEMS = [
  { href: "/admin/dashboard",    label: "Dashboard",        icon: "📊",  roles: undefined },
  { href: "/admin/analytics",    label: "Phân tích",        icon: "📈",  roles: ["admin"] },
  { href: "/admin/posts",        label: "Bài viết",         icon: "📝",  roles: undefined },
  { href: "/admin/categories",   label: "Danh mục",         icon: "🏷️",  roles: undefined },
  { href: "/admin/media",        label: "Thư viện ảnh",     icon: "🖼️",  roles: undefined },
  { href: "/admin/gioi-thieu",   label: "Giới thiệu",       icon: "👤",  roles: ["admin"] },
  { href: "/admin/facebook-ads", label: "Facebook Ads",     icon: "📣",  roles: undefined },
  { href: "/admin/portfolio",    label: "Portfolio",        icon: "🗂️",  roles: ["admin"] },
  { href: "/admin/ai-tools",     label: "Công cụ AI",       icon: "🤖",  roles: ["admin"] },
  { href: "/admin/pricing",      label: "Bảng giá & Add-on",icon: "💰",  roles: ["admin"] },
  { href: "/admin/speed-cache",  label: "Speed & Cache",    icon: "⚡",  roles: ["admin"] },
  { href: "/admin/settings",     label: "Cài đặt trang",    icon: "⚙️",  roles: ["admin"] },
  { href: "/admin/users",        label: "Tài khoản",        icon: "👥",  roles: ["admin"] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const isLogin   = pathname === "/admin";

  const [me, setMe]             = useState<Me | null>(null);
  const [meLoaded, setMeLoaded] = useState(false);

  useEffect(() => {
    if (isLogin) { setMeLoaded(true); return; }
    // Dùng /api/admin/profile để lấy thêm avatar_url
    fetch("/api/admin/profile")
      .then(r => r.ok ? r.json() : null)
      .then(data => { setMe(data); setMeLoaded(true); });
  }, [isLogin]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  };

  if (isLogin) return <>{children}</>;

  // Lọc nav theo role
  const visibleNav = meLoaded && me
    ? NAV_ITEMS.filter(item => !item.roles || item.roles.includes(me.role))
    : NAV_ITEMS; // hiển thị tất cả khi chưa load (tránh flash)

  const initials = me?.name
    ? me.name.split(" ").map(w => w[0]).slice(-2).join("").toUpperCase()
    : "?";

  return (
    <div data-admin="true" className="min-h-screen bg-gray-950 flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div>
              <div className="text-white font-bold text-sm">Sơn Xin Chào</div>
              <div className="text-gray-500 text-xs">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {visibleNav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom — User info + logout */}
        <div className="p-4 border-t border-white/5 space-y-2">
          {/* Current user badge — click to go to profile */}
          {me && (
            <Link
              href="/admin/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all mb-1 group"
              title="Chỉnh sửa hồ sơ"
            >
              {me.avatar_url ? (
                <img
                  src={me.avatar_url}
                  alt={me.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-white/20"
                />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0
                  ${me.role === "admin"
                    ? "bg-gradient-to-br from-blue-500 to-violet-600"
                    : "bg-gradient-to-br from-emerald-500 to-teal-600"
                  }`}>
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-white text-xs font-semibold truncate group-hover:text-blue-300 transition-colors">{me.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide
                    ${me.role === "admin"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                    {me.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>
              </div>
              <span className="text-gray-600 group-hover:text-gray-400 text-xs transition-colors">✏️</span>
            </Link>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>🌐</span> Xem website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <span>🚪</span> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
