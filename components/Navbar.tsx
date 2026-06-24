"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/components/SettingsContext";

const SearchModal = dynamic(() => import("./SearchModal"), { ssr: false });

/* ──────────────────────────────────────────────
   Types
────────────────────────────────────────────── */
type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  description: string;
  type: "link" | "group" | "item";
  parent_id: string | null;
  sort_order: number;
  active: boolean;
  open_new_tab: boolean;
  badge: string;
  badge_color: string;
};

/* ──────────────────────────────────────────────
   Hardcoded fallback (dùng khi DB trả về rỗng)
────────────────────────────────────────────── */
const FALLBACK_ITEMS: NavItem[] = [
  { id: "f1", label: "Về Sơn",    href: "/gioi-thieu", icon: "", description: "", type: "link",  parent_id: null, sort_order: 1, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f2", label: "Seo AI",    href: "#",           icon: "", description: "", type: "group", parent_id: null, sort_order: 2, active: true, open_new_tab: false, badge: "AI", badge_color: "violet" },
  { id: "f3", label: "Dịch vụ",   href: "#",           icon: "", description: "", type: "group", parent_id: null, sort_order: 3, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f4", label: "Portfolio",  href: "/#portfolio", icon: "", description: "", type: "link",  parent_id: null, sort_order: 4, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f5", label: "Bảng giá",  href: "/pricing",    icon: "", description: "", type: "link",  parent_id: null, sort_order: 5, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f6", label: "Cửa hàng",  href: "/shop",       icon: "", description: "", type: "link",  parent_id: null, sort_order: 6, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f7", label: "Kiến thức", href: "#",           icon: "", description: "", type: "group", parent_id: null, sort_order: 7, active: true, open_new_tab: false, badge: "", badge_color: "" },
  // SEO AI items
  { id: "f2a", label: "SEO Từ khóa",              href: "/contact",     icon: "🔑", description: "Nghiên cứu & chọn từ khóa tiềm năng bằng AI", type: "item", parent_id: "f2", sort_order: 1, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f2b", label: "SEO Tổng thể",             href: "/dich-vu/seo", icon: "🚀", description: "Chiến lược SEO toàn diện cho website", type: "item", parent_id: "f2", sort_order: 2, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f2c", label: "Dịch vụ SEO hiệu quả cao", href: "/dich-vu/seo", icon: "📈", description: "Cam kết top Google trong 3–6 tháng", type: "item", parent_id: "f2", sort_order: 3, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f2d", label: "SEO Onpage",               href: "/dich-vu/seo", icon: "📝", description: "Tối ưu nội dung, cấu trúc, tốc độ trang", type: "item", parent_id: "f2", sort_order: 4, active: true, open_new_tab: false, badge: "", badge_color: "" },
  // Dịch vụ items
  { id: "f3a", label: "SEO Organic",              href: "/dich-vu/seo",              icon: "🔍", description: "Lên top Google bền vững, tăng traffic tự nhiên", type: "item", parent_id: "f3", sort_order: 1, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f3b", label: "SEO TP.HCM",              href: "/dich-vu/seo-hcm",          icon: "🏙️", description: "Chuyên biệt cho doanh nghiệp tại TP. Hồ Chí Minh", type: "item", parent_id: "f3", sort_order: 2, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f3c", label: "Google Ads",              href: "/dich-vu/google-ads",       icon: "📈", description: "Quảng cáo tìm kiếm & display hiệu quả", type: "item", parent_id: "f3", sort_order: 3, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f3d", label: "Facebook Ads",            href: "/dich-vu/facebook-ads",     icon: "📣", description: "Tiếp cận đúng khách hàng mục tiêu trên Meta", type: "item", parent_id: "f3", sort_order: 4, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f3e", label: "TikTok Ads",              href: "/dich-vu/tiktok-ads",       icon: "🎵", description: "Viral content & quảng cáo video TikTok", type: "item", parent_id: "f3", sort_order: 5, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f3f", label: "Thiết kế Website",        href: "/dich-vu/thiet-ke-website", icon: "💻", description: "WordPress chuẩn SEO, tốc độ cao", type: "item", parent_id: "f3", sort_order: 6, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f3g", label: "SEO Local (Google Map)",  href: "/dich-vu/seo-local",        icon: "📍", description: "Hiển thị khi khách tìm kiếm gần bạn", type: "item", parent_id: "f3", sort_order: 7, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f3h", label: "Audit & Tư vấn",          href: "/dich-vu/audit-tu-van",     icon: "🎯", description: "Phân tích toàn diện & lộ trình chiến lược", type: "item", parent_id: "f3", sort_order: 8, active: true, open_new_tab: false, badge: "", badge_color: "" },
  // Kiến thức items
  { id: "f7a", label: "Blog & Kiến thức",    href: "/blog",       icon: "📖", description: "Chia sẻ kiến thức thực chiến về Digital Marketing", type: "item", parent_id: "f7", sort_order: 1, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f7b", label: "Hướng dẫn SEO",      href: "/blog",       icon: "🔍", description: "Từ cơ bản đến nâng cao", type: "item", parent_id: "f7", sort_order: 2, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f7c", label: "Google Ads",         href: "/blog",       icon: "📊", description: "Chạy quảng cáo hiệu quả, tiết kiệm chi phí", type: "item", parent_id: "f7", sort_order: 3, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f7d", label: "Website & WordPress",href: "/blog",       icon: "🌐", description: "Xây dựng website chuẩn SEO", type: "item", parent_id: "f7", sort_order: 4, active: true, open_new_tab: false, badge: "", badge_color: "" },
  { id: "f7e", label: "Thủ thuật AI",       href: "/cong-cu-ai", icon: "🤖", description: "Công cụ AI tạo ảnh, video, âm thanh & văn phòng", type: "item", parent_id: "f7", sort_order: 5, active: true, open_new_tab: false, badge: "", badge_color: "" },
];

/* Badge colors */
const BADGE_CLASS: Record<string, string> = {
  violet: "bg-gradient-to-r from-violet-500 to-blue-500 text-white",
  red:    "bg-red-500 text-white",
  green:  "bg-emerald-500 text-white",
  blue:   "bg-blue-500 text-white",
  amber:  "bg-amber-400 text-white",
};

/* ──────────────────────────────────────────────
   Mobile Accordion
────────────────────────────────────────────── */
function MobileAccordion({ label, items, onClose }: {
  label: string;
  items: NavItem[];
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-4 text-[15px] font-semibold transition-colors ${open ? "bg-blue-600 text-white" : "text-slate-800 hover:bg-slate-50"}`}
      >
        {label}
        <svg className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180 text-white" : "text-slate-400"}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[600px]" : "max-h-0"}`}>
        <div className="bg-slate-50 flex flex-col">
          {items.map((item) => (
            <Link key={item.id} href={item.href} onClick={onClose} prefetch={false}
              target={item.open_new_tab ? "_blank" : undefined}
              className="px-8 py-3.5 text-[14px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors flex items-center gap-2">
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Dropdown Panel (Desktop)
────────────────────────────────────────────── */
function DropdownPanel({ group, children, onClose }: {
  group: NavItem;
  children: NavItem[];
  onClose: () => void;
}) {
  const isWide = children.length > 4;
  const isViolet = group.badge_color === "violet";

  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${isWide ? "w-[620px]" : "w-72"}`}
      style={{ zIndex: 9999 }}
    >
      {/* Header */}
      <div className={`px-5 py-3 border-b border-slate-100 ${isViolet ? "bg-gradient-to-r from-violet-50 to-blue-50" : "bg-gradient-to-r from-blue-50 to-violet-50"}`}>
        <div className={`font-bold text-slate-800 text-sm flex items-center gap-2`}>
          {group.badge && (
            <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${BADGE_CLASS[group.badge_color] || "bg-gray-200 text-gray-700"}`}>
              {group.badge}
            </span>
          )}
          {group.label}
        </div>
        {group.description && (
          <p className="text-slate-500 text-xs mt-0.5">{group.description}</p>
        )}
      </div>

      {/* Items grid */}
      <div className={`p-3 ${isWide ? "grid grid-cols-3 gap-0" : ""}`}>
        {children.map((item) => (
          <Link key={item.id} href={item.href} onClick={onClose}
            target={item.open_new_tab ? "_blank" : undefined}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
            {item.icon && <span className={`mt-0.5 flex-shrink-0 ${isWide ? "text-xl" : "text-lg"}`}>{item.icon}</span>}
            <div>
              <div className={`text-sm font-semibold text-slate-800 group-hover/item:text-blue-600 transition-colors ${isWide ? "leading-tight" : ""}`}>
                {item.label}
              </div>
              {item.description && (
                <div className="text-xs text-slate-400 mt-0.5 leading-snug">{item.description}</div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Footer CTA — only for wide (services) */}
      {isWide && (
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">Tư vấn miễn phí — phản hồi trong 2 giờ</span>
          <Link href="/services" onClick={onClose}
            className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity shadow-sm">
            Xem tất cả Dịch vụ →
          </Link>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Navbar
────────────────────────────────────────────── */
export default function Navbar({ initialItems = [] }: { initialItems?: any[] }) {
  const s = useSettings();
  // Safeguard: bỏ qua base64 — tránh nhúng ~67KB string vào mọi trang
  const rawLogoUrl   = s.logo_url  || "";
  const logoUrl      = rawLogoUrl.startsWith("data:") ? "" : rawLogoUrl;
  const logoText     = s.logo_text || "Sơn Xin Chào";
  const phone        = (s.contact_phone || "0968806360").replace(/\s/g, "");
  const phoneDisplay = s.contact_phone || "0968 806 360";

  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [navItems,     setNavItems]     = useState<NavItem[]>(FALLBACK_ITEMS);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Scroll handler */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Mobile menu toggle event */
  useEffect(() => {
    const onToggle = () => setMenuOpen(v => !v);
    window.addEventListener("toggle-mobile-menu", onToggle);
    return () => window.removeEventListener("toggle-mobile-menu", onToggle);
  }, []);

  /* Fetch nav from DB — graceful fallback */
  useEffect(() => {
    fetch("/api/nav-items")
      .then(r => r.ok ? r.json() : [])
      .then((data: NavItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setNavItems(data);
        }
        // else: keep FALLBACK_ITEMS
      })
      .catch(() => {}); // keep fallback on network error
  }, []);

  const handleMouseEnter = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(key);
  };
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  /* Derived nav structure */
  const topLevel = navItems
    .filter(i => i.parent_id === null && i.active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const childrenOf = (id: string) =>
    navItems.filter(i => i.parent_id === id && i.active).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-slate-100" : "bg-white/95 backdrop-blur-md"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-2 relative">

        {/* ── Logo ── */}
        <Link href="/" prefetch={false} className="flex items-center gap-2 flex-shrink-0 group">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={32} height={32} className="w-8 h-8 rounded-lg object-cover shadow group-hover:scale-105 transition-transform" unoptimized />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">S</div>
          )}
          <div className="leading-tight">
            <div className="font-extrabold text-sm text-slate-900 tracking-tight">
              {logoText.split(" ")[0]}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {logoText.split(" ").slice(1).join(" ")}
              </span>
            </div>
            <div className="text-[9px] font-medium text-slate-400 tracking-widest uppercase hidden sm:block">SEO · Ads · Website</div>
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex items-center gap-0 flex-1 justify-center" ref={dropdownRef}>
          {topLevel.map((item) => {
            if (item.type === "link") {
              return (
                <Link key={item.id} href={item.href}
                  target={item.open_new_tab ? "_blank" : undefined}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[15px] font-semibold text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all whitespace-nowrap">
                  {item.label}
                  {item.badge && (
                    <span className={`text-[9px] px-1 py-0.5 rounded-md font-bold ${BADGE_CLASS[item.badge_color] || "bg-gray-200 text-gray-700"}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            }

            // group (dropdown)
            const isOpen    = openDropdown === item.id;
            const children  = childrenOf(item.id);
            const isViolet  = item.badge_color === "violet";

            return (
              <div key={item.id} className="relative"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}>

                <button className={`flex items-center gap-1 px-2.5 py-1.5 text-[15px] font-semibold rounded-lg transition-all whitespace-nowrap ${isOpen ? (isViolet ? "text-violet-600 bg-violet-50" : "text-blue-600 bg-blue-50") : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"}`}>
                  {item.badge && (
                    <span className={`text-[9px] px-1 py-0.5 rounded-md font-bold ${BADGE_CLASS[item.badge_color] || "bg-gray-200 text-gray-700"}`}>
                      {item.badge}
                    </span>
                  )}
                  {item.label}
                  <svg className={`w-3 h-3 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && children.length > 0 && (
                  <DropdownPanel group={item} children={children} onClose={() => setOpenDropdown(null)} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Right: phone + CTA ── */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <a href={`tel:${phone}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-[15px] font-medium whitespace-nowrap">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <span className="hidden xl:inline">{phoneDisplay}</span>
          </a>
          <div className="w-px h-4 bg-slate-200" />
          <Link href="/contact"
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-[15px] font-bold rounded-full shadow-md shadow-red-200 hover:shadow-red-300 hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap">
            Liên hệ
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          }
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? "max-h-[900px]" : "max-h-0"}`}>
        <div className="bg-white border-t border-slate-100">

          {/* Header mobile menu — Search bar thay logo thứ 2 */}
          <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600">
            <button
              onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
              className="w-full flex items-center gap-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-3 text-left transition-all"
            >
              <svg className="w-4 h-4 text-white/80 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-white/75 text-sm flex-1">Tìm kiếm dịch vụ, bài viết...</span>
              <kbd className="inline-flex items-center px-2 py-0.5 bg-white/20 border border-white/30 rounded-md text-[10px] text-white/70 font-mono">
                ⌘K
              </kbd>
            </button>
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
              {["SEO", "Google Ads", "Facebook Ads", "Bảng giá"].map(tag => (
                <button
                  key={tag}
                  onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
                  className="flex-shrink-0 px-3 py-1 bg-white/15 hover:bg-white/25 border border-white/25 rounded-full text-white text-xs font-medium transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic mobile nav items */}
          <div className="flex flex-col">
            {topLevel.map((item) => {
              if (item.type === "link") {
                return (
                  <Link key={item.id} href={item.href}
                    target={item.open_new_tab ? "_blank" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-5 py-4 text-[15px] font-semibold text-slate-800 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${BADGE_CLASS[item.badge_color] || "bg-gray-200 text-gray-700"}`}>
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              }
              // group
              return (
                <MobileAccordion key={item.id} label={item.label}
                  items={childrenOf(item.id)} onClose={() => setMenuOpen(false)} />
              );
            })}
          </div>

          {/* CTA bottom */}
          <div className="px-5 py-4 flex flex-col gap-3">
            <a href={`tel:${phone}`} onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              {phoneDisplay}
            </a>
            <Link href="/contact" onClick={() => setMenuOpen(false)}
              className="text-center py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold rounded-xl">
              Liên hệ tư vấn miễn phí →
            </Link>
          </div>
        </div>
      </div>
    </nav>

    <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
