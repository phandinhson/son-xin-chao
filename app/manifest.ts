import { MetadataRoute } from "next";

/**
 * Web App Manifest — PWA support cho Safari iOS & Chrome Android
 *
 * Lợi ích SEO:
 * - Google ưu tiên site có manifest trong mobile search ranking
 * - Safari iOS: "Add to Home Screen" hiện đúng tên, icon, splash screen
 * - Chrome Android: banner "Install App" tự xuất hiện
 * - Cải thiện Core Web Vitals vì browser cache manifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sơn Xin Chào | SEO · Ads · Website",
    short_name: "Sơn Xin Chào",
    description:
      "Dịch vụ SEO, Google Ads, Facebook Ads và thiết kế website WordPress/React tại Long Thành, Đồng Nai. Tăng traffic thực, tăng lead chất lượng.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    lang: "vi",
    dir: "ltr",
    categories: ["business", "marketing", "productivity"],
    // Icons: Next.js tự generate /apple-icon và /icon từ app/apple-icon.tsx + app/icon.tsx
    icons: [
      {
        src: "/apple-icon",          // app/apple-icon.tsx → 180×180 PNG
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",                // app/icon.tsx → 32×32 PNG
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.svg",         // SVG scalable → mọi resolution
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",         // Android adaptive icon
      },
    ],
    screenshots: [
      {
        src: "/og-image.jpg",
        sizes: "1200x630",
        type: "image/jpeg",
        // @ts-expect-error: form_factor là PWA spec mới, chưa trong TypeScript types
        form_factor: "wide",
        label: "Sơn Xin Chào - Digital Marketing Specialist",
      },
    ],
    shortcuts: [
      {
        name: "Liên hệ tư vấn",
        short_name: "Liên hệ",
        description: "Gửi yêu cầu tư vấn miễn phí",
        url: "/contact",
        icons: [{ src: "/apple-icon", sizes: "180x180" }],
      },
      {
        name: "Xem dịch vụ SEO",
        short_name: "SEO",
        description: "Dịch vụ SEO Organic Long Thành, Đồng Nai",
        url: "/dich-vu/seo",
        icons: [{ src: "/apple-icon", sizes: "180x180" }],
      },
    ],
  };
}
