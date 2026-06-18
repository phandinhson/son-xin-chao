import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import ContactPageClient from "./ContactPageClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Liên Hệ | Tư Vấn SEO & Digital Marketing Miễn Phí — Sơn Xin Chào",
  description:
    "Liên hệ Phan Đình Sơn để được tư vấn miễn phí về SEO, Google Ads, Facebook Ads và thiết kế Website tại Long Thành, Đồng Nai. Phản hồi trong 2 tiếng. Nhắn Zalo: 0968 806 360.",
  keywords:
    "liên hệ tư vấn SEO, tư vấn digital marketing miễn phí, SEO Long Thành Đồng Nai, Phan Đình Sơn liên hệ, tư vấn Google Ads, thiết kế website Đồng Nai, zalo sơn xin chào",
  alternates: {
    canonical: "https://www.sonxinchao.com/contact",
  },
  openGraph: {
    title: "Liên Hệ Tư Vấn Miễn Phí | Sơn Xin Chào — SEO · Ads · Website",
    description:
      "Tư vấn 30 phút miễn phí, không ràng buộc. Phân tích website thực tế, đề xuất chiến lược phù hợp. Phản hồi trong 2 tiếng qua Zalo.",
    url: "https://www.sonxinchao.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liên Hệ Tư Vấn Miễn Phí | Sơn Xin Chào",
    description:
      "Nhắn Zalo 0968 806 360 — tư vấn miễn phí SEO, Google Ads & thiết kế Website tại Long Thành, Đồng Nai.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Liên hệ — Sơn Xin Chào",
  url: "https://www.sonxinchao.com/contact",
  description: "Trang liên hệ tư vấn dịch vụ SEO, Google Ads, Facebook Ads và thiết kế Website",
  mainEntity: {
    "@type": "LocalBusiness",
    name: "Sơn Xin Chào — Phan Đình Sơn",
    telephone: "+84968806360",
    email: "son@sonxinchao.com",
    url: "https://www.sonxinchao.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Long Thành",
      addressRegion: "Đồng Nai",
      addressCountry: "VN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:00",
        closes: "17:00",
      },
    ],
    sameAs: [
      "https://fb.com/sonxinchao",
      "https://zalo.me/0968806360",
      "https://youtube.com/@sonxinchao",
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <ContactPageClient />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
