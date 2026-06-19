"use client";
import { useEffect, useRef } from "react";

const services = [
  {
    icon: "🔍",
    title: "SEO Organic",
    subtitle: "Lên top Google bền vững",
    color: "from-blue-600 to-cyan-500",
    glow: "shadow-blue-500/20",
    border: "hover:border-blue-500/50",
    desc: "Chiến lược SEO toàn diện giúp website của bạn xuất hiện trên trang 1 Google và duy trì thứ hạng dài hạn.",
    features: [
      "Nghiên cứu từ khóa chuyên sâu",
      "Tối ưu SEO on-page & technical",
      "Xây dựng backlink chất lượng",
      "Viết nội dung chuẩn SEO",
      "Báo cáo thứ hạng hàng tuần",
      "Tối ưu Core Web Vitals",
    ],
    result: "Tăng traffic 200–400% sau 6 tháng",
    badge: "Phổ biến nhất",
  },
  {
    icon: "📱",
    title: "Google & Facebook Ads",
    subtitle: "Quảng cáo sinh lời ngay",
    color: "from-violet-600 to-pink-500",
    glow: "shadow-violet-500/20",
    border: "hover:border-violet-500/50",
    desc: "Quản lý và tối ưu chiến dịch quảng cáo trả phí trên Google Search, Display và Facebook/Instagram.",
    features: [
      "Thiết lập chiến dịch từ A-Z",
      "Target đúng đối tượng tiềm năng",
      "Tối ưu CPA & ROAS",
      "A/B test quảng cáo liên tục",
      "Báo cáo hiệu quả hàng ngày",
      "Remarketing & lookalike",
    ],
    result: "ROAS trung bình đạt 4–6x",
    badge: "ROI cao nhất",
  },
  {
    icon: "💻",
    title: "Thiết kế Website WordPress",
    subtitle: "Website đẹp, chuẩn SEO",
    color: "from-emerald-600 to-teal-500",
    glow: "shadow-emerald-500/20",
    border: "hover:border-emerald-500/50",
    desc: "Thiết kế website WordPress chuyên nghiệp, chuẩn SEO, tối ưu tốc độ và trải nghiệm người dùng.",
    features: [
      "Thiết kế giao diện hiện đại",
      "Tối ưu tốc độ tải trang",
      "Chuẩn SEO ngay từ đầu",
      "Responsive mobile/tablet",
      "Tích hợp form & Zalo OA",
      "Hướng dẫn tự quản lý",
    ],
    result: "Hoàn thành trong 7–14 ngày",
    badge: "Nhanh nhất",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="py-24 bg-slate-50 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 text-sm mb-6">
            Dịch vụ
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Tôi có thể giúp gì <span className="gradient-text">cho bạn?</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Ba dịch vụ cốt lõi, triển khai chuyên nghiệp — mỗi dự án đều được
            đầu tư như thể đó là doanh nghiệp của chính tôi.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className={`relative group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 card-hover ${service.border} animate-on-scroll`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Badge */}
              <div className={`absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r ${service.color} text-white text-xs font-bold shadow-lg ${service.glow}`}>
                {service.badge}
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl mb-6 shadow-xl ${service.glow} group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-1">{service.title}</h3>
              <p className={`text-sm font-medium mb-4 bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                {service.subtitle}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{service.desc}</p>

              {/* Features */}
              <ul className="space-y-2.5 mb-8">
                {service.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Result */}
              <div className={`p-4 rounded-xl bg-gradient-to-r ${service.color} bg-opacity-10 border border-slate-200`}>
                <p className="text-slate-800 text-sm font-semibold text-center">🎯 {service.result}</p>
              </div>

              {/* CTA */}
              <a
                href="/contact"
                className={`mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r ${service.color} text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg ${service.glow}`}
              >
                Tư vấn ngay
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-on-scroll">
          <p className="text-slate-600 mb-6">
            Không chắc dịch vụ nào phù hợp?{" "}
            <a href="/contact" className="text-blue-600 hover:underline font-medium">
              Nói chuyện với tôi
            </a>{" "}
            — tôi sẽ tư vấn miễn phí.
          </p>
        </div>
      </div>
    </section>
  );
}
