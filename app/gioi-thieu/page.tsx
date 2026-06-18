import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // always fetch fresh CMS data

/* ─── Fetch CMS content ─────────────────────────────────── */
async function getPageData() {
  try {
    const db = supabaseAdmin();
    const { data } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "page_gioi_thieu")
      .single();
    if (data?.value) return JSON.parse(data.value);
  } catch { /* fallback to defaults below */ }
  return null;
}

/* ─── SEO Metadata ─────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Giới Thiệu | Phan Đình Sơn – Chuyên gia SEO & Digital Marketing Long Thành, Đồng Nai",
  description:
    "Phan Đình Sơn – tốt nghiệp Công nghệ Thông tin trường Sư Phạm Kỹ Thuật TP.HCM. Chuyên gia SEO, Google Ads, Facebook Ads và thiết kế Website tại Long Thành, Đồng Nai. Làm việc có tâm, có trách nhiệm – kết quả đo lường được.",
  keywords:
    "Phan Đình Sơn, giới thiệu Sơn Xin Chào, chuyên gia SEO Long Thành, SEO Đồng Nai, Sư Phạm Kỹ Thuật HCM, CNTT SPKT, Google Ads Long Thành, thiết kế website Đồng Nai",
  alternates: { canonical: "https://www.sonxinchao.com/gioi-thieu" },
  openGraph: {
    title: "Giới Thiệu | Phan Đình Sơn – Chuyên gia SEO & Digital Marketing",
    description:
      "Cử nhân CNTT – Sư Phạm Kỹ Thuật TP.HCM. Hơn 5 năm thực chiến SEO, Google Ads, Facebook Ads & Website. Làm việc có tâm, kết quả rõ ràng, minh bạch từng báo cáo.",
    url: "https://www.sonxinchao.com/gioi-thieu",
    type: "profile",
  },
};

/* ─── JSON-LD ───────────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Phan Đình Sơn",
  url: "https://www.sonxinchao.com",
  jobTitle: "Chuyên gia SEO & Digital Marketing",
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Trường Đại học Sư Phạm Kỹ Thuật Thành phố Hồ Chí Minh",
    url: "https://hcmute.edu.vn",
  },
  knowsAbout: ["SEO", "Google Ads", "Facebook Ads", "Web Design", "Digital Marketing", "WordPress", "Next.js"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Long Thành",
    addressRegion: "Đồng Nai",
    addressCountry: "VN",
  },
  telephone: "+84968806360",
  description:
    "Chuyên gia SEO và Digital Marketing tốt nghiệp Công nghệ Thông tin – Sư Phạm Kỹ Thuật TP.HCM. Hơn 5 năm kinh nghiệm thực chiến tại Long Thành, Đồng Nai.",
};

/* ─── Data ─────────────────────────────────────────────── */
const SKILLS = [
  {
    category: "SEO & Content",
    icon: "🔍",
    colorBar: "from-blue-500 to-cyan-400",
    colorIcon: "bg-blue-100 text-blue-600",
    items: [
      { name: "SEO Onpage / Technical SEO", level: 95 },
      { name: "SEO Offpage & Link Building", level: 85 },
      { name: "Nghiên cứu từ khóa (Ahrefs, SemRush)", level: 90 },
      { name: "Viết nội dung chuẩn E-E-A-T", level: 88 },
    ],
  },
  {
    category: "Quảng cáo trả phí",
    icon: "📈",
    colorBar: "from-orange-500 to-yellow-400",
    colorIcon: "bg-orange-100 text-orange-600",
    items: [
      { name: "Google Ads (Search, Display, Shopping)", level: 90 },
      { name: "Facebook & Instagram Ads", level: 88 },
      { name: "TikTok Ads", level: 75 },
      { name: "Tối ưu ngân sách & ROAS", level: 85 },
    ],
  },
  {
    category: "Web & Kỹ thuật",
    icon: "💻",
    colorBar: "from-violet-500 to-purple-400",
    colorIcon: "bg-violet-100 text-violet-600",
    items: [
      { name: "Next.js / React", level: 82 },
      { name: "WordPress & WooCommerce", level: 90 },
      { name: "Haravan / Shopify", level: 80 },
      { name: "HTML, CSS, JavaScript", level: 85 },
    ],
  },
  {
    category: "Phân tích & Công cụ",
    icon: "📊",
    colorBar: "from-emerald-500 to-teal-400",
    colorIcon: "bg-emerald-100 text-emerald-600",
    items: [
      { name: "Google Analytics 4 & Search Console", level: 92 },
      { name: "Google Tag Manager", level: 85 },
      { name: "Ahrefs / Moz / Screaming Frog", level: 88 },
      { name: "AI Tools (ChatGPT, Gemini, Midjourney)", level: 90 },
    ],
  },
];

const EDUCATION = [
  {
    school: "Đại học Sư Phạm Kỹ Thuật TP. Hồ Chí Minh",
    major: "Cử nhân Công nghệ Thông tin – Kỹ thuật phần mềm",
    year: "2015 – 2019",
    desc: "Nền tảng lập trình, cơ sở dữ liệu và phát triển web được xây dựng từ đây — là lợi thế lớn khi làm SEO kỹ thuật và thiết kế website. Mình có thể đọc code, debug lỗi crawl, cài schema bằng tay mà không cần nhờ lập trình viên.",
    icon: "🎓",
    accent: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    school: "Google Digital Garage",
    major: "Fundamentals of Digital Marketing",
    year: "2020",
    desc: "Chứng chỉ quốc tế về Digital Marketing từ Google — bao gồm SEO, SEM, Social Media, Analytics và chiến lược nội dung.",
    icon: "🏅",
    accent: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    school: "Google Ads Certification",
    major: "Google Ads Search & Display",
    year: "2021 – nay",
    desc: "Chứng chỉ Google Ads chuyên sâu, cập nhật hàng năm theo yêu cầu của Google.",
    icon: "📜",
    accent: "#10b981",
    bg: "#f0fdf4",
  },
];

const VALUES = [
  {
    icon: "❤️",
    title: "Làm việc có tâm",
    desc: "Mỗi dự án được đối xử như dự án của chính mình. Không có việc nhỏ — chỉ có sự tỉ mỉ hay không. Khi nhận dự án của bạn, mình đặt toàn bộ sự chú tâm vào đó.",
    accent: "#ef4444",
    bg: "#fff1f2",
    border: "#fecdd3",
  },
  {
    icon: "🤝",
    title: "Làm việc có trách nhiệm",
    desc: "Cam kết là cam kết. Deadline là deadline. Kết quả tốt hay chưa đều báo cáo trung thực — không giấu số xấu, không đổ lỗi thuật toán. Chưa đạt thì mình fix ngay.",
    accent: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    icon: "🔬",
    title: "Dựa trên dữ liệu",
    desc: "Nền tảng CNTT giúp mình không ra quyết định cảm tính. Mọi chiến lược đều được validate bằng số liệu từ Analytics, Search Console, Ahrefs.",
    accent: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    icon: "📚",
    title: "Học không bao giờ ngừng",
    desc: "Google cập nhật thuật toán hàng tuần. Mình dành ít nhất 5 giờ/tuần đọc tài liệu quốc tế, theo dõi thay đổi và cập nhật kiến thức cho từng dự án.",
    accent: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
  },
];

const SERVICES = [
  { icon: "🔍", title: "SEO Organic", href: "/dich-vu/seo",                  bg: "#eff6ff", color: "#3b82f6" },
  { icon: "📈", title: "Google Ads",  href: "/dich-vu/google-ads",           bg: "#fffbeb", color: "#f59e0b" },
  { icon: "📣", title: "Facebook Ads",href: "/dich-vu/facebook-ads",         bg: "#f5f3ff", color: "#8b5cf6" },
  { icon: "💻", title: "Website",     href: "/dich-vu/thiet-ke-website",     bg: "#f0fdf4", color: "#10b981" },
  { icon: "📍", title: "SEO Local",   href: "/dich-vu/seo-local",            bg: "#fff1f2", color: "#ef4444" },
  { icon: "🎯", title: "Tư vấn SEO",  href: "/dich-vu/audit-tu-van",        bg: "#fdf4ff", color: "#d946ef" },
];

function SkillBar({ name, level, colorBar }: { name: string; level: number; colorBar: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-slate-700">{name}</span>
        <span className="text-xs font-bold text-slate-400">{level}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${colorBar}`} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

/* ─── getEmbedUrl ───────────────────────────────────────── */
function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  if (url.includes("youtube.com/embed/")) return url;
  if (url.includes("facebook.com") && (url.includes("/videos/") || url.includes("v=")))
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&width=640&show_text=false&appId`;
  return null;
}

/* ─── Page ─────────────────────────────────────────────── */
export default async function GioiThieuPage() {
  const cms = await getPageData();
  // Merge CMS data over defaults so missing keys fall back gracefully
  const D = {
    hero_name:     cms?.hero_name     ?? "Phan Đình Sơn",
    hero_job_title:cms?.hero_job_title?? "Chuyên gia SEO · Google Ads · Facebook Ads · Website",
    hero_desc:     cms?.hero_desc     ?? "Hơn 5 năm ứng dụng nền tảng kỹ thuật CNTT vào Digital Marketing — giúp doanh nghiệp vừa và nhỏ tại Long Thành, Đồng Nai tăng trưởng bền vững, minh bạch từng con số. Làm việc có tâm, có trách nhiệm.",
    hero_phone:    cms?.hero_phone    ?? "0968806360",
    hero_location: cms?.hero_location ?? "Long Thành · Đồng Nai · Việt Nam",
    stat_years:    cms?.stat_years    ?? "5+",
    stat_projects: cms?.stat_projects ?? "150+",
    stat_clients:  cms?.stat_clients  ?? "80+",
    stat_traffic:  cms?.stat_traffic  ?? "3×",
    story_quote:   cms?.story_quote   ?? "Nền tảng CNTT từ Sư Phạm Kỹ Thuật giúp mình làm SEO kỹ thuật tốt hơn đa số marketer — vì mình có thể đọc code, tự fix lỗi, tự cài schema mà không cần chờ lập trình viên.",
    story_p1:      cms?.story_p1      ?? "Mình là Phan Đình Sơn, tốt nghiệp cử nhân Công nghệ Thông tin tại Đại học Sư Phạm Kỹ Thuật TP. Hồ Chí Minh (HCMUTE), chuyên ngành Kỹ thuật phần mềm năm 2019.",
    story_p2:      cms?.story_p2      ?? "Sau khi ra trường, mình tiếp xúc với Digital Marketing và nhận ra một điều: rất nhiều doanh nghiệp địa phương tại Long Thành, Nhơn Trạch có sản phẩm/dịch vụ tốt nhưng gần như vô hình trên Google. Từ đó, mình dành toàn bộ tâm huyết để xây dựng chuyên môn SEO và Digital Marketing, kết hợp với nền tảng kỹ thuật CNTT sẵn có.",
    story_p3:      cms?.story_p3      ?? "Đến nay mình đã đồng hành cùng 80+ doanh nghiệp trong nhiều ngành: nhôm kính, spa, in ấn, bất động sản, thực phẩm chức năng, giáo dục... Triết lý xuyên suốt: làm việc có tâm, có trách nhiệm — không hứa hẹn viển vông, không giấu số liệu xấu, không đổ lỗi thuật toán.",
    hero_avatar_url: cms?.hero_avatar_url ?? "",
    hero_video_url:  cms?.hero_video_url  ?? "",
    story_image_url: cms?.story_image_url ?? "",
    edu:           cms?.edu           ?? EDUCATION,
    skills:        cms?.skills        ?? SKILLS,
    values:        cms?.values        ?? VALUES,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="pt-16 overflow-x-hidden bg-white text-slate-900">

        {/* ══════════════════════════════════════
            HERO — nền trắng gradient, chữ đen
        ══════════════════════════════════════ */}
        <section className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#f0f7ff 0%,#faf5ff 50%,#fff1f5 100%)" }}>

          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle,#a78bfa,transparent 70%)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle,#60a5fa,transparent 70%)", transform: "translate(-30%,30%)" }} />

          <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-5 gap-12 items-center">

            {/* Avatar */}
            <div className="lg:col-span-2 flex justify-center order-1 lg:order-none">
              <div className="relative">
                {/* Card */}
                <div className="w-64 h-72 lg:w-72 lg:h-80 rounded-3xl shadow-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg,#ffffff,#f0f4ff)",
                    border: "1px solid rgba(99,102,241,0.15)",
                    boxShadow: "0 25px 60px rgba(99,102,241,0.15)",
                  }}>
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
                    {/* Avatar circle / photo */}
                    {D.hero_avatar_url ? (
                      <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg ring-4 ring-white">
                        <img src={D.hero_avatar_url} alt={D.hero_name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-black text-white shadow-lg"
                        style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                        S
                      </div>
                    )}
                    <div>
                      <p className="text-slate-900 font-bold text-xl text-center">{D.hero_name}</p>
                      <p className="text-slate-500 text-sm text-center mt-1">Digital Marketing Expert</p>
                    </div>
                    {/* Divider */}
                    <div className="w-12 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-violet-400" />
                    {/* Edu tag */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: "#eff6ff", color: "#3b82f6" }}>
                      🎓 CNTT – SPKT TP.HCM
                    </div>
                    {/* Online dot */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Sẵn sàng nhận dự án
                    </div>
                  </div>
                </div>

                {/* Floating stat 1 */}
                <div className="absolute -top-4 -right-6 px-4 py-2.5 rounded-2xl shadow-lg text-center"
                  style={{ background: "white", border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                  <div className="text-2xl font-extrabold text-indigo-600">{D.stat_years}</div>
                  <div className="text-xs text-slate-500">Năm KN</div>
                </div>

                {/* Floating stat 2 */}
                <div className="absolute -bottom-4 -left-6 px-4 py-2.5 rounded-2xl shadow-lg text-center"
                  style={{ background: "white", border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                  <div className="text-2xl font-extrabold text-violet-600">{D.stat_clients}</div>
                  <div className="text-xs text-slate-500">Khách hàng</div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
                style={{ background: "#eff6ff", color: "#3b82f6", border: "1px solid #bfdbfe" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {D.hero_location}
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-4">
                Xin chào! Mình là{" "}
                <span style={{
                  background: "linear-gradient(135deg,#3b82f6 0%,#8b5cf6 50%,#ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  {D.hero_name.split(" ").slice(-1)[0]} 👋
                </span>
              </h1>

              <p className="text-slate-600 text-lg font-medium leading-relaxed mb-5">
                <span className="font-bold text-slate-900">{D.hero_job_title}</span>
              </p>

              <p className="text-slate-500 leading-relaxed text-base mb-7">{D.hero_desc}</p>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["SEO Technical","Google Ads","Facebook Ads","Next.js / React","WordPress","Analytics","Ahrefs","AI Marketing"].map((tag) => (
                  <span key={tag}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full text-slate-600"
                    style={{ background: "white", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="/#contact"
                  className="px-7 py-3.5 font-bold text-white rounded-full text-sm hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-lg"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>
                  Tư vấn miễn phí →
                </a>
                <a href={`tel:${D.hero_phone}`}
                  className="px-7 py-3.5 font-bold rounded-full text-sm text-slate-700 hover:bg-slate-100 transition-all"
                  style={{ border: "1.5px solid #e2e8f0" }}>
                  📞 {D.hero_phone}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════ */}
        <section className="border-y border-slate-100 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
            {[
              { v: D.stat_years,    l: "Năm kinh nghiệm",        i: "📅", c: "#3b82f6" },
              { v: D.stat_projects, l: "Dự án thành công",        i: "🚀", c: "#8b5cf6" },
              { v: D.stat_clients,  l: "Khách hàng tin tưởng",    i: "🤝", c: "#10b981" },
              { v: D.stat_traffic,  l: "Traffic tăng trung bình", i: "📈", c: "#f59e0b" },
            ].map((s, i) => (
              <div key={s.l} className={`text-center px-4 ${i < 2 ? "pb-6 md:pb-0" : ""}`}>
                <div className="text-2xl mb-2">{s.i}</div>
                <div className="text-4xl font-extrabold mb-1" style={{ color: s.c }}>{s.v}</div>
                <div className="text-sm text-slate-500 font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            VIDEO GIỚI THIỆU (hiện khi có link)
        ══════════════════════════════════════ */}
        {(() => {
          const embedUrl = getEmbedUrl(D.hero_video_url);
          if (!embedUrl) return null;
          return (
            <section className="py-16 bg-white">
              <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-8">
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 px-3 py-1 rounded-full bg-blue-50 mb-3">
                    Video giới thiệu
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900">
                    Gặp gỡ Phan Đình Sơn 👋
                  </h2>
                </div>
                <div
                  className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100"
                  style={{ paddingTop: "56.25%" /* 16:9 */ }}>
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="Video giới thiệu Phan Đình Sơn"
                  />
                </div>
                {/* Source badge */}
                <div className="flex justify-center mt-5">
                  <span className="inline-flex items-center gap-2 text-xs text-slate-400 px-4 py-2 rounded-full bg-slate-50 border border-slate-100">
                    {D.hero_video_url.includes("facebook") ? (
                      <><span className="text-blue-600">📘</span> Facebook Video</>
                    ) : (
                      <><span className="text-red-500">▶</span> YouTube</>
                    )}
                  </span>
                </div>
              </div>
            </section>
          );
        })()}

        {/* ══════════════════════════════════════
            GIỚI THIỆU BẢN THÂN
        ══════════════════════════════════════ */}
        <section className="py-20" style={{ background: "#f8fafc" }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 px-3 py-1 rounded-full bg-blue-50 mb-3">
                Câu chuyện của mình
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
                Từ kỹ sư CNTT đến chuyên gia Digital Marketing
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100">
              {/* Pull quote */}
              <div className="flex items-start gap-4 mb-7 p-5 rounded-2xl"
                style={{ background: "linear-gradient(135deg,#eff6ff,#f5f3ff)" }}>
                <span className="text-3xl flex-shrink-0">💡</span>
                <p className="text-slate-700 font-semibold text-base leading-relaxed italic">
                  &ldquo;{D.story_quote}&rdquo;
                </p>
              </div>

              {/* Two-col layout when story image is set */}
              {D.story_image_url ? (
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4 text-slate-600 leading-relaxed text-[1.0625rem]">
                    <p>{D.story_p1}</p>
                    <p>{D.story_p2}</p>
                    <p>{D.story_p3}</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100 order-first lg:order-none">
                    <img src={D.story_image_url} alt="Câu chuyện của Phan Đình Sơn"
                      className="w-full h-full object-cover max-h-72 lg:max-h-none" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-slate-600 leading-relaxed text-[1.0625rem]">
                  <p>{D.story_p1}</p>
                  <p>{D.story_p2}</p>
                  <p>{D.story_p3}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            HỌC VẤN & CHỨNG CHỈ
        ══════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-violet-600 px-3 py-1 rounded-full bg-violet-50 mb-3">
                Học vấn & Chứng chỉ
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">Nền tảng kiến thức</h2>
            </div>

            <div className="space-y-5">
              {(D.edu as typeof EDUCATION).map((edu) => (
                <div key={edu.school}
                  className="flex gap-5 items-start rounded-2xl p-6 hover:shadow-md transition-all"
                  style={{ background: edu.bg, border: `1px solid ${edu.accent}22` }}>
                  <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow-sm bg-white">
                    {edu.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base lg:text-lg leading-tight">
                          {edu.school}
                        </h3>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: edu.accent }}>
                          {edu.major}
                        </p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-slate-500 flex-shrink-0 shadow-sm">
                        {edu.year}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed mt-2">{edu.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            KỸ NĂNG CHUYÊN MÔN
        ══════════════════════════════════════ */}
        <section className="py-24" style={{ background: "#f8fafc" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-600 px-3 py-1 rounded-full bg-emerald-50 mb-3">
                Kỹ năng chuyên môn
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">
                Những gì mình thực sự giỏi
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm">
                Xây dựng từ nền tảng kỹ thuật CNTT kết hợp hơn 5 năm thực chiến — không chỉ là chứng chỉ trên giấy.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {(D.skills as typeof SKILLS).map((group) => (
                <div key={group.category}
                  className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${group.colorIcon}`}>
                      {group.icon}
                    </div>
                    <h3 className="font-bold text-slate-900">{group.category}</h3>
                  </div>
                  {group.items.map((skill) => (
                    <SkillBar key={skill.name} name={skill.name} level={skill.level} colorBar={group.colorBar} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            GIÁ TRỊ LÀM VIỆC — nền sáng pastel
        ══════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-rose-600 px-3 py-1 rounded-full bg-rose-50 mb-3">
                Triết lý làm việc
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">
                Làm việc có tâm, có trách nhiệm
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm">
                Đây không phải slogan — đây là cách mình vận hành từng dự án, từng tuần.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {(D.values as (typeof VALUES[0] & { image_url?: string })[]).map((v) => (
                <div key={v.title}
                  className="rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
                  style={{ background: v.bg, border: `1.5px solid ${v.border}` }}>
                  {/* Value image if set */}
                  {v.image_url && (
                    <div className="w-full h-40 overflow-hidden">
                      <img src={v.image_url} alt={v.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-white shadow-sm">
                        {v.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base mb-2">{v.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote banner */}
            <div className="mt-8 rounded-3xl p-8 text-center"
              style={{
                background: "linear-gradient(135deg,#eff6ff 0%,#faf5ff 50%,#fff1f5 100%)",
                border: "1.5px solid #e0e7ff",
              }}>
              <div className="text-4xl mb-4">💬</div>
              <blockquote className="text-slate-800 text-lg lg:text-xl font-semibold leading-relaxed italic max-w-3xl mx-auto">
                "Digital Marketing không phải ma thuật — đó là khoa học của sự kiên nhẫn,
                đo lường và cải tiến không ngừng."
              </blockquote>
              <p className="text-slate-400 mt-4 text-sm font-medium">— Phan Đình Sơn</p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            DỊCH VỤ
        ══════════════════════════════════════ */}
        <section className="py-20" style={{ background: "#f8fafc" }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 px-3 py-1 rounded-full bg-blue-50 mb-3">
                Dịch vụ
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">Mình có thể giúp gì cho bạn?</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SERVICES.map((s) => (
                <a key={s.title} href={s.href}
                  className="group bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all text-center"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 transition-transform group-hover:scale-110"
                    style={{ background: s.bg }}>
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:transition-colors"
                    style={{ }} >{s.title}</h3>
                  <p className="text-xs mt-1.5 font-semibold" style={{ color: s.color }}>
                    Xem chi tiết →
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA — gradient sáng đẹp
        ══════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#3b82f6 0%,#8b5cf6 50%,#ec4899 100%)" }}>
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.8) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }} />

          <div className="relative max-w-2xl mx-auto px-6 text-center">
            <div className="text-5xl mb-5">🚀</div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
              Sẵn sàng tăng trưởng cùng người làm{" "}
              <span className="underline decoration-wavy decoration-white/50">có tâm</span>?
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed text-base">
              Tư vấn hoàn toàn miễn phí — 30 phút đủ để mình chỉ ra điểm cản trở tăng trưởng
              và lộ trình cụ thể cho doanh nghiệp của bạn.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a href="/#contact"
                className="px-8 py-4 font-bold rounded-full text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
                style={{ background: "white", color: "#3b82f6" }}>
                Đặt lịch tư vấn miễn phí →
              </a>
              <a href={`tel:${D.hero_phone}`}
                className="px-8 py-4 font-bold rounded-full text-sm text-white hover:bg-white/15 transition-all"
                style={{ border: "2px solid rgba(255,255,255,0.5)" }}>
                📞 {D.hero_phone}
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><span className="text-white">✓</span> Phản hồi trong 2 giờ</span>
              <span className="flex items-center gap-1.5"><span className="text-white">✓</span> Không ràng buộc</span>
              <span className="flex items-center gap-1.5"><span className="text-white">✓</span> Báo cáo minh bạch</span>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
