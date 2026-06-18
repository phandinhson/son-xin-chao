"use client";
import { useEffect, useRef, useState } from "react";
import type { Pricing as PricingType } from "@/lib/supabase";

const defaultPlans: PricingType[] = [
  { id: "1", name: "Starter", icon: "🌱", price: "3.500.000", unit: "đ/tháng", description: "Phù hợp doanh nghiệp mới bắt đầu xây dựng hiện diện online", features: ["SEO on-page cơ bản (5 trang)", "Nghiên cứu 10 từ khóa mục tiêu", "Báo cáo thứ hạng hàng tháng", "Tối ưu Google Business Profile", "1 bài blog SEO/tuần", "Hỗ trợ qua Zalo"], not_included: ["Quảng cáo trả phí", "Thiết kế website"], is_popular: false, cta_text: "Bắt đầu ngay", sort_order: 1 },
  { id: "2", name: "Growth", icon: "🚀", price: "7.000.000", unit: "đ/tháng", description: "Lựa chọn tốt nhất cho doanh nghiệp muốn tăng trưởng nhanh và bền vững", features: ["SEO toàn diện (on-page + technical)", "Nghiên cứu 30+ từ khóa", "Báo cáo traffic & thứ hạng hàng tuần", "Quản lý Google Ads hoặc Facebook Ads", "Ngân sách quảng cáo đề xuất: 5–15 triệu", "4 bài blog SEO/tháng + nội dung ads", "Tối ưu trang đích (Landing Page)", "Hỗ trợ ưu tiên 24/5"], not_included: [], is_popular: true, cta_text: "Chọn gói này", sort_order: 2 },
  { id: "3", name: "Pro", icon: "👑", price: "Liên hệ", unit: "báo giá riêng", description: "Giải pháp tùy chỉnh toàn diện cho doanh nghiệp có nhu cầu đặc biệt", features: ["Toàn bộ dịch vụ gói Growth", "Thiết kế / nâng cấp website WordPress", "Quản lý đồng thời Google + Facebook Ads", "Chiến lược content marketing toàn diện", "Dashboard báo cáo tùy chỉnh", "Hỗ trợ 7 ngày/tuần, phản hồi trong ngày"], not_included: [], is_popular: false, cta_text: "Nhận báo giá", sort_order: 3 },
];

const COLORS = ["from-blue-600 to-cyan-500", "from-violet-600 to-pink-500", "from-amber-500 to-orange-500"];

type Addon = {
  id: string;
  name: string;
  icon: string;
  price: string;
  unit: string;
  sort_order: number;
  active: boolean;
};


function formatAddonPrice(price: string, unit: string) {
  if (!unit || unit === "đ") return `${price}đ`;
  if (unit.startsWith("đ/")) return `${price}${unit}`;
  return `${price} ${unit}`;
}

export default function Pricing() {
  const [plans, setPlans] = useState<PricingType[]>(defaultPlans);
  const [addons, setAddons] = useState<Addon[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setPlans(data); })
      .catch(() => {});
    fetch("/api/addons")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setAddons(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [plans]);

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden" ref={sectionRef}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">Bảng giá</div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Đầu tư thông minh,<br /><span className="gradient-text">kết quả thực tế</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Giá cả minh bạch, không phí ẩn. Tất cả gói đều bao gồm báo cáo định kỳ và cam kết kết quả rõ ràng.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, i) => {
            const color = COLORS[i % COLORS.length];
            const borderColor = plan.is_popular ? "border-violet-500/40" : "border-slate-200";
            return (
              <div key={plan.id} className={`relative rounded-3xl border ${borderColor} transition-all duration-300 card-hover animate-on-scroll ${plan.is_popular ? "bg-gradient-to-b from-violet-600/15 to-pink-600/5 scale-105" : "bg-slate-50"}`} style={{ animationDelay: `${i * 150}ms` }}>
                {plan.is_popular && (<div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg whitespace-nowrap">⭐ Được chọn nhiều nhất</div>)}
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{plan.description}</p>
                  <div className="mb-8">
                    {plan.price === "Liên hệ" ? (
                      <div className="text-3xl font-bold text-white">Liên hệ</div>
                    ) : (
                      <><span className="text-4xl font-bold text-white">{plan.price}</span><span className="text-gray-400 text-sm ml-1">{plan.unit}</span></>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {(plan.features || []).map((f, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className={`w-4 h-4 mt-0.5 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </span>{f}
                      </li>
                    ))}
                    {(plan.not_included || []).map((f, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-600 line-through">
                        <span className="w-4 h-4 mt-0.5 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href="/contact" className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-sm transition-all ${plan.is_popular ? `bg-gradient-to-r ${color} text-white hover:opacity-90 shadow-lg` : "border border-slate-300 text-white hover:bg-slate-50"}`}>
                    {plan.cta_text}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        <div className="animate-on-scroll">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Dịch vụ <span className="gradient-text">bổ sung</span> (Add-on)</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon) => (
              <div key={addon.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-3"><span className="text-xl group-hover:scale-110 transition-transform">{addon.icon}</span><span className="text-gray-300 text-sm font-medium">{addon.name}</span></div>
                <span className="text-blue-400 font-bold text-sm whitespace-nowrap ml-4">{formatAddonPrice(addon.price, addon.unit)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-blue-600/10 to-violet-600/10 border border-blue-500/20 text-center animate-on-scroll">
          <div className="text-4xl mb-4">🛡️</div>
          <h4 className="text-white font-bold text-xl mb-2">Cam kết & Bảo đảm</h4>
          <p className="text-gray-400 max-w-2xl mx-auto">Tôi cam kết báo cáo minh bạch, KPI rõ ràng trước khi bắt đầu. Nếu sau 3 tháng SEO không có cải thiện, tôi <span className="text-white font-semibold">hoàn tiền 1 tháng phí dịch vụ</span>.</p>
        </div>
      </div>
    </section>
  );
}
