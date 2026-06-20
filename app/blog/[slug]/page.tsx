import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import BlogPostClient from "./BlogPostClient";

type Props = { params: { slug: string } };

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

export default function BlogPostPage() {
  return <BlogPostClient />;
}
