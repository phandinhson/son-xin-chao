"use client";
import { useEffect, useRef, useState } from "react";

const skills = [
  { name: "SEO On-page & Technical", level: 92 },
  { name: "Google Ads (Search/Display)", level: 88 },
  { name: "Facebook & Meta Ads", level: 85 },
  { name: "WordPress & WooCommerce", level: 90 },
  { name: "Google Analytics / GSC", level: 85 },
  { name: "Content Marketing", level: 80 },
];

const highlights = [
  {
    icon: "🎯",
    title: "Kết quả đo lường được",
    desc: "Mọi chiến dịch đều có báo cáo minh bạch, KPI rõ ràng theo từng tháng.",
  },
  {
    icon: "🚀",
    title: "Triển khai nhanh",
    desc: "Bắt đầu trong 48 giờ, không rườm rà, không hợp đồng phức tạp.",
  },
  {
    icon: "💡",
    title: "Tư vấn chiến lược",
    desc: "Không chỉ làm theo yêu cầu — tôi đề xuất giải pháp tốt nhất cho doanh nghiệp bạn.",
  },
  {
    icon: "🤝",
    title: "Đồng hành lâu dài",
    desc: "Hỗ trợ tận tâm, phản hồi trong ngày, cam kết gắn bó với mục tiêu của bạn.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [aboutDesc, setAboutDesc] = useState("Với hơn 3 năm trong ngành Digital Marketing, tôi đã giúp hàng chục doanh nghiệp vừa và nhỏ tăng trưởng bền vững qua các kênh online.");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { if (d?.about_description) setAboutDesc(d.about_description); })
      .catch(() => {});
  }, []);

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
    <section id="about" className="py-24 bg-gray-950 relative overflow-hidden" ref={sectionRef}>
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
            Về tôi
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Tôi là ai & <span className="gradient-text">tại sao chọn tôi?</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {aboutDesc}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Skills */}
          <div className="animate-on-scroll [animation-delay:200ms]">
            <h3 className="text-2xl font-bold text-white mb-8">Kỹ năng chuyên môn</h3>
            <div className="space-y-5">
              {skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 font-medium">{skill.name}</span>
                    <span className="text-blue-400 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500 transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-10 p-6 rounded-2xl bg-white border border-slate-200">
              <h4 className="text-white font-semibold mb-4">Chứng chỉ & Kinh nghiệm</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  Google Ads Search Certification
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  Meta Blueprint — Facebook Ads Professional
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  3+ năm triển khai SEO cho ngành xe máy, bất động sản
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  Kinh nghiệm quản lý ngân sách quảng cáo 50–200 triệu/tháng
                </div>
              </div>
            </div>
          </div>

          {/* Right: Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-on-scroll [animation-delay:400ms]">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all group card-hover"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">
                  {item.icon}
                </div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}

            {/* Location */}
            <div className="col-span-full p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 to-violet-600/10 border border-blue-500/20">
              <div className="flex items-center gap-4">
                <div className="text-4xl">📍</div>
                <div>
                  <p className="text-white font-semibold">Long Thành, Đồng Nai</p>
                  <p className="text-gray-400 text-sm">
                    Phục vụ khách hàng toàn quốc • Online 100% • Hỗ trợ 7 ngày/tuần
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
