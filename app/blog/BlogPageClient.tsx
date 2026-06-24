"use client";
import { useState, useRef, Suspense, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import SearchStrip from "@/components/SearchStrip";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";

// ── Types ─────────────────────────────────────────────────────────────────────
export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string;
  category: string | null;
};

export type DbCategory = {
  id: string;
  label: string;
  value: string;
  icon: string;
  color_key: string;
  subs: string[];
  sort_order: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  // timeZone bắt buộc: server (UTC+0) vs browser (UTC+7) render ngày khác nhau
  // → React hydration error #425 "text content mismatch" → #422 Suspense collapse
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error("Network response was not ok");
  return r.json();
});

// ── Skeleton — định nghĩa NGOÀI render function để tránh re-mount mỗi render ─
function Skeleton() {
  return (
    <div className="animate-pulse">
      {[0, 1].map(i => (
        <div key={i} className="mb-10">
          <div className="h-4 bg-gray-200 w-32 rounded mb-4" />
          <div className="h-0.5 bg-orange-200 w-28 mb-5" />
          <div className="flex gap-0 rounded-xl overflow-hidden border border-gray-100 mb-4">
            <div className="w-[46%] min-h-[210px] bg-gray-200 flex-shrink-0" />
            <div className="flex-1 p-5 space-y-3">
              <div className="h-3 bg-gray-200 w-20 rounded" />
              <div className="h-5 bg-gray-200 rounded" />
              <div className="h-5 bg-gray-200 w-3/4 rounded" />
              <div className="h-3 bg-gray-100 rounded" />
              <div className="h-3 bg-gray-100 w-2/3 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map(j => (
              <div key={j}>
                <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-2" />
                <div className="h-3 bg-gray-200 w-16 rounded mb-1" />
                <div className="h-3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Category Section ──────────────────────────────────────────────────────────
function CategorySection({
  cat, posts, onViewMore,
}: {
  cat: DbCategory;
  posts: Post[];
  onViewMore: (catValue: string) => void;
}) {
  if (posts.length === 0) return null;
  const featured = posts[0];
  const grid     = posts.slice(1, 5);

  return (
    <section className="mb-10 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cat.icon}</span>
          <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-widest">
            {cat.label}
          </h2>
        </div>
        <button
          onClick={() => onViewMore(cat.value)}
          className="text-xs text-orange-500 font-semibold hover:underline whitespace-nowrap"
        >
          Xem tất cả →
        </button>
      </div>
      <div className="border-b-2 border-orange-500 mb-5 w-28" />

      {/* Featured post */}
      <Link
        href={`/blog/${featured.slug}`}
        className="group flex flex-col sm:flex-row gap-0 overflow-hidden rounded-xl border border-gray-200 hover:shadow-lg transition-all mb-4 bg-white"
      >
        <div className="relative w-full sm:w-[46%] flex-shrink-0 overflow-hidden bg-gray-50 aspect-[1200/630]">
          {featured.cover_image ? (
            <Image
              src={featured.cover_image}
              alt={featured.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              unoptimized
              priority
              sizes="(max-width: 640px) 100vw, 46vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🖼</div>
          )}
        </div>
        <div className="hidden sm:flex flex-col justify-between flex-1 p-5">
          <div>
            <span className="inline-block text-xs font-extrabold text-orange-500 uppercase tracking-wider mb-2">
              {cat.label}
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 leading-snug line-clamp-3 mb-3 group-hover:text-orange-500 transition-colors">
              {featured.title}
            </h3>
            {featured.excerpt && (
              <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                {featured.excerpt}
              </p>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-3">{formatDate(featured.created_at)}</p>
        </div>
      </Link>

      {/* 4-col grid */}
      {grid.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {grid.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <div className="relative rounded-lg overflow-hidden bg-gray-50 mb-2 aspect-[1200/630]">
                {post.cover_image ? (
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    unoptimized
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center text-3xl opacity-30">
                    {cat.icon}
                  </div>
                )}
                <div className="absolute bottom-2 left-2">
                  <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-extrabold uppercase rounded">
                    {cat.label}
                  </span>
                </div>
              </div>
              <p className="text-orange-500 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                {cat.label}
              </p>
              <h4 className="text-gray-800 text-sm font-semibold leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
                {post.title}
              </h4>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Single-category posts view ────────────────────────────────────────────────
function CategoryPosts({ cat, posts }: { cat: DbCategory; posts: Post[] }) {
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-3">📝</div>
        <p className="font-medium">Chưa có bài viết trong mục này</p>
      </div>
    );
  }

  const featured    = posts[0];
  const rest        = posts.slice(1);
  const visibleRest = rest.slice(0, page * PER_PAGE);

  return (
    <section className="animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{cat.icon}</span>
        <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-widest">{cat.label}</h2>
      </div>
      <div className="border-b-2 border-orange-500 mb-6 w-28" />

      <Link
        href={`/blog/${featured.slug}`}
        className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-gray-200 hover:shadow-lg transition-all mb-6 bg-white"
      >
        <div className="relative w-full sm:w-[46%] flex-shrink-0 overflow-hidden bg-gray-50 aspect-[1200/630]">
          {featured.cover_image ? (
            <Image src={featured.cover_image} alt={featured.title} fill
              className="object-cover group-hover:scale-[1.02] transition-transform"
              unoptimized sizes="46vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🖼</div>
          )}
        </div>
        <div className="flex flex-col justify-between flex-1 p-5">
          <div>
            <span className="inline-block text-xs font-extrabold text-orange-500 uppercase tracking-wider mb-2">{cat.label}</span>
            <h3 className="text-xl font-extrabold text-gray-900 leading-snug line-clamp-3 mb-3 group-hover:text-orange-500 transition-colors">
              {featured.title}
            </h3>
            {featured.excerpt && <p className="text-gray-500 text-sm line-clamp-3">{featured.excerpt}</p>}
          </div>
          <p className="text-gray-400 text-xs mt-3">{formatDate(featured.created_at)}</p>
        </div>
      </Link>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visibleRest.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            <div className="relative rounded-lg overflow-hidden bg-gray-50 mb-2 aspect-[1200/630]">
              {post.cover_image ? (
                <Image src={post.cover_image} alt={post.title} fill
                  className="object-cover group-hover:scale-[1.02] transition-transform"
                  unoptimized sizes="25vw" />
              ) : (
                <div className="w-full h-full bg-orange-50 flex items-center justify-center text-3xl opacity-30">{cat.icon}</div>
              )}
              <div className="absolute bottom-2 left-2">
                <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-extrabold uppercase rounded">{cat.label}</span>
              </div>
            </div>
            <p className="text-orange-500 text-[10px] font-extrabold uppercase tracking-wider mb-1">{cat.label}</p>
            <h4 className="text-gray-800 text-sm font-semibold leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
              {post.title}
            </h4>
          </Link>
        ))}
      </div>

      {rest.length > visibleRest.length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-8 py-2.5 border-2 border-orange-500 text-orange-500 text-sm font-bold rounded-full hover:bg-orange-500 hover:text-white transition-all"
          >
            Xem thêm
          </button>
        </div>
      )}
    </section>
  );
}

// ── Search Results ────────────────────────────────────────────────────────────
function SearchResults({
  query, posts, categories, onClear,
}: {
  query: string;
  posts: Post[];
  categories: DbCategory[];
  onClear: () => void;
}) {
  const getCat = (post: Post) => categories.find(c => c.value === post.category);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-700 font-semibold">
          Kết quả cho: <span className="text-orange-500">"{query}"</span>
          <span className="text-gray-400 font-normal ml-2">({posts.length} bài)</span>
        </p>
        <button onClick={onClear} className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1">
          ✕ Xoá tìm kiếm
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-medium">Không tìm thấy kết quả</p>
          <p className="text-sm mt-1">Thử từ khoá khác nhé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map(post => {
            const cat = getCat(post);
            return (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 hover:shadow-md transition-all bg-white">
                <div className="relative overflow-hidden bg-gray-50 aspect-[1200/630]">
                  {post.cover_image ? (
                    <Image src={post.cover_image} alt={post.title} fill
                      className="object-cover group-hover:scale-[1.02] transition-transform"
                      unoptimized sizes="33vw" />
                  ) : (
                    <div className="w-full h-full bg-orange-50 flex items-center justify-center text-4xl opacity-20">🖼</div>
                  )}
                  {cat && (
                    <div className="absolute bottom-2 left-2">
                      <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-extrabold uppercase rounded">{cat.label}</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  {cat && <p className="text-orange-500 text-[10px] font-extrabold uppercase tracking-wider mb-1">{cat.label}</p>}
                  <h3 className="text-gray-900 font-bold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && <p className="text-gray-500 text-xs line-clamp-2 flex-1">{post.excerpt}</p>}
                  <p className="text-gray-400 text-xs mt-2">{formatDate(post.created_at)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Inner content — cần Suspense vì dùng useSearchParams ─────────────────────
function BlogPageContent({
  initialPosts,
  initialCategories,
}: {
  initialPosts: Post[];
  initialCategories: DbCategory[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabsRef      = useRef<HTMLDivElement>(null);
  const urlQuery     = searchParams.get("q") || "";

  // SWR với fallbackData = data đã fetch ở Server → không có loading state lần đầu
  const { data: postsData, error: postsError } = useSWR("/api/posts", fetcher, {
    fallbackData: initialPosts,
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  const { data: catsData } = useSWR("/api/categories", fetcher, {
    fallbackData: initialCategories,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const posts: Post[]           = useMemo(() => Array.isArray(postsData) ? postsData : initialPosts, [postsData, initialPosts]);
  const categories: DbCategory[] = useMemo(() => Array.isArray(catsData) ? catsData : initialCategories, [catsData, initialCategories]);

  // Với fallbackData, không bao giờ có loading state thật sự nữa
  const loading = !postsData && !postsError && initialPosts.length === 0;

  const searchResults = useMemo(() => {
    if (!urlQuery) return [];
    const q = urlQuery.toLowerCase();
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) || (p.excerpt || "").toLowerCase().includes(q)
    );
  }, [urlQuery, posts]);

  const clearSearch    = () => router.push("/blog");
  const handleViewMore = (catValue: string) => {
    setActiveCategory(catValue);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Category Tabs */}
      <div className="sticky top-[158px] md:top-[128px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div
            ref={tabsRef}
            className="flex items-center gap-1.5 overflow-x-auto py-3 md:justify-center select-none"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                ${activeCategory === "all" ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Blog thủ thuật
            </button>
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                  ${activeCategory === cat.value ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-7">
        {urlQuery ? (
          <SearchResults
            query={urlQuery}
            posts={searchResults}
            categories={categories}
            onClear={clearSearch}
          />
        ) : (
          <>
            {loading ? <Skeleton /> : (
              <>
                {activeCategory === "all" && categories.map(cat => (
                  <CategorySection
                    key={cat.value}
                    cat={cat}
                    posts={posts.filter(p => p.category === cat.value)}
                    onViewMore={handleViewMore}
                  />
                ))}

                {activeCategory !== "all" && (() => {
                  const cat = categories.find(c => c.value === activeCategory);
                  if (!cat) return null;
                  return (
                    <CategoryPosts
                      cat={cat}
                      posts={posts.filter(p => p.category === activeCategory)}
                    />
                  );
                })()}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

// ── Main Client Component (nhận data từ Server Component) ─────────────────────
export default function BlogPageClient({
  initialPosts,
  initialCategories,
}: {
  initialPosts: Post[];
  initialCategories: DbCategory[];
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SearchStrip />

      {/* useSearchParams() cần Suspense boundary */}
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <BlogPageContent
          initialPosts={initialPosts}
          initialCategories={initialCategories}
        />
      </Suspense>

      {/* CTA Strip */}
      <section className="bg-orange-500 py-10 mt-4">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-xl font-extrabold text-white mb-2">Cần tư vấn chiến lược marketing?</h2>
          <p className="text-orange-100 text-sm mb-5">Liên hệ ngay để được tư vấn miễn phí — phản hồi trong 30 phút.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-2.5 bg-white text-orange-500 font-extrabold rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm"
          >
            Liên hệ ngay →
          </Link>
        </div>
      </section>

      <Footer />
      <FloatingContacts />
    </div>
  );
}
