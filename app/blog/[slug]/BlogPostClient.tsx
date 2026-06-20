"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";

/* ── Lightbox ── */
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 cursor-zoom-out"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Đóng"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[92vw] max-h-[92vh] animate-in zoom-in-90 duration-200 cursor-default"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-[92vw] max-h-[92vh] w-auto h-auto rounded-xl shadow-2xl object-contain"
          draggable={false}
        />
        {alt && (
          <p className="text-center text-white/70 text-sm mt-3 px-4">{alt}</p>
        )}
      </div>

      {/* Hint */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs select-none">
        Nhấn Esc hoặc click bên ngoài để đóng
      </p>
    </div>
  );
}

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  category: string | null;
};

type DbCategory = { id: string; label: string; value: string; icon: string; color_key: string };

type TocItem = { level: 2 | 3; text: string; id: string };

/* ── Helpers ── */
function slugify(text: string) {
  return text
    .toLowerCase()
    // ̀-ͯ = toàn bộ combining diacritical marks — bao gồm dấu tiếng Việt
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    // đ/Đ không phân rã bởi NFD nên phải xử lý riêng
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")          // gộp nhiều dash liên tiếp
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
    const cleanAttrs = attrs.replace(/\s+id="[^"]*"/gi, "").replace(/\s+id='[^']*'/gi, "");
    return `<${tag}${cleanAttrs} id="${id}">${inner}</${tag}>`;
  });
  return { toc, html: result };
}

/* ── Tối ưu ảnh trong bài viết cho mobile ──
   - Ảnh đầu tiên: eager (above the fold)
   - Các ảnh còn lại: lazy + decoding=async (tiết kiệm bandwidth mobile)
   - Thêm style="max-width:100%;height:auto" tránh overflow trên màn nhỏ
   - Wrap trong div để căn giữa và có caption nếu có alt
──────────────────────────────────────────── */
function optimizeContentImages(html: string): string {
  let imgIndex = 0;
  return html.replace(/<img([^>]*?)(\s*\/?>)/gi, (_match, attrs) => {
    const isFirst = imgIndex === 0;
    imgIndex++;

    // Xóa loading/decoding/style cũ
    let newAttrs = attrs
      .replace(/\s+loading="[^"]*"/gi, "")
      .replace(/\s+decoding="[^"]*"/gi, "")
      .replace(/\s+style="[^"]*"/gi, "");

    // Style responsive mobile
    newAttrs += ' style="max-width:100%;height:auto;border-radius:8px"';

    const loadAttr = isFirst
      ? ' loading="eager" fetchpriority="high"'
      : ' loading="lazy" decoding="async"';

    // Lấy alt text để dùng làm caption
    const altMatch = attrs.match(/alt="([^"]*)"/i) || attrs.match(/alt='([^']*)'/i);
    const altText = altMatch ? altMatch[1].trim() : "";

    const imgTag = `<img${newAttrs}${loadAttr}>`;

    // Wrap trong <figure> + thêm <figcaption> nếu có alt text
    if (altText) {
      return `<figure>${imgTag}<figcaption>${altText}</figcaption></figure>`;
    }
    return `<figure>${imgTag}</figure>`;
  });
}

const COLOR_MAP: Record<string, string> = {
  blue:    "bg-blue-100 text-blue-700 border-blue-200",
  violet:  "bg-violet-100 text-violet-700 border-violet-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  green:   "bg-green-100 text-green-700 border-green-200",
  orange:  "bg-orange-100 text-orange-700 border-orange-200",
  red:     "bg-red-100 text-red-700 border-red-200",
  indigo:  "bg-indigo-100 text-indigo-700 border-indigo-200",
  pink:    "bg-pink-100 text-pink-700 border-pink-200",
};

function getCategoryTag(categoryValue: string | null, dbCategories: DbCategory[]) {
  // Tìm đúng category từ DB
  const cat = dbCategories.find(c => c.value === categoryValue);
  if (cat) {
    return {
      label:      cat.label,
      icon:       cat.icon || "📌",
      color:      COLOR_MAP[cat.color_key] || "bg-slate-100 text-slate-700 border-slate-200",
      breadcrumb: cat.label,
    };
  }
  // Fallback nếu chưa load xong hoặc category không tồn tại
  return { label: "Kiến thức", color: "bg-orange-100 text-orange-700 border-orange-200", icon: "💡", breadcrumb: "Kiến thức" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function readingTime(content: string) {
  return Math.max(1, Math.round(content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));
}

/* ── TOC Component ── */
type TocGroup = { h2: TocItem; h3s: TocItem[] };

function TableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState<string>("");
  const [expandedH2s, setExpandedH2s] = useState<Set<string>>(new Set());

  // Nhóm h3 vào h2 cha gần nhất
  const groups: TocGroup[] = [];
  for (const item of items) {
    if (item.level === 2) {
      groups.push({ h2: item, h3s: [] });
    } else if (groups.length > 0) {
      groups[groups.length - 1].h3s.push(item);
    }
  }

  // Scroll spy — cập nhật heading đang active
  useEffect(() => {
    const handler = () => {
      const headings = items.map(i => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
      const scrollY = window.scrollY + 110;
      let current = "";
      for (const el of headings) {
        if (el.offsetTop <= scrollY) current = el.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler(); // chạy ngay khi mount
    return () => window.removeEventListener("scroll", handler);
  }, [items]);

  // Auto-expand h2 nào chứa heading đang active
  useEffect(() => {
    if (!active) return;
    for (const { h2, h3s } of groups) {
      if (h2.id === active || h3s.some(h => h.id === active)) {
        setExpandedH2s(prev => prev.has(h2.id) ? prev : new Set([...prev, h2.id]));
        break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const toggleH2 = (id: string) => {
    setExpandedH2s(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden mb-8 bg-white">
      {/* Header — bật/tắt toàn bộ TOC */}
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

      {/* Danh sách — accordion h2 → h3 */}
      {open && (
        <ul className="px-4 py-2.5 space-y-0.5">
          {groups.map(({ h2, h3s }) => {
            const isExpanded = expandedH2s.has(h2.id);
            const isH2Active = active === h2.id;
            const hasH3Active = h3s.some(h => h.id === active);
            const hasChildren = h3s.length > 0;

            return (
              <li key={h2.id}>
                {/* H2 row */}
                <div className="flex items-center gap-1 group">
                  {/* Nút mở/đóng h3 — chỉ hiện khi có con */}
                  <button
                    onClick={() => hasChildren && toggleH2(h2.id)}
                    className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors
                      ${hasChildren ? "hover:bg-slate-100 cursor-pointer" : "cursor-default"}`}
                    tabIndex={hasChildren ? 0 : -1}
                    aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
                  >
                    {hasChildren && (
                      <svg
                        className={`w-2.5 h-2.5 text-slate-400 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>

                  {/* H2 text — click để scroll */}
                  <button
                    onClick={() => scrollTo(h2.id)}
                    className={`flex-1 text-left py-1.5 text-sm font-semibold leading-snug transition-colors
                      ${isH2Active || hasH3Active
                        ? "text-blue-600"
                        : "text-slate-800 hover:text-blue-600"
                      }`}
                  >
                    {h2.text}
                  </button>
                </div>

                {/* H3 list — accordion */}
                {hasChildren && isExpanded && (
                  <ul className="ml-6 mt-0.5 mb-1.5 pl-3 border-l-2 border-slate-100 space-y-0">
                    {h3s.map(h3 => (
                      <li key={h3.id}>
                        <button
                          onClick={() => scrollTo(h3.id)}
                          className={`w-full text-left py-1 text-xs leading-snug transition-colors
                            ${active === h3.id
                              ? "text-blue-500 font-semibold"
                              : "text-slate-500 hover:text-blue-500"
                            }`}
                        >
                          {h3.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function BlogPostClient({ initialPost }: { initialPost?: Post | null }) {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(initialPost ?? null);
  const [processedContent, setProcessedContent] = useState("");
  const [toc, setToc] = useState<TocItem[]>([]);
  const [loading, setLoading] = useState(!initialPost);
  const [notFound, setNotFound] = useState(false);
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([]);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!slug) return;

    if (initialPost) {
      // Đã có post từ server — process content ngay, chỉ fetch categories
      let rawHtml = initialPost.content || "";
      if (initialPost.cover_image && rawHtml) {
        const src = initialPost.cover_image;
        for (const needle of [`src="${src}"`, `src='${src}'`]) {
          const srcIdx = rawHtml.indexOf(needle);
          if (srcIdx === -1) continue;
          const tagStart = rawHtml.lastIndexOf("<img", srcIdx);
          if (tagStart === -1) continue;
          const tagEnd = rawHtml.indexOf(">", srcIdx);
          if (tagEnd === -1) continue;
          rawHtml = rawHtml.substring(0, tagStart) + rawHtml.substring(tagEnd + 1);
        }
      }
      const { toc: t, html } = buildTocAndInjectIds(rawHtml);
      setToc(t);
      setProcessedContent(optimizeContentImages(html));
      setLoading(false);

      fetch("/api/categories", { cache: "no-store" })
        .then(r => r.json())
        .then(cats => { if (Array.isArray(cats)) setDbCategories(cats); })
        .catch(() => {});
      return;
    }

    // Fetch post + categories cùng lúc (fallback khi không có initialPost)
    Promise.all([
      fetch(`/api/posts/${slug}`, { cache: "no-store" }),
      fetch("/api/categories", { cache: "no-store" }),
    ]).then(async ([postRes, catRes]) => {
      if (!postRes.ok) { setNotFound(true); setLoading(false); return; }
      const [d, cats] = await Promise.all([postRes.json(), catRes.json()]);
      if (Array.isArray(cats)) setDbCategories(cats);
      if (d) {
        let rawHtml = d.content || "";
          // Strip cover image from content if it appears there too (avoid duplicate)
          if (d.cover_image && rawHtml) {
            // Use simple string matching — more reliable than regex for URLs
            const removeImgWithSrc = (html: string, src: string) => {
              const needle = `src="${src}"`;
              const needle2 = `src='${src}'`;
              for (const n of [needle, needle2]) {
                const srcIdx = html.indexOf(n);
                if (srcIdx === -1) continue;
                const tagStart = html.lastIndexOf("<img", srcIdx);
                if (tagStart === -1) continue;
                // img tag ends at > (account for self-closing />)
                const tagEnd = html.indexOf(">", srcIdx);
                if (tagEnd === -1) continue;
                html = html.substring(0, tagStart) + html.substring(tagEnd + 1);
              }
              return html;
            };
            rawHtml = removeImgWithSrc(rawHtml, d.cover_image);
          }
          const { toc: t, html } = buildTocAndInjectIds(rawHtml);
          setToc(t);
          setProcessedContent(optimizeContentImages(html));
          setPost(d);
          setLoading(false);
        }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  // Lightbox handler dùng event delegation — bắt click từ bất kỳ img nào trong article
  // Không cần useEffect vì React onClick bubble lên từ img dù nested sâu bao nhiêu
  const handleArticleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const img = target as HTMLImageElement;
      if (img.src) setLightbox({ src: img.src, alt: img.alt || "" });
    }
  }, []);

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

  const tag = getCategoryTag(post.category ?? null, dbCategories);
  const mins = readingTime(post.content);

  return (
    <div className="min-h-screen bg-white">
      {/* blog-content styles → globals.css */}
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

              {/* Cover image — click để phóng to */}
              {post.cover_image && (
                <div
                  className="mb-8 rounded-2xl overflow-hidden shadow-md cursor-zoom-in"
                  onClick={() => setLightbox({ src: post.cover_image!, alt: post.title })}
                >
                  <Image src={post.cover_image} alt={post.title} width={1200} height={630} className="w-full object-cover" unoptimized priority />
                </div>
              )}

              {/* Article body — event delegation: click bất kỳ img nào (dù nested sâu) → lightbox */}
              <article
                className="blog-content max-w-none"
                dangerouslySetInnerHTML={{ __html: processedContent }}
                onClick={handleArticleClick}
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
                  <Link href="/contact"
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
                  <Link href="/contact"
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
      <FloatingContacts />

      {/* Lightbox — hiển thị khi click ảnh */}
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />}
    </div>
  );
}
