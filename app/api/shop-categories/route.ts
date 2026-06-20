import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("shop_categories")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    // Graceful fallback — trả về danh mục mặc định nếu bảng chưa tồn tại
    return NextResponse.json([
      { id: "1", name: "Dịch vụ SEO",     icon: "🔍", color: "#0ea5e9", bg: "#e0f2fe" },
      { id: "2", name: "Chạy quảng cáo",  icon: "📣", color: "#f97316", bg: "#fff7ed" },
      { id: "3", name: "Thiết kế website", icon: "💻", color: "#10b981", bg: "#ecfdf5" },
      { id: "4", name: "Tư vấn",          icon: "💬", color: "#8b5cf6", bg: "#f5f3ff" },
      { id: "5", name: "Khác",            icon: "📦", color: "#f59e0b", bg: "#fffbeb" },
    ]);
  }

  return NextResponse.json(data || [], {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
