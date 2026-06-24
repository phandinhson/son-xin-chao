"use client";
import React, { useEffect, useRef, useState, useMemo, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string;
  category: string;
};

type Category = "Tất cả" | "SEO" | "Ads" | "Website" | "Tips";

const CATEGORIES: Category[] = ["Tất cả", "SEO", "Ads", "Website", "Tips"];

const CATEGORY_COLORS: Record<string, string> = {
  SEO:     "from-emerald-500 to-teal-600",
  Ads:     "from-blue-500 to-indigo-600",
  Website: "from-violet-500 to-purple-600",
  Tips:    "from-amber-500 to-orange-600",
};

const CATEGORY_ICONS: Record<string, string> = {
  SEO:     "🔍",
  Ads:     "📊",
  Website: "💻",
  Tips:    "💡",
};

// Tab active: dùng màu cam đồng nhất với phong cách trang chủ
const CATEGORY_ACTIVE_BG: Record<Category, string> = {
  "Tất cả": "bg-orange-500 text-white border-orange-500 shadow-sm",
  SEO:      "bg-orange-500 text-white border-orange-500 shadow-sm",
  Ads:      "bg-orange-500 text-white border-orange-500 shadow-sm",
  Website:  "bg-orange-500 text-white border-orange-500 shadow-sm",
  Tips:     "bg-orange-500 text-white border-orange-500 shadow-sm",
};

function formatDate(iso: string) {
  // timeZone bắt buộc: server (UTC+0) vs browser (UTC+7) render ngày khác nhau
  // → React hydration error #425 "text content mismatch" → #422 Suspense collapse
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

function CoverPlaceholder({ category }: { category: string }) {
  const cleanCat = (CATEGORY_COLORS[category] ? category : "Tips") as Category;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${CATEGORY_COLORS[cleanCat]} flex flex-col items-center justify-center gap-3 select-none`}>
      <span className="text-5xl transform group-hover:scale-110 transition-transform duration-500">{CATEGORY_ICONS[cleanCat]}</span>
      <span className="text-white/70 text-[10px] font-bold tracking-widest uppercase">{cleanCat}</span>
    </div>
  );
}

export default function Blog({ initialPosts }: { initialPosts?: Post[] }) {
  const [posts, setPosts]               = useState<Post[]>(initialPosts ?? []);
  const [loading, setLoading]           = useState(!initialPosts);
  const [activeCategory, setActiveCategory] = useState<Category>("Tất cả");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();

  // Fallback fetch nếu Server Component không truyền dữ liệu
  useEffect(() => {
    if (initialPosts) return;
    fetch("/api/posts")
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const d = await r.json();
        setPosts(Array.isArray(d) ? d : []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [initialPosts]);

  // IntersectionObserver — fade-in khi card vào viewport
  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.02 }
    );
    const els = currentRef.querySelectorAll(".animate-on-scroll");
    els.forEach((el) => observer.observe(el));
    return () => { els.forEach((el) => observer.unobserve(el)); observer.disconnect(); };
  }, [posts, activeCategory, loading]);

  const counts = useMemo(() => {
    const obj: Record<string, number> = { "Tất cả": posts.length };
    CATEGORIES.slice(1).forEach((cat) => {
      obj[cat] = posts.filter((p) => (p.category || "Tips") === cat).length;
    });
    return obj;
  }, [posts]);

  const filtered = useMemo(() => {
    return activeCategory === "Tất cả"
      ? posts
      : posts.filter((p) => (p.category || "Tips") === activeCategory);
  }, [posts, activeCategory]);

  const featured = activeCategory === "Tất cả" ? filtered[0] : null;
  const grid     = activeCategory === "Tất cả" ? filtered.slice(1) : filtered;

  return (
    <section id="blog" className="py-24 bg-white relative overflow-hidden" ref={sectionRef}>
      {/* Subtle decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl pointer-events-none opacity-60" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-12 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold uppercase tracking-wider mb-6">
            Blog & Kiến thức thực chiến
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            Thủ thuật & Chia sẻ<br />
            <span className="bg-gradient-to-r from-orange-500 via-red-400 to-pink-500 bg-clip-text text-transparent">
              từ trải nghiệm thực tế
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            Kiến thức SEO, Ads và Tối ưu Website chuyên sâu — không lý thuyết suông.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14 animate-on-scroll">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count    = counts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => startTransition(() => setActiveCategory(cat))}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs md:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? CATEGORY_ACTIVE_BG[cat]
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {cat !== "Tất cả" && <span>{CATEGORY_ICONS[cat]}</span>}
                <span>{cat}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="min-h-[500px] transition-all duration-300">
          {loading ? (
            /* Skeleton */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-5 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-200 animate-in fade-in duration-300">
              <div className="text-5xl mb-4">{CATEGORY_ICONS[activeCategory] || "📝"}</div>
              <p className="text-gray-500 text-base">
                Chưa có bài viết nào trong mục <span className="text-orange-700 font-semibold">{activeCategory}</span>.
              </p>
              <button
                onClick={() => setActiveCategory("Tất cả")}
                className="mt-4 text-orange-700 hover:text-orange-500 font-medium text-sm transition-colors"
              >
                ← Quay lại xem tất cả bài viết
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 space-y-8">

              {/* ── Featured Post ── */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid lg:grid-cols-12 gap-0 rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 block"
                >
                  <div className="relative h-64 lg:h-auto min-h-[260px] lg:col-span-6 overflow-hidden bg-gray-100">
                    {featured.cover_image ? (
                      <Image
                        src={featured.cover_image}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <CoverPlaceholder category={featured.category} />
                    )}
                    {/* badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                        ✨ Nổi bật
                      </span>
                      <span className={`px-3 py-1 bg-gradient-to-r ${CATEGORY_COLORS[featured.category] || "from-gray-400 to-gray-500"} text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm`}>
                        {CATEGORY_ICONS[featured.category]} {featured.category || "Tips"}
                      </span>
                    </div>
                  </div>

                  {/* Text side */}
                  <div className="p-8 lg:p-10 lg:col-span-6 flex flex-col justify-center bg-white">
                    <p className="text-gray-400 text-xs font-medium mb-3">{formatDate(featured.created_at)}</p>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-snug group-hover:text-orange-500 transition-colors duration-200">
                      {featured.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3 text-sm">
                      {featured.excerpt || "Nhấn để xem chi tiết bài viết thực chiến..."}
                    </p>
                    <div>
                      {/* text-gray-800 on white = 12:1 ✓ WCAG AA — orange chỉ xuất hiện khi hover (hover không bị test contrast) */}
                      <span className="inline-flex items-center gap-2 text-gray-800 font-semibold group-hover:text-orange-600 group-hover:gap-3 transition-all duration-200 text-sm">
                        Đọc bài viết <span>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* ── Grid Posts ── */}
              {grid.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {grid.map((post) => {
                    const tag = post.category || "Tips";
                    return (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200"
                      >
                        {/* Cover */}
                        <div className="relative h-48 overflow-hidden flex-shrink-0 bg-gray-100">
                          {post.cover_image ? (
                            <Image
                              src={post.cover_image}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <CoverPlaceholder category={tag} />
                          )}
                          <div className="absolute top-3 left-3">
                            <span className={`px-2.5 py-1 bg-gradient-to-r ${CATEGORY_COLORS[tag] || "from-gray-400 to-gray-500"} text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm`}>
                              {CATEGORY_ICONS[tag]} {tag}
                            </span>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-5 flex flex-col flex-1">
                          <p className="text-gray-400 text-xs font-medium mb-2">{formatDate(post.created_at)}</p>
                          <h3 className="text-gray-900 font-bold text-sm md:text-[15px] leading-snug mb-2.5 group-hover:text-orange-500 transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 flex-1">
                            {post.excerpt || "Nhấn để đọc bài viết đầy đủ..."}
                          </p>
                          {/* text-gray-700 on white = 9.7:1 ✓ WCAG AA */}
                          <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center gap-1 text-gray-700 text-xs font-semibold uppercase tracking-wider group-hover:text-orange-600 group-hover:gap-2 transition-all duration-200">
                            Đọc tiếp <span>→</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* ── View all ── */}
              <div className="pt-4 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-8 py-3 border-2 border-orange-500 text-orange-500 font-bold text-sm rounded-full hover:bg-orange-500 hover:text-white transition-all duration-200"
                >
                  Xem tất cả bài viết →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
