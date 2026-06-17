"use client";
import { useState, useEffect, useRef } from "react";
import type { Portfolio as PortfolioType } from "@/lib/supabase";

const categories = ["Tất cả", "SEO", "Ads", "Website"];

const defaultProjects: PortfolioType[] = [
  { id: "1", category: "SEO", title: "Showroom Xe Điện Nhơn Trạch", industry: "Xe điện / Yadea", result: "+340% traffic organic", detail: "Từ 200 → 880 lượt/tháng trong 5 tháng", tags: ["SEO Local", "Content", "Google Map"], color: "from-blue-600 to-cyan-500", icon: "🔍", metric_before: "200", metric_after: "880", metric_unit: "lượt/tháng", sort_order: 1, active: true, created_at: "" },
  { id: "2", category: "Ads", title: "Cửa hàng Sửa Chữa iPhone", industry: "Điện thoại / Sửa chữa", result: "ROAS 5.2x — CPA giảm 40%", detail: "Google Search + Meta Ads đồng thời", tags: ["Google Ads", "Facebook Ads", "Remarketing"], color: "from-violet-600 to-pink-500", icon: "📱", metric_before: "2.1x", metric_after: "5.2x", metric_unit: "ROAS", sort_order: 2, active: true, created_at: "" },
  { id: "3", category: "Website", title: "Website Bất Động Sản", industry: "Bất động sản", result: "10 ngày ra mắt, 95 PageSpeed", detail: "WordPress + Elementor chuẩn SEO", tags: ["WordPress", "SEO", "Tốc độ cao"], color: "from-emerald-600 to-teal-500", icon: "💻", metric_before: "45", metric_after: "95", metric_unit: "PageSpeed", sort_order: 3, active: true, created_at: "" },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [projects, setProjects] = useState<PortfolioType[]>(defaultProjects);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setProjects(data); })
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
  }, [projects]);

  const filtered = activeCategory === "Tất cả" ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-gray-950 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">Portfolio</div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Kết quả <span className="gradient-text">thực tế</span> đã đạt được</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Mỗi con số là một câu chuyện thành công — được xây dựng từ chiến lược đúng và thực thi kiên định.</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-12 animate-on-scroll">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25" : "bg-white border border-slate-200 text-gray-400 hover:text-white hover:bg-slate-100"}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <div key={project.id} className="group relative rounded-3xl border border-slate-200 bg-white overflow-hidden card-hover animate-on-scroll hover:border-blue-300" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center text-2xl shadow-lg`}>{project.icon}</div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-gray-300 border border-slate-200">{project.category}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{project.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{project.industry}</p>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 mb-5">
                  <div className="text-center flex-1"><div className="text-gray-500 text-xs mb-1">Trước</div><div className="text-gray-400 font-bold">{project.metric_before}</div></div>
                  <div className={`text-xl bg-gradient-to-r ${project.color} bg-clip-text text-transparent`}>→</div>
                  <div className="text-center flex-1"><div className="text-gray-500 text-xs mb-1">Sau</div><div className={`font-bold text-lg bg-gradient-to-r ${project.color} bg-clip-text text-transparent`}>{project.metric_after}</div></div>
                  <div className="text-gray-500 text-xs text-right flex-1">{project.metric_unit}</div>
                </div>
                <div className={`text-sm font-semibold mb-2 bg-gradient-to-r ${project.color} bg-clip-text text-transparent`}>{project.result}</div>
                <p className="text-gray-400 text-xs mb-4">{project.detail}</p>
                <div className="flex flex-wrap gap-2">
                  {(project.tags || []).map((tag, j) => (<span key={j} className="px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-200 text-gray-400">{tag}</span>))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
