import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

export const metadata: Metadata = {
  title: "Dịch Vụ TikTok Ads tại Đồng Nai & TP.HCM | Sơn Xin Chào",
  description:
    "Chạy quảng cáo TikTok Ads hiệu quả tại Long Thành, Đồng Nai và TP.HCM. Tiếp cận hàng triệu khách hàng trẻ, chi phí thấp, viral cao. Tư vấn chiến lược & sản xuất content TikTok. Tư vấn miễn phí!",
  keywords:
    "TikTok Ads Long Thành, quảng cáo TikTok Đồng Nai, dịch vụ TikTok Ads TP HCM, TikTok Ads HCM, chạy TikTok Ads Đồng Nai, quảng cáo TikTok hiệu quả, TikTok marketing HCM",
  alternates: {
    canonical: "https://www.sonxinchao.com/dich-vu/tiktok-ads",
  },
  openGraph: {
    title: "Dịch Vụ TikTok Ads tại Đồng Nai & TP.HCM | Sơn Xin Chào",
    description: "Tiếp cận hàng triệu người dùng TikTok. CPM thấp hơn Facebook 40%. Chiến lược TikTok Ads + content viral tại Long Thành, Đồng Nai và TP.HCM.",
    url: "https://www.sonxinchao.com/dich-vu/tiktok-ads",
    type: "website",
  },
};

const faqs = [
  {
    q: "TikTok Ads phù hợp với ngành nào?",
    a: "TikTok đặc biệt hiệu quả với: thời trang, làm đẹp, ẩm thực, giáo dục, sức khỏe, xe cộ, bất động sản. Đối tượng chủ yếu 18–35 tuổi. Nếu sản phẩm/dịch vụ của bạn hướng đến giới trẻ, TikTok Ads rất tiềm năng."
  },
  {
    q: "Ngân sách tối thiểu để chạy TikTok Ads?",
    a: "TikTok yêu cầu tối thiểu 50 USD/ngày cho campaign level và 20 USD/ngày cho ad group. Tuy nhiên với ngân sách 5–10 triệu/tháng đã có thể test hiệu quả. Chi phí/1000 lượt hiển thị thường thấp hơn Facebook 30–50%."
  },
  {
    q: "Tôi có cần tài khoản TikTok nhiều followers không?",
    a: "Không cần! TikTok Ads chạy qua TikTok Ads Manager riêng biệt, không phụ thuộc số followers. Tuy nhiên có tài khoản TikTok hoạt động tốt sẽ hỗ trợ tốt hơn cho chiến dịch Spark Ads (boost video organic)."
  },
  {
    q: "TikTok Ads có tốt hơn Facebook Ads không?",
    a: "Không có cái nào tốt hơn tuyệt đối — phụ thuộc vào ngành và đối tượng. TikTok có CPM thấp hơn, reach organic cao hơn, phù hợp content video sáng tạo. Facebook có targeting chi tiết hơn, phù hợp nhiều ngành hơn. Combo 2 kênh thường hiệu quả nhất."
  },
  {
    q: "Tôi không có video quảng cáo — có chạy được không?",
    a: "Được! TikTok có Smart Video tool tự tạo video từ ảnh sản phẩm. Hoặc tôi có thể tư vấn cách quay video đơn giản bằng điện thoại, đủ chất lượng để chạy Ads hiệu quả mà không cần thuê ekip sản xuất tốn kém."
  },
];

const adTypes = [
  { icon: "🎬", title: "In-Feed Ads", desc: "Video quảng cáo xuất hiện tự nhiên trong feed For You Page. Người dùng có thể like, share, comment. Phù hợp nhất để tăng brand awareness và traffic.", tag: "Phổ biến nhất", tagColor: "bg-pink-100 text-pink-700" },
  { icon: "✨", title: "Spark Ads", desc: "Boost video organic của Fanpage TikTok thành quảng cáo trả phí. Giữ được social proof (like, comment thật). Trông tự nhiên hơn, hiệu quả cao hơn.", tag: "Hiệu quả cao", tagColor: "bg-orange-100 text-orange-700" },
  { icon: "🏆", title: "TopView Ads", desc: "Video xuất hiện đầu tiên khi mở app TikTok. Reach cực lớn, phù hợp launch sản phẩm mới, event lớn. Ấn tượng mạnh, tỷ lệ xem rất cao.", tag: "Brand launch", tagColor: "bg-violet-100 text-violet-700" },
  { icon: "🛒", title: "TikTok Shopping Ads", desc: "Kết nối TikTok Shop hoặc website thương mại điện tử. Hiển thị sản phẩm trực tiếp, người dùng mua hàng ngay trong app không cần thoát ra.", tag: "Bán hàng", tagColor: "bg-green-100 text-green-700" },
];

const whyItems = [
  { icon: "💸", title: "Chi phí quảng cáo rẻ hơn", desc: "CPM TikTok thấp hơn Facebook 30–50%, đặc biệt với ngành thời trang, làm đẹp, ẩm thực. Tiếp cận nhiều người hơn với cùng ngân sách.", color: "from-pink-500 to-rose-600" },
  { icon: "🔥", title: "Thuật toán ưu tiên nội dung hay", desc: "Video hay có thể viral dù tài khoản 0 followers. Organic reach cực cao — kết hợp Ads tăng tốc hiệu quả lên gấp 3–5 lần.", color: "from-orange-500 to-amber-600" },
  { icon: "🎯", title: "Đối tượng trẻ & sức mua cao", desc: "18–34 tuổi chiếm 60% người dùng TikTok VN. Nhóm này quyết định mua hàng nhanh, bị ảnh hưởng bởi trend mạnh.", color: "from-violet-500 to-purple-600" },
  { icon: "🛍️", title: "TikTok Shop tích hợp", desc: "Mua hàng ngay trong app không cần thoát ra. TikTok Shop đang bùng nổ tại Việt Nam — cơ hội lớn cho seller và thương hiệu.", color: "from-green-500 to-emerald-600" },
  { icon: "📱", title: "Video ngắn = Chi phí thấp", desc: "Không cần ekip sản xuất phức tạp. Video 15–60 giây quay bằng điện thoại đã đủ hiệu quả nếu nội dung đúng hướng.", color: "from-blue-500 to-cyan-600" },
  { icon: "🌊", title: "Xu hướng đang lên mạnh", desc: "Nhiều ngành tại Đồng Nai chưa khai thác TikTok Ads — cơ hội cạnh tranh thấp, chi phí vẫn còn rẻ. Vào sớm = lợi thế lớn.", color: "from-fuchsia-500 to-pink-600" },
];

const included = [
  "Thiết lập TikTok Ads Manager & Business Center",
  "Cài đặt TikTok Pixel tracking",
  "Nghiên cứu đối tượng & interest targeting",
  "Tư vấn kịch bản video quảng cáo hiệu quả",
  "Viết script & caption cho video Ads",
  "Tối ưu creative (hook 3 giây đầu quan trọng nhất)",
  "A/B test nhiều creative song song",
  "Quản lý ngân sách & bid strategy",
  "Báo cáo hiệu quả hàng tuần (view, CTR, CPA)",
  "Tư vấn nội dung TikTok organic song song",
  "Hỗ trợ kết nối TikTok Shop (nếu có)",
  "Hỗ trợ Zalo trong giờ làm việc",
];

export default function TikTokAdsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Service",
        "name": "Dịch Vụ Quảng Cáo TikTok Ads",
        "provider": { "@type": "LocalBusiness", "name": "Sơn Xin Chào", "url": "https://www.sonxinchao.com", "telephone": "0968806360",
          "address": { "@type": "PostalAddress", "addressLocality": "Long Thành", "addressRegion": "Đồng Nai", "addressCountry": "VN" }
        },
        "areaServed": ["Long Thành", "Nhơn Trạch", "Biên Hòa", "Đồng Nai", "TP. Hồ Chí Minh", "Thủ Đức", "Quận 7", "Bình Dương"],
        "description": "Dịch vụ quảng cáo TikTok Ads chuyên nghiệp, tiếp cận giới trẻ, chi phí thấp tại Đồng Nai",
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
      })}} />

      <Navbar />
      <main className="bg-white min-h-screen">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden pt-24 pb-0 px-4">
          {/* Gradient background — sáng hơn, rõ hơn */}
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 via-pink-500 to-rose-500" />
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-violet-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
          <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] bg-yellow-300/15 rounded-full blur-2xl" />

          <div className="relative max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 text-white text-sm font-medium">
                <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                🎵 TikTok Ads — Nền tảng tăng trưởng nhanh nhất 2026
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="font-extrabold text-white leading-tight tracking-tight mb-5">
                <div className="text-4xl md:text-6xl mb-2">
                  Dịch Vụ{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-yellow-200 drop-shadow-lg">TikTok Ads</span>
                    <span className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-300 rounded-full opacity-60" />
                  </span>
                </div>
                <div className="text-xl md:text-3xl text-white/90 whitespace-nowrap">
                  Viral · Rẻ · Hiệu Quả
                </div>
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Tiếp cận hàng triệu người dùng TikTok tại Đồng Nai và toàn quốc.<br />
                CPM thấp hơn Facebook 30–50%. Content viral kết hợp quảng cáo — bùng nổ doanh số.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="https://zalo.me/0968806360" target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-pink-600 hover:bg-yellow-50 font-bold rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-black/20 text-base">
                <span className="text-xl">💬</span>
                Tư vấn miễn phí ngay
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </a>
              <a href="/#pricing"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-2xl transition-all text-base">
                Xem bảng giá
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {["✅ Không cần hợp đồng dài hạn", "⚡ Chạy trong 48h", "📊 Báo cáo hàng tuần", "🎯 Cam kết có kết quả"].map(b => (
                <span key={b} className="bg-white/20 backdrop-blur-sm border border-white/25 text-white text-xs px-3 py-1.5 rounded-full font-medium">{b}</span>
              ))}
            </div>
          </div>

          {/* Wave divider */}
          <div className="relative">
            <svg viewBox="0 0 1440 80" className="w-full block" preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { num: "20M+", label: "Người dùng TikTok tại VN", icon: "👥", color: "from-pink-500 to-rose-600" },
                { num: "50%", label: "CPM thấp hơn Facebook", icon: "💰", color: "from-orange-500 to-amber-600" },
                { num: "90ph", label: "Thời gian xem TikTok/ngày", icon: "⏱️", color: "from-violet-500 to-purple-600" },
                { num: "6x", label: "Engagement so với Instagram", icon: "🔥", color: "from-fuchsia-500 to-pink-600" },
              ].map(s => (
                <div key={s.num} className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200/60 text-center group hover:shadow-lg transition-all duration-300">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mx-auto mb-3`}>{s.icon}</div>
                  <div className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-br ${s.color} bg-clip-text text-transparent leading-none mb-1`}>{s.num}</div>
                  <div className="text-slate-500 text-xs leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY TIKTOK ── */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">Lý do bùng nổ</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">Tại Sao TikTok Ads Đang Bùng Nổ?</h2>
              <p className="text-slate-500 max-w-xl mx-auto">TikTok không chỉ là mạng giải trí — đó là kênh mua sắm và khám phá sản phẩm hàng đầu 2026</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {whyItems.map(item => (
                <div key={item.title} className="group flex gap-4 p-5 rounded-2xl border border-slate-100 bg-white hover:border-pink-200 hover:shadow-md transition-all duration-300">
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shadow-sm`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1 text-sm group-hover:text-pink-600 transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AD TYPES ── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">Format quảng cáo</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">Các Loại TikTok Ads Tôi Quản Lý</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Mỗi format phù hợp với mục tiêu và ngân sách khác nhau</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {adTypes.map(t => (
                <div key={t.title}
                  className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-pink-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-fuchsia-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {t.icon}
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${t.tagColor}`}>{t.tag}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 text-base group-hover:text-pink-600 transition-colors">{t.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INCLUDED ── */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 via-pink-500 to-rose-500" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl" />
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase border border-white/25">Trọn gói dịch vụ</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Dịch Vụ Bao Gồm</h2>
              <p className="text-white/80">Tất cả trong một gói — không phát sinh chi phí ẩn</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {included.map(item => (
                <div key={item} className="flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3.5 group hover:bg-white/25 transition-all">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-fuchsia-100 text-fuchsia-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">Giải đáp thắc mắc</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">Câu Hỏi Thường Gặp</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-pink-200 hover:shadow-md transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-extrabold flex-shrink-0 mt-0.5">Q</div>
                      <h3 className="font-bold text-slate-800 text-base">{faq.q}</h3>
                    </div>
                    <div className="flex items-start gap-3 mt-3">
                      <div className="w-7 h-7 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm font-extrabold flex-shrink-0">A</div>
                      <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute inset-0 opacity-40" style={{backgroundImage: "radial-gradient(circle at 20% 50%, #ec4899 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 50%), radial-gradient(circle at 60% 80%, #f43f5e 0%, transparent 40%)"}} />
          <div className="relative max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm mb-6">
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
              Phản hồi trong 2 giờ làm việc
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Bắt Đầu TikTok Ads<br />
              <span className="bg-gradient-to-r from-pink-300 to-fuchsia-300 bg-clip-text text-transparent">Ngay Hôm Nay!</span>
            </h2>
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">
              Tư vấn miễn phí — tôi phân tích tiềm năng TikTok cho ngành của bạn<br className="hidden md:block" />
              và đề xuất chiến lược phù hợp trong 24 giờ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="https://zalo.me/0968806360" target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-400 hover:to-fuchsia-400 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-pink-900/30 text-base">
                <span className="text-lg">💬</span>
                Nhắn Zalo ngay
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </a>
              <a href="/contact"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl transition-all text-base">
                <span>📝</span>
                Gửi yêu cầu tư vấn
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-slate-400 text-sm">
              <span>📍 Long Thành</span>
              <span className="text-slate-600">·</span>
              <span>Nhơn Trạch</span>
              <span className="text-slate-600">·</span>
              <span>Biên Hòa</span>
              <span className="text-slate-600">·</span>
              <span>Đồng Nai</span>
              <span className="text-slate-600">·</span>
              <span>Toàn quốc</span>
            </div>
          </div>
        </section>

        {/* ── Internal links ── */}
        <section className="py-10 px-4 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">Xem thêm dịch vụ khác</p>
            <div className="flex flex-wrap gap-3">
              <a href="/dich-vu/seo" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 hover:shadow-sm transition-all">🔍 SEO Tổng Thể</a>
              <a href="/dich-vu/google-ads" className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-100 hover:shadow-sm transition-all">📊 Google Ads</a>
              <a href="/dich-vu/facebook-ads" className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 hover:shadow-sm transition-all">📘 Facebook Ads</a>
              <a href="/dich-vu/thiet-ke-website" className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-100 hover:shadow-sm transition-all">💻 Thiết kế Website</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
