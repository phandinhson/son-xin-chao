import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

export const metadata: Metadata = {
  title: "Thiết Kế Website WordPress Chuyên Nghiệp Chuẩn SEO | Sơn Xin Chào",
  description:
    "Dịch vụ thiết kế website WordPress chuyên nghiệp tại Long Thành, Đồng Nai. Tích hợp WooCommerce bán hàng, tối ưu AI, chuẩn SEO Google. Bàn giao 7–14 ngày. Tư vấn miễn phí!",
  keywords:
    "thiết kế website WordPress Long Thành, làm website WordPress Đồng Nai, thiết kế web bán hàng WordPress, website WooCommerce, thiết kế website chuẩn SEO, làm website giá rẻ Đồng Nai, thiết kế web chuyên nghiệp Long Thành, website bán hàng Đồng Nai",
  alternates: {
    canonical: "https://www.sonxinchao.com/dich-vu/thiet-ke-website",
  },
  openGraph: {
    title: "Thiết Kế Website WordPress Chuyên Nghiệp Chuẩn SEO | Sơn Xin Chào",
    description:
      "Website WordPress chuẩn SEO, tích hợp WooCommerce bán hàng, tối ưu AI. Bàn giao 7–14 ngày tại Long Thành, Đồng Nai.",
    url: "https://www.sonxinchao.com/dich-vu/thiet-ke-website",
    type: "website",
  },
};

const faqs = [
  {
    q: "Thiết kế website WordPress mất bao lâu?",
    a: "Thông thường 7–14 ngày tùy độ phức tạp. Website giới thiệu dịch vụ đơn giản: 7 ngày. Website bán hàng WooCommerce đầy đủ: 14–21 ngày. Tôi cam kết đúng tiến độ đã thỏa thuận.",
  },
  {
    q: "Chi phí thiết kế website WordPress là bao nhiêu?",
    a: "Gói cơ bản từ 3.500.000đ (landing page / web giới thiệu). Gói bán hàng WooCommerce từ 6.000.000đ. Gói doanh nghiệp từ 12.000.000đ. Tư vấn miễn phí để báo giá chính xác theo nhu cầu của bạn.",
  },
  {
    q: "Tôi có thể tự quản lý website sau khi nhận bàn giao không?",
    a: "Hoàn toàn có thể! WordPress có giao diện quản trị thân thiện. Tôi sẽ hướng dẫn bạn đăng bài, thêm sản phẩm, quản lý đơn hàng và cập nhật nội dung. Không cần biết lập trình.",
  },
  {
    q: "Website có chuẩn SEO Google không?",
    a: "Có. Tất cả website tôi xây dựng đều được cài schema markup, sitemap.xml, robots.txt, tối ưu tốc độ Core Web Vitals, meta tags và cấu trúc heading chuẩn. Bạn sẽ nhận được 1 tháng hỗ trợ SEO on-page miễn phí sau bàn giao.",
  },
  {
    q: "AI được sử dụng như thế nào trong thiết kế website?",
    a: "AI giúp tôi tối ưu toàn bộ quy trình: viết nội dung website bằng Claude/ChatGPT, tạo hình ảnh minh họa bằng Midjourney/DALL·E, tối ưu code bằng GitHub Copilot, và phân tích SEO competitor. Kết quả: website chất lượng cao hơn, thời gian nhanh hơn, chi phí hợp lý hơn.",
  },
  {
    q: "Website có tích hợp bán hàng online được không?",
    a: "Có. Tôi tích hợp WooCommerce — plugin thương mại điện tử mạnh nhất cho WordPress. Quản lý sản phẩm, đơn hàng, kho hàng, thanh toán online (VNPay, MoMo, chuyển khoản), vận chuyển và xuất báo cáo doanh thu.",
  },
  {
    q: "Sau khi bàn giao, nếu có lỗi thì sao?",
    a: "Tôi bảo hành lỗi kỹ thuật miễn phí 3 tháng sau bàn giao. Nếu website gặp sự cố do code hoặc cấu hình tôi thực hiện, tôi sẽ sửa trong 24 giờ không tính phí.",
  },
];

const packages = [
  {
    name: "Starter",
    price: "3.500.000đ",
    desc: "Landing page / Website giới thiệu dịch vụ",
    color: "border-slate-200",
    badge: "",
    features: [
      "1–5 trang tĩnh (Trang chủ, Giới thiệu, Dịch vụ, Liên hệ)",
      "Giao diện chuyên nghiệp, responsive mobile",
      "Tích hợp form liên hệ + Zalo / Google Maps",
      "Cài đặt SEO cơ bản (title, meta, sitemap)",
      "Tốc độ PageSpeed > 85 điểm",
      "Hosting + domain hỗ trợ tư vấn",
      "Bàn giao trong 7 ngày",
      "Bảo hành lỗi 3 tháng",
    ],
  },
  {
    name: "Business",
    price: "6.000.000đ",
    desc: "Website bán hàng WooCommerce đầy đủ",
    color: "border-orange-500",
    badge: "Phổ biến nhất",
    features: [
      "Tất cả tính năng gói Starter",
      "WooCommerce: quản lý sản phẩm, đơn hàng, kho",
      "Thanh toán online (VNPay, MoMo, COD)",
      "Tích hợp vận chuyển Giao Hàng Nhanh / GHTK",
      "Trang blog / tin tức chuẩn SEO",
      "Schema sản phẩm (Product, Review, BreadcrumbList)",
      "Hướng dẫn quản trị + 1 tháng SEO on-page",
      "Bàn giao trong 14 ngày",
    ],
  },
  {
    name: "Pro",
    price: "Liên hệ",
    desc: "Doanh nghiệp / Yêu cầu tùy chỉnh cao",
    color: "border-blue-500",
    badge: "",
    features: [
      "Tất cả tính năng gói Business",
      "Thiết kế UI/UX custom theo brand identity",
      "Tích hợp CRM / hệ thống quản lý riêng",
      "Đa ngôn ngữ (tiếng Việt + tiếng Anh)",
      "Tối ưu SEO chuyên sâu 3 tháng",
      "Báo cáo analytics hàng tháng",
      "Hỗ trợ ưu tiên qua Zalo 24/7",
      "Tiến độ theo thỏa thuận",
    ],
  },
];

export default function ThietKeWebsitePage() {
  return (
    <>
      {/* Schema: Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Thiết Kế Website WordPress Chuyên Nghiệp",
            provider: {
              "@type": "LocalBusiness",
              name: "Sơn Xin Chào",
              url: "https://www.sonxinchao.com",
              telephone: "0968806360",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Long Thành",
                addressRegion: "Đồng Nai",
                addressCountry: "VN",
              },
            },
            areaServed: [
              "Long Thành",
              "Nhơn Trạch",
              "Biên Hòa",
              "Đồng Nai",
              "TP. Hồ Chí Minh",
            ],
            description:
              "Dịch vụ thiết kế website WordPress chuyên nghiệp chuẩn SEO, tích hợp WooCommerce bán hàng, tối ưu AI tại Long Thành, Đồng Nai.",
            offers: {
              "@type": "Offer",
              priceCurrency: "VND",
              price: "3500000",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                unitText: "dự án",
              },
            },
          }),
        }}
      />
      {/* Schema: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <Navbar />

      <main className="bg-white min-h-screen">

        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 text-white pt-28 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              💻 Dịch vụ thiết kế website #1 tại Long Thành, Đồng Nai
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Thiết Kế Website{" "}
              <span className="text-yellow-300">WordPress</span>
              <br />
              Chuẩn SEO · Bán Hàng · Tối Ưu AI
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto mb-8">
              Website chuyên nghiệp, chuẩn Google, tích hợp WooCommerce bán hàng online — bàn giao trong 7–14 ngày. Ứng dụng AI tối ưu hiệu suất và tiết kiệm chi phí cho doanh nghiệp tại Đồng Nai.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold rounded-full text-base transition-all hover:scale-105 shadow-lg"
              >
                Tư vấn miễn phí ngay →
              </a>
              <a
                href="#bang-gia"
                className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full text-base transition-all"
              >
                Xem bảng giá
              </a>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="bg-purple-900 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "7–14", label: "Ngày bàn giao website" },
              { num: "30+", label: "Website đã triển khai" },
              { num: "95+", label: "Điểm PageSpeed trung bình" },
              { num: "100%", label: "Khách hàng hài lòng" },
            ].map((s) => (
              <div key={s.num}>
                <div className="text-2xl md:text-3xl font-extrabold text-yellow-300">
                  {s.num}
                </div>
                <div className="text-sm text-purple-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Vì sao chọn WordPress ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
              Tại Sao Chọn WordPress Cho Website Doanh Nghiệp?
            </h2>
            <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">
              WordPress chiếm 43% số website trên toàn thế giới — không phải ngẫu nhiên. Đây là nền tảng linh hoạt, dễ quản lý và cực kỳ thân thiện với SEO Google.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🔍",
                  title: "Chuẩn SEO từ nền tảng",
                  desc: "WordPress được xây dựng với cấu trúc URL sạch, heading tự động, sitemap, schema và tích hợp dễ dàng với Yoast SEO / RankMath — Google dễ crawl và index hơn.",
                },
                {
                  icon: "🛒",
                  title: "Bán hàng với WooCommerce",
                  desc: "WooCommerce là plugin thương mại điện tử số 1 thế giới. Quản lý sản phẩm, đơn hàng, kho, thanh toán VNPay/MoMo và vận chuyển — tất cả trong 1 bảng điều khiển.",
                },
                {
                  icon: "🤖",
                  title: "Tối ưu bằng AI",
                  desc: "Tôi dùng Claude, ChatGPT viết nội dung chuẩn SEO; Midjourney tạo hình ảnh chuyên nghiệp; GitHub Copilot tối ưu code — website chất lượng cao hơn, chi phí thấp hơn.",
                },
                {
                  icon: "📱",
                  title: "Responsive hoàn hảo",
                  desc: "60% traffic từ điện thoại. Mọi website tôi xây dựng đều hiển thị chuẩn trên mobile, tablet và desktop — Google ưu tiên index mobile-first.",
                },
                {
                  icon: "⚡",
                  title: "Tốc độ tải nhanh",
                  desc: "PageSpeed > 90 điểm bằng cách tối ưu hình ảnh WebP, lazy loading, caching, CDN và chọn hosting chất lượng. 1 giây tải nhanh hơn = +7% tỷ lệ chuyển đổi.",
                },
                {
                  icon: "🛡️",
                  title: "Bảo mật & ổn định",
                  desc: "HTTPS SSL miễn phí, backup tự động hàng ngày, cập nhật bảo mật thường xuyên. WordPress với cấu hình đúng là nền tảng cực kỳ ổn định và an toàn.",
                },
              ].map((i) => (
                <div
                  key={i.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                >
                  <div className="text-3xl mb-3">{i.icon}</div>
                  <h3 className="font-bold text-slate-800 mb-2">{i.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{i.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI Tools ── */}
        <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 border border-purple-200 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                🤖 Lợi thế độc quyền
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-3">
                Tối Ưu Hiệu Suất & Chi Phí Bằng AI
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Không như agency truyền thống, tôi tích hợp AI vào toàn bộ quy trình thiết kế — giúp bạn nhận được website chất lượng cao hơn với chi phí và thời gian tốt hơn.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  tool: "Claude / ChatGPT",
                  icon: "✍️",
                  use: "Viết nội dung website",
                  desc: "AI viết toàn bộ nội dung trang (giới thiệu, dịch vụ, blog, mô tả sản phẩm) chuẩn SEO, tự nhiên, đúng giọng điệu thương hiệu — tiết kiệm 60% thời gian biên soạn.",
                  color: "bg-emerald-50 border-emerald-200",
                  iconColor: "text-emerald-600",
                },
                {
                  tool: "Midjourney / DALL·E",
                  icon: "🎨",
                  use: "Tạo hình ảnh thương hiệu",
                  desc: "Tạo banner, hình minh họa dịch vụ, hình ảnh sản phẩm chuyên nghiệp mà không cần thuê photographer. Hình ảnh độc quyền, không trùng với đối thủ.",
                  color: "bg-pink-50 border-pink-200",
                  iconColor: "text-pink-600",
                },
                {
                  tool: "GitHub Copilot",
                  icon: "⚡",
                  use: "Tối ưu code & performance",
                  desc: "Code sạch hơn, ít bug hơn, tốc độ tải nhanh hơn. AI hỗ trợ viết custom CSS, JavaScript và tối ưu database query — PageSpeed luôn > 90 điểm.",
                  color: "bg-blue-50 border-blue-200",
                  iconColor: "text-blue-600",
                },
                {
                  tool: "SurferSEO / Ahrefs AI",
                  icon: "🔍",
                  use: "Nghiên cứu & tối ưu SEO",
                  desc: "AI phân tích từ khóa đối thủ, đề xuất cấu trúc nội dung, tối ưu mật độ từ khóa và internal linking — website rank Google nhanh hơn ngay từ ngày đầu.",
                  color: "bg-orange-50 border-orange-200",
                  iconColor: "text-orange-600",
                },
              ].map((t) => (
                <div
                  key={t.tool}
                  className={`rounded-2xl p-6 border ${t.color}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-3xl flex-shrink-0 ${t.iconColor}`}>
                      {t.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-slate-800">{t.tool}</span>
                        <span className="text-xs bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                          {t.use}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quy trình ── */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
              Quy Trình Thiết Kế Website Chuyên Nghiệp
            </h2>
            <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
              5 bước bài bản — từ lên ý tưởng đến bàn giao website hoạt động đầy đủ
            </p>
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Khảo sát & Tư vấn miễn phí",
                  desc: "Tôi tìm hiểu ngành nghề, đối tượng khách hàng, mục tiêu kinh doanh và đối thủ của bạn. Từ đó đề xuất cấu trúc website, tính năng cần thiết và báo giá chính xác.",
                  tag: "Ngày 1",
                },
                {
                  step: "02",
                  title: "Lên wireframe & Chọn giao diện",
                  desc: "Phác thảo bố cục trang (wireframe), chọn theme WordPress phù hợp hoặc thiết kế custom theo brand. Bạn xem và góp ý trước khi triển khai.",
                  tag: "Ngày 2–3",
                },
                {
                  step: "03",
                  title: "Xây dựng & Tích hợp tính năng",
                  desc: "Cài WordPress, cấu hình theme, tích hợp WooCommerce (nếu có), form liên hệ, Zalo chat, Google Maps, thanh toán online, plugin SEO và các tính năng theo yêu cầu.",
                  tag: "Ngày 3–10",
                },
                {
                  step: "04",
                  title: "Nhập nội dung & Tối ưu SEO",
                  desc: "AI hỗ trợ viết và nhập toàn bộ nội dung website. Cài đặt SEO on-page: title, meta description, schema markup, sitemap, robots.txt, tốc độ và Core Web Vitals.",
                  tag: "Ngày 10–13",
                },
                {
                  step: "05",
                  title: "Kiểm tra & Bàn giao",
                  desc: "Test toàn diện trên nhiều thiết bị và trình duyệt. Bàn giao tài khoản quản trị, hướng dẫn sử dụng và 3 tháng bảo hành lỗi kỹ thuật miễn phí.",
                  tag: "Ngày 14",
                },
              ].map((p) => (
                <div key={p.step} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-extrabold text-lg">
                    {p.step}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{p.title}</h3>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Gói dịch vụ bao gồm ── */}
        <section className="py-16 px-4 bg-purple-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">
              Mọi Website Đều Được Trang Bị Đầy Đủ
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Giao diện responsive chuẩn mobile / tablet / desktop",
                "Tốc độ PageSpeed > 90 điểm (Google Lighthouse)",
                "HTTPS SSL miễn phí + backup tự động",
                "SEO on-page: title, meta, H1–H3, schema markup",
                "Sitemap.xml + robots.txt chuẩn Google",
                "Form liên hệ gửi email + tích hợp Zalo OA",
                "Google Analytics 4 + Search Console",
                "Google Maps nhúng bản đồ cửa hàng",
                "Plugin bảo mật (tường lửa, chống brute force)",
                "Tối ưu hình ảnh WebP + lazy loading",
                "Hướng dẫn quản trị WordPress chi tiết",
                "Bảo hành lỗi kỹ thuật 3 tháng miễn phí",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm"
                >
                  <span className="text-purple-500 font-bold text-lg flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-slate-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bảng giá ── */}
        <section id="bang-gia" className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
              Bảng Giá Thiết Kế Website WordPress
            </h2>
            <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
              Báo giá minh bạch — không phí ẩn. Tư vấn miễn phí để chọn gói phù hợp nhất với ngân sách và mục tiêu của bạn.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`rounded-2xl border-2 ${pkg.color} p-6 flex flex-col relative ${
                    pkg.badge ? "shadow-lg scale-[1.02]" : ""
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                      {pkg.badge}
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-slate-800">
                      {pkg.name}
                    </h3>
                    <p className="text-slate-500 text-sm mt-0.5">{pkg.desc}</p>
                  </div>
                  <div className="text-3xl font-extrabold text-purple-600 mb-5">
                    {pkg.price}
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-purple-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/contact"
                    className={`block text-center py-3 rounded-full font-bold text-sm transition-all ${
                      pkg.badge
                        ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                        : "border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white"
                    }`}
                  >
                    Tư vấn &amp; Báo giá →
                  </a>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-400 text-xs mt-6">
              * Giá chưa bao gồm hosting &amp; domain (tư vấn lựa chọn phù hợp). Chi phí phát sinh được thỏa thuận rõ ràng trước khi triển khai.
            </p>
          </div>
        </section>

        {/* ── Case studies ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
              Kết Quả Thực Tế Từ Các Dự Án Website
            </h2>
            <p className="text-slate-500 text-center mb-10">
              Những con số thực từ website đã bàn giao tại Đồng Nai
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-2xl p-6 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-bold text-slate-800">
                      Showroom Xe Điện Yadea — Nhơn Trạch
                    </div>
                    <div className="text-xs text-slate-400">
                      Website bán hàng WooCommerce
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-green-600">96</div>
                    <div className="text-xs text-slate-400">PageSpeed</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-blue-600">14</div>
                    <div className="text-xs text-slate-400">Ngày BG</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-purple-600">Top 3</div>
                    <div className="text-xs text-slate-400">Google Local</div>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">
                  Website WooCommerce với 50+ sản phẩm xe điện, thanh toán online, tích hợp Google Map và blog SEO. Lên top 3 từ khóa "xe điện Nhơn Trạch" sau 4 tháng.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <div className="font-bold text-slate-800">
                      Công Ty Sửa Chữa Điện Nước — Long Thành
                    </div>
                    <div className="text-xs text-slate-400">
                      Website dịch vụ + landing page
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-green-600">92</div>
                    <div className="text-xs text-slate-400">PageSpeed</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-blue-600">7</div>
                    <div className="text-xs text-slate-400">Ngày BG</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-orange-600">+180%</div>
                    <div className="text-xs text-slate-400">Leads/tháng</div>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">
                  Landing page 5 trang với form đặt lịch dịch vụ tích hợp Zalo. Sau 3 tháng SEO on-page: +180% lượt gọi điện từ Google.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tại sao chọn tôi ── */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">
              Tại Sao Chọn Sơn Xin Chào Để Làm Website?
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  icon: "🤖",
                  title: "Tích hợp AI vào toàn bộ quy trình",
                  desc: "Không agency truyền thống nào làm điều này. AI giúp tôi tạo nội dung, hình ảnh và code nhanh gấp 3 lần — bạn nhận được website tốt hơn với chi phí hợp lý hơn.",
                },
                {
                  icon: "🔍",
                  title: "Chuyên gia SEO xây dựng website",
                  desc: "Tôi không chỉ là web developer. Với nền tảng SEO chuyên sâu, website tôi xây dựng được tối ưu để Google yêu thích ngay từ đầu — không phải làm lại sau.",
                },
                {
                  icon: "📍",
                  title: "Am hiểu thị trường địa phương",
                  desc: "Tôi ở Long Thành, Đồng Nai — hiểu rõ hành vi tìm kiếm và tâm lý khách hàng địa phương. Website được tối ưu đúng từ khóa và ngôn ngữ phù hợp với vùng.",
                },
                {
                  icon: "💬",
                  title: "Hỗ trợ trực tiếp qua Zalo",
                  desc: "Không qua tổng đài, không chatbot. Bạn nhắn thẳng Zalo cho tôi và nhận phản hồi trong vòng 2 giờ trong giờ làm việc. Nhanh, thân thiện, không vòng vo.",
                },
              ].map((i) => (
                <div
                  key={i.title}
                  className="flex gap-4 bg-slate-50 rounded-2xl p-6"
                >
                  <div className="text-3xl flex-shrink-0">{i.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1.5">{i.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {i.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">
              Câu Hỏi Thường Gặp Về Thiết Kế Website
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                >
                  <h3 className="font-bold text-slate-800 mb-2">❓ {faq.q}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 px-4 bg-gradient-to-br from-violet-700 to-indigo-800 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4">
              Bắt Đầu Dự Án Website Ngay Hôm Nay
            </h2>
            <p className="text-purple-100 mb-8 text-lg">
              Tư vấn miễn phí — không ràng buộc. Tôi sẽ phân tích nhu cầu, đề xuất giải pháp và báo giá chính xác trong 24 giờ.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://zalo.me/0968806360"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold rounded-full transition-all hover:scale-105 shadow-lg"
              >
                💬 Nhắn Zalo ngay
              </a>
              <a
                href="/contact"
                className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full transition-all"
              >
                📝 Gửi yêu cầu tư vấn
              </a>
            </div>
            <p className="text-purple-300 text-sm mt-5">
              📍 Phục vụ: Long Thành · Nhơn Trạch · Biên Hòa · Đồng Nai · Toàn quốc
            </p>
          </div>
        </section>

        {/* ── Internal links ── */}
        <section className="py-10 px-4 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-500 text-sm mb-4 font-medium">
              Xem thêm dịch vụ khác:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/dich-vu/seo"
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                🔍 Dịch vụ SEO Tổng Thể
              </a>
              <a
                href="/dich-vu/google-ads"
                className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors"
              >
                📊 Dịch vụ Google Ads
              </a>
              <a
                href="/blog"
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                📖 Blog kiến thức Website
              </a>
              <a
                href="/pricing"
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                💰 Bảng giá dịch vụ
              </a>
              <a
                href="/contact"
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
              >
                📞 Liên hệ tư vấn
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
