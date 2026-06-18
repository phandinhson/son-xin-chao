"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import FloatingContacts from "@/components/FloatingContacts";

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
};

type TocItem = { level: 2 | 3; text: string; id: string };

/* ── Helpers ── */
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function buildTocAndInjectIds(html: string): { toc: TocItem[]; html: string } {
  const toc: TocItem[] = [];
  const counts: Record<string, number> = {};
  const result = html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/h[23]>/gi, (_m, tag, attrs, inner) => {
    const level = parseInt(tag[1]) as 2 | 3;
    const text = inner.replace(/<[^>]*>/g, "").trim();
    const base = slugify(text) || `heading-${toc.length}`;
    counts[base] = (counts[base] || 0) + 1;
    const id = counts[base] > 1 ? `${base}-${counts[base]}` : base;
    toc.push({ level, text, id });
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });
  return { toc, html: result };
}

function getTag(title: string) {
  const t = title.toLowerCase();
  if (t.includes("seo")) return { label: "SEO", color: "bg-green-100 text-green-700 border-green-200", icon: "🔍", breadcrumb: "SEO" };
  if (t.includes("facebook") || t.includes("tiktok")) return { label: "Facebook Ads", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: "📣", breadcrumb: "Facebook Ads" };
  if (t.includes("ads") || t.includes("quảng cáo")) return { label: "Google Ads", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "📊", breadcrumb: "Google Ads" };
  if (t.includes("website") || t.includes("wordpress")) return { label: "Website", color: "bg-violet-100 text-violet-700 border-violet-200", icon: "💻", breadcrumb: "Website" };
  return { label: "Tips", color: "bg-orange-100 text-orange-700 border-orange-200", icon: "💡", breadcrumb: "Kiến thức" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function readingTime(content: string) {
  return Math.max(1, Math.round(content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));
}

/* ── TOC Component ── */
function TableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const handler = () => {
      const headings = items.map(i => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
      const scrollY = window.scrollY + 100;
      let current = "";
      for (const el of headings) {
        if (el.offsetTop <= scrollY) current = el.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden mb-8 bg-white">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white hover:bg-slate-50 transition-colors border-b border-slate-100"
      >
        <div className="flex items-center gap-2.5 text-slate-800 font-bold text-[15px]">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h10M4 14h12M4 18h8" />
          </svg>
          Nội dung bài viết
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Items */}
      {open && (
        <ul className="px-5 py-3 space-y-0">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={`w-full text-left flex items-start gap-2 py-1.5 transition-colors
                  ${item.level === 3 ? "pl-5" : ""}
                  ${active === item.id
                    ? item.level === 2 ? "text-blue-600" : "text-blue-500"
                    : item.level === 2
                      ? "text-slate-800 hover:text-blue-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {item.level === 3 && (
                  <svg
                    className={`flex-shrink-0 w-3 h-3 mt-1.5 ${active === item.id ? "text-blue-400" : "text-slate-300"}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
                <span className={`leading-snug text-sm ${item.level === 2 ? "font-semibold" : "font-normal"}`}>
                  {item.text}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [processedContent, setProcessedContent] = useState("");
  const [toc, setToc] = useState<TocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/posts/${slug}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((d: Post | null) => {
        if (d) {
          let rawHtml = d.content;
          // Strip cover image from content if it appears there too (avoid duplicate)
          if (d.cover_image) {
            const escaped = d.cover_image.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            rawHtml = rawHtml.replace(
              new RegExp(`<img[^>]*src=["']${escaped}["'][^>]*\/?>`, "gi"),
              ""
            );
          }
          const { toc: t, html } = buildTocAndInjectIds(rawHtml);
          setToc(t);
          setProcessedContent(html);
          setPost(d);
          setLoading(false);
        }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center px-6">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy bài viết</h1>
            <p className="text-slate-500 mb-6 text-sm">Bài viết không tồn tại hoặc đã bị xóa.</p>
            <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all text-sm">
              ← Quay lại Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tag = getTag(post.title);
  const mins = readingTime(post.content);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Custom article styles ── */}
      <style>{`
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding: 0.75rem 1rem 0.75rem 1.25rem;
          border-left: 4px solid #2563eb;
          background: linear-gradient(to right, #eff6ff, #f8fafc);
          border-radius: 0 10px 10px 0;
          line-height: 1.4;
          scroll-margin-top: 90px;
        }
        .blog-content h2:first-child { margin-top: 0; }

        .blog-content h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1d4ed8;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          padding-left: 0.75rem;
          border-left: 3px solid #93c5fd;
          line-height: 1.45;
          scroll-margin-top: 90px;
        }

        .blog-content h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #334155;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          scroll-margin-top: 90px;
        }

        .blog-content p {
          font-size: 15px;
          line-height: 1.85;
          color: #475569;
          margin-bottom: 1.1rem;
        }

        .blog-content ul, .blog-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1.1rem;
        }
        .blog-content ul { list-style: none; padding-left: 0; }
        .blog-content ul li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
          font-size: 15px;
          color: #475569;
          line-height: 1.75;
        }
        .blog-content ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #2563eb;
        }
        .blog-content ol li {
          margin-bottom: 0.5rem;
          font-size: 15px;
          color: #475569;
          line-height: 1.75;
        }

        .blog-content strong { color: #1e293b; font-weight: 700; }
        .blog-content a { color: #2563eb; font-weight: 500; text-decoration: none; }
        .blog-content a:hover { text-decoration: underline; }

        .blog-content img {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin: 1.5rem auto;
          max-width: 100%;
        }

        .blog-content blockquote {
          border-left: 4px solid #2563eb;
          background: #eff6ff;
          border-radius: 0 12px 12px 0;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
          color: #1e40af;
          font-weight: 600;
          font-style: normal;
        }
        .blog-content blockquote p { color: #1e40af; margin: 0; }

        .blog-content code {
          background: #eff6ff;
          color: #2563eb;
          padding: 2px 7px;
          border-radius: 5px;
          font-size: 13px;
        }
        .blog-content pre {
          background: #0f172a;
          border-radius: 12px;
          padding: 1.25rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .blog-content pre code {
          background: transparent;
          color: #e2e8f0;
          padding: 0;
          font-size: 13px;
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 14px;
        }
        .blog-content th {
          background: #f1f5f9;
          color: #334155;
          font-weight: 700;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          text-align: left;
        }
        .blog-content td {
          padding: 0.65rem 1rem;
          border: 1px solid #e2e8f0;
          color: #475569;
        }
        .blog-content tr:nth-child(even) td { background: #f8fafc; }

        .blog-content hr {
          border: none;
          border-top: 2px solid #f1f5f9;
          margin: 2rem 0;
        }
      `}</style>

      <Navbar />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-blue-600 font-medium">{tag.breadcrumb}</span>
              <span>/</span>
              <span className="text-slate-400 truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-[1fr_300px] gap-10">

            {/* ── Article ── */}
            <main>
              {/* Tag + meta */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border ${tag.color}`}>
                  {tag.icon} {tag.label}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/></svg>
                  {mins} phút đọc
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-extrabold text-slate-900 leading-tight mb-5 tracking-tight">
                {post.title}
              </h1>

              {/* Author bar */}
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  S
                </div>
                <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold text-blue-600">Phan Đình Sơn</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-400 text-sm">Cập nhật: {formatDate(post.updated_at || post.created_at)}</span>
                </div>
              </div>

              {/* Excerpt — bold */}
              {post.excerpt && (
                <p className="text-slate-700 font-semibold text-[15px] leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              )}

              {/* ── TABLE OF CONTENTS ── */}
              <TableOfContents items={toc} />

              {/* Cover image */}
              {post.cover_image && (
                <div className="mb-8 rounded-2xl overflow-hidden shadow-md">
                  <img src={post.cover_image} alt={post.title} className="w-full object-cover" />
                </div>
              )}

              {/* Article body */}
              <article
                className="blog-content max-w-none"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />

              {/* Tags & Share */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm font-medium">Chia sẻ:</span>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-all">
                    📘 Facebook
                  </a>
                  <a href={`https://zalo.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&title=${encodeURIComponent(post.title)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="px-4 py-1.5 bg-cyan-500 text-white text-xs font-semibold rounded-lg hover:bg-cyan-600 transition-all">
                    💬 Zalo
                  </a>
                </div>
                <Link href="/blog" className="text-slate-400 hover:text-blue-600 transition-colors text-sm flex items-center gap-1.5">
                  ← Xem tất cả bài viết
                </Link>
              </div>

              {/* CTA box */}
              <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="text-4xl flex-shrink-0">🚀</div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-1">Bạn cần tư vấn chiến lược marketing?</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      Liên hệ ngay để được phân tích website & đề xuất giải pháp phù hợp — miễn phí, không ràng buộc.
                    </p>
                  </div>
                  <Link href="/#contact"
                    className="flex-shrink-0 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:scale-105 transition-all text-sm shadow-md whitespace-nowrap">
                    Tư vấn miễn phí →
                  </Link>
                </div>
              </div>
            </main>

            {/* ── Sidebar ── */}
            <aside className="space-y-5">

              {/* Sticky TOC cho desktop */}
              <div className="hidden lg:block sticky top-24">
                <TableOfContents items={toc} />

                {/* Author */}
                <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50 mb-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow">
                      S
                    </div>
                    <div>
                      <div className="text-slate-800 font-bold text-sm">Phan Đình Sơn</div>
                      <div className="text-slate-400 text-xs mt-0.5">Digital Marketing Specialist</div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    Chuyên gia SEO, Google Ads & Facebook Ads với 3+ năm kinh nghiệm.
                  </p>
                  <Link href="/#contact"
                    className="block w-full py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl text-center hover:opacity-90 transition-all text-sm shadow">
                    💬 Tư vấn miễn phí
                  </Link>
                </div>

                {/* Phone CTA */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100">
                  <p className="text-slate-700 text-sm font-bold mb-1">Cần tư vấn ngay?</p>
                  <p className="text-slate-500 text-xs mb-3">Phản hồi trong 30 phút</p>
                  <a href="tel:0968806360"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all text-sm shadow">
                    📞 0968 806 360
                  </a>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </div>

      <Footer />
      <MobileBar />
      <FloatingContacts />
    </div>
  );
}
