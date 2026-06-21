import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Công cụ AI hữu ích | Sơn Xin Chào",
  description:
    "Tổng hợp các công cụ AI tốt nhất cho hình ảnh, video, âm thanh và văn phòng. Miễn phí & Freemium — dùng ngay không cần cài đặt.",
  
  // ⚡ TỐI ƯU SEO: Bổ sung canonical URL để Google xác định đúng trang gốc
  alternates: {
    canonical: "https://sonxinchao.com/cong-cu-ai",
  },

  openGraph: {
    title: "Công cụ AI hữu ích — Sơn Xin Chào",
    description:
      "Tổng hợp các công cụ AI tốt nhất cho hình ảnh, video, âm thanh và văn phòng.",
    url: "https://sonxinchao.com/cong-cu-ai",
    siteName: "Sơn Xin Chào",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://kpgtiqepktofdfyxgsbw.supabase.co/storage/v1/object/public/images/_og-cong-cu-ai.jpg",
        width: 1200,
        height: 630,
        alt: "Công cụ AI hữu ích - Sơn Xin Chào",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Công cụ AI hữu ích — Sơn Xin Chào",
    description:
      "Tổng hợp các công cụ AI tốt nhất cho hình ảnh, video, âm thanh và văn phòng.",
    images: [
      "https://kpgtiqepktofdfyxgsbw.supabase.co/storage/v1/object/public/images/_og-cong-cu-ai.jpg",
    ],
  },
};

export default function CongCuAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children; // ⚡ TỐI ƯU: Loại bỏ bớt cặp thẻ Fragment <> </> dư thừa giúp DOM gọn nhẹ hơn
}