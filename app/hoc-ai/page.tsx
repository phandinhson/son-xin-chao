import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import SearchStrip from "@/components/SearchStrip";
import Footer from "@/components/Footer";
import HocAiClient from "@/components/HocAiClient"; // Import file giao diện client vừa tạo ở Bước 1

export const revalidate = 3600; // Tĩnh hóa trang này, cache chặt trên CDN trong 1 tiếng

// 1. Hàm fetch videos được cache tại Server
const getCachedVideos = unstable_cache(
  async () => {
    try {
      const db = supabaseAdmin();
      const { data } = await db.from("hoc_ai_videos").select("*"); // Tên table video của bạn
      if (data && data.length > 0) {
        return data.map(v => ({
          id: v.id, title: v.title, channel: v.channel,
          duration: v.duration, views: v.views,
          youtubeId: v.youtube_id,
        }));
      }
    } catch { }
    return []; // Fallback mảng rỗng nếu lỗi
  },
  ["hoc-ai-videos-cache"],
  { revalidate: 3600 }
);

// 2. Hàm fetch tools được cache tại Server
const getCachedTools = unstable_cache(
  async () => {
    try {
      const db = supabaseAdmin();
      const { data } = await db.from("hoc_ai_tools").select("*"); // Tên table tools của bạn
      if (data && data.length > 0) {
        return data.map(t => ({
          name: t.name, desc: t.description, category: t.category,
          badge: t.badge, url: t.url, icon: t.icon, color: t.color,
          hot: t.is_hot, new: t.is_new, tags: Array.isArray(t.tags) ? t.tags : [],
        }));
      }
    } catch { }
    return [];
  },
  ["hoc-ai-tools-cache"],
  { revalidate: 3600 }
);

export default async function HocAiPage() {
  // Fetch song song cả 2 mảng dữ liệu ngay trên Server
  const [videosData, toolsData] = await Promise.all([
    getCachedVideos(),
    getCachedTools(),
  ]);

  return (
    <>
      {/* Sửa dòng này để tránh lỗi TypeScript cho thanh menu */}
      <Navbar initialItems={[]} />
      <SearchStrip />
      {/* Bơm dữ liệu thô đã được cache tĩnh xuống cho Client xử lý */}
      <HocAiClient initialVideos={videosData as any} initialTools={toolsData as any} />
      <Footer />
    </>
  );
}