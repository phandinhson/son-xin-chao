import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/get-settings";
import { supabaseAdmin } from "@/lib/supabase";
import dynamic from "next/dynamic";
import { unstable_cache } from "next/cache";

// ─── Above fold — load ngay, không lazy ────────────────────────────────────────
import Navbar     from "@/components/Navbar";
import Hero       from "@/components/Hero";
import SearchStrip from "@/components/SearchStrip";

// ─── Below fold — code-split thành chunk riêng, vẫn SSR cho SEO ───────────────
const About    = dynamic(() => import("@/components/About"));
const Services = dynamic(() => import("@/components/Services"));
const Portfolio = dynamic(() => import("@/components/Portfolio"));
const Pricing  = dynamic(() => import("@/components/Pricing"));
const Blog     = dynamic(() => import("@/components/Blog"));
const Contact  = dynamic(() => import("@/components/Contact"));
const Footer   = dynamic(() => import("@/components/Footer"));

// ─── Purely UI — skip SSR hoàn toàn (không có nội dung SEO) ──────────────────
const MobileBar       = dynamic(() => import("@/components/MobileBar"),       { ssr: false });
const FloatingContacts = dynamic(() => import("@/components/FloatingContacts"), { ssr: false });

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.sonxinchao.com",
  },
  openGraph: {
    url: "https://www.sonxinchao.com",
  },
};

export default async function Home() {
  const s = await getSiteSettings();

  const getCachedNavItems = unstable_cache(
    async () => {
      try {
        const db = supabaseAdmin();
        const { data } = await db.from("nav_items").select("*").eq("active", true);
        if (data && data.length > 0) return data;
      } catch (e) {
        console.error("Lỗi fetch menu trang chủ:", e);
      }
      return [];
    },
    ["navbar-menu-cache"],
    { revalidate: 3600 }
  );

  // Chỉ fetch nav + settings ở SSR — blog/portfolio/pricing fetch client-side khi scroll đến.
  // Lợi ích: HTML giảm ~15-18 KiB (bỏ JSON data embedded), TTFB giảm ~200-400ms.
  // Blog, Portfolio, Pricing đều có fallback fetch("/api/...") + default data sẵn.
  const menuData = await getCachedNavItems();

  const phone    = s.contact_phone    || "0968806360";
  const email    = s.contact_email    || "phandinhson@sonxinchao.com";
  const facebook = s.contact_facebook || "https://fb.com/sonxinchao";
  const zalo     = s.contact_zalo     || "0968806360";
  const logoUrl  = s.logo_url         || "https://www.sonxinchao.com/og-image.jpg";

  const phoneE164 = `+84${phone.replace(/^0/, "").replace(/\s/g, "")}`;
  const facebookUrl = facebook.startsWith("http") ? facebook : `https://${facebook}`;
  const zaloUrl  = `https://zalo.me/${zalo.replace(/\s/g, "")}`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://www.sonxinchao.com/#localbusiness",
    "name": "Sơn Xin Chào — SEO · Ads · Website",
    "alternateName": "sonxinchao.com",
    "url": "https://www.sonxinchao.com",
    "logo": {
      "@type": "ImageObject",
      "url": logoUrl,
      "width": 600,
      "height": 200
    },
    "image": "https://www.sonxinchao.com/og-image.jpg",
    "description": "Dịch vụ SEO, Google Ads, Facebook Ads và thiết kế website WordPress chuẩn SEO tại Long Thành, Đồng Nai. Phục vụ toàn bộ khu vực TP.HCM và Đông Nam Bộ.",
    "telephone": phoneE164,
    "email": email,
    "founder": {
      "@type": "Person",
      "@id": "https://www.sonxinchao.com/#phandinhson",
      "name": "Phan Đình Sơn"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Long Thành",
      "addressLocality": "Long Thành",
      "addressRegion": "Đồng Nai",
      "postalCode": "810000",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.715759874873848,
      "longitude": 106.98491866208249
    },
    "areaServed": [
      { "@type": "City", "name": "Long Thành" },
      { "@type": "City", "name": "Nhơn Trạch" },
      { "@type": "City", "name": "Biên Hòa" },
      { "@type": "AdministrativeArea", "name": "Đồng Nai" },
      { "@type": "City", "name": "TP. Hồ Chí Minh" },
      { "@type": "City", "name": "Thủ Đức" },
      { "@type": "City", "name": "Bình Dương" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Dịch vụ Digital Marketing",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO Organic", "url": "https://www.sonxinchao.com/dich-vu/seo" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Google Ads", "url": "https://www.sonxinchao.com/dich-vu/google-ads" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Facebook Ads", "url": "https://www.sonxinchao.com/dich-vu/facebook-ads" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Thiết kế Website WordPress", "url": "https://www.sonxinchao.com/dich-vu/thiet-ke-website" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO Local Google Maps", "url": "https://www.sonxinchao.com/dich-vu/seo-local" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "TikTok Ads", "url": "https://www.sonxinchao.com/dich-vu/tiktok-ads" } }
      ]
    },
    "sameAs": [facebookUrl, zaloUrl, "https://www.youtube.com/@hoccungson116"],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "08:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday","Sunday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "currenciesAccepted": "VND",
    "paymentAccepted": "Chuyển khoản, Tiền mặt, MoMo, ZaloPay",
    "priceRange": "₫₫"
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.sonxinchao.com/#phandinhson",
    "name": "Phan Đình Sơn",
    "alternateName": "Son Phan",
    "url": "https://www.sonxinchao.com/gioi-thieu",
    "image": {
      "@type": "ImageObject",
      "url": "https://www.sonxinchao.com/og-image.jpg",
      "width": 1200,
      "height": 630
    },
    "jobTitle": "Digital Marketing Specialist",
    "description": "Chuyên gia SEO, Google Ads, Facebook Ads và thiết kế website WordPress tại Long Thành, Đồng Nai. 3+ năm kinh nghiệm thực chiến, 50+ dự án thành công.",
    "telephone": phoneE164,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Long Thành",
      "addressRegion": "Đồng Nai",
      "addressCountry": "VN"
    },
    "knowsAbout": [
      "SEO", "SEO Onpage", "SEO Local", "Google Ads", "Facebook Ads",
      "TikTok Ads", "WordPress", "WooCommerce", "Digital Marketing",
      "Content Marketing", "Web Analytics", "Google Search Console"
    ],
    "hasCredential": [
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "certificate", "name": "Google Ads Certification" },
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "certificate", "name": "Meta Blueprint Certification" }
    ],
    "worksFor": {
      "@type": "Organization",
      "@id": "https://www.sonxinchao.com/#localbusiness",
      "name": "Sơn Xin Chào"
    },
    "sameAs": [
      facebookUrl,
      "https://www.youtube.com/@hoccungson116",
      "https://www.sonxinchao.com"
    ]
  };

  // Schema định danh tên hiển thị có dấu trên Google
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sơn Xin Chào",
    "alternateName": ["Son Xin Chao", "Sơn Xin Chào SEO"],
    "url": "https://www.sonxinchao.com"
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      
      <Navbar initialItems={menuData} />
      <SearchStrip />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Pricing />
      <Blog />
      <Contact />

      {/* Bản đồ định vị Google Maps chuẩn tọa độ của bạn */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md">
          <iframe 
            src="https://maps.google.com/maps?q=10.715759874873848,106.98491866208249&z=16&output=embed" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="strict-origin-when-cross-origin"
            title="Sơn Xin Chào Google Maps định vị"
          />
        </div>
      </section>

      <Footer />
      <MobileBar />
      <FloatingContacts />
    </main>
  );
}