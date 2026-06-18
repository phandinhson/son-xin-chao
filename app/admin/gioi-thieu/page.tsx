"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────── */
interface EduItem   { school: string; major: string; year: string; desc: string; icon: string }
interface SkillItem { name: string; level: number }
interface SkillGroup { category: string; icon: string; items: SkillItem[] }
interface ValueItem { icon: string; title: string; desc: string; image_url?: string }

interface PageData {
  // Hero
  hero_name: string; hero_job_title: string; hero_desc: string;
  hero_phone: string; hero_location: string;
  hero_avatar_url: string;           // ← ảnh đại diện
  hero_video_url: string;            // ← YouTube / Facebook video
  stat_years: string; stat_projects: string; stat_clients: string; stat_traffic: string;
  // Story
  story_quote: string; story_p1: string; story_p2: string; story_p3: string;
  story_image_url: string;           // ← ảnh minh họa câu chuyện
  // Education
  edu: EduItem[];
  // Skills
  skills: SkillGroup[];
  // Values
  values: ValueItem[];               // ← mỗi value có image_url
}

const DEFAULTS: PageData = {
  hero_name: "Phan Đình Sơn",
  hero_job_title: "Chuyên gia SEO · Google Ads · Facebook Ads · Website",
  hero_desc: "Hơn 5 năm ứng dụng nền tảng kỹ thuật CNTT vào Digital Marketing — giúp doanh nghiệp vừa và nhỏ tại Long Thành, Đồng Nai tăng trưởng bền vững, minh bạch từng con số.",
  hero_phone: "0968806360",
  hero_location: "Long Thành · Đồng Nai · Việt Nam",
  hero_avatar_url: "",
  hero_video_url: "",
  stat_years: "5+", stat_projects: "150+", stat_clients: "80+", stat_traffic: "3×",
  story_quote: "Nền tảng CNTT từ Sư Phạm Kỹ Thuật giúp mình làm SEO kỹ thuật tốt hơn đa số marketer — vì mình có thể đọc code, tự fix lỗi, tự cài schema mà không cần chờ lập trình viên.",
  story_p1: "Mình là Phan Đình Sơn, tốt nghiệp cử nhân Công nghệ Thông tin tại Đại học Sư Phạm Kỹ Thuật TP. Hồ Chí Minh (HCMUTE), chuyên ngành Kỹ thuật phần mềm năm 2019.",
  story_p2: "Sau khi ra trường, mình tiếp xúc với Digital Marketing và nhận ra: rất nhiều doanh nghiệp địa phương tại Long Thành, Nhơn Trạch có sản phẩm/dịch vụ tốt nhưng gần như vô hình trên Google.",
  story_p3: "Đến nay mình đã đồng hành cùng 80+ doanh nghiệp trong nhiều ngành. Triết lý xuyên suốt: làm việc có tâm, có trách nhiệm — không hứa hẹn viển vông, không giấu số liệu xấu.",
  story_image_url: "",
  edu: [
    { icon: "🎓", school: "Đại học Sư Phạm Kỹ Thuật TP. Hồ Chí Minh", major: "Cử nhân Công nghệ Thông tin – Kỹ thuật phần mềm", year: "2015 – 2019", desc: "Nền tảng lập trình, cơ sở dữ liệu và phát triển web — là lợi thế lớn khi làm SEO kỹ thuật và thiết kế website." },
    { icon: "🏅", school: "Google Digital Garage", major: "Fundamentals of Digital Marketing", year: "2020", desc: "Chứng chỉ quốc tế về Digital Marketing từ Google — bao gồm SEO, SEM, Social Media, Analytics và chiến lược nội dung." },
    { icon: "📜", school: "Google Ads Certification", major: "Google Ads Search & Display", year: "2021 – nay", desc: "Chứng chỉ Google Ads chuyên sâu, cập nhật hàng năm theo yêu cầu của Google." },
  ],
  skills: [
    { category: "SEO & Content", icon: "🔍", items: [
      { name: "SEO Onpage / Technical SEO", level: 95 },
      { name: "SEO Offpage & Link Building", level: 85 },
      { name: "Nghiên cứu từ khóa (Ahrefs, SemRush)", level: 90 },
      { name: "Viết nội dung chuẩn E-E-A-T", level: 88 },
    ]},
    { category: "Quảng cáo trả phí", icon: "📈", items: [
      { name: "Google Ads (Search, Display, Shopping)", level: 90 },
      { name: "Facebook & Instagram Ads", level: 88 },
      { name: "TikTok Ads", level: 75 },
      { name: "Tối ưu ngân sách & ROAS", level: 85 },
    ]},
    { category: "Web & Kỹ thuật", icon: "💻", items: [
      { name: "Next.js / React", level: 82 },
      { name: "WordPress & WooCommerce", level: 90 },
      { name: "Haravan / Shopify", level: 80 },
      { name: "HTML, CSS, JavaScript", level: 85 },
    ]},
    { category: "Phân tích & Công cụ", icon: "📊", items: [
      { name: "Google Analytics 4 & Search Console", level: 92 },
      { name: "Google Tag Manager", level: 85 },
      { name: "Ahrefs / Moz / Screaming Frog", level: 88 },
      { name: "AI Tools (ChatGPT, Gemini, Midjourney)", level: 90 },
    ]},
  ],
  values: [
    { icon: "❤️", title: "Làm việc có tâm",           desc: "Mỗi dự án được đối xử như dự án của chính mình. Không có việc nhỏ — chỉ có sự tỉ mỉ hay không.",                        image_url: "" },
    { icon: "🤝", title: "Làm việc có trách nhiệm",   desc: "Cam kết là cam kết. Deadline là deadline. Kết quả tốt hay chưa đều báo cáo trung thực.",                                  image_url: "" },
    { icon: "🔬", title: "Dựa trên dữ liệu",           desc: "Nền tảng CNTT giúp mình không ra quyết định cảm tính. Mọi chiến lược đều được validate bằng số liệu.",                   image_url: "" },
    { icon: "📚", title: "Học không bao giờ ngừng",   desc: "Google cập nhật thuật toán hàng tuần. Mình dành ít nhất 5 giờ/tuần đọc tài liệu quốc tế.",                               image_url: "" },
  ],
};

/* ─── Tabs ───────────────────────────────────────────── */
type Tab = "hero" | "story" | "edu" | "skills" | "values";
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "hero",   label: "Thông tin",  icon: "🧑‍💻" },
  { id: "story",  label: "Câu chuyện", icon: "📖" },
  { id: "edu",    label: "Học vấn",    icon: "🎓" },
  { id: "skills", label: "Kỹ năng",    icon: "📊" },
  { id: "values", label: "Giá trị",    icon: "❤️" },
];

/* ─── Shared styles ──────────────────────────────────── */
const inp  = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm";
const lbl  = "block text-gray-400 text-sm mb-1.5";
const card = "p-6 rounded-2xl bg-white/5 border border-white/10";

/* ─── Field component ────────────────────────────────── */
function Field({ label, value, onChange, multiline = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className={lbl}>{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inp + " resize-none"} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inp} />
      }
    </div>
  );
}

/* ─── ImageUpload component ──────────────────────────── */
function ImageUpload({
  label, hint = "", value, onChange, aspectHint = "Tỉ lệ tự do",
}: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; aspectHint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className={lbl}>
          {label}
          {hint && <span className="ml-1.5 text-gray-600 text-xs">— {hint}</span>}
        </label>

        {/* Preview */}
        {value ? (
          <div className="relative mb-3 rounded-2xl overflow-hidden border border-white/10 bg-white/5 group">
            <img src={value} alt="preview" className="w-full max-h-52 object-cover" onError={() => onChange("")} />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button onClick={() => fileRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-500 transition-all">
                🔄 Đổi ảnh
              </button>
              <button onClick={() => onChange("")}
                className="px-4 py-2 bg-red-600/80 text-white text-xs font-semibold rounded-xl hover:bg-red-500 transition-all">
                🗑️ Xóa
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="mb-3 border-2 border-dashed border-white/15 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🖼️</div>
            <p className="text-gray-400 text-sm font-medium">Nhấp để tải ảnh lên</p>
            <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP · {aspectHint}</p>
          </div>
        )}

        {/* URL input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={value.startsWith("data:") ? "" : value}
            onChange={e => onChange(e.target.value)}
            placeholder="Hoặc dán URL ảnh từ Thư viện ảnh..."
            className={inp + " flex-1"}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2.5 bg-white/10 border border-white/15 text-gray-300 text-xs font-semibold rounded-xl hover:bg-white/15 hover:text-white transition-all whitespace-nowrap">
            📁 Upload
          </button>
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        <p className="text-gray-700 text-xs mt-1.5">
          💡 Upload từ máy tính hoặc copy URL từ{" "}
          <Link href="/admin/media" target="_blank" className="text-violet-400 hover:underline">
            Thư viện ảnh
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ─── getEmbedUrl helper ─────────────────────────────── */
function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  // YouTube watch
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // YouTube already embed
  if (url.includes("youtube.com/embed/")) return url;
  // Facebook video
  if (url.includes("facebook.com") && (url.includes("/videos/") || url.includes("v="))) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&width=640&show_text=false&appId`;
  }
  return null;
}

/* ─── VideoUpload component ──────────────────────────── */
function VideoUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const embedUrl = getEmbedUrl(value);

  return (
    <div className="space-y-3">
      <div>
        <label className={lbl}>
          Link video giới thiệu
          <span className="ml-1.5 text-gray-600 text-xs">— YouTube hoặc Facebook Video</span>
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
            className={inp + " flex-1"}
          />
          {value && (
            <button onClick={() => onChange("")}
              className="px-3 py-2.5 bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl hover:bg-red-600/30 transition-all whitespace-nowrap">
              🗑️ Xóa
            </button>
          )}
        </div>

        <div className="flex gap-3 mt-2 flex-wrap">
          {[
            { label: "🎬 YouTube Watch", sample: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
            { label: "⚡ YouTube Short", sample: "https://youtu.be/dQw4w9WgXcQ" },
            { label: "📘 Facebook Video", sample: "https://www.facebook.com/watch?v=123456789" },
          ].map(({ label }) => (
            <span key={label} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-gray-500 border border-white/10">{label}</span>
          ))}
        </div>
      </div>

      {/* Preview */}
      {embedUrl ? (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : value && !embedUrl ? (
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm">
          ⚠️ URL không hợp lệ — hãy dán link YouTube (<code>youtube.com/watch?v=...</code> hoặc <code>youtu.be/...</code>) hoặc Facebook Video.
        </div>
      ) : (
        <div className="p-5 rounded-2xl border-2 border-dashed border-white/10 text-center text-gray-600 text-sm">
          <div className="text-3xl mb-2">🎬</div>
          Dán link YouTube hoặc Facebook để xem preview
        </div>
      )}
    </div>
  );
}

/* ─── SkillBar ───────────────────────────────────────── */
function SkillBarEditor({ name, level, colorBar, onName, onLevel }: {
  name: string; level: number; colorBar: string; onName: (v: string) => void; onLevel: (v: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2">
        <label className={lbl + " mb-1"}>Tên kỹ năng</label>
        <input type="text" value={name} onChange={e => onName(e.target.value)} className={inp} />
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-400 text-sm">Mức độ thành thạo</label>
          <span className="text-blue-400 font-bold text-sm">{level}%</span>
        </div>
        <input type="range" min={0} max={100} value={level}
          onChange={e => onLevel(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #3b82f6 ${level}%, #374151 ${level}%)` }} />
        <div className="flex justify-between text-xs text-gray-600 mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function AdminGioiThieu() {
  const [data, setData]         = useState<PageData>(DEFAULTS);
  const [tab, setTab]           = useState<Tab>("hero");
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [saveErr, setSaveErr]   = useState("");

  useEffect(() => {
    fetch("/api/admin/gioi-thieu")
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 0) setData({ ...DEFAULTS, ...d }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaveErr("");
    const res = await fetch("/api/admin/gioi-thieu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else { const j = await res.json(); setSaveErr(j.error || "Lỗi lưu dữ liệu"); }
    setSaving(false);
  };

  const set = (key: keyof PageData, val: unknown) => setData(d => ({ ...d, [key]: val }));
  const setEdu    = (i: number, f: keyof typeof DEFAULTS.edu[0],    v: string) =>
    setData(d => { const e = [...d.edu];    e[i] = { ...e[i], [f]: v }; return { ...d, edu: e }; });
  const setSkillLevel = (gi: number, si: number, v: number) =>
    setData(d => ({ ...d, skills: d.skills.map((g, gi2) => gi2 !== gi ? g : { ...g, items: g.items.map((it, si2) => si2 !== si ? it : { ...it, level: v }) }) }));
  const setSkillName = (gi: number, si: number, v: string) =>
    setData(d => ({ ...d, skills: d.skills.map((g, gi2) => gi2 !== gi ? g : { ...g, items: g.items.map((it, si2) => si2 !== si ? it : { ...it, name: v }) }) }));
  const setVal    = (i: number, f: keyof ValueItem, v: string) =>
    setData(d => { const vs = [...d.values]; vs[i] = { ...vs[i], [f]: v }; return { ...d, values: vs }; });

  if (loading) return (
    <div className="flex items-center justify-center h-96 text-gray-500">
      <div className="text-center"><div className="text-4xl mb-3 animate-spin">⚙️</div><p>Đang tải...</p></div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">Trang Giới Thiệu</h1>
            <Link href="/gioi-thieu" target="_blank"
              className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/10">
              🔗 Xem trang
            </Link>
          </div>
          <p className="text-gray-400 text-sm">Chỉnh sửa nội dung trang <code className="text-violet-400">/gioi-thieu</code></p>
        </div>
        <div className="flex items-center gap-3">
          {saved    && <span className="text-green-400 text-sm animate-pulse">✅ Đã lưu!</span>}
          {saveErr  && <span className="text-red-400 text-sm">{saveErr}</span>}
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-sm">
            {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
            }`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ══════ THÔNG TIN ══════ */}
      {tab === "hero" && (
        <div className="space-y-6">
          {/* Ảnh đại diện */}
          <div className={card}>
            <h2 className="text-white font-semibold flex items-center gap-2 mb-4">🖼️ Ảnh đại diện</h2>
            <ImageUpload
              label="Ảnh avatar"
              hint="Hiển thị trong thẻ avatar bên trái hero"
              value={data.hero_avatar_url}
              onChange={v => set("hero_avatar_url", v)}
              aspectHint="Tỉ lệ 1:1 — Khuyến nghị 400×400px"
            />
          </div>

          {/* Video giới thiệu */}
          <div className={card}>
            <h2 className="text-white font-semibold flex items-center gap-2 mb-4">🎬 Video giới thiệu</h2>
            <p className="text-gray-500 text-xs mb-4">
              Hiển thị dưới thanh thống kê trên trang <code className="text-violet-400">/gioi-thieu</code>. Để trống nếu không muốn hiển thị.
            </p>
            <VideoUpload value={data.hero_video_url} onChange={v => set("hero_video_url", v)} />
          </div>

          {/* Thông tin cá nhân */}
          <div className={card + " space-y-4"}>
            <h2 className="text-white font-semibold flex items-center gap-2">🧑‍💻 Thông tin cá nhân</h2>
            <Field label="Tên đầy đủ"                 value={data.hero_name}      onChange={v => set("hero_name", v)}      placeholder="Phan Đình Sơn" />
            <Field label="Chức danh (dòng dưới tên)"  value={data.hero_job_title} onChange={v => set("hero_job_title", v)} placeholder="Chuyên gia SEO · Google Ads · Website" />
            <Field label="Mô tả ngắn (Hero)"           value={data.hero_desc}      onChange={v => set("hero_desc", v)}      multiline placeholder="Hơn 5 năm ứng dụng..." />
            <Field label="Số điện thoại"               value={data.hero_phone}     onChange={v => set("hero_phone", v)}     placeholder="0968806360" />
            <Field label="Địa điểm"                    value={data.hero_location}  onChange={v => set("hero_location", v)}  placeholder="Long Thành · Đồng Nai · Việt Nam" />
          </div>

          {/* Stats */}
          <div className={card + " space-y-4"}>
            <h2 className="text-white font-semibold flex items-center gap-2">📊 Thống kê nổi bật</h2>
            <p className="text-gray-500 text-xs">4 con số trong thanh stats bar</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Năm kinh nghiệm"      value={data.stat_years}    onChange={v => set("stat_years", v)}    placeholder="5+" />
              <Field label="Dự án thành công"      value={data.stat_projects} onChange={v => set("stat_projects", v)} placeholder="150+" />
              <Field label="Khách hàng"            value={data.stat_clients}  onChange={v => set("stat_clients", v)}  placeholder="80+" />
              <Field label="Traffic tăng TB"       value={data.stat_traffic}  onChange={v => set("stat_traffic", v)}  placeholder="3×" />
            </div>
          </div>
        </div>
      )}

      {/* ══════ CÂU CHUYỆN ══════ */}
      {tab === "story" && (
        <div className="space-y-6">
          {/* Ảnh câu chuyện */}
          <div className={card}>
            <h2 className="text-white font-semibold flex items-center gap-2 mb-4">🖼️ Ảnh minh họa câu chuyện</h2>
            <ImageUpload
              label="Ảnh hiển thị bên cạnh phần câu chuyện"
              hint="Khi có ảnh, layout sẽ tự chuyển sang 2 cột"
              value={data.story_image_url}
              onChange={v => set("story_image_url", v)}
              aspectHint="Tỉ lệ 4:3 hoặc 16:9 — Khuyến nghị 800×600px"
            />
          </div>

          {/* Nội dung câu chuyện */}
          <div className={card + " space-y-4"}>
            <h2 className="text-white font-semibold flex items-center gap-2">📖 Nội dung câu chuyện</h2>
            <div>
              <label className={lbl}>Câu trích dẫn nổi bật (pull quote) 💬</label>
              <textarea rows={3} value={data.story_quote} onChange={e => set("story_quote", e.target.value)}
                placeholder='Nền tảng CNTT từ Sư Phạm Kỹ Thuật...'
                className={inp + " resize-none"} />
            </div>
            <Field label="Đoạn 1 — Giới thiệu học vấn"                   value={data.story_p1} onChange={v => set("story_p1", v)} multiline />
            <Field label="Đoạn 2 — Lý do bước vào Digital Marketing"     value={data.story_p2} onChange={v => set("story_p2", v)} multiline />
            <Field label="Đoạn 3 — Thành tích & triết lý làm việc"       value={data.story_p3} onChange={v => set("story_p3", v)} multiline />
          </div>
        </div>
      )}

      {/* ══════ HỌC VẤN ══════ */}
      {tab === "edu" && (
        <div className="space-y-5">
          <p className="text-gray-500 text-sm">3 mục học vấn / chứng chỉ</p>
          {data.edu.map((e, i) => (
            <div key={i} className={card + " space-y-3"}>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{e.icon}</span>
                <h3 className="text-white font-semibold">Học vấn #{i + 1}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Icon" value={e.icon} onChange={v => setEdu(i, "icon", v)} placeholder="🎓" />
                <Field label="Năm" value={e.year} onChange={v => setEdu(i, "year", v)} placeholder="2015 – 2019" />
              </div>
              <Field label="Tên trường / tổ chức"          value={e.school} onChange={v => setEdu(i, "school", v)} placeholder="Đại học Sư Phạm Kỹ Thuật TP.HCM" />
              <Field label="Chuyên ngành / chứng chỉ"      value={e.major}  onChange={v => setEdu(i, "major", v)}  placeholder="Cử nhân Công nghệ Thông tin" />
              <Field label="Mô tả ngắn"                    value={e.desc}   onChange={v => setEdu(i, "desc", v)}   multiline />
            </div>
          ))}
        </div>
      )}

      {/* ══════ KỸ NĂNG ══════ */}
      {tab === "skills" && (
        <div className="space-y-6">
          <p className="text-gray-500 text-sm">Kéo thanh trượt để chỉnh mức độ thành thạo (0–100%)</p>
          {data.skills.map((group, gi) => (
            <div key={gi} className={card}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{group.icon}</span>
                <h3 className="text-white font-semibold">{group.category}</h3>
              </div>
              <div className="space-y-5">
                {group.items.map((skill, si) => (
                  <SkillBarEditor
                    key={si}
                    name={skill.name} level={skill.level}
                    colorBar="from-blue-500 to-cyan-400"
                    onName={v => setSkillName(gi, si, v)}
                    onLevel={v => setSkillLevel(gi, si, v)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════ GIÁ TRỊ ══════ */}
      {tab === "values" && (
        <div className="space-y-5">
          <p className="text-gray-500 text-sm">4 giá trị làm việc — thêm ảnh để card hiển thị hình minh họa</p>
          {data.values.map((v, i) => (
            <div key={i} className={card + " space-y-4"}>
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{v.icon}</span>
                <h3 className="text-white font-semibold">Giá trị #{i + 1}</h3>
              </div>

              {/* Ảnh minh họa */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <ImageUpload
                  label={`Ảnh minh họa — "${v.title || `Giá trị #${i + 1}`}"`}
                  hint="Tùy chọn — hiển thị đầu card khi có ảnh"
                  value={v.image_url || ""}
                  onChange={val => setVal(i, "image_url", val)}
                  aspectHint="Tỉ lệ 16:9 — Khuyến nghị 600×340px"
                />
              </div>

              {/* Text fields */}
              <div className="grid grid-cols-3 gap-4">
                <Field label="Icon (emoji)" value={v.icon}  onChange={val => setVal(i, "icon",  val)} placeholder="❤️" />
                <div className="col-span-2">
                  <Field label="Tiêu đề" value={v.title} onChange={val => setVal(i, "title", val)} placeholder="Làm việc có tâm" />
                </div>
              </div>
              <Field label="Mô tả (1-2 câu)" value={v.desc} onChange={val => setVal(i, "desc", val)} multiline />
            </div>
          ))}
        </div>
      )}

      {/* Bottom save */}
      <div className="mt-8 flex items-center justify-between py-4 border-t border-white/5">
        <p className="text-gray-600 text-sm">
          💡 Sau khi lưu, trang{" "}
          <Link href="/gioi-thieu" target="_blank" className="text-violet-400 hover:underline">
            /gioi-thieu
          </Link>{" "}
          cập nhật ngay lập tức.
        </p>
        <button onClick={handleSave} disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
          {saving ? "Đang lưu..." : "💾 Lưu tất cả thay đổi"}
        </button>
      </div>
    </div>
  );
}
