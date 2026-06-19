"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import FloatingContacts from "@/components/FloatingContacts";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string;
  category: string | null;
};

type DbCategory = {
  id: string;
  label: string;
  value: string;
  icon: string;
  color_key: string;
  subs: string[];
  sort_order: number;
};

// Color mapping từ color_key → Tailwind classes
const COLOR_MAP: Record<string, { badge: string; tag: string; bg: string }> = {
  blue:    { badge: "text-blue-600 border-blue-500",    tag: "bg-blue-100 text-blue-700 border-blue-200",       bg: "from-blue-50 to-cyan-50"     },
  violet:  { badge: "text-violet-600 border-violet-500", tag: "bg-violet-100 text-violet-700 border-violet-200", bg: "from-violet-50 to-purple-50"  },
  emerald: { badge: "text-emerald-600 border-emerald-500", tag: "bg-emerald-100 text-emerald-700 border-emerald-200", bg: "from-emerald-50 to-green-50" },
  orange:  { badge: "text-orange-600 border-orange-500", tag: "bg-orange-100 text-orange-700 border-orange-200", bg: "from-orange-50 to-amber-50"   },
  red:     { badge: "text-red-600 border-red-500",       tag: "bg-red-100 text-red-700 border-red-200",          bg: "from-red-50 to-rose-50"       },
  indigo:  { badge: "text-indigo-600 border-indigo-500", tag: "bg-indigo-100 text-indigo-700 border-indigo-200", bg: "from-indigo-50 to-blue-50"    },
  pink:    { badge: "text-pink-600 border-pink-500",     tag: "bg-pink-100 text-pink-700 border-pink-200",       bg: "from-pink-50 to-rose-50"      },
  green:   { badge: "text-green-600 border-green-500",   tag: "bg-green-100 text-green-700 border-green-200",    bg: "from-green-50 to-teal-50"     },
};

function getCatColor(colorKey: string) {
  return COLOR_MAP[colorKey] || COLOR_MAP.blue;
}

function getTag(post: Post, categories: DbCategory[]) {
  // Tìm category trong DB theo value khớp với post.category
  if (post.category) {
    const cat = categories.find(c => c.value === post.category);
    if (cat) return { label: cat.label, color: getCatColor(cat.color_key).tag, icon: cat.icon };
  }
  // Fallback theo title
  const t = post.title.toLowerCase();
  if (t.includes("seo")) return { label: "SEO", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "🔍" };
  if (t.includes("ads") || t.includes("quảng cáo") || t.includes("google") || t.includes("facebook")) return { label: "Ads", color: "bg-violet-100 text-violet-700 border-violet-200", icon: "📊" };
  if (t.includes("website") || t.includes("wordpress") || t.includes("web")) return { label: "Website", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "💻" };
  return { label: "Tips", color: "bg-orange-100 text-orange-700 border-orange-200", icon: "💡" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function BlogPageContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Read ?q= from URL on load
  const urlQuery = searchParams.get("q") || "";

  const fetchData = (isInitial = false) => {
    if (isInitial) setLoading(true);
    Promise.all([
      fetch("/api/posts", { cache: "no-store" }).then(r => r.json()),
      fetch("/api/categories", { cache: "no-store" }).then(r => r.json()),
    ]).then(([postsData, catsData]) => {
      setPosts(Array.isArray(postsData) ? postsData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
      if (isInitial) setLoading(false);
    }).catch(() => { if (isInitial) setLoading(false); });
  };

  useEffect(() => {
    fetchData(true);
    // Re-fetch khi user quay lại tab (thêm danh mục hoặc bài viết ở tab khác)
    const onVisible = () => { if (document.visibilityState === "visible") fetchData(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use URL query if present, otherwise use inline search state
  const activeQuery = urlQuery || search;

  const filtered = posts.filter((p) => {
    const tag = getTag(p, categories).label;
    const matchCat = activeCategory === "Tất cả" || tag === activeCategory;
    const matchSearch = activeQuery === "" || p.title.toLowerCase().includes(activeQuery.toLowerCase()) || (p.excerpt || "").toLowerCase().includes(activeQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Submit search → navigate to /blog?q=...
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (q) router.push(`/blog?q=${encodeURIComponent(q)}`);
  };

  const clearSearch = () => {
    router.push("/blog");
    setSearch("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const featured = filtered[0];
  const sideList = filtered.slice(1, 4);
  const rest = filtered.slice(4);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-600 via-blue-500 to-violet-600 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 border border-white/30 rounded-full text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Kiến thức thực chiến từ người làm thực tế
          </div>

          <h1 className="font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-1">
              Bạn đang cần
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-sm">
              SEO · Ads · Website?
            </span>
          </h1>

          <p className="text-blue-100 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Khám phá kho kiến thức miễn phí — giúp bạn tăng traffic,
            tối ưu quảng cáo và xây dựng website chuyên nghiệp.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              defaultValue={urlQuery}
              placeholder="Tìm kiếm bài viết, chủ đề..."
              className="w-full py-4 pr-32 bg-white rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl text-sm font-medium"
              style={{ paddingLeft: "3rem" }}
            />
            <button type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow">
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* ── SEARCH RESULTS VIEW ── */}
      {urlQuery && (
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-4">
          {/* Heading */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Kết quả tìm kiếm cho:{" "}
              <span className="text-red-500">"{urlQuery}"</span>
            </h2>
            <button onClick={clearSearch}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 px-4 py-2 rounded-full hover:border-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Xem tất cả bài viết
            </button>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2,3,4].map((i) => (
                <div key={i} className="rounded-2xl bg-white border border-slate-200 overflow-hidden animate-pulse flex gap-4 p-4">
                  <div className="w-32 h-24 bg-slate-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                    <div className="h-4 bg-slate-200 rounded" />
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-slate-700 font-semibold text-lg mb-2">Không tìm thấy kết quả</h3>
              <p className="text-slate-400 text-sm mb-5">Thử tìm kiếm với từ khóa khác như "SEO", "Google Ads", "WordPress"</p>
              <button onClick={clearSearch}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
                Xem tất cả bài viết →
              </button>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              <p className="text-slate-500 text-sm mb-5">Tìm thấy <strong className="text-slate-800">{filtered.length}</strong> bài viết</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((post) => {
                  const tag = getTag(post, categories);
                  // Highlight matching text
                  const highlight = (text: string) => {
                    const idx = text.toLowerCase().indexOf(urlQuery.toLowerCase());
                    if (idx === -1) return <span>{text}</span>;
                    return <>
                      {text.slice(0, idx)}
                      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + urlQuery.length)}</mark>
                      {text.slice(idx + urlQuery.length)}
                    </>;
                  };
                  return (
                    <Link key={post.id} href={`/blog/${post.slug}`}
                      className="group flex gap-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all p-4">
                      {/* Thumbnail */}
                      <div className="w-36 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-violet-100">
                        {post.cover_image
                          ? <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          : <div className="w-full h-full flex items-center justify-center text-3xl opacity-40">
                              {tag.label === "SEO" ? "🔍" : tag.label === "Ads" ? "📊" : tag.label === "Website" ? "💻" : "💡"}
                            </div>
                        }
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border mb-2 w-fit ${tag.color}`}>{tag.label}</span>
                        <h3 className="text-slate-900 font-bold text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {highlight(post.title)}
                        </h3>
                        {post.excerpt && (
                          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-3">
                            {highlight(post.excerpt)}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-auto">
                          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity shadow-sm">
                            Tìm hiểu thêm →
                          </span>
                          <span className="text-slate-400 text-xs">{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Hide category cards and posts when searching */}
      {!urlQuery && (<>

      {/* ── CATEGORY CARDS ── */}
      <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className={`grid divide-x divide-y divide-slate-100 ${categories.length <= 2 ? "grid-cols-2" : categories.length === 3 ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}
            style={{ gridTemplateColumns: categories.length > 0 ? `repeat(${Math.min(categories.length, 4)}, 1fr)` : undefined }}>
            {(categories.length > 0 ? categories : []).map((cat) => {
              const count = posts.filter((p) => getTag(p, categories).label === cat.label).length;
              const c = getCatColor(cat.color_key);
              return (
                <button
                  key={cat.value}
                  onClick={() => { setActiveCategory(activeCategory === cat.label ? "Tất cả" : cat.label); }}
                  className={`p-5 text-left hover:bg-slate-50 transition-colors group ${activeCategory === cat.label ? "bg-slate-50" : ""}`}
                >
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 border-2 rounded-full text-sm font-bold mb-2 ${c.badge} ${activeCategory === cat.label ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}>
                    <span>{cat.icon}</span> {cat.label}
                  </div>
                  <div className="text-xs text-slate-400 mb-3">
                    {loading ? "..." : `${count} bài viết`}
                  </div>
                  <ul className="space-y-1.5">
                    {(cat.subs || []).slice(0, 4).map((s) => (
                      <li key={s} className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-slate-700">
                        <span className="text-blue-400">›</span> {s}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── POSTS ── */}
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 overflow-hidden animate-pulse">
                <div className="h-44 bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 rounded" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-slate-700 font-semibold text-lg mb-2">Chưa có bài viết</h3>
            <p className="text-slate-400 text-sm">
              {search ? `Không tìm thấy kết quả cho "${search}"` : `Chưa có bài viết trong mục này`}
            </p>
            <button onClick={() => { setSearch(""); setActiveCategory("Tất cả"); }}
              className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700">
              Xem tất cả →
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            {/* Section title */}
            <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide mb-6">
              {activeCategory === "Tất cả" ? "Bài viết nổi bật" : `Bài viết về ${activeCategory}`}
            </h2>

            {/* Featured + sidebar */}
            <div className="grid lg:grid-cols-5 gap-5 mb-10">
              {/* Big featured */}
              {featured && (() => {
                const featuredTag = getTag(featured, categories);
                return (
                <Link href={`/blog/${featured.slug}`}
                  className="lg:col-span-3 group relative block rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative h-56 lg:h-72 overflow-hidden bg-gradient-to-br from-blue-500 to-violet-600">
                    {featured.cover_image
                      ? <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-7xl opacity-30">
                          {featuredTag.icon || "💡"}
                        </div>
                    }
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border mb-2 ${featuredTag.color}`}>
                        {featuredTag.label}
                      </span>
                      <h2 className="text-white font-bold text-lg leading-snug line-clamp-2 group-hover:text-blue-200 transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-white/60 text-xs mt-1">{formatDate(featured.created_at)}</p>
                    </div>
                  </div>
                  {featured.excerpt && (
                    <div className="p-4">
                      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{featured.excerpt}</p>
                      <div className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold mt-3 group-hover:gap-2.5 transition-all">
                        Đọc bài viết <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </div>
                    </div>
                  )}
                </Link>
                );
              })()}

              {/* Side list */}
              {sideList.length > 0 && (
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {sideList.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}
                      className="group flex gap-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md p-3 transition-all">
                      <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-violet-100">
                        {post.cover_image
                          ? <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          : <div className="w-full h-full flex items-center justify-center text-2xl opacity-50">
                              {getTag(post, categories).icon || "💡"}
                            </div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border mb-1 ${getTag(post, categories).color}`}>
                          {getTag(post, categories).label}
                        </span>
                        <h3 className="text-slate-800 text-sm font-semibold leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-slate-400 text-[11px] mt-1">{formatDate(post.created_at)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Rest grid */}
            {rest.length > 0 && (
              <>
                <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide mb-5">Bài viết mới nhất</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((post) => {
                    const tag = getTag(post, categories);
                    return (
                      <Link key={post.id} href={`/blog/${post.slug}`}
                        className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all shadow-sm">
                        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                          {post.cover_image
                            ? <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            : <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
                                tag.label === "SEO" ? "from-blue-50 to-cyan-100" :
                                tag.label === "Ads" ? "from-violet-50 to-purple-100" :
                                tag.label === "Website" ? "from-emerald-50 to-green-100" :
                                "from-orange-50 to-amber-100"
                              }`}>
                                <span className="text-5xl opacity-30">
                                  {tag.label === "SEO" ? "🔍" : tag.label === "Ads" ? "📊" : tag.label === "Website" ? "💻" : "💡"}
                                </span>
                              </div>
                          }
                          <div className="absolute top-3 left-3">
                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${tag.color}`}>{tag.label}</span>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <p className="text-slate-400 text-xs mb-1.5">{formatDate(post.created_at)}</p>
                          <h3 className="text-slate-900 font-bold text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                            {post.title}
                          </h3>
                          {post.excerpt && <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>}
                          <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold mt-auto group-hover:gap-2 transition-all">
                            Đọc tiếp <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* Back home */}
        {!loading && (
          <div className="mt-14 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Về trang chủ
            </Link>
          </div>
        )}
      </div>

      {/* End hide-when-searching wrapper */}
      </>)}

      {/* CTA strip */}
      <section className="bg-gradient-to-r from-blue-600 to-violet-600 py-12 mt-4">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Nhận kiến thức marketing mỗi tuần</h2>
          <p className="text-blue-100 text-sm mb-6">Bài viết mới nhất về SEO, Ads & Website gửi thẳng vào hộp thư.</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 bg-white text-blue-600 font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm">
            Liên hệ ngay →
          </Link>
        </div>
      </section>
      <Footer />
      <MobileBar />
      <FloatingContacts />
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <BlogPageContent />
    </Suspense>
  );
}
