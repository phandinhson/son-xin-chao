import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const FALLBACK = [
  { id: "t1",  name: "ChatGPT",      description: "Trợ lý AI đa năng nhất thế giới.", category: "Học tập",        badge: "Freemium", url: "https://chatgpt.com",                  icon: "🤖", color: "#10a37f", is_hot: true,  is_new: false, tags: ["Trợ lý","Viết"],           sort_order: 1 },
  { id: "t2",  name: "Perplexity AI",description: "Công cụ nghiên cứu thông minh.",   category: "Học tập",        badge: "Freemium", url: "https://perplexity.ai",                icon: "🔬", color: "#1fb8cd", is_hot: true,  is_new: false, tags: ["Nghiên cứu","Search"],     sort_order: 2 },
  { id: "t3",  name: "Midjourney",   description: "Tạo ảnh nghệ thuật chất lượng cao.",category:"Thiết kế & Ảnh", badge: "Trả phí",  url: "https://midjourney.com",               icon: "🎨", color: "#e11d48", is_hot: true,  is_new: false, tags: ["Text-to-image"],           sort_order: 3 },
  { id: "t4",  name: "Runway Gen-3", description: "Tạo và chỉnh sửa video bằng AI.",  category: "Video & Film",   badge: "Freemium", url: "https://runwayml.com",                 icon: "🎬", color: "#ef4444", is_hot: true,  is_new: false, tags: ["Text-to-video"],           sort_order: 4 },
  { id: "t5",  name: "Suno AI",      description: "Tạo bài nhạc hoàn chỉnh từ vài từ.",category:"Âm thanh",      badge: "Freemium", url: "https://suno.com",                     icon: "🎵", color: "#ec4899", is_hot: true,  is_new: false, tags: ["Nhạc","Sáng tác"],         sort_order: 5 },
  { id: "t6",  name: "GitHub Copilot",description:"AI viết code trong VSCode.",        category: "Lập trình",      badge: "Trả phí",  url: "https://github.com/features/copilot",  icon: "👨‍💻",color: "#24292e", is_hot: true,  is_new: false, tags: ["VSCode","Code"],           sort_order: 6 },
];

export async function GET() {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("hoc_ai_tools")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return NextResponse.json(FALLBACK);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
