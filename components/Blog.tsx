"use client";
import React, { useEffect, useRef, useState, useMemo, transition as useTransition } from "react";
import Image from "next/image";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string;
  category: string; // ⚡ TỐI ƯU 1: Khai thác trực tiếp danh mục chuẩn từ DB, không phân tích chuỗi tiêu đề bừa bãi
};

type Category = "Tất cả" | "SEO" | "Ads" | "Website" | "Tips";

const CATEGORIES: Category[] = ["Tất cả", "SEO", "Ads", "Website", "Tips"];

const CATEGORY_COLORS: Record<string, string> = {
  SEO: "from-emerald-500 to-teal-600",
  Ads: "from-blue-500 to-indigo-600",
  Website: "from-violet-500 to-purple-600",
  Tips: "from-amber-500 to-orange-600",
};

const CATEGORY_ICONS: Record<string, string> = {
  SEO: "🔍",
  Ads: "📊",
  Website: "💻",
  Tips: "💡",
};

const CATEGORY_ACTIVE_STYLE: Record<Category, string> = {
  "Tất cả": "bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/20",
  SEO: "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20",
  Ads: "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20",
  Website: "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20",
  Tips: "bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-500/20",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function CoverPlaceholder({ category }: { category: string }) {
  const cleanCat = (CATEGORY_COLORS[category] ? category : "Tips") as Category;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${CATEGORY_COLORS[cleanCat]} flex flex-col items-center justify-center gap-3 select-none`}>
      <span className="text-5xl transform group-hover:scale-110 transition-transform duration-500">{CATEGORY_ICONS[cleanCat]}</span>
      <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">{cleanCat}</span>
    </div>
  );
}

export default function Blog({ initialPosts }: { initialPosts?: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts ?? []);
  const [loading, setLoading] = useState(!initialPosts);
  const [activeCategory, setActiveCategory] = useState<Category>("Tất cả");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Gọi dữ liệu dự phòng từ Client API nếu Server Component bị khuyết thiếu dữ liệu
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

  // ⚡ TỐI ƯU 2: Hủy bỏ rò rỉ bộ nhớ của Trình theo dõi cuộn (IntersectionObserver)
  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target); // Hiện hình xong thì dừng theo dõi lập tức để giải phóng CPU luồng chính
          }
        });
      },
      { threshold: 0.02 }
    );

    const els = currentRef.querySelectorAll(".animate-on-scroll");
    els.forEach((el) => observer.observe(el));

    return () => {
      els.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [posts, activeCategory, loading]);

  // Bộ nhớ đệm tính toán số lượng phân loại bài viết chuẩn xác
  const counts = useMemo(() => {
    const obj: Record<string, number> = { "Tất cả": posts.length };
    CATEGORIES.slice(1).forEach((cat) => {
      obj[cat] = posts.filter((p) => (p.category || "Tips") === cat).length;
    });
    return obj;
  }, [posts]);

  // Bộ lọc xử lý mượt mà danh sách bài viết hiển thị
  const filtered = useMemo(() => {
    return activeCategory === "Tất cả"
      ? posts
      : posts.filter((p) => (p.category || "Tips") === activeCategory);
  }, [posts, activeCategory]);

  const featured = activeCategory === "Tất cả" ? filtered[0] : null;
  const grid = activeCategory === "Tất cả" ? filtered.slice(1) : filtered;

  return (
    <section id="blog" className="py-24 bg-gray-950 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

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
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Kiến thức SEO, Ads và Tối ưu Website chuyên sâu — không lý thuyết suông.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14 animate-on-scroll">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count = counts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs md:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? CATEGORY_ACTIVE_STYLE[cat]
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white hover:border-gray-700"
                }`}
              >
                {cat !== "Tất cả" && <span>{CATEGORY_ICONS[cat]}</span>}
                <span>{cat}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-gray-800 text-gray-400"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ⚡ TỐI ƯU 3: Thiết lập vùng min-h (Minimum Height) hợp lý chống lỗi dịch chuyển bố cục nhảy CLS */}
        <div className="min-h-[500px] transition-all duration-300">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-800" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-800 rounded w-1/4" />
                    <div className="h-5 bg-gray-800 rounded w-full" />
                    <div className="h-4 bg-gray-850 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-gray-900/30 rounded-3xl border border-gray-900 animate-in fade-in duration-300">
              <div className="text-5xl mb-4">{CATEGORY_ICONS[activeCategory] || "📝"}</div>
              <p className="text-gray-400 text-base">Chưa có bài viết nào trong mục <span className="text-violet-400 font-semibold">{activeCategory}</span>.</p>
              <button onClick={() => setActiveCategory("Tất cả")} className="mt-4 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
                ← Quay lại xem tất cả bài viết
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 space-y-8">
              {/* Featured Post */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid lg:grid-cols-12 gap-0 rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-violet-500/50 transition-all duration-300 block shadow-xl"
                >
                  <div className="relative h-64 lg:h-auto min-h-[280px] lg:col-span-6 overflow-hidden">
                    {featured.cover_image ? (
                      <Image 
                        src={featured.cover_image} 
                        alt={featured.title}
                        fill 
                        sizes="(max-width: 1024px) 100vw, 50vw" 
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-500 [will-change:transform]" // ⚡ TỐI ƯU 4: Khắc phục nhòe ảnh bằng scale chuẩn và tăng cứng GPU đồ họa
                      />
                    ) : (
                      <CoverPlaceholder category={featured.category} />
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                        ✨ Nổi bật
                      </span>
                      <span className={`px-3 py-1 bg-gradient-to-r ${CATEGORY_COLORS[featured.category] || "from-gray-500 to-gray-600"} text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md`}>
                        {CATEGORY_ICONS[featured.category]} {featured.category || "Tips"}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 lg:col-span-6 flex flex-col justify-center bg-gradient-to-br from-gray-900 to-gray-950">
                    <p className="text-gray-500 text-xs font-medium mb-3">{formatDate(featured.created_at)}</p>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 leading-snug group-hover:text-violet-400 transition-colors duration-200">
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

              {/* Grid Posts */}
              {grid.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grid.map((post, i) => {
                    const tag = post.category || "Tips";
                    return (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-violet-500/40 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden flex-shrink-0">
                          {post.cover_image ? (
                            <Image 
                              src={post.cover_image} 
                              alt={post.title}
                              fill 
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500 [will-change:transform]"
                              loading="lazy" 
                            />
                          ) : (
                            <CoverPlaceholder category={tag} />
                          )}
                          <div className="absolute top-3 left-3">
                            <span className={`px-2.5 py-1 bg-gradient-to-r ${CATEGORY_COLORS[tag] || "from-gray-500 to-gray-600"} text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow`}>
                              {CATEGORY_ICONS[tag]} {tag}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-gray-900 to-gray-950">
                          <p className="text-gray-500 text-xs font-medium mb-2.5">{formatDate(post.created_at)}</p>
                          <h3 className="text-white font-bold text-sm md:text-base leading-snug mb-3 group-hover:text-violet-400 transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2 flex-1">
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
              <div className="pt-6 text-center">
                <Link href="/blog"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-gray-800 bg-gray-900 text-gray-300 font-semibold text-sm rounded-full hover:bg-gray-800 hover:border-violet-500 hover:text-white transition-all duration-200">
                  Xem tất cả bài viết <span>→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}