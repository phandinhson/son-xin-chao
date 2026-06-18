import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

export const metadata: Metadata = {
  title: "Dịch Vụ SEO Local Google Maps tại Đồng Nai & TP.HCM | Sơn Xin Chào",
  description:
    "SEO Local giúp doanh nghiệp hiển thị top Google Maps khi khách tìm kiếm gần Long Thành, Nhơn Trạch, Biên Hòa, Đồng Nai và TP.HCM. Tối ưu Google Business Profile, citation địa phương. Tư vấn miễn phí!",
  keywords:
    "SEO local Long Thành, SEO google maps Đồng Nai, SEO local TP HCM, SEO Google Maps HCM, tối ưu google business profile HCM, SEO địa phương HCM, dịch vụ SEO local, SEO near me Đồng Nai",
  alternates: {
    canonical: "https://www.sonxinchao.com/dich-vu/seo-local",
  },
  openGraph: {
    title: "Dịch Vụ SEO Local Google Maps tại Đồng Nai & TP.HCM | Sơn Xin Chào",
    description: "Lên top Google Maps, xuất hiện khi khách tìm kiếm gần bạn. Tối ưu Google Business Profile & SEO địa phương tại Đồng Nai và TP.HCM.",
    url: "https://www.sonxinchao.com/dich-vu/seo-local",
    type: "website",
  },
};

const faqs = [
  { q: "SEO Local khác SEO thường như thế nào?", a: "SEO thường tập trung lên top kết quả tìm kiếm toàn quốc. SEO Local tập trung vào 3-Pack Google Maps và kết quả địa phương — khi ai đó tìm 'dịch vụ gần đây' hoặc 'tại Long Thành', doanh nghiệp bạn hiện ra đầu tiên." },
  { q: "Mất bao lâu để lên top Google Maps?", a: "Nhanh hơn SEO thông thường. Với Google Business Profile tối ưu tốt, citation địa phương đủ mạnh và review tích cực, nhiều doanh nghiệp thấy kết quả sau 4–8 tuần." },
  { q: "Doanh nghiệp nào phù hợp SEO Local?", a: "Bất kỳ doanh nghiệp nào phục vụ khách hàng tại một khu vực cụ thể: nhà hàng, spa, phòng khám, cửa hàng bán lẻ, dịch vụ sửa chữa, bất động sản, trường học... tại Long Thành, Nhơn Trạch, Đồng Nai." },
  { q: "Google Business Profile miễn phí, tôi tự làm được không?", a: "Tạo tài khoản thì được, nhưng tối ưu thực sự cần chuyên môn: chọn đúng category, viết description có từ khóa, đăng ảnh chuẩn, xây dựng citation đồng nhất, quản lý review, đăng bài đều đặn." },
  { q: "SEO Local có giúp được doanh nghiệp không có website không?", a: "Có! Google Business Profile có thể hoạt động độc lập. Tuy nhiên có website sẽ tăng đáng kể cơ hội lên top và tỷ lệ chuyển đổi. Tôi tư vấn giải pháp phù hợp ngân sách của bạn." },
];

export default function SeoLocalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Dịch Vụ SEO Local",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Sơn Xin Chào",
          "url": "https://www.sonxinchao.com",
          "telephone": "0968806360",
          "address": { "@type": "PostalAddress", "addressLocality": "Long Thành", "addressRegion": "Đồng Nai", "addressCountry": "VN" }
        },
        "areaServed": ["Long Thành", "Nhơn Trạch", "Biên Hòa", "Đồng Nai", "TP. Hồ Chí Minh", "Thủ Đức", "Quận 7", "Bình Dương"],
        "description": "Dịch vụ SEO Local giúp doanh nghiệp lên top Google Maps và tìm kiếm địa phương"
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
      })}} />

      <Navbar />

      <main className="bg-white min-h-screen">

        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-700 text-white pt-28 pb-0 px-4 overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-5 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10 pb-20">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              📍 SEO Local #1 tại Long Thành, Đồng Nai
            </div>
            <h1 className="font-extrabold leading-tight mb-5">
              <div className="text-4xl md:text-5xl mb-2">
                Dịch Vụ <span className="text-yellow-300">SEO Local</span>
              </div>
              <div className="text-xl md:text-2xl text-emerald-100 font-semibold">
                Lên Top Google Maps · Khách Tìm Thấy Bạn Ngay
              </div>
            </h1>
            <p className="text-lg text-emerald-50 max-w-2xl mx-auto mb-8 leading-relaxed">
              Khi khách hàng tìm "<strong>dịch vụ gần Long Thành</strong>" — tên bạn xuất hiện đầu tiên trên Google Maps và kết quả tìm kiếm địa phương. Không quảng cáo, không tốn phí click.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-10 text-sm">
              {["✅ Tối ưu Google Business Profile", "✅ Lên top Google Maps", "✅ Quản lý Review", "✅ Kết quả sau 4–8 tuần"].map(b => (
                <span key={b} className="bg-white/15 border border-white/25 px-3 py-1.5 rounded-full">{b}</span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/#contact" className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-emerald-900 font-bold rounded-full text-base transition-all hover:scale-105 shadow-lg">
                Tư vấn miễn phí →
              </a>
              <a href="/#pricing" className="px-8 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full text-base transition-all">
                Xem bảng giá
              </a>
            </div>
          </div>

          {/* Wave divider */}
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
              { num: "4–8 tuần", label: "Thấy kết quả Google Maps" },
              { num: "3x", label: "Tăng lượt gọi & đến cửa hàng" },
              { num: "87%", label: "Người tìm cửa hàng gần nhất" },
              { num: "0đ", label: "Chi phí mỗi click organic" },
            ].map(s => (
              <div key={s.num}>
                <div className="text-2xl md:text-3xl font-extrabold text-emerald-600">{s.num}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Google Maps embed ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Hiển Thị Ngay Trên Google Maps</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Khi khách hàng tìm kiếm dịch vụ tại Long Thành, Nhơn Trạch hay Biên Hòa — doanh nghiệp bạn xuất hiện trong 3-Pack Google Maps. Đây là vị trí đắt giá nhất, miễn phí hoàn toàn.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31395.24168012167!2d107.00000000000001!3d10.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d9a1bbba2bdf%3A0x7e5d10b1fc7b6ec8!2sLong%20Th%C3%A0nh%2C%20%C4%90%E1%BB%93ng%20Nai!5e0!3m2!1svi!2svn!4v1720000000000!5m2!1svi!2svn"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ Long Thành Đồng Nai"
                />
                <div className="bg-white px-4 py-3 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">📍 Sơn Xin Chào – Digital Marketing</p>
                  <p className="text-xs text-gray-500 mt-0.5">Long Thành, Đồng Nai · sonxinchao.com</p>
                </div>
              </div>

              {/* 3-Pack visual */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-700 mb-4">3 Vị Trí Vàng Google Maps</h3>
                {[
                  { rank: "1", name: "Doanh nghiệp của bạn ✨", reviews: "4.9 ⭐⭐⭐⭐⭐ (127)", highlight: true },
                  { rank: "2", name: "Đối thủ A", reviews: "4.2 ⭐⭐⭐⭐ (43)", highlight: false },
                  { rank: "3", name: "Đối thủ B", reviews: "3.8 ⭐⭐⭐ (18)", highlight: false },
                ].map(r => (
                  <div key={r.rank} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    r.highlight
                      ? "bg-emerald-50 border-emerald-200 shadow-sm"
                      : "bg-white border-gray-200 opacity-70"
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      r.highlight ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}>{r.rank}</div>
                    <div>
                      <p className={`text-sm font-semibold ${r.highlight ? "text-emerald-800" : "text-gray-600"}`}>{r.name}</p>
                      <p className="text-xs text-gray-500">{r.reviews}</p>
                    </div>
                    {r.highlight && <span className="ml-auto text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">Mục tiêu</span>}
                  </div>
                ))}
                <p className="text-xs text-gray-400 mt-2 text-center">Đây là mô phỏng — vị trí thực tế phụ thuộc tối ưu hóa</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Dịch vụ bao gồm ── */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">SEO Local Bao Gồm Những Gì?</h2>
            <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto">
              Hệ thống tối ưu toàn diện — từ Google Business Profile đến citation mạng địa phương
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: "🗺️", title: "Tối ưu Google Business Profile", desc: "Setup/cập nhật đầy đủ: tên, địa chỉ, SĐT, giờ mở cửa, category đúng, ảnh chất lượng, mô tả có từ khóa." },
                { icon: "⭐", title: "Quản lý Review & Rating", desc: "Chiến lược thu thập review 5 sao từ khách hàng thực. Phản hồi review chuyên nghiệp. Xử lý review tiêu cực." },
                { icon: "📋", title: "Xây dựng Local Citation", desc: "Đăng ký thông tin NAP (Name-Address-Phone) đồng nhất trên 30+ directory: Foody, Zalo, Facebook, Yelp..." },
                { icon: "🔑", title: "Nghiên cứu từ khóa Local", desc: "Tìm từ khóa có ý định địa phương cao: 'dịch vụ X tại Long Thành', 'X gần đây', 'X Đồng Nai' với volume thực." },
                { icon: "📄", title: "Tối ưu trang địa phương", desc: "Tạo landing page riêng cho từng khu vực: Long Thành, Nhơn Trạch, Biên Hòa. Schema LocalBusiness chuẩn." },
                { icon: "📸", title: "Tối ưu ảnh & hình ảnh", desc: "Ảnh cửa hàng, sản phẩm, đội ngũ đúng chuẩn Google. Geotagging ảnh. Alt text có từ khóa địa phương." },
                { icon: "📊", title: "Tracking & Báo cáo", desc: "Theo dõi thứ hạng Maps, lượt xem GBP, lượt gọi, lượt chỉ đường. Báo cáo chi tiết mỗi tháng." },
                { icon: "🏗️", title: "Tối ưu Website Local SEO", desc: "Chèn schema LocalBusiness, NAP consistent, Google Maps embed, tối ưu tốc độ tải trang mobile." },
              ].map(s => (
                <div key={s.title} className="flex gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="text-2xl flex-shrink-0 mt-0.5">{s.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">{s.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quy trình ── */}
        <section className="py-16 px-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-3 text-center">Quy Trình 5 Bước Triển Khai</h2>
            <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">Từ setup đến duy trì kết quả lâu dài — minh bạch từng bước</p>
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { step: "01", icon: "🔍", title: "Audit", desc: "Kiểm tra GBP, citation, website, đối thủ địa phương" },
                { step: "02", icon: "⚙️", title: "Setup", desc: "Tối ưu GBP, tạo citation, chỉnh website Local SEO" },
                { step: "03", icon: "⭐", title: "Review", desc: "Triển khai chiến lược thu thập review 5 sao" },
                { step: "04", icon: "📝", title: "Content", desc: "Đăng bài GBP, bài blog địa phương hàng tuần" },
                { step: "05", icon: "📊", title: "Báo cáo", desc: "Theo dõi thứ hạng & tối ưu liên tục mỗi tháng" },
              ].map((p, i) => (
                <div key={p.step} className="relative text-center">
                  {i < 4 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-emerald-500/30" />}
                  <div className="relative z-10 w-16 h-16 mx-auto mb-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
                    {p.icon}
                  </div>
                  <div className="text-xs font-bold text-emerald-400 mb-1">{p.step}</div>
                  <h3 className="font-bold text-white text-sm mb-1">{p.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Dành cho ai ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">SEO Local Phù Hợp Doanh Nghiệp Nào?</h2>
            <p className="text-slate-500 text-center mb-10">Bất kỳ doanh nghiệp nào có địa chỉ cụ thể và phục vụ khách hàng địa phương</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🏠", name: "Bất động sản" },
                { icon: "🍜", name: "Nhà hàng / Quán ăn" },
                { icon: "💇", name: "Spa / Salon tóc" },
                { icon: "🏥", name: "Phòng khám / Nha khoa" },
                { icon: "🔧", name: "Dịch vụ sửa chữa" },
                { icon: "🏫", name: "Trường học / Trung tâm" },
                { icon: "🛒", name: "Cửa hàng bán lẻ" },
                { icon: "🏗️", name: "Xây dựng / Nội thất" },
              ].map(b => (
                <div key={b.name} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all text-center">
                  <span className="text-3xl">{b.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center">Câu Hỏi Thường Gặp</h2>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
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
        <section className="py-20 px-4 bg-gradient-to-br from-emerald-700 to-teal-800 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #34d399 0%, transparent 50%), radial-gradient(circle at 70% 50%, #06b6d4 0%, transparent 50%)" }} />
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="text-5xl mb-5">📍</div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Đặt Tên Bạn Lên Top Google Maps</h2>
            <p className="text-emerald-100 text-lg mb-8">
              Miễn phí audit Google Business Profile hiện tại + đề xuất cải thiện ngay hôm nay.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/#contact" className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-emerald-900 font-bold rounded-full text-lg transition-all hover:scale-105 shadow-xl">
                Nhận audit miễn phí →
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
