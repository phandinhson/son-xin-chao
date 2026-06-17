"use client";
import { useState, useEffect, useRef } from "react";

/* ── Nav data ── */
const SERVICES = [
  { label: "SEO Organic", sub: "Lên top Google bền vững, tăng traffic tự nhiên", href: "/dich-vu/seo", icon: "🔍" },
  { label: "Google Ads", sub: "Quảng cáo tìm kiếm & display hiệu quả", href: "/dich-vu/google-ads", icon: "📈" },
  { label: "Facebook Ads", sub: "Tiếp cận đúng khách hàng mục tiêu trên Meta", href: "/dich-vu/facebook-ads", icon: "📣" },
  { label: "TikTok Ads", sub: "Viral content & quảng cáo video TikTok", href: "/dich-vu/tiktok-ads", icon: "🎵" },
  { label: "Thiết kế Website", sub: "WordPress chuẩn SEO, tốc độ cao", href: "/dich-vu/thiet-ke-website", icon: "💻" },
  { label: "SEO Local (Google Map)", sub: "Hiển thị khi khách tìm kiếm gần bạn", href: "/#services", icon: "📍" },
  { label: "Audit & Tư vấn", sub: "Phân tích toàn diện & lộ trình chiến lược", href: "/#contact", icon: "🎯" },
];

const SEO_AI = [
  { label: "SEO Từ khóa", sub: "Nghiên cứu & chọn từ khóa tiềm năng bằng AI", href: "/#contact", icon: "🔑" },
  { label: "SEO Tổng thể", sub: "Chiến lược SEO toàn diện cho website", href: "/dich-vu/seo", icon: "🚀" },
  { label: "Dịch vụ SEO hiệu quả cao", sub: "Cam kết top Google trong 3–6 tháng", href: "/dich-vu/seo", icon: "📈" },
  { label: "SEO Onpage", sub: "Tối ưu nội dung, cấu trúc, tốc độ trang", href: "/dich-vu/seo", icon: "📝" },
];

const KNOWLEDGE = [
  { label: "Blog & Kiến thức", sub: "Chia sẻ kiến thức thực chiến về Digital Marketing", href: "/blog", icon: "📖" },
  { label: "Hướng dẫn SEO", sub: "Từ cơ bản đến nâng cao", href: "/blog", icon: "🔍" },
  { label: "Google Ads", sub: "Chạy quảng cáo hiệu quả, tiết kiệm chi phí", href: "/blog", icon: "📊" },
  { label: "Website & WordPress", sub: "Xây dựng website chuẩn SEO", href: "/blog", icon: "🌐" },
];

const navLinks = [
  { href: "#about", label: "Về Sơn", dropdown: null },
  { href: "#portfolio", label: "Portfolio", dropdown: null },
  { href: "#pricing", label: "Bảng giá", dropdown: null },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoText, setLogoText] = useState("Sơn Xin Chào");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onToggle = () => setMenuOpen(v => !v);
    window.addEventListener("toggle-mobile-menu", onToggle);
    return () => window.removeEventListener("toggle-mobile-menu", onToggle);
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.logo_url) setLogoUrl(d.logo_url);
        if (d?.logo_text) setLogoText(d.logo_text);
      })
      .catch(() => {});
  }, []);

  const handleMouseEnter = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-slate-100" : "bg-white/95 backdrop-blur-md"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4 relative">

        {/* ── Logo ── */}
        <a href="#" className="flex items-center gap-2.5 flex-shrink-0 group md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-9 h-9 rounded-xl object-cover shadow group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">S</div>
          )}
          <div className="leading-tight">
            <div className="font-extrabold text-base text-slate-900 tracking-tight">
              {logoText.split(" ")[0]}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {logoText.split(" ").slice(1).join(" ")}
              </span>
            </div>
            <div className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">SEO · Ads · Website</div>
          </div>
        </a>

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center" ref={dropdownRef}>

          {/* Về Sơn */}
          <a href="/#about" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
            Về Sơn
          </a>

          {/* SEO AI dropdown */}
          <div className="relative" onMouseEnter={() => handleMouseEnter("seoai")} onMouseLeave={handleMouseLeave}>
            <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${openDropdown === "seoai" ? "text-violet-600 bg-violet-50" : "text-slate-600 hover:text-violet-600 hover:bg-violet-50"}`}>
              <span className="text-xs bg-gradient-to-r from-violet-500 to-blue-500 text-white px-1.5 py-0.5 rounded-md font-bold tracking-wide">AI</span>
              Seo AI
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "seoai" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openDropdown === "seoai" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-blue-50">
                  <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span className="text-xs bg-gradient-to-r from-violet-500 to-blue-500 text-white px-1.5 py-0.5 rounded-md font-bold">AI</span>
                    Công cụ SEO thông minh
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">Ứng dụng AI vào chiến lược SEO</p>
                </div>
                <div className="p-3">
                  {SEO_AI.map((s) => (
                    <a key={s.label} href={s.href}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                      onClick={() => setOpenDropdown(null)}>
                      <span className="text-lg mt-0.5">{s.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover/item:text-violet-600 transition-colors">{s.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dịch vụ dropdown */}
          <div className="relative" onMouseEnter={() => handleMouseEnter("services")} onMouseLeave={handleMouseLeave}>
            <button className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${openDropdown === "services" ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"}`}>
              Dịch vụ
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "services" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mega dropdown */}
            {openDropdown === "services" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[620px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-violet-50">
                  <div className="font-bold text-slate-800 text-sm">Dịch vụ Digital Marketing</div>
                  <p className="text-slate-500 text-xs mt-0.5">Giải pháp tăng trưởng toàn diện cho doanh nghiệp</p>
                </div>
                {/* Grid */}
                <div className="grid grid-cols-3 gap-0 p-4">
                  {SERVICES.map((s) => (
                    <a key={s.label} href={s.href}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                      onClick={() => setOpenDropdown(null)}>
                      <span className="text-xl mt-0.5 flex-shrink-0">{s.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover/item:text-blue-600 transition-colors leading-tight">{s.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5 leading-snug">{s.sub}</div>
                      </div>
                    </a>
                  ))}
                </div>
                {/* Footer CTA */}
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Tư vấn miễn phí — phản hồi trong 2 giờ</span>
                  <a href="/services" onClick={() => setOpenDropdown(null)}
                    className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity shadow-sm">
                    Xem tất cả Dịch vụ →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Portfolio */}
          <a href="/#portfolio" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
            Portfolio
          </a>

          {/* Bảng giá */}
          <a href="/#pricing" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
            Bảng giá
          </a>

          {/* Kiến thức dropdown */}
          <div className="relative" onMouseEnter={() => handleMouseEnter("knowledge")} onMouseLeave={handleMouseLeave}>
            <button className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${openDropdown === "knowledge" ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"}`}>
              Kiến thức
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "knowledge" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openDropdown === "knowledge" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-violet-50">
                  <div className="font-bold text-slate-800 text-sm">Blog & Kiến thức</div>
                  <p className="text-slate-500 text-xs mt-0.5">Thực chiến từ người làm thực tế</p>
                </div>
                <div className="p-3">
                  {KNOWLEDGE.map((k) => (
                    <a key={k.label} href={k.href}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                      onClick={() => setOpenDropdown(null)}>
                      <span className="text-lg mt-0.5">{k.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover/item:text-blue-600 transition-colors">{k.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{k.sub}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: phone + CTA ── */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <a href="tel:0968806360"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <span className="hidden lg:inline">0968 806 360</span>
          </a>
          <div className="w-px h-5 bg-slate-200" />
          <a href="/#contact"
            className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-sm font-bold rounded-full shadow-md shadow-red-200 hover:shadow-red-300 hover:scale-105 active:scale-95 transition-all duration-200">
            Liên hệ
          </a>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          }
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[600px]" : "max-h-0"}`}>
        <div className="bg-white border-t border-slate-100 px-4 py-3 flex flex-col gap-1">
          {[
            { href: "/#about", label: "Về Sơn" },
            { href: "/dich-vu/seo", label: "🤖 SEO AI" },
            { href: "/dich-vu/seo", label: "🔍 SEO Organic" },
            { href: "/dich-vu/google-ads", label: "📊 Google Ads" },
            { href: "/dich-vu/thiet-ke-website", label: "💻 Thiết kế Website" },
            { href: "/dich-vu/facebook-ads", label: "📣 Facebook Ads" },
            { href: "/dich-vu/tiktok-ads", label: "🎵 TikTok Ads" },
            { href: "/#portfolio", label: "Portfolio" },
            { href: "/#pricing", label: "Bảng giá" },
            { href: "/blog", label: "Kiến thức" },
          ].map((link) => (
            <a key={link.href} href={link.href}
              className="px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-semibold rounded-xl transition-colors"
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a href="tel:0968806360"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 text-sm font-medium rounded-xl bg-slate-50"
              onClick={() => setMenuOpen(false)}>
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              0968 806 360
            </a>
            <a href="/#contact"
              className="text-center py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-bold rounded-2xl shadow-md"
              onClick={() => setMenuOpen(false)}>
              Liên hệ ngay →
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
