"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/analytics", label: "Phân tích", icon: "📈" },
  { href: "/admin/posts", label: "Bài viết", icon: "📝" },
  { href: "/admin/categories", label: "Danh mục", icon: "🏷️" },
  { href: "/admin/media", label: "Thư viện ảnh", icon: "🖼️" },
  { href: "/admin/portfolio", label: "Portfolio", icon: "🗂️" },
  { href: "/admin/ai-tools", label: "Công cụ AI", icon: "🤖" },
  { href: "/admin/pricing", label: "Bảng giá", icon: "💰" },
  { href: "/admin/addons", label: "Dịch vụ bổ sung", icon: "➕" },
  { href: "/admin/speed-cache", label: "Speed & Cache", icon: "⚡" },
  { href: "/admin/settings", label: "Cài đặt trang", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin";

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  };

  if (isLoginPage) return <>{children}</>;

  return (
    <div data-admin="true" className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
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
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5 space-y-2">
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

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
