"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr"; // Giải pháp chặn đứng spam request toàn cục
import Navbar from "@/components/Navbar";
import SearchStrip from "@/components/SearchStrip";
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 cursor-zoom-out"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Đóng"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div onClick={(e) => e.stopPropagation()} className="relative max-w-[92vw] max-h-[92vh] animate-in zoom-in-95 duration-200 cursor-default">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="max-w-[92vw] max-h-[85vh] w-auto h-auto rounded-xl shadow-2xl object-contain bg-neutral-900" draggable={false} />
        {alt && <p className="text-center text-white/80 text-sm mt-3 px-4 font-medium">{alt}</p>}
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs select-none">
        Nhấn Esc hoặc click bên ngoài để đóng
      </p>
    </div>
  );
}

/* ── Reading Progress Bar ── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? Math.min(100, Math.round((scrollTop / docH) * 100)) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-400 transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ── Back To Top ── */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Lên đầu trang"
      className={`fixed bottom-5 left-5 z-40 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:shadow-lg transition-all duration-200 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
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

/* ── Fetcher chuẩn hóa cho SWR ── */
const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error("Dữ liệu không phản hồi chính xác");
  return r.json();
});

/* ── Helpers ── */
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
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

function optimizeContentImages(html: string): string {
  let imgIndex = 0;
  return html.replace(/<img([^>]*?)(\s*\/?>)/gi, (_match, attrs) => {
    const isFirst = imgIndex === 0;
    imgIndex++;

    let newAttrs = attrs
      .replace(/\s+loading="[^"]*"/gi, "")
      .replace(/\s+decoding="[^"]*"/gi, "")
      .replace(/\s+style="[^"]*"/gi, "");

    newAttrs += ' style="max-width:100%;height:auto;border-radius:12px;"';

    const loadAttr = isFirst
      ? ' loading="eager" fetchpriority="high"'
      : ' loading="lazy" decoding="async"';

    const altMatch = attrs.match(/alt="([^"]*)"/i) || attrs.match(/alt='([^']*)'/i);
    const altText = altMatch ? altMatch[1].trim() : "";

    const imgTag = `<img${newAttrs}${loadAttr}>`;

    if (altText) {
      return `<figure class="my-6 text-center">${imgTag}<figcaption class="text-center text-xs text-gray-400 mt-2 italic">${altText}</figcaption></figure>`;
    }
    return `<figure class="my-6">${imgTag}</figure>`;
  });
}

const COLOR_MAP: Record<string, string> = {
  blue:    "bg-blue-50 text-blue-700 border-blue-200",
  violet:  "bg-violet-50 text-violet-700 border-violet-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  green:   "bg-green-50 text-green-700 border-green-200",
  orange:  "bg-orange-50 text-orange-700 border-orange-200",
  red:     "bg-red-50 text-red-700 border-red-200",
  indigo:  "bg-indigo-50 text-indigo-700 border-indigo-200",
  pink:    "bg-pink-50 text-pink-700 border-pink-200",
};

function getCategoryTag(categoryValue: string | null, dbCategories: DbCategory[]) {
  const cat = dbCategories.find(c => c.value === categoryValue);
  if (cat) {
    return {
      label:      cat.label,
      icon:       cat.icon || "📌",
      color:      COLOR_MAP[cat.color_key] || "bg-slate-50 text-slate-700 border-slate-200",
      breadcrumb: cat.label,
    };
  }
  return { label: "Kiến thức", color: "bg-orange-50 text-orange-700 border-orange-200", icon: "💡", breadcrumb: "Kiến thức" };
}

function formatDate(iso: string) {
  // timeZone bắt buộc: fix React hydration error #425 (server UTC+0 vs browser UTC+7)
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" });
}

/* ── TOC Component — mona.media style ── */
type TocGroup = { h2: TocItem; h3s: TocItem[] };

function useTocState(items: TocItem[]) {
  const [active, setActive] = useState<string>("");

  const groups = useMemo(() => {
    const res: TocGroup[] = [];
    for (const item of items) {
      if (item.level === 2) res.push({ h2: item, h3s: [] });
      else if (res.length > 0) res[res.length - 1].h3s.push(item);
    }
    return res;
  }, [items]);

  useEffect(() => {
    const handler = () => {
      const headings = items.map(i => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
      const scrollY = window.scrollY + 120;
      let current = "";
      for (const el of headings) { if (el.offsetTop <= scrollY) current = el.id; }
      setActive(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
  };

  return { active, groups, scrollTo };
}

/* ── TocList — H3 chỉ hiện khi group active hoặc manually expanded ── */
function TocList({ items, onItemClick }: { items: TocItem[]; onItemClick?: () => void }) {
  const { active, groups, scrollTo } = useTocState(items);
  // Track group mà user bấm mở tay (ngoài auto-expand theo scroll)
  const [manualOpen, setManualOpen] = useState<string | null>(null);
  if (items.length === 0) return null;

  // Group chứa heading đang active (theo scroll)
  const activeGroupId = groups.find(g => g.h2.id === active || g.h3s.some(h => h.id === active))?.h2.id ?? null;

  const handleH2Click = (id: string) => {
    // Toggle manual expand; nếu bấm vào group đang active thì không đóng
    if (id !== activeGroupId) {
      setManualOpen(prev => prev === id ? null : id);
    }
    scrollTo(id);
    onItemClick?.();
  };

  const handleH3Click = (id: string) => {
    scrollTo(id);
    onItemClick?.();
  };

  // H3s của 1 group hiện ra khi: đang là active group (scroll) HOẶC user bấm mở tay
  const isH3sVisible = (h2Id: string) => activeGroupId === h2Id || manualOpen === h2Id;

  return (
    <nav aria-label="Mục lục bài viết" className="py-2 space-y-0.5">
      {groups.map(({ h2, h3s }, idx) => {
        const isH2Active    = active === h2.id;
        const hasH3Active   = h3s.some(h => h.id === active);
        const isGroupActive = isH2Active || hasH3Active;
        const showH3s       = h3s.length > 0 && isH3sVisible(h2.id);

        return (
          <div key={h2.id}>
            {/* ── H2 ── */}
            <button
              onClick={() => handleH2Click(h2.id)}
              className={`w-full text-left flex items-center gap-2 py-2 pr-3 pl-3 text-[13px] leading-snug rounded-lg transition-all duration-200 border-l-[3px] ${
                isH2Active
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-bold"
                  : isGroupActive
                  ? "border-blue-200 bg-blue-50/40 text-slate-700 font-medium"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {/* Số thứ tự */}
              <span className={`flex-shrink-0 text-[11px] font-bold tabular-nums w-4 text-right ${
                isH2Active ? "text-blue-400" : "text-slate-300"
              }`}>{idx + 1}.</span>
              {/* Chấm tròn */}
              <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                isH2Active ? "bg-blue-500" : isGroupActive ? "bg-blue-200" : "bg-slate-200"
              }`} />
              <span className="flex-1 min-w-0">{h2.text}</span>
              {/* Mũi tên expand (chỉ hiện khi có H3) */}
              {h3s.length > 0 && (
                <svg
                  className={`flex-shrink-0 w-3 h-3 transition-transform duration-200 ${
                    showH3s ? "rotate-180 text-blue-400" : "text-slate-300"
                  }`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {/* ── H3 — chỉ hiện khi group active hoặc mở tay ── */}
            {showH3s && (
              <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-100 pl-2 animate-in slide-in-from-top-1 fade-in duration-150">
                {h3s.map(h3 => {
                  const isH3Active = active === h3.id;
                  return (
                    <button
                      key={h3.id}
                      onClick={() => handleH3Click(h3.id)}
                      className={`w-full text-left flex items-center gap-2 py-1.5 pr-3 pl-2 text-[11.5px] leading-snug rounded-md transition-all duration-200 ${
                        isH3Active
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`flex-shrink-0 w-1 h-1 rounded-full ${isH3Active ? "bg-blue-400" : "bg-slate-300"}`} />
                      <span className="flex-1 min-w-0">{h3.text}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ── Sidebar TOC (desktop left) ── */
function TableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);
  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h10M4 14h12M4 18h8" />
          </svg>
          <span className="text-slate-800 font-bold text-[13px]">Nội dung</span>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-violet-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-1">
          <TocList items={items} />
        </div>
      )}
    </div>
  );
}

/* ── Sidebar Related Posts (compact list dưới TOC) ── */
function SidebarRelatedPosts({ category, currentSlug }: { category: string | null; currentSlug: string }) {
  const url = `/api/posts?limit=5${category ? `&category=${encodeURIComponent(category)}` : ""}&exclude=${encodeURIComponent(currentSlug)}`;
  const { data } = useSWR<Post[]>(url, fetcher, { revalidateOnFocus: false, dedupingInterval: 120000 });
  const posts = useMemo(() => Array.isArray(data) ? data.slice(0, 4) : [], [data]);
  if (posts.length === 0) return null;

  return (
    <div className="mt-3 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
        <span className="w-0.5 h-4 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full flex-shrink-0" />
        <span className="text-[13px] font-bold text-slate-800">Bài viết liên quan</span>
      </div>
      <div className="py-1.5">
        {posts.map(p => (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-slate-50 transition-colors group"
          >
            {p.cover_image ? (
              <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                <Image src={p.cover_image} alt={p.title} fill unoptimized className="object-cover" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-50 to-violet-50 flex items-center justify-center flex-shrink-0 text-base border border-slate-100">
                📝
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-[12px] font-semibold text-slate-700 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                {p.title}
              </h4>
              <p className="text-[10.5px] text-slate-400 mt-1">{formatDate(p.created_at)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Floating TOC (mobile) ── */
function FloatingToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const close = (e: MouseEvent) => {
      if (!node.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      ref={panelRef}
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 lg:hidden transition-all duration-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}`}
    >
      {/* Panel mục lục — mở sang trái từ mép phải */}
      {open && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[min(80vw,300px)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-right-2 fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white">
            <span className="font-bold text-sm">Nội dung</span>
            <button onClick={() => setOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            <TocList items={items} onItemClick={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Nút bấm — sát mép phải, hình pill dẹt */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center w-8 h-16 rounded-l-xl shadow-lg transition-all duration-200 ${
          open
            ? "bg-violet-600 text-white shadow-violet-200"
            : "bg-white text-violet-600 border border-r-0 border-slate-200 hover:bg-violet-600 hover:text-white"
        }`}
        aria-label="Mục lục bài viết"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h10M4 14h12M4 18h8" />
        </svg>
      </button>
    </div>
  );
}

/* ── Related Posts ── */
function RelatedPosts({ category, currentSlug }: { category: string | null; currentSlug: string }) {
  const url = `/api/posts?limit=4${category ? `&category=${encodeURIComponent(category)}` : ""}&exclude=${encodeURIComponent(currentSlug)}`;
  const { data } = useSWR<Post[]>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });
  const posts = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.slice(0, 3);
  }, [data]);

  if (posts.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t-2 border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full flex-shrink-0" />
        Bài viết liên quan
      </h2>
      <div className="grid sm:grid-cols-3 gap-5">
        {posts.map(p => (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="group flex flex-col rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden bg-white"
          >
            {p.cover_image ? (
              <div className="relative h-40 overflow-hidden bg-slate-100 flex-shrink-0">
                <Image src={p.cover_image} alt={p.title} fill unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ) : (
              <div className="h-40 bg-gradient-to-br from-blue-50 to-violet-50 flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">📝</span>
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              {p.category && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1.5">{p.category}</span>
              )}
              <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
                {p.title}
              </h3>
              <p className="text-[11px] text-slate-400 mt-2.5">{formatDate(p.created_at)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function BlogPostClient({ initialPost }: { initialPost?: Post | null }) {
  const { slug } = useParams<{ slug: string }>();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  // ⚡ TỐI ƯU CƠ BẢN 1: Dùng useSWR lấy dữ liệu bài viết thay thế hoàn toàn useEffect thô sơ
  const { data: serverPost, error: postError } = useSWR(
    slug && !initialPost ? `/api/posts/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false, 
      dedupingInterval: 15000, 
    }
  );

  // ⚡ TỐI ƯU CƠ BẢN 2: Tái sử dụng cache danh mục từ trang cha, tránh gửi request thừa
  const { data: catsData } = useSWR("/api/categories", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const post = initialPost || serverPost;
  const dbCategories = useMemo(() => Array.isArray(catsData) ? catsData : [], [catsData]);
  const loading = !post && !postError;

  // Hàm loại bỏ ảnh bìa trùng lặp trong chuỗi HTML an toàn
  const cleanDuplicateCover = useCallback((html: string, src: string) => {
    if (!html || !src) return html;
    const escapedSrc = src.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const imgRegex = new RegExp(`<img[^>]*src=["']${escapedSrc}["'][^>]*>`, "gi");
    return html.replace(imgRegex, "");
  }, []);

  // ⚡ TỐI ƯU CƠ BẢN 3: Đưa toàn bộ tác vụ băm văn bản xử lý HTML nặng vào useMemo để giảm tải cho CPU
  const processedData = useMemo(() => {
    if (!post?.content) return { toc: [], html: "" };
    
    let rawHtml = post.content;
    rawHtml = cleanDuplicateCover(rawHtml, post.cover_image || "");
    const { toc: t, html } = buildTocAndInjectIds(rawHtml);
    const optimizedHtml = optimizeContentImages(html);
    
    return { toc: t, html: optimizedHtml };
  }, [post?.content, post?.cover_image, cleanDuplicateCover]);

  const handleArticleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const img = target as HTMLImageElement;
      if (img.src) setLightbox({ src: img.src, alt: img.alt || "" });
    }
  }, []);

  // ── Copy Code Button: inject vào mọi <pre> sau khi article render ──
  useEffect(() => {
    if (!processedData.html) return;
    const t = setTimeout(() => {
      document.querySelectorAll(".blog-content pre:not([data-copy])").forEach(pre => {
        pre.setAttribute("data-copy", "1");
        (pre as HTMLElement).style.position = "relative";
        const btn = document.createElement("button");
        btn.className =
          "absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md bg-slate-700/80 text-slate-300 hover:bg-slate-500 hover:text-white transition-all backdrop-blur-sm select-none";
        btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy`;
        btn.addEventListener("click", async () => {
          const text = ((pre.querySelector("code") as HTMLElement)?.innerText ?? (pre as HTMLElement).innerText ?? "").trim();
          try {
            await navigator.clipboard.writeText(text);
            btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> Copied!`;
            btn.classList.add("bg-green-600", "text-white");
            btn.classList.remove("bg-slate-700/80", "text-slate-300");
          } catch {
            btn.innerHTML = "✗ Lỗi";
          }
          setTimeout(() => {
            btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy`;
            btn.classList.remove("bg-green-600", "text-white");
            btn.classList.add("bg-slate-700/80", "text-slate-300");
          }, 2000);
        });
        pre.appendChild(btn);
      });
    }, 400);
    return () => clearTimeout(t);
  }, [processedData.html]);

  const mins = useMemo(() => {
    if (!post?.content) return 1;
    return Math.max(1, Math.round(post.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));
  }, [post?.content]);

  const tag = useMemo(() => getCategoryTag(post?.category ?? null, dbCategories), [post?.category, dbCategories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar /><SearchStrip />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar /><SearchStrip />
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

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <ReadingProgress />
      <Navbar />
      <SearchStrip />

      <div>
        {/* Breadcrumb */}
        <div className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* TOC trái (240px) — bài viết phải (1fr) */}
          <div className="grid lg:grid-cols-[240px_1fr] gap-6 lg:gap-10 items-start">

            {/* ── LEFT: TOC Sidebar + Related Posts (sticky, scroll nội bộ) ── */}
            <aside className="hidden lg:flex flex-col self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto gap-0 scrollbar-hide">
              <TableOfContents items={processedData.toc} />
              <SidebarRelatedPosts category={post.category ?? null} currentSlug={post.slug} />
            </aside>

            {/* ── Article ── */}
            <main>
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

              <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-extrabold text-slate-900 leading-tight mb-5 tracking-tight">
                {post.title}
              </h1>

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

              {post.excerpt && (
                <p className="text-slate-600 font-medium text-[15.5px] leading-relaxed mb-6 px-4 py-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl">
                  {post.excerpt}
                </p>
              )}

              {post.cover_image && (
                <div
                  className="mb-8 rounded-2xl overflow-hidden shadow-md cursor-zoom-in relative aspect-[1200/630]"
                  onClick={() => setLightbox({ src: post.cover_image!, alt: post.title })}
                >
                  <Image src={post.cover_image} alt={post.title} fill className="object-cover" unoptimized priority />
                </div>
              )}

              <article
                className="blog-content max-w-none overflow-x-hidden"
                dangerouslySetInnerHTML={{ __html: processedData.html }}
                onClick={handleArticleClick}
              />

              {/* Author Card — nằm sau bài viết */}
              <div className="mt-10 flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow flex-shrink-0">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-800 font-bold text-sm">Phan Đình Sơn</div>
                  <div className="text-slate-400 text-xs mt-0.5">Digital Marketing Specialist</div>
                  <p className="text-slate-500 text-sm leading-relaxed mt-1.5">
                    Chuyên gia SEO, Google Ads & Facebook Ads với 3+ năm kinh nghiệm thực chiến.
                  </p>
                </div>
                <Link href="/contact"
                  className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all text-sm shadow whitespace-nowrap hidden sm:block">
                  💬 Tư vấn miễn phí
                </Link>
              </div>

              {/* Share */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

              {/* CTA Box */}
              <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white">
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

              {/* Related Posts */}
              <RelatedPosts category={post.category} currentSlug={post.slug} />
            </main>

          </div>
        </div>
      </div>

      <Footer />
      <FloatingContacts />
      <FloatingToc items={processedData.toc} />
      <BackToTop />

      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />}
    </div>
  );
}