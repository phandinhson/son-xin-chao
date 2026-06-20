"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Pricing } from "@/lib/supabase";

type Addon = { id: string; name: string; icon: string; price: string; unit: string; sort_order: number; active: boolean };

const DEFAULT_PLANS: Pricing[] = [
  { id: "1", name: "Starter", icon: "🌱", price: "3.500.000", unit: "đ/tháng", description: "Phù hợp doanh nghiệp mới bắt đầu xây dựng hiện diện online", features: ["SEO on-page cơ bản (5 trang)", "Nghiên cứu 10 từ khóa mục tiêu", "Báo cáo thứ hạng hàng tháng", "Tối ưu Google Business Profile", "1 bài blog SEO/tuần", "Hỗ trợ qua Zalo"], not_included: ["Quảng cáo trả phí", "Thiết kế website"], is_popular: false, cta_text: "Bắt đầu ngay", sort_order: 1 },
  { id: "2", name: "Growth", icon: "🚀", price: "7.000.000", unit: "đ/tháng", description: "Lựa chọn tốt nhất cho doanh nghiệp muốn tăng trưởng nhanh và bền vững", features: ["SEO toàn diện (on-page + technical)", "Nghiên cứu 30+ từ khóa", "Báo cáo traffic & thứ hạng hàng tuần", "Quản lý Google Ads hoặc Facebook Ads", "4 bài blog SEO/tháng + nội dung ads", "Tối ưu trang đích (Landing Page)", "Hỗ trợ ưu tiên 24/5"], not_included: [], is_popular: true, cta_text: "Chọn gói này", sort_order: 2 },
  { id: "3", name: "Pro", icon: "👑", price: "Liên hệ", unit: "báo giá riêng", description: "Giải pháp tùy chỉnh toàn diện cho doanh nghiệp có nhu cầu đặc biệt", features: ["Toàn bộ dịch vụ gói Growth", "Thiết kế / nâng cấp website WordPress", "Quản lý đồng thời Google + Facebook Ads", "Chiến lược content marketing toàn diện", "Dashboard báo cáo tùy chỉnh", "Hỗ trợ 7 ngày/tuần, phản hồi trong ngày"], not_included: [], is_popular: false, cta_text: "Nhận báo giá", sort_order: 3 },
];

const PLAN_STYLES = [
  { gradient: "from-blue-500 to-cyan-400",    border: "border-blue-100",   bg: "bg-white",    badge: "bg-blue-50 text-blue-600",    check: "text-blue-500" },
  { gradient: "from-violet-600 to-pink-500",  border: "border-violet-200", bg: "bg-white",    badge: "bg-violet-50 text-violet-600", check: "text-violet-500" },
  { gradient: "from-amber-500 to-orange-400", border: "border-amber-100",  bg: "bg-white",    badge: "bg-amber-50 text-amber-600",   check: "text-amber-500" },
];

const GUARANTEES = [
  { icon: "📊", title: "Báo cáo minh bạch",   desc: "Số liệu thực mỗi tuần — thứ hạng từ khóa, traffic, leads" },
  { icon: "🔓", title: "Không lock hợp đồng", desc: "Hủy bất kỳ lúc nào, báo trước 15 ngày" },
  { icon: "🎯", title: "Cam kết kết quả",      desc: "Không cải thiện sau 3 tháng → tặng thêm 1 tháng miễn phí" },
  { icon: "💬", title: "Hỗ trợ nhanh",         desc: "Phản hồi trong 2 tiếng qua Zalo, không để bạn chờ lâu" },
];

const FAQS = [
  { q: "Bao lâu thì thấy kết quả SEO?", a: "Thông thường 3–6 tháng. Tháng 1: tối ưu kỹ thuật + on-page. Tháng 2–3: traffic bắt đầu tăng. Tháng 4–6: từ khóa mục tiêu leo hạng ổn định. Tôi báo cáo tiến độ mỗi tuần để bạn luôn nắm rõ." },
  { q: "Chi phí quảng cáo có tính trong gói không?", a: "Không. Phí quản lý & tối ưu chiến dịch là khoản tôi thu. Ngân sách ads bạn nạp trực tiếp vào tài khoản Google/Facebook — tôi không giữ lại một đồng nào." },
  { q: "Tôi cần chuẩn bị gì trước khi bắt đầu?", a: "Chỉ cần 30 phút tư vấn qua Zalo/Meet. Tôi sẽ tìm hiểu mục tiêu, ngành nghề, đối thủ và đề xuất chiến lược cụ thể trước khi ký hợp đồng." },
  { q: "Có thể kết hợp SEO + Ads không?", a: "Hoàn toàn có. Gói Growth đã bao gồm SEO + 1 kênh Ads (Google hoặc Facebook). Gói Pro tùy chỉnh toàn diện theo nhu cầu thực tế của bạn." },
  { q: "Hợp đồng tối thiểu bao nhiêu tháng?", a: "Không có ràng buộc dài hạn — hợp đồng theo tháng. Thông báo trước 15 ngày là có thể kết thúc. Tôi tin vào chất lượng dịch vụ — kết quả tốt là lý do bạn ở lại." },
  { q: "Phục vụ khu vực nào?", a: "Phục vụ toàn quốc qua hình thức online. Đặc biệt tập trung vào Long Thành, Nhơn Trạch, Biên Hòa (Đồng Nai) và TP. Hồ Chí Minh." },
];

function formatAddonPrice(price: string, unit: string) {
  if (!unit || unit === "đ") return `${price}đ`;
  if (unit.startsWith("đ/")) return `${price}${unit}`;
  return `${price} ${unit}`;
}

export default function PricingPageClient({
  plans: dbPlans,
  addons,
  zalo,
}: {
  plans: Pricing[];
  addons: Addon[];
  zalo: string;
}) {
  const plans = dbPlans.length > 0 ? dbPlans : DEFAULT_PLANS;
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const zaloUrl = `https://zalo.me/${zalo.replace(/\s/g, "")}`;

  return (
    <main className="min-h-screen bg-white">

      {/* ══════════════════════════════════════════════════════
          HERO — Light
         ══════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        {/* Decorative blobs — mờ, sáng */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_#dbeafe_0%,_transparent_70%)]" />
        <div className="hidden md:block absolute top-16 left-8 w-64 h-64 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="hidden md:block absolute top-10 right-8 w-56 h-56 bg-violet-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">Bảng giá</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
            💰 Bảng giá minh bạch
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight">
            Đầu tư thông minh,<br />
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
              kết quả đo lường được
            </span>
          </h1>

          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Giá cả minh bạch — không phí ẩn, không cam kết dài hạn bắt buộc.
            Tất cả gói đều có báo cáo định kỳ và cam kết kết quả rõ ràng.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm">
            {[
              { v: "150+", l: "Dự án thành công" },
              { v: "80+",  l: "Khách hàng hài lòng" },
              { v: "5+",   l: "Năm kinh nghiệm" },
              { v: "4.9★", l: "Đánh giá trung bình" },
            ].map((s) => (
              <div key={s.v} className="flex flex-col items-center gap-0.5">
                <span className="text-2xl font-bold text-slate-900">{s.v}</span>
                <span className="text-slate-500 text-xs">{s.l}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.02]"
            >
              <Image src="/logo-zalo-vector.svg" alt="Zalo" width={20} height={20} className="h-5 w-auto brightness-0 invert" unoptimized />
              Tư vấn miễn phí qua Zalo
            </a>
            <a href="#plans" className="px-7 py-3.5 border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all">
              Xem bảng giá ↓
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          GUARANTEE BADGES
         ══════════════════════════════════════════════════════ */}
      <section className="border-y border-slate-100 py-10 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {GUARANTEES.map((g) => (
              <div key={g.title} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                <span className="text-2xl mt-0.5 flex-shrink-0">{g.icon}</span>
                <div>
                  <p className="text-slate-800 font-semibold text-sm">{g.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-snug">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRICING CARDS
         ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white" id="plans">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Chọn gói phù hợp với bạn
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Không chắc gói nào phù hợp?{" "}
              <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                Nhắn Zalo
              </a>{" "}
              — tôi sẽ tư vấn miễn phí trong 30 phút.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => {
              const style = PLAN_STYLES[i % PLAN_STYLES.length];
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl border-2 ${style.border} ${style.bg} shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    plan.is_popular
                      ? "ring-2 ring-violet-400 ring-offset-4 scale-[1.03] shadow-lg shadow-violet-100"
                      : ""
                  }`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-md shadow-violet-200 whitespace-nowrap">
                      ⭐ Được chọn nhiều nhất
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon + name */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
                          {plan.unit}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-7 pb-6 border-b border-slate-100">
                      {plan.price.startsWith("Liên hệ") || plan.price === "Liên hệ" ? (
                        <div className="space-y-2.5">
                          <p className="text-slate-500 text-sm">Liên hệ để nhận báo giá phù hợp nhất</p>
                          {/* Zalo chat */}
                          <a
                            href={zaloUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 w-full px-4 py-3 bg-[#e8f4ff] border border-[#0068ff]/25 text-[#0068ff] font-semibold rounded-xl hover:bg-[#d0e8ff] transition-colors text-sm"
                          >
                            <Image src="/logo-zalo-vector.svg" alt="Zalo" width={20} height={20} className="h-5 w-auto" unoptimized />
                            Chat qua Zalo
                          </a>
                          {/* Phone number */}
                          <a
                            href={`tel:${zalo.replace(/\s/g, "")}`}
                            className="flex items-center gap-2.5 w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors text-sm"
                          >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                            </svg>
                            {zalo} · Hiện số
                          </a>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                            <span className="text-slate-500 text-sm font-medium">đ</span>
                          </div>
                          <div className="text-slate-400 text-sm mt-1">mỗi tháng · thanh toán hàng tháng</div>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-7">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <svg className={`w-4 h-4 ${style.check} mt-0.5 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                      {plan.not_included && plan.not_included.length > 0 && plan.not_included.map((f, fi) => (
                        <li key={`x-${fi}`} className="flex items-start gap-2.5 text-sm text-slate-400">
                          <svg className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA button */}
                    <a
                      href={zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full py-3.5 rounded-2xl text-center text-sm font-bold transition-all hover:scale-[1.02] hover:shadow-md ${
                        plan.is_popular
                          ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md shadow-violet-100"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"
                      }`}
                    >
                      {plan.cta_text} →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note */}
          <p className="text-center text-slate-400 text-sm mt-8">
            💡 Tất cả giá chưa bao gồm VAT. Ngân sách quảng cáo (Google Ads, Facebook Ads) tính riêng — bạn nạp thẳng vào tài khoản ads của mình.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SO SÁNH — WHY CHOOSE
         ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Tại sao chọn Sơn thay vì agency lớn?
            </h2>
            <p className="text-slate-500">Làm việc trực tiếp với chuyên gia — không qua trung gian, không bị "đùn đẩy"</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "👤", title: "Làm việc 1-1 với chuyên gia",   desc: "Không qua account manager, không bị đẩy sang junior. Tôi trực tiếp thực hiện và báo cáo với bạn." },
              { icon: "📈", title: "KPI đo lường được",              desc: "Cam kết thứ hạng từ khóa cụ thể, traffic tăng bao nhiêu %, leads tăng như thế nào — không nói chung chung." },
              { icon: "💰", title: "Chi phí hợp lý hơn 30–50%",     desc: "Không overhead của agency lớn. Bạn trả tiền cho kết quả thực, không trả cho tầng tầng quản lý." },
              { icon: "⚡", title: "Phản hồi trong ngày",            desc: "Zalo 8h–21h, 7 ngày/tuần. Có câu hỏi hay vấn đề khẩn cấp — tôi xử lý ngay, không chờ ticket." },
              { icon: "🔬", title: "Chiến lược theo ngành của bạn", desc: "Nghiên cứu kỹ đối thủ và thị trường ngách trước khi làm. Không áp dụng template chung cho mọi khách." },
              { icon: "📋", title: "Hợp đồng linh hoạt",            desc: "Theo tháng, hủy bất kỳ lúc nào. Cam kết bằng kết quả — không cần điều khoản giữ chân dài hạn." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-100 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ADD-ONS
         ══════════════════════════════════════════════════════ */}
      {addons.length > 0 && (
        <section className="py-20 bg-white" id="addons">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm mb-5">
                ➕ Dịch vụ bổ sung
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Nâng cấp thêm theo nhu cầu</h2>
              <p className="text-slate-500">Thêm vào bất kỳ gói nào để tăng sức mạnh chiến dịch marketing của bạn</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {addons.map((addon) => (
                <div key={addon.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xl flex-shrink-0 shadow group-hover:scale-110 transition-transform">
                    {addon.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm leading-snug">{addon.name}</p>
                    <p className="text-blue-600 font-bold text-sm mt-0.5">{formatAddonPrice(addon.price, addon.unit)}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-slate-400 text-sm mt-8">
              Cần tư vấn add-on nào phù hợp?{" "}
              <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                Nhắn Zalo ngay →
              </a>
            </p>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          TESTIMONIAL — light blue accent
         ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-blue-50 border-y border-blue-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <blockquote className="text-slate-700 text-xl lg:text-2xl font-medium leading-relaxed mb-8 italic">
            "Sau 4 tháng làm SEO với Sơn, website showroom xe máy của tôi lên top 3 Google cho 15 từ khóa chính.
            Traffic tăng 340%, lead tháng nào cũng tăng đều."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold text-blue-700">T</div>
            <div className="text-left">
              <p className="text-slate-800 font-bold">Anh Tuấn</p>
              <p className="text-slate-500 text-sm">Chủ showroom xe máy, Long Thành, Đồng Nai</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ
         ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Câu hỏi thường gặp về bảng giá</h2>
            <p className="text-slate-500">
              Không tìm thấy câu trả lời?{" "}
              <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                Nhắn Zalo để hỏi trực tiếp →
              </a>
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-200 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-800 text-sm pr-4">{faq.q}</span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 border-blue-200 bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-lg transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA FINAL — gradient màu, không tối
         ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 relative overflow-hidden">
        <div className="hidden md:block absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="hidden md:block absolute -bottom-20 -left-20 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-sm font-medium mb-6">
            🚀 Bắt đầu hôm nay
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            Sẵn sàng tăng trưởng?<br />
            <span className="text-blue-100">Tư vấn miễn phí — không ràng buộc</span>
          </h2>
          <p className="text-blue-100 mb-10 text-lg">
            30 phút tư vấn — Tôi phân tích website, đề xuất chiến lược và báo giá cụ thể.
            Không áp lực ký kết.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white text-blue-700 font-bold text-base rounded-2xl hover:bg-blue-50 transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              <Image src="/logo-zalo-vector.svg" alt="Zalo" width={24} height={24} className="h-6 w-auto" unoptimized />
              Tư vấn miễn phí qua Zalo
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-2xl hover:border-white hover:bg-white/10 transition-all"
            >
              Gửi yêu cầu tư vấn →
            </Link>
          </div>

          <p className="text-blue-200 text-sm mt-8">
            Phản hồi trong <span className="text-white font-medium">2 tiếng</span> · Phục vụ <span className="text-white font-medium">8h–21h, 7 ngày/tuần</span>
          </p>
        </div>
      </section>

    </main>
  );
}
