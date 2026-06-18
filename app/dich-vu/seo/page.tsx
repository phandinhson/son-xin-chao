import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

export const metadata: Metadata = {
  title: "Dịch Vụ SEO Tổng Thể tại Đồng Nai & TP.HCM | Sơn Xin Chào",
  description:
    "Dịch vụ SEO lên top Google bền vững tại Long Thành, Nhơn Trạch, Đồng Nai và TP.HCM. Tối ưu SEO on-page, technical, backlink và content. Tăng 200–400% traffic sau 6 tháng. Tư vấn miễn phí!",
  keywords:
    "dịch vụ SEO Long Thành, SEO Đồng Nai, dịch vụ SEO TP HCM, SEO Thủ Đức HCM, SEO Bình Dương, SEO tổng thể, SEO website Đồng Nai, công ty SEO HCM, SEO lên top Google, dịch vụ SEO uy tín",
  alternates: {
    canonical: "https://www.sonxinchao.com/dich-vu/seo",
  },
  openGraph: {
    title: "Dịch Vụ SEO Tổng Thể tại Đồng Nai & TP.HCM | Sơn Xin Chào",
    description: "Tăng traffic organic 200–400% sau 6 tháng. SEO on-page, technical, backlink, content chuẩn Google 2026. Phục vụ Long Thành, Đồng Nai và TP.HCM.",
    url: "https://www.sonxinchao.com/dich-vu/seo",
    type: "website",
  },
};

const faqs = [
  {
    q: "Bao lâu thì thấy kết quả SEO?",
    a: "Thông thường từ 3–6 tháng để thấy kết quả rõ ràng. Tháng 1–2 tập trung kỹ thuật và content, tháng 3 bắt đầu thấy từ khóa vào top 20, tháng 4–6 từ khóa chính vào top 10."
  },
  {
    q: "SEO có đảm bảo lên top Google không?",
    a: "Không ai có thể đảm bảo 100% vì Google kiểm soát thuật toán. Tuy nhiên tôi cam kết áp dụng đúng best practice, báo cáo minh bạch và nếu sau 3 tháng không có cải thiện sẽ hoàn tiền 1 tháng phí."
  },
  {
    q: "Chi phí dịch vụ SEO tại Long Thành là bao nhiêu?",
    a: "Gói Starter từ 3.500.000đ/tháng phù hợp doanh nghiệp nhỏ. Gói Growth 7.000.000đ/tháng cho doanh nghiệp muốn tăng trưởng nhanh. Gói Pro theo yêu cầu. Tư vấn miễn phí trước khi quyết định."
  },
  {
    q: "SEO có phù hợp với doanh nghiệp nhỏ ở Đồng Nai không?",
    a: "Rất phù hợp! SEO Local là chiến lược hiệu quả nhất cho doanh nghiệp nhỏ tại địa phương vì cạnh tranh thấp hơn, chi phí hợp lý và tiếp cận đúng khách hàng gần bạn."
  },
  {
    q: "Tôi có cần thay website không khi làm SEO?",
    a: "Không nhất thiết. Tôi sẽ audit website hiện tại và chỉ đề xuất thay đổi khi thực sự cần thiết. Nhiều trường hợp chỉ cần tối ưu trên website sẵn có là đủ."
  },
];

export default function SeoServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Dịch Vụ SEO Tổng Thể",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Sơn Xin Chào",
              "url": "https://www.sonxinchao.com",
              "telephone": "0968806360",
              "address": { "@type": "PostalAddress", "addressLocality": "Long Thành", "addressRegion": "Đồng Nai", "addressCountry": "VN" }
            },
            "areaServed": ["Long Thành", "Nhơn Trạch", "Biên Hòa", "Đồng Nai", "TP. Hồ Chí Minh", "Thủ Đức", "Quận 7", "Bình Dương"],
            "description": "Dịch vụ SEO tổng thể giúp website lên top Google bền vững",
            "offers": { "@type": "Offer", "priceCurrency": "VND", "price": "3500000", "priceSpecification": { "@type": "UnitPriceSpecification", "unitText": "tháng" } }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          })
        }}
      />

      <Navbar />

      <main className="bg-white min-h-screen">

        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white pt-28 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              🔍 Dịch vụ SEO #1 tại Long Thành, Đồng Nai
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Dịch Vụ <span className="text-yellow-300">SEO Tổng Thể</span><br />
              Lên Top Google Bền Vững
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Tăng 200–400% traffic organic sau 6 tháng. Chiến lược SEO on-page, technical, backlink và content chuẩn Google cho doanh nghiệp tại Long Thành, Đồng Nai.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/contact" className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-full text-base transition-all hover:scale-105 shadow-lg">
                Tư vấn miễn phí ngay →
              </a>
              <a href="/#pricing" className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full text-base transition-all">
                Xem bảng giá
              </a>
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
              { num: "98%", label: "Khách hàng hài lòng" },
            ].map(s => (
              <div key={s.num}>
                <div className="text-2xl md:text-3xl font-extrabold text-yellow-300">{s.num}</div>
                <div className="text-sm text-blue-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Vì sao cần SEO */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">
              Tại Sao Doanh Nghiệp tại Đồng Nai Cần SEO?
            </h2>
            <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">
              92% người dùng tìm kiếm sản phẩm/dịch vụ qua Google trước khi mua. Nếu không có mặt trên trang 1 — bạn đang mất khách vào tay đối thủ mỗi ngày.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "📈", title: "Traffic bền vững", desc: "Không phụ thuộc ngân sách quảng cáo. Một khi lên top, traffic tiếp tục đến ngay cả khi bạn ngủ." },
                { icon: "🎯", title: "Đúng khách hàng tiềm năng", desc: "Người tìm kiếm 'dịch vụ SEO Long Thành' là người đang có nhu cầu thực sự — tỷ lệ chuyển đổi cao hơn quảng cáo thông thường." },
                { icon: "💰", title: "Chi phí thấp hơn dài hạn", desc: "So với Google Ads phải trả tiền liên tục, SEO là kênh có ROI tốt nhất sau 6–12 tháng và chi phí/lead ngày càng giảm." },
                { icon: "🏆", title: "Xây dựng uy tín thương hiệu", desc: "Xuất hiện top Google tạo niềm tin với khách hàng. 75% người dùng tin tưởng kết quả tự nhiên hơn quảng cáo." },
                { icon: "📍", title: "Phù hợp doanh nghiệp địa phương", desc: "SEO Local giúp bạn hiển thị khi khách tìm kiếm dịch vụ gần Long Thành, Nhơn Trạch, Đồng Nai — cạnh tranh thấp hơn nhiều so với TP.HCM." },
                { icon: "📊", title: "Đo lường được rõ ràng", desc: "Báo cáo từ khóa, traffic, thứ hạng mỗi tuần. Bạn biết chính xác tiền bỏ ra mang lại kết quả gì." },
              ].map(i => (
                <div key={i.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="text-3xl mb-3">{i.icon}</div>
                  <h3 className="font-bold text-slate-800 mb-2">{i.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{i.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quy trình */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">Quy Trình SEO Thực Chiến</h2>
            <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
              6 bước triển khai bài bản — từ phân tích đến duy trì kết quả lâu dài
            </p>
            <div className="space-y-6">
              {[
                { step: "01", title: "Audit & Phân tích toàn diện", desc: "Kiểm tra kỹ thuật website, phân tích đối thủ, đánh giá cơ hội từ khóa. Xác định điểm mạnh/yếu để lên lộ trình cụ thể.", tag: "Tuần 1" },
                { step: "02", title: "Nghiên cứu từ khóa chiến lược", desc: "Tìm 30–50 từ khóa mục tiêu dựa trên volume tìm kiếm, mức độ cạnh tranh và khả năng chuyển đổi. Ưu tiên từ khóa địa phương Long Thành, Đồng Nai.", tag: "Tuần 1–2" },
                { step: "03", title: "Tối ưu SEO On-page", desc: "Chỉnh title, meta description, H1–H3, URL, schema markup, internal linking, tốc độ tải trang, Core Web Vitals.", tag: "Tháng 1" },
                { step: "04", title: "Tối ưu Technical SEO", desc: "Sitemap, robots.txt, cấu trúc URL, canonical, sửa lỗi crawl, tối ưu mobile, HTTPS, structured data.", tag: "Tháng 1" },
                { step: "05", title: "Xây dựng Content & Backlink", desc: "Viết bài blog chuẩn SEO 1.500+ từ mỗi tuần. Xây dựng backlink chất lượng từ các trang uy tín cùng ngành.", tag: "Tháng 2–6" },
                { step: "06", title: "Theo dõi & Tối ưu liên tục", desc: "Báo cáo thứ hạng từ khóa, traffic, conversions mỗi tuần. Điều chỉnh chiến lược theo thuật toán Google mới nhất.", tag: "Hàng tháng" },
              ].map(p => (
                <div key={p.step} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg">
                    {p.step}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{p.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">{p.tag}</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dịch vụ bao gồm */}
        <section className="py-16 px-4 bg-blue-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">Gói SEO Bao Gồm Những Gì?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Audit website toàn diện (technical + content)",
                "Nghiên cứu từ khóa 30–50 keywords target",
                "Tối ưu SEO on-page tất cả trang chính",
                "Tối ưu tốc độ tải trang & Core Web Vitals",
                "Schema markup (LocalBusiness, FAQ, Article...)",
                "Tối ưu Google Business Profile",
                "Viết 2–4 bài blog chuẩn SEO mỗi tháng",
                "Xây dựng 5–10 backlinks chất lượng/tháng",
                "Báo cáo thứ hạng từ khóa hàng tuần",
                "Báo cáo traffic & conversions hàng tháng",
                "Hỗ trợ qua Zalo trong giờ làm việc",
                "Theo dõi đối thủ và cập nhật thuật toán",
              ].map(item => (
                <div key={item} className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm">
                  <span className="text-blue-500 font-bold text-lg flex-shrink-0">✓</span>
                  <span className="text-slate-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case study */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">Kết Quả Thực Tế Đã Đạt Được</h2>
            <p className="text-slate-500 text-center mb-10">Những con số thực từ các dự án SEO tại Đồng Nai</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-bold text-slate-800">Showroom Xe Điện Nhơn Trạch</div>
                    <div className="text-xs text-slate-400">Ngành: Xe điện / Yadea</div>
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
                <div className="bg-blue-50 rounded-xl px-4 py-2 text-center text-blue-700 font-bold text-sm">+340% traffic organic</div>
                <p className="text-slate-500 text-sm mt-3">SEO Local + content xe điện địa phương + Google Business Profile. Hiện top 3 từ khóa "xe điện Nhơn Trạch".</p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <div className="font-bold text-slate-800">Website Bất Động Sản Đồng Nai</div>
                    <div className="text-xs text-slate-400">Ngành: Bất động sản</div>
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
                <div className="bg-blue-50 rounded-xl px-4 py-2 text-center text-blue-700 font-bold text-sm">Top 5 từ khóa chính sau 4 tháng</div>
                <p className="text-slate-500 text-sm mt-3">Technical SEO toàn diện + tối ưu nội dung + xây dựng backlink từ các trang bất động sản uy tín.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">Câu Hỏi Thường Gặp Về SEO</h2>
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
        <section className="py-16 px-4 bg-gradient-to-br from-blue-700 to-blue-900 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4">Bắt Đầu SEO Ngay Hôm Nay</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Tư vấn miễn phí — không ràng buộc. Tôi sẽ phân tích website và đề xuất lộ trình SEO phù hợp trong 24 giờ.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://zalo.me/0968806360" target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-full transition-all hover:scale-105 shadow-lg">
                💬 Nhắn Zalo ngay
              </a>
              <a href="/contact"
                className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full transition-all">
                📝 Gửi yêu cầu tư vấn
              </a>
            </div>
            <p className="text-blue-300 text-sm mt-5">📍 Phục vụ: Long Thành · Nhơn Trạch · Biên Hòa · Đồng Nai · Toàn quốc</p>
          </div>
        </section>

        {/* Internal links */}
        <section className="py-10 px-4 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-500 text-sm mb-4 font-medium">Xem thêm dịch vụ khác:</p>
            <div className="flex flex-wrap gap-3">
              <a href="/dich-vu/google-ads" className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">📊 Dịch vụ Google Ads</a>
              <a href="/dich-vu/thiet-ke-website" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">💻 Thiết kế Website</a>
              <a href="/blog" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">📖 Blog kiến thức SEO</a>
              <a href="/#pricing" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">💰 Bảng giá dịch vụ</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBar />
    </>
  );
}
