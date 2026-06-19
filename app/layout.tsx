// Settings cache 5 phút — đủ fresh, giảm 5x số Supabase queries so với 60s
export const revalidate = 300;

import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import SeoInjector from "@/components/SeoInjector";
import ThemeInjector from "@/components/ThemeInjector";
import PageTracker from "@/components/PageTracker";
import { SettingsProvider } from "@/components/SettingsContext";
import { Analytics } from "@vercel/analytics/react";
import { getSiteSettings } from "@/lib/get-settings";

// Self-hosted font via Next.js — no blocking Google Fonts request
const beVietnam = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700", "800"], // bỏ "300" — tiết kiệm 2 font file
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
  display: "swap",
  preload: true,
});

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
    title,
    description,
    keywords,
    authors: [{ name: "Phan Đình Sơn" }],
    icons,
    openGraph: {
      title: s.og_title || title,
      description: s.og_description || description,
      type: "website",
      url: "https://www.sonxinchao.com",
      siteName: s.logo_text || "Sơn Xin Chào",
      ...(s.og_image ? { images: [{ url: s.og_image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: s.og_title || title,
      description: s.og_description || description,
      ...(s.og_image ? { images: [s.og_image] } : {}),
    },
    verification: {
      google: "04zijNGwbrOcNpYQq7i9C9O8QLHim59NMDBl7vdPmak",
    },
  };
}

// ─── Theme CSS builder ─────────────────────────────────────────────────────────
// FIX: Đồng bộ fallback màu với ThemeInjector.applyTheme() để tránh FOUC khi hydrate
function buildThemeCSS(s: Record<string, string>): string {
  const bg      = s.theme_bg       || "";
  const bgAlt   = s.theme_bg_alt   || "";
  const text    = s.theme_text     || "";
  const text2   = s.theme_text_2   || "";
  const text3   = s.theme_text_3   || "";
  const accent  = s.theme_accent   || "";
  const accent2 = s.theme_accent_2 || "";
  const font    = s.theme_font     || "";

  // Không có custom theme → dùng CSS var defaults trong globals.css
  if (!bg && !text && !font) return "";

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
  const resolvedNav      = bg ? hexToRgba(bg, 0.92) : "";

  return `:root {
  --th-bg: ${bg || "#0f172a"};
  --th-bg-alt: ${resolvedBgAlt};${resolvedNav ? `\n  --th-bg-nav: ${resolvedNav};` : ""}
  --th-text: ${resolvedText};
  --th-text-2: ${resolvedText2};
  --th-text-3: ${resolvedText3};
  --th-text-4: ${lightBg ? "#888899" : "#6b7280"};
  --th-card: ${resolvedCard};
  --th-card-hover: ${resolvedCardH};
  --th-border: ${resolvedBorder};
  --th-border-sm: ${resolvedBorderSm};
  --th-border-lg: ${resolvedBorderLg};
  --th-accent: ${accent  || "#3b82f6"};
  --th-accent-2: ${accent2 || "#8b5cf6"};
  --th-font: ${font ? `'${font}', 'Be Vietnam Pro', 'Inter', sans-serif` : "'Be Vietnam Pro', 'Inter', sans-serif"};
}`;
}

// ─── Root Layout ───────────────────────────────────────────────────────────────
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // React.cache() trong getSiteSettings() đảm bảo chỉ 1 DB query dù gọi từ generateMetadata + đây
  const s = await getSiteSettings();
  const themeCSS = buildThemeCSS(s);

  return (
    <html lang="vi" suppressHydrationWarning className={beVietnam.variable}>
      <head>
        {/* Theme CSS inject vào <head> — tránh FOUC, browser apply trước khi render body */}
        {themeCSS && (
          <style id="site-theme" dangerouslySetInnerHTML={{ __html: themeCSS }} />
        )}
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <SettingsProvider value={s}>
          <SeoInjector />
          <ThemeInjector />
          <PageTracker />
          {children}
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}
