import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

export const metadata: Metadata = {
  title: "Dịch Vụ Google Ads tại Đồng Nai & TP.HCM | Sơn Xin Chào",
  description:
    "Chạy quảng cáo Google Ads hiệu quả tại Long Thành, Đồng Nai và TP.HCM. Thiết lập, tối ưu chiến dịch Search, Display, Shopping. ROAS trung bình 4–6x. Tư vấn miễn phí!",
  keywords:
    "Google Ads Long Thành, chạy quảng cáo Google Đồng Nai, dịch vụ Google Ads TP HCM, Google Ads HCM, quảng cáo Google Ads Bình Dương, dịch vụ Google Ads Đồng Nai, tối ưu Google Ads, quảng cáo Google tìm kiếm",
  alternates: {
    canonical: "https://www.sonxinchao.com/dich-vu/google-ads",
  },
  openGraph: {
    title: "Dịch Vụ Google Ads tại Đồng Nai & TP.HCM | Sơn Xin Chào",
    description: "ROAS trung bình 4–6x. Quản lý Google Ads Search, Display, Shopping chuyên nghiệp tại Long Thành, Đồng Nai và TP.HCM.",
    url: "https://www.sonxinchao.com/dich-vu/google-ads",
    type: "website",
  },
};

const faqs = [
  {
    q: "Chi phí tối thiểu để chạy Google Ads là bao nhiêu?",
    a: "Ngân sách quảng cáo tối thiểu đề xuất từ 3–5 triệu/tháng để có đủ data tối ưu. Phí quản lý dịch vụ tính riêng. Tôi sẽ tư vấn ngân sách phù hợp theo ngành và mục tiêu của bạn."
  },
  {
    q: "Google Ads có kết quả ngay không?",
    a: "Có! Khác với SEO, Google Ads có thể mang traffic và lead ngay trong 24–48 giờ sau khi chiến dịch được duyệt. Tuy nhiên cần 2–4 tuần để thuật toán học và tối ưu hiệu quả nhất."
  },
  {
    q: "ROAS 4–6x nghĩa là gì?",
    a: "ROAS (Return on Ad Spend) = doanh thu / chi phí quảng cáo. ROAS 4x có nghĩa là bỏ 1 triệu quảng cáo thu về 4 triệu doanh thu. Trung bình các dự án tôi quản lý đạt ROAS 4–6x."
  },
  {
    q: "Tôi có thể tự quản lý Google Ads không?",
    a: "Bạn có thể tự học, nhưng sẽ mất nhiều thời gian và ngân sách để tối ưu. Sai lầm phổ biến là bỏ quảng cáo sai từ khóa, sai đối tượng dẫn đến CPA cao. Thuê chuyên gia tiết kiệm hơn về dài hạn."
  },
  {
    q: "Dịch vụ Google Ads có bao gồm thiết kế banner không?",
    a: "Có! Gói Growth và Pro bao gồm thiết kế banner cho Display Ads, Remarketing. Tôi thiết kế theo chuẩn kích thước của Google, đảm bảo tỷ lệ click cao."
  },
];

export default function GoogleAdsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Dịch Vụ Google Ads",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Sơn Xin Chào",
              "url": "https://www.sonxinchao.com",
              "telephone": "0968806360",
              "address": { "@type": "PostalAddress", "addressLocality": "Long Thành", "addressRegion": "Đồng Nai", "addressCountry": "VN" }
            },
            "areaServed": ["Long Thành", "Nhơn Trạch", "Biên Hòa", "Đồng Nai", "TP. Hồ Chí Minh", "Thủ Đức", "Quận 7", "Bình Dương"],
            "description": "Dịch vụ quảng cáo Google Ads chuyên nghiệp, tối ưu ROAS cho doanh nghiệp tại Đồng Nai",
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
        <section className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 text-white pt-28 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              📊 Quản lý Google Ads chuyên nghiệp tại Long Thành, Đồng Nai
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Dịch Vụ <span className="text-yellow-300">Google Ads</span><br />
              Sinh Lời Ngay Từ Ngày Đầu
            </h1>
            <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto mb-8">
              ROAS trung bình 4–6x. Quản lý toàn diện Google Search Ads, Display, Shopping & Remarketing cho doanh nghiệp tại Long Thành, Đồng Nai.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://zalo.me/0968806360" target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-full text-base transition-all hover:scale-105 shadow-lg">
                💬 Tư vấn miễn phí ngay
              </a>
              <a href="/#pricing"
                className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full text-base transition-all">
                Xem bảng giá
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-green-900 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "4–6x", label: "ROAS trung bình đạt được" },
              { num: "40%", label: "Giảm CPA trung bình" },
              { num: "48h", label: "Bắt đầu có traffic" },
              { num: "50+", label: "Chiến dịch đã quản lý" },
            ].map(s => (
              <div key={s.num}>
                <div className="text-2xl md:text-3xl font-extrabold text-yellow-300">{s.num}</div>
                <div className="text-sm text-green-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Loại hình quảng cáo */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">Các Loại Google Ads Tôi Quản Lý</h2>
            <p className="text-slate-500 text-center mb-10">Mỗi loại hình phù hợp với mục tiêu khác nhau — tôi sẽ tư vấn combo tối ưu nhất cho doanh nghiệp bạn</p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: "🔍", title: "Search Ads (Quảng cáo tìm kiếm)",
                  desc: "Hiển thị khi khách hàng tìm kiếm trực tiếp sản phẩm/dịch vụ của bạn. Tỷ lệ chuyển đổi cao nhất vì đúng thời điểm có nhu cầu.",
                  tags: ["Phù hợp mọi ngành", "Kết quả nhanh", "Tỷ lệ chuyển đổi cao"]
                },
                {
                  icon: "🖼️", title: "Display Ads (Quảng cáo hiển thị)",
                  desc: "Banner quảng cáo xuất hiện trên 2 triệu website đối tác Google. Tăng nhận diện thương hiệu, remarketing khách đã ghé thăm.",
                  tags: ["Brand awareness", "Remarketing", "Chi phí thấp/click"]
                },
                {
                  icon: "🛒", title: "Shopping Ads (Quảng cáo mua sắm)",
                  desc: "Hiển thị sản phẩm với hình ảnh, giá trực tiếp trên Google Search. Phù hợp shop online, sàn thương mại điện tử.",
                  tags: ["Shop online", "E-commerce", "CTR cao"]
                },
                {
                  icon: "🎯", title: "Remarketing (Tiếp thị lại)",
                  desc: "Nhắm lại khách đã xem website nhưng chưa mua. Tỷ lệ chuyển đổi cao hơn 3–5x so với chiến dịch thông thường.",
                  tags: ["Tỷ lệ chuyển đổi cao", "Chi phí thấp", "Tăng doanh thu"]
                },
              ].map(t => (
                <div key={t.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <h3 className="font-bold text-slate-800 mb-2">{t.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-3">{t.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {t.tags.map(tag => (
                      <span key={tag} className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quy trình */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-12 text-center">Quy Trình Triển Khai Google Ads</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { step: "01", title: "Phân tích & Lên chiến lược", desc: "Nghiên cứu thị trường, đối thủ, từ khóa. Xác định budget, mục tiêu CPA/ROAS, đối tượng mục tiêu." },
                { step: "02", title: "Thiết lập chiến dịch chuẩn", desc: "Cấu trúc Ad Groups hợp lý, viết Ad Copy hấp dẫn, cài đặt conversion tracking, cài Negative Keywords." },
                { step: "03", title: "Chạy & Thu thập data", desc: "Chiến dịch live trong 24–48h. Theo dõi chặt trong 2 tuần đầu, điều chỉnh bid, loại từ khóa không hiệu quả." },
                { step: "04", title: "Tối ưu liên tục", desc: "A/B test ad copy, tối ưu trang đích, điều chỉnh bid theo thời gian/địa điểm/thiết bị. Báo cáo hàng tuần." },
              ].map(p => (
                <div key={p.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-green-600 text-white flex items-center justify-center font-extrabold">{p.step}</div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">{p.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dịch vụ bao gồm */}
        <section className="py-16 px-4 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">Dịch Vụ Bao Gồm</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Thiết lập tài khoản Google Ads từ A–Z",
                "Nghiên cứu từ khóa & Negative keywords",
                "Viết ad copy A/B test (2–3 phiên bản/nhóm)",
                "Cài đặt Conversion Tracking (Google Tag)",
                "Thiết kế banner Display Ads (nếu cần)",
                "Tối ưu trang đích (Landing Page) tăng CVR",
                "Theo dõi & điều chỉnh bid hàng ngày",
                "Tối ưu Quality Score để giảm CPC",
                "Báo cáo hiệu quả hàng tuần (click, CPA, ROAS)",
                "Tư vấn ngân sách theo mùa vụ",
                "Hỗ trợ qua Zalo trong giờ làm việc",
                "Cập nhật theo thay đổi chính sách Google Ads",
              ].map(item => (
                <div key={item} className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm">
                  <span className="text-green-500 font-bold text-lg flex-shrink-0">✓</span>
                  <span className="text-slate-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">Câu Hỏi Thường Gặp</h2>
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
        <section className="py-16 px-4 bg-gradient-to-br from-green-700 to-emerald-900 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4">Bắt Đầu Chiến Dịch Google Ads Ngay</h2>
            <p className="text-green-100 mb-8 text-lg">Tư vấn miễn phí — tôi sẽ phân tích thị trường và đề xuất ngân sách phù hợp với doanh nghiệp bạn.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://zalo.me/0968806360" target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-full transition-all hover:scale-105 shadow-lg">
                💬 Nhắn Zalo ngay
              </a>
              <a href="/#contact" className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full transition-all">
                📝 Gửi yêu cầu tư vấn
              </a>
            </div>
            <p className="text-green-300 text-sm mt-5">📍 Phục vụ: Long Thành · Nhơn Trạch · Biên Hòa · Đồng Nai · Toàn quốc</p>
          </div>
        </section>

        <section className="py-10 px-4 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-500 text-sm mb-4 font-medium">Xem thêm dịch vụ khác:</p>
            <div className="flex flex-wrap gap-3">
              <a href="/dich-vu/seo" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">🔍 Dịch vụ SEO Tổng Thể</a>
              <a href="/dich-vu/thiet-ke-website" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">💻 Thiết kế Website</a>
              <a href="/blog" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">📖 Blog kiến thức Ads</a>
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
