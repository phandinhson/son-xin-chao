import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

export const metadata: Metadata = {
  title: "Thiết Kế Website WordPress tại Đồng Nai & TP.HCM | Sơn Xin Chào",
  description:
    "Thiết kế website WordPress chuẩn SEO, tốc độ cao tại Long Thành, Đồng Nai và TP.HCM. Hoàn thành trong 7–14 ngày. PageSpeed 90+, mobile responsive, bàn giao toàn bộ. Tư vấn miễn phí!",
  keywords:
    "thiết kế website Long Thành, làm website Đồng Nai, thiết kế website TP HCM, làm website HCM giá rẻ, thiết kế web WordPress HCM, website chuẩn SEO Đồng Nai, làm website doanh nghiệp HCM, thiết kế web Nhơn Trạch",
  alternates: {
    canonical: "https://www.sonxinchao.com/dich-vu/thiet-ke-website",
  },
  openGraph: {
    title: "Thiết Kế Website WordPress tại Đồng Nai & TP.HCM | Sơn Xin Chào",
    description: "Website WordPress chuẩn SEO, PageSpeed 90+, hoàn thành 7–14 ngày. Phục vụ Long Thành, Đồng Nai và TP.HCM. Bàn giao toàn bộ, hỗ trợ trọn đời.",
    url: "https://www.sonxinchao.com/dich-vu/thiet-ke-website",
    type: "website",
  },
};

const faqs = [
  {
    q: "Thiết kế website mất bao lâu?",
    a: "Website doanh nghiệp cơ bản: 7–10 ngày. Website nhiều tính năng, Landing Page chuyên sâu: 10–14 ngày. Website thương mại điện tử (WooCommerce): 14–21 ngày."
  },
  {
    q: "Tôi có thể tự chỉnh sửa nội dung sau khi bàn giao không?",
    a: "Hoàn toàn được! WordPress có giao diện quản trị thân thiện. Tôi sẽ hướng dẫn bạn tự cập nhật nội dung, thêm bài viết, thay ảnh mà không cần biết code."
  },
  {
    q: "Chi phí thiết kế website là bao nhiêu?",
    a: "Website landing page từ 3–5 triệu. Website doanh nghiệp đầy đủ từ 5–12 triệu. Website thương mại điện tử từ 12–25 triệu. Liên hệ để nhận báo giá chính xác theo yêu cầu."
  },
  {
    q: "Website có cần hosting và tên miền riêng không?",
    a: "Có. Hosting và domain là chi phí hàng năm bạn tự thanh toán (khoảng 500k–2 triệu/năm tùy gói). Tôi sẽ tư vấn và hỗ trợ đăng ký phù hợp."
  },
  {
    q: "Tại sao chọn WordPress thay vì tự code?",
    a: "WordPress chiếm 43% website toàn cầu. Dễ quản lý, hệ sinh thái plugin phong phú, cộng đồng hỗ trợ lớn, chuẩn SEO. Phù hợp 90% nhu cầu doanh nghiệp vừa và nhỏ ở Đồng Nai."
  },
];

export default function WebsiteDesignPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Dịch Vụ Thiết Kế Website WordPress",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Sơn Xin Chào",
              "url": "https://www.sonxinchao.com",
              "telephone": "0968806360",
              "address": { "@type": "PostalAddress", "addressLocality": "Long Thành", "addressRegion": "Đồng Nai", "addressCountry": "VN" }
            },
            "areaServed": ["Long Thành", "Nhơn Trạch", "Biên Hòa", "Đồng Nai", "TP. Hồ Chí Minh", "Thủ Đức", "Quận 7", "Bình Dương"],
            "description": "Thiết kế website WordPress chuẩn SEO, tốc độ cao cho doanh nghiệp tại Long Thành, Đồng Nai",
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
        <section className="bg-gradient-to-br from-violet-700 via-purple-600 to-indigo-700 text-white pt-28 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              💻 Thiết kế website chuyên nghiệp tại Long Thành, Đồng Nai
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Thiết Kế <span className="text-yellow-300">Website WordPress</span><br />
              Chuẩn SEO, Tốc Độ Cao
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto mb-8">
              Hoàn thành trong 7–14 ngày. PageSpeed 90+, mobile responsive, chuẩn SEO ngay từ đầu. Bàn giao toàn bộ, hỗ trợ trọn đời cho doanh nghiệp tại Long Thành, Đồng Nai.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://zalo.me/0968806360" target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold rounded-full text-base transition-all hover:scale-105 shadow-lg">
                💬 Tư vấn miễn phí ngay
              </a>
              <a href="/#portfolio" className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full text-base transition-all">
                Xem portfolio
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-purple-900 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "7–14", label: "Ngày hoàn thành website" },
              { num: "90+", label: "PageSpeed Insights score" },
              { num: "20+", label: "Website đã bàn giao" },
              { num: "100%", label: "Responsive mobile" },
            ].map(s => (
              <div key={s.num}>
                <div className="text-2xl md:text-3xl font-extrabold text-yellow-300">{s.num}</div>
                <div className="text-sm text-purple-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Loại website */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">Các Loại Website Tôi Thiết Kế</h2>
            <p className="text-slate-500 text-center mb-10">Từ landing page đơn giản đến website thương mại điện tử đầy đủ tính năng</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🎯", title: "Landing Page", time: "5–7 ngày",
                  price: "Từ 3 triệu",
                  features: ["1 trang dài đầy đủ thông tin", "Tối ưu chuyển đổi (CRO)", "Form liên hệ + Zalo OA", "Chuẩn SEO on-page", "Tốc độ tải nhanh"],
                  color: "border-orange-200 bg-orange-50", badge: "bg-orange-100 text-orange-700"
                },
                {
                  icon: "🏢", title: "Website Doanh Nghiệp", time: "7–14 ngày",
                  price: "Từ 5 triệu",
                  features: ["5–15 trang nội dung", "Blog / Tin tức", "Portfolio / Dịch vụ", "Tích hợp Google Map", "Chuẩn SEO toàn diện", "Admin dễ quản lý"],
                  color: "border-purple-200 bg-purple-50", badge: "bg-purple-100 text-purple-700",
                  highlight: true
                },
                {
                  icon: "🛒", title: "Website Bán Hàng", time: "14–21 ngày",
                  price: "Từ 12 triệu",
                  features: ["WooCommerce đầy đủ", "Quản lý sản phẩm/kho", "Thanh toán online", "Tích hợp VNPAY/MoMo", "Quản lý đơn hàng", "Báo cáo doanh thu"],
                  color: "border-blue-200 bg-blue-50", badge: "bg-blue-100 text-blue-700"
                },
              ].map(t => (
                <div key={t.title} className={`rounded-2xl p-6 border-2 ${t.color} relative`}>
                  {t.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Phổ biến nhất</div>
                  )}
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <h3 className="font-extrabold text-slate-800 text-lg mb-1">{t.title}</h3>
                  <div className="flex gap-2 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.badge}`}>⏱ {t.time}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.badge}`}>💰 {t.price}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {t.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="text-purple-500 font-bold">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/contact" className="mt-4 block text-center py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors">
                    Nhận báo giá →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tại sao chọn */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">Tại Sao Chọn Tôi Thiết Kế Website?</h2>
            <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">Không chỉ làm website đẹp — tôi làm website giúp bạn bán hàng và lên top Google</p>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { icon: "⚡", title: "Tốc độ tải nhanh — PageSpeed 90+", desc: "Google ưu tiên website tốc độ cao. Tôi tối ưu hình ảnh, cache, CDN để đạt PageSpeed 90+ trên cả mobile và desktop." },
                { icon: "📱", title: "Chuẩn di động 100%", desc: "60%+ traffic đến từ điện thoại. Website hoạt động hoàn hảo trên mọi màn hình — từ iPhone nhỏ đến tablet lớn." },
                { icon: "🔍", title: "Chuẩn SEO ngay từ đầu", desc: "Schema markup, meta tags, sitemap, robots.txt, URL chuẩn, heading structure — tất cả được tối ưu từ khi xây dựng." },
                { icon: "🔒", title: "Bảo mật & HTTPS", desc: "SSL miễn phí, cài plugin bảo mật, backup tự động. Website an toàn trước các cuộc tấn công phổ biến." },
                { icon: "🎨", title: "Thiết kế theo thương hiệu", desc: "Giao diện được thiết kế riêng theo màu sắc, logo và định vị thương hiệu của bạn — không dùng template đại trà." },
                { icon: "🤝", title: "Bàn giao toàn bộ + Hỗ trợ trọn đời", desc: "Bàn giao full quyền sở hữu code, database. Hỗ trợ sửa lỗi miễn phí 3 tháng sau bàn giao. Hỗ trợ kỹ thuật dài hạn." },
              ].map(i => (
                <div key={i.title} className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                  <span className="text-2xl flex-shrink-0">{i.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">{i.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{i.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quy trình */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-12 text-center">Quy Trình Thiết Kế Website</h2>
            <div className="space-y-5">
              {[
                { step: "01", title: "Tư vấn & Lên yêu cầu", desc: "Gặp mặt/Zalo trao đổi về ngành, mục tiêu, đối tượng khách hàng. Xác định cấu trúc trang, màu sắc, tính năng cần thiết.", time: "Ngày 1" },
                { step: "02", title: "Thiết kế mockup", desc: "Tôi thiết kế giao diện mẫu (Figma/Canva) để bạn xem trước. Góp ý và chỉnh sửa đến khi hài lòng.", time: "Ngày 2–3" },
                { step: "03", title: "Lập trình & Xây dựng", desc: "Code website trên WordPress với theme phù hợp, cài plugin cần thiết, nhập nội dung, tối ưu SEO và tốc độ.", time: "Ngày 4–10" },
                { step: "04", title: "Test & Chỉnh sửa", desc: "Kiểm tra trên mọi thiết bị, trình duyệt. Test form, tốc độ, SEO. Sửa theo feedback của bạn.", time: "Ngày 11–13" },
                { step: "05", title: "Bàn giao & Hướng dẫn", desc: "Upload lên hosting thật, kết nối domain. Hướng dẫn bạn tự quản lý nội dung. Bàn giao toàn bộ tài khoản.", time: "Ngày 14" },
              ].map(p => (
                <div key={p.step} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-extrabold text-lg">{p.step}</div>
                  <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{p.title}</h3>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">{p.time}</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">Câu Hỏi Thường Gặp</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-2">❓ {faq.q}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-violet-700 to-indigo-900 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4">Nhận Báo Giá Thiết Kế Website</h2>
            <p className="text-purple-100 mb-8 text-lg">Tư vấn miễn phí — tôi sẽ đề xuất giải pháp website phù hợp nhất với ngân sách và mục tiêu của bạn.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://zalo.me/0968806360" target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold rounded-full transition-all hover:scale-105 shadow-lg">
                💬 Nhắn Zalo ngay
              </a>
              <a href="/contact" className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full transition-all">
                📝 Gửi yêu cầu tư vấn
              </a>
            </div>
            <p className="text-purple-300 text-sm mt-5">📍 Phục vụ: Long Thành · Nhơn Trạch · Biên Hòa · Đồng Nai · Toàn quốc</p>
          </div>
        </section>

        <section className="py-10 px-4 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-500 text-sm mb-4 font-medium">Xem thêm dịch vụ khác:</p>
            <div className="flex flex-wrap gap-3">
              <a href="/dich-vu/seo" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">🔍 Dịch vụ SEO Tổng Thể</a>
              <a href="/dich-vu/google-ads" className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">📊 Dịch vụ Google Ads</a>
              <a href="/blog" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">📖 Blog kiến thức Website</a>
              <a href="/#portfolio" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">🗂️ Xem Portfolio</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBar />
    </>
  );
}
