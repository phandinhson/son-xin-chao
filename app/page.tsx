import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/get-settings";
import { supabaseAdmin } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Pricing from "@/components/Pricing";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import FloatingContacts from "@/components/FloatingContacts";
import SearchStrip from "@/components/SearchStrip";
import { unstable_cache } from "next/cache";
// Revalidate mỗi 5 phút — đảm bảo schema luôn sync với admin panel
export const revalidate = 300;

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.sonxinchao.com",
  },
};

export default async function Home() {
  // getSiteSettings() dùng React.cache() → share với layout.tsx, không query DB lần 2
  const s = await getSiteSettings();

  // Fetch tất cả data homepage song song — 1 lần duy nhất từ server
  const db = supabaseAdmin();
  const getCachedNavItems = unstable_cache(
  async () => {
    try {
      const db = supabaseAdmin();
      const { data } = await db.from("nav_items").select("*").eq("active", true); 
      if (data && data.length > 0) return data;
    } catch (e) {
      console.error("Lỗi fetch menu trang chủ:", e);
    }
    return []; // Trả về mảng rỗng để Navbar tự kích hoạt FALLBACK_ITEMS
  },
  ["navbar-menu-cache"],
  { revalidate: 300 } // Thống nhất 5 phút (300s) giống revalidate của trang chủ bạn đang đặt
);
  // Thêm menuRes vào mảng nhận kết quả trả về
  const [postsRes, portfolioRes, pricingRes, addonsRes, menuData] = await Promise.all([
    db.from("posts").select("id, title, slug, excerpt, cover_image, created_at, category").eq("status", "published").order("created_at", { ascending: false }),
    db.from("portfolio").select("*").eq("active", true).order("sort_order"),
    db.from("pricing").select("*").order("sort_order"),
    db.from("addons").select("*").eq("active", true).order("sort_order", { ascending: true }),
    getCachedNavItems(), // <--- Thêm dòng này vào cuối
  ]);
  const initialPosts     = postsRes.data     || [];
  const initialPortfolio = portfolioRes.data || [];
  const initialPricing   = pricingRes.data   || [];
  const initialAddons    = addonsRes.data    || [];

  // Giá trị dynamic từ admin panel, fallback về mặc định
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
    "name": "Sơn Xin Chào — SEO · Ads · Website",
    "alternateName": "sonxinchao.com",
    "url": "https://www.sonxinchao.com",
    // logo phải là PNG/JPG — Google Schema không nhận SVG
    "logo": logoUrl,
    "image": "https://www.sonxinchao.com/og-image.jpg",
    "description": "Dịch vụ SEO, Google Ads, Facebook Ads và thiết kế website WordPress chuẩn SEO tại Long Thành, Đồng Nai. Phục vụ toàn bộ khu vực TP.HCM và Đông Nam Bộ.",
    "telephone": phoneE164,
    "email": email,
    "founder": {
      "@type": "Person",
      "name": "Phan Đình Sơn",
      "jobTitle": "Digital Marketing Specialist"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Long Thành",
      "addressLocality": "Long Thành",
      "addressRegion": "Đồng Nai",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "10.8009",
      "longitude": "107.0391"
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
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO Organic" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Google Ads" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Facebook Ads" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Thiết kế Website WordPress" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO Local" } }
      ]
    },
    "sameAs": [facebookUrl, zaloUrl],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "08:00",
      "closes": "21:00"
    },
    "priceRange": "₫₫"
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navbar initialItems={menuData} />
      <SearchStrip />
      <Hero />
      <About />
      <Services />
      <Portfolio initialItems={initialPortfolio} />
      <Pricing initialPlans={initialPricing} initialAddons={initialAddons} />
      <Blog initialPosts={initialPosts} />
      <Contact />
      <Footer />
      <MobileBar />
      <FloatingContacts />
    </main>
  );
}
