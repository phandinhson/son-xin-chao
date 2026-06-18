import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

export const metadata: Metadata = {
  title: "Dịch Vụ SEO TP.HCM — Lên Top Google Bền Vững | Sơn Xin Chào",
  description:
    "Dịch vụ SEO tại TP.HCM chuyên nghiệp, chi phí hợp lý. Tối ưu SEO on-page, technical, backlink và content cho doanh nghiệp vừa và nhỏ tại TP. Hồ Chí Minh. Tư vấn miễn phí ngay hôm nay!",
  keywords:
    "dịch vụ SEO TP HCM, dịch vụ SEO Hồ Chí Minh, SEO website TP HCM, công ty SEO HCM, SEO tổng thể HCM, SEO Thủ Đức, SEO Quận 7, SEO Bình Thạnh, SEO Gò Vấp, SEO Tân Phú, dịch vụ SEO giá rẻ HCM, SEO cho doanh nghiệp nhỏ HCM",
  alternates: {
    canonical: "https://www.sonxinchao.com/dich-vu/seo-hcm",
  },
  openGraph: {
    title: "Dịch Vụ SEO TP.HCM — Lên Top Google Bền Vững | Sơn Xin Chào",
    description:
      "SEO tại TP.HCM chi phí hợp lý — cá nhân hóa 1-1, không agency lớn cồng kềnh. Tăng 200–400% traffic organic sau 6 tháng. Tư vấn miễn phí!",
    url: "https://www.sonxinchao.com/dich-vu/seo-hcm",
    type: "website",
  },
};

const faqs = [
  {
    q: "Dịch vụ SEO tại TP.HCM của bạn có khác gì so với các agency lớn không?",
    a: "Khác hoàn toàn về mô hình làm việc. Thay vì giao cho nhân viên junior xử lý, mọi dự án đều do tôi — chuyên gia 3+ năm — trực tiếp thực hiện và báo cáo. Không qua nhiều tầng trung gian, không phí quản lý cồng kềnh. Bạn làm việc trực tiếp 1-1, phản hồi trong ngày.",
  },
  {
    q: "Chi phí SEO TP.HCM là bao nhiêu?",
    a: "Gói Starter từ 3.500.000đ/tháng, phù hợp doanh nghiệp nhỏ muốn xây dựng nền tảng SEO. Gói Growth 7.000.000đ/tháng cho doanh nghiệp tăng trưởng nhanh. Rẻ hơn 50–70% so với agency lớn tại HCM nhưng chất lượng tương đương do chi phí vận hành thấp hơn.",
  },
  {
    q: "Tôi ở TP.HCM, bạn ở Đồng Nai — có làm việc online được không?",
    a: "Hoàn toàn được! 100% dự án SEO của tôi triển khai online. Báo cáo qua Google Sheet, họp review qua Zalo/Meet, hỗ trợ 7 ngày/tuần. Nhiều khách hàng HCM của tôi chưa bao giờ gặp trực tiếp mà vẫn đạt kết quả tốt.",
  },
  {
    q: "SEO mất bao lâu để thấy kết quả ở thị trường TP.HCM?",
    a: "HCM cạnh tranh hơn Đồng Nai nên cần 4–8 tháng cho từ khóa chính. Tuy nhiên, từ khóa local + long-tail có thể vào top 10 sau 2–3 tháng. Tôi ưu tiên chiến lược từ khóa ít cạnh tranh trước để tạo đà traffic sớm.",
  },
  {
    q: "Doanh nghiệp nhỏ tại HCM có nên làm SEO không?",
    a: <>Rất nên! Đặc biệt <a href="/dich-vu/seo-local" className="text-violet-600 underline underline-offset-2 hover:text-violet-800 font-medium">SEO Local Google Maps</a> — khi khách ở Quận 7 tìm &apos;thiết kế website Quận 7&apos; hay &apos;SEO Thủ Đức&apos;, cạnh tranh không cao như từ khóa toàn quốc. Đây là cơ hội vàng cho doanh nghiệp nhỏ chiếm thị phần trước khi các đối thủ lớn để ý.</>,
  },
  {
    q: "Tôi cần chuẩn bị gì trước khi bắt đầu SEO?",
    a: "Không cần chuẩn bị nhiều. Tôi sẽ audit website miễn phí và nêu rõ những gì cần làm. Chỉ cần cung cấp quyền truy cập Google Search Console, Google Analytics và thông tin sản phẩm/dịch vụ của bạn.",
  },
];

const districts = [
  "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7",
  "Quận 8", "Quận 10", "Quận 11", "Quận 12", "Bình Thạnh",
  "Gò Vấp", "Tân Bình", "Tân Phú", "Phú Nhuận", "Thủ Đức",
  "Bình Chánh", "Hóc Môn", "Nhà Bè", "Cần Giờ",
];

export default function SeoHcmPage() {
  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://www.sonxinchao.com" },
              { "@type": "ListItem", "position": 2, "name": "Dịch vụ SEO", "item": "https://www.sonxinchao.com/dich-vu/seo" },
              { "@type": "ListItem", "position": 3, "name": "SEO TP.HCM", "item": "https://www.sonxinchao.com/dich-vu/seo-hcm" },
            ],
          }),
        }}
      />
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Dịch Vụ SEO TP.HCM",
            "description": "Dịch vụ SEO tổng thể tại TP.HCM giúp website lên top Google bền vững — on-page, technical, backlink, content.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Sơn Xin Chào",
              "url": "https://www.sonxinchao.com",
              "telephone": "+84968806360",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Long Thành",
                "addressRegion": "Đồng Nai",
                "addressCountry": "VN",
              },
            },
            "areaServed": [
              "TP. Hồ Chí Minh", "Quận 1", "Quận 7", "Thủ Đức",
              "Bình Thạnh", "Gò Vấp", "Tân Bình", "Tân Phú",
              "Long Thành", "Nhơn Trạch", "Đồng Nai", "Bình Dương",
            ],
            "offers": {
              "@type": "Offer",
              "priceCurrency": "VND",
              "price": "3500000",
              "priceSpecification": { "@type": "UnitPriceSpecification", "unitText": "tháng" },
            },
          }),
        }}
      />
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((f) => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a },
            })),
          }),
        }}
      />

      <Navbar />

      <main className="bg-white min-h-screen">

        {/* Hero */}
        <section className="bg-gradient-to-br from-violet-700 via-blue-700 to-blue-800 text-white pt-28 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-xs text-blue-200 mb-6">
              <a href="/" className="hover:text-white transition-colors">Trang chủ</a>
              <span>›</span>
              <a href="/dich-vu/seo" className="hover:text-white transition-colors">Dịch vụ SEO</a>
              <span>›</span>
              <span className="text-white font-medium">SEO TP.HCM</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              🏙️ Chuyên gia SEO phục vụ toàn bộ TP.HCM
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Dịch Vụ <span className="text-yellow-300">SEO TP.HCM</span><br />
              Cá Nhân Hoá · Chi Phí Hợp Lý
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Không phải agency lớn, không qua nhân viên junior. Bạn làm việc <strong className="text-white">1-1 trực tiếp với chuyên gia</strong> — tăng 200–400% traffic organic, tiết kiệm 50–70% chi phí so với agency HCM.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <a
                href="https://zalo.me/0968806360"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-full text-base transition-all hover:scale-105 shadow-lg"
              >
                💬 Tư vấn miễn phí qua Zalo →
              </a>
              <a
                href="/#pricing"
                className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full text-base transition-all"
              >
                Xem bảng giá
              </a>
            </div>
            <p className="text-blue-300 text-sm">
              📍 Phục vụ: Quận 1 · Quận 7 · Thủ Đức · Bình Thạnh · Gò Vấp · Tân Bình · và tất cả quận/huyện TP.HCM
            </p>

            {/* SVG Illustration — Google SERP + Traffic Chart */}
            <div className="mt-10 max-w-md mx-auto w-full select-none">
              <svg viewBox="0 0 420 215" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full drop-shadow-xl">
                {/* Browser chrome */}
                <rect width="420" height="215" rx="14" fill="rgba(15,23,42,0.55)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>
                <rect width="420" height="30" rx="14" fill="rgba(0,0,0,0.35)"/>
                <rect y="16" width="420" height="14" fill="rgba(0,0,0,0.35)"/>
                {/* Traffic lights */}
                <circle cx="18" cy="15" r="4.5" fill="rgba(255,255,255,0.25)"/>
                <circle cx="32" cy="15" r="4.5" fill="rgba(255,255,255,0.25)"/>
                <circle cx="46" cy="15" r="4.5" fill="rgba(255,255,255,0.25)"/>
                {/* URL bar */}
                <rect x="62" y="8" width="244" height="14" rx="7" fill="rgba(255,255,255,0.12)"/>
                <text x="184" y="18.5" fill="rgba(255,255,255,0.6)" fontSize="7.5" fontFamily="system-ui,sans-serif" textAnchor="middle">google.com/search?q=dịch+vụ+SEO+TP.HCM</text>

                {/* LEFT PANEL — SERP Results */}
                {/* Result #1 highlighted */}
                <rect x="12" y="40" width="256" height="50" rx="9" fill="rgba(34,197,94,0.18)" stroke="rgba(134,239,172,0.5)" strokeWidth="1.5"/>
                <text x="24" y="58" fill="#86EFAC" fontSize="9.5" fontFamily="system-ui,sans-serif" fontWeight="bold">#1</text>
                <text x="42" y="58" fill="white" fontSize="10" fontFamily="system-ui,sans-serif" fontWeight="600">sonxinchao.com</text>
                <text x="42" y="72" fill="rgba(255,255,255,0.65)" fontSize="8.5" fontFamily="system-ui,sans-serif">Dịch Vụ SEO TP.HCM — Cá Nhân Hoá 1-1</text>
                <text x="42" y="84" fill="rgba(255,255,255,0.4)" fontSize="7.5" fontFamily="system-ui,sans-serif">Chi phí hợp lý · Không ràng buộc · Tư vấn miễn phí</text>
                {/* TOP 1 badge */}
                <rect x="214" y="47" width="46" height="18" rx="9" fill="#FBBF24"/>
                <text x="237" y="60" fill="#1e3a8a" fontSize="8" fontFamily="system-ui,sans-serif" fontWeight="800" textAnchor="middle">TOP 1 ⭐</text>

                {/* Result #2 */}
                <rect x="12" y="97" width="256" height="36" rx="7" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                <text x="24" y="113" fill="rgba(255,255,255,0.38)" fontSize="9" fontFamily="system-ui,sans-serif">#2</text>
                <text x="42" y="113" fill="rgba(255,255,255,0.42)" fontSize="9" fontFamily="system-ui,sans-serif">agencyseohcm.vn</text>
                <text x="42" y="126" fill="rgba(255,255,255,0.28)" fontSize="8" fontFamily="system-ui,sans-serif">Dịch vụ SEO TP.HCM từ 15 triệu/tháng...</text>

                {/* Result #3 */}
                <rect x="12" y="140" width="256" height="34" rx="7" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                <text x="24" y="155" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="system-ui,sans-serif">#3</text>
                <text x="42" y="155" fill="rgba(255,255,255,0.28)" fontSize="9" fontFamily="system-ui,sans-serif">congtydigitalhcm.com</text>
                <text x="42" y="167" fill="rgba(255,255,255,0.18)" fontSize="8" fontFamily="system-ui,sans-serif">Báo giá SEO website HCM tốt nhất...</text>

                {/* Divider */}
                <line x1="284" y1="38" x2="284" y2="205" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3"/>

                {/* RIGHT PANEL — Traffic chart */}
                <text x="352" y="52" fill="rgba(255,255,255,0.7)" fontSize="8.5" fontFamily="system-ui,sans-serif" fontWeight="600" textAnchor="middle">Traffic Organic</text>
                {/* Chart bars */}
                <rect x="298" y="148" width="16" height="32" rx="4" fill="rgba(139,92,246,0.45)"/>
                <rect x="318" y="130" width="16" height="50" rx="4" fill="rgba(139,92,246,0.55)"/>
                <rect x="338" y="108" width="16" height="72" rx="4" fill="rgba(139,92,246,0.7)"/>
                <rect x="358" y="78" width="16" height="102" rx="4" fill="rgba(250,204,21,0.85)"/>
                {/* Arrow up on last bar */}
                <text x="366" y="73" fill="#FCD34D" fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="900" textAnchor="middle">↑</text>
                {/* +340% label */}
                <rect x="316" y="59" width="72" height="16" rx="8" fill="rgba(250,204,21,0.2)" stroke="rgba(250,204,21,0.5)" strokeWidth="1"/>
                <text x="352" y="71" fill="#FCD34D" fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="700" textAnchor="middle">+340% traffic</text>
                {/* X labels */}
                <text x="306" y="194" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="system-ui,sans-serif" textAnchor="middle">T1</text>
                <text x="326" y="194" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="system-ui,sans-serif" textAnchor="middle">T2</text>
                <text x="346" y="194" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="system-ui,sans-serif" textAnchor="middle">T4</text>
                <text x="366" y="194" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="system-ui,sans-serif" textAnchor="middle">T6</text>
                {/* Chart floor line */}
                <line x1="292" y1="180" x2="410" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </svg>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-blue-900 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "200–400%", label: "Tăng traffic sau 6 tháng" },
              { num: "50+", label: "Dự án SEO thành công" },
              { num: "3+", label: "Năm kinh nghiệm thực chiến" },
              { num: "50–70%", label: "Tiết kiệm so với agency lớn" },
            ].map((s) => (
              <div key={s.num}>
                <div className="text-2xl md:text-3xl font-extrabold text-yellow-300">{s.num}</div>
                <div className="text-sm text-blue-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Lợi thế cạnh tranh vs Agency lớn */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
              Tại Sao Chọn Tôi Thay Vì Agency SEO Lớn Tại HCM?
            </h2>
            <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">
              Hàng chục công ty SEO tại TP.HCM — nhưng phần lớn đắt tiền, qua nhiều tầng trung gian và không cam kết kết quả rõ ràng. Đây là sự khác biệt.
            </p>

            {/* So sánh bảng */}
            <div className="overflow-x-auto rounded-2xl shadow-sm border border-slate-200 mb-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="py-4 px-5 text-left">Tiêu chí</th>
                    <th className="py-4 px-5 text-center">Agency lớn HCM</th>
                    <th className="py-4 px-5 text-center bg-blue-700">Sơn Xin Chào</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Chi phí/tháng", "10–50 triệu+", "3.5–7 triệu"],
                    ["Người trực tiếp làm", "Nhân viên junior", "Chuyên gia 3+ năm"],
                    ["Cam kết KPI", "Thường mơ hồ", "Rõ ràng từ đầu"],
                    ["Báo cáo", "Cuối tháng", "Hàng tuần"],
                    ["Phản hồi", "24–72 giờ", "Trong ngày"],
                    ["Hợp đồng dài hạn", "Thường 6–12 tháng bắt buộc", "Không ràng buộc"],
                    ["Hoàn tiền nếu không kết quả", "Hiếm", "Cam kết hoàn 1 tháng nếu cần"],
                  ].map(([label, agency, son], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="py-3.5 px-5 font-medium text-slate-700">{label}</td>
                      <td className="py-3.5 px-5 text-center text-slate-500">{agency}</td>
                      <td className="py-3.5 px-5 text-center font-bold text-blue-700 bg-blue-50">{son}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Lý do chọn */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "👤",
                  title: "Làm việc 1-1 với chuyên gia",
                  desc: "Mọi quyết định SEO đều do tôi trực tiếp đưa ra — không qua Account Manager, không qua nhân viên junior chưa có kinh nghiệm.",
                },
                {
                  icon: "💰",
                  title: "Chi phí tối ưu cho SME",
                  desc: "Chi phí thấp vì không có văn phòng HCM, không có đội ngũ cồng kềnh. Tiết kiệm đó chuyển thành lợi thế cho bạn.",
                },
                {
                  icon: "📊",
                  title: "Báo cáo minh bạch hàng tuần",
                  desc: "Google Sheet tracking từ khóa real-time, Google Analytics report hàng tuần. Bạn biết chính xác tiến độ từng ngày.",
                },
                {
                  icon: "🎯",
                  title: "Chiến lược riêng cho từng ngành",
                  desc: "SEO cho spa khác SEO cho BĐS, khác SEO cho F&B. Tôi nghiên cứu đối thủ và thiết kế chiến lược riêng — không template.",
                },
                {
                  icon: "⚡",
                  title: "Kết quả nhanh với từ khóa local",
                  desc: <>Ưu tiên từ khóa &apos;dịch vụ + quận/huyện&apos; ít cạnh tranh để tạo traffic sớm trong 2–3 tháng đầu. Kết hợp với <a href="/dich-vu/seo-local" className="text-violet-600 underline underline-offset-2 hover:text-violet-800 font-medium">SEO Local Google Maps</a> để chiếm top trước đối thủ.</>,
                },
                {
                  icon: "🔄",
                  title: "Cập nhật thuật toán liên tục",
                  desc: "Google cập nhật 500–600 lần/năm. Tôi theo dõi và điều chỉnh chiến lược mỗi tháng để website luôn an toàn và tăng thứ hạng.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quy trình */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
              Quy Trình SEO TP.HCM — 6 Bước Thực Chiến
            </h2>
            <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
              Bài bản, minh bạch và được cá nhân hóa cho từng doanh nghiệp tại HCM
            </p>
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Audit SEO miễn phí & Phân tích đối thủ HCM",
                  desc: "Kiểm tra 50+ điểm kỹ thuật của website, phân tích top 3 đối thủ đang rank tại TP.HCM trong ngành bạn. Xác định khoảng cách và cơ hội.",
                  tag: "Tuần 1 · Miễn phí",
                },
                {
                  step: "02",
                  title: "Nghiên cứu từ khóa đặc thù thị trường HCM",
                  desc: "Map từ khóa theo quận/huyện (Quận 7, Thủ Đức, Bình Thạnh...), từ khóa có ý định mua cao, long-tail ít cạnh tranh. Ưu tiên từ khóa ROI cao nhất.",
                  tag: "Tuần 1–2",
                },
                {
                  step: "03",
                  title: "Tối ưu SEO On-page toàn diện",
                  desc: "Viết lại title, meta description, H1–H3 chuẩn từ khóa HCM. Tối ưu cấu trúc URL, internal linking, schema markup LocalBusiness, breadcrumb.",
                  tag: "Tháng 1",
                },
                {
                  step: "04",
                  title: "Technical SEO & Core Web Vitals",
                  desc: "Sửa lỗi crawl, tối ưu tốc độ tải trang cho mobile (quan trọng ở HCM với 80%+ user dùng điện thoại), canonical, sitemap, robots.txt.",
                  tag: "Tháng 1",
                },
                {
                  step: "05",
                  title: "Content Marketing & Backlink xây dựng",
                  desc: <>Viết 2–4 <a href="/blog" className="text-violet-600 underline underline-offset-2 hover:text-violet-800 font-medium">bài blog chuẩn SEO</a>/tháng nhắm từ khóa HCM cụ thể. Xây dựng backlink từ báo điện tử, diễn đàn ngành, directory uy tín để tăng Domain Authority.</>,
                  tag: "Tháng 2–6",
                },
                {
                  step: "06",
                  title: "Báo cáo & Tối ưu liên tục",
                  desc: "Google Sheet tracking từ khóa theo ngày. Họp review hàng tháng qua Zalo/Meet. Điều chỉnh chiến lược mỗi tháng theo dữ liệu thực tế.",
                  tag: "Hàng tháng",
                },
              ].map((p) => (
                <div key={p.step} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-extrabold text-lg">
                    {p.step}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{p.title}</h3>
                      <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gói dịch vụ bao gồm */}
        <section className="py-16 px-4 bg-violet-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">
              Dịch Vụ SEO TP.HCM Bao Gồm Những Gì?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Audit SEO miễn phí trước khi ký hợp đồng",
                "Nghiên cứu từ khóa local HCM theo quận/huyện",
                "Tối ưu SEO on-page toàn bộ trang dịch vụ",
                "Tối ưu tốc độ & Core Web Vitals cho mobile",
                "Schema markup (LocalBusiness, FAQ, BreadcrumbList)",
                "Tối ưu Google Business Profile (Google Maps)",
                "Viết 2–4 bài blog chuẩn SEO/tháng nhắm HCM",
                "Xây dựng 5–10 backlinks chất lượng/tháng",
                "Google Sheet tracking từ khóa real-time",
                "Báo cáo traffic & thứ hạng hàng tuần",
                "Hỗ trợ qua Zalo 7 ngày/tuần, phản hồi trong ngày",
                "Theo dõi đối thủ HCM và cập nhật thuật toán",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-violet-100"
                >
                  <span className="text-violet-500 font-bold text-lg flex-shrink-0">✓</span>
                  <span className="text-slate-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case study */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
              Kết Quả Thực Tế — Từ Dự Án Đã Triển Khai
            </h2>
            <p className="text-slate-500 text-center mb-10">
              Con số thực, không phóng đại — từ các dự án SME tương tự doanh nghiệp của bạn
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-bold text-slate-800">Showroom Xe Điện (Đồng Nai)</div>
                    <div className="text-xs text-slate-400">Ngành: Xe điện / Yadea — SME địa phương</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <div className="text-sm text-slate-500">Trước</div>
                    <div className="text-2xl font-extrabold text-red-500">200</div>
                    <div className="text-xs text-slate-400">lượt/tháng</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-sm text-slate-500">Sau 5 tháng</div>
                    <div className="text-2xl font-extrabold text-green-600">880</div>
                    <div className="text-xs text-slate-400">lượt/tháng</div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl px-4 py-2 text-center text-blue-700 font-bold text-sm">
                  +340% traffic organic
                </div>
                <p className="text-slate-500 text-sm mt-3">
                  SEO Local + content địa phương + Google Business Profile. Chiến lược tương tự áp dụng được cho SME TP.HCM theo quận.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <div className="font-bold text-slate-800">Website Bất Động Sản (Đồng Nai)</div>
                    <div className="text-xs text-slate-400">Ngành: Bất động sản — website cũ, chậm</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <div className="text-sm text-slate-500">Trước</div>
                    <div className="text-2xl font-extrabold text-red-500">45</div>
                    <div className="text-xs text-slate-400">PageSpeed</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-sm text-slate-500">Sau tối ưu</div>
                    <div className="text-2xl font-extrabold text-green-600">95</div>
                    <div className="text-xs text-slate-400">PageSpeed</div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl px-4 py-2 text-center text-blue-700 font-bold text-sm">
                  Top 5 từ khóa chính sau 4 tháng
                </div>
                <p className="text-slate-500 text-sm mt-3">
                  Technical SEO + tối ưu content + backlink. Website chậm, bị phạt PageSpeed là vấn đề phổ biến ở HCM — và có thể fix trong tuần đầu.
                </p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-8 bg-gradient-to-r from-violet-50 to-blue-50 rounded-2xl p-6 border border-violet-100">
              <p className="text-slate-600 italic text-base leading-relaxed mb-4">
                "Tôi ở TP.HCM, thử nhiều agency nhưng chi phí cao mà không thấy kết quả. Sau khi làm việc với Sơn, chỉ 3 tháng từ khóa chính đã vào top 10 Google — và chi phí chỉ bằng 1/3 agency cũ."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">T</div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">Anh Tuấn</div>
                  <div className="text-xs text-slate-500">Chủ spa tại Quận 7, TP.HCM</div>
                </div>
                <div className="ml-auto text-yellow-400 text-lg">★★★★★</div>
              </div>
            </div>
          </div>
        </section>

        {/* Khu vực phục vụ tại HCM */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
              Phủ Sóng Toàn Bộ TP. Hồ Chí Minh
            </h2>
            <p className="text-slate-500 text-center mb-8 max-w-xl mx-auto">
              Dịch vụ SEO online — phục vụ doanh nghiệp tại tất cả quận/huyện TP.HCM không cần gặp trực tiếp
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {districts.map((d) => (
                <span
                  key={d}
                  className="px-3 py-1.5 bg-white border border-violet-200 text-violet-700 rounded-full text-sm font-medium shadow-sm"
                >
                  📍 {d}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Bảng giá */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
              Bảng Giá SEO TP.HCM — Minh Bạch, Không Phát Sinh
            </h2>
            <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">
              Thấp hơn 50–70% so với agency lớn HCM. Chất lượng tương đương nhờ chi phí vận hành tối ưu.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Starter",
                  price: "3.500.000đ",
                  per: "/tháng",
                  desc: "Phù hợp shop online, dịch vụ địa phương, SME mới bắt đầu SEO",
                  features: [
                    "Audit SEO toàn diện",
                    "10 từ khóa mục tiêu HCM",
                    "Tối ưu on-page 5 trang",
                    "1 bài blog/tuần",
                    "Báo cáo hàng tháng",
                    "Hỗ trợ Zalo",
                  ],
                  color: "border-slate-200",
                  badge: "",
                  btnClass: "bg-slate-800 hover:bg-slate-700 text-white",
                },
                {
                  name: "Growth",
                  price: "7.000.000đ",
                  per: "/tháng",
                  desc: "Lựa chọn tốt nhất cho doanh nghiệp muốn tăng trưởng nhanh tại HCM",
                  features: [
                    "30+ từ khóa mục tiêu HCM",
                    "SEO on-page + technical đầy đủ",
                    "4 bài blog/tháng chuẩn SEO",
                    "5–10 backlinks/tháng",
                    "Báo cáo hàng tuần",
                    "Google Ads tư vấn miễn phí",
                    "Hỗ trợ ưu tiên 24/5",
                  ],
                  color: "border-violet-500 border-2",
                  badge: "Được chọn nhiều nhất",
                  btnClass: "bg-violet-600 hover:bg-violet-700 text-white",
                },
                {
                  name: "Pro",
                  price: "Liên hệ",
                  per: "",
                  desc: "Giải pháp toàn diện cho doanh nghiệp HCM có nhu cầu đặc biệt",
                  features: [
                    "Toàn bộ gói Growth",
                    "Thiết kế/nâng cấp website",
                    "Google Ads + Facebook Ads",
                    "Content marketing toàn diện",
                    "Dashboard báo cáo tùy chỉnh",
                    "Hỗ trợ 7 ngày/tuần",
                  ],
                  color: "border-slate-200",
                  badge: "",
                  btnClass: "bg-slate-800 hover:bg-slate-700 text-white",
                },
              ].map((pkg) => (
                <div
                  key={pkg.name}
                  className={`relative rounded-2xl border ${pkg.color} bg-white p-6 shadow-sm`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      ⭐ {pkg.badge}
                    </div>
                  )}
                  <div className="text-center mb-5 mt-2">
                    <div className="text-lg font-bold text-slate-800">{pkg.name}</div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-1">
                      {pkg.price}
                      <span className="text-base font-normal text-slate-500">{pkg.per}</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-2">{pkg.desc}</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/#contact"
                    className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${pkg.btnClass}`}
                  >
                    Bắt đầu ngay →
                  </a>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-400 text-sm mt-6">
              * Giá chưa bao gồm ngân sách quảng cáo (nếu có). Tư vấn miễn phí trước khi quyết định.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">
              Câu Hỏi Thường Gặp Về SEO TP.HCM
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-2">❓ {faq.q}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-violet-700 to-blue-800 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4">Bắt Đầu SEO TP.HCM Ngay Hôm Nay</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Audit website miễn phí trong 24 giờ — không ràng buộc. Tôi sẽ phân tích đối thủ HCM và đề xuất từ khóa phù hợp nhất cho doanh nghiệp của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://zalo.me/0968806360"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-full transition-all hover:scale-105 shadow-lg"
              >
                💬 Nhắn Zalo — Audit miễn phí
              </a>
              <a
                href="/#contact"
                className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full transition-all"
              >
                📝 Gửi yêu cầu tư vấn
              </a>
            </div>
            <p className="text-blue-300 text-sm mt-5">
              📍 Phục vụ online toàn TP.HCM · Phản hồi trong 2 giờ · 0968 806 360
            </p>
          </div>
        </section>

        {/* Internal links */}
        <section className="py-10 px-4 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-500 text-sm mb-4 font-medium">Xem thêm dịch vụ liên quan:</p>
            <div className="flex flex-wrap gap-3">
              <a href="/dich-vu/seo" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                🔍 SEO Tổng Thể (Đồng Nai)
              </a>
              <a href="/dich-vu/seo-local" className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
                📍 SEO Local Google Maps
              </a>
              <a href="/dich-vu/google-ads" className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors">
                📊 Google Ads HCM
              </a>
              <a href="/dich-vu/thiet-ke-website" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">
                💻 Thiết kế Website chuẩn SEO
              </a>
              <a href="/blog" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">
                📖 Blog kiến thức SEO
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
