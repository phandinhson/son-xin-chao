"use client";
import { useSettings } from "@/components/SettingsContext";

export default function Footer() {
  const s = useSettings();
  const logoUrl = s.logo_url  || "";
  const logoText = s.logo_text || "Sơn Xin Chào";
  const zalo    = s.contact_zalo     || "0968806360";
  const facebook = s.contact_facebook || "fb.com/sonxinchao";
  const phone   = s.contact_phone    || "0968 806 360";
  const email   = s.contact_email    || "phandinhsonlp116@gmail.com";

  const columns = [
    {
      title: "Về Sơn",
      links: [
        { label: "Giới thiệu", href: "#about" },
        { label: "Portfolio", href: "#portfolio" },
        { label: "Bảng giá", href: "#pricing" },
        { label: "Blog & Kiến thức", href: "/blog" },
        { label: "Liên hệ tư vấn", href: "#contact" },
      ],
    },
    {
      title: "Dịch vụ",
      links: [
        { label: "SEO Organic (lên top Google)", href: "#services" },
        { label: "Google Ads (tìm kiếm & display)", href: "#services" },
        { label: "Facebook & TikTok Ads", href: "#services" },
        { label: "Thiết kế Website WordPress", href: "#services" },
        { label: "SEO Local (Google Map)", href: "#services" },
        { label: "Audit & Tư vấn Marketing", href: "#contact" },
      ],
    },
    {
      title: "Kiến thức",
      links: [
        { label: "Hướng dẫn SEO từ A–Z", href: "/blog" },
        { label: "Chạy Google Ads hiệu quả", href: "/blog" },
        { label: "Facebook Ads cho người mới", href: "/blog" },
        { label: "Tối ưu tốc độ website", href: "/blog" },
        { label: "Xây dựng Content Marketing", href: "/blog" },
      ],
    },
    {
      title: "Khu vực phục vụ",
      links: [
        { label: "Long Thành, Đồng Nai", href: "#contact" },
        { label: "Nhơn Trạch, Đồng Nai", href: "#contact" },
        { label: "Biên Hòa, Đồng Nai", href: "#contact" },
        { label: "TP. Hồ Chí Minh", href: "#contact" },
        { label: "Toàn quốc (Online)", href: "#contact" },
      ],
    },
  ];

  const socials = [
    {
      label: "Facebook",
      href: facebook.startsWith("http") ? facebook : `https://${facebook}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      label: "Zalo",
      href: `https://zalo.me/${zalo.replace(/\s/g, "")}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V9h2v7zm4 0h-2V9h2v7z" />
        </svg>
      ),
    },
    {
      label: "TikTok",
      href: "#",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: "#",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "#",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

  const badges = [
    { label: "Google Partner", emoji: "🔵" },
    { label: "Meta Business", emoji: "📘" },
    { label: "Chứng chỉ Google Ads", emoji: "🏆" },
    { label: "3+ Năm kinh nghiệm", emoji: "⭐" },
  ];

  return (
    <footer>
      {/* Main footer — light teal/blue bg like reference */}
      <div className="bg-[#e8f4f0] border-t border-[#d0e8e0]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-blue-700 font-bold text-sm uppercase tracking-wide mb-4 pb-2 border-b border-blue-200">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-slate-600 hover:text-blue-700 text-sm transition-colors leading-snug block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section — white bg */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left: Brand + bio + contact */}
            <div>
              {/* Logo */}
              <div className="flex items-center gap-3 mb-4">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-11 h-11 rounded-xl object-cover shadow" />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                    S
                  </div>
                )}
                <div>
                  <div className="text-slate-900 font-bold text-lg leading-tight">{logoText}</div>
                  <div className="text-blue-600 text-xs font-medium">SEO · Ads · Website</div>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-md">
                <strong className="text-slate-700">Phan Đình Sơn</strong> — Chuyên gia Digital Marketing với 3+ năm kinh nghiệm thực chiến.
                Tôi giúp doanh nghiệp tăng traffic hữu cơ, tối ưu quảng cáo và xây dựng website chuyên nghiệp — kết quả đo lường được.
              </p>

              {/* Contact info */}
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <span>Long Thành, Đồng Nai (Phục vụ toàn quốc)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">📞</span>
                  <a href={`tel:${phone.replace(/\s/g,"")}`} className="hover:text-blue-600 transition-colors">{phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">✉️</span>
                  <a href={`mailto:${email}`} className="hover:text-blue-600 transition-colors">{email}</a>
                </div>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-2 mt-5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Trust badges */}
            <div>
              <h4 className="text-slate-700 font-bold text-sm uppercase tracking-wide mb-4 pb-2 border-b border-slate-100">
                Chứng nhận & Uy tín
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {badges.map((b) => (
                  <div key={b.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xl">{b.emoji}</span>
                    <span className="text-slate-700 text-xs font-medium leading-tight">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Quick CTA */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100">
                <p className="text-slate-700 text-sm font-semibold mb-1">Cần tư vấn miễn phí?</p>
                <p className="text-slate-500 text-xs mb-3">Gửi yêu cầu ngay — phản hồi trong 2 giờ.</p>
                <a href="#contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity shadow-sm">
                  Liên hệ ngay →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© 2026 Sơn Xin Chào — Phan Đình Sơn. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
