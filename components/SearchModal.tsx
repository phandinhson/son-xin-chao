"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type Post = { id: string; title: string; slug: string; excerpt: string | null; created_at: string };

type Result = {
  id: string;
  type: "post" | "service" | "section" | "recent";
  label: string;
  desc?: string;
  href: string;
  icon: string;
  tag?: string;
};

const SECTIONS: Result[] = [
  { id: "s1", type: "section", label: "Giới thiệu về Sơn", desc: "Kinh nghiệm, kỹ năng & chứng chỉ", href: "#about", icon: "👤", tag: "Trang chủ" },
  { id: "s2", type: "section", label: "Dịch vụ SEO & Ads", desc: "SEO Organic, Google Ads, Facebook Ads", href: "#services", icon: "🚀", tag: "Trang chủ" },
  { id: "s3", type: "section", label: "Portfolio — Kết quả thực tế", desc: "Các dự án đã triển khai", href: "#portfolio", icon: "📊", tag: "Trang chủ" },
  { id: "s4", type: "section", label: "Bảng giá dịch vụ", desc: "Báo giá SEO, Ads, Website", href: "/pricing", icon: "💰", tag: "Trang chủ" },
  { id: "s5", type: "section", label: "Liên hệ tư vấn", desc: "Gửi yêu cầu, nhận tư vấn miễn phí", href: "/contact", icon: "✉️", tag: "Trang chủ" },
  { id: "s6", type: "section", label: "Tất cả bài viết Blog", desc: "SEO, Ads, Website, Tips", href: "/blog", icon: "📝", tag: "Blog" },
];

const SERVICES: Result[] = [
  { id: "sv1", type: "service", label: "Dịch vụ SEO Organic", desc: "Lên top Google tự nhiên, bền vững", href: "#services", icon: "🔍", tag: "Dịch vụ" },
  { id: "sv2", type: "service", label: "Google Ads", desc: "Tìm kiếm & Display, tối ưu ROAS", href: "#services", icon: "📢", tag: "Dịch vụ" },
  { id: "sv3", type: "service", label: "Facebook & TikTok Ads", desc: "Target đúng đối tượng, tối ưu chi phí", href: "#services", icon: "📱", tag: "Dịch vụ" },
  { id: "sv4", type: "service", label: "Thiết kế Website WordPress", desc: "Chuẩn SEO, tốc độ cao, chuyên nghiệp", href: "#services", icon: "💻", tag: "Dịch vụ" },
  { id: "sv5", type: "service", label: "SEO Local / Google Map", desc: "Hiển thị nổi bật trên bản đồ địa phương", href: "#services", icon: "📍", tag: "Dịch vụ" },
  { id: "sv6", type: "service", label: "Tư vấn & Audit Marketing", desc: "Phân tích, lên chiến lược toàn diện", href: "/contact", icon: "🎯", tag: "Dịch vụ" },
];

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5 not-italic">{part}</mark>
      : part
  );
}

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "blog" | "service" | "section">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load posts once
  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => {});
    // Load recent searches
    try {
      const r = JSON.parse(localStorage.getItem("sx_recent") || "[]");
      setRecent(r.slice(0, 5));
    } catch {}
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery("");
      setActiveIdx(-1);
      setActiveTab("all");
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Build results
  const postResults: Result[] = posts
    .filter((p) => {
      if (!query.trim()) return false;
      const q = query.toLowerCase();
      return p.title.toLowerCase().includes(q) || (p.excerpt || "").toLowerCase().includes(q);
    })
    .slice(0, 5)
    .map((p) => ({
      id: p.id, type: "post" as const,
      label: p.title, desc: p.excerpt || "",
      href: `/blog/${p.slug}`, icon: "📄", tag: "Blog",
    }));

  const sectionResults = SECTIONS.filter((s) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return s.label.toLowerCase().includes(q) || (s.desc || "").toLowerCase().includes(q);
  });

  const serviceResults = SERVICES.filter((s) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return s.label.toLowerCase().includes(q) || (s.desc || "").toLowerCase().includes(q);
  });

  const allResults: Result[] = (() => {
    if (activeTab === "blog") return postResults;
    if (activeTab === "service") return serviceResults;
    if (activeTab === "section") return sectionResults;
    if (!query.trim()) return [...sectionResults, ...serviceResults];
    return [...postResults, ...serviceResults, ...sectionResults];
  })();

  // Keyboard navigation
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, allResults.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    if (e.key === "Enter" && activeIdx >= 0 && allResults[activeIdx]) {
      navigate(allResults[activeIdx]);
    }
  }, [allResults, activeIdx]);

  const navigate = (r: Result) => {
    // Save to recent
    if (query.trim()) {
      const updated = [query, ...recent.filter((x) => x !== query)].slice(0, 5);
      setRecent(updated);
      try { localStorage.setItem("sx_recent", JSON.stringify(updated)); } catch {}
    }
    onClose();
    if (r.href.startsWith("#")) {
      const el = document.querySelector(r.href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(r.href);
    }
  };

  const clearRecent = () => {
    setRecent([]);
    try { localStorage.removeItem("sx_recent"); } catch {}
  };

  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "blog", label: "Blog" },
    { key: "service", label: "Dịch vụ" },
    { key: "section", label: "Điều hướng" },
  ] as const;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
            onKeyDown={handleKey}
            placeholder="Tìm kiếm dịch vụ, bài viết, thông tin..."
            className="flex-1 text-slate-800 placeholder-slate-400 text-base bg-transparent focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button onClick={onClose} className="ml-1 px-2.5 py-1 bg-slate-100 text-slate-500 text-xs rounded-lg hover:bg-slate-200 transition-colors font-mono">
            ESC
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 pb-1 border-b border-slate-50">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setActiveIdx(-1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}>
              {tab.label}
            </button>
          ))}
          {query && (
            <span className="ml-auto text-xs text-slate-400">{allResults.length} kết quả</span>
          )}
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[440px] overflow-y-auto py-2">
          {/* Recent searches (no query) */}
          {!query.trim() && recent.length > 0 && (
            <div className="px-4 pt-2 pb-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tìm kiếm gần đây</span>
                <button onClick={clearRecent} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Xóa</button>
              </div>
              {recent.map((r, i) => (
                <button key={i} onClick={() => setQuery(r)}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left">
                  <span className="text-slate-400">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="text-slate-600 text-sm">{r}</span>
                </button>
              ))}
              <div className="border-t border-slate-100 my-3" />
            </div>
          )}

          {/* Group results */}
          {allResults.length === 0 && query.trim() && (
            <div className="text-center py-12 px-4">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-slate-700 font-semibold mb-1">Không tìm thấy kết quả</p>
              <p className="text-slate-400 text-sm">Thử từ khóa khác hoặc liên hệ trực tiếp</p>
              <button onClick={() => navigate(SECTIONS[4])}
                className="mt-4 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors">
                Liên hệ tư vấn →
              </button>
            </div>
          )}

          {/* Grouped display */}
          {(() => {
            const groups: { label: string; items: Result[] }[] = [];
            if (activeTab === "all" && !query.trim()) {
              groups.push({ label: "Điều hướng nhanh", items: sectionResults });
              groups.push({ label: "Dịch vụ", items: serviceResults });
            } else if (activeTab === "all" && query.trim()) {
              if (postResults.length) groups.push({ label: "Bài viết Blog", items: postResults });
              if (serviceResults.length) groups.push({ label: "Dịch vụ", items: serviceResults });
              if (sectionResults.length) groups.push({ label: "Điều hướng", items: sectionResults });
            } else {
              groups.push({ label: "", items: allResults });
            }

            let globalIdx = 0;
            return groups.map((group) => (
              <div key={group.label} className="mb-1">
                {group.label && (
                  <div className="px-5 py-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{group.label}</span>
                  </div>
                )}
                {group.items.map((r) => {
                  const idx = globalIdx++;
                  const isActive = idx === activeIdx;
                  return (
                    <button key={r.id} onClick={() => navigate(r)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className={`flex items-start gap-3.5 w-full px-5 py-3 transition-colors text-left ${
                        isActive ? "bg-blue-50 border-l-2 border-blue-500" : "hover:bg-slate-50 border-l-2 border-transparent"
                      }`}>
                      <span className="text-xl flex-shrink-0 mt-0.5">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold truncate ${isActive ? "text-blue-700" : "text-slate-800"}`}>
                            {highlight(r.label, query)}
                          </span>
                          {r.tag && (
                            <span className="flex-shrink-0 px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded">
                              {r.tag}
                            </span>
                          )}
                        </div>
                        {r.desc && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {highlight(r.desc.slice(0, 80), query)}
                          </p>
                        )}
                      </div>
                      <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-opacity ${isActive ? "opacity-100 text-blue-500" : "opacity-0"}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            ));
          })()}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-5 py-3 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-sm">↑↓</kbd>
            <span>Di chuyển</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-sm">↵</kbd>
            <span>Chọn</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-sm">ESC</kbd>
            <span>Đóng</span>
          </div>
          <div className="ml-auto text-xs text-slate-400">
            Nhấn <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-sm">⌘K</kbd> để mở
          </div>
        </div>
      </div>
    </div>
  );
}
