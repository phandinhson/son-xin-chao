export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import "./globals.css";
import SeoInjector from "@/components/SeoInjector";
import ThemeInjector from "@/components/ThemeInjector";
import PageTracker from "@/components/PageTracker";
import { supabaseAdmin } from "@/lib/supabase";
import { Analytics } from "@vercel/analytics/react";
// Fetch settings từ Supabase server-side
async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return {};
    const db = supabaseAdmin();
    const { data } = await db.from("site_settings").select("key, value");
    if (!data) return {};
    return Object.fromEntries(data.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

// Dynamic metadata — sync từ admin panel
export async function generateMetadata(): Promise<Metadata> {
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

  // Nếu admin đã upload logo → dùng làm favicon; fallback về icon.tsx tự động
  const iconsMeta = s.logo_url
    ? {
        icon: [
          { url: s.logo_url, sizes: "any" },
          { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        apple: [{ url: s.logo_url, sizes: "180x180" }],
        shortcut: s.logo_url,
      }
    : {
        icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      };

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Phan Đình Sơn" }],
    icons: iconsMeta,
    alternates: {
      canonical: "https://www.sonxinchao.com",
    },
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

// Build theme CSS from settings
function buildThemeCSS(s: Record<string, string>): string {
  const bg        = s.theme_bg        || "";
  const bgAlt     = s.theme_bg_alt    || "";
  const text      = s.theme_text      || "";
  const text2     = s.theme_text_2    || "";
  const text3     = s.theme_text_3    || "";
  const accent    = s.theme_accent    || "";
  const accent2   = s.theme_accent_2  || "";
  const font      = s.theme_font      || "";

  // If no custom theme set, return empty (use CSS var defaults)
  if (!bg && !text && !font) return "";

  // Helper: hex to rgba for nav (90% opacity)
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Detect if background is light (luminance > 0.5)
  const isLight = (hex: string) => {
    if (!hex || hex.length < 7) return false;
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 0.5;
  };

  const lightBg = isLight(bg);
  const resolvedBgAlt  = bgAlt || (lightBg ? "#f8f9fa" : "#1e293b");
  const resolvedText   = text  || (lightBg ? "#1a1a2e" : "#f1f5f9");
  const resolvedText2  = text2 || (lightBg ? "#444466" : "#cbd5e1");
  const resolvedText3  = text3 || (lightBg ? "#666688" : "#94a3b8");
  const resolvedCard   = lightBg ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)";
  const resolvedCardH  = lightBg ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.10)";
  const resolvedBorder = lightBg ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.10)";
  const resolvedBorderSm = lightBg ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";
  const resolvedBorderLg = lightBg ? "rgba(0,0,0,0.20)" : "rgba(255,255,255,0.20)";
  const resolvedNav    = bg ? hexToRgba(bg, 0.92) : (lightBg ? "rgba(255,255,255,0.92)" : "rgba(3,7,18,0.92)");

  return `:root {
  --th-bg: ${bg || "#0f172a"};
  --th-bg-alt: ${resolvedBgAlt};
  --th-bg-nav: ${resolvedNav};
  --th-text: ${resolvedText};
  --th-text-2: ${resolvedText2};
  --th-text-3: ${resolvedText3};
  --th-text-4: ${lightBg ? "#888899" : "#64748b"};
  --th-card: ${resolvedCard};
  --th-card-hover: ${resolvedCardH};
  --th-border: ${resolvedBorder};
  --th-border-sm: ${resolvedBorderSm};
  --th-border-lg: ${resolvedBorderLg};
  --th-accent: ${accent || "#3b82f6"};
  --th-accent-2: ${accent2 || "#8b5cf6"};
  --th-font: ${font ? `'${font}', 'Be Vietnam Pro', 'Inter', sans-serif` : "'Be Vietnam Pro', 'Inter', sans-serif"};
}`;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSiteSettings();
  const themeCSS = buildThemeCSS(s);

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {themeCSS && (
          <style id="site-theme" dangerouslySetInnerHTML={{ __html: themeCSS }} />
        )}
        <SeoInjector />
        <ThemeInjector />
        <PageTracker />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
