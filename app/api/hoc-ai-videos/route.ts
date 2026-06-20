import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const FALLBACK = [
  { id: "v1", title: "ChatGPT Full Tutorial — Dùng AI như Pro từ A đến Z",            youtube_id: "JTxsNm9IdYU", channel: "Sơn Xin Chào", duration: "18:42", views: "12K",  sort_order: 1 },
  { id: "v2", title: "Midjourney V6 — Tạo ảnh AI đẹp không tưởng chỉ trong 5 phút",  youtube_id: "rnIgnS7EKZE", channel: "Sơn Xin Chào", duration: "12:05", views: "8.4K", sort_order: 2 },
  { id: "v3", title: "Suno AI — Tạo bài hát hoàn chỉnh từ 1 câu mô tả",              youtube_id: "kgLklMwdPo4", channel: "Sơn Xin Chào", duration: "9:30",  views: "6.1K", sort_order: 3 },
  { id: "v4", title: "Gamma AI — Tạo slide thuyết trình đẹp chỉ bằng 1 câu",         youtube_id: "9L6v25IKGp8", channel: "Sơn Xin Chào", duration: "7:15",  views: "5.2K", sort_order: 4 },
  { id: "v5", title: "Runway Gen-3 — AI tạo video điện ảnh chuyên nghiệp",            youtube_id: "GJfSTy0FZNE", channel: "Sơn Xin Chào", duration: "14:20", views: "4.8K", sort_order: 5 },
  { id: "v6", title: "Perplexity AI — Công cụ nghiên cứu thay thế Google Search",     youtube_id: "H73nvMIKPR8", channel: "Sơn Xin Chào", duration: "11:08", views: "3.9K", sort_order: 6 },
];

export async function GET() {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("hoc_ai_videos")
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
