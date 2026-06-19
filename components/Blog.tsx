"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string;
};

type Category = "Tất cả" | "SEO" | "Ads" | "Website" | "Tips";

const CATEGORIES: Category[] = ["Tất cả", "SEO", "Ads", "Website", "Tips"];

const CATEGORY_COLORS: Record<string, string> = {
  SEO: "from-green-500 to-emerald-600",
  Ads: "from-blue-500 to-cyan-600",
  Website: "from-violet-500 to-purple-600",
  Tips: "from-orange-500 to-amber-600",
};

const CATEGORY_ICONS: Record<string, string> = {
  SEO: "🔍",
  Ads: "📊",
  Website: "💻",
  Tips: "💡",
};

const CATEGORY_ACTIVE_STYLE: Record<string, string> = {
  "Tất cả": "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20",
  SEO: "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20",
  Ads: "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20",
  Website: "bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/20",
  Tips: "bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/20",
};

function getTag(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("seo")) return "SEO";
  if (t.includes("ads") || t.includes("quảng cáo") || t.includes("marketing")) return "Ads";
  if (t.includes("website") || t.includes("wordpress") || t.includes("web")) return "Website";
  return "Tips";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function CoverPlaceholder({ title }: { title: string }) {
  const tag = getTag(title);
  const color = CATEGORY_COLORS[tag];
  return (
    <div className={`w-full h-full bg-gradient-to-br ${color} flex flex-col items-center justify-center gap-3`}>
      <span className="text-5xl">{CATEGORY_ICONS[tag]}</span>
      <span className="text-white/70 text-xs font-bold tracking-widest uppercase">{tag}</span>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("Tất cả");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch dữ liệu từ API sạch sẽ
  useEffect(() => {
    fetch("/api/posts")
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const d = await r.json();
        setPosts(Array.isArray(d) ? d : []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  // Lắng nghe hiệu ứng cuộn mượt mà
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    const els = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [posts, activeCategory]);

  // Tối ưu hiệu năng đếm số lượng bằng useMemo, tránh re-render tính lại từ đầu
  const counts = useMemo(() => {
    const obj: Record<string, number> = { "Tất cả": posts.length };
    CATEGORIES.slice(1).forEach((cat) => {
      obj[cat] = posts.filter((p) => getTag(p.title) === cat).length;
    });
    return obj;
  }, [posts]);

  // Lọc bài viết theo danh mục lựa chọn
  const filtered = useMemo(() => {
    return activeCategory === "Tất cả"
      ? posts
      : posts.filter((p) => getTag(p.title) === activeCategory);
  }, [posts, activeCategory]);

  const featured = activeCategory === "Tất cả" ? filtered[0] : null;
  const grid = activeCategory === "Tất cả" ? filtered.slice(1) : filtered;

  return (
    <section id="blog" className="py-24 bg-gray-950 relative overflow-hidden" ref={sectionRef}>
      {/* Các layer hiệu ứng ánh sáng nền Đẹp mắt */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-6">
            Blog & Kiến thức thực chiến
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Thủ thuật & Chia sẻ<br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">từ trải nghiệm thực tế</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base lg:text-lg">
            Kiến thức SEO, Ads và Tối ưu Website chuyên sâu — không lý thuyết suông.
          </p>
        </div>

        {/* Category Tabs (Đã sửa lại màu sắc hòa quyện với Dark Mode) */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14 animate-on-scroll">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count = counts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? CATEGORY_ACTIVE_STYLE[cat]
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white hover:border-gray-700"
                }`}
              >
                {cat !== "Tất cả" && <span>{CATEGORY_ICONS[cat]}</span>}
                <span>{cat}</span>
                {count > 0 && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-gray-800 text-gray-400"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        {loading ? (
          /* Skeleton Loading phù hợp với giao diện Dark Mode */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-800" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-1/4" />
                  <div className="h-5 bg-gray-800 rounded w-full" />
                  <div className="h-5 bg-gray-800 rounded w-5/6" />
                  <div className="h-4 bg-gray-850 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{CATEGORY_ICONS[activeCategory] || "📝"}</div>
            <p className="text-gray-400 text-lg">Chưa có bài viết nào trong mục <span className="text-violet-400 font-semibold">{activeCategory}</span>.</p>
            <button onClick={() => setActiveCategory("Tất cả")} className="mt-4 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
              ← Quay lại xem tất cả bài viết
            </button>
          </div>
        ) : (
          <>
            {/* Featured Post (Đã chuyển đổi sang Nền Tối `bg-gray-900`) */}
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group mb-10 animate-on-scroll grid lg:grid-cols-12 gap-0 rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-violet-500/50 transition-all duration-300 block shadow-xl"
              >
                <div className="relative h-64 lg:h-full min-h-[280px] lg:col-span-6 overflow-hidden">
                  {featured.cover_image ? (
                    <Image src={featured.cover_image} alt={featured.title}
                      fill sizes="(max-width: 1024px) 100vw, 50vw" priority
                      className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out" />
                  ) : (
                    <CoverPlaceholder title={featured.title} />
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-violet-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                      ✨ Nổi bật
                    </span>
                    <span className={`px-3 py-1 bg-gradient-to-r ${CATEGORY_COLORS[getTag(featured.title)]} text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-lg`}>
                      {CATEGORY_ICONS[getTag(featured.title)]} {getTag(featured.title)}
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 lg:col-span-6 flex flex-col justify-center bg-gradient-to-br from-gray-900 to-gray-950">
                  <p className="text-gray-500 text-xs font-medium mb-3">{formatDate(featured.created_at)}</p>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-snug group-hover:text-violet-400 transition-colors duration-200">
                    {featured.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3 text-sm">
                    {featured.excerpt || "Nhấn để xem chi tiết bài viết thực chiến..."}
                  </p>
                  <div>
                    <span className="inline-flex items-center gap-2 text-violet-400 font-semibold group-hover:text-violet-300 group-hover:gap-3 transition-all duration-200 text-sm">
                      Đọc bài viết <span className="text-base">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid Posts (Đã xử lý nền tối, tăng tương phản đọc chữ rõ nét) */}
            {grid.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grid.map((post, i) => {
                  const tag = getTag(post.title);
                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="animate-on-scroll group flex flex-col rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-950/20 transition-all duration-300"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
                        {post.cover_image ? (
                          <Image src={post.cover_image} alt={post.title}
                            fill sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                            loading="lazy" />
                        ) : (
                          <CoverPlaceholder title={post.title} />
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 bg-gradient-to-r ${CATEGORY_COLORS[tag]} text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow`}>
                            {CATEGORY_ICONS[tag]} {tag}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-gray-900 to-gray-950">
                        <p className="text-gray-500 text-xs font-medium mb-2.5">{formatDate(post.created_at)}</p>
                        <h3 className="text-white font-bold text-base leading-snug mb-3 group-hover:text-violet-400 transition-colors duration-200 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1">
                          {post.excerpt || "Nhấn để đọc bài viết đầy đủ..."}
                        </p>
                        <div className="mt-5 pt-4 border-t border-gray-800/60 flex items-center gap-1 text-violet-400 text-xs font-semibold uppercase tracking-wider group-hover:text-violet-300 group-hover:gap-2 transition-all duration-200">
                          Đọc tiếp <span>→</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* View all Button */}
            <div className="mt-14 text-center animate-on-scroll">
              <Link href="/blog"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-gray-800 bg-gray-900 text-gray-300 font-semibold text-sm rounded-full hover:bg-gray-800 hover:border-violet-500 hover:text-white transition-all duration-200">
                Xem tất cả bài viết <span>→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}