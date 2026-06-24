"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/supabase";

// ── SEO Scoring Engine ─────────────────────────────────────────────────────
type SeoIssue = { label: string; type: "error" | "warning" | "ok" };

function calcSeo(post: Post): { score: number; issues: SeoIssue[] } {
  const issues: SeoIssue[] = [];
  let score = 0;

  const kw = (post.focus_keyword || "").toLowerCase().trim();
  const title = (post.title || "").toLowerCase();
  const excerpt = (post.excerpt || "").trim();
  const content = (post.content || "").replace(/<[^>]+>/g, "").trim();
  const slug = (post.slug || "");

  // 1. Từ khóa chính (20đ)
  if (!kw) {
    issues.push({ label: "Chưa đặt từ khóa chính", type: "error" });
  } else {
    score += 20;
    issues.push({ label: `Từ khóa: "${post.focus_keyword}"`, type: "ok" });
  }

  // 2. Từ khóa trong tiêu đề (20đ)
  if (kw && title.includes(kw)) {
    score += 20;
    issues.push({ label: "Từ khóa có trong tiêu đề", type: "ok" });
  } else if (kw) {
    issues.push({ label: "Tiêu đề chưa chứa từ khóa chính", type: "error" });
  }

  // 3. Mô tả ngắn / meta description (15đ)
  if (!excerpt) {
    issues.push({ label: "Thiếu mô tả ngắn (meta description)", type: "error" });
  } else if (excerpt.length < 120) {
    score += 8;
    issues.push({ label: `Mô tả quá ngắn (${excerpt.length}/160 ký tự)`, type: "warning" });
  } else if (excerpt.length > 160) {
    score += 8;
    issues.push({ label: `Mô tả quá dài (${excerpt.length}/160 ký tự)`, type: "warning" });
  } else {
    score += 15;
    issues.push({ label: `Mô tả đạt chuẩn (${excerpt.length} ký tự)`, type: "ok" });
  }

  // 4. Ảnh bìa (15đ)
  if (!post.cover_image) {
    issues.push({ label: "Thiếu ảnh bìa (cover image)", type: "warning" });
  } else {
    score += 15;
    issues.push({ label: "Có ảnh bìa", type: "ok" });
  }

  // 5. Độ dài nội dung (20đ)
  if (content.length < 300) {
    issues.push({ label: "Nội dung quá ngắn (< 300 ký tự)", type: "error" });
  } else if (content.length < 1000) {
    score += 8;
    issues.push({ label: `Nội dung ngắn (${content.length} ký tự, nên > 1500)`, type: "warning" });
  } else if (content.length < 1500) {
    score += 13;
    issues.push({ label: `Nội dung ${content.length} ký tự (nên > 1500)`, type: "warning" });
  } else {
    score += 20;
    issues.push({ label: `Nội dung đủ dài (${content.length.toLocaleString()} ký tự)`, type: "ok" });
  }

  // 6. Slug ngắn gọn (10đ)
  if (slug.length > 60) {
    issues.push({ label: "Slug URL quá dài (nên < 60 ký tự)", type: "warning" });
  } else if (slug.length > 0) {
    score += 10;
    issues.push({ label: "Slug URL đạt chuẩn", type: "ok" });
  }

  return { score: Math.min(score, 100), issues };
}

function SeoCircle({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const bg    = score >= 70 ? "#f0fdf4" : score >= 40 ? "#fffbeb" : "#fef2f2";
  const r = 14, c = 16, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-0.5" style={{ minWidth: 56 }}>
      <div className="relative" style={{ width: 32, height: 32 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: "rotate(-90deg)" }}>
          <circle cx={c} cy={c} r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold" style={{ color }}>
          {score}
        </span>
      </div>
      <span className="text-[10px] font-semibold" style={{ color }}>
        {score >= 70 ? "Tốt" : score >= 40 ? "Ổn" : "Yếu"}
      </span>
    </div>
  );
}

// ── SEO Tooltip ────────────────────────────────────────────────────────────
function SeoTooltip({ issues, score }: { issues: SeoIssue[]; score: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="focus:outline-none">
        <SeoCircle score={score} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-4 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-800">Phân tích SEO</h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                score >= 70 ? "bg-green-100 text-green-700" : score >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
              }`}>{score}/100</span>
            </div>
            {issues.map((issue, i) => (
              <div key={i} className={`flex items-start gap-2 text-xs py-1.5 px-2 rounded-md ${
                issue.type === "ok"      ? "bg-green-50 text-green-700"
                : issue.type === "warning" ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-red-700"
              }`}>
                <span className="flex-shrink-0 mt-0.5">
                  {issue.type === "ok" ? "✅" : issue.type === "warning" ? "⚠️" : "❌"}
                </span>
                <span>{issue.label}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
              Nhấp "Sửa" để cải thiện điểm SEO
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Category badge ─────────────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  seo: "bg-green-100 text-green-700 border-green-200",
  ads: "bg-blue-100 text-blue-700 border-blue-200",
  "google-ads": "bg-blue-100 text-blue-700 border-blue-200",
  "facebook-ads": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "tiktok-ads": "bg-pink-100 text-pink-700 border-pink-200",
  website: "bg-violet-100 text-violet-700 border-violet-200",
  tips: "bg-orange-100 text-orange-700 border-orange-200",
};

// ── Main page ──────────────────────────────────────────────────────────────
export default function PostsAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const load = async () => {
    const res = await fetch("/api/admin/posts");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa bài "${title}"?`)) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    await load();
  };

  const handleToggleStatus = async (post: Post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    await load();
  };

  const filtered = posts.filter(p =>
    filter === "all" ? true : p.status === filter
  );
  const published = posts.filter(p => p.status === "published").length;
  const drafts    = posts.filter(p => p.status === "draft").length;
  const avgSeo    = posts.length
    ? Math.round(posts.reduce((s, p) => s + calcSeo(p).score, 0) / posts.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bài viết</h1>
            <p className="text-sm text-gray-500 mt-0.5">Quản lý nội dung blog & SEO</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Viết bài mới
          </Link>
        </div>

        {/* Stats bar */}
        {posts.length > 0 && (
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-gray-600 font-medium">{posts.length} bài viết</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-600">{published} đã đăng</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="text-gray-600">{drafts} bản nháp</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm ml-auto">
              <span className="text-gray-500">Điểm SEO trung bình:</span>
              <span className={`font-bold text-sm ${avgSeo >= 70 ? "text-green-600" : avgSeo >= 40 ? "text-amber-600" : "text-red-600"}`}>
                {avgSeo}/100
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Filter tabs ── */}
      {posts.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex gap-0">
            {([
              { key: "all",       label: `Tất cả (${posts.length})` },
              { key: "published", label: `Đã đăng (${published})` },
              { key: "draft",     label: `Bản nháp (${drafts})` },
            ] as const).map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  filter === f.key
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className="px-6 py-5">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Đang tải bài viết...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-500 mb-6 text-base">Chưa có bài viết nào. Bắt đầu viết thôi!</p>
            <Link href="/admin/posts/new"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Viết bài đầu tiên
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_80px_56px_100px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Bài viết</span>
              <span className="text-center">Danh mục</span>
              <span className="text-center">SEO</span>
              <span className="text-right">Ngày</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {filtered.map((post) => {
                const { score, issues } = calcSeo(post);
                const catKey = (post.category || "").toLowerCase().replace(/\s+/g, "-");
                const catClass = CAT_COLOR[catKey] || "bg-gray-100 text-gray-600 border-gray-200";

                return (
                  <div key={post.id} className="grid grid-cols-[1fr_80px_56px_100px] gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group items-center">

                    {/* Col 1: Title + meta */}
                    <div className="min-w-0">
                      <div className="flex items-start gap-2.5 flex-wrap">
                        <Link href={`/admin/posts/${post.id}`}
                          className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors leading-snug">
                          {post.title}
                        </Link>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border flex-shrink-0 ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}>
                          {post.status === "published" ? "● Đã đăng" : "○ Nháp"}
                        </span>
                      </div>

                      {/* Keyword + excerpt preview */}
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        {post.focus_keyword ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-medium rounded-full">
                            🎯 {post.focus_keyword}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-200 text-red-500 text-[11px] font-medium rounded-full">
                            ❌ Chưa có từ khóa
                          </span>
                        )}
                        {post.excerpt && (
                          <span className="text-xs text-gray-400 truncate max-w-xs hidden lg:block">
                            {post.excerpt.substring(0, 80)}{post.excerpt.length > 80 ? "…" : ""}
                          </span>
                        )}
                      </div>

                      {/* Actions — show on hover */}
                      <div className="mt-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/posts/${post.id}`}
                          className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-200">
                          Sửa
                        </Link>
                        <span className="text-gray-300">|</span>
                        <a href={`/blog/${post.slug}`} target="_blank"
                          className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors border border-transparent hover:border-gray-200">
                          Xem
                        </a>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => handleToggleStatus(post)}
                          className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors border border-transparent hover:border-gray-200">
                          {post.status === "published" ? "→ Nháp" : "→ Đăng"}
                        </button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => handleDelete(post.id, post.title)}
                          className="px-2.5 py-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-200">
                          Xóa
                        </button>
                        <span className="text-gray-300 ml-1">|</span>
                        <span className="text-xs text-gray-400 ml-1">/{post.slug}</span>
                      </div>
                    </div>

                    {/* Col 2: Category */}
                    <div className="flex justify-center">
                      {post.category ? (
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${catClass} text-center leading-tight`}>
                          {post.category}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </div>

                    {/* Col 3: SEO score */}
                    <div className="flex justify-center">
                      <SeoTooltip issues={issues} score={score} />
                    </div>

                    {/* Col 4: Date */}
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" })}
                      </p>
                      {post.updated_at && post.updated_at !== post.created_at && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Sửa {new Date(post.updated_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", timeZone: "Asia/Ho_Chi_Minh" })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SEO Tips panel ── */}
        {posts.length > 0 && (
          <div className="mt-5 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">📊 Tổng quan SEO & Backlink</h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                avgSeo >= 70 ? "bg-green-100 text-green-700" : avgSeo >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
              }`}>
                Điểm TB: {avgSeo}/100
              </span>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* SEO On-page */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🔍</span>
                  <h4 className="text-sm font-semibold text-blue-800">SEO On-page</h4>
                </div>
                <div className="space-y-1.5">
                  <div className={`flex items-center gap-1.5 text-xs ${posts.filter(p => p.focus_keyword).length === posts.length ? "text-green-700" : "text-amber-700"}`}>
                    <span>{posts.filter(p => p.focus_keyword).length === posts.length ? "✅" : "⚠️"}</span>
                    <span>{posts.filter(p => p.focus_keyword).length}/{posts.length} bài có từ khóa chính</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${posts.filter(p => p.excerpt).length === posts.length ? "text-green-700" : "text-amber-700"}`}>
                    <span>{posts.filter(p => p.excerpt).length === posts.length ? "✅" : "⚠️"}</span>
                    <span>{posts.filter(p => p.excerpt).length}/{posts.length} bài có meta description</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${posts.filter(p => p.cover_image).length === posts.length ? "text-green-700" : "text-amber-700"}`}>
                    <span>{posts.filter(p => p.cover_image).length === posts.length ? "✅" : "⚠️"}</span>
                    <span>{posts.filter(p => p.cover_image).length}/{posts.length} bài có ảnh bìa</span>
                  </div>
                </div>
              </div>

              {/* Backlink */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🔗</span>
                  <h4 className="text-sm font-semibold text-purple-800">Backlink</h4>
                </div>
                <div className="space-y-1.5 text-xs text-purple-700">
                  <p>Kiểm tra backlink qua công cụ:</p>
                  <a href="https://ahrefs.com/backlink-checker" target="_blank" rel="noopener"
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium hover:underline">
                    → Ahrefs Free Checker ↗
                  </a>
                  <a href="https://search.google.com/search-console" target="_blank" rel="noopener"
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium hover:underline">
                    → Google Search Console ↗
                  </a>
                  <a href="https://moz.com/link-explorer" target="_blank" rel="noopener"
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium hover:underline">
                    → Moz Link Explorer ↗
                  </a>
                </div>
              </div>

              {/* Rank / Top Google */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🏆</span>
                  <h4 className="text-sm font-semibold text-green-800">Top Google</h4>
                </div>
                <div className="space-y-1.5 text-xs text-green-700">
                  <p>Kiểm tra thứ hạng từ khóa:</p>
                  <a href={`https://www.google.com/search?q=site:sonxinchao.com`} target="_blank" rel="noopener"
                    className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium hover:underline">
                    → Google: site:sonxinchao.com ↗
                  </a>
                  <a href="https://search.google.com/search-console" target="_blank" rel="noopener"
                    className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium hover:underline">
                    → Google Search Console ↗
                  </a>
                  <a href="https://www.google.com/webmasters/tools/submit-url" target="_blank" rel="noopener"
                    className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium hover:underline">
                    → Submit URL to Google ↗
                  </a>
                </div>
              </div>

            </div>

            {/* Improvement tips */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 mb-2">💡 Cải thiện điểm SEO nhanh:</p>
              <div className="flex flex-wrap gap-2">
                {posts.some(p => !p.focus_keyword) && (
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-full border border-red-200">
                    ❌ {posts.filter(p => !p.focus_keyword).length} bài chưa có từ khóa chính → Sửa ngay
                  </span>
                )}
                {posts.some(p => !p.excerpt) && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full border border-amber-200">
                    ⚠️ {posts.filter(p => !p.excerpt).length} bài thiếu meta description
                  </span>
                )}
                {posts.some(p => !p.cover_image) && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full border border-amber-200">
                    ⚠️ {posts.filter(p => !p.cover_image).length} bài thiếu ảnh bìa
                  </span>
                )}
                {posts.every(p => p.focus_keyword && p.excerpt && p.cover_image) && (
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                    ✅ Tất cả bài đã đủ thông tin SEO cơ bản
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
