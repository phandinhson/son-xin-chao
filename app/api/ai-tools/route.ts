import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // không cache — luôn fetch fresh từ DB

// GET public — chỉ lấy tools đang active
export async function GET() {
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("ai_tools")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data ?? [], {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (e) {
    console.error("[/api/ai-tools] error:", e);
    return NextResponse.json([], {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
