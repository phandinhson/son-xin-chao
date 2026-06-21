import { Metadata } from "next";
import { cache } from "react"; // Kích hoạt cơ chế chống trùng lặp Request cho SDK Supabase
import { supabase } from "@/lib/supabase";
import BlogPostClient from "./BlogPostClient";

type Props = { params: { slug: string } };

/* ─────────────────────────────────────────────
   1. Tập trung hàm Fetch dữ liệu bài viết (Khử trùng lặp)
   Next.js sẽ tự gộp request ở generateMetadata và BlogPostPage làm một
───────────────────────────────────────────── */
const getPostData = cache(async (slug: string) => {
  const { data: post } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, cover_image, content, created_at, updated_at, category, status")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return post || null;
});

/* ─────────────────────────────────────────────
   Helper: Tối ưu hoá việc trích FAQ từ nội dung HTML
───────────────────────────────────────────── */
function extractFAQs(html: string) {
  if (!html) return [];
  const faqs: { question: string; answer: string }[] = [];
  
  // Regex tối ưu hơn, tránh hiện tượng Catastrophic Backtracking trên chuỗi lớn
  const regex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    const question = match[1].replace(/<[^>]*>/g, "").trim();
    const answer   = match[2].replace(/<[^>]*>/g, "").trim();
    if (question && answer && question.endsWith("?")) {
      faqs.push({ question, answer });
    }
  }
  return faqs;
}

/* ─────────────────────────────────────────────
   Helper: Tính thời gian đọc ước tính nhanh
───────────────────────────────────────────── */
function estimateReadingTime(html: string) {
  if (!html) return 1;
  const words = html.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* ─────────────────────────────────────────────
   GENERATE METADATA (Đã tối ưu hóa luồng gọi data)
───────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostData(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sonxinchao.com";
  const url = `${siteUrl}/blog/${params.slug}`;

  // Nếu bài viết không tồn tại hoặc chưa xuất bản, trả về meta lỗi chuẩn xác
  if (!post) {
    return {
      title: "Bài viết không tồn tại | Sơn Xin Chào",
      robots: { index: false, follow: false }, // Ngăn Google index trang lỗi
    };
  }

  return {
    title: `${post.title} | Sơn Xin Chào`,
    description: post.excerpt || "",
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      url,
      siteName: "Sơn Xin Chào",
      images: post.cover_image
        ? [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }]
        : [],
      type: "article",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: post.cover_image ? [post.cover_image] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT (SERVER COMPONENT)
───────────────────────────────────────────── */
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostData(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sonxinchao.com";
  const url = `${siteUrl}/blog/${params.slug}`;

  // Xử lý giao diện nếu không tìm thấy bài viết trên Server
  if (!post) {
    return (
      <div className="text-center py-24 text-gray-400">
        <p className="text-xl font-semibold">Bài viết không tồn tại hoặc đã bị gỡ bỏ.</p>
      </div>
    );
  }

  /* ── Schema 1: Article ── */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    url,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    timeRequired: `PT${estimateReadingTime(post.content || "")}M`,
    inLanguage: "vi",
    author: {
      "@type": "Person",
      name: "Phan Đình Sơn",
      url: `${siteUrl}/gioi-thieu`,
      jobTitle: "Digital Marketing Specialist",
    },
    publisher: {
      "@type": "Organization",
      name: "Sơn Xin Chào",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(post.cover_image && {
      image: {
        "@type": "ImageObject",
        url: post.cover_image,
        width: 1200,
        height: 630,
      },
    }),
  };

  /* ── Schema 2: FAQPage ── */
  const faqs = post.content ? extractFAQs(post.content) : [];
  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: {
              "@type": "Answer",
              text: answer,
            },
          })),
        }
      : null;

  /* ── Schema 3: BreadcrumbList ── */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <>
      {/* ── JSON-LD Schema Injection ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <BlogPostClient initialPost={post} />
    </>
  );
}