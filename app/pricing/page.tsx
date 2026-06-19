import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { getSiteSettings } from "@/lib/get-settings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import FloatingContacts from "@/components/FloatingContacts";
import PricingPageClient from "./PricingPageClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Bảng Giá Dịch Vụ SEO, Google Ads & Marketing | Sơn Xin Chào",
  description:
    "Bảng giá dịch vụ SEO, Google Ads, Facebook Ads và thiết kế website minh bạch, không phí ẩn. Gói Starter từ 3.500.000đ/tháng — cam kết kết quả đo lường được. Tư vấn miễn phí!",
  keywords:
    "bảng giá SEO, giá dịch vụ SEO Long Thành, chi phí Google Ads Đồng Nai, giá thiết kế website, dịch vụ marketing giá rẻ, SEO trọn gói, bảng giá marketing online",
  alternates: {
    canonical: "https://www.sonxinchao.com/pricing",
  },
  openGraph: {
    title: "Bảng Giá Dịch Vụ SEO & Marketing | Sơn Xin Chào",
    description:
      "Giá cả minh bạch, cam kết kết quả. Gói SEO từ 3.5 triệu/tháng — tư vấn miễn phí ngay hôm nay.",
    url: "https://www.sonxinchao.com/pricing",
    type: "website",
  },
};

// ─── FAQ Schema ───────────────────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Chi phí dịch vụ SEO tại Sơn Xin Chào là bao nhiêu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gói SEO Starter bắt đầu từ 3.500.000đ/tháng, gói Growth 7.000.000đ/tháng. Giá tùy thuộc vào quy mô website, mức độ cạnh tranh từ khóa và mục tiêu kinh doanh. Tôi cung cấp tư vấn miễn phí để đề xuất gói phù hợp nhất.",
      },
    },
    {
      "@type": "Question",
      name: "Bao lâu thì SEO lên top Google?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Thông thường 3–6 tháng để thấy kết quả rõ rệt. Tháng đầu tập trung tối ưu kỹ thuật, tháng 2–3 bắt đầu thấy traffic tăng, từ tháng 4–6 từ khóa mục tiêu leo hạng ổn định. Kết quả phụ thuộc vào mức độ cạnh tranh ngành.",
      },
    },
    {
      "@type": "Question",
      name: "Chi phí quảng cáo Google Ads có tính thêm không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Không. Phí tôi thu là phí quản lý & tối ưu chiến dịch. Ngân sách quảng cáo (tiền chạy ads) bạn thanh toán trực tiếp với Google/Facebook — đây là khoản riêng biệt, tôi không giữ lại.",
      },
    },
    {
      "@type": "Question",
      name: "Có cam kết kết quả không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Có. Tôi cam kết báo cáo minh bạch hàng tuần/tháng với số liệu thực: thứ hạng từ khóa, traffic, leads. Nếu sau 3 tháng không có cải thiện rõ rệt, tôi sẽ làm thêm 1 tháng miễn phí.",
      },
    },
    {
      "@type": "Question",
      name: "Hợp đồng tối thiểu bao lâu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hợp đồng theo tháng, không lock dài hạn. Thông báo trước 15 ngày là có thể kết thúc. Tôi tin tưởng vào chất lượng dịch vụ — kết quả tốt là lý do bạn ở lại.",
      },
    },
    {
      "@type": "Question",
      name: "Có thể kết hợp nhiều dịch vụ không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hoàn toàn có thể. Gói Growth đã bao gồm SEO + 1 kênh quảng cáo. Gói Pro tùy chỉnh toàn bộ — SEO, Google Ads, Facebook Ads, website — theo nhu cầu cụ thể của bạn.",
      },
    },
  ],
};

// ─── Fetch data server-side ───────────────────────────────────────────────────
async function getPricingData() {
  try {
    const db = supabaseAdmin();
    const [pricingRes, addonsRes] = await Promise.all([
      db.from("pricing").select("*").order("sort_order"),
      db.from("addons").select("*").eq("active", true).order("sort_order"),
    ]);
    return {
      plans: pricingRes.data || [],
      addons: addonsRes.data || [],
    };
  } catch {
    return { plans: [], addons: [] };
  }
}

export default async function PricingPage() {
  const [{ plans, addons }, s] = await Promise.all([
    getPricingData(),
    getSiteSettings(),
  ]);

  const zalo = s.contact_zalo || "0968806360";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <PricingPageClient plans={plans} addons={addons} zalo={zalo} />
      <Footer />
      <MobileBar />
      <FloatingContacts />
    </>
  );
}
