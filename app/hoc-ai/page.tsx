"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ──────────────────────────────────────────
   DATA
────────────────────────────────────────── */
type Category = "Tất cả" | "Học tập" | "Thiết kế & Ảnh" | "Video & Film" | "Âm thanh" | "Văn phòng" | "Lập trình" | "Marketing";

type Tool = {
  name: string;
  desc: string;
  category: Exclude<Category, "Tất cả">;
  badge: "Miễn phí" | "Freemium" | "Trả phí";
  url: string;
  icon: string;
  color: string;
  hot?: boolean;
  new?: boolean;
  tags: string[];
};

type Video = {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumb: string;
  youtubeId: string;
};

const VIDEOS: Video[] = [
  {
    id: "v1",
    title: "ChatGPT Full Tutorial — Dùng AI như Pro từ A đến Z",
    channel: "Sơn Xin Chào",
    duration: "18:42",
    views: "12K",
    thumb: "https://img.youtube.com/vi/JTxsNm9IdYU/maxresdefault.jpg",
    youtubeId: "JTxsNm9IdYU",
  },
  {
    id: "v2",
    title: "Midjourney V6 — Tạo ảnh AI đẹp không tưởng chỉ trong 5 phút",
    channel: "Sơn Xin Chào",
    duration: "12:05",
    views: "8.4K",
    thumb: "https://img.youtube.com/vi/PLACEHOLDER2/maxresdefault.jpg",
    youtubeId: "rnIgnS7EKZE",
  },
  {
    id: "v3",
    title: "Suno AI — Tạo bài hát hoàn chỉnh từ 1 câu mô tả",
    channel: "Sơn Xin Chào",
    duration: "9:30",
    views: "6.1K",
    thumb: "https://img.youtube.com/vi/PLACEHOLDER3/maxresdefault.jpg",
    youtubeId: "kgLklMwdPo4",
  },
  {
    id: "v4",
    title: "Gamma AI — Tạo slide thuyết trình đẹp chỉ bằng 1 câu",
    channel: "Sơn Xin Chào",
    duration: "7:15",
    views: "5.2K",
    thumb: "https://img.youtube.com/vi/PLACEHOLDER4/maxresdefault.jpg",
    youtubeId: "9L6v25IKGp8",
  },
  {
    id: "v5",
    title: "Runway Gen-3 — AI tạo video điện ảnh chuyên nghiệp",
    channel: "Sơn Xin Chào",
    duration: "14:20",
    views: "4.8K",
    thumb: "https://img.youtube.com/vi/PLACEHOLDER5/maxresdefault.jpg",
    youtubeId: "GJfSTy0FZNE",
  },
  {
    id: "v6",
    title: "Perplexity AI — Công cụ nghiên cứu thay thế Google Search",
    channel: "Sơn Xin Chào",
    duration: "11:08",
    views: "3.9K",
    thumb: "https://img.youtube.com/vi/PLACEHOLDER6/maxresdefault.jpg",
    youtubeId: "H73nvMIKPR8",
  },
];

const TOOLS: Tool[] = [
  /* ── Học tập ── */
  { name: "ChatGPT", desc: "Trợ lý AI đa năng nhất thế giới — giải bài tập, viết luận, giải thích khái niệm, lập kế hoạch học tập theo nhu cầu.", category: "Học tập", badge: "Freemium", url: "https://chatgpt.com", icon: "🤖", color: "#10a37f", hot: true, tags: ["Trợ lý", "Giáo dục", "Viết"] },
  { name: "Perplexity AI", desc: "Công cụ nghiên cứu thông minh, trả lời có trích dẫn nguồn rõ ràng. Thay thế Google cho học thuật và nghiên cứu.", category: "Học tập", badge: "Freemium", url: "https://perplexity.ai", icon: "🔬", color: "#1fb8cd", hot: true, tags: ["Nghiên cứu", "Search", "Tóm tắt"] },
  { name: "NotebookLM", desc: "AI của Google phân tích tài liệu cá nhân — upload PDF, note, website rồi hỏi đáp, tạo podcast tóm tắt.", category: "Học tập", badge: "Miễn phí", url: "https://notebooklm.google.com", icon: "📓", color: "#4285f4", new: true, tags: ["Ghi chú", "PDF", "Podcast AI"] },
  { name: "Gamma AI", desc: "Tạo slide thuyết trình, website, tài liệu đẹp chuyên nghiệp từ một dòng mô tả — không cần thiết kế.", category: "Học tập", badge: "Freemium", url: "https://gamma.app", icon: "🎯", color: "#7c3aed", hot: true, tags: ["Slide", "Thuyết trình", "Website"] },
  { name: "Claude", desc: "AI của Anthropic — phân tích sâu, lý luận logic, viết sáng tạo và an toàn. Rất tốt cho học thuật.", category: "Học tập", badge: "Freemium", url: "https://claude.ai", icon: "⚡", color: "#d97706", tags: ["Phân tích", "Viết", "Lý luận"] },
  { name: "Khan Academy Khanmigo", desc: "Gia sư AI miễn phí cho học sinh — giải thích từng bước, không đưa đáp án thẳng mà dẫn dắt tư duy.", category: "Học tập", badge: "Miễn phí", url: "https://www.khanacademy.org/khan-labs", icon: "🎓", color: "#14532d", tags: ["Gia sư", "Toán", "Khoa học"] },

  /* ── Thiết kế & Ảnh ── */
  { name: "Midjourney", desc: "Tạo ảnh nghệ thuật chất lượng cao nhất hiện nay. Được dùng bởi designers, illustrators, ad agencies toàn cầu.", category: "Thiết kế & Ảnh", badge: "Trả phí", url: "https://midjourney.com", icon: "🎨", color: "#e11d48", hot: true, tags: ["Text-to-image", "Nghệ thuật", "Concept"] },
  { name: "Adobe Firefly", desc: "AI tích hợp trong Photoshop & Illustrator — xóa vật thể, mở rộng ảnh, thay nền, tạo vector chỉ 1 click.", category: "Thiết kế & Ảnh", badge: "Freemium", url: "https://firefly.adobe.com", icon: "🔥", color: "#ff4500", hot: true, tags: ["Photoshop", "Illustrator", "Edit"] },
  { name: "Canva AI", desc: "Thiết kế đồ họa với Magic Studio — tạo ảnh, xóa nền, viết caption, resize tự động cho mọi nền tảng.", category: "Thiết kế & Ảnh", badge: "Freemium", url: "https://canva.com", icon: "✏️", color: "#00c4cc", tags: ["Social media", "Poster", "Infographic"] },
  { name: "Ideogram", desc: "AI tạo ảnh cực tốt về chữ trong ảnh — logo, poster, thumbnail YouTube với text rõ nét.", category: "Thiết kế & Ảnh", badge: "Freemium", url: "https://ideogram.ai", icon: "🖼️", color: "#6366f1", new: true, tags: ["Logo", "Text trong ảnh", "Poster"] },
  { name: "Leonardo AI", desc: "Tạo ảnh game, character, concept art với kiểm soát chi tiết cao. Có nhiều model chuyên biệt.", category: "Thiết kế & Ảnh", badge: "Freemium", url: "https://leonardo.ai", icon: "🦁", color: "#f59e0b", tags: ["Game art", "Character", "Concept art"] },
  { name: "Remove.bg", desc: "Xóa nền ảnh tự động trong 5 giây — độ chính xác cao kể cả tóc, lông thú phức tạp.", category: "Thiết kế & Ảnh", badge: "Freemium", url: "https://remove.bg", icon: "✂️", color: "#8b5cf6", tags: ["Xóa nền", "Product photo", "Portrait"] },

  /* ── Video & Film ── */
  { name: "Runway Gen-3", desc: "Tạo và chỉnh sửa video bằng AI — text-to-video, image-to-video, xóa vật thể, thay đổi cảnh phim chuyên nghiệp.", category: "Video & Film", badge: "Freemium", url: "https://runwayml.com", icon: "🎬", color: "#ef4444", hot: true, tags: ["Text-to-video", "Film", "VFX"] },
  { name: "HeyGen", desc: "Tạo video thuyết trình với avatar AI nói chuyện. Dịch video sang 40+ ngôn ngữ với môi khớp tự nhiên.", category: "Video & Film", badge: "Freemium", url: "https://heygen.com", icon: "🧑‍💼", color: "#0ea5e9", hot: true, tags: ["Avatar AI", "Dịch video", "Thuyết trình"] },
  { name: "CapCut AI", desc: "Chỉnh sửa video thông minh — tự cắt highlight, xóa nền, thêm caption tự động, template trending.", category: "Video & Film", badge: "Freemium", url: "https://capcut.com", icon: "✂️", color: "#1d4ed8", tags: ["TikTok", "Reels", "Auto caption"] },
  { name: "Pika Labs", desc: "Chuyển ảnh thành video sống động, animate nhân vật, tạo hiệu ứng cinematic từ một tấm hình.", category: "Video & Film", badge: "Freemium", url: "https://pika.art", icon: "⚡", color: "#7c3aed", new: true, tags: ["Image-to-video", "Animate", "Cinematic"] },
  { name: "Kling AI", desc: "Video AI của Trung Quốc — chất lượng cao, chuyển động mượt, tạo video dài đến 2 phút.", category: "Video & Film", badge: "Freemium", url: "https://klingai.com", icon: "🎭", color: "#dc2626", new: true, tags: ["Text-to-video", "Motion", "Long video"] },

  /* ── Âm thanh ── */
  { name: "Suno AI", desc: "Tạo bài nhạc hoàn chỉnh với lời ca, melody, phối khí từ vài từ mô tả. Hỗ trợ mọi thể loại nhạc.", category: "Âm thanh", badge: "Freemium", url: "https://suno.com", icon: "🎵", color: "#ec4899", hot: true, tags: ["Nhạc", "Lyrics", "Sáng tác"] },
  { name: "ElevenLabs", desc: "Clone giọng nói, tạo voiceover với giọng tự nhiên nhất hiện nay. Hỗ trợ tiếng Việt.", category: "Âm thanh", badge: "Freemium", url: "https://elevenlabs.io", icon: "🎙️", color: "#f97316", hot: true, tags: ["Voiceover", "Clone giọng", "Podcast"] },
  { name: "Adobe Podcast", desc: "Lọc tạp âm, nâng chất lượng âm thanh lên chuẩn studio chỉ bằng 1 click — hoàn toàn miễn phí.", category: "Âm thanh", badge: "Miễn phí", url: "https://podcast.adobe.com", icon: "🎚️", color: "#be185d", tags: ["Lọc noise", "Podcast", "Studio"] },
  { name: "Udio", desc: "Tạo nhạc AI với kiểm soát chi tiết hơn — chỉnh từng đoạn, phong cách, nhạc cụ, tempo.", category: "Âm thanh", badge: "Freemium", url: "https://udio.com", icon: "🎼", color: "#7c3aed", new: true, tags: ["Sáng tác nhạc", "Custom", "Thể loại"] },

  /* ── Văn phòng ── */
  { name: "Microsoft Copilot", desc: "AI tích hợp vào Word, Excel, PowerPoint, Outlook — tóm tắt email, tạo báo cáo, phân tích dữ liệu.", category: "Văn phòng", badge: "Trả phí", url: "https://copilot.microsoft.com", icon: "📊", color: "#0078d4", hot: true, tags: ["Word", "Excel", "Outlook"] },
  { name: "Notion AI", desc: "AI trong Notion — viết tài liệu, tóm tắt họp, tạo task list, dịch, phân tích nội dung ngay trong workspace.", category: "Văn phòng", badge: "Freemium", url: "https://notion.so", icon: "📝", color: "#374151", tags: ["Ghi chú", "Task", "Tài liệu"] },
  { name: "Gemini", desc: "AI của Google tích hợp Gmail, Docs, Sheets, Meet — tóm tắt email, draft tài liệu, phân tích bảng tính.", category: "Văn phòng", badge: "Freemium", url: "https://gemini.google.com", icon: "✨", color: "#4285f4", tags: ["Gmail", "Docs", "Google"] },
  { name: "Otter.ai", desc: "Ghi âm và transcribe cuộc họp tự động — tóm tắt highlight, action items, câu hỏi quan trọng.", category: "Văn phòng", badge: "Freemium", url: "https://otter.ai", icon: "🦦", color: "#0ea5e9", tags: ["Họp", "Transcribe", "Tóm tắt"] },

  /* ── Lập trình ── */
  { name: "GitHub Copilot", desc: "AI viết code trực tiếp trong VSCode — gợi ý dòng tiếp theo, viết function, giải thích code, debug.", category: "Lập trình", badge: "Trả phí", url: "https://github.com/features/copilot", icon: "👨‍💻", color: "#24292e", hot: true, tags: ["VSCode", "Code", "Debug"] },
  { name: "Cursor", desc: "IDE AI thế hệ mới — chat với codebase, refactor toàn project, hiểu context toàn bộ dự án.", category: "Lập trình", badge: "Freemium", url: "https://cursor.sh", icon: "🖥️", color: "#6366f1", hot: true, tags: ["IDE", "Refactor", "Chat code"] },
  { name: "v0 by Vercel", desc: "Tạo UI component đẹp bằng mô tả tiếng Anh — xuất ra code React/Tailwind dùng được ngay.", category: "Lập trình", badge: "Freemium", url: "https://v0.dev", icon: "⚛️", color: "#000000", new: true, tags: ["React", "UI", "Tailwind"] },
  { name: "Bolt.new", desc: "Tạo full-stack app hoàn chỉnh từ một câu mô tả — có thể deploy lên internet chỉ trong vài phút.", category: "Lập trình", badge: "Freemium", url: "https://bolt.new", icon: "⚡", color: "#f59e0b", new: true, tags: ["Full-stack", "Deploy", "No-code"] },

  /* ── Marketing ── */
  { name: "Jasper AI", desc: "Viết content marketing, email, quảng cáo, landing page với brand voice nhất quán — tối ưu SEO.", category: "Marketing", badge: "Trả phí", url: "https://jasper.ai", icon: "✍️", color: "#7c3aed", tags: ["Copywriting", "Email", "Ads"] },
  { name: "Copy.ai", desc: "Tạo nội dung marketing hàng loạt — viết 100 biến thể ad copy, email sequence, blog outline chỉ vài phút.", category: "Marketing", badge: "Freemium", url: "https://copy.ai", icon: "📋", color: "#0ea5e9", tags: ["Ad copy", "Email", "Batch"] },
  { name: "Surfer SEO", desc: "Phân tích SEO và gợi ý nội dung để leo top Google — content brief, outline, NLP optimization.", category: "Marketing", badge: "Trả phí", url: "https://surferseo.com", icon: "🏄", color: "#10b981", tags: ["SEO", "Content", "Google"] },
];

const CATEGORIES: { key: Category; icon: string; color: string }[] = [
  { key: "Tất cả",        icon: "🌐", color: "#6366f1" },
  { key: "Học tập",       icon: "🎓", color: "#0ea5e9" },
  { key: "Thiết kế & Ảnh",icon: "🎨", color: "#e11d48" },
  { key: "Video & Film",  icon: "🎬", color: "#ef4444" },
  { key: "Âm thanh",      icon: "🎵", color: "#ec4899" },
  { key: "Văn phòng",     icon: "📊", color: "#0078d4" },
  { key: "Lập trình",     icon: "💻", color: "#24292e" },
  { key: "Marketing",     icon: "📣", color: "#f97316" },
];

const BADGE_STYLE: Record<string, string> = {
  "Miễn phí": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Freemium":  "bg-blue-100 text-blue-700 border-blue-200",
  "Trả phí":   "bg-orange-100 text-orange-700 border-orange-200",
};

/* ──────────────────────────────────────────
   COMPONENTS
────────────────────────────────────────── */

function VideoCard({ video, onClick, active }: { video: Video; onClick: () => void; active: boolean }) {
  return (
    <button onClick={onClick} className={`group text-left w-full rounded-2xl overflow-hidden transition-all duration-200 ${active ? "ring-2 ring-violet-500 shadow-lg shadow-violet-200" : "hover:shadow-md"}`}>
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <img
          src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`; }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? "bg-violet-600 scale-110" : "bg-white/90 group-hover:bg-white group-hover:scale-110"}`}>
            <svg className={`w-5 h-5 ml-0.5 ${active ? "text-white" : "text-gray-900"}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
      </div>
      {/* Info */}
      <div className="p-3 bg-white">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1 group-hover:text-violet-700 transition-colors">
          {video.title}
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{video.channel}</span>
          <span className="text-xs text-gray-400">{video.views} lượt xem</span>
        </div>
      </div>
    </button>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a href={tool.url} target="_blank" rel="noopener noreferrer"
      className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0"
          style={{ background: tool.color + "22", border: `1.5px solid ${tool.color}33` }}>
          {tool.icon}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {tool.hot && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">🔥 HOT</span>
          )}
          {tool.new && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">✨ MỚI</span>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="font-bold text-gray-900 text-[15px] mb-1 group-hover:text-violet-700 transition-colors">
        {tool.name}
      </h3>

      {/* Desc */}
      <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1 line-clamp-3">
        {tool.desc}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${BADGE_STYLE[tool.badge]}`}>
          {tool.badge}
        </span>
        <span className="text-xs text-violet-600 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Dùng thử
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </div>
    </a>
  );
}

/* ──────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────── */
export default function HocAiPage() {
  /* ── DB state (falls back to hardcoded if DB unavailable) ── */
  const [dbVideos, setDbVideos] = useState<Video[] | null>(null);
  const [dbTools,  setDbTools]  = useState<Tool[]  | null>(null);
  const videos = dbVideos ?? VIDEOS;
  const tools  = dbTools  ?? TOOLS;

  const [activeVideo,    setActiveVideo]    = useState<Video>(VIDEOS[0]);
  const [activeCategory, setActiveCategory] = useState<Category>("Tất cả");
  const [search, setSearch]                 = useState("");
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Fetch videos */
    fetch("/api/hoc-ai-videos")
      .then(r => r.ok ? r.json() : null)
      .then((data: any[]) => {
        if (!Array.isArray(data) || !data.length) return;
        const mapped: Video[] = data.map(v => ({
          id: v.id, title: v.title, channel: v.channel,
          duration: v.duration, views: v.views,
          thumb: `https://img.youtube.com/vi/${v.youtube_id}/maxresdefault.jpg`,
          youtubeId: v.youtube_id,
        }));
        setDbVideos(mapped);
        setActiveVideo(mapped[0]);
      })
      .catch(() => {});

    /* Fetch tools */
    fetch("/api/hoc-ai-tools")
      .then(r => r.ok ? r.json() : null)
      .then((data: any[]) => {
        if (!Array.isArray(data) || !data.length) return;
        setDbTools(data.map(t => ({
          name: t.name, desc: t.description,
          category: t.category as Exclude<Category, "Tất cả">,
          badge: t.badge as Tool["badge"],
          url: t.url, icon: t.icon, color: t.color,
          hot: t.is_hot, new: t.is_new,
          tags: Array.isArray(t.tags) ? t.tags : [],
        })));
      })
      .catch(() => {});
  }, []);

  const filtered = tools.filter(t => {
    const matchCat  = activeCategory === "Tất cả" || t.category === activeCategory;
    const matchQ    = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchQ;
  });

  const hotTools = tools.filter(t => t.hot).slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── HERO ── */}
      <div className="pt-16 relative overflow-hidden bg-white">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Colour blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl pointer-events-none bg-violet-500" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-3xl pointer-events-none bg-pink-400" />

        <div className="relative max-w-6xl mx-auto px-4 pt-14 pb-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold bg-violet-50 border border-violet-200 text-violet-700">
            <span className="text-base">🤖</span>
            Khám phá thế giới AI — Cập nhật liên tục
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Học AI Từ{" "}
            <span className="bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Cơ Bản
            </span>
            <br className="hidden sm:block" />
            {" "}Đến{" "}
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 bg-clip-text text-transparent">
              Nâng Cao
            </span>
          </h1>

          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Video hướng dẫn thực chiến + <span className="font-semibold text-gray-800">{tools.length} công cụ AI</span> được phân loại rõ ràng.
            Tìm đúng tool, dùng đúng cách — tiết kiệm hàng giờ mỗi ngày.
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto relative mb-10">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm công cụ AI... (ChatGPT, Midjourney, Suno...)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-sm font-medium bg-white border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 placeholder-gray-400 transition-all"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg">
                ✕
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
            {[
              { num: `${tools.length}+`, label: "Công cụ AI", color: "#7c3aed", bg: "#f5f3ff" },
              { num: `${videos.length}`,  label: "Video hướng dẫn", color: "#0ea5e9", bg: "#f0f9ff" },
              { num: "7",                  label: "Danh mục",  color: "#10b981", bg: "#f0fdf4" },
              { num: "100%",               label: "Thực chiến", color: "#f97316", bg: "#fff7ed" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border"
                style={{ background: s.bg, borderColor: s.color + "33" }}>
                <p className="text-xl font-extrabold" style={{ color: s.color }}>{s.num}</p>
                <p className="text-xs font-medium text-gray-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899, #f97316, #10b981, #0ea5e9, #7c3aed)" }} />
      </div>

      {/* ── VIDEO SECTION ── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-violet-500 to-pink-500 inline-block" />
              Video Hướng Dẫn
            </h2>
            <p className="text-gray-500 text-sm mt-1">Thực chiến — xem xong làm được ngay</p>
          </div>
          <a href="https://www.youtube.com/@hoccungson116" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.3 3.5-6.3 3.5z" /></svg>
            Xem tất cả
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6" ref={playerRef}>
          {/* Main player */}
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-black" style={{ aspectRatio: "16/9" }}>
            <iframe
              key={activeVideo.youtubeId}
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Playlist */}
          <div className="flex flex-col gap-0 overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900">Danh sách phát</p>
              <p className="text-xs text-gray-400">{videos.length} video</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {videos.map(v => (
                <button key={v.id} onClick={() => { setActiveVideo(v); playerRef.current?.scrollIntoView({ behavior: "smooth" }); }}
                  className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-gray-50 ${activeVideo.id === v.id ? "bg-violet-50" : ""}`}>
                  {/* Mini thumb */}
                  <div className="relative flex-shrink-0 w-24 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <img
                      src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    {activeVideo.id === v.id && (
                      <div className="absolute inset-0 bg-violet-600/30 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded">{v.duration}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold leading-snug line-clamp-2 ${activeVideo.id === v.id ? "text-violet-700" : "text-gray-800"}`}>
                      {v.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{v.views} lượt xem</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current video title */}
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">{activeVideo.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{activeVideo.channel} · {activeVideo.views} lượt xem</p>
        </div>
      </section>

      {/* ── HOT TOOLS BANNER ── */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 bg-white pointer-events-none" style={{ transform: "translate(30%, -30%)" }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="text-white">
              <p className="text-pink-200 text-sm font-semibold mb-1 uppercase tracking-wider">🔥 Đang trending</p>
              <h2 className="text-xl sm:text-2xl font-extrabold mb-2">Công cụ AI hot nhất hiện nay</h2>
              <p className="text-purple-200 text-sm max-w-md">Được sử dụng nhiều nhất bởi các chuyên gia marketing, designer và developer Việt Nam</p>
            </div>

            <div className="flex flex-wrap gap-2 flex-shrink-0">
              {hotTools.map(t => (
                <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <span>{t.icon}</span>
                  {t.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS SECTION ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-blue-500 to-violet-500 inline-block" />
              Khám Phá Công Cụ AI
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {search ? `${filtered.length} kết quả cho "${search}"` : `${filtered.length} công cụ trong ${activeCategory === "Tất cả" ? "tất cả danh mục" : activeCategory}`}
            </p>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.key;
            return (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all border"
                style={{
                  background: active ? cat.color : "#fff",
                  color: active ? "#fff" : "#374151",
                  borderColor: active ? cat.color : "#e5e7eb",
                  boxShadow: active ? `0 4px 12px ${cat.color}44` : "none",
                }}>
                <span>{cat.icon}</span>
                {cat.key}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
                  {cat.key === "Tất cả" ? tools.length : tools.filter(t => t.category === cat.key).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tools grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-600 font-semibold">Không tìm thấy công cụ nào</p>
            <p className="text-gray-400 text-sm mt-1">Thử từ khóa khác hoặc xóa bộ lọc</p>
            <button onClick={() => { setSearch(""); setActiveCategory("Tất cả"); }}
              className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors">
              Xem tất cả
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(t => <ToolCard key={t.name} tool={t} />)}
          </div>
        )}
      </section>

      {/* ── TIPS SECTION ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2 mb-6">
          <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-amber-500 to-orange-500 inline-block" />
          Mẹo Dùng AI Hiệu Quả
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🎯", title: "Viết prompt rõ ràng", desc: "Càng cụ thể càng tốt — nêu rõ vai trò, mục tiêu, định dạng đầu ra và các ràng buộc.", color: "#7c3aed" },
            { icon: "🔄", title: "Iterate & Refine", desc: "Không cần prompt hoàn hảo ngay lần đầu — hỏi thêm, chỉnh sửa dần dần để có kết quả tốt nhất.", color: "#0ea5e9" },
            { icon: "🧩", title: "Chia nhỏ bài toán", desc: "Tách task phức tạp thành nhiều bước nhỏ — AI xử lý từng phần sẽ cho kết quả chính xác hơn.", color: "#10b981" },
            { icon: "⚡", title: "Kết hợp nhiều tool", desc: "Dùng ChatGPT viết → Midjourney tạo ảnh → CapCut dựng video — kết hợp tools tạo workflow mạnh.", color: "#f59e0b" },
          ].map(tip => (
            <div key={tip.title} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                style={{ background: tip.color + "15" }}>
                {tip.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{tip.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Muốn dùng AI cho Business của bạn?</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Sơn tư vấn miễn phí cách tích hợp AI vào quy trình marketing, content, thiết kế — tiết kiệm nhân lực, tăng hiệu quả.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://zalo.me/0968806360" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
              💬 Tư vấn qua Zalo
            </a>
            <Link href="/contact"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-violet-200 text-violet-700 text-sm font-bold hover:bg-violet-50 transition-colors">
              📧 Gửi tin nhắn
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
