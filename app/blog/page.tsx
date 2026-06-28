/*// Server Component — render HTML đầy đủ để Google index được nội dung bài viết
import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import type { Metadata } from "next";
import BlogPageClient, { type Post, type DbCategory } from "./BlogPageClient";

// ISR: tái tạo trang mỗi 60 giây — bài mới xuất hiện trong 1 phút
export const revalidate = 60;

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Blog SEO & Digital Marketing",
  description:
    "Kiến thức thực chiến về SEO, Google Ads, Facebook Ads và thiết kế website tại Long Thành, Đồng Nai. Bài viết mới mỗi tuần — hoàn toàn miễn phí.",
  keywords: [
    "blog SEO", "thủ thuật SEO", "Google Ads tips", "Facebook Ads", "digital marketing Đồng Nai",
    "SEO Long Thành", "thiết kế website", "marketing online", "kiến thức SEO tiếng Việt",
  ],
  alternates: {
    canonical: "https://www.sonxinchao.com/blog",
  },
  openGraph: {
    title: "Blog Thủ Thuật SEO & Digital Marketing | Sơn Xin Chào",
    description:
      "Kiến thức thực chiến về SEO, quảng cáo Google, Facebook Ads và thiết kế website. Cập nhật mỗi tuần.",
    url: "https://www.sonxinchao.com/blog",
    type: "website",
    locale: "vi_VN",
    siteName: "Sơn Xin Chào",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Thủ Thuật SEO & Digital Marketing | Sơn Xin Chào",
    description: "Kiến thức SEO, Google Ads, Facebook Ads miễn phí — Sơn Xin Chào.",
  },
};

// ── Server-side data fetching với ISR cache ───────────────────────────────────
const getCachedPosts = unstable_cache(
  async (): Promise<Post[]> => {
    try {
      const db = supabaseAdmin();
      const { data } = await db
        .from("posts")
        .select("id, title, slug, excerpt, cover_image, created_at, category")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      return (data as Post[]) || [];
    } catch {
      return [];
    }
  },
  ["blog-posts-ssr"],
  { revalidate: 60 }
);

const getCachedCategories = unstable_cache(
  async (): Promise<DbCategory[]> => {
    try {
      const db = supabaseAdmin();
      const { data } = await db
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      return (data as DbCategory[]) || [];
    } catch {
      return [];
    }
  },
  ["blog-categories-ssr"],
  { revalidate: 3600 }
);

// ── Page ──────────────────────────────────────────────────────────────────────
// Fetch song song 2 mảng data ngay trên Server để HTML trả về đã có nội dung
export default async function BlogPage() {
  const [initialPosts, initialCategories] = await Promise.all([
    getCachedPosts(),
    getCachedCategories(),
  ]);

  return (
    <BlogPageClient
      initialPosts={initialPosts}
      initialCategories={initialCategories}
    />
  );
}*/

import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import type { Metadata } from "next";
import BlogPageClient, { type Post, type DbCategory } from "./BlogPageClient";

// ISR: tái tạo trang mỗi 60 giây
export const revalidate = 60;

const POSTS_PER_PAGE = 12;

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Blog SEO & Digital Marketing",
  description:
    "Kiến thức thực chiến về SEO, Google Ads, Facebook Ads và thiết kế website tại Long Thành, Đồng Nai. Bài viết mới mỗi tuần — hoàn toàn miễn phí.",
  keywords: [
    "blog SEO", "thủ thuật SEO", "Google Ads tips", "Facebook Ads", "digital marketing Đồng Nai",
    "SEO Long Thành", "thiết kế website", "marketing online", "kiến thức SEO tiếng Việt",
  ],
  alternates: {
    canonical: "https://www.sonxinchao.com/blog",
  },
  openGraph: {
    title: "Blog Thủ Thuật SEO & Digital Marketing | Sơn Xin Chào",
    description:
      "Kiến thức thực chiến về SEO, quảng cáo Google, Facebook Ads và thiết kế website. Cập nhật mỗi tuần.",
    url: "https://www.sonxinchao.com/blog",
    type: "website",
    locale: "vi_VN",
    siteName: "Sơn Xin Chào",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Thủ Thuật SEO & Digital Marketing | Sơn Xin Chào",
    description: "Kiến thức SEO, Google Ads, Facebook Ads miễn phí — Sơn Xin Chào.",
  },
};

// ── Server-side data fetching với ISR cache ───────────────────────────────────
const getCachedPosts = unstable_cache(
  async (limit: number): Promise<Post[]> => {
    try {
      const db = supabaseAdmin();
      const { data } = await db
        .from("posts")
        .select("id, title, slug, excerpt, cover_image, created_at, category")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(limit);
      return (data as Post[]) || [];
    } catch {
      return [];
    }
  },
  ["blog-posts-ssr"],
  { revalidate: 60 }
);

const getCachedCategories = unstable_cache(
  async (): Promise<DbCategory[]> => {
    try {
      const db = supabaseAdmin();
      // TỐI ƯU SỬA ĐỔI: Lấy hết các cột (*) để tránh lỗi thiếu trường label, value, icon ở client
      const { data } = await db
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      return (data as DbCategory[]) || [];
    } catch {
      return [];
    }
  },
  ["blog-categories-ssr"],
  { revalidate: 3600 }
);

// ── Page Main Component ───────────────────────────────────────────────────────
export default async function BlogPage() {
  const [initialPosts, initialCategories] = await Promise.all([
    getCachedPosts(POSTS_PER_PAGE),
    getCachedCategories(),
  ]);

  return (
    <BlogPageClient
      initialPosts={initialPosts}
      initialCategories={initialCategories}
    />
  );
}