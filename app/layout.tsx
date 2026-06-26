// ISR cache 1 tiếng — layout chứa site settings (logo, theme, SEO meta) hiếm thay đổi.
// revalidate=300 (5 phút) → cache expire mỗi 5 phút → TTFB tăng lên ~1,800ms mỗi cold start.
// revalidate=3600 → cache warm hầu hết thời gian → TTFB <100ms (Vercel Edge cache hit).
export const revalidate = 3600;

import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import SeoInjector from "@/components/SeoInjector";
import ThemeInjector from "@/components/ThemeInjector";
import PageTracker from "@/components/PageTracker";
import { SettingsProvider } from "@/components/SettingsContext";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { Analytics } from "@vercel/analytics/react";
import { getSiteSettings } from "@/lib/get-settings";

// Self-hosted font via Next.js — no blocking Google Fonts request
// 3 weights thay vì 5 → tiết kiệm ~40% font bytes (~120KB) trên mobile
const beVietnam = Be_Vietnam_Pro({
  weight: ["400", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
  display: "swap",
  preload: true,
});

// ─── Viewport (themeColor tách ra khỏi metadata theo Next.js 14+) ────────────
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

// ─── Dynamic metadata ──────────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  // getSiteSettings() dùng React.cache() → share result với RootLayout, không query DB lần 2
  const s = await getSiteSettings();

  const title =
    s.meta_title ||
    "Sơn Xin Chào | Dịch Vụ SEO, Google Ads & Thiết Kế Website tại Long Thành, Đồng Nai";
  const description =
    s.meta_description ||
    "Phan Đình Sơn – chuyên gia SEO, Google Ads, Facebook Ads và thiết kế website WordPress/React tại Long Thành, Nhơn Trạch, Đồng Nai. Tăng traffic thực, tăng lead chất lượng, tăng doanh thu bền vững. Tư vấn miễn phí!";
  const keywords =
    s.meta_keywords ||
    "SEO Long Thành, SEO Đồng Nai, Google Ads Long Thành, quảng cáo Google Đồng Nai, thiết kế website Long Thành, làm website Đồng Nai, SEO website Nhơn Trạch, dịch vụ SEO tổng thể, Facebook Ads Đồng Nai, WordPress Long Thành, Phan Đình Sơn";

  // FIX: Không dùng logo_url làm favicon — logo là hình chữ nhật, favicon cần hình vuông.
  // app/favicon.ico + app/icon.tsx + app/apple-icon.tsx đã được Next.js tự inject vào <head>.
  // Chỉ override nếu cần thiết (hiện tại không cần).
  const icons: Metadata["icons"] = {
    icon: [
      { url: "/favicon.ico", sizes: "any" },           // Multi-size ICO (16/32/48/64)
      { url: "/favicon.svg", type: "image/svg+xml" },  // SVG fallback cho browser hiện đại
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180" }, // Từ app/apple-icon.tsx
    shortcut: "/favicon.ico",
  };

  return {
    // metadataBase: bắt buộc để Next.js resolve URL đúng cho tất cả pages
    // Nếu thiếu, Next.js 14 có thể dùng openGraph.url của layout làm fallback canonical
    metadataBase: new URL("https://www.sonxinchao.com"),
    title: {
      default: title,
      template: `%s | Sơn Xin Chào`,
    },
    description,
    keywords,
    authors: [{ name: "Phan Đình Sơn" }],
    icons,
    openGraph: {
      // Dùng title (meta_title) thay vì og_title riêng biệt → title & og:title luôn nhất quán
      // Nếu muốn og:title khác, set trực tiếp trong metadata của từng page cụ thể
      // NOTE: Không set url ở đây — từng page tự set openGraph.url + alternates.canonical
      // Việc set url="https://www.sonxinchao.com" tại root sẽ ghi đè canonical của tất cả pages con
      title,
      description: s.og_description || description,
      type: "website",
      siteName: s.logo_text || "Sơn Xin Chào",
      ...(s.og_image ? { images: [{ url: s.og_image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: s.og_description || description,
      ...(s.og_image ? { images: [s.og_image] } : {}),
    },
    verification: {
      google: "04zijNGwbrOcNpYQq7i9C9O8QLHim59NMDBl7vdPmak",
      // Cốc Cốc Webmaster Tools — lấy code tại webmaster.coccoc.com sau khi đăng ký
      // other: { "coccoc-site-verification": "YOUR_CODE_HERE" },
    },

    // ── Safari / iOS PWA meta tags ──────────────────────────────────────────
    // Cho phép "Add to Home Screen" iOS hoạt động như native app
    appleWebApp: {
      capable: true,
      title: s.logo_text || "Sơn Xin Chào",
      statusBarStyle: "black-translucent", // transparent status bar → hero full-screen
    },

    // Ngăn iOS tự link số điện thoại trong nội dung thành href="tel:"
    // (Gây layout shift khi text đột nhiên đổi màu xanh/underline trên iOS Safari)
    formatDetection: {
      telephone: false,
      date: false,
      address: false,
      email: false,
      url: false,
    },

  };
}

// ─── Theme CSS builder ─────────────────────────────────────────────────────────
// FIX: Luôn inline CSS vars + body critical rules → loại bỏ render-blocking FOUC.
// Trước đây chỉ inject khi có custom theme — browser phải đợi file 18 KiB tải xong
// mới biết --th-bg. Bây giờ luôn trả về CSS dù có hay không có custom theme.
function buildThemeCSS(s: Record<string, string>): string {
  // Fallback = giá trị mặc định (khớp globals.css :root) để luôn có giá trị hợp lệ
  const bg      = s.theme_bg       || "#0f172a";   // slate-900 dark default
  const bgAlt   = s.theme_bg_alt   || "";
  const text    = s.theme_text     || "#ffffff";
  const text2   = s.theme_text_2   || "";
  const text3   = s.theme_text_3   || "";
  const accent  = s.theme_accent   || "#3b82f6";
  const accent2 = s.theme_accent_2 || "#8b5cf6";
  const font    = s.theme_font     || "";

  // Không early-return nữa — luôn trả về CSS để browser render đúng màu ngay lập tức

  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex || hex.length < 7) return "";
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const isLight = (hex: string) => {
    if (!hex || hex.length < 7) return false;
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b > 0.5;
  };

  const lightBg = isLight(bg);

  // Fallback values khớp chính xác với ThemeInjector.applyTheme() → không FOUC
  const resolvedBgAlt    = bgAlt || (lightBg ? "#f8f9fa" : "#111827");
  const resolvedText     = text  || (lightBg ? "#1a1a2e" : "#ffffff");
  const resolvedText2    = text2 || (lightBg ? "#444466" : "#d1d5db");
  const resolvedText3    = text3 || (lightBg ? "#666688" : "#9ca3af");
  const resolvedCard     = lightBg ? "rgba(0,0,0,0.04)"  : "rgba(255,255,255,0.05)";
  const resolvedCardH    = lightBg ? "rgba(0,0,0,0.07)"  : "rgba(255,255,255,0.10)";
  const resolvedBorder   = lightBg ? "rgba(0,0,0,0.10)"  : "rgba(255,255,255,0.10)";
  const resolvedBorderSm = lightBg ? "rgba(0,0,0,0.05)"  : "rgba(255,255,255,0.05)";
  const resolvedBorderLg = lightBg ? "rgba(0,0,0,0.20)"  : "rgba(255,255,255,0.20)";
  const resolvedNav  = hexToRgba(bg, 0.92) || "rgba(15,23,42,0.92)";
  const fontStack    = font ? `'${font}', 'Be Vietnam Pro', 'Inter', sans-serif` : "'Be Vietnam Pro', 'Inter', sans-serif";

  // Gồm 2 phần:
  // 1. :root — CSS variables cho toàn site
  // 2. body critical rules — inline để browser render ngay không cần đợi globals.css
  return `:root {
  --th-bg: ${bg};
  --th-bg-alt: ${resolvedBgAlt};
  --th-bg-nav: ${resolvedNav};
  --th-text: ${resolvedText};
  --th-text-2: ${resolvedText2};
  --th-text-3: ${resolvedText3};
  --th-text-4: ${lightBg ? "#888899" : "#6b7280"};
  --th-card: ${resolvedCard};
  --th-card-hover: ${resolvedCardH};
  --th-border: ${resolvedBorder};
  --th-border-sm: ${resolvedBorderSm};
  --th-border-lg: ${resolvedBorderLg};
  --th-accent: ${accent};
  --th-accent-2: ${accent2};
  --th-font: ${fontStack};
}
/* Critical CSS inline — eliminates render-blocking FOUC: body bg/color không cần đợi 18 KiB CSS load */
body{background-color:${bg};color:${resolvedText}}`;
}

// ─── Root Layout ───────────────────────────────────────────────────────────────
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // React.cache() trong getSiteSettings() đảm bảo chỉ 1 DB query dù gọi từ generateMetadata + đây
  const s = await getSiteSettings();
  const themeCSS = buildThemeCSS(s);

  return (
    <html lang="vi" suppressHydrationWarning className={beVietnam.variable}>
      {/* Preconnect giảm TCP handshake time ~100–300ms cho lần fetch Supabase đầu tiên */}
      <link rel="preconnect" href="https://kpgtiqepktofdfyxgsbw.supabase.co" />
      <link rel="dns-prefetch" href="https://kpgtiqepktofdfyxgsbw.supabase.co" />
      <body className="antialiased" suppressHydrationWarning>
        {/* Critical CSS inline — luôn render, kể cả khi dùng default theme.
            Inlining CSS vars + body{background,color} → browser render đúng màu ngay
            mà không cần đợi file globals.css (18 KiB) tải xong → loại bỏ render-blocking FOUC */}
        <style id="site-theme" dangerouslySetInnerHTML={{ __html: themeCSS }} />
        <SettingsProvider value={s}>
          <CartProvider>
            <SeoInjector />
            <ThemeInjector />
            <PageTracker />
            {children}
            <CartDrawer />
          </CartProvider>
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}
