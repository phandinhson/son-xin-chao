"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import FloatingContacts from "@/components/FloatingContacts";

const SERVICES = [
  {
    id: "seo-organic",
    icon: "🔍",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    tag: "SEO",
    tagColor: "bg-blue-100 text-blue-700",
    title: "SEO Organic",
    subtitle: "Lên top Google bền vững, tăng traffic tự nhiên",
    desc: "Chiến lược SEO toàn diện giúp website của bạn xuất hiện trên trang 1 Google và duy trì thứ hạng dài hạn. Không phụ thuộc vào ngân sách quảng cáo.",
    features: [
      "Nghiên cứu từ khóa chuyên sâu & phân tích đối thủ",
      "Tối ưu SEO on-page: title, meta, heading, content",
      "SEO technical: tốc độ, Core Web Vitals, sitemap",
      "Xây dựng backlink chất lượng từ website uy tín",
      "Viết nội dung chuẩn SEO, thu hút người đọc",
      "Báo cáo thứ hạng & traffic hàng tuần",
    ],
    result: "Tăng traffic hữu cơ 200–400% sau 6 tháng",
    price: "Từ 3.000.000đ/tháng",
  },
  {
    id: "google-ads",
    icon: "📈",
    color: "from-orange-500 to-yellow-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    tag: "Ads",
    tagColor: "bg-orange-100 text-orange-700",
    title: "Google Ads",
    subtitle: "Quảng cáo tìm kiếm & display hiệu quả",
    desc: "Chạy quảng cáo Google Ads đúng từ khóa, đúng đối tượng, đúng thời điểm — tối ưu chi phí và tăng tỉ lệ chuyển đổi thực sự.",
    features: [
      "Nghiên cứu từ khóa có intent mua hàng cao",
      "Thiết lập chiến dịch Search, Display, Shopping",
      "Viết nội dung quảng cáo A/B testing",
      "Tối ưu Quality Score & giảm giá thầu CPC",
      "Cài đặt tracking chuyển đổi, remarketing",
      "Báo cáo chi tiết ROAS, CPA hàng tháng",
    ],
    result: "ROAS trung bình 3–8x tùy ngành",
    price: "Từ 2.000.000đ/tháng + ngân sách chạy",
  },
  {
    id: "facebook-tiktok-ads",
    icon: "📣",
    color: "from-violet-500 to-pink-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
    tag: "Ads",
    tagColor: "bg-violet-100 text-violet-700",
    title: "Facebook & TikTok Ads",
    subtitle: "Tiếp cận đúng khách hàng mục tiêu",
    desc: "Xây dựng chiến lược quảng cáo social media thu hút đúng tệp khách hàng, tăng nhận diện thương hiệu và tạo ra đơn hàng thực tế.",
    features: [
      "Phân tích & xây dựng tệp khách hàng mục tiêu",
      "Thiết kế creative: ảnh, video ngắn thu hút",
      "Chạy chiến dịch awareness, traffic, conversion",
      "Tối ưu CPM, CPC, CPL theo từng giai đoạn",
      "Retargeting & lookalike audience",
      "Báo cáo hiệu quả & đề xuất cải thiện",
    ],
    result: "Giảm CPL 30–50% sau tháng đầu tối ưu",
    price: "Từ 2.500.000đ/tháng + ngân sách chạy",
  },
  {
    id: "thiet-ke-website",
    icon: "💻",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    tag: "Website",
    tagColor: "bg-emerald-100 text-emerald-700",
    title: "Thiết kế Website WordPress",
    subtitle: "Website chuẩn SEO, đẹp, tốc độ cao",
    desc: "Xây dựng website WordPress chuyên nghiệp, tối ưu SEO ngay từ đầu, tải nhanh, giao diện đẹp trên mọi thiết bị — biến website thành cỗ máy tạo lead.",
    features: [
      "Thiết kế UI/UX tùy chỉnh theo thương hiệu",
      "Chuẩn SEO technical ngay từ lúc build",
      "Tốc độ tải trang < 2 giây (Core Web Vitals xanh)",
      "Responsive hoàn hảo trên mobile & tablet",
      "Tích hợp form liên hệ, chat, call-to-action",
      "Bàn giao code + hướng dẫn tự quản lý nội dung",
    ],
    result: "Website hoàn chỉnh trong 7–14 ngày",
    price: "Từ 5.000.000đ/dự án",
  },
  {
    id: "seo-local",
    icon: "📍",
    color: "from-red-500 to-rose-500",
    bg: "bg-red-50",
    border: "border-red-200",
    tag: "SEO",
    tagColor: "bg-red-100 text-red-700",
    title: "SEO Local (Google Map)",
    subtitle: "Hiển thị khi khách tìm kiếm gần bạn",
    desc: "Tối ưu Google Business Profile và SEO địa phương giúp cửa hàng/doanh nghiệp của bạn xuất hiện trong top 3 kết quả bản đồ khi khách hàng tìm kiếm gần vị trí.",
    features: [
      "Tối ưu Google Business Profile đầy đủ",
      "Xây dựng NAP (Name, Address, Phone) nhất quán",
      "Thu thập & quản lý đánh giá Google Review",
      "Local citations: đăng ký danh bạ địa phương",
      "Nội dung local SEO nhắm từ khóa khu vực",
      "Theo dõi thứ hạng từ khóa địa phương",
    ],
    result: "Vào top 3 Google Map trong 2–3 tháng",
    price: "Từ 2.000.000đ/tháng",
  },
  {
    id: "audit-tu-van",
    icon: "🎯",
    color: "from-slate-600 to-blue-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    tag: "Tư vấn",
    tagColor: "bg-slate-100 text-slate-700",
    title: "Audit & Tư vấn Marketing",
    subtitle: "Phân tích toàn diện & lộ trình chiến lược",
    desc: "Audit toàn bộ hệ thống marketing hiện tại, xác định điểm yếu và cơ hội, đề xuất lộ trình cụ thể để tăng trưởng nhanh và bền vững.",
    features: [
      "Audit SEO technical, on-page, off-page",
      "Phân tích chiến dịch quảng cáo đang chạy",
      "Đánh giá website: tốc độ, UX, tỉ lệ chuyển đổi",
      "Phân tích đối thủ cạnh tranh trực tiếp",
      "Xây dựng lộ trình marketing 3–6 tháng",
      "Buổi tư vấn 1-1 trực tiếp hoặc online",
    ],
    result: "Báo cáo chi tiết + lộ trình trong 5 ngày",
    price: "Từ 1.500.000đ/lần audit",
  },
];

const PROCESS = [
  { step: "01", title: "Tìm hiểu & Phân tích", desc: "Lắng nghe mục tiêu, ngành nghề, đối thủ và tình trạng hiện tại của bạn." },
  { step: "02", title: "Đề xuất chiến lược", desc: "Xây dựng kế hoạch cụ thể phù hợp ngân sách và mục tiêu tăng trưởng." },
  { step: "03", title: "Triển khai & Tối ưu", desc: "Thực thi theo kế hoạch, liên tục theo dõi và điều chỉnh để đạt hiệu quả cao nhất." },
  { step: "04", title: "Báo cáo & Phát triển", desc: "Báo cáo minh bạch, đo lường kết quả thực tế và mở rộng chiến lược." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-600 via-blue-500 to-violet-600 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 border border-white/30 rounded-full text-white/90 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Dịch vụ Digital Marketing
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
            Giải pháp Marketing<br />
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Tăng trưởng thực tế
            </span>
          </h1>
          <p className="text-blue-100 text-base lg:text-lg max-w-2xl mx-auto mb-8">
            Tôi cung cấp dịch vụ SEO, Quảng cáo & Website chuyên nghiệp — kết quả đo lường được, cam kết rõ ràng.
          </p>
          <a href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-blue-600 font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm shadow-md">
            Nhận tư vấn miễn phí →
          </a>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-3">Tất cả dịch vụ</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Mỗi dịch vụ được thiết kế với quy trình rõ ràng, kết quả minh bạch và báo cáo định kỳ.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {SERVICES.map((s) => (
            <div key={s.id} id={s.id}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">

              {/* Card header */}
              <div className={`${s.bg} ${s.border} border-b px-6 py-5`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl shadow-md`}>
                    {s.icon}
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${s.tagColor}`}>{s.tag}</span>
                </div>
                <h3 className="text-slate-900 font-extrabold text-lg leading-tight mb-1">{s.title}</h3>
                <p className="text-blue-600 text-sm font-semibold">{s.subtitle}</p>
              </div>

              {/* Description */}
              <div className="px-6 py-4 flex-1 flex flex-col">
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{s.desc}</p>

                {/* Features */}
                <ul className="space-y-2 mb-5 flex-1">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Result badge */}
                <div className="flex items-center gap-2 px-3.5 py-2 bg-green-50 border border-green-200 rounded-xl mb-4">
                  <span className="text-green-500 text-sm">✅</span>
                  <span className="text-green-700 text-xs font-semibold">{s.result}</span>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <div className="text-xs text-slate-400">Chi phí tham khảo</div>
                    <div className="text-slate-800 font-bold text-sm">{s.price}</div>
                  </div>
                  <a href="/contact"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold rounded-full hover:opacity-90 hover:scale-105 transition-all shadow-sm">
                    Tư vấn ngay
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-3">Quy trình làm việc</h2>
            <p className="text-slate-500">Minh bạch, rõ ràng và đo lường được từng bước</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <div key={p.step} className="relative text-center">
                {i < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent -translate-x-4 z-0" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-lg mx-auto mb-4 shadow-lg shadow-blue-200">
                  {p.step}
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-2">{p.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-r from-blue-600 to-violet-600 py-14">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">Bắt đầu tăng trưởng ngay hôm nay</h2>
          <p className="text-blue-100 mb-8 text-sm">Tư vấn miễn phí — phản hồi trong 2 giờ làm việc. Không cam kết dài hạn ngay từ đầu.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact"
              className="px-8 py-3.5 bg-white text-blue-600 font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm">
              Liên hệ tư vấn →
            </a>
            <a href="/pricing"
              className="px-8 py-3.5 bg-white/15 border border-white/30 text-white font-bold rounded-full hover:bg-white/25 transition-all text-sm">
              Xem bảng giá
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBar />
      <FloatingContacts />
    </div>
  );
}
