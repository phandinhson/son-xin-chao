// ISR: cache 1 giờ — revalidatePath("/dich-vu/audit-tu-van") được gọi khi admin lưu
export const revalidate = 3600;

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
type StatItem    = { num: string; label: string };
type PainItem    = { icon: string; problem: string; fix: string };
type PricingPkg  = { name: string; price: string; tag: string; desc: string; features: string[]; highlight: boolean };
type ProcessStep = { icon: string; title: string; desc: string; tag: string };
type FaqItem     = { q: string; a: string };
type HeroContent = {
  badge: string; headline: string; subline: string; description: string;
  feature_badges: string[]; cta_primary: string; cta_secondary: string;
};
type PageContent = {
  hero: HeroContent;
  stats: StatItem[];
  pain_points: PainItem[];
  pricing: PricingPkg[];
  process: ProcessStep[];
  faq: FaqItem[];
};

// ─── Default content (fallback khi DB chưa có data) ──────────────────────────
const DEFAULT: PageContent = {
  hero: {
    badge:          "📍 Long Thành · Nhơn Trạch · Đồng Nai · TP.HCM",
    headline:       "Audit SEO & Tư Vấn",
    subline:        "Chiến Lược Digital Marketing",
    description:    "Biết chính xác website đang yếu ở đâu, đối thủ tại Long Thành–Đồng Nai đang làm gì và cần làm gì trong 90 ngày tới để tăng trưởng. Không đoán mò — chỉ quyết định dựa trên data.",
    feature_badges: ["✅ Audit 50+ điểm kiểm tra", "✅ Phân tích 3–5 đối thủ", "✅ Lộ trình hành động cụ thể", "✅ Buổi đầu miễn phí"],
    cta_primary:    "Đặt lịch tư vấn miễn phí →",
    cta_secondary:  "Xem checklist audit",
  },
  stats: [
    { num: "50+",   label: "Điểm kiểm tra mỗi audit" },
    { num: "3–5",   label: "Đối thủ được phân tích" },
    { num: "30–50", label: "Trang báo cáo chi tiết" },
    { num: "0đ",    label: "Chi phí buổi tư vấn đầu" },
  ],
  pain_points: [
    { icon: "😤", problem: "Website không lên nổi top 10 dù đã làm SEO mấy tháng",          fix: "Tìm đúng nguyên nhân kỹ thuật hoặc content đang kéo tụt ranking" },
    { icon: "💸", problem: "Đã chi nhiều tiền cho SEO/Ads nhưng traffic không tăng",         fix: "Audit toàn diện để biết tiền đang bị lãng phí ở đâu" },
    { icon: "😕", problem: "Không biết bắt đầu từ đâu với digital marketing tại Long Thành", fix: "Lộ trình 90 ngày cụ thể, ưu tiên theo ROI, phù hợp ngân sách địa phương" },
    { icon: "👀", problem: "Đối thủ cùng khu vực Đồng Nai rank cao hơn dù website đẹp hơn", fix: "Phân tích chi tiết đối thủ địa phương để tìm ra chiến lược họ đang dùng" },
    { icon: "📉", problem: "Traffic organic giảm đột ngột sau khi Google update",            fix: "Xác định trang nào bị ảnh hưởng và kế hoạch phục hồi nhanh" },
    { icon: "🤔", problem: "Không biết từ khóa nào nên nhắm tới, cạnh tranh quá cao",       fix: "Nghiên cứu keyword gaps — cơ hội từ khóa địa phương đối thủ bỏ qua" },
  ],
  pricing: [
    {
      name: "Tư vấn nhanh", price: "Miễn phí", tag: "Bắt đầu tại đây",
      desc: "Phù hợp khi bạn muốn có góc nhìn tổng quan trước khi đầu tư",
      features: ["30–45 phút qua Zoom/call", "Đánh giá nhanh website", "Xác định 3–5 vấn đề cấp bách", "Định hướng chiến lược sơ bộ", "Không cam kết tiếp tục"],
      highlight: false,
    },
    {
      name: "Audit Cơ bản", price: "1.500.000đ", tag: "Phổ biến nhất",
      desc: "Kiểm tra kỹ thuật và on-page, báo cáo chi tiết, danh sách việc cần làm",
      features: ["Audit kỹ thuật 30 điểm", "Phân tích on-page SEO", "Kiểm tra tốc độ & Core Web Vitals", "Báo cáo PDF 20–25 trang", "1 buổi giải thích kết quả", "Danh sách ưu tiên hành động"],
      highlight: true,
    },
    {
      name: "Audit Toàn diện", price: "3.500.000đ", tag: "Chuyên sâu nhất",
      desc: "Đầy đủ 50+ điểm, phân tích đối thủ, lộ trình chi tiết 3–6 tháng",
      features: ["Audit đầy đủ 50+ điểm", "Phân tích 3–5 đối thủ trực tiếp", "Nghiên cứu keyword gaps", "Báo cáo PDF 40–50 trang", "2 buổi tư vấn (1h mỗi buổi)", "Lộ trình hành động 3–6 tháng", "Hỗ trợ Q&A 30 ngày sau audit"],
      highlight: false,
    },
  ],
  process: [
    { icon: "📞", title: "Buổi tư vấn khám phá (miễn phí)", desc: "30–45 phút. Tôi hiểu mục tiêu, tình trạng hiện tại và những thách thức bạn đang gặp tại thị trường Long Thành, Đồng Nai. Không bán hàng — chỉ lắng nghe và đưa ra đánh giá trung thực.", tag: "Ngày 1" },
    { icon: "🔍", title: "Thu thập data & Phân tích", desc: "Crawl website, phân tích GSC/Analytics, kiểm tra backlink profile, nghiên cứu đối thủ địa phương. Xử lý bằng công cụ chuyên nghiệp: Ahrefs, Screaming Frog, Google tools.", tag: "Ngày 2–5" },
    { icon: "📊", title: "Lập báo cáo chi tiết", desc: "Tổng hợp 50+ điểm kiểm tra, phân tích vấn đề theo mức độ ảnh hưởng, so sánh với 3–5 đối thủ tại Long Thành/Đồng Nai, xác định cơ hội tăng trưởng.", tag: "Ngày 5–7" },
    { icon: "🗺️", title: "Lộ trình hành động", desc: "Danh sách việc cần làm ưu tiên theo ROI, timeline cụ thể theo tuần/tháng, ước tính kết quả kỳ vọng. Bạn biết chính xác bước 1, 2, 3 cần làm.", tag: "Ngày 7" },
    { icon: "💬", title: "Buổi giải thích báo cáo", desc: "Trình bày toàn bộ báo cáo, giải thích từng vấn đề, ưu tiên cùng nhau quyết định hướng triển khai. Q&A không giới hạn trong buổi này.", tag: "Ngày 7–10" },
  ],
  faq: [
    { q: "Audit SEO là gì và tại sao doanh nghiệp Long Thành, Đồng Nai cần thiết?", a: "Audit SEO là quá trình kiểm tra toàn diện website: kỹ thuật, nội dung, backlink, trải nghiệm người dùng. Với doanh nghiệp tại Long Thành, Đồng Nai đang cạnh tranh với các đối thủ TP.HCM, audit giúp xác định chính xác điểm yếu và cơ hội từ khóa địa phương chưa ai khai thác." },
    { q: "Buổi tư vấn miễn phí gồm những gì?", a: "30–45 phút qua Zoom/call: tôi sẽ nghe về tình trạng hiện tại, mục tiêu kinh doanh và xem nhanh website của bạn. Sau đó đưa ra đánh giá sơ bộ và đề xuất hướng xử lý. Hoàn toàn không có áp lực bán hàng." },
    { q: "Báo cáo audit chi tiết đến mức nào?", a: "Báo cáo 30–50 trang: kiểm tra 50+ điểm kỹ thuật, phân tích từ khóa và content gaps, so sánh với 3–5 đối thủ cạnh tranh trực tiếp, bản đồ nhiệt hành vi người dùng (nếu có data), lộ trình 3–6 tháng cụ thể từng tuần." },
    { q: "Khác gì so với dùng công cụ audit miễn phí?", a: "Công cụ tự động chỉ liệt kê lỗi kỹ thuật. Tôi phân tích context kinh doanh: lỗi nào thực sự ảnh hưởng đến ranking tại Long Thành/Đồng Nai, đối thủ địa phương đang làm gì, cơ hội từ khóa chưa ai khai thác, và ưu tiên xử lý theo ROI." },
    { q: "Tư vấn có cam kết triển khai không?", a: "Buổi tư vấn và báo cáo audit là dịch vụ độc lập — bạn nhận được tài liệu chi tiết và hoàn toàn có thể tự triển khai hoặc giao cho đội ngũ khác. Nếu muốn tôi triển khai, sẽ có báo giá riêng sau khi đã hiểu rõ tình trạng." },
    { q: "Doanh nghiệp nhỏ ở Nhơn Trạch, Long Thành có cần audit SEO không?", a: "Đặc biệt cần! Doanh nghiệp nhỏ ở các khu vực đang phát triển như Long Thành, Nhơn Trạch có lợi thế cạnh tranh từ khóa địa phương cao hơn nhiều so với TP.HCM. Audit giúp tìm đúng cơ hội từ khóa phù hợp với ngân sách và mục tiêu của bạn." },
  ],
};

// ─── Fetch từ DB + deep-merge với default ─────────────────────────────────────
async function getPageContent(): Promise<PageContent> {
  try {
    const { data } = await supabase
      .from("service_pages")
      .select("content")
      .eq("slug", "audit-tu-van")
      .single();

    if (!data?.content || Object.keys(data.content).length === 0) return DEFAULT;

    const db = data.content as Partial<PageContent>;
    return {
      hero:        { ...DEFAULT.hero,        ...(db.hero        ?? {}) },
      stats:       db.stats        ?? DEFAULT.stats,
      pain_points: db.pain_points  ?? DEFAULT.pain_points,
      pricing:     db.pricing      ?? DEFAULT.pricing,
      process:     db.process      ?? DEFAULT.process,
      faq:         db.faq          ?? DEFAULT.faq,
    };
  } catch {
    return DEFAULT;
  }
}

// ─── Static checklist (không cần edit từ admin) ───────────────────────────────
const CHECKLIST = [
  {
    category: "⚙️ Kỹ thuật (Technical SEO)", color: "blue",
    items: ["Tốc độ tải trang (Core Web Vitals: LCP, FID, CLS)", "Mobile-friendly & Responsive", "HTTPS & Security headers", "Sitemap.xml & Robots.txt", "Cấu trúc URL (slug, canonical, redirect)", "Lỗi 404 & broken links", "Structured data / Schema markup", "Crawl errors trong Google Search Console", "Duplicate content & thin content", "Hreflang (nếu đa ngôn ngữ)"],
  },
  {
    category: "📝 Nội dung (On-page SEO)", color: "emerald",
    items: ["Title tag (độ dài, từ khóa, uniqueness)", "Meta description (CTR optimization)", "H1–H6 hierarchy", "Từ khóa chính & LSI keywords", "Độ dài & chất lượng nội dung", "Internal linking structure", "Ảnh: alt text, kích thước, format", "Content freshness & cập nhật", "E-E-A-T signals (Experience, Expertise, Authoritativeness, Trust)", "Outbound links chất lượng"],
  },
  {
    category: "🔗 Backlink & Authority", color: "violet",
    items: ["Domain Authority (DA) tổng thể", "Backlink profile quality", "Toxic backlinks cần disavow", "Anchor text distribution", "Referring domains diversity", "Competitor backlink gaps", "Local citations (SEO địa phương Long Thành, Đồng Nai)", "Brand mentions unlinked", "Social signals", "Google Business Profile optimization"],
  },
  {
    category: "📊 Hiệu suất & Phân tích", color: "orange",
    items: ["Google Analytics setup & tracking", "Conversion tracking", "Keyword rankings hiện tại", "Organic traffic trend", "CTR trong GSC", "Bounce rate & Time on page", "Funnel analysis", "Competitor traffic comparison", "Keyword gaps & opportunities", "ROI tracking setup"],
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  blue:    { bg: "bg-blue-50",    border: "border-blue-200",    badge: "bg-blue-600",    dot: "bg-blue-500" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-600", dot: "bg-emerald-500" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-200",  badge: "bg-violet-600",  dot: "bg-violet-500" },
  orange:  { bg: "bg-orange-50",  border: "border-orange-200",  badge: "bg-orange-600",  dot: "bg-orange-500" },
};

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Audit SEO & Tư Vấn Digital Marketing tại Long Thành, Đồng Nai | Sơn Xin Chào",
  description: "Dịch vụ Audit SEO toàn diện 50+ điểm kiểm tra tại Long Thành, Nhơn Trạch, Đồng Nai. Phân tích đối thủ, lộ trình digital marketing cụ thể cho doanh nghiệp vừa và nhỏ. Buổi tư vấn đầu miễn phí!",
  keywords: "audit SEO Long Thành, tư vấn SEO Đồng Nai, audit website Long Thành, phân tích website Đồng Nai, tư vấn digital marketing Long Thành, SEO audit Nhơn Trạch",
  alternates: { canonical: "https://www.sonxinchao.com/dich-vu/audit-tu-van" },
  openGraph: {
    title: "Audit SEO & Tư Vấn Digital Marketing tại Long Thành, Đồng Nai | Sơn Xin Chào",
    description: "Báo cáo audit 50+ điểm, phân tích đối thủ chi tiết, lộ trình hành động cụ thể cho doanh nghiệp Long Thành, Đồng Nai. Buổi tư vấn đầu miễn phí.",
    url: "https://www.sonxinchao.com/dich-vu/audit-tu-van",
    type: "website",
  },
};

// ─── Page (Server Component) ──────────────────────────────────────────────────
export default async function AuditTuVanPage() {
  const c = await getPageContent();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Dịch Vụ Audit SEO & Tư Vấn Chiến Lược tại Long Thành, Đồng Nai",
    provider: { "@type": "LocalBusiness", name: "Sơn Xin Chào", url: "https://www.sonxinchao.com", telephone: "0968806360", address: { "@type": "PostalAddress", addressLocality: "Long Thành", addressRegion: "Đồng Nai", addressCountry: "VN" } },
    areaServed: ["Long Thành", "Nhơn Trạch", "Đồng Nai", "TP.HCM"],
    description: "Audit SEO toàn diện 50+ điểm, phân tích đối thủ, tư vấn chiến lược digital marketing",
    offers: { "@type": "Offer", price: "0", description: "Buổi tư vấn đầu tiên miễn phí" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />

      <main className="bg-white min-h-screen text-slate-800">

        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 pt-28 pb-0 px-4 overflow-hidden" style={{ color: '#ffffff', ['--th-text' as string]: '#ffffff' }}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10 pb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                  {c.hero.badge}
                </div>
                <h1 className="font-extrabold leading-tight mb-5">
                  <div className="text-4xl md:text-5xl mb-2">
                    <span className="text-blue-300">{c.hero.headline}</span>
                  </div>
                  <div className="text-xl md:text-2xl font-semibold" style={{ color: 'rgba(203,213,225,1)' }}>
                    {c.hero.subline}
                  </div>
                </h1>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(226,232,240,1)' }}>
                  {c.hero.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-10 text-sm justify-center md:justify-start">
                  {c.hero.feature_badges.map((b, i) => (
                    <span key={i} className="bg-white/15 border border-white/25 px-3 py-1.5 rounded-full">{b}</span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <a href="/contact" className="px-8 py-3.5 bg-blue-400 hover:bg-blue-300 text-slate-900 font-bold rounded-full text-base transition-all hover:scale-105 shadow-lg">
                    {c.hero.cta_primary}
                  </a>
                  <a href="#checklist" className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 font-semibold rounded-full text-base transition-all">
                    {c.hero.cta_secondary}
                  </a>
                </div>
              </div>

              {/* Mock audit report card */}
              <div className="hidden md:block">
                <div className="relative bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                  <div className="text-xs font-mono mb-4 flex items-center gap-2" style={{ color: 'rgba(147,197,253,1)' }}>
                    <span className="w-2.5 h-2.5 bg-red-400 rounded-full inline-block" />
                    <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full inline-block" />
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full inline-block" />
                    <span className="ml-2 opacity-70">audit-report.pdf</span>
                  </div>
                  {[
                    { label: "Core Web Vitals",  score: 92, color: "bg-green-400" },
                    { label: "On-page SEO",      score: 78, color: "bg-yellow-400" },
                    { label: "Backlink Profile", score: 45, color: "bg-red-400" },
                    { label: "Local SEO",        score: 61, color: "bg-orange-400" },
                    { label: "Content Quality",  score: 83, color: "bg-green-400" },
                  ].map(item => (
                    <div key={item.label} className="mb-3">
                      <div className="flex justify-between text-xs mb-1" style={{ color: 'rgba(226,232,240,1)' }}>
                        <span>{item.label}</span>
                        <span className="font-bold">{item.score}/100</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="mt-5 pt-4 border-t border-white/20 text-center">
                    <span className="text-xs" style={{ color: 'rgba(148,163,184,1)' }}>📊 Báo cáo mẫu — Sơn Xin Chào</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-16 overflow-hidden">
            <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none">
              <path d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-12 px-4 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {c.stats.map((s, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-extrabold text-blue-600">{s.num}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Khi Nào Cần Audit SEO? ── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-4">⏰ THỜI ĐIỂM VÀNG</div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Khi Nào Doanh Nghiệp Cần Audit SEO?</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">Audit SEO nên thực hiện định kỳ mỗi 6 tháng và ngay khi xuất hiện các dấu hiệu sau — đặc biệt với doanh nghiệp tại Long Thành, Đồng Nai đang trong giai đoạn tăng trưởng.</p>
                <div className="space-y-4">
                  {[
                    { icon: "📉", title: "Traffic giảm không rõ nguyên nhân",   desc: "Website mất traffic sau Google update hoặc giảm dần mà không biết tại sao" },
                    { icon: "🚫", title: "SEO mãi không lên top",               desc: "Đã làm SEO 3–6 tháng, chi nhiều tiền nhưng thứ hạng không cải thiện" },
                    { icon: "🔄", title: "Sắp redesign hoặc chuyển domain",     desc: "Audit trước khi làm lại website tránh mất toàn bộ thứ hạng hiện có" },
                    { icon: "😤", title: "Đối thủ vượt mặt bất ngờ",           desc: "Đối thủ cùng khu vực Long Thành/Đồng Nai đột nhiên rank cao hơn bạn" },
                    { icon: "🤝", title: "Vừa thay đổi agency SEO",            desc: "Agency cũ không báo cáo minh bạch, cần kiểm tra tình trạng thực tế" },
                    { icon: "📅", title: "Theo chu kỳ định kỳ 6 tháng",        desc: "SEO liên tục thay đổi — audit định kỳ để luôn đi đúng hướng" },
                  ].map(item => (
                    <div key={item.icon} className="flex gap-4 items-start">
                      <span className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl border border-blue-100">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-3">Dấu hiệu cần audit ngay</h3>
                  <div className="space-y-3 text-left">
                    {["Traffic giảm >20% trong 1 tháng", "Hơn 3 tháng không cải thiện ranking", "Tỷ lệ bounce rate >80%", "Google Core Update vừa diễn ra", "Chuẩn bị chạy Google Ads"].map(sign => (
                      <div key={sign} className="flex items-center gap-3 text-sm text-slate-700">
                        <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">!</span>
                        {sign}
                      </div>
                    ))}
                  </div>
                  <a href="/contact" className="mt-6 inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full text-sm transition-all">
                    Kiểm tra miễn phí ngay →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Ai Cần Audit SEO? ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full mb-4">🎯 ĐỐI TƯỢNG PHÙ HỢP</div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Ai Cần Dịch Vụ Audit SEO?</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Dù bạn là doanh nghiệp vừa bắt đầu hay đã làm SEO lâu năm — audit cho bạn biết chính xác đang đứng ở đâu</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "🏪", title: "Doanh nghiệp vừa & nhỏ", subtitle: "SME tại Long Thành, Nhơn Trạch, Đồng Nai", desc: "Muốn có chiến lược digital rõ ràng nhưng ngân sách có hạn. Audit giúp ưu tiên đúng hành động, không lãng phí tiền vào những việc không quan trọng.", tags: ["Cửa hàng địa phương", "Công ty vừa", "Startup"], color: "border-blue-200 bg-blue-50", badge: "bg-blue-100 text-blue-700" },
                { icon: "🛠️", title: "Doanh nghiệp tự làm SEO", subtitle: "Đã tự học và tự triển khai", desc: "Tự làm SEO nhưng không chắc có đúng hướng không. Audit như bài kiểm tra — xác nhận điểm đúng, phát hiện điểm sai cần sửa ngay.", tags: ["Tự học SEO", "Dùng plugin", "Viết blog"], color: "border-emerald-200 bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
                { icon: "😤", title: "Không hài lòng agency cũ", subtitle: "Đã dùng dịch vụ SEO nhưng không hiệu quả", desc: "Agency báo cáo đẹp nhưng kết quả thực tế mờ nhạt. Audit độc lập để biết thực trạng và quyết định bước tiếp theo một cách sáng suốt.", tags: ["Đổi agency", "Kiểm tra kết quả", "Audit độc lập"], color: "border-orange-200 bg-orange-50", badge: "bg-orange-100 text-orange-700" },
              ].map(card => (
                <div key={card.icon} className={`rounded-2xl border-2 p-6 ${card.color}`}>
                  <div className="text-4xl mb-4">{card.icon}</div>
                  <h3 className="font-extrabold text-slate-800 mb-1">{card.title}</h3>
                  <p className="text-xs text-slate-500 mb-3 font-medium">{card.subtitle}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{card.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map(tag => <span key={tag} className={`text-xs px-2.5 py-1 rounded-full font-medium ${card.badge}`}>{tag}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lợi Ích ── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-4">✨ GIÁ TRỊ BẠN NHẬN ĐƯỢC</div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-3">5 Lợi Ích Khi Audit SEO Chuyên Nghiệp</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Không chỉ tìm lỗi — audit còn mở ra cơ hội tăng trưởng chưa khai thác</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🎯", title: "Xác định đúng vấn đề cốt lõi", desc: "Thay vì đoán mò, bạn biết chính xác lỗi nào đang kéo tụt ranking và cần ưu tiên xử lý đầu tiên.", cls: "bg-blue-50 border-blue-100" },
                { icon: "📈", title: "Cải thiện chất lượng nội dung", desc: "Phát hiện content gaps — chủ đề đối thủ đang rank nhưng bạn chưa có. Cơ hội vàng để vượt trội đối thủ địa phương.", cls: "bg-emerald-50 border-emerald-100" },
                { icon: "🔧", title: "Phát hiện & sửa lỗi kỹ thuật", desc: "Core Web Vitals, tốc độ mobile, lỗi crawl... những vấn đề kỹ thuật ẩn đang ngăn Google index đúng cách.", cls: "bg-violet-50 border-violet-100" },
                { icon: "😊", title: "Cải thiện trải nghiệm người dùng", desc: "UX tốt = bounce rate thấp = Google đánh giá cao hơn. Audit UX giúp tìm điểm khiến người dùng rời trang sớm.", cls: "bg-orange-50 border-orange-100" },
                { icon: "💰", title: "Tăng tỷ lệ chuyển đổi (CVR)", desc: "Traffic nhiều mà không có khách hàng là lãng phí. Audit chuyển đổi tìm điểm thắt cổ chai trong hành trình mua hàng.", cls: "bg-pink-50 border-pink-100" },
                { icon: "🗺️", title: "Lộ trình hành động cụ thể", desc: "Không phải danh sách lỗi vô tận — bạn nhận bản đồ chi tiết: việc gì làm trước, việc gì làm sau, kỳ vọng kết quả mỗi giai đoạn.", cls: "bg-amber-50 border-amber-100" },
              ].map(b => (
                <div key={b.icon} className={`rounded-2xl border p-6 ${b.cls} hover:shadow-md transition-all`}>
                  <div className="text-3xl mb-3">{b.icon}</div>
                  <h3 className="font-bold text-slate-800 mb-2">{b.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pain Points (từ DB) ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">Bạn Đang Gặp Những Vấn Đề Này?</h2>
            <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">Audit SEO sẽ cho bạn biết chính xác nguyên nhân và cách giải quyết</p>
            <div className="grid md:grid-cols-2 gap-4">
              {c.pain_points.map((p, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <span className="text-3xl flex-shrink-0">{p.icon}</span>
                  <div>
                    <p className="text-slate-700 font-semibold text-sm mb-1.5">"{p.problem}"</p>
                    <p className="text-emerald-700 text-xs bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">✅ {p.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Checklist (static) ── */}
        <section className="py-16 px-4 bg-white" id="checklist">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4">📋 DANH MỤC KIỂM TRA</div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Checklist Audit 50+ Điểm</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Kiểm tra toàn diện 4 nhóm yếu tố — từ kỹ thuật đến phân tích hiệu suất</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {CHECKLIST.map(group => {
                const c2 = COLOR_MAP[group.color];
                return (
                  <div key={group.category} className={`rounded-xl border ${c2.border} ${c2.bg} overflow-hidden shadow-sm`}>
                    <div className={`${c2.badge} text-white px-5 py-3`}>
                      <h3 className="font-bold text-sm">{group.category}</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {group.items.map(item => (
                        <div key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${c2.dot} mt-1.5`} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── So sánh ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Tại Sao Không Tự Dùng Công Cụ Miễn Phí?</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">So sánh thực tế giữa 3 lựa chọn để bạn đưa ra quyết định đúng</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full bg-white min-w-[560px]">
                <thead>
                  <tr className="bg-slate-800 rounded-t-2xl" style={{ color: '#ffffff' }}>
                    <th className="text-left p-4 text-sm font-bold">Tiêu chí</th>
                    <th className="text-center p-4 text-sm font-bold">Tự dùng tool miễn phí</th>
                    <th className="text-center p-4 text-sm font-bold">Agency lớn</th>
                    <th className="text-center p-4 text-sm font-bold bg-blue-600">Sơn Xin Chào</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Chi phí",                      a: "0đ",                 b: "10–30 triệu",          c: "0đ – 3.5 triệu",       hl: true },
                    { label: "Phân tích đối thủ địa phương", a: "❌ Không",           b: "⚠️ Chung chung",       c: "✅ Long Thành/Đồng Nai", hl: false },
                    { label: "Ngữ cảnh kinh doanh",          a: "❌ Không có",        b: "⚠️ Quy trình cố định", c: "✅ Cá nhân hóa",        hl: true },
                    { label: "Lộ trình hành động",           a: "❌ Chỉ liệt kê lỗi",b: "✅ Có",                 c: "✅ Chi tiết theo tuần",  hl: false },
                    { label: "Thời gian nhận kết quả",       a: "Ngay lập tức",       b: "2–4 tuần",             c: "7–10 ngày",             hl: true },
                    { label: "Hỗ trợ sau audit",             a: "❌ Không",           b: "⚠️ Thêm phí",          c: "✅ Q&A 30 ngày",        hl: false },
                  ].map(row => (
                    <tr key={row.label} className={row.hl ? "bg-slate-50" : "bg-white"}>
                      <td className="p-4 text-sm font-semibold text-slate-700 border-t border-gray-100">{row.label}</td>
                      <td className="p-4 text-sm text-center text-slate-500 border-t border-gray-100">{row.a}</td>
                      <td className="p-4 text-sm text-center text-slate-500 border-t border-gray-100">{row.b}</td>
                      <td className="p-4 text-sm text-center font-semibold text-blue-700 border-t border-gray-100 bg-blue-50">{row.c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Pricing (từ DB) ── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Các Gói Dịch Vụ</h2>
              <p className="text-slate-500">Linh hoạt theo nhu cầu và ngân sách của bạn</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {c.pricing.map((pkg, i) => (
                <div key={i} className={`rounded-2xl border-2 p-6 flex flex-col transition-all ${pkg.highlight ? "border-blue-400 bg-blue-600 shadow-xl scale-[1.02]" : "border-gray-200 bg-white shadow-sm"}`}
                  style={pkg.highlight ? { color: '#ffffff', ['--th-text' as string]: '#ffffff' } : {}}>
                  {pkg.highlight
                    ? <div className="text-center mb-3"><span className="px-3 py-1 bg-yellow-400 text-blue-900 text-xs font-bold rounded-full">{pkg.tag}</span></div>
                    : <div className="text-xs font-semibold text-slate-400 mb-2">{pkg.tag}</div>
                  }
                  <h3 className={`text-lg font-extrabold mb-1 ${pkg.highlight ? "text-white" : "text-slate-800"}`}>{pkg.name}</h3>
                  <div className={`text-3xl font-extrabold mb-2 ${pkg.highlight ? "text-yellow-300" : "text-blue-600"}`}>{pkg.price}</div>
                  <p className={`text-sm mb-5 leading-relaxed ${pkg.highlight ? "text-blue-100" : "text-slate-500"}`}>{pkg.desc}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {pkg.features.map((f, fi) => (
                      <li key={fi} className={`flex items-start gap-2 text-sm ${pkg.highlight ? "text-blue-50" : "text-slate-600"}`}>
                        <span className={`flex-shrink-0 mt-0.5 ${pkg.highlight ? "text-yellow-300" : "text-emerald-500"}`}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/contact" className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${pkg.highlight ? "bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold" : "bg-slate-800 hover:bg-slate-700 text-white"}`}>
                    {pkg.price === "Miễn phí" ? "Đặt lịch ngay →" : "Đặt mua →"}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process (từ DB) ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4">🗂️ QUY TRÌNH LÀM VIỆC</div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Quy Trình {c.process.length} Bước Rõ Ràng</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Minh bạch — bạn biết chính xác mình nhận được gì ở mỗi bước</p>
            </div>
            <div className="space-y-6">
              {c.process.map((step, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-extrabold text-lg shadow-md" style={{ color: '#ffffff' }}>
                    {step.icon}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{step.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">{step.tag}</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Khu vực phục vụ ── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-4">📍 KHU VỰC PHỤC VỤ</div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Chuyên Gia Audit SEO Địa Phương Tại Đồng Nai</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Hiểu rõ thị trường địa phương — lợi thế mà các agency TP.HCM không có</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                {[
                  { area: "Long Thành, Đồng Nai", flag: true,  desc: "Khu vực trọng điểm với sân bay quốc tế Long Thành đang phát triển — cơ hội SEO địa phương cực kỳ lớn trong giai đoạn 2024–2030." },
                  { area: "Nhơn Trạch, Đồng Nai",  flag: true,  desc: "Khu công nghiệp phát triển nhanh — nhu cầu dịch vụ địa phương tăng mạnh, từ khóa cạnh tranh còn thấp." },
                  { area: "Biên Hòa & các huyện Đồng Nai", flag: false, desc: "Trung tâm kinh tế Đồng Nai với lượng doanh nghiệp lớn cần SEO để cạnh tranh với TP.HCM." },
                  { area: "TP.HCM & toàn quốc",   flag: false, desc: "Tư vấn online qua Zoom/Google Meet — phục vụ doanh nghiệp trên toàn quốc." },
                ].map(area => (
                  <div key={area.area} className={`flex gap-4 p-4 rounded-xl border transition-all ${area.flag ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
                    <span className="text-xl flex-shrink-0">{area.flag ? "📍" : "🌐"}</span>
                    <div>
                      <p className={`font-bold text-sm ${area.flag ? "text-blue-800" : "text-slate-700"}`}>{area.area}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{area.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-6 shadow-xl" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', ['--th-text' as string]: '#ffffff' }}>
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-extrabold mb-3">Lợi thế khi chọn chuyên gia địa phương</h3>
                <ul className="space-y-3">
                  {["Hiểu đặc điểm tìm kiếm của người dùng Đồng Nai", "Biết đối thủ địa phương nào đang rank tốt và tại sao", "Tối ưu Google Business Profile đúng khu vực", "Tư vấn từ khóa tiếng Việt địa phương chính xác", "Gặp trực tiếp hoặc trao đổi linh hoạt"].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(191,219,254,1)' }}>
                      <span className="text-yellow-300 flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="/contact" className="mt-6 block text-center py-3 bg-white text-blue-700 font-bold rounded-xl text-sm hover:bg-blue-50 transition-all">
                  Tư vấn miễn phí ngay →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ (từ DB) ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">Câu Hỏi Thường Gặp</h2>
            <div className="space-y-4">
              {c.faq.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="flex gap-3 p-5">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center justify-center mt-0.5">Q</span>
                    <div>
                      <p className="font-semibold text-slate-800 mb-2">{f.q}</p>
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center justify-center mt-0.5">A</span>
                        <p className="text-slate-500 text-sm leading-relaxed">{f.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a,#1e3a5f)', color: '#ffffff', ['--th-text' as string]: '#ffffff' }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 50%, #8b5cf6 0%, transparent 50%)" }} />
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="text-5xl mb-5">🎯</div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Biết Chính Xác Cần Làm Gì Tiếp Theo</h2>
            <p className="text-lg mb-2" style={{ color: 'rgba(203,213,225,1)' }}>
              Buổi tư vấn đầu tiên hoàn toàn miễn phí. Chỉ mất 30 phút — bạn sẽ có cái nhìn rõ ràng về tình trạng hiện tại.
            </p>
            <p className="text-sm mb-4" style={{ color: 'rgba(148,163,184,1)' }}>📍 Phục vụ trực tiếp tại Long Thành, Nhơn Trạch, Đồng Nai — Online toàn quốc</p>
            <p className="text-sm mb-8" style={{ color: 'rgba(148,163,184,1)' }}>Không cam kết · Không bán hàng áp lực · Chỉ tư vấn thực chất</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/contact" className="px-8 py-4 bg-blue-400 hover:bg-blue-300 text-slate-900 font-bold rounded-full text-lg transition-all hover:scale-105 shadow-xl">
                Đặt lịch tư vấn miễn phí →
              </a>
              <a href="tel:0968806360" className="px-8 py-4 border font-semibold rounded-full text-lg transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)' }}>
                📞 0968 806 360
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <MobileBar />
    </>
  );
}
