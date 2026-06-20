"use client";
import { useEffect, useRef } from "react";
import { useSettings } from "@/components/SettingsContext";

const defaultSettings = {
  hero_name: "Sơn",
  hero_tagline: "Digital Marketing Specialist",
  hero_description: "Tôi giúp doanh nghiệp tăng traffic hữu cơ, tối ưu quảng cáo và xây dựng website chuyên nghiệp — mang lại kết quả thực tế, đo lường được.",
  stat_years: "3+",
  stat_projects: "50+",
  stat_satisfaction: "98%",
  stat_roas: "2x",
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Dùng SettingsContext thay vì fetch("/api/settings") — tiết kiệm 57.6 kB + 1 round-trip mạng
  const settings = useSettings();
  const s = { ...defaultSettings, ...settings };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Giảm particles trên mobile để tiết kiệm GPU
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 60;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number; size: number; opacity: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`;
        ctx.fill();
      });
      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gray-950">
      {/* Particle canvas — ẩn trên mobile để tiết kiệm GPU */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none hidden md:block" />

      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="hidden md:block absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/8 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-300 bg-blue-50 text-blue-600 text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Sẵn sàng nhận dự án mới
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Xin chào, tôi là{" "}
              <span className="gradient-text block">{s.hero_name}</span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 font-light mb-4 leading-relaxed">
              {s.hero_tagline}
            </p>

            <p className="text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              {s.hero_description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
              {["SEO Organic", "Google Ads", "Facebook Ads", "WordPress"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 text-sm font-medium rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-full hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-blue-500/30 text-center"
              >
                Tư vấn miễn phí →
              </a>
              <a
                href="#portfolio"
                className="px-8 py-4 border border-slate-300 text-slate-800 font-semibold rounded-full hover:bg-slate-100 hover:border-slate-400 transition-all text-center"
              >
                Xem Portfolio
              </a>
            </div>
          </div>

          {/* Right: Avatar Card */}
          <div className="flex-shrink-0 relative">
            <div className="relative w-72 h-72 lg:w-80 lg:h-80">
              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30 animate-spin [animation-duration:20s]" />
              <div className="absolute inset-4 rounded-full border border-violet-500/20 animate-spin [animation-duration:15s] [animation-direction:reverse]" />

              {/* Main avatar */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-600 via-violet-600 to-pink-600 p-1 shadow-2xl shadow-blue-500/30 animate-float">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">👋</div>
                    <p className="text-white font-bold text-lg">Phan Đình Sơn</p>
                    <p className="text-gray-400 text-sm">Marketing Specialist</p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white border border-blue-200 rounded-2xl px-4 py-2 shadow-lg animate-float [animation-delay:0.5s]">
                <div className="text-xs text-slate-500">Top Keyword</div>
                <div className="text-green-400 font-bold text-sm">🏆 #1 Google</div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white border border-violet-200 rounded-2xl px-4 py-2 shadow-lg animate-float [animation-delay:1s]">
                <div className="text-xs text-slate-500">ROAS trung bình</div>
                <div className="text-violet-400 font-bold text-sm">📈 4.5x</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: s.stat_years, label: "Năm kinh nghiệm" },
            { value: s.stat_projects, label: "Dự án hoàn thành" },
            { value: s.stat_satisfaction, label: "Khách hàng hài lòng" },
            { value: s.stat_roas, label: "ROI trung bình" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all card-hover shadow-sm"
            >
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 animate-bounce">
        <span className="text-xs">Cuộn xuống</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
