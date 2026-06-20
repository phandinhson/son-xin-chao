import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import BlogPostClient from "./BlogPostClient";

type Props = { params: { slug: string } };

/* ─────────────────────────────────────────────
   Helper: trích FAQ từ nội dung HTML
   Tìm cặp <h3>...</h3><p>...</p> bên trong
   phần có class hoặc id chứa "faq"
───────────────────────────────────────────── */
function extractFAQs(html: string) {
  const faqs: { question: string; answer: string }[] = [];
  // Tìm tất cả cặp <h3>...</h3> liền theo bởi <p>...</p>
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
   Helper: đọc thời gian đọc ước tính (phút)
───────────────────────────────────────────── */
function estimateReadingTime(html: string) {
  const words = html.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sonxinchao.com";
  const url = `${siteUrl}/blog/${params.slug}`;

  if (!post) {
    return {
      title: "Bài viết không tồn tại | Sơn Xin Chào",
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
        ? [
            {
              url: post.cover_image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
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

export default async function BlogPostPage({ params }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sonxinchao.com";
  const url = `${siteUrl}/blog/${params.slug}`;

  /* Fetch đủ field để build schema */
  const { data: post } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, cover_image, content, created_at, updated_at, category")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  /* ── Schema 1: Article ── */
  const articleSchema = post
    ? {
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
      }
    : null;

  /* ── Schema 2: FAQPage ── */
  const faqs = post?.content ? extractFAQs(post.content) : [];
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
      ...(post
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: url,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      {/* ── JSON-LD Schema Injection ── */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
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
