import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 60;

async function getPageData() {
  try {
    const db = supabaseAdmin();
    const { data } = await db.from("site_settings").select("value").eq("key", "page_facebook_ads").single();
    if (data?.value) return JSON.parse(data.value);
  } catch { /* fallback */ }
  return null;
}

export const metadata: Metadata = {
  title: "Dịch Vụ Facebook Ads tại Đồng Nai & TP.HCM | Sơn Xin Chào",
  description:
    "Chạy quảng cáo Facebook Ads hiệu quả tại Long Thành, Đồng Nai và TP.HCM. Target đúng khách hàng, tối ưu chi phí, tăng doanh số. ROAS trung bình 4–6x. Tư vấn miễn phí!",
  keywords:
    "Facebook Ads Long Thành, quảng cáo Facebook Đồng Nai, chạy Facebook Ads TP HCM, dịch vụ Facebook Ads HCM, Meta Ads HCM, quảng cáo Facebook Đồng Nai, Facebook Ads Bình Dương, quảng cáo Facebook hiệu quả",
  alternates: {
    canonical: "https://www.sonxinchao.com/dich-vu/facebook-ads",
  },
  openGraph: {
    title: "Dịch Vụ Facebook Ads tại Đồng Nai & TP.HCM | Sơn Xin Chào",
    description: "Target đúng khách hàng tiềm năng. Tối ưu ROAS 4–6x. Quản lý Facebook & Instagram Ads tại Long Thành, Đồng Nai và TP.HCM.",
    url: "https://www.sonxinchao.com/dich-vu/facebook-ads",
    type: "website",
  },
};

const faqs = [
  {
    q: "Ngân sách tối thiểu để chạy Facebook Ads hiệu quả?",
    a: "Tối thiểu 3–5 triệu/tháng ngân sách quảng cáo để có đủ data tối ưu. Với ngành cạnh tranh cao (bất động sản, xe hơi) nên từ 10 triệu/tháng. Phí quản lý tính riêng theo gói dịch vụ."
  },
  {
    q: "Facebook Ads có kết quả ngay không?",
    a: "Có traffic và tin nhắn ngay trong 24–48 giờ đầu. Tuy nhiên cần 1–2 tuần để thuật toán Facebook học đối tượng và tối ưu chi phí tốt nhất. Giai đoạn học máy quan trọng, không nên thay đổi quá nhiều."
  },
  {
    q: "Tôi có thể target khách hàng ở Long Thành, Đồng Nai không?",
    a: "Hoàn toàn được! Facebook cho phép target theo vị trí địa lý rất chi tiết — đến cấp xã/phường. Tôi sẽ target đúng khách hàng trong bán kính bạn muốn phục vụ."
  },
  {
    q: "Facebook Ads khác gì Google Ads?",
    a: "Google Ads tiếp cận người đang có nhu cầu tìm kiếm (demand capture). Facebook Ads tiếp cận người chưa tìm kiếm nhưng phù hợp đối tượng mục tiêu (demand generation) — thường phù hợp để tăng nhận diện và kích thích nhu cầu mua hàng."
  },
  {
    q: "Tôi cần chuẩn bị gì để bắt đầu chạy Facebook Ads?",
    a: "Cần có: Fanpage Facebook hoạt động, tài khoản Business Manager, ngân sách quảng cáo (thẻ visa/mastercard hoặc tài khoản đã nạp tiền). Tôi sẽ hỗ trợ toàn bộ các bước thiết lập từ đầu."
  },
];

const adTypes = [
  { icon: "💬", title: "Tin nhắn & Lead", desc: "Khách nhắn tin trực tiếp vào Fanpage hoặc điền form. Phù hợp dịch vụ, tư vấn, bán lẻ.", tag: "Phổ biến nhất", tagColor: "bg-blue-100 text-blue-700" },
  { icon: "🛒", title: "Chuyển đổi website", desc: "Dẫn traffic về website, tối ưu đơn hàng hoặc điền form. Cần pixel Facebook cài đặt đúng.", tag: "ROI cao", tagColor: "bg-green-100 text-green-700" },
  { icon: "🎯", title: "Remarketing", desc: "Nhắm lại người đã xem website, tương tác Fanpage nhưng chưa mua. Tỷ lệ chuyển đổi 3–5x.", tag: "Hiệu quả cao", tagColor: "bg-orange-100 text-orange-700" },
  { icon: "📣", title: "Nhận diện thương hiệu", desc: "Tiếp cận đông người trong khu vực mục tiêu. Phù hợp shop mới khai trương, sản phẩm mới.", tag: "Brand", tagColor: "bg-purple-100 text-purple-700" },
  { icon: "🎬", title: "Video Ads", desc: "Quảng cáo video thu hút sự chú ý, kể câu chuyện thương hiệu. CPM thấp, tỷ lệ xem cao.", tag: "Engagement cao", tagColor: "bg-pink-100 text-pink-700" },
  { icon: "📸", title: "Instagram Ads", desc: "Quảng cáo trên Instagram — phù hợp ngành thời trang, làm đẹp, ẩm thực, lifestyle.", tag: "Visual", tagColor: "bg-rose-100 text-rose-700" },
];

const whyItems = [
  { icon: "🎯", title: "Target siêu chính xác", desc: "Nhắm theo tuổi, giới tính, địa điểm (xã/phường), sở thích, hành vi mua sắm. Tiếp cận đúng người — không lãng phí ngân sách.", color: "from-blue-500 to-blue-600" },
  { icon: "💰", title: "Chi phí linh hoạt", desc: "Bắt đầu từ 100.000đ/ngày. Dừng, tăng, giảm ngân sách bất kỳ lúc nào. Phù hợp mọi quy mô từ nhỏ đến lớn.", color: "from-green-500 to-emerald-600" },
  { icon: "📊", title: "Đo lường real-time", desc: "Xem ngay số người tiếp cận, click, tin nhắn, chi phí/kết quả theo giờ. Dữ liệu minh bạch, tối ưu ngay lập tức.", color: "from-violet-500 to-purple-600" },
  { icon: "🔄", title: "Remarketing mạnh mẽ", desc: "Nhắm lại khách đã xem website, đã tương tác Fanpage, đã chat nhưng chưa mua. Lookalike audience mở rộng tệp khách.", color: "from-orange-500 to-amber-600" },
  { icon: "🌟", title: "Phù hợp mọi ngành", desc: "Từ quán ăn, shop quần áo, bất động sản đến B2B — Facebook đều có đối tượng phù hợp. Đặc biệt hiệu quả với sản phẩm visual.", color: "from-pink-500 to-rose-600" },
  { icon: "⚡", title: "Kết quả nhanh", desc: "Không cần chờ 3–6 tháng như SEO. Quảng cáo live trong 24h, tin nhắn và leads về ngay trong ngày đầu tiên.", color: "from-cyan-500 to-blue-600" },
];

const steps = [
  { step: "01", title: "Phân tích & Lên chiến lược", desc: "Nghiên cứu đối thủ, xác định đối tượng mục tiêu, chọn mục tiêu chiến dịch phù hợp. Đề xuất ngân sách và timeline.", time: "Ngày 1–2", icon: "🔍" },
  { step: "02", title: "Thiết lập kỹ thuật", desc: "Cài Facebook Pixel, Conversion API, Business Manager, cấu hình tài khoản đúng chuẩn. Tạo custom & lookalike audience.", time: "Ngày 2–3", icon: "⚙️" },
  { step: "03", title: "Tạo nội dung quảng cáo", desc: "Viết ad copy thu hút (headline, primary text, CTA). Tư vấn hình ảnh/video hiệu quả hoặc thiết kế banner theo yêu cầu.", time: "Ngày 3–5", icon: "✍️" },
  { step: "04", title: "Launch & Tối ưu liên tục", desc: "Chạy A/B test đa dạng creative. Theo dõi hàng ngày, tắt quảng cáo kém, scale quảng cáo tốt. Báo cáo hàng tuần.", time: "Từ ngày 5+", icon: "🚀" },
];

const included = [
  "Thiết lập Business Manager & tài khoản Ads",
  "Cài đặt Facebook Pixel & Conversion API",
  "Phân tích đối tượng & tạo custom audience",
  "Viết ad copy A/B test (2–3 phiên bản)",
  "Tư vấn & thiết kế creative (hình ảnh/video)",
  "Tối ưu trang đích tăng tỷ lệ chuyển đổi",
  "Quản lý ngân sách & scale chiến dịch hiệu quả",
  "Remarketing & Lookalike audience",
  "Báo cáo hiệu quả hàng tuần (reach, CPM, CPA)",
  "Tư vấn nội dung Fanpage song song",
  "Hỗ trợ Zalo trong giờ làm việc",
  "Cập nhật theo thay đổi chính sách Meta",
];

export default async function FacebookAdsPage() {
  const cms = await getPageData();
  const D = {
    hero_badge:           cms?.hero_badge           ?? "Quảng cáo Facebook & Instagram · Long Thành, Đồng Nai",
    hero_title:           cms?.hero_title           ?? "Dịch Vụ Facebook Ads",
    hero_subtitle:        cms?.hero_subtitle        ?? "Đúng Người · Đúng Lúc · Đúng Chi Phí",
    hero_desc:            cms?.hero_desc            ?? "Target chính xác khách hàng tiềm năng tại Long Thành, Đồng Nai và toàn quốc.\nTối ưu ROAS, giảm CPA. Quản lý toàn diện Facebook & Instagram Ads.",
    hero_cta_primary:     cms?.hero_cta_primary     ?? "Tư vấn miễn phí ngay",
    hero_cta_primary_url: cms?.hero_cta_primary_url ?? "https://zalo.me/0968806360",
    hero_trust_badges:    cms?.hero_trust_badges    ?? ["✅ Không cần hợp đồng dài hạn", "⚡ Chạy trong 48h", "📊 Báo cáo hàng tuần", "🛡️ Cam kết có lead"],
    stats:    cms?.stats    ?? [
      { num: "4–6x",  label: "ROAS trung bình",               icon: "📈" },
      { num: "3.5M+", label: "User Facebook tại Đồng Nai",    icon: "👥" },
      { num: "48h",   label: "Bắt đầu có lead",               icon: "⚡" },
      { num: "40%",   label: "Giảm CPA so với tự chạy",       icon: "💰" },
    ],
    adTypes:  cms?.adTypes  ?? adTypes,
    steps:    cms?.steps    ?? steps,
    included: cms?.included ?? included,
    faqs:     cms?.faqs     ?? faqs,
    cta_title:    cms?.cta_title    ?? "Sẵn Sàng Bắt Đầu",
    cta_subtitle: cms?.cta_subtitle ?? "Chiến Dịch Facebook Ads?",
    cta_desc:     cms?.cta_desc     ?? "Tư vấn miễn phí — tôi phân tích đối thủ và đề xuất chiến lược phù hợp cho doanh nghiệp bạn trong 24 giờ.",
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Service",
        "name": "Dịch Vụ Quảng Cáo Facebook Ads",
        "provider": { "@type": "LocalBusiness", "name": "Sơn Xin Chào", "url": "https://www.sonxinchao.com", "telephone": "0968806360",
          "address": { "@type": "PostalAddress", "addressLocality": "Long Thành", "addressRegion": "Đồng Nai", "addressCountry": "VN" }
        },
        "areaServed": ["Long Thành", "Nhơn Trạch", "Biên Hòa", "Đồng Nai", "TP. Hồ Chí Minh", "Thủ Đức", "Quận 7", "Bình Dương"],
        "description": "Dịch vụ quảng cáo Facebook Ads chuyên nghiệp, target đúng đối tượng, tối ưu ROAS cho doanh nghiệp tại Đồng Nai",
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
      })}} />

      <Navbar />
      <main className="bg-white min-h-screen">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden pt-24 pb-0 px-4">
          {/* Gradient mesh background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800" />
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-300/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

          <div className="relative max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-white text-sm font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {D.hero_badge}
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="font-extrabold text-white leading-tight tracking-tight mb-5">
                <div className="text-4xl md:text-6xl mb-2">
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                      {D.hero_title}
                    </span>
                    <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full opacity-60" />
                  </span>
                </div>
                <div className="text-xl md:text-3xl text-blue-200 whitespace-nowrap">
                  {D.hero_subtitle}
                </div>
              </h1>
              <p className="text-blue-50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                {D.hero_desc.split("\n").map((line: string, i: number) => (
                  <span key={i}>{line}{i < D.hero_desc.split("\n").length - 1 && <br />}</span>
                ))}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href={D.hero_cta_primary_url} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-blue-900 font-bold rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-yellow-500/30 text-base">
                <span className="text-xl">💬</span>
                {D.hero_cta_primary}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </a>
              <a href="/#pricing"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-2xl transition-all text-base">
                Xem bảng giá
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {D.hero_trust_badges.map((b: string) => (
                <span key={b} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs px-3 py-1.5 rounded-full font-medium">{b}</span>
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
              {(D.stats as { num: string; label: string; icon: string }[]).map((s, idx) => {
                const colors = ["from-blue-500 to-indigo-600","from-violet-500 to-purple-600","from-orange-500 to-amber-600","from-green-500 to-emerald-600"];
                const color = colors[idx % colors.length];
                return (
                  <div key={idx} className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200/60 text-center group hover:shadow-lg transition-all duration-300">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-lg mx-auto mb-3`}>{s.icon}</div>
                    <div className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-br ${color} bg-clip-text text-transparent leading-none mb-1`}>{s.num}</div>
                    <div className="text-slate-500 text-xs leading-snug">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── AD TYPES ── */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">Loại hình quảng cáo</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">Các Loại Facebook Ads Tôi Quản Lý</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Mỗi mục tiêu kinh doanh cần loại chiến dịch khác nhau — tôi sẽ chọn đúng combo cho bạn</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {(D.adTypes as typeof adTypes).map((t, i) => (
                <div key={t.title}
                  className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {t.icon}
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${t.tagColor}`}>{t.tag}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 text-base group-hover:text-blue-600 transition-colors">{t.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY FACEBOOK ADS ── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">Lý do chọn Facebook Ads</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">Tại Sao Doanh Nghiệp Cần Facebook Ads?</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Facebook có hơn 75 triệu người dùng tại Việt Nam — khách hàng của bạn đang ở đó mỗi ngày</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {whyItems.map(item => (
                <div key={item.title} className="group flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300">
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shadow-sm`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1 text-sm group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl" />
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-white/15 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase border border-white/20">Quy trình làm việc</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Triển Khai Facebook Ads Chuyên Nghiệp</h2>
              <p className="text-blue-200 max-w-xl mx-auto">Từ phân tích đến kết quả — quy trình rõ ràng, minh bạch từng bước</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {(D.steps as typeof steps).map((p, i) => (
                <div key={p.step} className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl">
                        {p.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-blue-300 text-xs font-bold tracking-widest">BƯỚC {p.step}</span>
                        <span className="bg-yellow-400/20 text-yellow-300 text-xs px-2 py-0.5 rounded-full border border-yellow-400/30 font-medium">{p.time}</span>
                      </div>
                      <h3 className="font-bold text-white text-base mb-2">{p.title}</h3>
                      <p className="text-blue-200 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INCLUDED ── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">Trọn gói dịch vụ</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">Dịch Vụ Bao Gồm</h2>
              <p className="text-slate-500">Tất cả trong một gói — không phát sinh chi phí ẩn</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {(D.included as string[]).map((item, i) => (
                <div key={item} className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl px-5 py-3.5 group hover:border-green-300 hover:shadow-sm transition-all">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-sm shadow-green-200">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700 text-sm font-medium group-hover:text-slate-900 transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">Giải đáp thắc mắc</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">Câu Hỏi Thường Gặp</h2>
            </div>
            <div className="space-y-4">
              {(D.faqs as typeof faqs).map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-extrabold flex-shrink-0 mt-0.5">Q</div>
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
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" />
          <div className="absolute inset-0 opacity-30" style={{backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 60% 80%, #06b6d4 0%, transparent 40%)"}} />
          <div className="relative max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Phản hồi trong 2 giờ làm việc
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              {D.cta_title}<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">{D.cta_subtitle}</span>
            </h2>
            <p className="text-blue-200 mb-8 text-lg leading-relaxed">{D.cta_desc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href={D.hero_cta_primary_url} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-slate-900 font-bold rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-yellow-500/20 text-base">
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
            <div className="flex flex-wrap justify-center gap-2 text-blue-300 text-sm">
              <span>📍 Long Thành</span>
              <span className="text-blue-600">·</span>
              <span>Nhơn Trạch</span>
              <span className="text-blue-600">·</span>
              <span>Biên Hòa</span>
              <span className="text-blue-600">·</span>
              <span>Đồng Nai</span>
              <span className="text-blue-600">·</span>
              <span>Toàn quốc</span>
            </div>
          </div>
        </section>

        {/* ── Internal links ── */}
        <section className="py-10 px-4 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">Xem thêm dịch vụ khác</p>
            <div className="flex flex-wrap gap-3">
              <a href="/dich-vu/seo" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 hover:shadow-sm transition-all">🔍 Dịch vụ SEO</a>
              <a href="/dich-vu/google-ads" className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-100 hover:shadow-sm transition-all">📊 Google Ads</a>
              <a href="/dich-vu/tiktok-ads" className="flex items-center gap-2 px-4 py-2.5 bg-pink-50 text-pink-700 rounded-xl text-sm font-semibold hover:bg-pink-100 hover:shadow-sm transition-all">🎵 TikTok Ads</a>
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
