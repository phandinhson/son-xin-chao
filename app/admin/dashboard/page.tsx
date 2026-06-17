"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = { posts: number; portfolio: number; pricing: number };

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ posts: 0, portfolio: 0, pricing: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [posts, portfolio, pricing] = await Promise.all([
        fetch("/api/admin/posts").then((r) => r.json()),
        fetch("/api/admin/portfolio").then((r) => r.json()),
        fetch("/api/admin/pricing").then((r) => r.json()),
      ]);
      setStats({
        posts: Array.isArray(posts) ? posts.length : 0,
        portfolio: Array.isArray(portfolio) ? portfolio.length : 0,
        pricing: Array.isArray(pricing) ? pricing.length : 0,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Bài viết", value: stats.posts, icon: "📝", href: "/admin/posts", color: "from-blue-600 to-cyan-500" },
    { label: "Portfolio", value: stats.portfolio, icon: "🗂️", href: "/admin/portfolio", color: "from-violet-600 to-pink-500" },
    { label: "Gói dịch vụ", value: stats.pricing, icon: "💰", href: "/admin/pricing", color: "from-emerald-600 to-teal-500" },
  ];

  const quickActions = [
    { label: "Viết bài mới", icon: "✏️", href: "/admin/posts/new" },
    { label: "Thêm dự án", icon: "➕", href: "/admin/portfolio" },
    { label: "Sửa bảng giá", icon: "💸", href: "/admin/pricing" },
    { label: "Cài đặt trang", icon: "⚙️", href: "/admin/settings" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Chào mừng trở lại, Sơn! 👋</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="relative overflow-hidden p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`} />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm mb-1">{card.label}</div>
                <div className="text-4xl font-bold text-white">
                  {loading ? "..." : card.value}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
              Xem chi tiết →
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-blue-500/30 transition-all text-center group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{action.icon}</span>
              <span className="text-sm text-gray-300 font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Info boxes */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20">
          <h3 className="text-white font-semibold mb-2">🚀 Hướng dẫn setup Supabase</h3>
          <ol className="text-gray-400 text-sm space-y-1.5 list-decimal list-inside">
            <li>Tạo account tại <span className="text-blue-400">supabase.com</span></li>
            <li>Tạo project mới (chọn region Singapore)</li>
            <li>Vào SQL Editor, chạy file <code className="text-blue-300">supabase/schema.sql</code></li>
            <li>Copy URL + Keys vào <code className="text-blue-300">.env.local</code></li>
            <li>Restart server: <code className="text-blue-300">npm run dev</code></li>
          </ol>
        </div>
        <div className="p-6 rounded-2xl bg-violet-600/10 border border-violet-500/20">
          <h3 className="text-white font-semibold mb-2">💡 Mẹo sử dụng</h3>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• Bài viết <span className="text-violet-400">draft</span> không hiển thị ngoài web</li>
            <li>• Thay đổi <span className="text-violet-400">Cài đặt trang</span> áp dụng ngay lập tức</li>
            <li>• Sắp xếp Portfolio theo <span className="text-violet-400">sort_order</span></li>
            <li>• Gói <span className="text-violet-400">is_popular</span> hiển thị badge nổi bật</li>
            <li>• Link website mở tab mới để preview</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
