"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import useSWR from "swr"; // ⚡ TỐI ƯU 1: Giải pháp quản lý cache mạng, chặn spam request
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Cấu hình Types & Mạng tĩnh (Đưa ra ngoài Component để giảm dung lượng bundle) ─── */
type Category = "Tất cả" | "Hình ảnh" | "Video" | "Âm thanh" | "Văn phòng";

type Tool = {
  name: string;
  desc: string;
  category: Exclude<Category, "Tất cả">;
  badge: "Miễn phí" | "Freemium" | "Trả phí";
  url: string;
  icon: string;
  hot?: boolean;
  tags: string[];
};

const CATEGORIES: Category[] = ["Tất cả", "Hình ảnh", "Video", "Âm thanh", "Văn phòng"];

const BADGE_STYLE: Record<Tool["badge"], string> = {
  "Miễn phí": "bg-emerald-100 text-emerald-700",
  "Freemium": "bg-amber-100 text-amber-700",
  "Trả phí":  "bg-slate-100 text-slate-600",
};

const CAT_ICONS: Record<Exclude<Category, "Tất cả">, string> = {
  "Hình ảnh": "🖼️", "Video": "🎬", "Âm thanh": "🎵", "Văn phòng": "💼",
};

const CAT_GRADIENT: Record<Exclude<Category, "Tất cả">, string> = {
  "Hình ảnh": "from-violet-500 to-purple-600",
  "Video":    "from-rose-500 to-pink-600",
  "Âm thanh": "from-emerald-500 to-teal-600",
  "Văn phòng":"from-blue-500 to-indigo-600",
};

const CAT_LIGHT: Record<Exclude<Category, "Tất cả">, string> = {
  "Hình ảnh": "bg-violet-50 text-violet-700 border-violet-200",
  "Video":    "bg-rose-50 text-rose-700 border-rose-200",
  "Âm thanh": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Văn phòng":"bg-blue-50 text-blue-700 border-blue-200",
};

const CAT_BTN_TOP: Record<Exclude<Category, "Tất cả">, string> = {
  "Hình ảnh": "border-t-violet-500", "Video": "border-t-rose-500", "Âm thanh": "border-t-emerald-500", "Văn phòng":"border-t-blue-500",
};

type DbTool = {
  id: string; name: string; description: string; category: Exclude<Category, "Tất cả">;
  badge: Tool["badge"]; url: string; icon: string; is_hot: boolean; tags: string[]; sort_order: number; active: boolean;
};

// Hàm chuẩn hóa dữ liệu từ DB
function dbToTool(d: DbTool): Tool {
  return {
    name: d.name, desc: d.description, category: d.category,
    badge: d.badge, url: d.url, icon: d.icon, hot: d.is_hot, tags: d.tags ?? [],
  };
}

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error();
  return r.json();
});

/* ─── Tool Detail Modal (Bọc trong Memo để tránh re-render thừa) ─── */
const ToolDetailModal = ({ tool, onClose }: { tool: Tool; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className={`bg-gradient-to-br ${CAT_GRADIENT[tool.category]} p-6 text-center`}>
          <div className="text-6xl mb-3">{tool.icon}</div>
          <h2 className="text-2xl font-extrabold text-white">{tool.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-semibold">{tool.category}</span>
            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-white text-slate-700">{tool.badge}</span>
            {tool.hot && <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-black tracking-widest animate-pulse">🔥 HOT</span>}
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-5">{tool.desc}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {tool.tags.map((tag) => (
              <span key={tag} className={`text-xs font-semibold px-3 py-1 rounded-full border ${CAT_LIGHT[tool.category]}`}>{tag}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r ${CAT_GRADIENT[tool.category]} text-white font-bold text-sm transition-opacity hover:opacity-90`}>
              Dùng ngay
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <button onClick={onClose} className="px-5 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-400 transition-colors">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page Component ─── */
export default function CongCuAiPage() {
  const [active, setActive] = useState<Category>("Tất cả");
  const [search, setSearch] = useState("");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // ⚡ TỐI ƯU 2: Thay thế useEffect cũ bằng useSWR giúp tự động cache dữ liệu
  const { data: dbData } = useSWR("/api/ai-tools", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // Giữ dữ liệu sạch trong 30 giây mà không cần gọi lại API
  });

  // Chuyển đổi dữ liệu an toàn qua useMemo
  const allTools = useMemo(() => {
    if (Array.isArray(dbData) && dbData.length > 0) {
      return dbData.map(dbToTool);
    }
    return [];
  }, [dbData]);

  // Click ra ngoài ô tìm kiếm để đóng dropdown gợi ý
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ⚡ TỐI ƯU 3: Đưa toàn bộ tính năng lọc danh sách & từ khóa vào useMemo tránh nghẽn UI Thread
  const { filtered, suggestions, hotTools } = useMemo(() => {
    const q = search.trim().toLowerCase();
    
    // 1. Lọc danh sách chính
    const filteredList = allTools.filter((t) => {
      const matchCat = active === "Tất cả" || t.category === active;
      const matchQ = !q || 
        t.name.toLowerCase().includes(q) || 
        t.desc.toLowerCase().includes(q) || 
        t.tags.some((tg) => tg.toLowerCase().includes(q));
      return matchCat && matchQ;
    });

    // 2. Lấy danh sách gợi ý tìm kiếm nhanh
    const suggestionList = q.length >= 1 
      ? allTools.filter((t) => t.name.toLowerCase().includes(q) || t.tags.some((tg) => tg.toLowerCase().includes(q))).slice(0, 6)
      : [];

    // 3. Lấy danh sách Hot Tools
    const hotList = allTools.filter((t) => t.hot).slice(0, 4);

    return { filtered: filteredList, suggestions: suggestionList, hotTools: hotList };
  }, [allTools, active, search]);

  const handleSuggestionClick = useCallback((tool: Tool) => {
    setSelectedTool(tool);
    setSearch("");
    setShowSuggestions(false);
  }, []);

  return (
    <>
      {selectedTool && <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />}

      <Navbar />
      <main className="min-h-screen bg-gray-50">

        {/* Hero Section */}
        <section className="relative bg-white pt-24 pb-16 px-6 border-b border-gray-100">
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 text-sm text-violet-700 font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              Hệ thống lưu trữ · {allTools.length} công cụ AI chuyên nghiệp
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
              Công cụ{" "}
              <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">AI</span> tốt nhất<br />
              <span className="text-gray-500 font-bold text-3xl md:text-5xl">cho công việc của bạn</span>
            </h1>
            
            {/* Search Box */}
            <div ref={searchRef} className="relative max-w-lg mx-auto mt-6">
              <input
                type="text"
                placeholder="Tìm tên công cụ, tính năng..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-12 pr-10 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-all text-sm shadow-sm"
              />
              {search && (
                <button onClick={() => { setSearch(""); setShowSuggestions(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-30 overflow-hidden">
                  {suggestions.map((t) => (
                    <button key={t.name} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSuggestionClick(t)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-violet-50 transition-colors text-left group">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl flex-shrink-0">{t.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm group-hover:text-violet-700 transition-colors">{t.name}</div>
                        <div className="text-xs text-gray-400 truncate">{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Category Matrix */}
        {!search && active === "Tất cả" && (
          <section className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(["Hình ảnh", "Video", "Âm thanh", "Văn phòng"] as const).map((cat) => (
                <button key={cat} onClick={() => setActive(cat)} className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${CAT_GRADIENT[cat]} opacity-90`} />
                  <div className="relative z-10 text-white">
                    <div className="text-3xl mb-2">{CAT_ICONS[cat]}</div>
                    <div className="font-extrabold text-lg">{cat}</div>
                    <div className="mt-3 text-xs font-semibold">Xem tất cả →</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Hot Tools Section */}
        {!search && active === "Tất cả" && hotTools.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 pb-8">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-extrabold text-gray-800">🔥 Đang được dùng nhiều nhất</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotTools.map((t) => (
                <div key={t.name} onClick={() => setSelectedTool(t)} className="group flex flex-col items-center text-center bg-white rounded-2xl border-2 border-gray-100 p-5 hover:border-violet-300 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                  <div className="text-4xl mb-2">{t.icon}</div>
                  <div className="font-bold text-gray-800 text-sm mb-1">{t.name}</div>
                  <div className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${CAT_LIGHT[t.category]}`}>{t.category}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filter Navigation Bar */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="sticky top-16 z-20 bg-gray-50/95 backdrop-blur-sm py-3 mb-6 border-b border-gray-100 flex gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const isActive = active === cat;
              return (
                <button key={cat} onClick={() => setActive(cat)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive ? "bg-gray-900 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200"}`}>
                  {cat} ({cat === "Tất cả" ? allTools.length : allTools.filter(t => t.category === cat).length})
                </button>
              );
            })}
          </div>

          {/* Grid View */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-500">Không tìm thấy công cụ phù hợp.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((tool) => (
                <div key={tool.name} onClick={() => setSelectedTool(tool)} className={`group relative flex flex-col bg-white rounded-2xl border-t-4 border border-gray-100 ${CAT_BTN_TOP[tool.category]} overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer`}>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">{tool.icon}</div>
                      <div>
                        <div className="font-extrabold text-gray-900 text-base">{tool.name}</div>
                        <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${CAT_LIGHT[tool.category]}`}>{tool.category}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4">{tool.desc}</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLE[tool.badge]}`}>{tool.badge}</span>
                      <div className="flex-1" />
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="px-4 py-1.5 bg-gray-900 hover:bg-violet-600 text-white text-xs font-bold rounded-full transition-colors">Dùng ngay</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gray-900 py-20 px-6 text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Cần tư vấn ứng dụng AI vào marketing?</h2>
          <Link href="/contact" className="inline-block px-8 py-3.5 bg-violet-600 hover:bg-violet-500 font-bold rounded-2xl transition-colors">Tư vấn miễn phí →</Link>
        </section>

      </main>
      <Footer />
    </>
  );
}