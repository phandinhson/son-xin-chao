"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Data ─── */
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

const TOOLS: Tool[] = [
  /* ── Hình ảnh ── */
  {
    name: "Midjourney",
    desc: "Tạo hình ảnh nghệ thuật chất lượng cao từ mô tả văn bản. Được dùng nhiều nhất bởi designers chuyên nghiệp.",
    category: "Hình ảnh",
    badge: "Trả phí",
    url: "https://www.midjourney.com",
    icon: "🎨",
    hot: true,
    tags: ["Text-to-image", "Nghệ thuật", "Marketing"],
  },
  {
    name: "DALL-E 3",
    desc: "AI tạo ảnh của OpenAI, tích hợp trực tiếp trong ChatGPT. Hiểu prompt tiếng Việt rất tốt.",
    category: "Hình ảnh",
    badge: "Freemium",
    url: "https://openai.com/dall-e-3",
    icon: "🖼️",
    tags: ["Text-to-image", "ChatGPT", "Dễ dùng"],
  },
  {
    name: "Adobe Firefly",
    desc: "AI tạo ảnh và chỉnh sửa ảnh của Adobe. Tích hợp sẵn trong Photoshop & Illustrator.",
    category: "Hình ảnh",
    badge: "Freemium",
    url: "https://firefly.adobe.com",
    icon: "🔥",
    tags: ["Adobe", "Photoshop", "Thiết kế"],
  },
  {
    name: "Leonardo.ai",
    desc: "Nền tảng tạo ảnh AI mạnh mẽ với nhiều model khác nhau. Phù hợp làm ảnh sản phẩm, game art.",
    category: "Hình ảnh",
    badge: "Freemium",
    url: "https://leonardo.ai",
    icon: "🦁",
    hot: true,
    tags: ["Sản phẩm", "Game art", "Nhiều model"],
  },
  {
    name: "Canva AI",
    desc: "Tạo hình ảnh, thiết kế banner, poster bằng AI ngay trong Canva. Không cần kỹ năng thiết kế.",
    category: "Hình ảnh",
    badge: "Freemium",
    url: "https://www.canva.com/ai-image-generator",
    icon: "✏️",
    tags: ["Thiết kế", "Social media", "Banner"],
  },
  {
    name: "Remove.bg",
    desc: "Xóa nền ảnh tự động bằng AI chỉ trong 1 giây. Chuẩn cho ảnh sản phẩm thương mại điện tử.",
    category: "Hình ảnh",
    badge: "Freemium",
    url: "https://www.remove.bg",
    icon: "✂️",
    tags: ["Xóa nền", "Sản phẩm", "E-commerce"],
  },

  /* ── Video ── */
  {
    name: "Runway ML",
    desc: "Tạo và chỉnh sửa video bằng AI. Hỗ trợ text-to-video, xóa đối tượng, thay nền video.",
    category: "Video",
    badge: "Freemium",
    url: "https://runwayml.com",
    icon: "🎬",
    hot: true,
    tags: ["Text-to-video", "Chỉnh sửa", "Xóa đối tượng"],
  },
  {
    name: "HeyGen",
    desc: "Tạo video với avatar AI biết nói. Chỉ cần nhập text là có video presenter chuyên nghiệp.",
    category: "Video",
    badge: "Freemium",
    url: "https://www.heygen.com",
    icon: "🧑‍💼",
    hot: true,
    tags: ["Avatar AI", "Presenter", "Marketing"],
  },
  {
    name: "Pika Labs",
    desc: "Biến ảnh hoặc text thành video ngắn chuyển động mượt mà. Miễn phí và dễ dùng.",
    category: "Video",
    badge: "Freemium",
    url: "https://pika.art",
    icon: "⚡",
    tags: ["Image-to-video", "Ngắn", "Social"],
  },
  {
    name: "CapCut AI",
    desc: "App chỉnh sửa video với hàng chục tính năng AI: xóa nền, tạo phụ đề, chuyển đổi giọng nói.",
    category: "Video",
    badge: "Miễn phí",
    url: "https://www.capcut.com",
    icon: "🎞️",
    tags: ["Chỉnh sửa", "Phụ đề", "TikTok"],
  },
  {
    name: "Luma AI",
    desc: "Tạo video 3D, hiệu ứng cinematic chất lượng cao từ prompt. Video dài đến 5 giây.",
    category: "Video",
    badge: "Freemium",
    url: "https://lumalabs.ai",
    icon: "🌌",
    tags: ["3D", "Cinematic", "High quality"],
  },
  {
    name: "InVideo AI",
    desc: "Tạo video quảng cáo, Reels, YouTube Shorts từ kịch bản văn bản. Có sẵn stock footage.",
    category: "Video",
    badge: "Freemium",
    url: "https://invideo.io",
    icon: "📱",
    tags: ["Quảng cáo", "Reels", "Stock footage"],
  },

  /* ── Âm thanh ── */
  {
    name: "ElevenLabs",
    desc: "Text-to-speech và nhân bản giọng nói chất lượng cao nhất hiện nay. Hỗ trợ tiếng Việt.",
    category: "Âm thanh",
    badge: "Freemium",
    url: "https://elevenlabs.io",
    icon: "🎙️",
    hot: true,
    tags: ["Text-to-speech", "Giọng Việt", "Nhân bản giọng"],
  },
  {
    name: "Suno AI",
    desc: "Tạo nhạc hoàn chỉnh (có lời, hòa âm) từ mô tả văn bản. Cho ra bài nhạc trong vài giây.",
    category: "Âm thanh",
    badge: "Freemium",
    url: "https://suno.ai",
    icon: "🎵",
    hot: true,
    tags: ["Tạo nhạc", "Có lời", "Sáng tác"],
  },
  {
    name: "Adobe Podcast",
    desc: "Nâng cấp chất lượng âm thanh podcast/video tự động. Lọc tiếng ồn, cân bằng âm lượng.",
    category: "Âm thanh",
    badge: "Miễn phí",
    url: "https://podcast.adobe.com",
    icon: "🎚️",
    tags: ["Podcast", "Lọc tiếng ồn", "Adobe"],
  },
  {
    name: "Udio",
    desc: "Tạo nhạc AI chất lượng studio với nhiều thể loại: pop, EDM, nhạc phim, nhạc nền.",
    category: "Âm thanh",
    badge: "Freemium",
    url: "https://www.udio.com",
    icon: "🎼",
    tags: ["Nhạc nền", "Studio", "Nhiều thể loại"],
  },
  {
    name: "Murf AI",
    desc: "Tạo giọng đọc chuyên nghiệp cho video, slide, e-learning. Có 120+ giọng đọc các ngôn ngữ.",
    category: "Âm thanh",
    badge: "Freemium",
    url: "https://murf.ai",
    icon: "🗣️",
    tags: ["Giọng đọc", "E-learning", "Thuyết trình"],
  },

  /* ── Văn phòng ── */
  {
    name: "ChatGPT",
    desc: "Trợ lý AI đa năng nhất hiện nay. Viết nội dung, phân tích dữ liệu, lập trình, dịch thuật.",
    category: "Văn phòng",
    badge: "Freemium",
    url: "https://chat.openai.com",
    icon: "🤖",
    hot: true,
    tags: ["Viết nội dung", "Phân tích", "Đa năng"],
  },
  {
    name: "Claude",
    desc: "AI của Anthropic, xuất sắc trong phân tích tài liệu dài, viết văn chuyên sâu và lập trình.",
    category: "Văn phòng",
    badge: "Freemium",
    url: "https://claude.ai",
    icon: "💡",
    tags: ["Phân tích", "Viết chuyên sâu", "An toàn"],
  },
  {
    name: "Notion AI",
    desc: "AI tích hợp trong Notion giúp viết tài liệu, tóm tắt, dịch thuật và quản lý dự án.",
    category: "Văn phòng",
    badge: "Freemium",
    url: "https://www.notion.so/product/ai",
    icon: "📝",
    tags: ["Quản lý dự án", "Tài liệu", "Tóm tắt"],
  },
  {
    name: "Gamma AI",
    desc: "Tạo slide thuyết trình, tài liệu, trang web đẹp từ prompt chỉ trong 30 giây.",
    category: "Văn phòng",
    badge: "Freemium",
    url: "https://gamma.app",
    icon: "📊",
    hot: true,
    tags: ["Slide", "Thuyết trình", "Thiết kế nhanh"],
  },
  {
    name: "Microsoft Copilot",
    desc: "AI tích hợp trong Word, Excel, PowerPoint, Teams. Tự động viết báo cáo, phân tích dữ liệu.",
    category: "Văn phòng",
    badge: "Trả phí",
    url: "https://copilot.microsoft.com",
    icon: "🪟",
    tags: ["Word", "Excel", "PowerPoint"],
  },
  {
    name: "Gemini",
    desc: "AI của Google tích hợp với Google Docs, Sheets, Gmail. Tóm tắt email, viết báo cáo.",
    category: "Văn phòng",
    badge: "Freemium",
    url: "https://gemini.google.com",
    icon: "✨",
    tags: ["Google Docs", "Gmail", "Google Workspace"],
  },
];

const CATEGORIES: Category[] = ["Tất cả", "Hình ảnh", "Video", "Âm thanh", "Văn phòng"];

const CATEGORY_META: Record<Exclude<Category, "Tất cả">, { color: string; bg: string; border: string; desc: string }> = {
  "Hình ảnh": { color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200", desc: "Tạo & chỉnh sửa ảnh bằng AI" },
  "Video":    { color: "text-rose-700",   bg: "bg-rose-50",   border: "border-rose-200",   desc: "Tạo & dựng video tự động" },
  "Âm thanh": { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", desc: "Nhạc, giọng nói, podcast AI" },
  "Văn phòng":{ color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   desc: "Tăng năng suất làm việc" },
};

const BADGE_STYLE: Record<Tool["badge"], string> = {
  "Miễn phí": "bg-emerald-100 text-emerald-700",
  "Freemium": "bg-amber-100 text-amber-700",
  "Trả phí":  "bg-slate-100 text-slate-600",
};

const CAT_ICONS: Record<Exclude<Category, "Tất cả">, string> = {
  "Hình ảnh": "🖼️",
  "Video": "🎬",
  "Âm thanh": "🎵",
  "Văn phòng": "💼",
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
  "Hình ảnh": "border-t-violet-500",
  "Video":    "border-t-rose-500",
  "Âm thanh": "border-t-emerald-500",
  "Văn phòng":"border-t-blue-500",
};

// DB shape (snake_case) mapped to page shape
type DbTool = {
  id: string;
  name: string;
  description: string;
  category: Exclude<Category, "Tất cả">;
  badge: Tool["badge"];
  url: string;
  icon: string;
  is_hot: boolean;
  tags: string[];
  sort_order: number;
  active: boolean;
};

function dbToTool(d: DbTool): Tool {
  return {
    name: d.name,
    desc: d.description,
    category: d.category,
    badge: d.badge,
    url: d.url,
    icon: d.icon,
    hot: d.is_hot,
    tags: d.tags ?? [],
  };
}

// Fallback hardcoded data (shown while loading or if DB empty)
const FALLBACK_TOOLS: Tool[] = TOOLS;

/* ─── Tool Detail Modal ─── */
function ToolDetailModal({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const lightStyle = CAT_LIGHT[tool.category];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient */}
        <div className={`bg-gradient-to-br ${CAT_GRADIENT[tool.category]} p-6 text-center`}>
          <div className="text-6xl mb-3">{tool.icon}</div>
          <h2 className="text-2xl font-extrabold text-white">{tool.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-semibold">{tool.category}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold bg-white ${
              tool.badge === "Miễn phí" ? "text-emerald-700" : tool.badge === "Freemium" ? "text-amber-700" : "text-slate-600"
            }`}>{tool.badge}</span>
            {tool.hot && <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-black tracking-widest">🔥 HOT</span>}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-5">{tool.desc}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tool.tags.map((tag) => (
              <span key={tag} className={`text-xs font-semibold px-3 py-1 rounded-full border ${lightStyle}`}>{tag}</span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r ${CAT_GRADIENT[tool.category]} text-white font-bold text-sm transition-opacity hover:opacity-90`}
            >
              Dùng ngay
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-400 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function CongCuAiPage() {
  const [active, setActive] = useState<Category>("Tất cả");
  const [search, setSearch] = useState("");
  const [allTools, setAllTools] = useState<Tool[]>(FALLBACK_TOOLS);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestion dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    fetch("/api/ai-tools", { cache: "no-store" })
      .then(r => r.json())
      .then((data: DbTool[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllTools(data.map(dbToTool));
        }
        // nếu data rỗng → giữ fallback hardcoded
      })
      .catch(() => {
        // fetch lỗi → giữ fallback hardcoded
      });
  }, []);

  const suggestions = search.trim().length >= 1
    ? allTools
        .filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.tags.some((tg) => tg.toLowerCase().includes(search.toLowerCase()))
        )
        .slice(0, 6)
    : [];

  const filtered = allTools.filter((t) => {
    const matchCat = active === "Tất cả" || t.category === active;
    const q = search.toLowerCase();
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.tags.some((tg) => tg.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  const hotTools = allTools.filter((t) => t.hot).slice(0, 4);

  return (
    <>
    {/* Tool Detail Modal */}
    {selectedTool && <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />}

    <Navbar />
    <main className="min-h-screen bg-gray-50">

      {/* ── Hero sáng ── */}
      <section className="relative bg-white pt-24 pb-16 px-6 border-b border-gray-100">
        {/* Blobs (clipped so they don't overflow) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
          <div className="absolute -top-20 right-0 w-80 h-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #2563eb, transparent)" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-30" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 text-sm text-violet-700 font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            Cập nhật liên tục · {allTools.length} công cụ AI
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
            Công cụ{" "}
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">AI</span>
            {" "}tốt nhất<br />
            <span className="text-gray-500 font-bold text-3xl md:text-5xl">cho công việc của bạn</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Tổng hợp các công cụ AI hot nhất — tạo hình ảnh, dựng video, sản xuất âm thanh và tăng năng suất văn phòng.
          </p>

          {/* Search box */}
          <div ref={searchRef} className="relative max-w-lg mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm tên công cụ, tính năng..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-all text-sm shadow-sm"
            />
            {search && (
              <button onClick={() => { setSearch(""); setShowSuggestions(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-30 overflow-hidden">
                <div className="px-3 py-2 text-[11px] text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100">
                  Gợi ý ({suggestions.length})
                </div>
                {suggestions.map((t) => (
                  <button
                    key={t.name}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelectedTool(t);
                      setSearch("");
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-violet-50 transition-colors text-left group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm group-hover:text-violet-700 transition-colors">{t.name}</div>
                      <div className="text-xs text-gray-400 truncate">{t.desc}</div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${CAT_LIGHT[t.category]}`}>
                      {t.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Category cards ── */}
      {!search && active === "Tất cả" && (
        <section className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(["Hình ảnh", "Video", "Âm thanh", "Văn phòng"] as const).map((cat) => {
              const count = allTools.filter((t) => t.category === cat).length;
              return (
                <button key={cat} onClick={() => setActive(cat)}
                  className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${CAT_GRADIENT[cat]} opacity-90`} />
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4), transparent 60%)" }} />
                  <div className="relative z-10">
                    <div className="text-3xl mb-2">{CAT_ICONS[cat]}</div>
                    <div className="text-white font-extrabold text-lg">{cat}</div>
                    <div className="text-white/80 text-xs mt-0.5">{count} công cụ</div>
                    <div className="mt-3 text-white/90 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                      Xem tất cả →
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Hot tools ── */}
      {!search && active === "Tất cả" && (
        <section className="max-w-6xl mx-auto px-6 pb-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl">🔥</span>
            <h2 className="text-lg font-extrabold text-gray-800">Đang được dùng nhiều nhất</h2>
            <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2.5 py-0.5 rounded-full">HOT</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hotTools.map((t) => (
              <button key={t.name} onClick={() => setSelectedTool(t)}
                className="group flex flex-col items-center text-center bg-white rounded-2xl border-2 border-gray-100 p-5 hover:border-violet-300 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                <div className="text-4xl mb-2">{t.icon}</div>
                <div className="font-bold text-gray-800 text-sm mb-1">{t.name}</div>
                <div className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${CAT_LIGHT[t.category]}`}>
                  {t.category}
                </div>
                <div className={`text-[11px] mt-1.5 px-2 py-0.5 rounded-full font-medium ${BADGE_STYLE[t.badge]}`}>
                  {t.badge}
                </div>
                <div className="mt-3 text-xs font-semibold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Xem chi tiết →
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Filter + Grid ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">

        {/* Sticky filter bar */}
        <div className="sticky top-16 z-20 bg-gray-50/95 backdrop-blur-sm py-3 mb-6 -mx-6 px-6 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const isActive = active === cat;
              const icon = cat !== "Tất cả" ? CAT_ICONS[cat] : "✦";
              return (
                <button key={cat} onClick={() => setActive(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-800"
                  }`}>
                  <span className="text-base leading-none">{icon}</span>
                  {cat}
                  <span className={`text-xs font-normal ${isActive ? "text-gray-400" : "text-gray-400"}`}>
                    ({cat === "Tất cả" ? allTools.length : allTools.filter((t) => t.category === cat).length})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result info */}
        {search && (
          <p className="text-sm text-gray-500 mb-5">
            Tìm thấy <span className="font-bold text-gray-800">{filtered.length}</span> công cụ cho <span className="text-violet-600">&quot;{search}&quot;</span>
          </p>
        )}

        {/* Empty */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-semibold text-gray-600">Không tìm thấy công cụ nào</p>
            <p className="text-sm text-gray-400 mt-1">Thử từ khóa khác hoặc chọn danh mục khác</p>
            <button onClick={() => { setSearch(""); setActive("Tất cả"); }}
              className="mt-4 px-5 py-2 bg-violet-600 text-white text-sm font-semibold rounded-full hover:bg-violet-700 transition-colors">
              Xem tất cả
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((tool) => {
              const topBorder = CAT_BTN_TOP[tool.category];
              const lightStyle = CAT_LIGHT[tool.category];
              return (
                <div key={tool.name}
                  onClick={() => setSelectedTool(tool)}
                  className={`group relative flex flex-col bg-white rounded-2xl border-t-4 border border-gray-100 ${topBorder} overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer`}>

                  {/* HOT ribbon */}
                  {tool.hot && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl tracking-widest">
                        HOT
                      </div>
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="font-extrabold text-gray-900 text-base leading-tight">{tool.name}</div>
                        <span className={`inline-block text-[11px] font-semibold mt-1 px-2 py-0.5 rounded-full border ${lightStyle}`}>
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    {/* Desc */}
                    <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">{tool.desc}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tool.tags.map((tag) => (
                        <span key={tag} className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>

                    {/* Footer: badge + CTA */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLE[tool.badge]}`}>
                        {tool.badge}
                      </span>
                      <div className="flex-1" />
                      <a href={tool.url} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 hover:bg-violet-600 text-white text-xs font-bold rounded-full transition-colors">
                        Dùng ngay
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-gray-900 py-20 px-6">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #7c3aed, transparent 60%), radial-gradient(circle at 70% 30%, #2563eb, transparent 60%)" }} />
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-block text-5xl mb-5">🚀</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Cần tư vấn ứng dụng<br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">AI vào marketing?</span>
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Tôi giúp bạn chọn đúng công cụ AI phù hợp với ngân sách và mục tiêu — tiết kiệm thời gian, tăng chất lượng nội dung.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/#contact"
              className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-colors">
              Tư vấn miễn phí →
            </a>
            <a href="/blog"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-colors">
              Đọc thêm kiến thức
            </a>
          </div>
        </div>
      </section>

    </main>
    <Footer />
    </>
  );
}
