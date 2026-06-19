"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
  "Tất cả": "bg-blue-600 text-white border-blue-500",
  SEO: "bg-green-600 text-white border-green-500",
  Ads: "bg-blue-600 text-white border-blue-500",
  Website: "bg-violet-600 text-white border-violet-500",
  Tips: "bg-orange-500 text-white border-orange-400",
};

function getTag(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("seo")) return "SEO";
  if (t.includes("ads") || t.includes("quảng cáo") || t.includes("google ads") || t.includes("facebook ads")) return "Ads";
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

// Không dùng data cứng — tất cả bài viết lấy từ Supabase database

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("Tất cả");
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/posts", { next: { revalidate: 300 } })
      .then(async (r) => {
        const text = await r.text();
        try {
          const d = JSON.parse(text);
          setPosts(Array.isArray(d) ? d : []);
        } catch {
          setPosts([]);
        }
        setLoading(false);
      })
      .catch(() => { setPosts([]); setLoading(false); });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    const els = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [posts, activeCategory]);

  const filtered = activeCategory === "Tất cả"
    ? posts
    : posts.filter((p) => getTag(p.title) === activeCategory);

  // Count per category
  const counts: Record<string, number> = { "Tất cả": posts.length };
  CATEGORIES.slice(1).forEach((cat) => {
    counts[cat] = posts.filter((p) => getTag(p.title) === cat).length;
  });

  const featured = activeCategory === "Tất cả" ? filtered[0] : null;
  const grid = activeCategory === "Tất cả" ? filtered.slice(1) : filtered;

  return (
    <section id="blog" className="py-24 bg-gray-900 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            Blog & Kiến thức
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Thủ thuật & Chia sẻ<br />
            <span className="gradient-text">từ thực chiến</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Kiến thức SEO, Ads và Marketing thực tế — không lý thuyết suông.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-on-scroll">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count = counts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${
                  isActive
                    ? CATEGORY_ACTIVE_STYLE[cat]
                    : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {cat !== "Tất cả" && <span>{CATEGORY_ICONS[cat]}</span>}
                {cat}
                {count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/30" : "bg-black/10"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-5 bg-slate-200 rounded" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">{CATEGORY_ICONS[activeCategory] || "📝"}</div>
            <p className="text-gray-500 text-lg">Chưa có bài viết nào trong mục <span className="text-white font-semibold">{activeCategory}</span>.</p>
            <button onClick={() => setActiveCategory("Tất cả")} className="mt-4 text-blue-400 hover:text-blue-300 text-sm">
              ← Xem tất cả bài viết
            </button>
          </div>
        ) : (
          <>
            {/* Featured post — chỉ hiện khi tab "Tất cả" */}
            {featured && (
              <a
                href={`/blog/${featured.slug}`}
                className="group mb-8 animate-on-scroll grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-violet-400 transition-all card-hover block shadow-sm"
              >
                <div className="relative h-64 lg:h-72 overflow-hidden">
                  {featured.cover_image ? (
                    <Image src={featured.cover_image} alt={featured.title}
                      fill sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <CoverPlaceholder title={featured.title} />
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-violet-600 text-white text-xs font-bold rounded-full shadow-lg">
                      ✨ Nổi bật
                    </span>
                    <span className={`px-3 py-1 bg-gradient-to-r ${CATEGORY_COLORS[getTag(featured.title)]} text-white text-xs font-bold rounded-full shadow-lg`}>
                      {CATEGORY_ICONS[getTag(featured.title)]} {getTag(featured.title)}
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <p className="text-gray-500 text-xs mb-3">{formatDate(featured.created_at)}</p>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-violet-300 transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3 text-sm">
                    {featured.excerpt || "Nhấn để đọc bài viết đầy đủ..."}
                  </p>
                  <span className="inline-flex items-center gap-2 text-violet-400 font-semibold group-hover:gap-3 transition-all">
                    Đọc bài viết <span>→</span>
                  </span>
                </div>
              </a>
            )}

            {/* Grid */}
            {grid.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grid.map((post, i) => {
                  const tag = getTag(post.title);
                  return (
                    <a
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="animate-on-scroll group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 hover:shadow-md hover:border-violet-300 transition-all card-hover shadow-sm"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
                        {post.cover_image ? (
                          <Image src={post.cover_image} alt={post.title}
                            fill sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy" />
                        ) : (
                          <CoverPlaceholder title={post.title} />
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 bg-gradient-to-r ${CATEGORY_COLORS[tag]} text-white text-xs font-bold rounded-full shadow`}>
                            {CATEGORY_ICONS[tag]} {tag}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <p className="text-gray-600 text-xs mb-2">{formatDate(post.created_at)}</p>
                        <h3 className="text-white font-semibold text-base leading-snug mb-3 group-hover:text-violet-300 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
                          {post.excerpt || "Nhấn để đọc bài viết đầy đủ..."}
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-violet-400 text-sm font-medium group-hover:gap-2 transition-all">
                          Đọc tiếp <span>→</span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            {/* View all */}
            <div className="mt-12 text-center animate-on-scroll">
              <a href="/blog"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-slate-300 text-slate-700 font-semibold rounded-full hover:bg-slate-100 hover:border-violet-400 hover:text-slate-900 transition-all">
                Xem tất cả bài viết <span>→</span>
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
