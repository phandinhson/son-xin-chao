import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

export const metadata: Metadata = {
  title: "Dịch Vụ Audit SEO & Tư Vấn Chiến Lược Digital Marketing | Sơn Xin Chào",
  description:
    "Audit SEO toàn diện 50+ điểm kiểm tra, phân tích đối thủ, lộ trình digital marketing cụ thể cho doanh nghiệp tại Long Thành, Đồng Nai và toàn quốc. Tư vấn miễn phí đầu tiên!",
  keywords:
    "audit SEO, tư vấn SEO, phân tích website, tư vấn digital marketing, audit website Long Thành, chiến lược marketing Đồng Nai, tư vấn marketing online",
  openGraph: {
    title: "Audit SEO & Tư Vấn Chiến Lược Digital Marketing | Sơn Xin Chào",
    description: "Báo cáo audit 50+ điểm, phân tích đối thủ chi tiết, lộ trình hành động cụ thể. Buổi tư vấn đầu miễn phí.",
    url: "https://www.sonxinchao.com/dich-vu/audit-tu-van",
    type: "website",
  },
};

const faqs = [
  { q: "Audit SEO là gì và tại sao cần thiết?", a: "Audit SEO là quá trình kiểm tra toàn diện website: kỹ thuật, nội dung, backlink, trải nghiệm người dùng. Giúp xác định chính xác vì sao website không lên top và cần làm gì để cải thiện. Như khám bệnh trước khi kê toa — không audit thì SEO mù quáng." },
  { q: "Buổi tư vấn miễn phí gồm những gì?", a: "30–45 phút qua Zoom/call: tôi sẽ nghe về tình trạng hiện tại, mục tiêu kinh doanh và xem nhanh website của bạn. Sau đó đưa ra đánh giá sơ bộ và đề xuất hướng xử lý. Hoàn toàn không có áp lực bán hàng." },
  { q: "Báo cáo audit chi tiết đến mức nào?", a: "Báo cáo 30–50 trang: kiểm tra 50+ điểm kỹ thuật, phân tích từ khóa và content gaps, so sánh với 3–5 đối thủ cạnh tranh trực tiếp, bản đồ nhiệt hành vi người dùng (nếu có data), lộ trình 3–6 tháng cụ thể từng tuần." },
  { q: "Khác gì so với dùng công cụ audit miễn phí?", a: "Công cụ tự động chỉ liệt kê lỗi kỹ thuật. Tôi phân tích context kinh doanh: lỗi nào thực sự ảnh hưởng đến ranking, đối thủ đang làm gì, cơ hội từ khóa chưa ai khai thác, và ưu tiên xử lý theo ROI." },
  { q: "Tư vấn có cam kết triển khai không?", a: "Buổi tư vấn và báo cáo audit là dịch vụ độc lập — bạn nhận được tài liệu chi tiết và hoàn toàn có thể tự triển khai hoặc giao cho đội ngũ khác. Nếu muốn tôi triển khai, sẽ có báo giá riêng sau khi đã hiểu rõ tình trạng." },
];

const auditChecklist = [
  {
    category: "⚙️ Kỹ thuật (Technical SEO)",
    color: "blue",
    items: ["Tốc độ tải trang (Core Web Vitals: LCP, FID, CLS)", "Mobile-friendly & Responsive", "HTTPS & Security headers", "Sitemap.xml & Robots.txt", "Cấu trúc URL (slug, canonical, redirect)", "Lỗi 404 & broken links", "Structured data / Schema markup", "Crawl errors trong Google Search Console", "Duplicate content & thin content", "Hreflang (nếu đa ngôn ngữ)"]
  },
  {
    category: "📝 Nội dung (On-page SEO)",
    color: "emerald",
    items: ["Title tag (độ dài, từ khóa, uniqueness)", "Meta description (CTR optimization)", "H1–H6 hierarchy", "Từ khóa chính & LSI keywords", "Độ dài & chất lượng nội dung", "Internal linking structure", "Ảnh: alt text, kích thước, format", "Content freshness & cập nhật", "E-E-A-T signals (Experience, Expertise, Authoritativeness, Trust)", "Outbound links chất lượng"]
  },
  {
    category: "🔗 Backlink & Authority",
    color: "violet",
    items: ["Domain Authority (DA) tổng thể", "Backlink profile quality", "Toxic backlinks cần disavow", "Anchor text distribution", "Referring domains diversity", "Competitor backlink gaps", "Local citations (SEO địa phương)", "Brand mentions unlinked", "Social signals", "Google Business Profile optimization"]
  },
  {
    category: "📊 Hiệu suất & Phân tích",
    color: "orange",
    items: ["Google Analytics setup & tracking", "Conversion tracking", "Keyword rankings hiện tại", "Organic traffic trend", "CTR trong GSC", "Bounce rate & Time on page", "Funnel analysis", "Competitor traffic comparison", "Keyword gaps & opportunities", "ROI tracking setup"]
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  blue:    { bg: "bg-blue-50",    border: "border-blue-200",    badge: "bg-blue-600",    dot: "bg-blue-500" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-600", dot: "bg-emerald-500" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-200",  badge: "bg-violet-600",  dot: "bg-violet-500" },
  orange:  { bg: "bg-orange-50",  border: "border-orange-200",  badge: "bg-orange-600",  dot: "bg-orange-500" },
};

export default function AuditTuVanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Dịch Vụ Audit SEO & Tư Vấn Chiến Lược",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Sơn Xin Chào",
          "url": "https://www.sonxinchao.com",
          "telephone": "0968806360",
          "address": { "@type": "PostalAddress", "addressLocality": "Long Thành", "addressRegion": "Đồng Nai", "addressCountry": "VN" }
        },
        "description": "Audit SEO toàn diện 50+ điểm, phân tích đối thủ, tư vấn chiến lược digital marketing",
        "offers": { "@type": "Offer", "price": "0", "description": "Buổi tư vấn đầu tiên miễn phí" }
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
      })}} />

      <Navbar />

      <main className="bg-white min-h-screen">

        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 text-white pt-28 pb-0 px-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10 pb-20">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              🎯 Audit chuyên sâu — Tư vấn thực chiến
            </div>
            <h1 className="font-extrabold leading-tight mb-5">
              <div className="text-4xl md:text-5xl mb-2">
                <span className="text-blue-300">Audit SEO</span> & Tư Vấn
              </div>
              <div className="text-xl md:text-2xl text-slate-300 font-semibold">
                Chiến Lược Digital Marketing
              </div>
            </h1>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto mb-8 leading-relaxed">
              Biết chính xác website đang yếu ở đâu, đối thủ đang làm gì và cần làm gì trong 90 ngày tới để tăng trưởng. Không đoán mò — chỉ quyết định dựa trên data.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10 text-sm">
              {["✅ Audit 50+ điểm kiểm tra", "✅ Phân tích 3–5 đối thủ", "✅ Lộ trình hành động cụ thể", "✅ Buổi đầu miễn phí"].map(b => (
                <span key={b} className="bg-white/15 border border-white/25 px-3 py-1.5 rounded-full">{b}</span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/#contact" className="px-8 py-3.5 bg-blue-400 hover:bg-blue-300 text-slate-900 font-bold rounded-full text-base transition-all hover:scale-105 shadow-lg">
                Đặt lịch tư vấn miễn phí →
              </a>
              <a href="#checklist" className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full text-base transition-all">
                Xem checklist audit
              </a>
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
            {[
              { num: "50+", label: "Điểm kiểm tra mỗi audit" },
              { num: "3–5", label: "Đối thủ được phân tích" },
              { num: "30–50", label: "Trang báo cáo chi tiết" },
              { num: "0đ", label: "Chi phí buổi tư vấn đầu" },
            ].map(s => (
              <div key={s.num}>
                <div className="text-2xl md:text-3xl font-extrabold text-blue-600">{s.num}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Vấn đề mà audit giải quyết ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">Bạn Đang Gặp Những Vấn Đề Này?</h2>
            <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">Audit SEO sẽ cho bạn biết chính xác nguyên nhân và cách giải quyết</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: "😤", problem: "Website không lên nổi top 10 dù đã làm SEO mấy tháng", fix: "Tìm đúng nguyên nhân kỹ thuật hoặc content đang kéo tụt ranking" },
                { icon: "💸", problem: "Đã chi nhiều tiền cho SEO/Ads nhưng traffic không tăng", fix: "Audit toàn diện để biết tiền đang bị lãng phí ở đâu" },
                { icon: "😕", problem: "Không biết bắt đầu từ đâu với digital marketing", fix: "Lộ trình 90 ngày cụ thể, ưu tiên theo ROI, phù hợp ngân sách" },
                { icon: "👀", problem: "Đối thủ đang rank cao hơn mặc dù website mình đẹp hơn", fix: "Phân tích chi tiết đối thủ để tìm ra chiến lược họ đang dùng" },
                { icon: "📉", problem: "Traffic organic giảm đột ngột sau khi Google update", fix: "Xác định trang nào bị ảnh hưởng và kế hoạch phục hồi nhanh" },
                { icon: "🤔", problem: "Không biết từ khóa nào nên nhắm tới, cạnh tranh quá cao", fix: "Nghiên cứu keyword gaps — cơ hội từ khóa đối thủ bỏ qua" },
              ].map(p => (
                <div key={p.icon} className="flex gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <span className="text-3xl flex-shrink-0">{p.icon}</span>
                  <div>
                    <p className="text-slate-700 font-semibold text-sm mb-1.5">"{p.problem}"</p>
                    <p className="text-emerald-700 text-xs bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                      ✅ {p.fix}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Audit Checklist ── */}
        <section className="py-16 px-4" id="checklist">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">Checklist Audit 50+ Điểm</h2>
            <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">
              Kiểm tra toàn diện 4 nhóm yếu tố — từ kỹ thuật đến phân tích hiệu suất
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {auditChecklist.map(group => {
                const c = colorMap[group.color];
                return (
                  <div key={group.category} className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden`}>
                    <div className={`${c.badge} text-white px-5 py-3`}>
                      <h3 className="font-bold text-sm">{group.category}</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {group.items.map(item => (
                        <div key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${c.dot} mt-1.5`} />
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

        {/* ── Gói tư vấn ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">Các Gói Dịch Vụ</h2>
            <p className="text-slate-500 text-center mb-10">Linh hoạt theo nhu cầu và ngân sách của bạn</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Tư vấn nhanh",
                  price: "Miễn phí",
                  tag: "Bắt đầu tại đây",
                  desc: "Phù hợp khi bạn muốn có góc nhìn tổng quan trước khi đầu tư",
                  features: [
                    "30–45 phút qua Zoom/call",
                    "Đánh giá nhanh website",
                    "Xác định 3–5 vấn đề cấp bách",
                    "Định hướng chiến lược sơ bộ",
                    "Không cam kết tiếp tục",
                  ],
                  color: "border-gray-200 bg-white",
                  btn: "bg-slate-800 hover:bg-slate-700 text-white",
                  highlight: false,
                },
                {
                  name: "Audit Cơ bản",
                  price: "1.500.000đ",
                  tag: "Phổ biến nhất",
                  desc: "Kiểm tra kỹ thuật và on-page, báo cáo chi tiết, danh sách việc cần làm",
                  features: [
                    "Audit kỹ thuật 30 điểm",
                    "Phân tích on-page SEO",
                    "Kiểm tra tốc độ & Core Web Vitals",
                    "Báo cáo PDF 20–25 trang",
                    "1 buổi giải thích kết quả",
                    "Danh sách ưu tiên hành động",
                  ],
                  color: "border-blue-400 bg-blue-600 text-white",
                  btn: "bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold",
                  highlight: true,
                },
                {
                  name: "Audit Toàn diện",
                  price: "3.500.000đ",
                  tag: "Chuyên sâu nhất",
                  desc: "Đầy đủ 50+ điểm, phân tích đối thủ, lộ trình chi tiết 3–6 tháng",
                  features: [
                    "Audit đầy đủ 50+ điểm",
                    "Phân tích 3–5 đối thủ trực tiếp",
                    "Nghiên cứu keyword gaps",
                    "Báo cáo PDF 40–50 trang",
                    "2 buổi tư vấn (1h mỗi buổi)",
                    "Lộ trình hành động 3–6 tháng",
                    "Hỗ trợ Q&A 30 ngày sau audit",
                  ],
                  color: "border-gray-200 bg-white",
                  btn: "bg-slate-800 hover:bg-slate-700 text-white",
                  highlight: false,
                },
              ].map(pkg => (
                <div key={pkg.name} className={`rounded-2xl border-2 p-6 flex flex-col ${pkg.color} ${pkg.highlight ? "shadow-xl scale-[1.02]" : "shadow-sm"} transition-all`}>
                  {pkg.highlight && (
                    <div className="text-center mb-3">
                      <span className="px-3 py-1 bg-yellow-400 text-blue-900 text-xs font-bold rounded-full">{pkg.tag}</span>
                    </div>
                  )}
                  {!pkg.highlight && (
                    <div className="text-xs font-semibold text-gray-400 mb-2">{pkg.tag}</div>
                  )}
                  <h3 className={`text-lg font-extrabold mb-1 ${pkg.highlight ? "text-white" : "text-slate-800"}`}>{pkg.name}</h3>
                  <div className={`text-3xl font-extrabold mb-2 ${pkg.highlight ? "text-yellow-300" : "text-blue-600"}`}>{pkg.price}</div>
                  <p className={`text-sm mb-5 leading-relaxed ${pkg.highlight ? "text-blue-100" : "text-slate-500"}`}>{pkg.desc}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {pkg.features.map(f => (
                      <li key={f} className={`flex items-start gap-2 text-sm ${pkg.highlight ? "text-blue-50" : "text-slate-600"}`}>
                        <span className={`flex-shrink-0 mt-0.5 ${pkg.highlight ? "text-yellow-300" : "text-emerald-500"}`}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/#contact" className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${pkg.btn}`}>
                    {pkg.price === "Miễn phí" ? "Đặt lịch ngay →" : "Đặt mua →"}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quy trình tư vấn ── */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">Quy Trình Làm Việc</h2>
            <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">Rõ ràng, minh bạch — bạn biết chính xác mình nhận được gì ở mỗi bước</p>
            <div className="space-y-6">
              {[
                { step: "01", icon: "📞", title: "Buổi tư vấn khám phá (miễn phí)", desc: "30–45 phút. Tôi hiểu mục tiêu, tình trạng hiện tại và những thách thức bạn đang gặp. Không bán hàng — chỉ lắng nghe và đưa ra đánh giá trung thực.", tag: "Ngày 1" },
                { step: "02", icon: "🔍", title: "Thu thập data & Phân tích", desc: "Crawl website, phân tích GSC/Analytics, kiểm tra backlink profile, nghiên cứu đối thủ. Tất cả được xử lý bằng công cụ chuyên nghiệp: Ahrefs, Screaming Frog, Google tools.", tag: "Ngày 2–5" },
                { step: "03", icon: "📊", title: "Lập báo cáo chi tiết", desc: "Tổng hợp 50+ điểm kiểm tra, phân tích vấn đề theo mức độ ảnh hưởng (cao/trung/thấp), so sánh với đối thủ, xác định cơ hội tăng trưởng.", tag: "Ngày 5–7" },
                { step: "04", icon: "🗺️", title: "Lộ trình hành động", desc: "Danh sách việc cần làm ưu tiên theo ROI, timeline cụ thể theo tuần/tháng, ước tính kết quả kỳ vọng. Bạn biết chính xác bước 1, 2, 3 cần làm.", tag: "Ngày 7" },
                { step: "05", icon: "💬", title: "Buổi giải thích báo cáo", desc: "Trình bày toàn bộ báo cáo, giải thích từng vấn đề, ưu tiên cùng nhau quyết định hướng triển khai. Q&A không giới hạn trong buổi này.", tag: "Ngày 7–10" },
              ].map(p => (
                <div key={p.step} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-extrabold text-lg">
                    {p.icon}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{p.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">{p.tag}</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">Câu Hỏi Thường Gặp</h2>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
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
        <section className="py-20 px-4 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 50%, #8b5cf6 0%, transparent 50%)" }} />
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="text-5xl mb-5">🎯</div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Biết Chính Xác Cần Làm Gì Tiếp Theo</h2>
            <p className="text-slate-300 text-lg mb-4">
              Buổi tư vấn đầu tiên hoàn toàn miễn phí. Chỉ mất 30 phút — bạn sẽ có cái nhìn rõ ràng hơn về tình trạng hiện tại.
            </p>
            <p className="text-slate-400 text-sm mb-8">Không cam kết · Không bán hàng áp lực · Chỉ tư vấn thực chất</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/#contact" className="px-8 py-4 bg-blue-400 hover:bg-blue-300 text-slate-900 font-bold rounded-full text-lg transition-all hover:scale-105 shadow-xl">
                Đặt lịch tư vấn miễn phí →
              </a>
              <a href="tel:0968806360" className="px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full text-lg transition-all">
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
